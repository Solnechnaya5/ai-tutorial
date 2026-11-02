// Додаткові задачі до блоку даних: NumPy, pandas, matplotlib, основи ML, зображення.
(function () {
  var py = String.raw;

  function task(title, text, starter, tests) {
    return { title: title, text: text, starter: starter.replace(/^\n/, ""), tests: tests, llm: false };
  }

  var more = {
    25: [
      task("Ціни в різних валютах",
        "Перерахуй усі ціни в усі валюти одразу: таблиця <code>converted</code> форми (кількість цін, кількість валют), значення округлені до 2 знаків. Без циклів: додай масиву цін нову вісь через <code>[:, None]</code>.",
        py`
import numpy as np

prices_uah = np.array([1200, 450, 3999])
rates = np.array([41.5, 44.9, 52.3])  # UAH per USD, EUR, GBP

# your code here
`,
        py`
import numpy as _np
assert _np.shape(converted) == (3, 3), f"Форма має бути (3, 3), а зараз {_np.shape(converted)}"
assert _np.allclose(converted, _np.round(_np.array([1200, 450, 3999])[:, None] / _np.array([41.5, 44.9, 52.3]), 2))
assert converted[0, 0] == 28.92, f"1200 грн у доларах — 28.92, а вийшло {converted[0, 0]}"
assert "for " not in _code
`),
      task("Історія навчання",
        "<code>losses</code> — loss після кожної епохи (епохи рахуються з 1). Знайди <code>best_epoch</code>, <code>improvement</code> — на скільки відсотків loss кращої епохи менший за першу (1 знак), і <code>worse_epochs</code> — список епох, де loss зріс порівняно з попередньою. Знадобляться <code>argmin</code> і <code>np.diff</code>.",
        py`
import numpy as np

losses = np.array([0.92, 0.71, 0.55, 0.58, 0.49, 0.51, 0.47, 0.48])

# your code here
`,
        py`
assert best_epoch == 7, f"Найменший loss на 7-й епосі, а вийшло {best_epoch!r}"
assert improvement == 48.9, f"improvement: {improvement!r}"
assert list(worse_epochs) == [4, 6, 8], f"worse_epochs: {list(worse_epochs)!r}"
`),
      task("Матриця плутанини",
        "Без sklearn побудуй <code>confusion</code> — масив <code>n_classes × n_classes</code>, де рядок — справжній клас, стовпець — передбачений. Потім <code>accuracy</code>: сума діагоналі, поділена на кількість прикладів.",
        py`
import numpy as np

y_true = np.array([0, 1, 2, 2, 1, 0, 1, 2])
y_pred = np.array([0, 2, 2, 2, 1, 0, 0, 1])
n_classes = 3

# your code here
`,
        py`
import numpy as _np
assert _np.array_equal(confusion, [[2, 0, 0], [1, 1, 1], [0, 1, 2]]), f"confusion:\n{confusion}"
assert accuracy == 0.625, f"accuracy: {accuracy!r}"
`),
      task("Стандартизація ознак",
        "Перед навчанням ознаки зводять до середнього 0 і стандартного відхилення 1 для кожного стовпця. Зроби <code>Z</code> без циклів. Стовпець, де всі значення однакові, має стати нулями, а не NaN.",
        py`
import numpy as np

X = np.array([
    [170, 60, 1],
    [180, 80, 1],
    [160, 50, 1],
    [175, 70, 1],
], dtype=float)

# your code here
`,
        py`
import numpy as _np
assert Z.shape == X.shape, "Форма не має змінюватися"
assert not _np.isnan(Z).any(), "У Z з'явилися NaN: стовпець з однаковими значеннями ділиться на нуль"
assert _np.allclose(Z.mean(axis=0), 0) and _np.allclose(Z[:, :2].std(axis=0), 1), "Кожен стовпець має мати середнє 0 і відхилення 1"
assert _np.allclose(Z[:, 2], 0), "Сталий стовпець має стати нулями"
assert "for " not in _code
`),
      task("Non-maximum suppression",
        "Детектор часто видає кілька рамок на той самий об'єкт. Напиши <code>nms(boxes, scores, iou_threshold=0.5)</code>: бери рамку з найбільшою впевненістю, викидай усі, що перекриваються з нею сильніше за поріг, повторюй. Повертає список індексів залишених рамок у порядку спадання впевненості. Рамки — <code>[x1, y1, x2, y2]</code>.",
        py`
import numpy as np


def nms(boxes, scores, iou_threshold=0.5):
    # your code here
    pass


boxes = np.array([[10, 10, 50, 50], [12, 12, 52, 52], [100, 100, 150, 150], [11, 9, 49, 51], [105, 98, 148, 152]])
scores = np.array([0.9, 0.8, 0.75, 0.6, 0.95])
print(nms(boxes, scores))
`,
        py`
import numpy as _np
_boxes = _np.array([[10, 10, 50, 50], [12, 12, 52, 52], [100, 100, 150, 150], [11, 9, 49, 51], [105, 98, 148, 152]])
_scores = _np.array([0.9, 0.8, 0.75, 0.6, 0.95])
assert [int(i) for i in nms(_boxes, _scores)] == [4, 0], f"Очікую [4, 0], а вийшло {nms(_boxes, _scores)!r}"
assert [int(i) for i in nms(_boxes, _scores, iou_threshold=0.95)] == [4, 0, 1, 2, 3], "З порогом 0.95 жодна рамка не перекривається достатньо"
assert list(nms(_np.zeros((0, 4)), _np.zeros(0))) == [], "Для порожнього списку — порожній результат"
`),
    ],

    26: [
      task("Виручка за місяцями",
        "Створи словник <code>by_month</code>: «РРРР-ММ» → сума продажів. Перетвори дати через <code>pd.to_datetime</code>.",
        py`
import pandas as pd

sales = pd.DataFrame({
    "date": ["2026-09-03", "2026-09-17", "2026-10-01", "2026-10-05", "2026-11-02"],
    "amount": [1200, 800, 450, 1550, 300],
})

# your code here
`,
        py`
assert by_month == {"2026-09": 2000, "2026-10": 2000, "2026-11": 300}, f"Вийшло {by_month!r}"
assert "to_datetime" in _code
`),
      task("Об'єднання таблиць",
        "Порахуй <code>by_city</code> — суму замовлень по містах, від більшої до меншої, словником. Замовлення від невідомих користувачів не враховуй.",
        py`
import pandas as pd

users = pd.DataFrame({"id": [1, 2, 3, 4], "city": ["Kyiv", "Lviv", "Kyiv", "Odesa"]})
orders = pd.DataFrame({"user_id": [1, 2, 1, 3, 5], "amount": [500, 300, 1200, 700, 999]})

# your code here
`,
        py`
assert by_city == {"Kyiv": 2400, "Lviv": 300}, f"Вийшло {by_city!r}"
assert list(by_city) == ["Kyiv", "Lviv"], "Порядок — від більшої суми до меншої"
`),
      task("Зведена таблиця розмітки",
        "Побудуй <code>table</code>: рядки — картинки, стовпці — класи, значення — кількість об'єктів (відсутні поєднання — 0). Підійде <code>pd.crosstab</code>. Знайди <code>most_crowded</code> — картинку з найбільшою кількістю об'єктів.",
        py`
import pandas as pd

annotations = pd.DataFrame({
    "image": ["img1.jpg", "img1.jpg", "img2.jpg", "img2.jpg", "img2.jpg", "img3.jpg"],
    "label": ["car", "person", "car", "car", "bike", "person"],
})

# your code here
`,
        py`
assert list(table.columns) == ["bike", "car", "person"] and list(table.index) == ["img1.jpg", "img2.jpg", "img3.jpg"]
assert table.loc["img2.jpg", "car"] == 2 and table.loc["img3.jpg", "car"] == 0 and table.loc["img1.jpg", "person"] == 1
assert most_crowded == "img2.jpg", f"most_crowded: {most_crowded!r}"
`),
      task("Чистка брудних даних",
        "Зроби <code>clean</code>: імена без пробілів по краях, email без пробілів і в нижньому регістрі, рядки без email прибрати, дублікати за email прибрати (лишити перший), ціну «1 299,50» перетворити на число через <code>pd.to_numeric(..., errors=\"coerce\")</code> і прибрати рядки з неправильною ціною. Індекс — з нуля.",
        py`
import pandas as pd

raw = pd.DataFrame({
    "name": [" Yulia ", "Oleh", "yulia", "Iryna", "Marko"],
    "email": ["Y@X.com", "o@x.com", "y@x.com ", "i@x.com", ""],
    "price": ["1 299,50", "450", "99,9", "abc", "100"],
})

# your code here
`,
        py`
assert clean[["name", "email", "price"]].to_dict("records") == [
    {"name": "Yulia", "email": "y@x.com", "price": 1299.5},
    {"name": "Oleh", "email": "o@x.com", "price": 450.0},
], f"Вийшло:\n{clean}"
assert list(clean.index) == [0, 1], "Скинь індекс через reset_index(drop=True)"
assert raw.loc[0, "name"] == " Yulia ", "raw змінювати не можна"
`),
      task("Звіт по логах моделі",
        "Створи <code>summary</code> з індексом model і стовпцями: <code>requests</code> (кількість), <code>error_rate</code> (частка статусів, відмінних від 200, 2 знаки), <code>median_latency</code>. Відсортуй за кількістю запитів від більшої.",
        py`
import pandas as pd

logs = pd.DataFrame([
    {"model": "small", "latency_ms": 320, "status": 200},
    {"model": "small", "latency_ms": 280, "status": 200},
    {"model": "large", "latency_ms": 1900, "status": 200},
    {"model": "small", "latency_ms": 5000, "status": 429},
    {"model": "large", "latency_ms": 2100, "status": 500},
    {"model": "small", "latency_ms": 300, "status": 200},
])

# your code here
`,
        py`
assert list(summary.index) == ["small", "large"], f"Індекс: {list(summary.index)}"
assert list(summary.loc["small", ["requests", "error_rate", "median_latency"]]) == [4, 0.25, 310]
assert list(summary.loc["large", ["requests", "error_rate", "median_latency"]]) == [2, 0.5, 2000]
`),
    ],

    27: [
      task("Train і validation на одному графіку",
        "Намалюй дві лінії: <code>train_loss</code> і <code>val_loss</code> по епохах, з підписами «train» і «val» у легенді та підписами осей.",
        py`
import matplotlib.pyplot as plt

epochs = list(range(1, 11))
train_loss = [0.9, 0.7, 0.55, 0.45, 0.38, 0.32, 0.28, 0.25, 0.22, 0.2]
val_loss = [0.95, 0.75, 0.6, 0.52, 0.48, 0.47, 0.47, 0.49, 0.52, 0.55]

# your code here
`,
        py`
import matplotlib.pyplot as _plt
_ax = _plt.gcf().axes[0]
assert len(_ax.lines) == 2, f"Ліній має бути дві, а їх {len(_ax.lines)}"
assert sorted(_l.get_label() for _l in _ax.lines) == ["train", "val"], "Підписи ліній: train і val"
assert _ax.get_legend() is not None, "Додай легенду"
assert _ax.get_xlabel() and _ax.get_ylabel(), "Підпиши осі"
assert [list(_l.get_ydata()) for _l in _ax.lines if _l.get_label() == "val"][0] == val_loss
`),
      task("Топ-5 класів",
        "Намалюй горизонтальні стовпці (<code>barh</code>) для п'яти найчисленніших класів. Найбільший — нагорі. Додай заголовок.",
        py`
import matplotlib.pyplot as plt

counts = {"car": 420, "person": 1310, "bike": 85, "truck": 160, "bus": 95, "dog": 40, "traffic light": 230}

# your code here
`,
        py`
import matplotlib.pyplot as _plt
_fig = _plt.gcf()
_fig.canvas.draw()
_ax = _fig.axes[0]
assert [p.get_width() for p in _ax.patches] == [95, 160, 230, 420, 1310], "Мають бути 5 найбільших, найбільший нагорі (тобто останнім)"
assert [t.get_text() for t in _ax.get_yticklabels()] == ["bus", "truck", "traffic light", "car", "person"], "Підписи мають відповідати класам"
assert _ax.get_title(), "Додай заголовок"
`),
      task("Розміри рамок",
        "Побудуй діаграму розсіювання (<code>scatter</code>): ширина рамки по осі x, висота по осі y. Підпиши осі й додай заголовок.",
        py`
import matplotlib.pyplot as plt

widths = [40, 55, 60, 120, 130, 45, 66, 72]
heights = [80, 90, 85, 60, 70, 100, 95, 88]

# your code here
`,
        py`
import matplotlib.pyplot as _plt
_ax = _plt.gcf().axes[0]
assert _ax.collections, "Потрібен plt.scatter"
_points = [tuple(p) for p in _ax.collections[0].get_offsets()]
assert _points == list(zip(widths, heights)), "Точки мають бути (ширина, висота)"
assert _ax.get_xlabel() and _ax.get_ylabel() and _ax.get_title(), "Підпиши осі й додай заголовок"
`),
      task("Найкраща епоха",
        "Намалюй <code>val_acc</code> по епохах і познач найкращу точку підписом «best» через <code>plt.annotate</code>. Стрілка має вказувати на точку (епоха, точність).",
        py`
import matplotlib.pyplot as plt

epochs = list(range(1, 9))
val_acc = [0.61, 0.70, 0.76, 0.79, 0.81, 0.80, 0.82, 0.79]

# your code here
`,
        py`
import matplotlib.pyplot as _plt
_ax = _plt.gcf().axes[0]
assert _ax.lines, "Намалюй лінію val_acc"
_notes = [t for t in _ax.texts if "best" in t.get_text().lower()]
assert _notes, "Додай підпис best через plt.annotate"
assert tuple(_notes[0].xy) == (7, 0.82), f"Підпис має вказувати на (7, 0.82), а вказує на {_notes[0].xy}"
`),
      task("Графік у файл",
        "Створи рисунок розміром 8 × 4 дюйми, намалюй на ньому <code>daily_requests</code> і збережи у <code>report.png</code> з <code>dpi=100</code>. Файл має бути 800 × 400 пікселів.",
        py`
import matplotlib.pyplot as plt

daily_requests = [120, 135, 160, 158, 190, 240, 230]

# your code here
`,
        py`
import os as _os
import matplotlib.pyplot as _plt
assert _os.path.exists("report.png"), "Файл report.png не знайдено"
assert _plt.imread("report.png").shape[:2] == (400, 800), f"Розмір файлу: {_plt.imread('report.png').shape[:2]}, а має бути (400, 800)"
assert "savefig" in _code
`),
    ],

    28: [
      task("Дерево рішень на iris",
        "Поділи дані: 25% на test, <code>random_state=0</code>, <code>stratify=y</code>. Навчи <code>DecisionTreeClassifier(max_depth=3, random_state=0)</code>. Порахуй <code>test_acc</code> (3 знаки) і <code>cm</code> — матрицю плутанини на test.",
        py`
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_iris(return_X_y=True)

# your code here
`,
        py`
from sklearn.model_selection import train_test_split as _split
from sklearn.tree import DecisionTreeClassifier as _Tree
from sklearn.metrics import accuracy_score as _acc
_Xtr, _Xte, _ytr, _yte = _split(X, y, test_size=0.25, random_state=0, stratify=y)
_pred = _Tree(max_depth=3, random_state=0).fit(_Xtr, _ytr).predict(_Xte)
assert test_acc == round(_acc(_yte, _pred), 3), f"test_acc: {test_acc!r}, очікую {round(_acc(_yte, _pred), 3)}"
assert cm.shape == (3, 3) and cm.sum() == len(_yte), "cm має бути 3 × 3 і містити всі приклади test"
`),
      task("Macro F1 вручну",
        "Напиши <code>macro_f1(y_true, y_pred)</code> без sklearn: для кожного класу precision, recall і F1 (якщо ділення на нуль — 0), потім середнє F1 по класах, 3 знаки. Класи — усі, що трапляються в y_true або y_pred.",
        py`
# your code here


print(macro_f1([0, 1, 2, 2, 1], [0, 2, 2, 2, 1]))
`,
        py`
from sklearn.metrics import f1_score as _f1
for _t, _p in [([0, 1, 2, 2, 1], [0, 2, 2, 2, 1]), ([1, 1, 0, 0], [1, 0, 0, 1]), ([0, 0, 1], [2, 2, 2]), ([1, 1], [1, 1])]:
    _expected = round(_f1(_t, _p, average="macro", zero_division=0), 3)
    assert macro_f1(_t, _p) == _expected, f"Для {_t} і {_p} очікую {_expected}, а вийшло {macro_f1(_t, _p)!r}"
assert "sklearn" not in _code
`),
      task("Лінійна регресія",
        "Передбач ціну квартири за площею. Поділи: 20% на test, <code>random_state=42</code>. Навчи <code>LinearRegression</code>. Порахуй <code>slope</code> (ціна за м², ціле), <code>price_100</code> (прогноз для 100 м², ціле) і <code>mae</code> на test (ціле).",
        py`
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
area = rng.uniform(30, 120, 60)
price = 1500 * area + 20000 + rng.normal(0, 8000, 60)
X = area.reshape(-1, 1)

# your code here
`,
        py`
from sklearn.linear_model import LinearRegression as _LR
from sklearn.metrics import mean_absolute_error as _mae
from sklearn.model_selection import train_test_split as _split
_Xtr, _Xte, _ytr, _yte = _split(X, price, test_size=0.2, random_state=42)
_m = _LR().fit(_Xtr, _ytr)
assert slope == round(_m.coef_[0]), f"slope: {slope!r}, очікую {round(_m.coef_[0])}"
assert price_100 == round(_m.predict([[100]])[0]), f"price_100: {price_100!r}"
assert mae == round(_mae(_yte, _m.predict(_Xte))), f"mae: {mae!r}"
assert 1300 < slope < 1700, "Нахил має бути близько 1500"
`),
      task("Pipeline",
        "Напиши <code>make_model()</code>: повертає <code>Pipeline</code> з кроків <code>StandardScaler</code> і <code>LogisticRegression(max_iter=1000)</code>. Так масштабування рахується лише на train і не «підглядає» в test.",
        py`
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# your code here


X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
model = make_model().fit(X_train, y_train)
print(round(model.score(X_test, y_test), 3))
`,
        py`
from sklearn.pipeline import Pipeline as _P
from sklearn.preprocessing import StandardScaler as _S
from sklearn.linear_model import LogisticRegression as _L
_m = make_model()
assert isinstance(_m, _P), "make_model має повертати Pipeline"
assert isinstance(_m.steps[0][1], _S) and isinstance(_m.steps[-1][1], _L), "Спершу StandardScaler, потім LogisticRegression"
assert make_model() is not _m, "Кожен виклик — нова модель"
assert model.score(X_test, y_test) >= 0.95
`),
      task("Підбір глибини дерева",
        "Для <code>max_depth</code> від 1 до 8 навчи <code>DecisionTreeClassifier(random_state=0)</code> на train і порахуй точність на validation (3 знаки). Збережи в <code>scores</code> (глибина → точність). <code>best_depth</code> — найменша глибина з найкращою точністю.",
        py`
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_wine(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.3, random_state=1)

# your code here
`,
        py`
from sklearn.tree import DecisionTreeClassifier as _Tree
_expected = {_d: round(_Tree(max_depth=_d, random_state=0).fit(X_train, y_train).score(X_val, y_val), 3) for _d in range(1, 9)}
assert scores == _expected, f"scores: {scores}\nочікую: {_expected}"
_best = max(_expected.values())
assert best_depth == min(_d for _d, _s in _expected.items() if _s == _best), f"best_depth: {best_depth!r}"
`),
    ],

    29: [
      task("З YOLO у пікселі",
        "Рядок розмітки YOLO: «клас x_center y_center width height», числа — частки від розміру картинки. Напиши <code>yolo_to_xyxy(line, width, height)</code>: повертає (клас як ціле, [x1, y1, x2, y2] цілими пікселями).",
        py`
# your code here


print(yolo_to_xyxy("0 0.5 0.5 0.25 0.5", 640, 480))
`,
        py`
assert yolo_to_xyxy("0 0.5 0.5 0.25 0.5", 640, 480) == (0, [240, 120, 400, 360])
assert yolo_to_xyxy("3 0.1 0.2 0.2 0.4", 1000, 500) == (3, [0, 0, 200, 200])
`),
      task("Відтінки сірого",
        "Напиши <code>to_gray(image)</code>: картинка (H, W, 3) → (H, W) типу <code>uint8</code> за формулою 0.299·R + 0.587·G + 0.114·B, з округленням. Без циклів.",
        py`
import numpy as np


def to_gray(image):
    # your code here
    pass


image = np.zeros((2, 2, 3), dtype=np.uint8)
image[0, 0] = [255, 0, 0]
image[1, 1] = [255, 255, 255]
print(to_gray(image))
`,
        py`
import numpy as _np
_img = _np.array([[[255, 0, 0], [0, 255, 0]], [[0, 0, 255], [255, 255, 255]]], dtype=_np.uint8)
_g = to_gray(_img)
assert _g.shape == (2, 2) and _g.dtype == _np.uint8, f"Форма {_g.shape}, тип {_g.dtype}"
assert _g.tolist() == [[76, 150], [29, 255]], f"Вийшло {_g.tolist()}"
assert "for " not in _code
`),
      task("Letterbox",
        "YOLO приймає квадрат 640 × 640. Картинку пропорційно зменшують і доповнюють смугами. Напиши <code>letterbox_box(box, width, height, size=640)</code>: повертає (нову рамку, scale, pad_x, pad_y). <code>scale = min(size / width, size / height)</code>, смуги ділять порівну з двох боків.",
        py`
# your code here


print(letterbox_box([100, 200, 300, 400], 1280, 720))
`,
        py`
_box, _scale, _px, _py = letterbox_box([100, 200, 300, 400], 1280, 720)
assert (_scale, _px, _py) == (0.5, 0, 140), f"scale і смуги: {(_scale, _px, _py)}"
assert [round(v, 1) for v in _box] == [50, 240, 150, 340], f"Рамка: {_box}"
_box, _scale, _px, _py = letterbox_box([0, 0, 480, 640], 480, 640)
assert (_scale, _px, _py) == (1.0, 80, 0) and [round(v, 1) for v in _box] == [80, 0, 560, 640], "Для вертикальної картинки смуги ліворуч і праворуч"
`),
      task("Precision і recall детектора",
        "Напиши <code>detection_counts(preds, gts, iou_threshold=0.5)</code>. <code>preds</code> — пари (рамка, впевненість). Перебирай передбачення від найвпевненішого. Кожне передбачення бере серед ще не зайнятих справжніх рамок ту, з якою IoU найбільший. Якщо цей IoU ≥ порогу — це TP, інакше FP. Незайняті справжні рамки — FN. Повертає (tp, fp, fn).",
        py`
def iou(a, b):
    x1, y1 = max(a[0], b[0]), max(a[1], b[1])
    x2, y2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    union = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - inter
    return inter / union if union else 0


# your code here


gts = [[0, 0, 10, 10], [20, 20, 30, 30]]
preds = [([1, 1, 10, 10], 0.9), ([0, 0, 9, 9], 0.8), ([50, 50, 60, 60], 0.7), ([21, 21, 30, 30], 0.6)]
print(detection_counts(preds, gts))
`,
        py`
_gts = [[0, 0, 10, 10], [20, 20, 30, 30]]
assert detection_counts([([1, 1, 10, 10], 0.9), ([0, 0, 9, 9], 0.8), ([50, 50, 60, 60], 0.7), ([21, 21, 30, 30], 0.6)], _gts) == (2, 2, 0), "Друга рамка на той самий об'єкт — FP"
assert detection_counts([], _gts) == (0, 0, 2)
assert detection_counts([([0, 0, 10, 10], 0.9)], []) == (0, 1, 0)
assert detection_counts([([0, 0, 6, 10], 0.9)], [[0, 0, 10, 10]]) == (1, 0, 0), "IoU 0.6 ≥ 0.5 — це TP"
assert detection_counts([([0, 0, 6, 10], 0.9)], [[0, 0, 10, 10]], iou_threshold=0.7) == (0, 1, 1)
_gts3 = [[0, 0, 10, 10], [5, 0, 15, 10]]
assert detection_counts([([3, 0, 13, 10], 0.4), ([5, 0, 15, 10], 0.95)], _gts3) == (2, 0, 0), "Спершу перевіряй найвпевненіше передбачення, і кожне бере незайняту рамку з найбільшим IoU"
`),
    ],
  };

  Object.keys(more).forEach(function (n) {
    var list = window.KONSPEKT_TASKS[n] || (window.KONSPEKT_TASKS[n] = []);
    list.push.apply(list, more[n]);
  });
})();
