// Додаткові задачі до тем 17, 19, 20 і 23. Складність зростає від задачі до задачі.
(function () {
  var py = String.raw;

  function task(title, text, starter, tests) {
    return { title: title, text: text, starter: starter.replace(/^\n/, ""), tests: tests, llm: false };
  }

  var more = {
    17: [
      task("Конфіг із файлу",
        "Напиши <code>load_config(path)</code>: читає JSON-файл і повертає словник. Файлу немає — порожній словник. Файл зламаний — <code>ValueError(\"Broken config\")</code>.",
        py`
import json

# your code here


with open("config.json", "w", encoding="utf-8") as file:
    file.write('{"model": "small", "temperature": 0.2}')
print(load_config("config.json"))
`,
        py`
with open("_c.json", "w", encoding="utf-8") as _f:
    _f.write('{"model": "small", "max_tokens": 500}')
assert load_config("_c.json") == {"model": "small", "max_tokens": 500}
assert load_config("_none.json") == {}, "Для неіснуючого файлу — {}"
with open("_bad.json", "w", encoding="utf-8") as _f:
    _f.write("{model: small")
try:
    load_config("_bad.json")
except ValueError as _error:
    assert "Broken config" in str(_error), f"Текст помилки: {_error}"
else:
    raise AssertionError("Для зламаного файлу очікую ValueError")
`),
      task("Збереження з відступами",
        "Напиши <code>save_json(path, data)</code>: зберігає дані з відступом 2, кирилицею без кодування і переносом рядка в кінці файлу.",
        py`
import json

# your code here


save_json("user.json", {"name": "Yulia", "skills": ["python"]})
print(open("user.json", encoding="utf-8").read())
`,
        py`
import json as _json
_data = {"name": "Yulia", "skills": ["python", "sql"], "active": True}
save_json("_s.json", _data)
with open("_s.json", encoding="utf-8") as _f:
    _text = _f.read()
assert _text == _json.dumps(_data, ensure_ascii=False, indent=2) + "\n", f"У файлі:\n{_text}"
`),
      task("Тексти з відповіді API",
        "Відповідь у форматі OpenAI приходить рядком JSON. Напиши <code>extract_texts(raw)</code>: список текстів з усіх <code>choices</code>. Варіанти без тексту пропускай.",
        py`
import json

# your code here


raw = '{"choices": [{"message": {"content": "Hello"}}, {"message": {"content": "Hi"}}]}'
print(extract_texts(raw))
`,
        py`
_raw = '{"id": "1", "choices": [{"message": {"role": "assistant", "content": "A"}}, {"message": {"role": "assistant", "content": null}}, {"message": {}}, {"message": {"content": "B"}}]}'
assert extract_texts(_raw) == ["A", "B"], f"Вийшло {extract_texts(_raw)!r}"
assert extract_texts('{"choices": []}') == []
`),
      task("Файл JSON Lines",
        "У форматі JSONL кожен рядок — окремий JSON. Напиши <code>read_jsonl(path)</code>: повертає (список записів, кількість зламаних рядків). Порожні рядки пропускай.",
        py`
import json

# your code here


with open("events.jsonl", "w", encoding="utf-8") as file:
    file.write('{"event": "login"}\n\n{broken\n{"event": "logout"}\n')
print(read_jsonl("events.jsonl"))
`,
        py`
with open("_e.jsonl", "w", encoding="utf-8") as _f:
    _f.write('{"event": "login", "user": 1}\n\n{broken\n{"event": "logout"}\n   \n[1, 2\n')
assert read_jsonl("_e.jsonl") == ([{"event": "login", "user": 1}, {"event": "logout"}], 2), f"Вийшло {read_jsonl('_e.jsonl')!r}"
`),
      task("Витрати за моделями",
        "Кожен рядок логу — JSON з полями model, input_tokens, output_tokens. Напиши <code>usage_by_model(lines)</code>: словник модель → {\"requests\": кількість, \"tokens\": сума всіх токенів}.",
        py`
import json

# your code here


lines = [
    '{"model": "small", "input_tokens": 100, "output_tokens": 20}',
    '{"model": "large", "input_tokens": 900, "output_tokens": 300}',
    '{"model": "small", "input_tokens": 50, "output_tokens": 10}',
]
print(usage_by_model(lines))
`,
        py`
_lines = [
    '{"model": "small", "input_tokens": 100, "output_tokens": 20}',
    '{"model": "large", "input_tokens": 900, "output_tokens": 300}',
    '{"model": "small", "input_tokens": 50, "output_tokens": 10}',
]
assert usage_by_model(_lines) == {"small": {"requests": 2, "tokens": 180}, "large": {"requests": 1, "tokens": 1200}}, f"Вийшло {usage_by_model(_lines)!r}"
assert usage_by_model([]) == {}
`),
      task("Нестандартні типи",
        "<code>json.dumps</code> не вміє множини й дати. Напиши <code>to_json(data)</code> з параметром <code>default=</code>: множина стає відсортованим списком, <code>datetime</code> — рядком <code>isoformat()</code>, інше — <code>TypeError</code>.",
        py`
import json
from datetime import datetime

# your code here


print(to_json({"tags": {"rag", "ai"}, "created": datetime(2026, 10, 5, 14, 30)}))
`,
        py`
from datetime import datetime as _dt
import json as _json
_text = to_json({"tags": {"rag", "ai"}, "created": _dt(2026, 10, 5, 14, 30), "n": 1})
assert _json.loads(_text) == {"tags": ["ai", "rag"], "created": "2026-10-05T14:30:00", "n": 1}, f"Вийшло {_text}"
try:
    to_json({"x": object()})
except TypeError:
    pass
else:
    raise AssertionError("Для невідомого типу очікую TypeError")
`),
      task("Перевірка відповіді моделі за схемою",
        "Напиши <code>validate(data, schema)</code>. Схема — словник поле → тип. Повертає список помилок у такому порядку: спершу «missing field X» за порядком схеми, потім «field X: expected str, got int», потім «extra field X» за порядком у даних.",
        py`
SCHEMA = {"sentiment": str, "score": float, "tags": list}

# your code here


print(validate({"sentiment": "positive", "score": 0.9, "tags": []}, SCHEMA))
print(validate({"sentiment": 1, "extra": True}, SCHEMA))
`,
        py`
_schema = {"sentiment": str, "score": float, "tags": list}
assert validate({"sentiment": "positive", "score": 0.9, "tags": ["a"]}, _schema) == []
_got = validate({"sentiment": 1, "tags": "a", "extra": True, "debug": 1}, _schema)
assert _got == ["missing field score", "field sentiment: expected str, got int", "field tags: expected list, got str", "extra field extra", "extra field debug"], f"Вийшло {_got!r}"
`),
    ],

    19: [
      task("Усі email з тексту",
        "Напиши <code>extract_emails(text)</code>: email у нижньому регістрі, без повторів, у порядку появи.",
        py`
import re

# your code here


print(extract_emails("Write to Info@Shop.ua or support@shop.ua, copy — info@shop.ua."))
`,
        py`
_text = "Write to Info@Shop.ua or support@shop.ua, copy — info@shop.ua. Also: a.b-c@mail.co.uk!"
assert extract_emails(_text) == ["info@shop.ua", "support@shop.ua", "a.b-c@mail.co.uk"], f"Вийшло {extract_emails(_text)!r}"
assert extract_emails("no addresses") == []
`),
      task("Маскування телефонів",
        "Напиши <code>mask_phones(text)</code>: кожен номер <code>+380XXXXXXXXX</code> замінюється на <code>+380*******XX</code> — лишаються дві останні цифри.",
        py`
import re

# your code here


print(mask_phones("Call: +380501234567 or +380671112233"))
`,
        py`
assert mask_phones("Call: +380501234567 or +380671112233") == "Call: +380*******67 or +380*******33"
assert mask_phones("no number here") == "no number here"
assert mask_phones("+38050123456") == "+38050123456", "Неповний номер не чіпай"
`),
      task("Тривалість",
        "Напиши <code>parse_duration(text)</code>: «1h30m15s» → секунди. Кожна частина необов'язкова, але порядок h, m, s. Порожній або неправильний рядок — <code>ValueError</code>.",
        py`
import re

# your code here


print(parse_duration("1h30m15s"))
`,
        py`
for _text, _expected in [("1h30m15s", 5415), ("45m", 2700), ("2h", 7200), ("90s", 90), ("1h5s", 3605)]:
    assert parse_duration(_text) == _expected, f"Для {_text!r} очікую {_expected}, а вийшло {parse_duration(_text)!r}"
for _bad in ("", "abc", "5m1h", "10"):
    try:
        parse_duration(_bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"Для {_bad!r} очікую ValueError")
`),
      task("Посилання з тексту",
        "Напиши <code>extract_urls(text)</code>: усі адреси http і https. Розділові знаки в кінці («.», «,», «)», «!») до адреси не належать.",
        py`
import re

# your code here


print(extract_urls("Docs: https://docs.python.org/3/library/re.html. Also (http://example.com)!"))
`,
        py`
_text = "Docs: https://docs.python.org/3/library/re.html. Also (http://example.com)! And https://a.ua/x?q=1&p=2, ftp://no.com"
assert extract_urls(_text) == ["https://docs.python.org/3/library/re.html", "http://example.com", "https://a.ua/x?q=1&p=2"], f"Вийшло {extract_urls(_text)!r}"
`),
      task("Іменовані групи",
        "Напиши <code>parse_log(line)</code> з іменованими групами <code>(?P&lt;name&gt;...)</code>: повертає словник date, time, level, message або <code>None</code>. Рівень — тільки великі літери.",
        py`
import re

# your code here


print(parse_log("2026-10-05 14:32:10 [ERROR] Card declined"))
`,
        py`
assert parse_log("2026-10-05 14:32:10 [ERROR] Card declined by bank") == {"date": "2026-10-05", "time": "14:32:10", "level": "ERROR", "message": "Card declined by bank"}
assert parse_log("2026-10-05 14:32:10 [error] x") is None, "Рівень — лише великі літери"
assert parse_log("some text") is None
assert "?P<" in _code, "Використай іменовані групи"
`),
      task("Код із відповіді моделі",
        "Модель загортає код у блоки з трьох зворотних лапок, інколи з назвою мови після них. Напиши <code>extract_code_blocks(answer)</code>: список вмісту всіх блоків без зайвих порожніх рядків по краях.",
        py`
import re

# your code here


fence = "\x60\x60\x60"
answer = f"Here is the solution:\n{fence}python\nprint('hi')\n{fence}\nAnd also:\n{fence}\nx = 1\n{fence}"
print(extract_code_blocks(answer))
`,
        py`
_f = "\x60\x60\x60"
_answer = f"Text\n{_f}python\nimport os\nprint(os.getcwd())\n{_f}\nbetween blocks\n{_f}sql\nSELECT 1;\n{_f}\n{_f}\n\nx = 1\n\n{_f}"
assert extract_code_blocks(_answer) == ["import os\nprint(os.getcwd())", "SELECT 1;", "x = 1"], f"Вийшло {extract_code_blocks(_answer)!r}"
assert extract_code_blocks("no code") == []
`),
      task("Slug регулярним виразом",
        "Напиши <code>slugify(text)</code>: малі літери, будь-яка послідовність символів, що не є літерою чи цифрою (і підкреслення теж), стає одним дефісом, дефіси по краях прибрано.",
        py`
import re

# your code here


print(slugify("Hello, World! How are you?"))
`,
        py`
for _text, _expected in [("Hello, World! How are you?", "hello-world-how-are-you"), ("  RAG__in 2026 — review ", "rag-in-2026-review"), ("---", "")]:
    assert slugify(_text) == _expected, f"Для {_text!r} очікую {_expected!r}, а вийшло {slugify(_text)!r}"
`),
    ],

    20: [
      task("Конвеєр обробки",
        "Напиши <code>apply_pipeline(value, steps)</code>: застосовує функції зі списку по черзі, результат кожної передає наступній.",
        py`
# your code here


steps = [str.strip, str.lower, lambda s: s.replace(" ", "-")]
print(apply_pipeline("  Hello World ", steps))
`,
        py`
assert apply_pipeline("  Hello World ", [str.strip, str.lower, lambda s: s.replace(" ", "-")]) == "hello-world"
assert apply_pipeline(3, [lambda x: x + 1, lambda x: x * 10]) == 40
assert apply_pipeline("same", []) == "same"
`),
      task("Групування за ключем",
        "Напиши <code>group_by(items, key)</code>: словник результат функції <code>key</code> → список елементів у порядку появи.",
        py`
# your code here


print(group_by(["apple", "avocado", "banana", "cherry", "blueberry"], lambda w: w[0]))
`,
        py`
assert group_by(["apple", "avocado", "banana", "cherry", "blueberry"], lambda w: w[0]) == {"a": ["apple", "avocado"], "b": ["banana", "blueberry"], "c": ["cherry"]}
_orders = [{"id": 1, "status": "paid"}, {"id": 2, "status": "new"}, {"id": 3, "status": "paid"}]
assert group_by(_orders, lambda o: o["status"]) == {"paid": [_orders[0], _orders[2]], "new": [_orders[1]]}
`),
      task("Власний кеш",
        "Напиши декоратор <code>memoize</code> без <code>functools.lru_cache</code>: результат для тих самих позиційних аргументів рахується лише раз. Збережи ім'я функції через <code>functools.wraps</code>.",
        py`
import functools

# your code here


@memoize
def slow_square(x):
    print(f"computing {x}")
    return x * x

print(slow_square(4), slow_square(4))
`,
        py`
_calls = []
@memoize
def _f(a, b):
    _calls.append((a, b))
    return a + b
assert _f(1, 2) == 3 and _f(1, 2) == 3 and _f(2, 1) == 3
assert _calls == [(1, 2), (2, 1)], f"Виклики справжньої функції: {_calls}"
assert _f.__name__ == "_f", "Збережи ім'я через functools.wraps"
assert "lru_cache" not in _code
`),
      task("Журнал викликів",
        "Напиши декоратор <code>log_calls</code>: перед кожним викликом додає в глобальний список <code>CALLS</code> кортеж (ім'я функції, args, kwargs), повертає результат функції без змін.",
        py`
import functools

CALLS = []

# your code here


@log_calls
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}"

print(greet("Yulia", greeting="Hi"))
print(CALLS)
`,
        py`
CALLS.clear()
@log_calls
def _add(a, b=0):
    return a + b
assert _add(1, b=2) == 3 and _add(5) == 5
assert CALLS == [("_add", (1,), {"b": 2}), ("_add", (5,), {})], f"CALLS: {CALLS}"
assert _add.__name__ == "_add"
`),
      task("Декоратор з параметрами",
        "Напиши <code>retry(times, exceptions=(Exception,))</code>: повторює виклик, якщо виникла одна з указаних помилок. Інші помилки пропускає одразу. Після останньої невдалої спроби пропускає помилку далі.",
        py`
import functools

# your code here


@retry(times=3, exceptions=(ConnectionError,))
def call_api():
    return "ok"

print(call_api())
`,
        py`
_n = []
@retry(times=3, exceptions=(ConnectionError,))
def _flaky():
    _n.append(1)
    if len(_n) < 3:
        raise ConnectionError("failure")
    return "ok"
assert _flaky() == "ok" and len(_n) == 3
_n.clear()
@retry(times=2, exceptions=(ConnectionError,))
def _always():
    _n.append(1)
    raise ConnectionError("again")
try:
    _always()
except ConnectionError:
    pass
else:
    raise AssertionError("Після всіх спроб помилку треба пропустити далі")
assert len(_n) == 2, "Спроб має бути рівно times"
_n.clear()
@retry(times=5, exceptions=(ConnectionError,))
def _bug():
    _n.append(1)
    raise KeyError("x")
try:
    _bug()
except KeyError:
    pass
assert len(_n) == 1, "Помилки, яких немає в exceptions, не повторюються"
`),
      task("Обмежувач частоти",
        "Напиши <code>make_rate_limiter(max_calls, period, clock=time.monotonic)</code>: повертає функцію <code>allow()</code>, яка каже, чи можна зробити ще один запит за останні <code>period</code> секунд. <code>clock</code> передають, щоб у тестах керувати часом.",
        py`
import time

# your code here


allow = make_rate_limiter(2, 60)
print(allow(), allow(), allow())
`,
        py`
_now = [0.0]
_allow = make_rate_limiter(2, 10, clock=lambda: _now[0])
assert [_allow(), _allow(), _allow()] == [True, True, False], "Третій виклик у межах періоду — False"
_now[0] = 9.9
assert _allow() is False
_now[0] = 10.1
assert _allow() is True, "Через period секунд після перших викликів місця звільняються"
assert _allow() is True and _allow() is False, "Після звільнення знову доступно рівно max_calls викликів"
_other = make_rate_limiter(1, 5, clock=lambda: _now[0])
assert _other() is True, "У кожного обмежувача свій стан"
`),
      task("Кеш із терміном життя",
        "Напиши декоратор із параметрами <code>cache_with_ttl(ttl, clock=time.monotonic)</code>: результат зберігається <code>ttl</code> секунд, потім рахується знову. Так кешують відповіді API, які застарівають.",
        py`
import functools
import time

# your code here


@cache_with_ttl(ttl=60)
def get_rate(currency):
    print("calling the API")
    return 41.5

print(get_rate("USD"), get_rate("USD"))
`,
        py`
_now = [0.0]
_calls = []
@cache_with_ttl(ttl=10, clock=lambda: _now[0])
def _rate(cur):
    _calls.append(cur)
    return len(_calls)
assert _rate("USD") == 1 and _rate("USD") == 1, "У межах ttl — значення з кешу"
assert _rate("EUR") == 2, "Інший аргумент — окремий запис"
_now[0] = 10.5
assert _rate("USD") == 3, "Після ttl значення рахується знову"
assert _rate("USD") == 3
assert _calls == ["USD", "EUR", "USD"], f"Виклики: {_calls}"
assert _rate.__name__ == "_rate"
`),
    ],

    23: [
      task("Тест з набором випадків",
        "Напиши <code>test_slugify()</code>: список пар (вхід, очікуване) щонайменше з чотирьох випадків і цикл з <code>assert</code>. Так у pytest роблять через <code>parametrize</code>.",
        py`
def slugify(text):
    return "-".join(text.lower().split())


# your code here


test_slugify()
print("All tests passed")
`,
        py`
assert callable(test_slugify)
assert _lines and _lines[-1] == "All tests passed"
assert "for " in _code, "Перебери випадки циклом"
_real = slugify
for _broken in (lambda t: t.lower(), lambda t: "-".join(t.split()), lambda t: t.lower().replace(" ", "-")):
    globals()["slugify"] = _broken
    try:
        test_slugify()
    except AssertionError:
        pass
    else:
        globals()["slugify"] = _real
        raise AssertionError("Тест пропустив зламану версію. Додай випадки з великими літерами і кількома пробілами поспіль")
globals()["slugify"] = _real
`),
      task("Межові значення",
        "Знижка: від 1000 грн — 5%, від 5000 — 10%. Тести внизу падають саме на межах. Виправ <code>discount</code>, тести не змінюй.",
        py`
def discount(total):
    if total > 5000:
        return total * 0.10
    if total > 1000:
        return total * 0.05
    return 0


assert discount(999) == 0
assert discount(1000) == 50
assert discount(4000) == 200
assert discount(5000) == 500
assert discount(10000) == 1000
print("All tests passed")
`,
        py`
assert discount(1000) == 50 and discount(5000) == 500 and discount(999) == 0
assert "assert discount(5000) == 500" in _code, "Не видаляй тести"
`),
      task("Лог з контекстом",
        "Напиши <code>process_orders(orders)</code>: повертає кількість успішно оброблених. Для замовлення без email — <code>logger.warning</code> з його id. Якщо <code>int(order[\"qty\"])</code> падає — <code>logger.exception</code> з id (він сам додасть traceback) і перехід до наступного.",
        py`
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("orders")


def process_orders(orders):
    # your code here
    pass


print(process_orders([{"id": 1, "email": "a@x.com", "qty": "2"}, {"id": 2, "qty": "1"}, {"id": 3, "email": "b@x.com", "qty": "x"}]))
`,
        py`
import logging as _logging

class _Catch(_logging.Handler):
    def __init__(self):
        super().__init__()
        self.records = []
    def emit(self, record):
        self.records.append(record)

_h = _Catch()
_logger = _logging.getLogger("orders")
_logger.addHandler(_h)
try:
    _count = process_orders([{"id": 1, "email": "a@x.com", "qty": "2"}, {"id": 2, "qty": "1"}, {"id": 3, "email": "b@x.com", "qty": "x"}, {"id": 4, "email": "c@x.com", "qty": "5"}])
finally:
    _logger.removeHandler(_h)
assert _count == 2, f"Успішних два (1 і 4), а вийшло {_count!r}"
_warn = [r for r in _h.records if r.levelname == "WARNING"]
_err = [r for r in _h.records if r.levelname == "ERROR"]
assert len(_warn) == 1 and "2" in _warn[0].getMessage(), "Для замовлення 2 без email потрібен warning з його id"
assert len(_err) == 1 and "3" in _err[0].getMessage(), "Для замовлення 3 потрібен logger.exception з його id"
assert _err[0].exc_info, "logger.exception має додати traceback — виклич його всередині except"
`),
      task("Тест із тимчасовим файлом",
        "Напиши <code>test_count_lines()</code>: створи тимчасовий файл через <code>tempfile</code>, запиши туди кілька рядків, включно з порожнім, перевір <code>count_lines</code> і видали файл.",
        py`
import os
import tempfile


def count_lines(path):
    with open(path, encoding="utf-8") as file:
        return sum(1 for line in file if line.strip())


# your code here


test_count_lines()
print("All tests passed")
`,
        py`
assert _lines and _lines[-1] == "All tests passed"
assert "tempfile" in _code.split("# your code here")[-1] or _code.count("tempfile") >= 2, "Створи файл через tempfile"
_real = count_lines
def _counts_all(path):
    with open(path, encoding="utf-8") as _file:
        return sum(1 for _ in _file)
for _broken in (_counts_all, lambda path: 0):
    globals()["count_lines"] = _broken
    try:
        test_count_lines()
    except AssertionError:
        pass
    else:
        globals()["count_lines"] = _real
        raise AssertionError("Тест не помітив зламану версію. Додай у файл порожній рядок і перевір точну кількість")
globals()["count_lines"] = _real
`),
      task("Підміна HTTP-запиту",
        "Напиши <code>get_temperature(city, http_get)</code>. <code>http_get(url)</code> повертає кортеж (статус, словник). 200 — повертає <code>data[\"temp\"]</code>, 404 — <code>None</code>, інше — <code>RuntimeError</code>. Потім напиши <code>test_get_temperature()</code> з підставними функціями для всіх трьох випадків.",
        py`
def get_temperature(city, http_get):
    # your code here
    pass


def test_get_temperature():
    # your code here
    pass


test_get_temperature()
print("All tests passed")
`,
        py`
_urls = []
assert get_temperature("Kyiv", lambda url: (_urls.append(url), (200, {"temp": 12}))[1]) == 12
assert "Kyiv" in _urls[0], "Назва міста має потрапити в адресу запиту"
assert get_temperature("X", lambda url: (404, {})) is None
try:
    get_temperature("X", lambda url: (500, {}))
except RuntimeError:
    pass
else:
    raise AssertionError("Для 500 очікую RuntimeError")
assert _lines and _lines[-1] == "All tests passed"
_real = get_temperature
for _broken in (lambda city, http_get: http_get(city)[1].get("temp"), lambda city, http_get: 12):
    globals()["get_temperature"] = _broken
    try:
        test_get_temperature()
    except (AssertionError, RuntimeError, KeyError, TypeError):
        pass
    else:
        globals()["get_temperature"] = _real
        raise AssertionError("Тест не помітив зламану версію. Перевір 200, 404 і помилку сервера")
globals()["get_temperature"] = _real
`),
    ],
  };

  Object.keys(more).forEach(function (n) {
    var list = window.KONSPEKT_TASKS[n] || (window.KONSPEKT_TASKS[n] = []);
    list.push.apply(list, more[n]);
  });
})();
