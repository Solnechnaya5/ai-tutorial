// Запускає код учня в Pyodide (Python у браузері) окремо від сторінки,
// щоб нескінченний цикл не підвішував вкладку: сторінка просто зупиняє цей worker.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

var HARNESS = String.raw`
import ast
import base64
import copy
import inspect
import io
import json
import os
import re
import sys
import traceback
from types import SimpleNamespace

_LLM = {}

# У worker немає сторінки, тож графіки малюємо в пам'яті й віддаємо картинками
os.environ["MPLBACKEND"] = "Agg"


def _close_figures():
    plt = sys.modules.get("matplotlib.pyplot")
    if plt is not None:
        plt.close("all")


def _collect_figures():
    plt = sys.modules.get("matplotlib.pyplot")
    if plt is None:
        return []
    images = []
    for number in plt.get_fignums()[:4]:
        buffer = io.BytesIO()
        plt.figure(number).savefig(buffer, format="png", dpi=80, bbox_inches="tight")
        images.append(base64.b64encode(buffer.getvalue()).decode())
    return images

_SEED = """
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, city TEXT, age INTEGER);
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER, status TEXT);
INSERT INTO users VALUES (1, 'Yulia', 'Kyiv', 28), (2, 'Oleh', 'Lviv', 31), (3, 'Iryna', 'Kyiv', 24);
INSERT INTO orders VALUES (1, 1, 500, 'paid'), (2, 1, 1200, 'paid'), (3, 2, 300, 'new');
"""


def _fake_input(prompt=""):
    raise RuntimeError("У задачах input() не працює. Дані вже лежать у змінних на початку коду.")


def run_sql(query):
    """Виконує запит на навчальній базі з таблицями users та orders і повертає рядки."""
    import sqlite3

    connection = sqlite3.connect(":memory:")
    try:
        connection.executescript(_SEED)
        return connection.execute(query).fetchall()
    finally:
        connection.close()


class FakeClient:
    """Підставна модель з тим самим інтерфейсом, що й client.messages.create в Anthropic SDK.

    responses — список відповідей по черзі: рядок (текст), словник {"tool": назва, "input": {...}}
    (модель просить інструмент) або виняток (його буде кинуто).
    """

    def __init__(self, responses, repeat=False):
        self._responses = list(responses)
        self._repeat = repeat
        self.calls = []
        self.messages = SimpleNamespace(create=self._create)

    def _create(self, **kwargs):
        self.calls.append(copy.deepcopy(kwargs))
        if not self._responses:
            raise RuntimeError("FakeClient: заготовлені відповіді закінчилися")
        keep = self._repeat and len(self._responses) == 1
        item = self._responses[0] if keep else self._responses.pop(0)
        if isinstance(item, BaseException):
            raise item
        usage = SimpleNamespace(input_tokens=10, output_tokens=5)
        if isinstance(item, dict):
            block = SimpleNamespace(
                type="tool_use", id=f"toolu_{len(self.calls)}", name=item["tool"], input=item.get("input", {})
            )
            return SimpleNamespace(content=[block], stop_reason="tool_use", usage=usage)
        block = SimpleNamespace(type="text", text=str(item))
        return SimpleNamespace(content=[block], stop_reason="end_turn", usage=usage)


def ask_model(prompt, system="", history=None, max_tokens=300, temperature=None):
    """Справжній запит до моделі ключем учня. Повертає текст відповіді."""
    key = _LLM.get("key")
    if not key:
        raise RuntimeError("Немає ключа API. Додай його в меню, у розділі «Ключ API».")
    from js import XMLHttpRequest

    messages = list(history or []) + [{"role": "user", "content": prompt}]
    if key.startswith("sk-ant-"):
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
        }
        body = {"model": _LLM.get("model") or "claude-haiku-4-5", "max_tokens": max_tokens, "messages": messages}
        if system:
            body["system"] = system
    else:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {key}"}
        if system:
            messages = [{"role": "system", "content": system}] + messages
        body = {
            "model": _LLM.get("model") or "gpt-4o-mini",
            "max_completion_tokens": max_tokens,
            "messages": messages,
        }
    if temperature is not None:
        body["temperature"] = temperature

    request = XMLHttpRequest.new()
    request.open("POST", url, False)
    request.setRequestHeader("content-type", "application/json")
    for name, value in headers.items():
        request.setRequestHeader(name, value)
    try:
        request.send(json.dumps(body))
    except Exception:
        raise RuntimeError("Не вдалося з'єднатися із сервером моделі. Перевір інтернет.") from None

    try:
        data = json.loads(str(request.responseText))
    except ValueError:
        data = {}
    if request.status != 200:
        hints = {401: "ключ неправильний", 403: "ключ не має доступу", 404: "немає такої моделі", 429: "перевищено ліміт або закінчився баланс"}
        detail = (data.get("error") or {}).get("message", "")
        raise RuntimeError(f"Модель відповіла помилкою {request.status} ({hints.get(request.status, 'дивись текст')}): {detail}")
    if "content" in data:
        return "".join(block.get("text", "") for block in data["content"] if block.get("type") == "text")
    return data["choices"][0]["message"]["content"] or ""


def _describe(error):
    if isinstance(error, SyntaxError):
        return f"Рядок {error.lineno}: SyntaxError: {error.msg}"
    if "asyncio.run() cannot be called" in str(error) or "event loop is already running" in str(error):
        return "У браузері asyncio.run() не працює. Напиши просто «await main()» на верхньому рівні."
    line = None
    for frame in traceback.extract_tb(error.__traceback__):
        if frame.filename == "task.py":
            line = frame.lineno
    where = f"Рядок {line}: " if line else ""
    return f"{where}{type(error).__name__}: {error}"


def _namespace():
    return {
        "__name__": "__main__",
        "input": _fake_input,
        "ask_model": ask_model,
        "run_sql": run_sql,
        "FakeClient": FakeClient,
    }


def _execute_sync(code):
    namespace = _namespace()
    buffer = io.StringIO()
    stdout = sys.stdout
    sys.stdout = buffer
    error = None
    try:
        exec(compile(code, "task.py", "exec"), namespace)
    except BaseException as exc:
        error = _describe(exc)
    finally:
        sys.stdout = stdout
    return namespace, buffer.getvalue(), error


async def _execute(code):
    """Як _execute_sync, але дозволяє await на верхньому рівні коду."""
    namespace = _namespace()
    buffer = io.StringIO()
    stdout = sys.stdout
    sys.stdout = buffer
    error = None
    try:
        result = eval(compile(code, "task.py", "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT), namespace)
        if inspect.isawaitable(result):
            await result
    except BaseException as exc:
        error = _describe(exc)
    finally:
        sys.stdout = stdout
    return namespace, buffer.getvalue(), error


async def _run(code, tests, llm_json="{}"):
    _LLM.clear()
    _LLM.update(json.loads(llm_json))
    _close_figures()
    namespace, out, error = await _execute(code)
    result = {"out": out[:5000], "error": error, "passed": None, "message": "", "images": []}
    try:
        result["images"] = _collect_figures()
    except Exception:
        pass
    if error is None and tests:

        def _rerun(**values):
            source = code
            for name, value in values.items():
                source, found = re.subn(
                    rf"^{name}\s*=.*$", lambda _: f"{name} = {value!r}", source, count=1, flags=re.M
                )
                assert found, f"Не видаляй рядок, де задається змінна {name}"
            other, other_out, other_error = _execute_sync(source)
            assert other_error is None, f"З іншими даними ({values}) код падає: {other_error}"
            other["_out"] = other_out
            other["_lines"] = other_out.strip().splitlines()
            return other

        namespace.update(_out=out, _lines=out.strip().splitlines(), _code=code, _rerun=_rerun)
        try:
            checked = eval(compile(tests, "tests.py", "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT), namespace)
            if inspect.isawaitable(checked):
                await checked
            result["passed"] = True
        except AssertionError as exc:
            result["passed"] = False
            result["message"] = str(exc) or "Результат не збігається з очікуваним"
        except NameError as exc:
            result["passed"] = False
            result["message"] = f"Не знайдено «{exc.name}». Перевір, чи так названо змінну або функцію."
        except Exception as exc:
            result["passed"] = False
            result["message"] = f"Під час перевірки сталася помилка: {type(exc).__name__}: {exc}"
    return json.dumps(result)
`;

var ready = loadPyodide().then(function (pyodide) {
  pyodide.runPython(HARNESS);
  return pyodide;
});

ready.then(
  function () { postMessage({ ready: true }); },
  function (error) { postMessage({ ready: false, error: String(error) }); }
);

onmessage = function (event) {
  var data = event.data;
  var tests = data.tests || "";
  ready.then(function (pyodide) {
    // sqlite3 не входить у базовий набір Pyodide, довантажуємо лише для задач із SQL.
    // numpy, pandas, matplotlib, scikit-learn довантажуються за імпортами в коді.
    var extra = /sqlite3|run_sql/.test(data.code + tests) ? pyodide.loadPackage("sqlite3") : Promise.resolve();
    return extra.then(function () {
      return pyodide.loadPackagesFromImports(data.code + "\n" + tests).catch(function () {});
    }).then(function () {
      return pyodide.globals.get("_run")(data.code, tests, JSON.stringify(data.llm || {}));
    });
  }).then(
    function (json) { postMessage({ id: data.id, result: JSON.parse(json) }); },
    function (error) {
      postMessage({ id: data.id, result: { out: "", error: "Не вдалося запустити код: " + error, passed: null, message: "" } });
    }
  );
};
