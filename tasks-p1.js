// Задачі 4–10 до тем 1–16. Складність зростає від задачі до задачі.
// Формат той самий, що в tasks.js; задачі дописуються в кінець списку теми.
(function () {
  var py = String.raw;

  function task(title, text, starter, tests) {
    return { title: title, text: text, starter: starter.replace(/^\n/, ""), tests: tests, llm: false };
  }

  var more = {
    1: [
      task("Ціна зі знижкою",
        "Порахуй <code>final_price</code> — ціну після знижки у відсотках.",
        py`
price = 1200
discount_percent = 15

# твій код тут
`,
        py`
assert final_price == 1020, f"Для 1200 і 15% очікую 1020, а вийшло {final_price!r}"
assert _rerun(price=1000, discount_percent=10)["final_price"] == 900, "Рахуй від змінних, а не записуй готове число"
`),
      task("Кошик",
        "Порахуй <code>subtotal</code> (товари без доставки) і <code>total</code> (разом із доставкою).",
        py`
item_price = 250
quantity = 3
delivery = 60

# твій код тут
`,
        py`
assert subtotal == 750 and total == 810, f"Очікую 750 і 810, а вийшло {subtotal!r} і {total!r}"
_other = _rerun(item_price=100, quantity=2)
assert _other["subtotal"] == 200 and _other["total"] == 260, "Для 100 × 2 очікую 200 і 260"
`),
      task("Оновлення налаштувань",
        "Збережи старі значення в <code>old_model</code> і <code>old_max_tokens</code>. Потім онови налаштування: модель «large», <code>max_tokens</code> удвічі більше, <code>temperature</code> 0.",
        py`
model = "small"
max_tokens = 500
temperature = 0.7

# твій код тут
`,
        py`
assert old_model == "small" and old_max_tokens == 500, "Старі значення треба зберегти до зміни"
assert model == "large" and max_tokens == 1000 and temperature == 0, f"Нові значення: {model!r}, {max_tokens!r}, {temperature!r}"
_other = _rerun(max_tokens=300)
assert _other["old_max_tokens"] == 300 and _other["max_tokens"] == 600, "max_tokens має рахуватися від старого значення"
`),
      task("Вартість запиту до моделі",
        "Ціни задано в доларах за мільйон токенів. Порахуй <code>cost</code> — скільки коштує запит.",
        py`
input_tokens = 1200
output_tokens = 300
input_price = 3
output_price = 15

# твій код тут
`,
        py`
assert abs(cost - 0.0081) < 1e-12, f"Очікую 0.0081, а вийшло {cost!r}"
assert abs(_rerun(input_tokens=1_000_000, output_tokens=0)["cost"] - 3) < 1e-12, "Мільйон вхідних токенів по 3 долари — це 3"
`),
      task("Зсув трьох змінних",
        "Одним рядком зсунь значення: <code>a</code> отримує значення <code>b</code>, <code>b</code> — значення <code>c</code>, а <code>c</code> — значення <code>a</code>.",
        py`
a = "first"
b = "second"
c = "third"

# твій код тут
`,
        py`
assert (a, b, c) == ("second", "third", "first"), f"Вийшло a={a!r}, b={b!r}, c={c!r}"
`),
      task("Середня швидкість",
        "Відстань задано в кілометрах, час — у хвилинах. Порахуй <code>speed_kmh</code> у кілометрах на годину.",
        py`
distance_km = 150
time_min = 120

# твій код тут
`,
        py`
assert speed_kmh == 75, f"150 км за 120 хвилин — це 75 км/год, а вийшло {speed_kmh!r}"
assert _rerun(distance_km=10, time_min=30)["speed_kmh"] == 20, "10 км за 30 хвилин — це 20 км/год"
`),
      task("Рух коштів на рахунку",
        "Онови <code>balance</code> по черзі: поповнення, оплата, повернення коштів. Наприкінці банк знімає комісію <code>fee_percent</code> від того, що вийшло.",
        py`
balance = 1000
top_up = 500
payment = 320
refund = 45
fee_percent = 1

# твій код тут
`,
        py`
assert abs(balance - 1212.75) < 1e-9, f"Очікую 1212.75, а вийшло {balance!r}"
_other = _rerun(balance=0, top_up=100, payment=0, refund=0, fee_percent=10)
assert abs(_other["balance"] - 90) < 1e-9, "Для 0 + 100 і комісії 10% очікую 90"
`),
    ],

    2: [
      task("Індекс маси тіла",
        "Дані з форми приходять рядками. Перетвори їх на числа й порахуй <code>bmi</code> — вагу, поділену на квадрат зросту, з одним знаком після коми.",
        py`
weight_text = "60"
height_text = "1.68"

# твій код тут
`,
        py`
assert bmi == 21.3, f"Очікую 21.3, а вийшло {bmi!r}"
assert _rerun(weight_text="90", height_text="1.8")["bmi"] == 27.8, "Для 90 кг і 1.8 м очікую 27.8"
`),
      task("Сума замовлення",
        "Порахуй <code>total</code> (дробове число) і <code>total_text</code> — ту саму суму рядком.",
        py`
price_text = "1299.50"
qty_text = "3"

# твій код тут
`,
        py`
assert total == 3898.5 and type(total) is float, f"total має бути 3898.5, а вийшло {total!r}"
assert total_text == "3898.5", f"total_text має бути '3898.5', а вийшло {total_text!r}"
_other = _rerun(price_text="10", qty_text="2")
assert _other["total"] == 20.0 and _other["total_text"] == "20.0", "Для 10 × 2 очікую 20.0 і '20.0'"
`),
      task("Прапорець з налаштувань",
        "Налаштування із середовища завжди приходять рядками. Перетвори <code>debug_text</code> на <code>debug</code>: <code>True</code> для будь-якого числа, крім 0.",
        py`
debug_text = "1"

# твій код тут
`,
        py`
assert debug is True, "Для '1' очікую True"
assert _rerun(debug_text="0")["debug"] is False, "Для '0' очікую False"
assert _rerun(debug_text="5")["debug"] is True, "Для '5' очікую True"
`),
      task("Перевірка типу",
        "Створи <code>is_int</code>: <code>True</code>, якщо <code>value</code> — ціле число, інакше <code>False</code>.",
        py`
value = 42

# твій код тут
`,
        py`
assert is_int is True, "42 — ціле число"
for _value in ("42", 3.5):
    assert _rerun(value=_value)["is_int"] is False, f"Для {_value!r} очікую False"
`),
      task("Середній чек",
        "Порахуй <code>arpu</code> — дохід на одного користувача з двома знаками після коми. І <code>revenue_k</code> — дохід у тисячах з одним знаком.",
        py`
revenue = 12345.678
users = 37

# твій код тут
`,
        py`
assert arpu == 333.67 and revenue_k == 12.3, f"Очікую 333.67 і 12.3, а вийшло {arpu!r} і {revenue_k!r}"
_other = _rerun(revenue=1000, users=3)
assert _other["arpu"] == 333.33 and _other["revenue_k"] == 1.0, "Для 1000 і 3 очікую 333.33 і 1.0"
`),
      task("Відкидання й округлення",
        "Перетвори рейтинг на число <code>rating</code>. Потім створи <code>rating_int</code> (дробову частину відкинуто) і <code>rating_round</code> (округлено через <code>round</code>). Подивись, що дасть <code>round</code> для 2.5.",
        py`
rating_text = "4.7"

# твій код тут
`,
        py`
assert rating == 4.7 and rating_int == 4 and rating_round == 5, f"Для '4.7' очікую 4.7, 4, 5, а вийшло {rating!r}, {rating_int!r}, {rating_round!r}"
_other = _rerun(rating_text="2.5")
assert _other["rating_int"] == 2 and _other["rating_round"] == 2, "Для 2.5 round дає 2: Python округлює до найближчого парного"
`),
      task("Чек зі знижкою",
        "Усі дані — рядки. Порахуй <code>total</code> з урахуванням знижки у відсотках, округли до 2 знаків. Збережи суму рядком у <code>total_text</code>.",
        py`
price_text = "249.90"
qty_text = "4"
discount_text = "10"

# твій код тут
`,
        py`
assert total == 899.64, f"Очікую 899.64, а вийшло {total!r}"
assert total_text == "899.64", f"total_text: {total_text!r}"
_other = _rerun(price_text="100", qty_text="1", discount_text="0")
assert _other["total"] == 100.0 and _other["total_text"] == "100.0", "Без знижки для 100 очікую 100.0"
`),
    ],

    3: [
      task("Рядок логу",
        "Виведи рядок логу у форматі <code>[INFO] auth: User logged in</code>.",
        py`
level = "INFO"
module = "auth"
message = "User logged in"

# твій код тут
`,
        py`
assert _lines and _lines[-1] == "[INFO] auth: User logged in", f"Вивелось: {_out.strip()!r}"
assert _rerun(level="ERROR", module="db", message="Timeout")["_lines"][-1] == "[ERROR] db: Timeout", "Підставляй змінні"
`),
      task("Рядок таблиці",
        "Виведи ім'я, вирівняне вліво на 10 символів, вертикальну риску і бал, вирівняний вправо на 5 символів. У f-рядку <code>{x:&lt;10}</code> вирівнює вліво, <code>{x:&gt;5}</code> — вправо.",
        py`
name = "Юля"
score = 95

# твій код тут
`,
        py`
assert _lines and _lines[-1] == "Юля       |   95", f"Вивелось: {_lines[-1] if _lines else ''!r}"
assert _rerun(name="Олександр", score=7)["_lines"][-1] == "Олександр |    7", "Для інших даних вирівнювання має зберегтися"
`),
      task("Чек",
        "Виведи три рядки: <code>Товар: Навушники</code>, <code>Кількість: 2</code>, <code>Сума: 2999.00 грн</code>. Сума — ціна × кількість, два знаки після коми.",
        py`
product = "Навушники"
qty = 2
price = 1499.5

# твій код тут
`,
        py`
assert _lines[-3:] == ["Товар: Навушники", "Кількість: 2", "Сума: 2999.00 грн"], f"Вивелось: {_lines[-3:]}"
assert _rerun(qty=1, price=10)["_lines"][-1] == "Сума: 10.00 грн", "Суму треба рахувати від змінних"
`),
      task("Прогрес у відсотках",
        "Виведи <code>Прогрес: 74%</code>. Формат <code>{x:.0%}</code> сам множить на 100 і додає знак відсотка.",
        py`
done = 37
total = 50

# твій код тут
`,
        py`
assert _lines and _lines[-1] == "Прогрес: 74%", f"Вивелось: {_out.strip()!r}"
assert _rerun(done=1, total=3)["_lines"][-1] == "Прогрес: 33%", "Для 1 з 3 очікую 33%"
`),
      task("Рядок CSV",
        "Одним <code>print</code> із параметром <code>sep</code> виведи рядок <code>7,Юля,Київ,True</code>.",
        py`
user_id = 7
name = "Юля"
city = "Київ"
active = True

# твій код тут
`,
        py`
assert _lines and _lines[-1] == "7,Юля,Київ,True", f"Вивелось: {_out.strip()!r}"
assert "sep" in _code, "Використай sep"
`),
      task("Два print в одному рядку",
        "Двома викликами <code>print</code> виведи один рядок: <code>Завантаження... готово</code>.",
        py`
# твій код тут
`,
        py`
assert _out == "Завантаження... готово\n", f"Вивелось: {_out!r}"
assert _code.count("print(") >= 2 and "end" in _code, "Потрібні два print і параметр end"
`),
      task("Звіт про токени",
        "Виведи три рядки звіту. Числа з роздільником тисяч робить формат <code>{x:,}</code>. Вартість — лише вхідні токени, ціна за мільйон, два знаки.",
        py`
input_tokens = 1234567
output_tokens = 89012
price_per_million = 3.0

# твій код тут
# Вхідні: 1,234,567 токенів
# Вихідні: 89,012 токенів
# Вартість: $3.70
`,
        py`
assert _lines[-3:] == ["Вхідні: 1,234,567 токенів", "Вихідні: 89,012 токенів", "Вартість: $3.70"], f"Вивелось: {_lines[-3:]}"
_other = _rerun(input_tokens=1000, output_tokens=5)
assert _other["_lines"][-3:] == ["Вхідні: 1,000 токенів", "Вихідні: 5 токенів", "Вартість: $0.00"], f"Для інших даних вивелось {_other['_lines'][-3:]}"
`),
    ],

    4: [
      task("Кількість сторінок",
        "Порахуй <code>pages</code> — скільки сторінок потрібно, щоб показати всі елементи. Без <code>if</code>: остання неповна сторінка теж рахується.",
        py`
total_items = 95
per_page = 20

# твій код тут
`,
        py`
for _items, _expected in [(95, 5), (100, 5), (101, 6), (1, 1), (0, 0)]:
    _got = _rerun(total_items=_items)["pages"]
    assert _got == _expected, f"Для {_items} елементів очікую {_expected} сторінок, а вийшло {_got!r}"
assert "if" not in _code, "Обійдися без if"
`),
      task("Високосний рік",
        "Створи <code>is_leap</code>. Рік високосний, якщо ділиться на 4, але не на 100. Або якщо ділиться на 400.",
        py`
year = 2024

# твій код тут
`,
        py`
for _year, _expected in [(2024, True), (2026, False), (1900, False), (2000, True)]:
    assert _rerun(year=_year)["is_leap"] is _expected, f"Для {_year} очікую {_expected}"
`),
      task("Години, хвилини, секунди",
        "Розклади <code>total_seconds</code> на <code>hours</code>, <code>minutes</code> і <code>seconds</code>.",
        py`
total_seconds = 7384

# твій код тут
`,
        py`
for _total, _expected in [(7384, (2, 3, 4)), (59, (0, 0, 59)), (3600, (1, 0, 0))]:
    _ns = _rerun(total_seconds=_total)
    _got = (_ns["hours"], _ns["minutes"], _ns["seconds"])
    assert _got == _expected, f"Для {_total} с очікую {_expected}, а вийшло {_got}"
`),
      task("Робочий час",
        "Створи <code>is_working</code>: <code>True</code>, якщо година від 9 включно до 18 не включно і це не вихідний.",
        py`
hour = 14
is_weekend = False

# твій код тут
`,
        py`
assert is_working is True, "14:00 у будній день — робочий час"
assert _rerun(hour=18)["is_working"] is False, "18:00 — уже неробочий час"
assert _rerun(hour=9)["is_working"] is True, "9:00 — робочий час"
assert _rerun(is_weekend=True)["is_working"] is False, "У вихідний — неробочий час"
`),
      task("Вартість зберігання",
        "Ціна задана за гігабайт на місяць (30 днів). Порахуй <code>cost</code> за вказану кількість днів, округли до 2 знаків.",
        py`
gb = 12.5
price_per_gb_month = 0.023
days = 45

# твій код тут
`,
        py`
assert cost == 0.43, f"Очікую 0.43, а вийшло {cost!r}"
assert _rerun(gb=100, days=30)["cost"] == 2.3, "Для 100 ГБ за 30 днів очікую 2.3"
`),
      task("Бюджет токенів",
        "Порахуй <code>used</code>, <code>left</code>, <code>percent_used</code> (один знак після коми) і <code>over_budget</code> — чи перевищено бюджет.",
        py`
budget = 100000
used_input = 63210
used_output = 21450

# твій код тут
`,
        py`
assert (used, left, percent_used, over_budget) == (84660, 15340, 84.7, False), f"Вийшло {used!r}, {left!r}, {percent_used!r}, {over_budget!r}"
_ns = _rerun(used_input=90000, used_output=20000)
assert (_ns["left"], _ns["percent_used"], _ns["over_budget"]) == (-10000, 110.0, True), "При перевищенні left від'ємний, over_budget True"
`),
      task("Сила пароля",
        "<code>True</code> поводиться як 1, <code>False</code> — як 0. Порахуй <code>strength</code> — скільки з трьох вимог виконано. І <code>is_strong</code>: довжина від 8 і виконано щонайменше дві вимоги.",
        py`
password_len = 11
has_digit = True
has_upper = False
has_special = True

# твій код тут
`,
        py`
assert strength == 2 and is_strong is True, f"Вийшло strength={strength!r}, is_strong={is_strong!r}"
_ns = _rerun(has_special=False)
assert _ns["strength"] == 1 and _ns["is_strong"] is False, "Одна вимога — пароль слабкий"
assert _rerun(password_len=6)["is_strong"] is False, "Короткий пароль — слабкий"
assert _rerun(has_upper=True)["strength"] == 3, "Усі три вимоги — strength 3"
`),
    ],

    5: [
      task("Нормалізація email",
        "Прибери пробіли, переведи в малі літери. Створи <code>email</code>, <code>username</code> (до @) і <code>domain</code> (після @).",
        py`
raw = "  Yulia.Sochenko@Gmail.COM "

# твій код тут
`,
        py`
assert (email, username, domain) == ("yulia.sochenko@gmail.com", "yulia.sochenko", "gmail.com"), f"Вийшло {email!r}, {username!r}, {domain!r}"
_ns = _rerun(raw="A@B.UA")
assert (_ns["email"], _ns["username"], _ns["domain"]) == ("a@b.ua", "a", "b.ua"), "Для 'A@B.UA' очікую 'a@b.ua', 'a', 'b.ua'"
`),
      task("Slug для адреси сторінки",
        "Зроби з заголовка <code>slug</code>: малі літери, слова через дефіс, без зайвих пробілів.",
        py`
title = "Як працює RAG у 2026"

# твій код тут
`,
        py`
assert slug == "як-працює-rag-у-2026", f"Вийшло {slug!r}"
assert _rerun(title="  Python   для AI ")["slug"] == "python-для-ai", "Зайві пробіли не мають давати подвійних дефісів"
`),
      task("Маскування ключа",
        "Ключі не показують повністю. Створи <code>masked</code>: перші 7 символів, три крапки, останні 4.",
        py`
api_key = "sk-ant-abc123xyz789"

# твій код тут
`,
        py`
assert masked == "sk-ant-...z789", f"Вийшло {masked!r}"
assert _rerun(api_key="sk-1234567890abcd")["masked"] == "sk-1234...abcd", "Має працювати для будь-якого ключа"
`),
      task("Розбір рядка логу",
        "Розбери рядок на <code>date</code>, <code>time</code>, <code>level</code>, <code>module</code> (без двокрапки) і <code>message</code>. <code>split(\" \", 4)</code> ріже не більше ніж 4 рази.",
        py`
line = "2026-10-05 14:32:10 ERROR payment: Card declined by bank"

# твій код тут
`,
        py`
assert (date, time, level, module, message) == ("2026-10-05", "14:32:10", "ERROR", "payment", "Card declined by bank"), f"Вийшло {(date, time, level, module, message)}"
_ns = _rerun(line="2026-01-01 00:00:00 INFO auth: ok")
assert (_ns["level"], _ns["module"], _ns["message"]) == ("INFO", "auth", "ok"), "Для іншого рядка розбір неправильний"
`),
      task("Шлях до файлу",
        "Створи <code>filename</code> (останній шматок шляху), <code>extension</code> (після останньої крапки) і <code>stem</code> (ім'я без розширення). Знадобиться <code>rsplit</code>.",
        py`
path = "reports/2026/october/summary.final.pdf"

# твій код тут
`,
        py`
assert (filename, extension, stem) == ("summary.final.pdf", "pdf", "summary.final"), f"Вийшло {filename!r}, {extension!r}, {stem!r}"
_ns = _rerun(path="a/b.txt")
assert (_ns["filename"], _ns["extension"], _ns["stem"]) == ("b.txt", "txt", "b"), "Для 'a/b.txt' очікую 'b.txt', 'txt', 'b'"
`),
      task("UTM-мітки",
        "З рядка параметрів дістань <code>source</code>, <code>medium</code> і <code>campaign</code>. Параметри завжди йдуть у такому порядку.",
        py`
query = "utm_source=google&utm_medium=cpc&utm_campaign=autumn"

# твій код тут
`,
        py`
assert (source, medium, campaign) == ("google", "cpc", "autumn"), f"Вийшло {source!r}, {medium!r}, {campaign!r}"
_ns = _rerun(query="utm_source=fb&utm_medium=social&utm_campaign=black_friday")
assert (_ns["source"], _ns["medium"], _ns["campaign"]) == ("fb", "social", "black_friday"), "Для іншого рядка розбір неправильний"
`),
      task("Шаблон промпту",
        "Підстав значення в шаблон через <code>replace</code> і отримай <code>prompt</code>. Порахуй у ньому слова: <code>word_count</code>.",
        py`
template = "Ти {role}. Відповідай {language}, не більше {limit} слів."
role = "SEO-спеціаліст"
language = "українською"
limit = 50

# твій код тут
`,
        py`
assert prompt == "Ти SEO-спеціаліст. Відповідай українською, не більше 50 слів.", f"Вийшло {prompt!r}"
assert word_count == 8, f"Слів 8, а вийшло {word_count!r}"
_ns = _rerun(role="перекладач", limit=10)
assert _ns["prompt"] == "Ти перекладач. Відповідай українською, не більше 10 слів.", "Підставляй змінні"
`),
    ],

    6: [
      task("Вартість доставки",
        "Київ: безплатно від 1000 грн, інакше 60. Інші міста: 90. Якщо вага понад 10 кг — плюс 50. Поклади результат у <code>delivery</code>.",
        py`
order_total = 800
weight_kg = 3
city = "Київ"

# твій код тут
`,
        py`
for _total, _weight, _city, _expected in [(800, 3, "Київ", 60), (1000, 3, "Київ", 0), (1000, 12, "Київ", 50), (500, 12, "Львів", 140), (2000, 1, "Львів", 90)]:
    _got = _rerun(order_total=_total, weight_kg=_weight, city=_city)["delivery"]
    assert _got == _expected, f"Для {_total} грн, {_weight} кг, {_city} очікую {_expected}, а вийшло {_got!r}"
`),
      task("Категорія статус-коду",
        "Створи <code>category</code>: 200–299 «success», 300–399 «redirect», 400–499 «client_error», 500–599 «server_error», інакше «unknown».",
        py`
status = 404

# твій код тут
`,
        py`
for _status, _expected in [(200, "success"), (299, "success"), (301, "redirect"), (404, "client_error"), (500, "server_error"), (503, "server_error"), (99, "unknown"), (600, "unknown")]:
    _got = _rerun(status=_status)["category"]
    assert _got == _expected, f"Для {_status} очікую {_expected}, а вийшло {_got!r}"
`),
      task("Перевірка пароля",
        "Створи <code>message</code>. Коротший за 8 символів — «Закороткий». Самі літери (<code>isalpha()</code>) — «Додай цифру або символ». Немає великих літер (<code>islower()</code>) — «Додай велику літеру». Інакше — «Надійний».",
        py`
password = "abcdefg1"

# твій код тут
`,
        py`
for _password, _expected in [("abc", "Закороткий"), ("abcdefgh", "Додай цифру або символ"), ("ABCDEFGH", "Додай цифру або символ"), ("abcdefg1", "Додай велику літеру"), ("Abcdefg1", "Надійний")]:
    _got = _rerun(password=_password)["message"]
    assert _got == _expected, f"Для {_password!r} очікую «{_expected}», а вийшло {_got!r}"
`),
      task("Знижка постійного клієнта",
        "Від 10 замовлень — 15%, від 5 — 10%, перше замовлення (0 попередніх) — 5%, інакше 0. Знижка не більше 500 грн. Порахуй <code>final_total</code>.",
        py`
orders_count = 12
order_total = 1000

# твій код тут
`,
        py`
for _count, _total, _expected in [(12, 1000, 850), (12, 5000, 4500), (6, 1000, 900), (0, 1000, 950), (2, 1000, 1000)]:
    _got = _rerun(orders_count=_count, order_total=_total)["final_total"]
    assert _got == _expected, f"Для {_count} замовлень і {_total} грн очікую {_expected}, а вийшло {_got!r}"
`),
      task("Ліміт запитів",
        "Ліміти: «free» — 10 запитів на хвилину, «pro» — 100. Створи <code>allowed</code> і <code>message</code>: «OK», «Ліміт N запитів на хвилину вичерпано» або «Невідомий тариф».",
        py`
plan = "free"
requests_this_minute = 4

# твій код тут
`,
        py`
for _plan, _count, _allowed, _message in [("free", 4, True, "OK"), ("free", 10, False, "Ліміт 10 запитів на хвилину вичерпано"), ("pro", 99, True, "OK"), ("pro", 100, False, "Ліміт 100 запитів на хвилину вичерпано"), ("vip", 1, False, "Невідомий тариф")]:
    _ns = _rerun(plan=_plan, requests_this_minute=_count)
    assert (_ns["allowed"], _ns["message"]) == (_allowed, _message), f"Для {_plan} і {_count} очікую {(_allowed, _message)}, а вийшло {(_ns['allowed'], _ns['message'])}"
`),
      task("Вибір моделі",
        "«classification» — «small». «summary» — «large», якщо текст довший за 10000 символів, інакше «medium». «code» — «large». Усе інше — «medium». Результат у <code>model</code>.",
        py`
task_type = "summary"
text_length = 25000

# твій код тут
`,
        py`
for _type, _length, _expected in [("classification", 50000, "small"), ("summary", 25000, "large"), ("summary", 10000, "medium"), ("code", 10, "large"), ("translation", 10, "medium")]:
    _got = _rerun(task_type=_type, text_length=_length)["model"]
    assert _got == _expected, f"Для {_type}, {_length} очікую {_expected}, а вийшло {_got!r}"
`),
      task("Днів у місяці",
        "Створи <code>days</code>: скільки днів у місяці цього року. Пам'ятай про високосні роки. Для неправильного номера місяця — 0.",
        py`
year = 2024
month = 2

# твій код тут
`,
        py`
for _year, _month, _expected in [(2024, 2, 29), (2023, 2, 28), (1900, 2, 28), (2000, 2, 29), (2026, 4, 30), (2026, 12, 31), (2026, 1, 31), (2026, 13, 0)]:
    _got = _rerun(year=_year, month=_month)["days"]
    assert _got == _expected, f"Для {_month}.{_year} очікую {_expected}, а вийшло {_got!r}"
`),
    ],

    7: [
      task("Середня оцінка",
        "Порахуй <code>average</code> з одним знаком після коми, без <code>sum()</code>. Для порожнього списку — 0.",
        py`
scores = [4, 5, 3, 5]

# твій код тут
`,
        py`
assert average == 4.2, f"Очікую 4.2, а вийшло {average!r}"
assert _rerun(scores=[1, 2])["average"] == 1.5, "Для [1, 2] очікую 1.5"
assert _rerun(scores=[])["average"] == 0, "Для порожнього списку очікую 0"
assert "sum(" not in _code, "Порахуй суму циклом"
`),
      task("Перша помилка в логах",
        "Знайди <code>first_error</code> — перший рядок, що містить «ERROR» (або <code>None</code>), і <code>error_count</code> — скільки таких рядків усього.",
        py`
logs = ["INFO start", "WARN slow query", "ERROR db timeout", "INFO retry", "ERROR db timeout"]

# твій код тут
`,
        py`
assert first_error == "ERROR db timeout" and error_count == 2, f"Вийшло {first_error!r} і {error_count!r}"
_ns = _rerun(logs=["INFO ok"])
assert _ns["first_error"] is None and _ns["error_count"] == 0, "Без помилок: None і 0"
`),
      task("Затримки між повторами",
        "Збери список <code>delays</code>: перша затримка <code>base_delay</code>, кожна наступна вдвічі більша, але не більша за <code>max_delay</code>. Усього <code>attempts</code> значень.",
        py`
attempts = 5
base_delay = 1
max_delay = 10

# твій код тут
`,
        py`
assert delays == [1, 2, 4, 8, 10], f"Вийшло {delays!r}"
assert _rerun(attempts=3, base_delay=2, max_delay=100)["delays"] == [2, 4, 8], "Для 3 спроб від 2 очікую [2, 4, 8]"
assert _rerun(attempts=0)["delays"] == [], "Для 0 спроб — порожній список"
`),
      task("Статистика тексту",
        "Порахуй <code>word_count</code>, <code>longest_word</code> (перше найдовше) і <code>avg_word_len</code> (один знак після коми).",
        py`
text = "Python для AI інженерії це цікаво"

# твій код тут
`,
        py`
assert (word_count, longest_word, avg_word_len) == (6, "інженерії", 4.7), f"Вийшло {(word_count, longest_word, avg_word_len)}"
_ns = _rerun(text="aa bb c")
assert (_ns["word_count"], _ns["longest_word"], _ns["avg_word_len"]) == (3, "aa", 1.7), "Для 'aa bb c' очікую 3, 'aa', 1.7"
`),
      task("Скільки років до мети",
        "Депозит щороку зростає на <code>rate_percent</code>. Циклом <code>while</code> порахуй <code>years</code> — скільки років, доки баланс досягне <code>target</code>.",
        py`
balance = 10000
rate_percent = 12
target = 20000
years = 0

# твій код тут
`,
        py`
assert years == 7, f"Очікую 7 років, а вийшло {years!r}"
assert round(balance) == 22107, f"Баланс після 7 років — близько 22107, а вийшло {balance!r}"
assert _rerun(rate_percent=100, target=40000)["years"] == 2, "Зі 100% річних 10000 стане 40000 за 2 роки"
assert _rerun(target=5000)["years"] == 0, "Якщо мету вже досягнуто — 0 років"
`),
      task("Розбиття на сторінки",
        "Збери <code>pages</code> — список сторінок, кожна зі списком не більше ніж <code>per_page</code> елементів. Знадобиться <code>range</code> з кроком.",
        py`
items = list(range(1, 24))
per_page = 10

# твій код тут
`,
        py`
assert pages == [list(range(1, 11)), list(range(11, 21)), [21, 22, 23]], f"Вийшло {pages!r}"
assert len(_rerun(per_page=5)["pages"]) == 5, "Для 23 елементів по 5 — 5 сторінок"
assert _rerun(items=[])["pages"] == [], "Для порожнього списку — порожній"
`),
      task("Розбір рядків CSV",
        "Пропусти заголовок і порожні рядки. Збери <code>names</code>, порахуй <code>total_age</code> і <code>kyiv_count</code> — скільки людей з Києва.",
        py`
rows = ["name,age,city", "Юля,28,Київ", "", "Олег,31,Львів", "Ірина,24,Київ"]

# твій код тут
`,
        py`
assert names == ["Юля", "Олег", "Ірина"], f"names: {names!r}"
assert total_age == 83 and kyiv_count == 2, f"total_age={total_age!r}, kyiv_count={kyiv_count!r}"
_ns = _rerun(rows=["name,age,city", "", "Марко,40,Одеса", ""])
assert (_ns["names"], _ns["total_age"], _ns["kyiv_count"]) == (["Марко"], 40, 0), "Для інших рядків результат неправильний"
`),
    ],

    8: [
      task("Три найдорожчі",
        "Створи <code>top3</code> — три найбільші ціни від більшої до меншої. Сам список <code>prices</code> не змінюй.",
        py`
prices = [450, 1200, 99, 3100, 750, 2400]

# твій код тут
`,
        py`
assert top3 == [3100, 2400, 1200], f"Вийшло {top3!r}"
assert prices == [450, 1200, 99, 3100, 750, 2400], "Початковий список змінився"
assert _rerun(prices=[5, 1])["top3"] == [5, 1], "Якщо цін менше трьох — повертай усі"
`),
      task("Унікальні email",
        "Створи <code>unique</code>: email у нижньому регістрі без повторів, у порядку першої появи. Без <code>set</code>.",
        py`
emails = ["a@x.com", "B@x.com", "A@x.com", "b@x.com", "c@x.com"]

# твій код тут
`,
        py`
assert unique == ["a@x.com", "b@x.com", "c@x.com"], f"Вийшло {unique!r}"
assert "set(" not in _code, "Обійдися без set"
`),
      task("Два списки в один",
        "Склади <code>lines</code> — рядки «ім'я: бал» для кожної пари однакових позицій.",
        py`
names = ["Юля", "Олег", "Ірина"]
scores = [95, 80, 88]

# твій код тут
`,
        py`
assert lines == ["Юля: 95", "Олег: 80", "Ірина: 88"], f"Вийшло {lines!r}"
`),
      task("Ковзне середнє",
        "Створи <code>moving</code>: середнє кожних <code>window</code> сусідніх значень. Якщо значень менше, ніж вікно, — порожній список.",
        py`
values = [10, 20, 30, 40, 50]
window = 3

# твій код тут
`,
        py`
assert moving == [20.0, 30.0, 40.0], f"Вийшло {moving!r}"
assert _rerun(window=1)["moving"] == [10, 20, 30, 40, 50], "Вікно 1 — самі значення"
assert _rerun(window=6)["moving"] == [], "Вікно більше за список — порожній результат"
`),
      task("Генератор списку з умовою",
        "Одним генератором списку створи <code>with_vat</code>: лише суми понад 100, кожна з ПДВ 20%, округлена до 2 знаків.",
        py`
amounts = [50, 120, 99.99, 300.5, 101]

# твій код тут
`,
        py`
assert with_vat == [144.0, 360.6, 121.2], f"Вийшло {with_vat!r}"
assert "for" in _code and "[" in _code, "Потрібен генератор списку"
`),
      task("Таблиця продажів",
        "Кожен рядок — продажі менеджера за три місяці. Порахуй <code>by_manager</code> (сума кожного), <code>by_month</code> (сума кожного місяця) і <code>best_manager</code>.",
        py`
managers = ["Юля", "Олег", "Ірина"]
sales = [[100, 200, 150], [80, 90, 120], [300, 0, 50]]

# твій код тут
`,
        py`
assert by_manager == [450, 290, 350], f"by_manager: {by_manager!r}"
assert by_month == [480, 290, 320], f"by_month: {by_month!r}"
assert best_manager == "Юля", f"best_manager: {best_manager!r}"
`),
      task("Злиття відсортованих списків",
        "Обидва списки вже відсортовані. Злий їх у відсортований <code>merged</code> одним проходом, без <code>sort</code> і <code>sorted</code>.",
        py`
a = [1, 4, 9]
b = [2, 3, 10, 12]

# твій код тут
`,
        py`
assert merged == [1, 2, 3, 4, 9, 10, 12], f"Вийшло {merged!r}"
assert _rerun(a=[])["merged"] == [2, 3, 10, 12], "Якщо один список порожній — результат дорівнює іншому"
assert _rerun(a=[5, 5], b=[5])["merged"] == [5, 5, 5], "Однакові значення не губляться"
assert "sort" not in _code, "Обійдися без sort і sorted"
`),
    ],

    9: [
      task("Найближча точка",
        "Знайди <code>closest</code> — точку, найближчу до (0, 0). Корінь не потрібен: порівнюй квадрати відстаней.",
        py`
points = [(3, 4), (-1, 1), (5, 0), (0, -2)]

# твій код тут
`,
        py`
assert closest == (-1, 1), f"Вийшло {closest!r}"
assert _rerun(points=[(10, 10), (0, 3)])["closest"] == (0, 3), "Для іншого списку відповідь неправильна"
`),
      task("Рядки з бази",
        "Кожен рядок — кортеж (id, ім'я, вік). Збери <code>adults</code> — імена повнолітніх від наймолодшого до найстаршого.",
        py`
rows = [(1, "Юля", 28), (2, "Олег", 17), (3, "Ірина", 24), (4, "Марко", 16)]

# твій код тут
`,
        py`
assert adults == ["Ірина", "Юля"], f"Вийшло {adults!r}"
`),
      task("Колір у HEX",
        "Перетвори кортеж RGB на рядок <code>hex_color</code> на зразок «#ff8000». Формат <code>{x:02x}</code> дає двозначне шістнадцяткове число.",
        py`
rgb = (255, 128, 0)

# твій код тут
`,
        py`
assert hex_color == "#ff8000", f"Вийшло {hex_color!r}"
assert _rerun(rgb=(0, 0, 0))["hex_color"] == "#000000", "Для (0, 0, 0) очікую #000000"
assert _rerun(rgb=(15, 16, 17))["hex_color"] == "#0f1011", "Для (15, 16, 17) очікую #0f1011"
`),
      task("Зайнятість у календарі",
        "Зустрічі — кортежі (початок, кінець) у годинах. Порахуй <code>busy_hours</code> і <code>overlaps</code> — чи перетинається <code>new_meeting</code> хоча б з однією зустріччю.",
        py`
meetings = [(9, 11), (13, 14), (15, 18)]
new_meeting = (10, 12)

# твій код тут
`,
        py`
assert busy_hours == 6, f"busy_hours: {busy_hours!r}"
assert overlaps is True, "(10, 12) перетинається з (9, 11)"
assert _rerun(new_meeting=(11, 13))["overlaps"] is False, "(11, 13) стикується, але не перетинається"
assert _rerun(new_meeting=(17, 19))["overlaps"] is True, "(17, 19) перетинається з (15, 18)"
`),
      task("Сортування за двома ознаками",
        "Відсортуй товари за ціною, а з однаковою ціною — за назвою. Кортежі порівнюються поелементно, тож допоможе поміняти місцями ціну й назву.",
        py`
products = [("Мишка", 450), ("Клавіатура", 1200), ("Кабель", 150), ("Адаптер", 450)]

# твій код тут
`,
        py`
assert sorted_products == [("Кабель", 150), ("Адаптер", 450), ("Мишка", 450), ("Клавіатура", 1200)], f"Вийшло {sorted_products!r}"
`),
      task("Суми за категоріями",
        "Збери <code>totals</code> — список кортежів (категорія, сума) у порядку першої появи категорії. Без словників.",
        py`
expenses = [("food", 120), ("taxi", 80), ("food", 45), ("books", 300), ("taxi", 20)]

# твій код тут
`,
        py`
assert totals == [("food", 165), ("taxi", 100), ("books", 300)], f"Вийшло {totals!r}"
`),
      task("Найновіша версія",
        "Рядки версій не можна порівнювати як текст: «1.10.0» новіша за «1.9.9». Перетвори версії на кортежі чисел і знайди <code>latest</code>.",
        py`
versions = ["1.2.10", "1.10.0", "1.9.9", "0.12.1"]

# твій код тут
`,
        py`
assert latest == "1.10.0", f"Вийшло {latest!r}"
assert _rerun(versions=["2.0.0", "10.0.0", "9.99.99"])["latest"] == "10.0.0", "Для іншого списку відповідь неправильна"
`),
    ],

    10: [
      task("Обернений словник",
        "Створи <code>by_name</code>: назва країни → код.",
        py`
countries = {"UA": "Україна", "PL": "Польща", "DE": "Німеччина"}

# твій код тут
`,
        py`
assert by_name == {"Україна": "UA", "Польща": "PL", "Німеччина": "DE"}, f"Вийшло {by_name!r}"
`),
      task("Злиття налаштувань",
        "Збери <code>config</code>: значення за замовчуванням, перекриті налаштуваннями користувача. <code>missing</code> — обов'язкові ключі, яких немає або значення порожній рядок.",
        py`
defaults = {"model": "small", "temperature": 0.7, "max_tokens": 500, "stream": False}
user_config = {"temperature": 0.2, "max_tokens": 1000, "api_key": ""}
required = ["model", "api_key"]

# твій код тут
`,
        py`
assert config == {"model": "small", "temperature": 0.2, "max_tokens": 1000, "stream": False, "api_key": ""}, f"config: {config!r}"
assert missing == ["api_key"], f"missing: {missing!r}"
assert defaults["temperature"] == 0.7, "defaults змінювати не можна"
`),
      task("Групування",
        "Збери <code>by_city</code>: місто → список імен.",
        py`
users = [{"name": "Юля", "city": "Київ"}, {"name": "Олег", "city": "Львів"}, {"name": "Ірина", "city": "Київ"}]

# твій код тут
`,
        py`
assert by_city == {"Київ": ["Юля", "Ірина"], "Львів": ["Олег"]}, f"Вийшло {by_city!r}"
`),
      task("Відповідь API",
        "Дістань <code>text</code>, <code>model</code> і <code>total_tokens</code> (вхідні + вихідні). Якщо <code>usage</code> немає — 0 токенів.",
        py`
response = {"model": "claude-small", "content": [{"type": "text", "text": "Привіт!"}], "usage": {"input_tokens": 12, "output_tokens": 5}}

# твій код тут
`,
        py`
assert (text, model, total_tokens) == ("Привіт!", "claude-small", 17), f"Вийшло {(text, model, total_tokens)}"
_ns = _rerun(response={"model": "m", "content": [{"type": "text", "text": "ok"}]})
assert _ns["total_tokens"] == 0, "Без usage очікую 0 токенів, а не KeyError"
`),
      task("Кошик із каталогом",
        "Порахуй <code>total</code> за цінами з каталогу. Товари, яких немає в каталозі, збери в <code>missing</code>.",
        py`
cart = {"p1": 2, "p2": 1, "p9": 3}
prices = {"p1": 499.0, "p2": 1200.0, "p3": 99.0}

# твій код тут
`,
        py`
assert total == 2198.0 and missing == ["p9"], f"Вийшло {total!r} і {missing!r}"
`),
      task("Найчастіші слова",
        "Слова в нижньому регістрі, без «.,!?». Створи <code>top3</code> — три пари (слово, кількість): спершу за кількістю, при рівності — за алфавітом.",
        py`
text = "Python і AI. AI і Python, AI!"

# твій код тут
`,
        py`
assert top3 == [("ai", 3), ("python", 2), ("і", 2)], f"Вийшло {top3!r}"
`),
      task("Плоский конфіг",
        "Перетвори вкладені словники на плоский <code>flat</code> з ключами на зразок «db.host». Значення верхнього рівня, що не є словниками, лишаються як є.",
        py`
config = {"db": {"host": "localhost", "port": 5432}, "llm": {"model": "small"}, "debug": False}

# твій код тут
`,
        py`
assert flat == {"db.host": "localhost", "db.port": 5432, "llm.model": "small", "debug": False}, f"Вийшло {flat!r}"
`),
    ],

    11: [
      task("Нові й утрачені клієнти",
        "Створи <code>new_customers</code> і <code>lost_customers</code> (відсортовані списки) та <code>retained</code> — скільки клієнтів лишилося.",
        py`
last_month = ["anna", "oleh", "iryna", "marko"]
this_month = ["oleh", "iryna", "taras", "olena", "oleh"]

# твій код тут
`,
        py`
assert new_customers == ["olena", "taras"], f"new_customers: {new_customers!r}"
assert lost_customers == ["anna", "marko"], f"lost_customers: {lost_customers!r}"
assert retained == 2, f"retained: {retained!r}"
`),
      task("Перевірка полів запиту",
        "Знайди <code>unknown_fields</code> (немає серед дозволених) і <code>missing_fields</code> (обов'язкові, яких немає). Обидва — відсортовані списки.",
        py`
payload = {"name": "Юля", "email": "y@x.com", "role": "admin", "is_admin": True}
allowed = {"name", "email", "role", "phone"}
required = {"name", "email", "phone"}

# твій код тут
`,
        py`
assert unknown_fields == ["is_admin"] and missing_fields == ["phone"], f"Вийшло {unknown_fields!r} і {missing_fields!r}"
`),
      task("Унікальні відвідувачі",
        "Порахуй <code>unique_per_day</code> (день → кількість різних користувачів) і <code>total_unique</code>.",
        py`
visits = [("пн", "u1"), ("пн", "u2"), ("пн", "u1"), ("вт", "u3"), ("вт", "u1")]

# твій код тут
`,
        py`
assert unique_per_day == {"пн": 2, "вт": 2}, f"unique_per_day: {unique_per_day!r}"
assert total_unique == 3, f"total_unique: {total_unique!r}"
`),
      task("Теги документів",
        "Знайди <code>common</code> — теги, що є в усіх документах, і <code>rare</code> — теги, що є лише в одному. Обидва відсортовані.",
        py`
docs = {
    "a": ["python", "ai", "rag"],
    "b": ["ai", "python", "sql"],
    "c": ["python", "ai", "docker"],
}

# твій код тут
`,
        py`
assert common == ["ai", "python"], f"common: {common!r}"
assert rare == ["docker", "rag", "sql"], f"rare: {rare!r}"
`),
      task("Схожість запитів",
        "Коефіцієнт Жаккара — розмір перетину множин слів, поділений на розмір їх об'єднання. Порахуй <code>similarity</code> з двома знаками, слова в нижньому регістрі.",
        py`
query_a = "Як скинути пароль"
query_b = "як змінити пароль"

# твій код тут
`,
        py`
assert similarity == 0.5, f"Вийшло {similarity!r}"
assert _rerun(query_b="Як скинути пароль")["similarity"] == 1.0, "Однакові запити — 1.0"
assert _rerun(query_b="доставка")["similarity"] == 0.0, "Без спільних слів — 0.0"
`),
      task("Дублікати",
        "Знайди <code>duplicates</code> — відсортований список email (у нижньому регістрі), що трапляються більше одного разу. Використай множину вже побачених.",
        py`
emails = ["a@x.com", "b@x.com", "A@x.com", "c@x.com", "b@x.com", "b@X.com"]

# твій код тут
`,
        py`
assert duplicates == ["a@x.com", "b@x.com"], f"Вийшло {duplicates!r}"
`),
      task("Рекомендації",
        "Знайди користувачів, які мають із <code>target</code> хоча б один спільний інтерес. Порекомендуй їхні інтереси, яких у <code>target</code> ще немає. <code>recommendations</code> — відсортований список.",
        py`
likes = {
    "yulia": {"rag", "python"},
    "oleh": {"python", "docker", "sql"},
    "iryna": {"rag", "langchain"},
    "marko": {"go"},
}
target = "yulia"

# твій код тут
`,
        py`
assert recommendations == ["docker", "langchain", "sql"], f"Вийшло {recommendations!r}"
assert _rerun(target="marko")["recommendations"] == [], "У marko немає спільних інтересів"
assert _rerun(target="oleh")["recommendations"] == ["rag"], "oleh перетинається лише з yulia"
`),
    ],

    12: [
      task("Форматування ціни",
        "Напиши <code>format_price(amount, currency=\"грн\")</code>: тисячі через пробіл, два знаки після крапки. <code>f\"{x:,.2f}\"</code> ставить коми між тисячами.",
        py`
# твій код тут


print(format_price(1299.5))
`,
        py`
assert format_price(1299.5) == "1 299.50 грн", f"Вийшло {format_price(1299.5)!r}"
assert format_price(1000000, "$") == "1 000 000.00 $", f"Вийшло {format_price(1000000, '$')!r}"
assert format_price(5) == "5.00 грн"
`),
      task("Перевірка email",
        "Напиши <code>is_valid_email(email)</code>: рівно одна «@», обидві частини непорожні, у домені є крапка не на початку й не в кінці, пробілів немає.",
        py`
# твій код тут


print(is_valid_email("yulia@example.com"))
`,
        py`
for _email in ["yulia@example.com", "a.b@mail.co.uk"]:
    assert is_valid_email(_email) is True, f"{_email!r} — правильний"
for _email in ["yulia@example", "@example.com", "yulia@", "yu lia@example.com", "a@b@c.com", "a@.com", "a@com.", ""]:
    assert is_valid_email(_email) is False, f"{_email!r} — неправильний"
`),
      task("Вартість запиту",
        "Напиши <code>calculate_cost(input_tokens, output_tokens, model)</code> за таблицею цін (долари за мільйон токенів). Округли до 6 знаків. Для невідомої моделі — <code>None</code>.",
        py`
PRICES = {
    "small": (0.25, 1.25),
    "large": (3.0, 15.0),
}

# твій код тут


print(calculate_cost(1200, 300, "large"))
`,
        py`
assert calculate_cost(1200, 300, "large") == 0.0081, f"Вийшло {calculate_cost(1200, 300, 'large')!r}"
assert calculate_cost(1_000_000, 1_000_000, "small") == 1.5
assert calculate_cost(10, 10, "unknown") is None, "Для невідомої моделі — None"
`),
      task("Розбір рядка логу",
        "Напиши <code>parse_log_line(line)</code>: повертає словник з ключами date, time, level, module, message. Якщо частин замало — <code>None</code>.",
        py`
# твій код тут


print(parse_log_line("2026-10-05 14:32:10 ERROR payment: Card declined"))
`,
        py`
assert parse_log_line("2026-10-05 14:32:10 ERROR payment: Card declined by bank") == {"date": "2026-10-05", "time": "14:32:10", "level": "ERROR", "module": "payment", "message": "Card declined by bank"}
assert parse_log_line("broken line") is None, "Для неповного рядка — None"
`),
      task("Пагінація",
        "Напиши <code>paginate(items, page, per_page=10)</code>: повертає словник з ключами items, page, total_pages, has_next, has_prev. Сторінки рахуються з 1.",
        py`
# твій код тут


print(paginate(list(range(25)), 3))
`,
        py`
_items = list(range(25))
assert paginate(_items, 1) == {"items": list(range(10)), "page": 1, "total_pages": 3, "has_next": True, "has_prev": False}
assert paginate(_items, 3) == {"items": list(range(20, 25)), "page": 3, "total_pages": 3, "has_next": False, "has_prev": True}
assert paginate(_items, 5)["items"] == [], "Сторінки за межами — порожній список"
assert paginate([], 1)["total_pages"] == 0 and paginate([], 1)["has_next"] is False
`),
      task("Обрізання тексту",
        "Напиши <code>truncate_words(text, max_chars, suffix=\"…\")</code>. Короткий текст повертається як є. Довгий обрізається так, щоб разом із суфіксом вийшло не більше <code>max_chars</code>, і слова не розривалися.",
        py`
# твій код тут


print(truncate_words("Python для AI інженерії", 15))
`,
        py`
_text = "Python для AI інженерії та аналізу даних"
assert truncate_words("коротко", 20) == "коротко", "Короткий текст не змінюється"
for _limit in (8, 12, 15, 20, 30):
    _result = truncate_words(_text, _limit)
    assert len(_result) <= _limit, f"Для max_chars={_limit} результат {_result!r} задовгий"
    assert _result.endswith("…"), f"Для max_chars={_limit} немає суфікса: {_result!r}"
    _core = _result[:-1].rstrip()
    assert _text.startswith(_core) and _text[len(_core)] == " ", f"Для max_chars={_limit} розірвано слово: {_result!r}"
assert truncate_words(_text, 15) == "Python для AI…", f"Вийшло {truncate_words(_text, 15)!r}"
assert truncate_words(_text, 16, suffix="...") == "Python для AI...", "Суфікс має братися з параметра"
`),
      task("Повідомлення для моделі",
        "Напиши <code>build_messages(system, history, user_text, max_history=4)</code>: системне повідомлення, останні <code>max_history</code> повідомлень історії і нове повідомлення користувача. Перевір випадок <code>max_history=0</code>.",
        py`
# твій код тут


history = [{"role": "user", "content": f"q{i}"} for i in range(6)]
print(build_messages("Ти асистент", history, "Привіт", max_history=2))
`,
        py`
_history = [{"role": "user", "content": f"q{_i}"} for _i in range(6)]
_result = build_messages("sys", _history, "new", max_history=2)
assert _result == [{"role": "system", "content": "sys"}, _history[4], _history[5], {"role": "user", "content": "new"}], f"Вийшло {_result!r}"
assert len(build_messages("sys", _history, "new")) == 6, "За замовчуванням — 4 повідомлення історії"
assert build_messages("sys", _history, "new", max_history=0) == [{"role": "system", "content": "sys"}, {"role": "user", "content": "new"}], "history[-0:] повертає весь список, тож 0 треба обробити окремо"
assert len(_history) == 6, "Історію змінювати не можна"
`),
    ],

    13: [
      task("Розбір ціни",
        "Напиши <code>parse_price(text)</code>: прибирає «грн» і пробіли, кому вважає крапкою, повертає число. Порожній рядок — <code>ValueError(\"Порожня ціна\")</code>. Нечисловий текст — теж <code>ValueError</code>.",
        py`
# твій код тут


print(parse_price("1 299,50 грн"))
`,
        py`
assert parse_price("1 299,50 грн") == 1299.5 and parse_price("15") == 15.0
for _bad in ("", "   ", "abc"):
    try:
        parse_price(_bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"Для {_bad!r} очікую ValueError")
`),
      task("Налаштування з перетворенням",
        "Напиши <code>get_setting(config, key, cast=int, default=None)</code>: повертає <code>cast(config[key])</code>. Якщо ключа немає або перетворення не вдалося — <code>default</code>.",
        py`
# твій код тут


config = {"port": "8080", "debug": "yes"}
print(get_setting(config, "port"))
`,
        py`
_config = {"port": "8080", "debug": "yes", "ratio": "0.5"}
assert get_setting(_config, "port") == 8080
assert get_setting(_config, "ratio", float) == 0.5
assert get_setting(_config, "debug", default=0) == 0, "Невдале перетворення — default"
assert get_setting(_config, "missing", default="x") == "x", "Немає ключа — default"
`),
      task("Вік із брудних даних",
        "Напиши <code>parse_ages(rows)</code>: повертає кортеж (список цілих віків, кількість помилок). Помилка — рядок не перетворюється на число або вік від'ємний.",
        py`
# твій код тут


print(parse_ages(["28", "abc", "31", "-5", " 24 ", ""]))
`,
        py`
assert parse_ages(["28", "abc", "31", "-5", " 24 ", ""]) == ([28, 31, 24], 3), f"Вийшло {parse_ages(['28', 'abc', '31', '-5', ' 24 ', ''])!r}"
assert parse_ages([]) == ([], 0)
`),
      task("Зняття коштів",
        "Напиши <code>withdraw(balance, amount)</code>: повертає новий баланс. Сума ≤ 0 — <code>ValueError</code> зі словом «нуль» у тексті. Сума більша за баланс — <code>ValueError(\"Недостатньо коштів\")</code>.",
        py`
# твій код тут


print(withdraw(1000, 250))
`,
        py`
assert withdraw(1000, 250) == 750 and withdraw(100, 100) == 0
for _amount, _word in [(0, "нуль"), (-5, "нуль"), (5000, "Недостатньо")]:
    try:
        withdraw(1000, _amount)
    except ValueError as _error:
        assert _word in str(_error), f"Для {_amount} текст помилки має містити «{_word}», а там: {_error}"
    else:
        raise AssertionError(f"Для {_amount} очікую ValueError")
`),
      task("Безпечний доступ за шляхом",
        "Напиши <code>safe_get(data, path, default=None)</code>. Шлях — ключі через крапку, числа — індекси списків. Будь-яка помилка дорогою — <code>default</code>.",
        py`
# твій код тут


response = {"choices": [{"message": {"content": "Привіт"}}]}
print(safe_get(response, "choices.0.message.content"))
`,
        py`
_data = {"choices": [{"message": {"content": "Привіт"}}], "usage": {"total": 5}}
assert safe_get(_data, "choices.0.message.content") == "Привіт"
assert safe_get(_data, "usage.total") == 5
assert safe_get(_data, "choices.3.message") is None, "Індекс за межами — default"
assert safe_get(_data, "usage.total.x", "-") == "-", "Число не має ключів — default"
assert safe_get(_data, "missing") is None
`),
      task("Повтор при помилці",
        "Напиши <code>call_with_retry(func, attempts=3)</code>: викликає <code>func()</code>, доки не вдасться. Повертає результат. Якщо всі спроби невдалі — пропускає останню помилку далі.",
        py`
# твій код тут


print(call_with_retry(lambda: "готово"))
`,
        py`
_calls = []
def _flaky():
    _calls.append(1)
    if len(_calls) < 3:
        raise ConnectionError("збій")
    return "ok"
assert call_with_retry(_flaky) == "ok" and len(_calls) == 3, "Третя спроба має повернути результат"
_calls.clear()
try:
    call_with_retry(_flaky, attempts=2)
except ConnectionError:
    pass
else:
    raise AssertionError("Після вичерпаних спроб помилку треба пропустити далі")
assert len(_calls) == 2, "Спроб має бути рівно attempts"
`),
      task("Перевірка замовлення",
        "Напиши <code>validate_order(order)</code>: повертає список усіх проблем, а не першу. Тексти: «Немає поля email», «Немає поля items», «Неправильний email», «Порожнє замовлення», «Неправильна кількість для НАЗВА».",
        py`
# твій код тут


print(validate_order({"email": "y@x.com", "items": [{"name": "Мишка", "qty": "2"}]}))
`,
        py`
assert validate_order({"email": "y@x.com", "items": [{"name": "Мишка", "qty": "2"}]}) == []
assert validate_order({}) == ["Немає поля email", "Немає поля items"]
assert validate_order({"email": "bad", "items": []}) == ["Неправильний email", "Порожнє замовлення"]
_errors = validate_order({"email": "y@x.com", "items": [{"name": "A", "qty": "x"}, {"name": "B", "qty": 0}, {"name": "C", "qty": None}, {"name": "D", "qty": 3}]})
assert _errors == ["Неправильна кількість для A", "Неправильна кількість для B", "Неправильна кількість для C"], f"Вийшло {_errors!r}"
`),
    ],

    14: [
      task("Слова у файлі",
        "Напиши <code>count_words_in_file(path)</code>. Якщо файлу немає — 0.",
        py`
# твій код тут


with open("text.txt", "w", encoding="utf-8") as file:
    file.write("Python для AI\nі даних\n")
print(count_words_in_file("text.txt"))
`,
        py`
with open("_w.txt", "w", encoding="utf-8") as _f:
    _f.write("один два\n\nтри   чотири п'ять\n")
assert count_words_in_file("_w.txt") == 5
assert count_words_in_file("_nope.txt") == 0
`),
      task("Сума колонки CSV",
        "Напиши <code>sum_column(path, column)</code>: сума значень колонки. Порожні й нечислові значення пропускай.",
        py`
import csv

# твій код тут


with open("orders.csv", "w", encoding="utf-8") as file:
    file.write("id,amount\n1,100.5\n2,\n3,abc\n4,200\n")
print(sum_column("orders.csv", "amount"))
`,
        py`
with open("_o.csv", "w", encoding="utf-8") as _f:
    _f.write("id,amount,city\n1,100.5,Київ\n2,,Львів\n3,abc,Київ\n4,200,Одеса\n")
assert sum_column("_o.csv", "amount") == 300.5
assert sum_column("_o.csv", "id") == 10
`),
      task("Звіт у файл",
        "Напиши <code>write_report(path, data)</code>: записує рядки «ключ: значення», відсортовані за ключем. Повертає кількість рядків.",
        py`
# твій код тут


print(write_report("report.txt", {"users": 120, "errors": 3}))
print(open("report.txt", encoding="utf-8").read())
`,
        py`
assert write_report("_r.txt", {"users": 120, "errors": 3, "avg": 4.5}) == 3
with open("_r.txt", encoding="utf-8") as _f:
    assert _f.read().splitlines() == ["avg: 4.5", "errors: 3", "users: 120"]
`),
      task("Останні рядки",
        "Напиши <code>tail(path, n=5)</code>: останні <code>n</code> рядків файлу без символу переносу.",
        py`
# твій код тут


with open("app.log", "w", encoding="utf-8") as file:
    for i in range(1, 11):
        file.write(f"line {i}\n")
print(tail("app.log", 3))
`,
        py`
with open("_t.txt", "w", encoding="utf-8") as _f:
    _f.write("".join(f"l{_i}\n" for _i in range(1, 11)))
assert tail("_t.txt", 3) == ["l8", "l9", "l10"]
assert tail("_t.txt") == ["l6", "l7", "l8", "l9", "l10"]
assert tail("_t.txt", 50) == [f"l{_i}" for _i in range(1, 11)]
`),
      task("Рівні в логах",
        "Рядки логу мають вигляд <code>[LEVEL] текст</code>. Напиши <code>count_levels(path)</code>: словник рівень → кількість. Рядки іншого вигляду пропускай.",
        py`
# твій код тут


with open("app.log", "w", encoding="utf-8") as file:
    file.write("[INFO] start\n[ERROR] db\n[INFO] retry\nбез рівня\n")
print(count_levels("app.log"))
`,
        py`
with open("_l.txt", "w", encoding="utf-8") as _f:
    _f.write("[INFO] start\n[ERROR] db\n[INFO] retry\nбез рівня\n\n[WARN] slow\n")
assert count_levels("_l.txt") == {"INFO": 2, "ERROR": 1, "WARN": 1}, f"Вийшло {count_levels('_l.txt')!r}"
`),
      task("Злиття файлів",
        "Напиши <code>merge_files(paths, out_path)</code>: записує вміст файлів підряд в один. Неіснуючі пропускає. Кожен файл має закінчуватися переносом рядка. Повертає кількість злитих файлів.",
        py`
# твій код тут


for name, text in [("a.txt", "перший"), ("b.txt", "другий\n")]:
    with open(name, "w", encoding="utf-8") as file:
        file.write(text)
print(merge_files(["a.txt", "missing.txt", "b.txt"], "all.txt"))
print(open("all.txt", encoding="utf-8").read())
`,
        py`
for _name, _text in [("_a.txt", "перший"), ("_b.txt", "другий\nтретій\n")]:
    with open(_name, "w", encoding="utf-8") as _f:
        _f.write(_text)
assert merge_files(["_a.txt", "_missing.txt", "_b.txt"], "_all.txt") == 2
with open("_all.txt", encoding="utf-8") as _f:
    assert _f.read() == "перший\nдругий\nтретій\n", "Між файлами потрібен перенос рядка"
`),
      task("Пошук у папці",
        "Напиши <code>find_files_with(folder, word)</code>: відсортовані імена файлів .txt у папці, що містять слово (без урахування регістру). Знадобиться <code>pathlib</code>.",
        py`
from pathlib import Path

# твій код тут


Path("notes").mkdir(exist_ok=True)
Path("notes/a.txt").write_text("Python і RAG", encoding="utf-8")
Path("notes/b.txt").write_text("SQL", encoding="utf-8")
print(find_files_with("notes", "rag"))
`,
        py`
from pathlib import Path as _Path
_dir = _Path("_search")
_dir.mkdir(exist_ok=True)
for _name, _text in [("x.txt", "Про RAG і пошук"), ("y.txt", "SQL"), ("z.txt", "rag-система"), ("w.md", "rag у markdown")]:
    (_dir / _name).write_text(_text, encoding="utf-8")
assert find_files_with("_search", "RAG") == ["x.txt", "z.txt"], f"Вийшло {find_files_with('_search', 'RAG')!r}"
assert find_files_with("_search", "docker") == []
`),
    ],

    15: [
      task("Банківський рахунок",
        "Клас <code>BankAccount(owner, balance=0)</code>. <code>deposit(amount)</code> і <code>withdraw(amount)</code> кидають <code>ValueError</code> для суми ≤ 0, а <code>withdraw</code> — ще й коли бракує коштів. Кожна операція додається в <code>history</code> як кортеж («deposit» або «withdraw», сума).",
        py`
# твій код тут


account = BankAccount("Юля")
account.deposit(1000)
account.withdraw(300)
print(account.balance, account.history)
`,
        py`
_a = BankAccount("Юля", 100)
_a.deposit(50); _a.withdraw(30)
assert _a.owner == "Юля" and _a.balance == 120
assert _a.history == [("deposit", 50), ("withdraw", 30)], f"history: {_a.history!r}"
for _call in (lambda: _a.withdraw(1000), lambda: _a.deposit(0), lambda: _a.withdraw(-1)):
    try:
        _call()
    except ValueError:
        pass
    else:
        raise AssertionError("Очікую ValueError")
assert _a.balance == 120 and len(_a.history) == 2, "Невдала операція не має змінювати баланс та історію"
assert BankAccount("x").history == [], "У кожного рахунку своя історія"
`),
      task("Кошик",
        "Клас <code>Cart</code>. <code>add(name, price, qty=1)</code> — повторне додавання збільшує кількість. <code>remove(name)</code>, <code>total()</code>, <code>count()</code> — загальна кількість штук.",
        py`
# твій код тут


cart = Cart()
cart.add("Мишка", 450)
cart.add("Мишка", 450, 2)
cart.add("Кабель", 150)
print(cart.total(), cart.count())
`,
        py`
_c = Cart()
_c.add("Мишка", 450); _c.add("Мишка", 450, 2); _c.add("Кабель", 150)
assert _c.total() == 1500 and _c.count() == 4, f"Вийшло {_c.total()} і {_c.count()}"
_c.remove("Мишка")
assert _c.total() == 150 and _c.count() == 1
assert Cart().total() == 0, "У кожного кошика свій вміст"
`),
      task("Прямокутник",
        "Клас <code>Rectangle(width, height)</code> з методами <code>area()</code>, <code>perimeter()</code>, <code>is_square()</code>, <code>scale(k)</code> (повертає новий прямокутник) і <code>__str__</code> у вигляді «Rectangle(3x4)».",
        py`
# твій код тут


r = Rectangle(3, 4)
print(r, r.area(), r.perimeter())
`,
        py`
_r = Rectangle(3, 4)
assert (_r.area(), _r.perimeter(), _r.is_square()) == (12, 14, False)
_big = _r.scale(2)
assert isinstance(_big, Rectangle) and (_big.width, _big.height) == (6, 8), "scale має повертати новий прямокутник"
assert (_r.width, _r.height) == (3, 4), "scale не змінює початковий прямокутник"
assert Rectangle(5, 5).is_square() is True
assert str(_r) == "Rectangle(3x4)", f"str: {str(_r)!r}"
`),
      task("Бюджет токенів",
        "Клас <code>TokenBudget(limit)</code>. <code>use(tokens)</code> кидає <code>ValueError</code>, якщо бюджету не вистачає, і тоді нічого не змінює. <code>remaining()</code>, атрибут <code>used</code>, <code>reset()</code>.",
        py`
# твій код тут


budget = TokenBudget(1000)
budget.use(300)
print(budget.remaining())
`,
        py`
_b = TokenBudget(1000)
_b.use(300); _b.use(500)
assert _b.used == 800 and _b.remaining() == 200
try:
    _b.use(300)
except ValueError:
    pass
else:
    raise AssertionError("Перевищення має давати ValueError")
assert _b.used == 800, "Невдалий use нічого не змінює"
_b.reset()
assert _b.remaining() == 1000
`),
      task("Співробітники",
        "Клас <code>Employee(name, salary)</code> з <code>monthly_cost()</code>. <code>Manager</code> додає премію <code>bonus</code>. <code>Contractor(name, hours, rate)</code> коштує години × ставка. Функція <code>total_cost(staff)</code> рахує суму для списку.",
        py`
# твій код тут


staff = [Employee("Юля", 50000), Manager("Олег", 70000, 10000), Contractor("Ірина", 40, 500)]
print(total_cost(staff))
`,
        py`
_staff = [Employee("Юля", 50000), Manager("Олег", 70000, 10000), Contractor("Ірина", 40, 500)]
assert [_p.monthly_cost() for _p in _staff] == [50000, 80000, 20000]
assert total_cost(_staff) == 150000
assert isinstance(_staff[1], Employee) and isinstance(_staff[2], Employee), "Manager і Contractor мають наслідувати Employee"
assert _staff[2].name == "Ірина"
`),
      task("Історія чату з обмеженням",
        "Клас <code>ChatHistory(system_prompt, max_messages=6)</code>. <code>add(role, content)</code>. <code>to_list()</code> повертає системне повідомлення й останні <code>max_messages</code> інших. <code>len()</code> рахує лише несистемні збережені повідомлення.",
        py`
# твій код тут


chat = ChatHistory("Ти асистент", max_messages=2)
for i in range(4):
    chat.add("user", f"q{i}")
print(chat.to_list())
`,
        py`
_chat = ChatHistory("sys", max_messages=2)
for _i in range(4):
    _chat.add("user", f"q{_i}")
assert _chat.to_list() == [{"role": "system", "content": "sys"}, {"role": "user", "content": "q2"}, {"role": "user", "content": "q3"}], f"Вийшло {_chat.to_list()!r}"
assert len(_chat) == 2, "len — кількість збережених несистемних повідомлень"
assert len(ChatHistory("x").to_list()) == 1
`),
      task("Склад",
        "Клас <code>Inventory</code>. <code>add(sku, qty)</code>, <code>remove(sku, qty)</code> — <code>ValueError</code>, якщо товару немає або бракує. <code>low_stock(threshold)</code> — відсортовані артикули із залишком менше порогу. <code>__str__</code>: «Inventory(3 SKU, 42 pcs)». Товар із нульовим залишком зникає.",
        py`
# твій код тут


inventory = Inventory()
inventory.add("A1", 10)
inventory.add("B2", 2)
print(inventory, inventory.low_stock(5))
`,
        py`
_inv = Inventory()
_inv.add("A1", 10); _inv.add("B2", 2); _inv.add("C3", 30); _inv.add("A1", 5)
assert str(_inv) == "Inventory(3 SKU, 47 pcs)", f"str: {_inv}"
assert _inv.low_stock(5) == ["B2"] and _inv.low_stock(20) == ["A1", "B2"]
_inv.remove("B2", 2)
assert str(_inv) == "Inventory(2 SKU, 45 pcs)", "Товар із нульовим залишком має зникнути"
for _sku, _qty in [("A1", 100), ("ZZ", 1)]:
    try:
        _inv.remove(_sku, _qty)
    except ValueError:
        pass
    else:
        raise AssertionError(f"remove({_sku!r}, {_qty}) має давати ValueError")
`),
    ],

    16: [
      task("Описова статистика",
        "Напиши <code>describe(numbers)</code> через модуль <code>statistics</code>: словник mean (2 знаки), median, stdev (вибіркове відхилення, 2 знаки).",
        py`
import statistics

# твій код тут


print(describe([2, 4, 4, 4, 5, 5, 7, 9]))
`,
        py`
assert describe([2, 4, 4, 4, 5, 5, 7, 9]) == {"mean": 5.0, "median": 4.5, "stdev": 2.14}, f"Вийшло {describe([2, 4, 4, 4, 5, 5, 7, 9])!r}"
`),
      task("Днів до дати",
        "Напиши <code>days_until(target, today)</code>. Дати — рядки «РРРР-ММ-ДД». Знадобиться <code>date.fromisoformat</code>.",
        py`
from datetime import date

# твій код тут


print(days_until("2026-12-31", "2026-10-05"))
`,
        py`
assert days_until("2026-12-31", "2026-10-05") == 87
assert days_until("2026-10-05", "2026-10-05") == 0
assert days_until("2026-01-01", "2026-01-10") == -9, "Для минулої дати — від'ємне число"
`),
      task("Найчастіші слова через Counter",
        "Напиши <code>top_words(text, n=3)</code>: слова в нижньому регістрі без «.,!?», найчастіші <code>n</code> пар (слово, кількість). Використай <code>collections.Counter</code>.",
        py`
from collections import Counter

# твій код тут


print(top_words("AI, AI, AI! Python, python. RAG"))
`,
        py`
assert top_words("AI, AI, AI! Python, python. RAG") == [("ai", 3), ("python", 2), ("rag", 1)]
assert top_words("a b a", 1) == [("a", 2)]
assert "Counter" in _code
`),
      task("Формат дати",
        "Напиши <code>format_timestamp(value)</code>: «2026-10-05T14:30:00» → «05.10.2026 14:30». Знадобляться <code>datetime.fromisoformat</code> і <code>strftime</code>.",
        py`
from datetime import datetime

# твій код тут


print(format_timestamp("2026-10-05T14:30:00"))
`,
        py`
assert format_timestamp("2026-10-05T14:30:00") == "05.10.2026 14:30"
assert format_timestamp("2026-01-09T08:05:59") == "09.01.2026 08:05"
`),
      task("Поділ на навчальну й тестову вибірки",
        "Напиши <code>split_dataset(items, test_ratio=0.2, seed=42)</code>: перемішай копію через <code>random.Random(seed)</code>, перші <code>round(len × ratio)</code> — тестова вибірка. Поверни (train, test). Початковий список не змінюй.",
        py`
import random

# твій код тут


train, test = split_dataset(list(range(10)))
print(train, test)
`,
        py`
_items = list(range(20))
_train, _test = split_dataset(_items)
assert len(_test) == 4 and len(_train) == 16, f"Розміри: {len(_train)} і {len(_test)}"
assert sorted(_train + _test) == _items, "Елементи не мають губитися чи повторюватися"
assert _items == list(range(20)), "Початковий список змінився"
assert split_dataset(_items) == (_train, _test), "З тим самим seed результат має повторюватися"
assert split_dataset(_items, seed=1) != (_train, _test), "Інший seed — інше перемішування"
assert _test != _items[:4], "Елементи мають бути перемішані"
`),
      task("Генератор паролів",
        "Напиши <code>generate_password(length=12)</code> через <code>secrets</code> і <code>string</code>: лише літери й цифри, обов'язково хоча б одна мала, одна велика й одна цифра. Довжина менше 4 — <code>ValueError</code>.",
        py`
import secrets
import string

# твій код тут


print(generate_password())
`,
        py`
import string as _string
for _ in range(100):
    _p = generate_password(8)
    assert len(_p) == 8 and _p.isalnum(), f"Неправильний пароль {_p!r}"
    assert any(_c.islower() for _c in _p) and any(_c.isupper() for _c in _p) and any(_c.isdigit() for _c in _p), f"У {_p!r} бракує малої, великої літери чи цифри"
assert len({generate_password() for _ in range(20)}) == 20, "Паролі мають бути випадковими"
try:
    generate_password(3)
except ValueError:
    pass
else:
    raise AssertionError("Для довжини 3 очікую ValueError")
`),
      task("Активність за днями тижня",
        "Напиши <code>weekday_stats(dates)</code>: словник назва дня англійською (<code>strftime(\"%A\")</code>) → кількість дат.",
        py`
from collections import Counter
from datetime import date

# твій код тут


print(weekday_stats(["2026-10-05", "2026-10-06", "2026-10-12"]))
`,
        py`
assert weekday_stats(["2026-10-05", "2026-10-06", "2026-10-12"]) == {"Monday": 2, "Tuesday": 1}
assert weekday_stats([]) == {}
`),
    ],
  };

  Object.keys(more).forEach(function (n) {
    var list = window.KONSPEKT_TASKS[n] || (window.KONSPEKT_TASKS[n] = []);
    list.push.apply(list, more[n]);
  });
})();
