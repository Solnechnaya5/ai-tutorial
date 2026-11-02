// Додаткові задачі до тем Async Python і SQL.
(function () {
  var py = String.raw;

  function task(title, text, starter, tests) {
    return { title: title, text: text, starter: starter.replace(/^\n/, ""), tests: tests, llm: false };
  }

  function sql(title, text, tests) {
    return task(title, text, py`
query = """
SELECT ...
"""

for row in run_sql(query):
    print(row)
`, tests);
  }

  var more = {
    38: [
      task("Тайм-аут",
        "Напиши <code>fetch_with_timeout(make_request, timeout)</code>: <code>make_request()</code> повертає корутину. Якщо вона не встигла за <code>timeout</code> секунд — поверни <code>None</code>. Знадобиться <code>asyncio.wait_for</code>.",
        py`
import asyncio


async def slow_api():
    await asyncio.sleep(0.3)
    return "data"

# your code here


print(await fetch_with_timeout(slow_api, 0.1))
print(await fetch_with_timeout(slow_api, 1))
`,
        py`
import asyncio as _asyncio
import time as _time
async def _slow():
    await _asyncio.sleep(0.3)
    return "slow"
async def _fast():
    await _asyncio.sleep(0.01)
    return "fast"
_start = _time.perf_counter()
assert await fetch_with_timeout(_slow, 0.1) is None, "Не встигла — None"
assert _time.perf_counter() - _start < 0.25, "Чекати довше за тайм-аут не можна"
assert await fetch_with_timeout(_fast, 1) == "fast"
`),
      task("Не більше N одночасно",
        "Напиши <code>limited_gather(factories, limit)</code>: <code>factories</code> — функції, що повертають корутини. Запусти всі, але одночасно не більше <code>limit</code>. Результати — у порядку factories. Знадобиться <code>asyncio.Semaphore</code>.",
        py`
import asyncio


def make_job(n):
    async def job():
        await asyncio.sleep(0.1)
        return n * 10
    return job

# your code here


print(await limited_gather([make_job(i) for i in range(5)], 2))
`,
        py`
import asyncio as _asyncio
import time as _time
_active = [0]
_peak = [0]
def _job(n):
    async def _run():
        _active[0] += 1
        _peak[0] = max(_peak[0], _active[0])
        await _asyncio.sleep(0.1)
        _active[0] -= 1
        return n
    return _run
_start = _time.perf_counter()
assert await limited_gather([_job(i) for i in range(6)], 2) == list(range(6)), "Порядок результатів — як у factories"
_elapsed = _time.perf_counter() - _start
assert _peak[0] == 2, f"Одночасно працювало {_peak[0]}, а має бути не більше 2"
assert 0.25 < _elapsed < 0.5, f"6 задач по 0.1 с, по дві одночасно — близько 0.3 с, а вийшло {_elapsed:.2f}"
`),
      task("Асинхронний retry",
        "Напиши <code>retry_async(make_request, attempts=3, delay=0.05)</code>: повторює виклик, якщо виникла помилка, з паузою <code>delay × 2 ** attempt</code> через <code>asyncio.sleep</code>. Після останньої невдачі пропускає помилку далі.",
        py`
import asyncio

# your code here


calls = []

async def flaky():
    calls.append(1)
    if len(calls) < 3:
        raise ConnectionError("failure")
    return "ok"

print(await retry_async(flaky))
`,
        py`
import asyncio as _asyncio
import time as _time
_n = []
async def _flaky():
    _n.append(1)
    if len(_n) < 3:
        raise ConnectionError("x")
    return "ok"
_start = _time.perf_counter()
assert await retry_async(_flaky, delay=0.05) == "ok" and len(_n) == 3
assert _time.perf_counter() - _start >= 0.14, "Між спробами мають бути паузи 0.05 і 0.1 с"
_n.clear()
async def _always():
    _n.append(1)
    raise ConnectionError("x")
try:
    await retry_async(_always, attempts=2, delay=0.01)
except ConnectionError:
    assert len(_n) == 2
else:
    raise AssertionError("Після вичерпаних спроб помилку треба пропустити далі")
assert "time.sleep" not in _code
`),
      task("Черга й обробники",
        "Напиши <code>process_all(items, handler, workers=3)</code> через <code>asyncio.Queue</code>: кілька обробників беруть елементи з черги, поки вона не спорожніє. Повертає результати <code>await handler(item)</code> у порядку items.",
        py`
import asyncio


async def handler(item):
    await asyncio.sleep(0.1)
    return item.upper()

# your code here


print(await process_all(["a", "b", "c", "d"], handler, workers=2))
`,
        py`
import asyncio as _asyncio
import time as _time
_active = [0]
_peak = [0]
async def _h(item):
    _active[0] += 1
    _peak[0] = max(_peak[0], _active[0])
    await _asyncio.sleep(0.1)
    _active[0] -= 1
    return item * 2
_start = _time.perf_counter()
assert await process_all(list(range(6)), _h, workers=3) == [0, 2, 4, 6, 8, 10]
_elapsed = _time.perf_counter() - _start
assert _peak[0] == 3, f"Одночасно має працювати 3 обробники, а було {_peak[0]}"
assert _elapsed < 0.35, f"6 елементів трьома обробниками — близько 0.2 с, а вийшло {_elapsed:.2f}"
assert await process_all([], _h) == []
assert "Queue" in _code
`),
      task("Перший успішний",
        "Напиши <code>first_successful(factories)</code>: запускає всі запити одночасно й повертає результат того, що першим завершився без помилки. Решту скасовує. Якщо всі впали — <code>RuntimeError</code>. Підійде <code>asyncio.as_completed</code>.",
        py`
import asyncio


def mirror(name, delay, fail=False):
    async def request():
        await asyncio.sleep(delay)
        if fail:
            raise ConnectionError(name)
        return name
    return request

# your code here


print(await first_successful([mirror("eu", 0.3), mirror("us", 0.1), mirror("asia", 0.05, fail=True)]))
`,
        py`
import asyncio as _asyncio
import time as _time
def _m(name, delay, fail=False):
    async def _r():
        await _asyncio.sleep(delay)
        if fail:
            raise ConnectionError(name)
        return name
    return _r
_start = _time.perf_counter()
assert await first_successful([_m("eu", 0.3), _m("us", 0.1), _m("asia", 0.05, fail=True)]) == "us"
assert _time.perf_counter() - _start < 0.25, "Не чекай повільні запити, коли вже є результат"
try:
    await first_successful([_m("a", 0.01, True), _m("b", 0.02, True)])
except RuntimeError:
    pass
else:
    raise AssertionError("Якщо всі впали — RuntimeError")
`),
      task("Запуск з інтервалом",
        "API дозволяє стартувати новий запит не частіше ніж раз на <code>interval</code> секунд, але запити можуть працювати одночасно. Напиши <code>paced(factories, interval)</code>: стартує кожен наступний через <code>interval</code> після попереднього й повертає всі результати по порядку.",
        py`
import asyncio
import time

starts = []

def make_job(n):
    async def job():
        starts.append(time.perf_counter())
        await asyncio.sleep(0.2)
        return n
    return job

# your code here


print(await paced([make_job(i) for i in range(3)], 0.05))
`,
        py`
import asyncio as _asyncio
import time as _time
_starts = []
def _job(n):
    async def _run():
        _starts.append(_time.perf_counter())
        await _asyncio.sleep(0.2)
        return n
    return _run
_t0 = _time.perf_counter()
assert await paced([_job(i) for i in range(4)], 0.05) == [0, 1, 2, 3]
_elapsed = _time.perf_counter() - _t0
_gaps = [b - a for a, b in zip(_starts, _starts[1:])]
assert all(g >= 0.045 for g in _gaps), f"Інтервали між стартами: {[round(g, 3) for g in _gaps]}"
assert _elapsed < 0.5, f"Запити мають працювати одночасно: 4 по 0.2 с з інтервалом 0.05 — близько 0.35 с, а вийшло {_elapsed:.2f}"
`),
      task("Пакетна обробка зі звітом",
        "Напиши <code>run_batch(items, handler, timeout, limit=5)</code>: обробляє всі елементи одночасно (не більше <code>limit</code>), кожен з тайм-аутом. Повертає словник: ok — список результатів успішних у порядку items, failed — елементи з помилкою, timeout — елементи, що не встигли.",
        py`
import asyncio


async def handler(item):
    if item == "bad":
        raise ValueError(item)
    await asyncio.sleep(0.5 if item == "slow" else 0.05)
    return item.upper()

# your code here


print(await run_batch(["a", "bad", "slow", "b"], handler, timeout=0.2))
`,
        py`
import asyncio as _asyncio
import time as _time
async def _h(item):
    if item.startswith("bad"):
        raise ValueError(item)
    await _asyncio.sleep(0.5 if item.startswith("slow") else 0.05)
    return item.upper()
_start = _time.perf_counter()
assert await run_batch(["a", "bad1", "slow1", "b", "slow2", "c"], _h, timeout=0.2) == {"ok": ["A", "B", "C"], "failed": ["bad1"], "timeout": ["slow1", "slow2"]}
assert _time.perf_counter() - _start < 0.45, "Елементи мають оброблятися одночасно"
`),
    ],

    40: [
      sql("WHERE і сортування",
        "Імена користувачів, старших за 25 років, від найстаршого. Лише стовпець name.",
        py`
assert run_sql(query) == [("Oleh",), ("Yulia",)], f"Вийшло {run_sql(query)!r}"
`),
      sql("Агрегати з умовою",
        "Загальна сума й середній чек лише оплачених (<code>status = 'paid'</code>) замовлень, одним рядком.",
        py`
assert run_sql(query) == [(1700, 850.0)], f"Вийшло {run_sql(query)!r}"
`),
      sql("HAVING",
        "Ім'я та суму оплачених замовлень для користувачів, у яких ця сума більша за 1000.",
        py`
assert "having" in query.lower(), "Фільтр по сумі групи — через HAVING"
assert run_sql(query) == [("Yulia", 1700)], f"Вийшло {run_sql(query)!r}"
`),
      sql("Підзапит",
        "Імена користувачів, які не зробили жодного замовлення. Використай підзапит <code>NOT IN (SELECT ...)</code> або <code>NOT EXISTS</code>.",
        py`
assert query.lower().count("select") >= 2, "Потрібен підзапит"
assert run_sql(query) == [("Iryna",)], f"Вийшло {run_sql(query)!r}"
`),
      sql("CASE",
        "Для кожного замовлення — id і розмір: «small» до 500, «medium» від 500 до 999, «large» від 1000. Сортування за id.",
        py`
assert "case" in query.lower()
assert run_sql(query) == [(1, "medium"), (2, "large"), (3, "small")], f"Вийшло {run_sql(query)!r}"
`),
      sql("Віконна функція",
        "Рейтинг клієнтів: ім'я, сума всіх замовлень (0, якщо їх немає) і місце через <code>RANK() OVER (ORDER BY ... DESC)</code>. Сортування за місцем.",
        py`
assert "over" in query.lower(), "Потрібна віконна функція"
assert run_sql(query) == [("Yulia", 1700, 1), ("Oleh", 300, 2), ("Iryna", 0, 3)], f"Вийшло {run_sql(query)!r}"
`),
      task("Параметри замість f-рядка",
        "Напиши <code>find_users(conn, city)</code>: повертає відсортований список імен з указаного міста. Значення передавай через <code>?</code>, а не вставляй у текст запиту.",
        py`
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
INSERT INTO users (name, city) VALUES ('Yulia', 'Kyiv'), ('Oleh', 'Lviv'), ('Iryna', 'Kyiv');
""")

# your code here


print(find_users(conn, "Kyiv"))
`,
        py`
assert find_users(conn, "Kyiv") == ["Iryna", "Yulia"]
assert find_users(conn, "Odesa") == []
assert find_users(conn, "Kyiv' OR '1'='1") == [], "Спроба SQL-ін'єкції не має повертати всіх користувачів"
assert "?" in _code.split("def find_users")[1], "Передай місто через ?"
`),
    ],
  };

  Object.keys(more).forEach(function (n) {
    var list = window.KONSPEKT_TASKS[n] || (window.KONSPEKT_TASKS[n] = []);
    list.push.apply(list, more[n]);
  });
})();
