// Задачі до уроків. Ключ — номер теми.
// starter — код, який учень бачить у редакторі.
// tests — Python, що виконується після коду учня в тому самому просторі імен.
//   Доступно: _out (усе надруковане), _lines (рядки виводу),
//   _rerun(name=value) — запустити код учня ще раз з іншим значенням змінної.
(function () {
  var py = String.raw;

  // llm: true — задача робить справжній запит до моделі ключем учня
  function task(title, text, starter, tests, llm) {
    return { title: title, text: text, starter: starter.replace(/^\n/, ""), tests: tests, llm: !!llm };
  }

  // Запитання з варіантами: answer — номер правильного варіанта, рахуючи з нуля
  function quiz(question, options, answer, why) {
    return { question: question, options: options, answer: answer, why: why };
  }

  window.KONSPEKT_TASKS = {
    1: [
      task("Дві змінні",
        "Створи змінну <code>city</code> з назвою свого міста і змінну <code>year</code> зі значенням 2026.",
        py`
# your code here
`,
        py`
assert isinstance(city, str) and city, "city має бути непорожнім рядком"
assert year == 2026, "year має дорівнювати 2026"
`),
      task("Обмін значень",
        "Поміняй значення <code>a</code> і <code>b</code> місцями одним рядком.",
        py`
a = 5
b = 10

# your code here
`,
        py`
assert a == 10 and b == 5, f"Очікую a = 10, b = 5, а зараз a = {a}, b = {b}"
`),
      task("Зміна значення",
        "Збільш <code>score</code> на 5, а потім подвой результат. Рахуй зі старого значення, не пиши готове число.",
        py`
score = 10

# your code here
`,
        py`
assert score == 30, f"Очікую 30, а вийшло {score}"
assert _rerun(score=1)["score"] == 12, "Рахуй від змінної score, а не записуй готове число"
`),
    ],

    2: [
      task("Рядок у число",
        "Створи <code>number</code> — ціле число з рядка <code>text</code>. Потім <code>half</code> — це число, поділене на 2.",
        py`
text = "42"

# your code here
`,
        py`
assert type(number) is int and number == 42, "number має бути цілим числом 42"
assert type(half) is float and half == 21.0, "half має бути 21.0"
`),
      task("Округлення",
        "Створи <code>rounded</code> — ціну, округлену до цілого. І <code>as_text</code> — ту саму ціну як рядок.",
        py`
price = 199.99

# your code here
`,
        py`
assert type(rounded) is int and rounded == 200, "rounded має бути цілим числом 200. Спробуй round()"
assert as_text == "199.99", "as_text має бути рядком '199.99'"
`),
      task("Порожнє чи ні",
        "Через <code>bool()</code> створи три змінні: <code>has_name</code>, <code>has_count</code>, <code>has_items</code>.",
        py`
name = ""
count = 0
items = [1]

# your code here
`,
        py`
assert has_name is False, "Порожній рядок дає False"
assert has_count is False, "Нуль дає False"
assert has_items is True, "Непорожній список дає True"
`),
    ],

    3: [
      task("f-рядок",
        "Виведи через f-рядок: <code>My name is Yulia, I am 28</code>. Використай змінні.",
        py`
name = "Yulia"
age = 28

# your code here
`,
        py`
assert _lines, "Нічого не виведено. Потрібен print()"
assert _lines[-1] == "My name is Yulia, I am 28", f"Вивелось: {_lines[-1]!r}"
assert _rerun(name="Oleh", age=31)["_lines"][-1] == "My name is Oleh, I am 31", "Підставляй змінні, а не готовий текст"
`),
      task("Роздільник",
        "Виведи дату у вигляді <code>5.10.2026</code> одним <code>print</code> з параметром <code>sep</code>.",
        py`
day = 5
month = 10
year = 2026

# your code here
`,
        py`
assert _lines and _lines[-1] == "5.10.2026", f"Вивелось: {_out.strip()!r}"
assert "sep" in _code, "Використай параметр sep"
`),
      task("Формат числа",
        "Виведи: <code>Price: 1234.57 UAH</code>. Два знаки після коми зроби форматом у f-рядку.",
        py`
price = 1234.5678

# your code here
`,
        py`
assert _lines and _lines[-1] == "Price: 1234.57 UAH", f"Вивелось: {_out.strip()!r}"
assert _rerun(price=5)["_lines"][-1] == "Price: 5.00 UAH", "Формат має працювати для будь-якої ціни"
`),
    ],

    4: [
      task("Години й хвилини",
        "Із загальної кількості хвилин отримай <code>hours</code> (повні години) і <code>rest</code> (хвилини, що лишилися).",
        py`
minutes = 135

# your code here
`,
        py`
assert hours == 2 and rest == 15, f"Для 135 хвилин очікую 2 і 15, а вийшло {hours} і {rest}"
other = _rerun(minutes=59)
assert other["hours"] == 0 and other["rest"] == 59, "Для 59 хвилин очікую 0 і 59"
`),
      task("Парне число",
        "Створи <code>is_even</code>: <code>True</code>, якщо число парне, інакше <code>False</code>. Без <code>if</code>.",
        py`
number = 14

# your code here
`,
        py`
assert is_even is True, "14 — парне, очікую True"
assert _rerun(number=7)["is_even"] is False, "7 — непарне, очікую False"
`),
      task("Логічна умова",
        "Створи <code>can_enter</code>: людина заходить, якщо їй є 18, у неї є квиток і вона не заблокована.",
        py`
age = 20
has_ticket = True
is_banned = False

# your code here
`,
        py`
assert can_enter is True, "Усі умови виконано, очікую True"
assert _rerun(age=17)["can_enter"] is False, "У 17 років заходити не можна"
assert _rerun(has_ticket=False)["can_enter"] is False, "Без квитка заходити не можна"
assert _rerun(is_banned=True)["can_enter"] is False, "Заблокованим заходити не можна"
`),
    ],

    5: [
      task("Індекси та зрізи",
        "Створи <code>first</code> (перша літера), <code>last</code> (остання) і <code>reversed_word</code> (слово навпаки).",
        py`
word = "Python"

# your code here
`,
        py`
assert first == "P" and last == "n", "Перша літера P, остання n"
assert reversed_word == "nohtyP", f"Очікую 'nohtyP', а вийшло {reversed_word!r}"
other = _rerun(word="code")
assert other["last"] == "e" and other["reversed_word"] == "edoc", "Має працювати для будь-якого слова"
`),
      task("Очищення тексту",
        "Створи <code>clean</code>: той самий текст без пробілів по краях і малими літерами.",
        py`
raw = "  HeLLo, WoRLd!  "

# your code here
`,
        py`
assert clean == "hello, world!", f"Очікую 'hello, world!', а вийшло {clean!r}"
assert raw == "  HeLLo, WoRLd!  ", "Змінну raw не чіпай, результат клади в clean"
`),
      task("split і join",
        "Створи <code>tag_list</code> — список тегів без пробілів. І <code>joined</code> — рядок <code>python | ai | llm</code>.",
        py`
tags = "python, ai, llm"

# your code here
`,
        py`
assert tag_list == ["python", "ai", "llm"], f"Очікую ['python', 'ai', 'llm'], а вийшло {tag_list!r}"
assert joined == "python | ai | llm", f"Вийшло {joined!r}"
`),
    ],

    6: [
      task("Оцінка",
        "Створи <code>grade</code>: «excellent» від 90, «good» від 75, «satisfactory» від 60, інакше «failed».",
        py`
score = 82

# your code here
`,
        py`
for value, expected in [(95, "excellent"), (90, "excellent"), (82, "good"), (60, "satisfactory"), (10, "failed")]:
    got = _rerun(score=value).get("grade")
    assert got == expected, f"Для score = {value} очікую «{expected}», а вийшло {got!r}"
`),
      task("Парне чи непарне",
        "Створи <code>kind</code> зі значенням «even» або «odd».",
        py`
number = 7

# your code here
`,
        py`
for value, expected in [(7, "odd"), (10, "even"), (0, "even")]:
    got = _rerun(number=value).get("kind")
    assert got == expected, f"Для {value} очікую «{expected}», а вийшло {got!r}"
`),
      task("Діапазон",
        "Створи <code>status</code>: «cold» нижче 18, «comfortable» від 18 до 25 включно, «hot» вище 25.",
        py`
temperature = 22

# your code here
`,
        py`
for value, expected in [(17, "cold"), (18, "comfortable"), (25, "comfortable"), (26, "hot")]:
    got = _rerun(temperature=value).get("status")
    assert got == expected, f"Для {value} очікую «{expected}», а вийшло {got!r}"
`),
    ],

    7: [
      task("Сума чисел",
        "Циклом порахуй <code>total</code> — суму всіх чисел від 1 до <code>n</code> включно.",
        py`
n = 10

# your code here
`,
        py`
for value, expected in [(10, 55), (1, 1), (100, 5050)]:
    got = _rerun(n=value).get("total")
    assert got == expected, f"Для n = {value} очікую {expected}, а вийшло {got!r}"
`),
      task("Голосні",
        "Порахуй у <code>count</code>, скільки в тексті голосних літер.",
        py`
text = "programming"
vowels = "aeiou"

# your code here
`,
        py`
for value, expected in [("programming", 3), ("rhythm", 0), ("", 0)]:
    got = _rerun(text=value).get("count")
    assert got == expected, f"Для {value!r} очікую {expected}, а вийшло {got!r}"
`),
      task("while",
        "Доки <code>number</code> більше 10, діли його націло на 2. У <code>steps</code> порахуй кількість ділень.",
        py`
number = 100
steps = 0

# your code here
`,
        py`
assert number == 6 and steps == 4, f"Для 100 очікую number = 6, steps = 4, а вийшло {number} і {steps}"
other = _rerun(number=5)
assert other["number"] == 5 and other["steps"] == 0, "Для 5 цикл не має виконатися жодного разу"
`),
    ],

    8: [
      task("Парні числа",
        "Створи список <code>even</code> лише з парних чисел.",
        py`
numbers = [4, 8, 15, 16, 23, 42]

# your code here
`,
        py`
assert even == [4, 8, 16, 42], f"Очікую [4, 8, 16, 42], а вийшло {even!r}"
assert _rerun(numbers=[1, 2, 3])["even"] == [2], "Для [1, 2, 3] очікую [2]"
`),
      task("Зміна списку",
        "Додай 300 у кінець списку, видали 250, а суму того, що лишилося, поклади в <code>total</code>.",
        py`
prices = [100, 250, 50]

# your code here
`,
        py`
assert prices == [100, 50, 300], f"Очікую [100, 50, 300], а вийшло {prices!r}"
assert total == 450, f"Очікую total = 450, а вийшло {total!r}"
`),
      task("Генератор списку",
        "Створи <code>lengths</code> — список довжин слів. І <code>longest</code> — найдовше слово.",
        py`
words = ["ai", "python", "llm", "rag"]

# your code here
`,
        py`
assert lengths == [2, 6, 3, 3], f"Очікую [2, 6, 3, 3], а вийшло {lengths!r}"
assert longest == "python", f"Очікую 'python', а вийшло {longest!r}"
other = _rerun(words=["a", "bbb"])
assert other["lengths"] == [1, 3] and other["longest"] == "bbb", "Має працювати для будь-якого списку"
`),
    ],

    9: [
      task("Розпакування",
        "Розпакуй кортеж у змінні <code>name</code>, <code>age</code>, <code>city</code> одним рядком.",
        py`
user = ("Yulia", 28, "Kyiv")

# your code here
`,
        py`
assert (name, age, city) == ("Yulia", 28, "Kyiv"), "Значення не збігаються з кортежем"
`),
      task("Новий кортеж",
        "Кортеж змінити не можна. Створи новий <code>moved</code>, де перше число більше на 10, а друге те саме.",
        py`
point = (3, 7)

# your code here
`,
        py`
assert type(moved) is tuple, "moved має бути кортежем"
assert moved == (13, 7), f"Очікую (13, 7), а вийшло {moved!r}"
assert _rerun(point=(0, 0))["moved"] == (10, 0), "Рахуй від point, а не записуй готові числа"
`),
      task("Цикл із розпакуванням",
        "Знайди у <code>best</code> назву з найбільшим числом. Перебирай пари циклом <code>for name, score in pairs</code>.",
        py`
pairs = [("python", 3), ("ai", 5), ("sql", 1)]

# your code here
`,
        py`
assert best == "ai", f"Очікую 'ai', а вийшло {best!r}"
assert _rerun(pairs=[("a", 1), ("b", 9)])["best"] == "b", "Має працювати для будь-якого списку пар"
`),
    ],

    10: [
      task("Зміна словника",
        "Додай ключ <code>city</code> зі значенням «Kyiv», збільш <code>age</code> на 1. У <code>email</code> поклади пошту через <code>get</code> із запасним значенням «not set».",
        py`
user = {"name": "Yulia", "age": 28}

# your code here
`,
        py`
assert user.get("city") == "Kyiv", "У словнику має з'явитися city = 'Kyiv'"
assert user.get("age") == 29, "age має стати 29"
assert email == "not set", f"Очікую 'not set', а вийшло {email!r}"
`),
      task("Підрахунок",
        "Збери словник <code>counts</code>: слово → скільки разів воно трапилося.",
        py`
words = ["ai", "python", "ai", "llm", "ai"]

# your code here
`,
        py`
assert counts == {"ai": 3, "python": 1, "llm": 1}, f"Вийшло {counts!r}"
assert _rerun(words=["x", "x"])["counts"] == {"x": 2}, "Має працювати для будь-якого списку"
`),
      task("Вкладені дані",
        "Збери список <code>python_users</code> з іменами тих, у кого серед навичок є python.",
        py`
users = [
    {"name": "Yulia", "skills": ["python", "sql"]},
    {"name": "Oleh", "skills": ["js"]},
    {"name": "Iryna", "skills": ["python", "git", "docker"]},
]

# your code here
`,
        py`
assert python_users == ["Yulia", "Iryna"], f"Очікую ['Yulia', 'Iryna'], а вийшло {python_users!r}"
`),
    ],

    11: [
      task("Унікальні",
        "Порахуй у <code>unique_count</code>, скільки в списку різних тегів.",
        py`
tags = ["ai", "python", "ai", "llm", "python"]

# your code here
`,
        py`
assert unique_count == 3, f"Очікую 3, а вийшло {unique_count!r}"
assert _rerun(tags=["a", "a", "a"])["unique_count"] == 1, "Має працювати для будь-якого списку"
`),
      task("Операції",
        "Створи <code>common</code> (навички обох), <code>only_yulia</code> (є лише в Юлі) та <code>all_skills</code> (усі разом).",
        py`
yulia = {"python", "sql", "git"}
oleh = {"js", "git", "sql"}

# your code here
`,
        py`
assert common == {"sql", "git"}, f"common: вийшло {common!r}"
assert only_yulia == {"python"}, f"only_yulia: вийшло {only_yulia!r}"
assert all_skills == {"python", "sql", "git", "js"}, f"all_skills: вийшло {all_skills!r}"
`),
      task("Тільки нові",
        "Додай у <code>seen</code> теги з <code>new_tags</code>. У <code>added</code> порахуй, скільки з них справді були новими.",
        py`
seen = {"ai", "python"}
new_tags = ["llm", "ai", "rag", "python", "llm"]
added = 0

# your code here
`,
        py`
assert seen == {"ai", "python", "llm", "rag"}, f"seen: вийшло {seen!r}"
assert added == 2, f"Нових було 2 (llm і rag), а вийшло {added!r}"
`),
    ],

    12: [
      task("return",
        "Напиши функцію <code>add(a, b)</code>, яка повертає суму.",
        py`
# your code here


print(add(2, 3))
`,
        py`
assert add(2, 3) is not None, "Функція повертає None. Результат треба віддати через return, а не print"
assert add(2, 3) == 5 and add(-1, 1) == 0, "Сума рахується неправильно"
`),
      task("Значення за замовчуванням",
        "Напиши <code>greet(name, greeting)</code>, яка повертає рядок на зразок <code>Hello, Yulia!</code>. Якщо привітання не передали, бери «Hello».",
        py`
# your code here


print(greet("Yulia"))
print(greet("Yulia", "Good afternoon"))
`,
        py`
assert greet("Yulia") == "Hello, Yulia!", f"greet('Yulia') повернула {greet('Yulia')!r}"
assert greet("Oleh", "Hi") == "Hi, Oleh!", f"greet('Oleh', 'Hi') повернула {greet('Oleh', 'Hi')!r}"
`),
      task("Кілька значень",
        "Напиши <code>min_max(numbers)</code>, яка повертає найменше й найбільше число списку.",
        py`
# your code here


low, high = min_max([4, 8, 15])
print(low, high)
`,
        py`
assert min_max([4, 8, 15]) == (4, 15), f"Для [4, 8, 15] очікую (4, 15), а вийшло {min_max([4, 8, 15])!r}"
assert min_max([7]) == (7, 7), "Для [7] очікую (7, 7)"
`),
    ],

    13: [
      task("Безпечне перетворення",
        "Напиши <code>to_int(text)</code>: повертає ціле число, а якщо рядок не є цілим числом — <code>None</code>.",
        py`
# your code here


print(to_int("42"))
print(to_int("abc"))
`,
        py`
assert to_int("42") == 42, "to_int('42') має повернути 42"
assert to_int("abc") is None, "to_int('abc') має повернути None"
assert to_int("3.7") is None, "to_int('3.7') має повернути None"
`),
      task("Ділення",
        "Напиши <code>safe_divide(a, b)</code>: повертає результат ділення, а при діленні на нуль — рядок «Division by zero».",
        py`
# your code here


print(safe_divide(10, 2))
print(safe_divide(10, 0))
`,
        py`
assert safe_divide(10, 2) == 5, "safe_divide(10, 2) має повернути 5.0"
assert safe_divide(10, 0) == "Division by zero", f"При діленні на нуль вийшло {safe_divide(10, 0)!r}"
`),
      task("raise",
        "Напиши <code>set_temperature(value)</code>: повертає значення, якщо воно від 0 до 2 включно. Інакше кидає <code>ValueError</code>.",
        py`
# your code here


print(set_temperature(0.7))
`,
        py`
assert set_temperature(0.7) == 0.7 and set_temperature(0) == 0 and set_temperature(2) == 2, "Значення від 0 до 2 треба повертати"
for bad in (5, -1):
    try:
        set_temperature(bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"Для {bad} має бути ValueError")
`),
    ],

    14: [
      task("Запис",
        "Напиши <code>save_lines(path, lines)</code>: записує кожен елемент списку окремим рядком у файл. Кодування utf-8.",
        py`
# your code here


save_lines("notes.txt", ["first", "second"])
print(open("notes.txt", encoding="utf-8").read())
`,
        py`
save_lines("_check.txt", ["a", "b", "c"])
with open("_check.txt", encoding="utf-8") as _file:
    _content = _file.read()
assert _content.splitlines() == ["a", "b", "c"], f"У файлі опинилося: {_content!r}"
`),
      task("Читання",
        "Напиши <code>count_lines(path)</code>: повертає кількість непорожніх рядків у файлі. Якщо файлу немає — 0.",
        py`
# your code here


print(count_lines("no_such_file.txt"))
`,
        py`
with open("_check.txt", "w", encoding="utf-8") as _file:
    _file.write("one\n\ntwo\n   \nthree\n")
assert count_lines("_check.txt") == 3, f"У файлі 3 непорожні рядки, а вийшло {count_lines('_check.txt')!r}"
assert count_lines("_no_such_file.txt") == 0, "Для неіснуючого файлу має бути 0"
`),
      task("Дописування",
        "Напиши <code>append_log(path, message)</code>: дописує повідомлення окремим рядком у кінець файлу. Старий вміст має лишитися.",
        py`
# your code here


append_log("log.txt", "start")
append_log("log.txt", "done")
print(open("log.txt", encoding="utf-8").read())
`,
        py`
with open("_check.txt", "w", encoding="utf-8") as _file:
    _file.write("first\n")
append_log("_check.txt", "second")
append_log("_check.txt", "third")
with open("_check.txt", encoding="utf-8") as _file:
    _content = _file.read()
assert _content.splitlines() == ["first", "second", "third"], f"У файлі опинилося: {_content!r}"
`),
    ],

    15: [
      task("Клас зі станом",
        "Напиши клас <code>Counter</code>. На старті <code>value</code> дорівнює 0. Метод <code>increment()</code> додає 1, <code>reset()</code> повертає до 0.",
        py`
# your code here


counter = Counter()
counter.increment()
counter.increment()
print(counter.value)
`,
        py`
_c = Counter()
assert _c.value == 0, "На старті value має бути 0"
_c.increment(); _c.increment()
assert _c.value == 2, "Після двох increment() очікую 2"
_c.reset()
assert _c.value == 0, "Після reset() очікую 0"
assert Counter().value == 0, "У кожного об'єкта має бути свій лічильник"
`),
      task("Методи",
        "Напиши клас <code>User</code> з атрибутами <code>name</code> і <code>age</code>. Метод <code>greet()</code> повертає <code>Hi, I am Yulia</code>, <code>birthday()</code> додає рік.",
        py`
# your code here


user = User("Yulia", 28)
user.birthday()
print(user.greet(), user.age)
`,
        py`
_u = User("Oleh", 30)
assert _u.name == "Oleh" and _u.age == 30, "Атрибути name і age мають зберігатися в об'єкті"
assert _u.greet() == "Hi, I am Oleh", f"greet() повернув {_u.greet()!r}"
_u.birthday()
assert _u.age == 31, "Після birthday() вік має зрости на 1"
`),
      task("Наслідування",
        "Напиши клас <code>Dog</code>, який наслідує <code>Animal</code>. Його <code>speak()</code> повертає «Woof». Ім'я передай батьківському класу через <code>super()</code>.",
        py`
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."


# your code here


dog = Dog("Rex")
print(dog.name, dog.speak())
`,
        py`
_d = Dog("Rex")
assert isinstance(_d, Animal), "Dog має наслідувати Animal"
assert _d.name == "Rex", "Ім'я має зберігатися"
assert _d.speak() == "Woof", f"speak() повернув {_d.speak()!r}"
assert Animal("x").speak() == "...", "Клас Animal не змінюй"
`),
    ],

    16: [
      task("math",
        "Напиши <code>circle_area(radius)</code>: площа круга, округлена до 2 знаків. Число π візьми з модуля <code>math</code>.",
        py`
# your code here


print(circle_area(1))
`,
        py`
assert circle_area(1) == 3.14, f"Для радіуса 1 очікую 3.14, а вийшло {circle_area(1)!r}"
assert circle_area(2) == 12.57, f"Для радіуса 2 очікую 12.57, а вийшло {circle_area(2)!r}"
assert "math" in _code, "Використай модуль math"
`),
      task("datetime",
        "Напиши <code>is_weekend(year, month, day)</code>: <code>True</code>, якщо дата припадає на суботу чи неділю. Метод <code>date(...).weekday()</code> повертає 0 для понеділка і 6 для неділі.",
        py`
from datetime import date

# your code here


print(is_weekend(2026, 10, 5))
`,
        py`
assert is_weekend(2026, 10, 5) is False, "5 жовтня 2026 — понеділок"
assert is_weekend(2026, 10, 10) is True, "10 жовтня 2026 — субота"
assert is_weekend(2026, 10, 11) is True, "11 жовтня 2026 — неділя"
`),
      task("random",
        "Напиши <code>pick_two(items)</code>: повертає список із двох різних випадкових елементів. Підійде <code>random.sample</code>.",
        py`
import random

# your code here


print(pick_two(["gpt", "claude", "gemini", "llama"]))
`,
        py`
_items = ["a", "b", "c", "d"]
for _ in range(20):
    _picked = pick_two(_items)
    assert len(_picked) == 2, "Має бути рівно два елементи"
    assert _picked[0] != _picked[1], "Елементи мають бути різними"
    assert all(item in _items for item in _picked), "Елементи мають бути зі списку"
`),
    ],

    17: [
      task("loads",
        "Напиши <code>get_name(text)</code>: отримує рядок JSON і повертає значення ключа <code>name</code>.",
        py`
import json

# your code here


print(get_name('{"name": "Yulia", "age": 28}'))
`,
        py`
assert get_name('{"name": "Yulia", "age": 28}') == "Yulia", "Для прикладу очікую 'Yulia'"
assert get_name('{"age": 1, "name": "Oleh"}') == "Oleh", "Має працювати для будь-якого JSON з ключем name"
`),
      task("dumps",
        "Напиши <code>to_json(data)</code>: повертає рядок JSON, у якому кирилиця лишається читабельною.",
        py`
import json

# your code here


print(to_json({"name": "Yulia", "skills": ["python"]}))
`,
        py`
import json as _json
_data = {"name": "Yulia", "skills": ["python"], "active": True}
_text = to_json(_data)
assert isinstance(_text, str), "Функція має повертати рядок"
assert _json.loads(_text) == _data, "З рядка має відновлюватися той самий словник"
assert "Yulia" in _text, "Кирилиця закодована. Подивись на параметр ensure_ascii"
`),
      task("Зламаний JSON",
        "Напиши <code>parse_answer(answer)</code>: повертає словник, а якщо текст не є JSON — <code>None</code>.",
        py`
import json

# your code here


print(parse_answer('{"sentiment": "positive"}'))
print(parse_answer("Sure! Here is the result"))
`,
        py`
assert parse_answer('{"sentiment": "positive"}') == {"sentiment": "positive"}, "Правильний JSON треба повернути словником"
assert parse_answer("Sure! Here is the result") is None, "Для звичайного тексту має бути None"
assert parse_answer("{'a': 1}") is None, "Одинарні лапки — це не JSON, має бути None"
`),
    ],

    19: [
      task("findall",
        "Напиши <code>find_numbers(text)</code>: повертає список усіх цілих чисел з тексту. Саме чисел, не рядків.",
        py`
import re

# your code here


print(find_numbers("Prices: 120 UAH, 85 UAH and 1500 UAH"))
`,
        py`
assert find_numbers("Prices: 120 UAH, 85 UAH and 1500 UAH") == [120, 85, 1500], f"Вийшло {find_numbers('Prices: 120 UAH, 85 UAH and 1500 UAH')!r}"
assert find_numbers("no numbers here") == [], "Якщо чисел немає, має бути порожній список"
`),
      task("Перевірка формату",
        "Напиши <code>is_phone(text)</code>: <code>True</code>, якщо весь рядок має вигляд <code>+380</code> і ще рівно 9 цифр.",
        py`
import re

# your code here


print(is_phone("+380501234567"))
`,
        py`
assert is_phone("+380501234567") is True, "+380501234567 — правильний номер"
assert is_phone("+38050123456") is False, "Тут на одну цифру менше"
assert is_phone("380501234567") is False, "Тут немає плюса"
assert is_phone("tel: +380501234567") is False, "Весь рядок має бути номером. Спробуй re.fullmatch"
`),
      task("JSON із відповіді моделі",
        "Напиши <code>extract_json(answer)</code>: знаходить у тексті JSON-об'єкт і повертає його словником. Якщо об'єкта немає або він зламаний — <code>None</code>.",
        py`
import json
import re

# your code here


print(extract_json('Here is the result: {"score": 8} Have a nice day!'))
`,
        py`
assert extract_json('Here is the result: {"score": 8} Have a nice day!') == {"score": 8}, "JSON серед тексту не знайдено"
assert extract_json('{\n  "a": 1,\n  "b": [1, 2]\n}') == {"a": 1, "b": [1, 2]}, "JSON на кілька рядків не знайдено. Подивись на re.DOTALL"
assert extract_json("No JSON here") is None, "Якщо JSON немає, має бути None"
assert extract_json("Here: {broken}") is None, "Якщо JSON зламаний, має бути None"
`),
    ],

    20: [
      task("sorted з key",
        "Напиши <code>sort_by_score(docs)</code>: повертає новий список документів від найбільшого <code>score</code> до найменшого.",
        py`
# your code here


docs = [{"title": "Report", "score": 0.72}, {"title": "Contract", "score": 0.91}]
print(sort_by_score(docs))
`,
        py`
_docs = [{"t": "a", "score": 0.5}, {"t": "b", "score": 0.9}, {"t": "c", "score": 0.1}]
_sorted = sort_by_score(_docs)
assert [d["t"] for d in _sorted] == ["b", "a", "c"], f"Порядок вийшов {[d['t'] for d in _sorted]}"
assert [d["t"] for d in _docs] == ["a", "b", "c"], "Початковий список не змінюй, поверни новий"
`),
      task("Замикання",
        "Напиши <code>make_multiplier(factor)</code>: повертає функцію, яка множить своє число на <code>factor</code>.",
        py`
# your code here


double = make_multiplier(2)
print(double(10))
`,
        py`
_double, _triple = make_multiplier(2), make_multiplier(3)
assert callable(_double), "make_multiplier має повертати функцію"
assert _double(10) == 20 and _triple(10) == 30, "Кожна функція має пам'ятати свій множник"
`),
      task("Декоратор",
        "Напиши декоратор <code>shout</code>: обгорнута функція повертає той самий текст, але великими літерами.",
        py`
# your code here


@shout
def hello(name):
    return f"hello, {name}"


print(hello("Yulia"))
`,
        py`
assert hello("Yulia") == "HELLO, YULIA", f"hello('Yulia') повернула {hello('Yulia')!r}"
_joined = shout(lambda a, b: a + " " + b)
assert _joined("one", "two") == "ONE TWO", "Декоратор має пропускати будь-які аргументи: *args, **kwargs"
`),
    ],

    31: [
      task("Косинусна схожість",
        "Напиши <code>cosine_similarity(a, b)</code> для двох списків чисел однакової довжини.",
        py`
import math

# your code here


print(cosine_similarity([1, 0], [1, 0]))
`,
        py`
assert abs(cosine_similarity([1, 0], [1, 0]) - 1) < 1e-9, "Однакові вектори мають схожість 1"
assert abs(cosine_similarity([1, 0], [0, 1])) < 1e-9, "Перпендикулярні вектори мають схожість 0"
assert round(cosine_similarity([0.9, 0.1, 0.3], [0.1, 0.9, 0.2]), 3) == 0.271, "Для прикладу з уроку очікую 0.271"
`),
      task("Найближчий документ",
        "Напиши <code>most_similar(query, docs)</code>: повертає назву документа, вектор якого найближчий до <code>query</code>. <code>docs</code> — словник «назва → вектор».",
        py`
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))

# your code here


docs = {"cat": [0.9, 0.1, 0.3], "car": [0.1, 0.9, 0.2]}
print(most_similar([0.85, 0.15, 0.35], docs))
`,
        py`
_docs = {"cat": [0.9, 0.1, 0.3], "car": [0.1, 0.9, 0.2], "tree": [0.2, 0.2, 0.9]}
assert most_similar([0.85, 0.15, 0.35], _docs) == "cat", "До [0.85, 0.15, 0.35] найближча «cat»"
assert most_similar([0.0, 1.0, 0.1], _docs) == "car", "До [0, 1, 0.1] найближча «car»"
assert most_similar([0.1, 0.1, 1.0], _docs) == "tree", "До [0.1, 0.1, 1] найближче «tree»"
`),
      task("Вартість запиту",
        "Напиши <code>estimate_cost(input_tokens, output_tokens, input_price, output_price)</code>. Ціни задано в доларах за мільйон токенів. Результат округли до 4 знаків.",
        py`
# your code here


print(estimate_cost(1000, 500, 3, 15))
`,
        py`
assert estimate_cost(1000, 500, 3, 15) == 0.0105, f"Для 1000 вхідних і 500 вихідних очікую 0.0105, а вийшло {estimate_cost(1000, 500, 3, 15)!r}"
assert estimate_cost(1_000_000, 0, 3, 15) == 3.0, "Мільйон вхідних токенів по 3 долари — це 3.0"
`),
    ],

    32: [
      task("Дані окремо від інструкцій",
        "Напиши <code>build_prompt(review)</code>: повертає промпт з інструкцією визначити тональність і самим відгуком усередині тегів <code>&lt;review&gt;</code> і <code>&lt;/review&gt;</code>.",
        py`
# your code here


print(build_prompt("Loved it, thanks!"))
`,
        py`
for _text in ["Loved it, thanks!", "Terrible service"]:
    _prompt = build_prompt(_text)
    assert "<review>" in _prompt and "</review>" in _prompt, "У промпті мають бути теги <review> і </review>"
    assert _prompt.index("<review>") < _prompt.index(_text) < _prompt.index("</review>"), "Відгук має стояти між тегами"
    assert len(_prompt.replace(_text, "")) > 40, "Додай інструкцію: що зробити і в якому форматі відповісти"
`),
      task("Few-shot",
        "Напиши <code>build_few_shot(examples, text)</code>. Кожен приклад — це два рядки: <code>Review: ...</code> і <code>Sentiment: ...</code>. Між прикладами порожній рядок. У кінці новий відгук і <code>Sentiment:</code> без відповіді.",
        py`
# your code here


examples = [("All great!", "positive"), ("Terrible", "negative")]
print(build_few_shot(examples, "Received on Tuesday"))
`,
        py`
_expected = "Review: All great!\nSentiment: positive\n\nReview: Terrible\nSentiment: negative\n\nReview: Received on Tuesday\nSentiment:"
_got = build_few_shot([("All great!", "positive"), ("Terrible", "negative")], "Received on Tuesday")
assert _got.strip() == _expected, f"Очікую:\n{_expected}\n\nА вийшло:\n{_got}"
assert build_few_shot([], "Test").strip() == "Review: Test\nSentiment:", "Без прикладів має лишитися тільки новий відгук"
`),
      task("Системний промпт для справжньої моделі",
        "Напиши системний промпт <code>SYSTEM</code>, з яким модель відповідає на відгук рівно одним словом: <code>positive</code>, <code>negative</code> або <code>neutral</code>. Функція <code>ask_model(prompt, system=...)</code> надсилає запит твоїм ключем.",
        py`
SYSTEM = """
Write the instructions for the model here.
"""

print(ask_model("Delivery was a week late, terrible", system=SYSTEM, max_tokens=20))
`,
        py`
for _review, _label in [
    ("Everything is great, I will order again!", "positive"),
    ("The product broke on day two and I got no refund.", "negative"),
    ("Received the order on Tuesday.", "neutral"),
]:
    _answer = ask_model(_review, system=SYSTEM, max_tokens=20).strip()
    assert _answer.lower().strip(".") == _label, f"На відгук «{_review}» модель відповіла {_answer!r}, а очікую рівно {_label}"
`, true),
    ],

    33: [
      task("Розмова з історією",
        "Напиши <code>chat(client, messages, user_text)</code>. Функція додає в <code>messages</code> повідомлення користувача, викликає <code>client.messages.create(model=..., max_tokens=..., messages=messages)</code>, додає відповідь з роллю <code>assistant</code> і повертає її текст. <code>FakeClient</code> — підставна модель, що відповідає заготовленими рядками.",
        py`
# your code here


client = FakeClient(["Hi, Yulia!", "Your name is Yulia."])
messages = []
print(chat(client, messages, "My name is Yulia."))
print(chat(client, messages, "What is my name?"))
print(len(messages))
`,
        py`
_client = FakeClient(["first", "second"])
_messages = []
assert chat(_client, _messages, "Q1") == "first", "Функція має повертати текст відповіді: response.content[0].text"
assert _messages == [{"role": "user", "content": "Q1"}, {"role": "assistant", "content": "first"}], f"Після першого виклику історія така: {_messages!r}"
assert chat(_client, _messages, "Q2") == "second"
assert len(_messages) == 4, "Після двох викликів в історії має бути 4 повідомлення"
assert len(_client.calls[1]["messages"]) == 3, "У другому запиті модель має отримати всю історію: два старі повідомлення і нове"
assert "model" in _client.calls[0] and "max_tokens" in _client.calls[0], "Передай у create параметри model і max_tokens"
`),
      task("Structured output",
        "Напиши <code>analyze(client, text)</code>: надсилає текст моделі й повертає її відповідь як словник. Якщо модель повернула не JSON — <code>None</code>.",
        py`
import json

# your code here


print(analyze(FakeClient(['{"sentiment": "positive", "score": 0.9}']), "All great"))
print(analyze(FakeClient(["Sure! This is a positive review."]), "All great"))
`,
        py`
assert analyze(FakeClient(['{"sentiment": "positive", "score": 0.9}']), "text") == {"sentiment": "positive", "score": 0.9}, "Правильний JSON треба повернути словником"
assert analyze(FakeClient(["Sure! This is a positive review."]), "text") is None, "Якщо відповідь не JSON, має бути None"
_client = FakeClient(["{}"])
analyze(_client, "my review")
assert "my review" in str(_client.calls[0]["messages"]), "Текст відгуку має потрапити в messages"
`),
      task("Retry",
        "Напиши <code>ask_with_retry(client, messages, attempts=3)</code>: повертає текст відповіді. Якщо виклик кинув <code>ConnectionError</code>, пробує ще раз. Коли спроби закінчилися, пропускає помилку далі. Між спробами роби паузу <code>time.sleep(2 ** attempt)</code>.",
        py`
import time

# your code here


client = FakeClient([ConnectionError("failure"), "done"])
print(ask_with_retry(client, [{"role": "user", "content": "Hello"}]))
`,
        py`
import time as _time
_pauses = []
_real_sleep = _time.sleep
_time.sleep = _pauses.append
try:
    _client = FakeClient([ConnectionError("1"), ConnectionError("2"), "done"])
    assert ask_with_retry(_client, [{"role": "user", "content": "x"}]) == "done", "Після двох збоїв третя спроба має повернути відповідь"
    assert len(_client.calls) == 3, f"Очікую 3 виклики, а було {len(_client.calls)}"
    assert len(_pauses) == 2, "Між спробами має бути пауза через time.sleep"
    _client = FakeClient([ConnectionError("1"), ConnectionError("2"), ConnectionError("3"), "late"])
    try:
        ask_with_retry(_client, [{"role": "user", "content": "x"}], attempts=3)
    except ConnectionError:
        pass
    else:
        raise AssertionError("Після трьох невдач помилку треба пропустити далі через raise")
    assert len(_client.calls) == 3, "Викликів має бути рівно стільки, скільки спроб"
finally:
    _time.sleep = _real_sleep
`),
      task("Справжній запит",
        "Постав моделі своє запитання й поклади відповідь в <code>answer</code>. Потім постав уточнювальне запитання, передавши першу пару повідомлень через <code>history</code>, і поклади відповідь у <code>second</code>.",
        py`
question = "Explain in one sentence what an API is."

answer = ask_model(question, system="Answer in Ukrainian.")
print(answer)

history = [
    {"role": "user", "content": question},
    {"role": "assistant", "content": answer},
]

# ask a follow-up question with history and save the answer in second
`,
        py`
assert isinstance(answer, str) and answer.strip(), "answer має містити відповідь моделі"
assert isinstance(second, str) and second.strip(), "second має містити відповідь на уточнювальне запитання"
assert second != answer, "Друга відповідь збігається з першою. Постав інше запитання"
assert _code.count("history") >= 2, "Передай історію в ask_model через параметр history"
`, true),
    ],

    34: [
      task("Chunking",
        "Напиши <code>split_text(text, chunk_size, overlap)</code>: ріже текст на шматки по <code>chunk_size</code> символів, кожен наступний починається на <code>chunk_size - overlap</code> символів далі.",
        py`
# your code here


print(split_text("abcdefghij", 4, 2))
`,
        py`
assert split_text("abcdefghij", 4, 2) == ["abcd", "cdef", "efgh", "ghij", "ij"], f"Для 'abcdefghij' вийшло {split_text('abcdefghij', 4, 2)!r}"
assert [len(c) for c in split_text("a" * 1200, 500, 100)] == [500, 500, 400], "Для тексту з 1200 символів очікую шматки 500, 500, 400"
assert split_text("", 10, 2) == [], "Для порожнього тексту має бути порожній список"
`),
      task("Retrieval",
        "Напиши <code>retrieve(query, chunks, k)</code>: повертає тексти <code>k</code> шматків, найближчих до вектора <code>query</code>, від найближчого. Кожен шматок — словник з ключами <code>text</code> і <code>vector</code>.",
        py`
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))

# your code here


chunks = [
    {"text": "Delivery 1–3 days", "vector": [0.9, 0.1]},
    {"text": "Pay by card", "vector": [0.1, 0.9]},
]
print(retrieve([1, 0], chunks, 1))
`,
        py`
_chunks = [
    {"text": "delivery", "vector": [0.9, 0.1, 0.0]},
    {"text": "payment", "vector": [0.1, 0.9, 0.0]},
    {"text": "returns", "vector": [0.6, 0.5, 0.2]},
]
assert retrieve([1, 0, 0], _chunks, 1) == ["delivery"], f"Найближчий до [1, 0, 0] — «delivery», а вийшло {retrieve([1, 0, 0], _chunks, 1)!r}"
assert retrieve([1, 0, 0], _chunks, 2) == ["delivery", "returns"], "Два найближчі до [1, 0, 0]: «delivery», потім «returns»"
assert retrieve([0, 1, 0], _chunks, 3) == ["payment", "returns", "delivery"], "Порядок має бути від найближчого до найдальшого"
`),
      task("Промпт із контекстом",
        "Напиши <code>build_rag_prompt(question, chunks)</code>. Знайдені шматки мають стояти всередині тегів <code>&lt;context&gt;</code>, запитання — після закривного тегу. Додай вказівку відповідати лише за контекстом.",
        py`
# your code here


print(build_rag_prompt("How long to wait?", ["Delivery: 1–3 days.", "Pay by card."]))
`,
        py`
_chunks = ["Delivery: 1–3 days.", "Pay by card."]
_prompt = build_rag_prompt("How long to wait?", _chunks)
assert "<context>" in _prompt and "</context>" in _prompt, "Потрібні теги <context> і </context>"
_start, _end = _prompt.index("<context>"), _prompt.index("</context>")
for _chunk in _chunks:
    assert _start < _prompt.index(_chunk) < _end, f"Шматок «{_chunk}» має стояти всередині тегів"
assert _prompt.index(_chunks[0]) < _prompt.index(_chunks[1]), "Збережи порядок шматків"
assert _prompt.index("How long to wait?") > _end, "Запитання має йти після </context>"
`),
    ],

    37: [
      task("Виклик інструменту",
        "Напиши <code>run_tool(name, arguments, functions)</code>: викликає функцію зі словника <code>functions</code> з аргументами <code>arguments</code> і повертає результат рядком. Якщо інструменту немає або він упав, повертає рядок, що починається з <code>Error:</code>. Програма падати не повинна.",
        py`
def get_weather(city):
    data = {"Kyiv": "+12, cloudy", "Lviv": "+9, rain"}
    return data[city]

# your code here


functions = {"get_weather": get_weather}
print(run_tool("get_weather", {"city": "Kyiv"}, functions))
print(run_tool("get_time", {}, functions))
`,
        py`
_functions = {"get_weather": get_weather, "add": lambda a, b: a + b}
assert run_tool("get_weather", {"city": "Kyiv"}, _functions) == "+12, cloudy", "Результат інструменту треба повернути"
assert run_tool("add", {"a": 2, "b": 3}, _functions) == "5", "Результат має бути рядком"
assert run_tool("get_time", {}, _functions).startswith("Error:"), "Для невідомого інструменту поверни рядок, що починається з «Error:»"
assert run_tool("get_weather", {"city": "Odesa"}, _functions).startswith("Error:"), "Якщо інструмент упав, поверни рядок з «Error:», а не падай"
`),
      task("Цикл агента",
        "Напиши <code>run_agent(client, question, functions, max_steps=5)</code> за схемою з уроку. Поки <code>stop_reason</code> дорівнює <code>tool_use</code>: додай відповідь моделі в історію, виконай кожен блок <code>tool_use</code> і надішли результати повідомленням користувача. Поверни текст фінальної відповіді. Якщо кроки вичерпано — рядок <code>Could not finish</code>.",
        py`
def get_weather(city):
    data = {"Kyiv": "+12, cloudy", "Lviv": "+9, rain"}
    return data.get(city, "no data")

# your code here


client = FakeClient([
    {"tool": "get_weather", "input": {"city": "Kyiv"}},
    {"tool": "get_weather", "input": {"city": "Lviv"}},
    "It is warmer in Kyiv.",
])
print(run_agent(client, "Where is it warmer?", {"get_weather": get_weather}))
`,
        py`
_seen = []
def _weather(city):
    _seen.append(city)
    return {"Kyiv": "+12, cloudy", "Lviv": "+9, rain"}[city]

_client = FakeClient([
    {"tool": "get_weather", "input": {"city": "Kyiv"}},
    {"tool": "get_weather", "input": {"city": "Lviv"}},
    "It is warmer in Kyiv.",
])
assert run_agent(_client, "Where is it warmer?", {"get_weather": _weather}) == "It is warmer in Kyiv.", "Поверни текст останньої відповіді моделі"
assert _seen == ["Kyiv", "Lviv"], f"Інструмент мав викликатися для Києва і Львова, а викликався для {_seen}"
assert len(_client.calls) == 3, f"Очікую 3 запити до моделі, а було {len(_client.calls)}"
_second = _client.calls[1]["messages"]
assert _second[0] == {"role": "user", "content": "Where is it warmer?"}, "Перше повідомлення — запитання користувача"
assert _second[1]["role"] == "assistant", "Після запитання в історії має бути відповідь моделі з блоком tool_use"
_result = _second[2]["content"][0]
assert _second[2]["role"] == "user" and _result["type"] == "tool_result", "Результати інструментів надсилаються повідомленням user з блоками tool_result"
assert _result["tool_use_id"] == "toolu_1", "У tool_result має бути tool_use_id з блока, на який він відповідає"
assert "+12" in str(_result["content"]), "У tool_result має бути результат інструменту"

_loop = FakeClient([{"tool": "get_weather", "input": {"city": "Kyiv"}}], repeat=True)
assert run_agent(_loop, "x", {"get_weather": _weather}, max_steps=3) == "Could not finish", "Якщо модель без кінця просить інструменти, зупинись після max_steps"
assert len(_loop.calls) == 3, "Запитів до моделі має бути рівно max_steps"
`),
    ],

    38: [
      task("async і await",
        "Напиши корутину <code>double_later(x)</code>: чекає 0.1 секунди через <code>asyncio.sleep</code> і повертає подвоєне число. У браузері замість <code>asyncio.run(main())</code> пишуть просто <code>await</code> на верхньому рівні.",
        py`
import asyncio

# your code here


print(await double_later(21))
`,
        py`
import time as _time
_start = _time.perf_counter()
_value = await double_later(21)
_elapsed = _time.perf_counter() - _start
assert _value == 42, f"Очікую 42, а вийшло {_value!r}"
assert _elapsed >= 0.09, "Корутина має чекати 0.1 секунди через await asyncio.sleep(0.1)"
assert "time.sleep" not in _code, "time.sleep блокує. Потрібен asyncio.sleep"
`),
      task("gather",
        "Напиши корутину <code>fetch_all(names)</code>: запускає <code>fetch</code> для всіх імен одночасно й повертає список результатів у тому самому порядку.",
        py`
import asyncio

async def fetch(name):
    await asyncio.sleep(0.2)
    return name + "!"

# your code here


print(await fetch_all(["A", "B", "C"]))
`,
        py`
import time as _time
_start = _time.perf_counter()
_results = await fetch_all(["A", "B", "C"])
_elapsed = _time.perf_counter() - _start
assert _results == ["A!", "B!", "C!"], f"Очікую ['A!', 'B!', 'C!'], а вийшло {_results!r}"
assert _elapsed < 0.5, f"Три запити зайняли {_elapsed:.1f} с. Вони йдуть по черзі, а мають одночасно — через asyncio.gather"
assert await fetch_all([]) == [], "Для порожнього списку має бути порожній список"
`),
      task("Помилки в gather",
        "Напиши корутину <code>fetch_safe(names)</code>: запускає <code>fetch</code> для всіх імен одночасно. Там, де <code>fetch</code> упав, у списку результатів має стояти <code>None</code>.",
        py`
import asyncio

async def fetch(name):
    await asyncio.sleep(0.1)
    if name == "bad":
        raise ConnectionError("failure")
    return name + "!"

# your code here


print(await fetch_safe(["A", "bad", "C"]))
`,
        py`
import time as _time
_start = _time.perf_counter()
_results = await fetch_safe(["A", "bad", "C"])
assert _results == ["A!", None, "C!"], f"Очікую ['A!', None, 'C!'], а вийшло {_results!r}"
assert _time.perf_counter() - _start < 0.25, "Запити мають іти одночасно, через asyncio.gather"
`),
    ],

    40: [
      task("SELECT і ORDER BY",
        "У змінній <code>query</code> напиши запит: ім'я та вік усіх користувачів, від наймолодшого. Таблиці <code>users</code> і <code>orders</code> ті самі, що в уроці. <code>run_sql</code> виконує запит і повертає рядки.",
        py`
query = """
SELECT ...
"""

for row in run_sql(query):
    print(row)
`,
        py`
assert query.strip().lower().startswith("select"), "Запит має починатися з SELECT"
_rows = run_sql(query)
assert _rows == [("Iryna", 24), ("Yulia", 28), ("Oleh", 31)], f"Очікую три рядки (ім'я, вік) від наймолодшого, а вийшло {_rows!r}"
`),
      task("GROUP BY",
        "Напиши запит: для кожного <code>user_id</code> з таблиці <code>orders</code> — кількість замовлень і їхня загальна сума.",
        py`
query = """
SELECT ...
"""

for row in run_sql(query):
    print(row)
`,
        py`
assert "group by" in query.lower(), "Потрібен GROUP BY"
_rows = sorted(run_sql(query))
assert _rows == [(1, 2, 1700), (2, 1, 300)], f"Очікую рядки (user_id, кількість, сума): (1, 2, 1700) і (2, 1, 300), а вийшло {_rows!r}"
`),
      task("LEFT JOIN",
        "Напиши запит: ім'я кожного користувача й кількість його замовлень. Користувачі без замовлень теж мають бути в результаті, з нулем.",
        py`
query = """
SELECT ...
"""

for row in run_sql(query):
    print(row)
`,
        py`
assert "join" in query.lower(), "Потрібен JOIN"
_rows = sorted(run_sql(query))
assert _rows == sorted([("Yulia", 2), ("Oleh", 1), ("Iryna", 0)]), f"Очікую Yulia 2, Oleh 1, Iryna 0, а вийшло {_rows!r}. Якщо Ірини немає — потрібен LEFT JOIN, якщо в неї 1 — рахуй COUNT(orders.id), а не COUNT(*)"
`),
    ],

    23: [
      task("Перший тест",
        "Функція <code>is_valid_email</code> вже написана. Напиши функцію <code>test_is_valid_email()</code> щонайменше з трьома <code>assert</code>: одна правильна адреса і дві неправильні. Наприкінці виклич тест і виведи <code>All tests passed</code>.",
        py`
def is_valid_email(email):
    if email.count("@") != 1:
        return False
    name, domain = email.split("@")
    return bool(name) and "." in domain


# your code here
`,
        py`
assert "test_is_valid_email" in dir() and callable(test_is_valid_email), "Потрібна функція test_is_valid_email"
assert _code.count("assert") >= 3, "У тесті має бути щонайменше три assert"
assert _lines and _lines[-1] == "All tests passed", "Наприкінці виведи All tests passed"
_real = is_valid_email
for _fake in (lambda email: True, lambda email: False):
    globals()["is_valid_email"] = _fake
    try:
        test_is_valid_email()
    except AssertionError:
        pass
    else:
        globals()["is_valid_email"] = _real
        raise AssertionError("Тест має падати, якщо функція завжди відповідає однаково. Перевір і правильну, і неправильні адреси")
globals()["is_valid_email"] = _real
`),
      task("Тести вже є, виправ функцію",
        "Унизу написано тести. Зараз вони падають. Виправ <code>average</code>, щоб усі пройшли. Для порожнього списку функція має повертати 0. Тести не змінюй.",
        py`
def average(numbers):
    return sum(numbers) / len(numbers)


assert average([1, 2, 3]) == 2
assert average([2, 3]) == 2.5
assert average([]) == 0, "Порожній список має давати 0"
print("All tests passed")
`,
        py`
assert average([]) == 0, "average([]) має повертати 0"
assert average([10]) == 10
assert average([1, 2]) == 1.5
assert 'assert average([]) == 0' in _code, "Не видаляй тести"
`),
      task("Очікувана помилка",
        "Напиши <code>parse_age(text)</code>: повертає вік як ціле число. Якщо в тексті не число або вік від'ємний, кидає <code>ValueError</code>. Потім напиши <code>test_parse_age()</code>, яка перевіряє і правильний вік, і обидві помилки через <code>try / except</code>.",
        py`
def parse_age(text):
    # your code here
    pass


def test_parse_age():
    assert parse_age("28") == 28
    # check that parse_age("abc") and parse_age("-5") raise ValueError


test_parse_age()
print("All tests passed")
`,
        py`
assert parse_age("28") == 28 and parse_age(" 7 ") == 7, "parse_age('28') має повернути 28"
for _bad in ("abc", "-5", ""):
    try:
        parse_age(_bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"parse_age({_bad!r}) має кинути ValueError")
assert _code.count("except ValueError") >= 1, "У тесті перевір помилку через try / except ValueError"
_real = parse_age
globals()["parse_age"] = lambda text: int(text)
try:
    test_parse_age()
except (AssertionError, ValueError):
    pass
else:
    globals()["parse_age"] = _real
    raise AssertionError("Тест не помітив, що функція пропускає від'ємний вік. Перевір parse_age('-5')")
globals()["parse_age"] = _real
`),
      task("Підміна моделі",
        "Функція <code>classify(text, ask)</code> отримує текст відгуку і функцію <code>ask</code>, яка «питає модель» і повертає рядок. <code>classify</code> має повернути <code>positive</code>, <code>negative</code> чи <code>neutral</code> у нижньому регістрі й без пробілів, а будь-що інше — як <code>unknown</code>. Справжньої моделі немає: перевір функцію, передавши замість <code>ask</code> підставну функцію через <code>lambda</code>.",
        py`
LABELS = ("positive", "negative", "neutral")


def classify(text, ask):
    answer = ask(f"Classify the review as positive, negative or neutral: {text}")
    # your code here


fake_ask = lambda prompt: "  Positive\n"
print(classify("Great service!", fake_ask))
`,
        py`
assert classify("x", lambda p: "  Positive\n") == "positive", "Відповідь '  Positive\\n' має стати positive"
assert classify("x", lambda p: "NEGATIVE") == "negative"
assert classify("x", lambda p: "I think it is good") == "unknown", "Незнайома відповідь має стати unknown"
_seen = []
classify("Slow delivery", lambda p: _seen.append(p) or "neutral")
assert _seen and "Slow delivery" in _seen[0], "Текст відгуку має потрапити в промпт"
assert "lambda" in _code, "Перевір функцію з підставною lambda"
`),
      task("Логи замість print",
        "Напиши <code>safe_divide(a, b)</code>. Якщо <code>b</code> дорівнює 0, функція пише в лог попередження (WARNING) і повертає <code>None</code>. Інакше пише INFO з результатом і повертає частку. Використай <code>logging.getLogger(__name__)</code>, а не <code>print</code>.",
        py`
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def safe_divide(a, b):
    # your code here
    pass


print(safe_divide(10, 4))
print(safe_divide(1, 0))
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
_root = _logging.getLogger()
_root.addHandler(_h)
_old = _root.level
_root.setLevel(_logging.DEBUG)
try:
    _a = safe_divide(10, 4)
    _b = safe_divide(1, 0)
finally:
    _root.removeHandler(_h)
    _root.setLevel(_old)
assert _a == 2.5, f"safe_divide(10, 4) має повернути 2.5, а повернула {_a!r}"
assert _b is None, "safe_divide(1, 0) має повернути None"
_levels = [r.levelname for r in _h.records]
assert "WARNING" in _levels, "При діленні на 0 запиши logger.warning(...)"
assert "INFO" in _levels, "Для успішного ділення запиши logger.info(...)"
`),
    ],

    25: [
      task("Ціни з податком",
        "Зроби з <code>prices</code> масив NumPy. Створи <code>with_tax</code> — ціни з податком 20%, округлені до 2 знаків, і <code>expensive</code> — лише ті ціни з податком, що більші за 200. Без циклів.",
        py`
import numpy as np

prices = [100, 250, 80, 199.99]

# your code here
`,
        py`
import numpy as _np
assert isinstance(with_tax, _np.ndarray), "with_tax має бути масивом NumPy"
assert _np.allclose(with_tax, [120.0, 300.0, 96.0, 239.99]), f"with_tax: {with_tax}"
assert _np.allclose(expensive, [300.0, 239.99]), f"expensive: {expensive}"
assert "for " not in _code, "Обійдись без циклу for"
_other = _rerun(prices=[1000, 10])
assert _np.allclose(_other["expensive"], [1200.0]), "Рахуй від змінної prices"
`),
      task("Статистика оцінок",
        "Для масиву оцінок знайди <code>mean_score</code> (середнє, округлене до 1 знака), <code>best_index</code> (індекс найкращої оцінки) і <code>above_count</code> — скільки оцінок вищі за середнє. Виведи результат f-рядком: <code>Mean 79.2, best #2, above 3</code>.",
        py`
import numpy as np

scores = [72, 88, 95, 60, 81]

# your code here
`,
        py`
assert float(mean_score) == 79.2, f"mean_score має бути 79.2, а вийшло {mean_score}"
assert int(best_index) == 2, "best_index — індекс найбільшої оцінки. Подивись на argmax"
assert int(above_count) == 3, "above_count: оцінок вище середнього три"
assert _lines and _lines[-1] == "Mean 79.2, best #2, above 3", f"Вивелось: {_lines[-1] if _lines else ''!r}"
_other = _rerun(scores=[10, 50, 20])
assert _other["_lines"][-1] == "Mean 26.7, best #1, above 1", "Рахуй від змінної scores"
`),
      task("Продажі по магазинах",
        "<code>sales</code> — продажі 3 магазинів за 4 дні (рядок — магазин). Знайди <code>per_store</code> (сума кожного магазину), <code>per_day</code> (сума кожного дня) і <code>best_store</code> — номер магазину з найбільшою сумою, рахуючи з 1.",
        py`
import numpy as np

sales = [[10, 20, 30, 40], [5, 15, 25, 35], [50, 0, 10, 20]]

# your code here
`,
        py`
import numpy as _np
assert list(per_store) == [100, 80, 80], f"per_store: {per_store}. Потрібна сума по рядках: axis=1"
assert list(per_day) == [65, 35, 65, 95], f"per_day: {per_day}. Потрібна сума по стовпцях: axis=0"
assert int(best_store) == 1, "best_store рахуємо з 1: перший магазин — 1"
_other = _rerun(sales=[[1, 1], [5, 5]])
assert int(_other["best_store"]) == 2, "Рахуй від змінної sales"
`),
      task("Масштабування 0–1",
        "Перетвори <code>values</code> так, щоб найменше стало 0, а найбільше 1: <code>(x - min) / (max - min)</code>. Результат — масив <code>scaled</code>, без циклів. Так дані готують для багатьох моделей.",
        py`
import numpy as np

values = [10, 20, 15, 30]

# your code here
`,
        py`
import numpy as _np
assert _np.allclose(scaled, [0, 0.5, 0.25, 1]), f"scaled: {scaled}"
assert "for " not in _code, "Обійдись без циклу for"
assert _np.allclose(_rerun(values=[3, 5])["scaled"], [0, 1]), "Рахуй від змінної values"
`),
      task("Нормалізовані рамки",
        "<code>boxes</code> — рамки у форматі COCO <code>[x, y, width, height]</code> у пікселях. Поділи їх на розмір картинки, щоб усі числа стали частками від 0 до 1: x і width на ширину, y і height на висоту. Результат — масив <code>normalized</code> тієї самої форми. Одна операція з масивом, без циклів.",
        py`
import numpy as np

image_width = 640
image_height = 480
boxes = [
    [64, 48, 128, 96],
    [320, 240, 32, 48],
]

# your code here
`,
        py`
import numpy as _np
assert _np.shape(normalized) == (2, 4), f"Форма має бути (2, 4), а зараз {_np.shape(normalized)}"
assert _np.allclose(normalized, [[0.1, 0.1, 0.2, 0.2], [0.5, 0.5, 0.05, 0.1]]), f"normalized:\n{normalized}"
assert "for " not in _code, "Обійдись без циклу: поділи масив на масив [w, h, w, h]"
_other = _rerun(image_width=100)
assert _np.allclose(_other["normalized"][0], [0.64, 0.1, 1.28, 0.2]), "Використовуй змінні image_width і image_height"
`),
    ],

    26: [
      task("Перший огляд",
        "Зроби з <code>records</code> таблицю <code>df</code>. Створи <code>rows</code> і <code>cols</code> — кількість рядків і стовпців (з <code>shape</code>) та <code>column_names</code> — список назв стовпців.",
        py`
import pandas as pd

records = [
    {"name": "Anna", "city": "Kyiv", "age": 28},
    {"name": "Bohdan", "city": "Lviv", "age": 34},
    {"name": "Iryna", "city": "Kyiv", "age": 24},
]

# your code here
`,
        py`
import pandas as _pd
assert isinstance(df, _pd.DataFrame), "df має бути DataFrame"
assert (rows, cols) == (3, 3), f"Очікую 3 рядки і 3 стовпці, а вийшло {rows} і {cols}"
assert list(column_names) == ["name", "city", "age"], f"column_names: {column_names}"
assert "shape" in _code, "Бери розмір з df.shape"
`),
      task("Фільтр співробітників",
        "Знайди співробітників з Києва, яким 30 і більше. Збережи їхні імена, відсортовані за абеткою, у список <code>names</code>.",
        py`
import pandas as pd

df = pd.DataFrame({
    "name": ["Oleh", "Anna", "Iryna", "Taras", "Maria"],
    "city": ["Kyiv", "Kyiv", "Lviv", "Kyiv", "Kyiv"],
    "age": [41, 29, 35, 30, 52],
})

# your code here
`,
        py`
assert list(names) == ["Maria", "Oleh", "Taras"], f"names: {list(names)}. Потрібні дві умови через & і дужки"
assert "&" in _code, "Поєднай дві умови через &"
`),
      task("Сума замовлень",
        "Додай стовпець <code>total</code> = <code>price * qty</code>. Відсортуй таблицю за <code>total</code> від більшого до меншого й збережи в <code>top</code>. Створи <code>best_id</code> — <code>order_id</code> найбільшого замовлення і <code>revenue</code> — суму всіх <code>total</code>.",
        py`
import pandas as pd

orders = pd.DataFrame({
    "order_id": [101, 102, 103, 104],
    "price": [250, 40, 1200, 75],
    "qty": [2, 10, 1, 4],
})

# your code here
`,
        py`
assert "total" in orders.columns, "Додай стовпець total у таблицю orders"
assert list(orders["total"]) == [500, 400, 1200, 300], f"total: {list(orders['total'])}"
assert list(top["order_id"]) == [103, 101, 102, 104], "top має бути відсортована за total від більшого"
assert int(best_id) == 103, f"best_id: {best_id}"
assert int(revenue) == 2400, f"revenue: {revenue}"
`),
      task("Пропуски",
        "Створи словник <code>missing</code> — скільки порожніх значень у кожному стовпці. Потім <code>clean</code>: прибери рядки без віку, а порожнє місто заміни на <code>unknown</code>.",
        py`
import pandas as pd

df = pd.DataFrame({
    "name": ["Anna", "Bohdan", "Iryna", "Oleh"],
    "city": ["Kyiv", None, "Lviv", None],
    "age": [28, 34, None, 41],
})

# your code here
`,
        py`
assert dict(missing) == {"name": 0, "city": 2, "age": 1}, f"missing: {dict(missing)}. Подивись на isna().sum()"
assert list(clean["name"]) == ["Anna", "Bohdan", "Oleh"], f"У clean лишились: {list(clean['name'])}"
assert list(clean["city"]) == ["Kyiv", "unknown", "unknown"], f"Міста в clean: {list(clean['city'])}"
`),
      task("Аналіз розмітки",
        "<code>annotations</code> — рамки з розмітки (як після експорту з CVAT). Зроби таблицю й знайди: <code>class_counts</code> — словник «клас → кількість», <code>avg_area</code> — словник «клас → середня площа рамки» (width × height) і <code>small</code> — скільки рамок мають площу менше 1000 пікселів. Виведи класи від найчастішого: <code>person: 3</code>.",
        py`
import pandas as pd

annotations = [
    {"image": "001.jpg", "label": "person", "width": 40, "height": 90},
    {"image": "001.jpg", "label": "car", "width": 120, "height": 60},
    {"image": "002.jpg", "label": "person", "width": 20, "height": 45},
    {"image": "002.jpg", "label": "bike", "width": 50, "height": 30},
    {"image": "003.jpg", "label": "person", "width": 30, "height": 70},
    {"image": "003.jpg", "label": "car", "width": 100, "height": 50},
]

# your code here
`,
        py`
assert dict(class_counts) == {"person": 3, "car": 2, "bike": 1}, f"class_counts: {dict(class_counts)}"
assert {k: round(float(v), 1) for k, v in dict(avg_area).items()} == {"bike": 1500.0, "car": 6100.0, "person": 2200.0}, f"avg_area: {dict(avg_area)}"
assert int(small) == 1, f"small: {small}. Площа менше 1000 лише в однієї рамки"
assert _lines[:3] == ["person: 3", "car: 2", "bike: 1"], f"Вивелось: {_lines[:3]}"
`),
    ],

    27: [
      task("Графік loss",
        "Намалюй лінію <code>loss</code> по епохах. Заголовок <code>Training loss</code>, підпис осі X <code>epoch</code>, осі Y <code>loss</code>.",
        py`
import matplotlib.pyplot as plt

epochs = [1, 2, 3, 4, 5]
loss = [0.9, 0.6, 0.45, 0.4, 0.38]

# your code here
`,
        py`
import matplotlib.pyplot as _plt
assert _plt.get_fignums(), "Графіка немає. Почни з fig, ax = plt.subplots()"
_ax = _plt.gcf().axes[0]
assert len(_ax.lines) == 1, "Потрібна одна лінія: ax.plot(epochs, loss)"
assert list(_ax.lines[0].get_ydata()) == loss, "По осі Y мають бути значення loss"
assert _ax.get_title() == "Training loss", f"Заголовок: {_ax.get_title()!r}"
assert (_ax.get_xlabel(), _ax.get_ylabel()) == ("epoch", "loss"), "Підпиши осі: epoch і loss"
`),
      task("Скільки об'єктів кожного класу",
        "Зі словника <code>counts</code> намалюй стовпчикову діаграму: класи по X, кількість по Y. Заголовок <code>Objects per class</code>.",
        py`
import matplotlib.pyplot as plt

counts = {"car": 420, "person": 1310, "bike": 85}

# your code here
`,
        py`
import matplotlib.pyplot as _plt
assert _plt.get_fignums(), "Графіка немає"
_ax = _plt.gcf().axes[0]
_heights = [p.get_height() for p in _ax.patches]
assert _heights == [420, 1310, 85], f"Висоти стовпців: {_heights}. Передай у ax.bar ключі та значення словника"
assert _ax.get_title() == "Objects per class", f"Заголовок: {_ax.get_title()!r}"
`),
      task("Гістограма розмірів",
        "Побудуй гістограму ширини рамок <code>widths</code> з 10 інтервалами. Додай заголовок <code>Box width</code>.",
        py`
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
widths = rng.normal(80, 25, size=300)

# your code here
`,
        py`
import matplotlib.pyplot as _plt
assert _plt.get_fignums(), "Графіка немає"
_ax = _plt.gcf().axes[0]
assert len(_ax.patches) == 10, f"Інтервалів має бути 10, а їх {len(_ax.patches)}. Параметр bins"
assert sum(p.get_height() for p in _ax.patches) == 300, "Гістограма має містити всі 300 значень"
assert _ax.get_title() == "Box width"
`),
      task("Train проти validation",
        "Намалюй на одному графіку дві лінії: <code>train</code> і <code>validation</code>, з легендою. Потім знайди <code>best_epoch</code> — епоху з найменшим validation loss. Почни рахувати епохи з 1.",
        py`
import matplotlib.pyplot as plt

epochs = [1, 2, 3, 4, 5, 6]
train = [0.9, 0.6, 0.45, 0.4, 0.36, 0.33]
validation = [0.95, 0.7, 0.6, 0.58, 0.63, 0.7]

# your code here
`,
        py`
import matplotlib.pyplot as _plt
assert _plt.get_fignums(), "Графіка немає"
_ax = _plt.gcf().axes[0]
assert len(_ax.lines) == 2, "Потрібні дві лінії"
assert _ax.get_legend() is not None, "Додай легенду: label=... і ax.legend()"
assert sorted(l.get_label() for l in _ax.lines) == ["train", "validation"], "Підписи ліній: train і validation"
assert best_epoch == 4, f"best_epoch: {best_epoch}. Найменший validation loss — на 4-й епосі"
assert _rerun(validation=[0.5, 0.4, 0.6, 0.7, 0.8, 0.9])["best_epoch"] == 2, "Рахуй best_epoch від списку validation"
`),
      task("Два графіки поруч",
        "Створи рисунок з двома графіками поруч: <code>plt.subplots(1, 2, figsize=(10, 4))</code>. Ліворуч стовпці <code>counts</code>, праворуч гістограма <code>widths</code> з 20 інтервалами. Кожному дай заголовок.",
        py`
import matplotlib.pyplot as plt

counts = {"car": 420, "person": 1310, "bike": 85}
widths = [40, 55, 60, 62, 70, 75, 80, 81, 90, 120, 130, 45, 66, 72]

# your code here
`,
        py`
import matplotlib.pyplot as _plt
assert _plt.get_fignums(), "Графіка немає"
_axes = _plt.gcf().axes
assert len(_axes) == 2, f"Графіків має бути два, а їх {len(_axes)}"
assert [p.get_height() for p in _axes[0].patches] == [420, 1310, 85], "Ліворуч мають бути стовпці counts"
assert len(_axes[1].patches) == 20, "Праворуч гістограма з bins=20"
assert all(a.get_title() for a in _axes), "Дай заголовок кожному графіку"
`),
    ],

    28: [
      task("Precision і recall вручну",
        "Без sklearn порахуй <code>tp</code>, <code>fp</code>, <code>fn</code>, а потім <code>precision</code> і <code>recall</code>, округлені до 2 знаків. Клас 1 — «шахрайство». Скористайся <code>zip</code>.",
        py`
y_true = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]
y_pred = [1, 0, 0, 1, 1, 0, 1, 0, 0, 0]

# your code here
`,
        py`
assert (tp, fp, fn) == (3, 1, 2), f"tp, fp, fn = {tp}, {fp}, {fn}. Очікую 3, 1, 2"
assert precision == 0.75, f"precision = tp / (tp + fp) = 0.75, а вийшло {precision}"
assert recall == 0.6, f"recall = tp / (tp + fn) = 0.6, а вийшло {recall}"
assert "sklearn" not in _code, "Тут порахуй вручну, без sklearn"
_other = _rerun(y_true=[1, 1, 0, 0], y_pred=[1, 0, 1, 0])
assert (_other["precision"], _other["recall"]) == (0.5, 0.5), "Рахуй від змінних y_true та y_pred"
`),
      task("Baseline",
        "Перш ніж вчити модель, рахують baseline — точність «моделі», яка завжди відповідає найчастішим класом. Знайди <code>majority</code> (найчастіший клас у <code>labels</code>) і <code>baseline</code> — частку таких відповідей, округлену до 2 знаків. Підрахуй через словник.",
        py`
labels = ["ok", "ok", "spam", "ok", "ok", "spam", "ok", "ok", "ok", "spam"]

# your code here
`,
        py`
assert majority == "ok", f"majority: {majority!r}"
assert baseline == 0.7, f"baseline: {baseline}. 7 з 10 — це 0.7"
_other = _rerun(labels=["a", "b", "b"])
assert _other["majority"] == "b" and _other["baseline"] == 0.67, "Рахуй від списку labels"
`),
      task("Поділ на train і test",
        "Поділи <code>X</code> та <code>y</code> на навчальну й перевірочну частини: 30% на test, <code>random_state=42</code>. Виведи розміри: <code>train 7, test 3</code>.",
        py`
from sklearn.model_selection import train_test_split

X = [[i, i * 2] for i in range(10)]
y = [0, 0, 0, 1, 1, 0, 1, 1, 1, 0]

# your code here
`,
        py`
assert len(X_train) == 7 and len(X_test) == 3, f"Розміри: {len(X_train)} і {len(X_test)}"
assert len(y_train) == 7 and len(y_test) == 3, "y теж треба поділити"
assert sorted(map(tuple, list(X_train) + list(X_test))) == sorted(map(tuple, X)), "Усі приклади мають потрапити в одну з частин"
assert "random_state=42" in _code.replace(" ", ""), "Задай random_state=42, щоб поділ був відтворюваним"
assert _lines and _lines[-1] == "train 7, test 3", f"Вивелось: {_lines[-1] if _lines else ''!r}"
`),
      task("Перша модель",
        "Навчи <code>LogisticRegression</code> на train-частині (вже поділено). Порахуй <code>train_acc</code> і <code>test_acc</code> через <code>accuracy_score</code>, округли до 2 знаків і виведи: <code>train 1.0, test 0.83</code> (числа можуть бути іншими).",
        py`
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

# [hours_on_site, pages_viewed] → 1 = left without buying
X = [[1, 20], [2, 25], [8, 3], [9, 1], [2, 30], [7, 5], [3, 18], [6, 8],
     [1, 22], [8, 4], [4, 15], [9, 2], [2, 26], [7, 6], [5, 12], [3, 21],
     [8, 5], [1, 28], [6, 7], [4, 16]]
y = [0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# your code here
`,
        py`
from sklearn.metrics import accuracy_score as _acc
assert "model" in dir() and hasattr(model, "coef_"), "Створи model = LogisticRegression() і виклич model.fit(X_train, y_train)"
_tr = round(_acc(y_train, model.predict(X_train)), 2)
_te = round(_acc(y_test, model.predict(X_test)), 2)
assert train_acc == _tr, f"train_acc має бути {_tr}, а вийшло {train_acc}"
assert test_acc == _te, f"test_acc має бути {_te}. Рахуй на X_test, y_test"
assert _lines and _lines[-1] == f"train {_tr}, test {_te}", f"Вивелось: {_lines[-1] if _lines else ''!r}"
`),
      task("Діагноз моделі",
        "Напиши <code>diagnose(train_score, test_score)</code>. Повертає <code>underfitting</code>, якщо обидва результати нижчі за 0.7; <code>overfitting</code>, якщо train вищий за test більш ніж на 0.1; інакше <code>ok</code>.",
        py`
def diagnose(train_score, test_score):
    # your code here
    pass


print(diagnose(0.99, 0.71))
print(diagnose(0.6, 0.58))
print(diagnose(0.88, 0.84))
`,
        py`
assert diagnose(0.99, 0.71) == "overfitting"
assert diagnose(0.6, 0.58) == "underfitting"
assert diagnose(0.88, 0.84) == "ok"
assert diagnose(0.65, 0.4) == "underfitting", "0.65 і 0.4 — обидва нижчі за 0.7, це underfitting"
assert diagnose(0.95, 0.86) == "ok", "Різниця 0.09 не більша за 0.1"
`),
    ],

    29: [
      task("Намалюй прапорець",
        "Створи <code>image</code> — чорну картинку 100 × 200 (висота × ширина) з 3 каналами типу <code>uint8</code>. Верхню половину зафарбуй синім <code>[0, 87, 183]</code>, нижню жовтим <code>[255, 215, 0]</code>. Покажи через <code>ax.imshow</code>.",
        py`
import numpy as np
import matplotlib.pyplot as plt

# your code here
`,
        py`
import numpy as _np
assert image.shape == (100, 200, 3), f"Форма: {image.shape}. Спершу висота, потім ширина"
assert image.dtype == _np.uint8, "Тип має бути np.uint8"
assert list(image[10, 10]) == [0, 87, 183] and list(image[49, 199]) == [0, 87, 183], "Верхня половина (рядки 0–49) має бути синьою"
assert list(image[50, 0]) == [255, 215, 0] and list(image[99, 150]) == [255, 215, 0], "Нижня половина має бути жовтою"
import matplotlib.pyplot as _plt
assert _plt.get_fignums() and _plt.gcf().axes[0].images, "Покажи картинку: ax.imshow(image)"
`),
      task("Вирізати рамку",
        "Напиши <code>crop(image, box)</code>, де <code>box</code> — <code>[x_min, y_min, x_max, y_max]</code>. Функція повертає шматок картинки всередині рамки. Пам'ятай: в індексі спершу y, потім x.",
        py`
import numpy as np


def crop(image, box):
    # your code here
    pass


image = np.arange(10 * 8).reshape(10, 8)
piece = crop(image, [2, 1, 5, 4])
print(piece.shape)
print(piece)
`,
        py`
import numpy as _np
_img = _np.arange(80).reshape(10, 8)
_p = crop(_img, [2, 1, 5, 4])
assert _p.shape == (3, 3), f"Форма шматка: {_p.shape}"
assert _p[0, 0] == _img[1, 2], "Лівий верхній кут має бути image[y_min, x_min] = image[1, 2]"
_q = crop(_np.zeros((50, 100, 3)), [10, 20, 60, 30])
assert _q.shape == (10, 50, 3), f"Для рамки шириною 50 і висотою 10 очікую форму (10, 50, 3), а вийшло {_q.shape}"
`),
      task("Експорт у YOLO",
        "Напиши <code>coco_to_yolo(box, image_width, image_height)</code>, що повертає <code>[x_center, y_center, width, height]</code> у частках. Потім для кожної анотації виведи рядок YOLO: <code>class_id x y w h</code>, числа з 4 знаками після коми. Номер класу бери зі словника <code>class_ids</code>.",
        py`
class_ids = {"car": 0, "person": 1}
image_width = 640
image_height = 480
annotations = [
    {"label": "person", "bbox": [100, 50, 200, 100]},
    {"label": "car", "bbox": [0, 0, 640, 480]},
]


def coco_to_yolo(box, image_width, image_height):
    # your code here
    pass


# print the YOLO lines
`,
        py`
_r = coco_to_yolo([100, 50, 200, 100], 640, 480)
assert [round(v, 4) for v in _r] == [0.3125, 0.2083, 0.3125, 0.2083], f"coco_to_yolo повернула {_r}"
assert _lines == ["1 0.3125 0.2083 0.3125 0.2083", "0 0.5000 0.5000 1.0000 1.0000"], f"Вивелось: {_lines}"
`),
      task("IoU",
        "Напиши <code>iou(a, b)</code> для рамок <code>[x_min, y_min, x_max, y_max]</code>. Якщо рамки не перетинаються, результат 0. Перевір на трьох парах.",
        py`
def iou(a, b):
    # your code here
    pass


print(round(iou([0, 0, 10, 10], [5, 0, 15, 10]), 3))
print(iou([0, 0, 10, 10], [0, 0, 10, 10]))
print(iou([0, 0, 10, 10], [20, 20, 30, 30]))
`,
        py`
assert abs(iou([0, 0, 10, 10], [5, 0, 15, 10]) - 1 / 3) < 1e-9, "Половина перекриття дає 1/3"
assert iou([0, 0, 10, 10], [0, 0, 10, 10]) == 1, "Однакові рамки дають 1"
assert iou([0, 0, 10, 10], [20, 20, 30, 30]) == 0, "Рамки без перетину дають 0. Не дай ширині перетину стати від'ємною"
assert iou([0, 0, 10, 10], [10, 0, 20, 10]) == 0, "Рамки, що лише торкаються краєм, дають 0"
assert iou([0, 0, 10, 10], [12, -5, 20, 5]) == 0, "Якщо рамки не перетинаються ні по x, ні по y, результат 0"
assert abs(iou([0, 0, 4, 4], [2, 2, 6, 6]) - 4 / 28) < 1e-9
`),
      task("Перевірка розмітки",
        "Є рамки, які поставила модель (<code>predicted</code>), і правильна розмітка (<code>truth</code>), по парах. Пара збігається, якщо IoU ≥ 0.5. Порахуй <code>matched</code> і <code>match_rate</code> — частку збігів, округлену до 2 знаків. Функція <code>iou</code> вже є.",
        py`
def iou(a, b):
    x1, y1 = max(a[0], b[0]), max(a[1], b[1])
    x2, y2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    union = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - inter
    return inter / union


predicted = [[10, 10, 50, 50], [100, 100, 140, 160], [0, 0, 20, 20], [200, 50, 260, 90]]
truth = [[12, 8, 52, 48], [100, 130, 140, 190], [1, 1, 21, 21], [205, 55, 265, 95]]

# your code here
`,
        py`
assert matched == 3, f"matched: {matched}. Друга пара має IoU 0.33, вона не рахується"
assert match_rate == 0.75, f"match_rate: {match_rate}"
_other = _rerun(predicted=[[0, 0, 10, 10]], truth=[[50, 50, 60, 60]])
assert _other["matched"] == 0 and _other["match_rate"] == 0, "Рахуй від списків predicted і truth"
`),
      task("Аугментація: віддзеркалення",
        "Напиши <code>flip_horizontal(image, box)</code>: повертає віддзеркалену по горизонталі картинку і нову рамку <code>[x_min, y_min, x_max, y_max]</code>. Якщо картинку віддзеркалили, рамку треба перерахувати, інакше розмітка «з'їде». Підказка: нове <code>x_min = width - x_max</code>.",
        py`
import numpy as np


def flip_horizontal(image, box):
    # your code here
    pass


image = np.zeros((100, 200, 3), dtype=np.uint8)
image[20:40, 10:60] = 255
new_image, new_box = flip_horizontal(image, [10, 20, 60, 40])
print(new_box)
`,
        py`
import numpy as _np
_img = _np.zeros((100, 200, 3), dtype=_np.uint8)
_img[20:40, 10:60] = 255
_new, _box = flip_horizontal(_img, [10, 20, 60, 40])
assert _new.shape == _img.shape, "Розмір картинки не має змінитися"
assert (_new[30, 189] == 255).all() and (_new[30, 10] == 0).all(), "Картинку треба віддзеркалити: image[:, ::-1]"
assert list(_box) == [140, 20, 190, 40], f"Нова рамка: {_box}. Очікую [140, 20, 190, 40]"
x1, y1, x2, y2 = _box
assert (_new[y1:y2, x1:x2] == 255).all(), "Нова рамка має точно накривати білий прямокутник"
`),
    ],
  };

  window.KONSPEKT_QUIZ = {
    18: [
      quiz("Сервер відповів кодом 429. Що це означає?",
        ["Ресурс не знайдено", "Забагато запитів, спрацював ліміт", "Неправильний ключ", "Помилка в коді сервера"], 1,
        "429 — Too Many Requests. Треба почекати й повторити."),
      quiz("Що робить <code>response.raise_for_status()</code>?",
        ["Друкує статус-код", "Повторює запит при помилці", "Кидає виняток, якщо код 4xx або 5xx", "Перетворює відповідь на словник"], 2,
        "Без нього requests мовчки поверне відповідь з помилкою, і код піде далі з поганими даними."),
      quiz("Де має лежати ключ API?",
        ["У змінній на початку файлу з кодом", "У змінній середовища, яку читає os.environ", "У README, щоб колеги знайшли", "У назві гілки"], 1,
        "Ключ у коді рано чи пізно потрапить у Git. Змінні середовища лишаються поза репозиторієм."),
    ],
    21: [
      quiz("Навіщо потрібен <code>requirements.txt</code>?",
        ["Щоб пришвидшити Python", "Щоб інша людина встановила ті самі бібліотеки", "Щоб зберігати ключі API", "Щоб активувати середовище"], 1,
        "Папку .venv не передають. Передають список залежностей, з якого її можна відтворити."),
      quiz("Як зрозуміти, що віртуальне середовище активне?",
        ["На початку рядка термінала є (.venv)", "Python запускається швидше", "З'являється файл .env", "Команда pip перестає працювати"], 0,
        "Якщо (.venv) не видно, пакети встановляться в загальний Python."),
      quiz("Що з цього не має потрапляти в Git?",
        ["requirements.txt", "main.py", ".venv і .env", "README.md"], 2,
        ".venv великий і відновлюється зі списку залежностей. У .env лежать секрети."),
    ],
    22: [
      quiz("Що робить <code>git add</code>?",
        ["Зберігає знімок в історію", "Відправляє зміни на GitHub", "Позначає зміни для наступного commit", "Створює нову гілку"], 2,
        "Зміни проходять три стани: змінено → додано через add → збережено через commit."),
      quiz("Де роблять нову задачу в командному проєкті?",
        ["Одразу в main", "В окремій гілці, потім pull request", "У копії папки на робочому столі", "У файлі .gitignore"], 1,
        "Гілка ізолює роботу, а pull request дає колегам переглянути зміни до злиття."),
      quiz("Ключ API випадково потрапив у commit і на GitHub. Що робити найперше?",
        ["Видалити файл наступним commit", "Додати файл у .gitignore", "Відкликати ключ і створити новий", "Перейменувати репозиторій"], 2,
        "Ключ уже в історії, і видалення файлу його звідти не прибирає. Старий ключ треба вважати викраденим."),
    ],
    30: [
      quiz("Що модель робить на кожному кроці генерації?",
        ["Шукає відповідь в інтернеті", "Передбачає наступний токен", "Перевіряє факти за базою знань", "Вибирає готове речення зі списку"], 1,
        "Уся відповідь складається токен за токеном. Звідси й правдоподібні вигадки."),
      quiz("Яке значення temperature брати для класифікації відгуків?",
        ["0", "1", "1.5", "Не має значення"], 0,
        "Для задач з однією правильною відповіддю потрібна стабільність, а не різноманіття."),
      quiz("Чому чат «пам'ятає» попередні повідомлення?",
        ["Модель зберігає їх у себе між запитами", "Програма щоразу надсилає всю історію заново", "Їх записано в ключ API", "Модель донавчається під час розмови"], 1,
        "Між запитами модель нічого не пам'ятає. Історію ведеш ти, у своєму коді."),
    ],
    35: [
      quiz("Що означає <code>prompt | llm | parser</code>?",
        ["Вибір одного з трьох варіантів", "Ланцюжок: вихід кожного кроку йде на вхід наступного", "Три запити одночасно", "Порівняння трьох моделей"], 1,
        "Оператор | з'єднує кроки в ланцюжок, який запускають через invoke."),
      quiz("Що повертає модель після <code>llm.with_structured_output(Review)</code>?",
        ["Рядок із JSON", "Об'єкт класу Review", "Список токенів", "Словник з усіма метаданими"], 1,
        "Відповідь одразу перевіряється й перетворюється на об'єкт Pydantic."),
      quiz("Коли LangChain зайвий?",
        ["Коли потрібен один простий запит до моделі", "Коли треба змінювати постачальника моделі", "Коли потрібен retriever над векторною базою", "Коли кроків багато"], 0,
        "Для одного запиту SDK коротший і зрозуміліший."),
    ],
    36: [
      quiz("Що повертає вузол графа?",
        ["Увесь стан повністю", "Тільки ті ключі стану, які він змінив", "Назву наступного вузла", "Нічого"], 1,
        "LangGraph сам доливає повернені ключі в загальний стан."),
      quiz("Чим задають розгалуження?",
        ["add_edge", "add_node", "add_conditional_edges", "compile"], 2,
        "Функція-маршрутизатор дивиться на стан і повертає назву шляху."),
      quiz("Навіщо в циклі графа лічильник спроб?",
        ["Щоб граф працював швидше", "Щоб цикл гарантовано зупинився й не спалив бюджет", "Щоб зберігати історію", "Його вимагає compile"], 1,
        "Без межі граф може крутитися безкінечно, а кожне коло — це платний запит."),
    ],
    39: [
      quiz("Яким методом створюють новий ресурс?",
        ["GET", "POST", "PATCH", "DELETE"], 1,
        "GET читає, POST створює, PUT і PATCH змінюють, DELETE видаляє."),
      quiz("Який код повернути після успішного створення?",
        ["200", "201", "204", "404"], 1,
        "201 Created."),
      quiz("Який endpoint відповідає правилам REST?",
        ["GET /getUser?id=42", "POST /users/42/delete", "DELETE /users/42", "GET /deleteUser/42"], 2,
        "В адресі іменник, а дію задає метод."),
    ],
    41: [
      quiz("Що лежить за адресою <code>/docs</code>?",
        ["Вихідний код сервісу", "Автоматична інтерактивна документація", "Логи запитів", "Список користувачів"], 1,
        "FastAPI будує її з маршрутів і моделей Pydantic."),
      quiz("Клієнт надіслав запит без обов'язкового поля. Що станеться?",
        ["Функція отримає None", "Сервер упаде з 500", "FastAPI сам відповість 422 з поясненням", "Поле заповниться порожнім рядком"], 2,
        "Перевірка за моделлю відбувається ще до виклику твоєї функції."),
      quiz("Чому не можна викликати <code>requests.get</code> усередині <code>async def</code>?",
        ["Буде синтаксична помилка", "Він блокує сервер для всіх користувачів, доки не закінчиться", "requests не вміє JSON", "FastAPI заборонить запуск"], 1,
        "У async-коді потрібен httpx.AsyncClient або звичайний def."),
    ],
    42: [
      quiz("Чому в боті беруть <code>AsyncAnthropic</code>, а не <code>Anthropic</code>?",
        ["Він дешевший", "Синхронний клієнт зупинив би бота для всіх, поки чекає на відповідь", "Він розумніший", "Інакше Telegram заблокує бота"], 1,
        "Усі обробники працюють в одному потоці, блокувати його не можна."),
      quiz("Де має стояти обробник <code>@dp.message()</code> без фільтрів?",
        ["Першим", "Останнім", "Будь-де", "В окремому файлі"], 1,
        "Спрацьовує перший відповідний обробник. Загальний перехопить усе, що стоїть після нього."),
      quiz("Модель повернула відповідь на 6000 символів. Що зробити?",
        ["Надіслати як є", "Розрізати на частини до 4096 символів", "Попросити користувача повторити", "Стиснути в архів"], 1,
        "Одне повідомлення Telegram вміщує до 4096 символів."),
    ],
    43: [
      quiz("Чим image відрізняється від container?",
        ["Нічим, це синоніми", "Image — готовий пакунок, container — його запущений екземпляр", "Image більший за розміром", "Container зберігається на Docker Hub"], 1,
        "Як клас і об'єкт: з одного образу можна запустити багато контейнерів."),
      quiz("У compose є сервіси <code>api</code> та <code>db</code>. Яка адреса бази для api?",
        ["localhost", "127.0.0.1", "db", "postgres.local"], 2,
        "Контейнери бачать один одного за назвою сервісу. localhost у контейнері — це він сам."),
      quiz("Як передати контейнеру ключ API?",
        ["Записати в Dockerfile", "Скопіювати .env в образ", "Через змінні середовища під час запуску", "Вписати в назву образу"], 2,
        "Образ можна розпакувати й прочитати. Секрети в нього не кладуть."),
    ],
    44: [
      quiz("Що робить <code>task.delay(...)</code>?",
        ["Виконує функцію з паузою", "Кладе задачу в чергу й одразу повертає її номер", "Чекає на результат", "Скасовує задачу"], 1,
        "Виконає задачу worker, окремий процес."),
      quiz("Коли спрацює <code>0 9 * * 1</code>?",
        ["Щодня о 9:00", "Щопонеділка о 9:00", "Першого числа о 9:00", "Кожні 9 хвилин"], 1,
        "Поля: хвилина, година, день місяця, місяць, день тижня. 1 — понеділок."),
      quiz("Чому задача має бути безпечною для повторного запуску?",
        ["Так вимагає Redis", "Після збою вона запуститься знову, і дія не повинна виконатися двічі", "Щоб працювати швидше", "Щоб не писати тести"], 1,
        "Інакше після повтору буде два листи або два списання."),
    ],
    45: [
      quiz("Що таке webhook?",
        ["Спосіб зберігати токени", "Сервіс сам надсилає тобі запит, коли щось сталося", "Бібліотека для Slack", "Вид бази даних"], 1,
        "Не ти питаєш, чи є нове, а тобі повідомляють."),
      quiz("Що таке scopes у токена?",
        ["Термін його дії", "Перелік того, що токену дозволено", "Адреса сервера", "Кількість запитів за хвилину"], 1,
        "Проси найменший набір дозволів, якого досить для задачі."),
      quiz("Скрипт із gspread не бачить таблицю. Найчастіша причина?",
        ["Таблицю не відкрили для адреси сервісного акаунта", "Таблиця завелика", "У таблиці кирилиця", "Не встановлено Docker"], 0,
        "Сервісний акаунт — окремий «користувач», йому треба надати доступ."),
    ],
    46: [
      quiz("Що відбувається в Streamlit після кожної дії користувача?",
        ["Нічого", "Увесь скрипт виконується заново", "Оновлюється лише змінений елемент", "Сторінка закривається"], 1,
        "Це головна особливість Streamlit, і від неї залежить, як писати код."),
      quiz("Де зберігати історію чату в Streamlit?",
        ["У звичайній змінній", "У st.session_state", "У назві файлу", "У st.title"], 1,
        "Звичайні змінні обнуляються при кожному перезапуску скрипта."),
      quiz("Викладаєш демо в інтернет. Що зробити з ключем API?",
        ["Лишити в коді, демо ж навчальне", "Додати через секрети платформи й обмежити витрати", "Написати в описі проєкту", "Ключ не потрібен"], 1,
        "Публічне демо хтось обов'язково спробує використати на повну."),
    ],
    47: [
      quiz("У документації функцію позначено <code>deprecated</code>. Що це означає?",
        ["Вона обов'язкова", "Вона застаріла, її скоро приберуть", "Вона працює лише на Linux", "Вона платна"], 1,
        "Нове на ній будувати не варто, шукай заміну."),
      quiz("Колега написав під твоїм pull request «LGTM». Що далі?",
        ["Треба все переписати", "Зміни схвалено, можна зливати", "Треба додати тести", "PR відхилено"], 1,
        "Looks good to me."),
      quiz("З якого місця читати довгий текст помилки Python?",
        ["З першого рядка", "З останнього рядка", "Із середини", "Його не читають"], 1,
        "Останній рядок називає тип помилки й причину."),
    ],

    23: [
      quiz("Як pytest знаходить тести?",
        ["Читає всі файли .py підряд", "Шукає файли test_*.py і функції, назва яких починається з test_", "Запускає функції з декоратором @test", "Тести треба перелічити в requirements.txt"], 1,
        "Тому назва важлива: функція check_price() не запуститься як тест."),
      quiz("Як тестують код, що звертається до LLM?",
        ["Щоразу роблять справжній запит", "Підміняють модель заготовленою відповіддю й перевіряють свій код навколо неї", "Код з LLM не тестують", "Порівнюють відповідь з ChatGPT"], 1,
        "Справжня модель повільна, платна й відповідає щоразу трохи інакше. Тест має бути швидким і стабільним."),
      quiz("Що не можна писати в лог?",
        ["Час запиту", "Скільки тривала відповідь моделі", "Ключі API та паролі", "Код помилки HTTP"], 2,
        "Логи читає багато людей і сервісів, і їх довго зберігають."),
    ],
    24: [
      quiz("Чим notebook відрізняється від файлу .py?",
        ["Нічим", "Код поділено на клітинки, які запускають окремо, і результат видно під кожною", "У notebook не можна імпортувати бібліотеки", "Notebook працює лише в Colab"], 1,
        "Це зручно для дослідження даних, але готовий сервіс пишуть у .py."),
      quiz("Notebook працює у тебе, а в колеги падає. Найімовірніша причина?",
        ["У колеги повільніший комп'ютер", "Клітинки виконувались не по порядку, і щось залежить від видаленої чи пізнішої клітинки", "Різні теми оформлення", "Notebook зіпсувався в Git"], 1,
        "Перевірка: Restart Kernel → Run All."),
      quiz("Як у клітинці Colab встановити бібліотеку?",
        ["pip install ultralytics", "!pip install ultralytics", "import pip ultralytics", "install(ultralytics)"], 1,
        "Знак оклику запускає команду термінала."),
      quiz("Чи можна завантажити в Colab робочі дані під NDA?",
        ["Так, Colab безпечний", "Так, якщо потім видалити", "Ні, дані опиняються на чужих серверах. Тільки з дозволу і в погодженому середовищі", "Так, якщо ввімкнути GPU"], 2,
        "Для навчання бери відкриті датасети."),
    ],
    25: [
      quiz("Що покаже <code>np.array([[1, 2, 3], [4, 5, 6]]).shape</code>?",
        ["(3, 2)", "(2, 3)", "6", "[2, 3]"], 1,
        "2 рядки, 3 стовпці. Спершу кількість рядків."),
      quiz("Як вибрати елементи масиву <code>a</code>, більші за 5 і менші за 10?",
        ["a[a > 5 and a < 10]", "a[(a > 5) & (a < 10)]", "a.filter(5, 10)", "a[5:10]"], 1,
        "З масивами працюють & та |, і кожна умова в дужках."),
      quiz("Чому в NumPy майже не пишуть цикли по елементах?",
        ["Цикли там заборонені", "Операції над цілим масивом у десятки разів швидші", "Цикли не бачать dtype", "Так коротше, але повільніше"], 1,
        "Це векторизація: цикл виконується всередині NumPy, а не в Python."),
    ],
    26: [
      quiz("Що зробити першим після <code>pd.read_csv</code>?",
        ["Одразу вчити модель", "Подивитись shape, head() та info()", "Видалити всі пропуски", "Зберегти файл ще раз"], 1,
        "Так видно, чи дані прочиталися правильно і де є пропуски."),
      quiz("Аналог SQL <code>GROUP BY</code> у pandas?",
        ["df.merge", "df.groupby", "df.sort_values", "df.loc"], 1,
        "А аналог JOIN — merge."),
      quiz("Як швидко побачити, скільки об'єктів кожного класу в датасеті?",
        ["df['label'].value_counts()", "df['label'].sum()", "len(df)", "df.describe()"], 0,
        "Перекіс класів — одна з найчастіших причин поганої моделі."),
    ],
    27: [
      quiz("Який графік показує, скільки об'єктів у кожному класі?",
        ["Лінія", "Стовпці (bar)", "Точки (scatter)", "imshow"], 1,
        "Лінія — для змін у часі, гістограма — для розподілу значень."),
      quiz("Train loss падає, validation loss з якоїсь епохи росте. Що це?",
        ["Underfitting", "Overfitting", "Модель ідеальна", "Помилка в графіку"], 1,
        "Модель почала завчати навчальні приклади. Найкраща епоха — та, де validation найнижчий."),
      quiz("Що таке <code>fig</code> і <code>ax</code> у <code>fig, ax = plt.subplots()</code>?",
        ["Два різні графіки", "fig — уся картинка, ax — область з осями, де малюють", "fig — дані, ax — підписи", "Синоніми"], 1,
        "На одному fig може бути багато ax."),
    ],
    28: [
      quiz("Навіщо ділити дані на train і test?",
        ["Щоб навчання йшло швидше", "Щоб перевірити модель на даних, яких вона не бачила", "Так вимагає sklearn", "Щоб зменшити розмір файлу"], 1,
        "Інакше модель може просто запам'ятати відповіді."),
      quiz("У датасеті 99% нормальних платежів. Модель завжди каже «нормальний». Її accuracy?",
        ["50%", "1%", "99%, але вона нічого не знаходить", "Неможливо порахувати"], 2,
        "Тому дивляться на precision і recall, а не лише на accuracy."),
      quiz("Recall — це...",
        ["Яка частка знайденого правильна", "Яка частка всіх справжніх випадків знайдена", "Частка правильних відповідей загалом", "Швидкість моделі"], 1,
        "Recall = TP / (TP + FN). Високий recall важливий, коли пропуск дорогий: хвороба, шахрайство."),
      quiz("Модель має 99% на train і 70% на test. Що допоможе?",
        ["Складніша модель", "Більше даних, простіша модель або регуляризація", "Навчати довше", "Видалити test"], 1,
        "Це overfitting, модель завчила приклади."),
    ],
    29: [
      quiz("Яка форма в кольорової картинки 1920 × 1080 (ширина × висота) у NumPy?",
        ["(1920, 1080, 3)", "(1080, 1920, 3)", "(3, 1920, 1080)", "(1920, 1080)"], 1,
        "Спершу висота (рядки), потім ширина, потім канали."),
      quiz("Обличчя на фото, відкритому через OpenCV і показаному в matplotlib, сині. Чому?",
        ["Зіпсований файл", "OpenCV зберігає канали як BGR, треба cv2.cvtColor(..., cv2.COLOR_BGR2RGB)", "matplotlib не вміє кольори", "Потрібна інша роздільність"], 1,
        "Червоний і синій канали помінялися місцями."),
      quiz("Чим формат YOLO відрізняється від COCO?",
        ["Нічим", "YOLO: центр і розміри в частках від 0 до 1. COCO: лівий верхній кут і розміри в пікселях", "YOLO зберігає маски, COCO — рамки", "YOLO працює лише з відео"], 1,
        "Тому при конвертації ділять на розмір картинки."),
      quiz("IoU двох рамок дорівнює 0.2. Що це означає?",
        ["Рамки майже збігаються", "Рамки перекриваються слабо, зазвичай це не вважають влучанням", "Одна рамка всередині іншої", "Помилка в розрахунку"], 1,
        "Зазвичай влучанням вважають IoU ≥ 0.5."),
    ],
  };
})();
