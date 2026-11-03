// Меню тем, перемикання уроків, прогрес, задачі з перевіркою, підсвітка Python.
(function () {
  var PARTS = [
    "Py Basics",
    "Py AI",
    "ML",
    "LLM",
    "Netpeak",
    "Portfolio"
  ];
  // Файл, у якому лежать уроки кожної частини
  var PAGES = ["index.html", "part-2.html", "part-3.html", "part-4.html", "part-5.html", "part-6.html"];
  // [номер, частина, назва]
  var TOPICS = [
    [1, 0, "Змінні"], [2, 0, "Типи даних"], [3, 0, "input / print"], [4, 0, "Оператори"],
    [5, 0, "Рядки"], [6, 0, "Умови (if)"], [7, 0, "Цикли (for, while)"], [8, 0, "Списки"],
    [9, 0, "Кортежі"], [10, 0, "Словники"], [11, 0, "Множини (set)"], [12, 0, "Функції"],
    [13, 0, "Обробка винятків (try / except)"], [14, 0, "Робота з файлами"], [15, 0, "ООП"],
    [16, 0, "Модулі та пакети"],
    [17, 1, "JSON"], [18, 1, "HTTP-запити"], [19, 1, "Regex (re)"],
    [20, 1, "Функції вищого порядку та замикання"], [21, 1, "Віртуальні середовища та pip"],
    [22, 1, "Git / GitHub"], [23, 1, "Тести та логування"],
    [24, 2, "Jupyter і Colab"], [25, 2, "NumPy"], [26, 2, "pandas"], [27, 2, "Графіки: matplotlib"],
    [28, 2, "Основи машинного навчання"], [29, 2, "Зображення як дані (вступ до CV)"],
    [30, 3, "Що таке LLM"], [31, 3, "Токени та embeddings"], [32, 3, "Prompt engineering"],
    [33, 3, "LLM API"], [34, 3, "RAG"], [35, 3, "LangChain"], [36, 3, "LangGraph"],
    [37, 3, "AI Agents"],
    [38, 4, "Async Python"], [39, 4, "REST API — практика"], [40, 4, "SQL"], [41, 4, "FastAPI"],
    [42, 4, "Telegram Bot"], [43, 4, "Docker"], [44, 4, "Фонові та заплановані задачі"],
    [45, 4, "Інтеграції"], [46, 4, "Простий frontend для AI"], [47, 4, "Англійська B1+ для роботи"],
    [48, 5, "AI-проєкт №1"], [49, 5, "AI-проєкт №2"], [50, 5, "AI-проєкт №3"]
  ];
  var TASKS = window.KONSPEKT_TASKS || {};
  var QUIZ = window.KONSPEKT_QUIZ || {};
  var HELP = window.KONSPEKT_HELP || {};   // підказка й розв'язок до кожної задачі
  var RUN_LIMIT_MS = 8000;       // звичайна задача
  var HEAVY_LIMIT_MS = 60000;    // задача з numpy / pandas / sklearn: перший раз бібліотеки довантажуються
  var HEAVY_RE = /\b(numpy|pandas|matplotlib|sklearn)\b/;
  var LLM_LIMIT_MS = 60000;      // задача зі справжнім запитом до моделі

  var lessons = document.getElementById("lessons");
  var pager = document.getElementById("pager");
  var side = document.getElementById("side");

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ---------- збережений стан (живе в браузері) ----------
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  // ---------- перенесення прогресу після вставки тем 23–29 ----------
  // Старі теми 23–43 тепер мають номери 30–50, тож зсуваємо збережені номери на 7.
  (function migrate() {
    try {
      if (Number(localStorage.getItem("konspekt-version")) >= 2) return;
      var shift = function (n) { return n >= 23 ? n + 7 : n; };
      var oldDone = JSON.parse(localStorage.getItem("konspekt-done") || "[]");
      localStorage.setItem("konspekt-done", JSON.stringify(oldDone.map(shift)));
      var oldSolved = JSON.parse(localStorage.getItem("konspekt-solved") || "{}"), newSolved = {};
      Object.keys(oldSolved).forEach(function (k) {
        var m = /^(q?)(\d+)-(\d+)$/.exec(k);
        newSolved[m ? m[1] + shift(Number(m[2])) + "-" + m[3] : k] = oldSolved[k];
      });
      localStorage.setItem("konspekt-solved", JSON.stringify(newSolved));
      var codes = [];
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i), m = /^konspekt-code-(\d+)-(\d+)$/.exec(key || "");
        if (m && Number(m[1]) >= 23) codes.push([key, "konspekt-code-" + shift(Number(m[1])) + "-" + m[2]]);
      }
      codes.sort(function (a, b) { return b[0].localeCompare(a[0], undefined, { numeric: true }); });
      codes.forEach(function (pair) {
        localStorage.setItem(pair[1], localStorage.getItem(pair[0]));
        localStorage.removeItem(pair[0]);
      });
      var topic = Number(localStorage.getItem("konspekt-topic"));
      if (topic) localStorage.setItem("konspekt-topic", String(shift(topic)));
      localStorage.setItem("konspekt-version", "2");
    } catch (e) {}
  })();

  var done = read("konspekt-done", []);       // номери пройдених тем
  var solved = read("konspekt-solved", {});   // "тема-задача" → true
  var llm = read("konspekt-llm", {});         // ключ API учня: {key, model}

  function isDone(n) { return done.indexOf(n) !== -1; }

  var totalTasks = 0;
  Object.keys(TASKS).forEach(function (n) { totalTasks += TASKS[n].length; });
  Object.keys(QUIZ).forEach(function (n) { totalTasks += QUIZ[n].length; });

  // ---------- верхнє меню: частини курсу ----------
  var shell = document.querySelector(".shell");
  var mobile = window.matchMedia("(max-width: 820px)");
  var topbar = el("header", "topbar");
  var toggle = el("button", "side-toggle", "☰");
  toggle.type = "button";
  toggle.setAttribute("aria-controls", "side");
  var brand = el("p", "brand");
  brand.innerHTML = "Python <span>→</span> AI";
  var tabs = el("nav", "part-tabs");
  tabs.setAttribute("aria-label", "Частини курсу");
  var tabLinks = PARTS.map(function (title, p) {
    var a = el("a", "part-tab");
    a.appendChild(el("span", "part-name", title));
    tabs.appendChild(a);
    return a;
  });
  // Перемикач теми: вибір зберігається; поки його немає, тема береться з системи
  var themeBtn = el("button", "theme-toggle");
  themeBtn.type = "button";
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || (darkQuery.matches ? "dark" : "light");
  }
  function paintTheme() {
    var dark = currentTheme() === "dark";
    themeBtn.textContent = dark ? "☀" : "☾";
    var label = dark ? "Увімкнути світлу тему" : "Увімкнути темну тему";
    themeBtn.setAttribute("aria-label", label);
    themeBtn.title = label;
  }
  themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    write("konspekt-theme", next);
    paintTheme();
  });
  darkQuery.addEventListener("change", paintTheme);
  paintTheme();

  topbar.appendChild(toggle);
  topbar.appendChild(brand);
  topbar.appendChild(tabs);
  topbar.appendChild(themeBtn);
  document.body.insertBefore(topbar, shell);

  // ---------- бічна панель: теми поточної частини ----------
  var progress = el("p", "progress");
  var bar = el("div", "bar");
  var barFill = el("span");
  bar.appendChild(barFill);
  side.appendChild(progress);
  side.appendChild(bar);

  var nav = el("nav", "nav");
  nav.setAttribute("aria-label", "Теми");
  var links = {};
  var groups = PARTS.map(function (title, p) {
    var group = el("div", "part");
    group.setAttribute("aria-label", "Частина " + (p + 1) + ". " + title);
    TOPICS.filter(function (t) { return t[1] === p; }).forEach(function (t) {
      var a = el("a");
      a.href = "#t" + t[0];
      a.appendChild(el("span", "n", String(t[0])));
      a.appendChild(el("span", null, t[2]));
      links[t[0]] = a;
      group.appendChild(a);
    });
    nav.appendChild(group);
    return group;
  });
  side.appendChild(nav);

  function showPart(p) {
    groups.forEach(function (g, i) { g.hidden = i !== p; });
    tabLinks.forEach(function (a, i) {
      if (i === p) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  // Бічну панель можна сховати; на телефоні вона схована, доки її не відкрити
  var sideHidden = mobile.matches ? true : !!read("konspekt-side-hidden", false);
  function applySide() {
    document.body.classList.toggle("side-hidden", sideHidden);
    toggle.setAttribute("aria-expanded", String(!sideHidden));
    var label = sideHidden ? "Показати список тем" : "Сховати список тем";
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
  }
  toggle.addEventListener("click", function () {
    sideHidden = !sideHidden;
    if (!mobile.matches) write("konspekt-side-hidden", sideHidden);
    applySide();
  });
  applySide();

  // ---------- ключ API учня ----------
  var settings = el("details", "settings");
  settings.appendChild(el("summary", null, "Ключ API"));
  settings.appendChild(el("p", null,
    "Потрібен лише для задач зі справжньою моделлю. Підійде ключ Anthropic або OpenAI. " +
    "Він зберігається тільки в цьому браузері й надсилається напряму постачальнику моделі."));
  var keyInput = el("input");
  keyInput.id = "api-key";
  keyInput.type = "password";
  keyInput.placeholder = "sk-...";
  keyInput.autocomplete = "off";
  keyInput.setAttribute("aria-label", "Ключ API");
  keyInput.value = llm.key || "";
  var modelInput = el("input");
  modelInput.id = "api-model";
  modelInput.type = "text";
  modelInput.placeholder = "модель (необов'язково)";
  modelInput.setAttribute("aria-label", "Назва моделі");
  modelInput.value = llm.model || "";
  var keyButtons = el("div", "task-buttons");
  var saveKey = el("button", "btn primary", "Зберегти");
  var dropKey = el("button", "btn ghost", "Видалити");
  saveKey.type = dropKey.type = "button";
  keyButtons.appendChild(saveKey);
  keyButtons.appendChild(dropKey);
  var keyNote = el("p", "settings-note");
  keyNote.setAttribute("role", "status");
  function paintKey() {
    keyNote.textContent = llm.key ? "Ключ збережено." : "Ключа немає.";
  }
  saveKey.addEventListener("click", function () {
    llm = { key: keyInput.value.trim(), model: modelInput.value.trim() };
    write("konspekt-llm", llm);
    paintKey();
  });
  dropKey.addEventListener("click", function () {
    llm = {};
    keyInput.value = modelInput.value = "";
    try { localStorage.removeItem("konspekt-llm"); } catch (e) {}
    paintKey();
  });
  paintKey();
  [keyInput, modelInput, keyButtons, keyNote].forEach(function (node) { settings.appendChild(node); });
  settings.appendChild(el("p", "settings-note",
    "Постав у кабінеті постачальника ліміт витрат. Не вводь ключ на чужому комп'ютері."));
  side.appendChild(settings);

  // Перша непройдена тема — та, з якої варто продовжити
  function nextTopic() {
    for (var i = 0; i < TOPICS.length; i++) if (!isDone(TOPICS[i][0])) return TOPICS[i][0];
    return 0;
  }

  function updateProgress() {
    var next = nextTopic();
    TOPICS.forEach(function (t) {
      links[t[0]].className = isDone(t[0]) ? "done" : t[0] === next ? "now" : "todo";
    });
    // Вкладка частини веде на першу непройдену тему цієї частини
    tabLinks.forEach(function (a, p) {
      var own = TOPICS.filter(function (t) { return t[1] === p; });
      var entry = own.filter(function (t) { return !isDone(t[0]); })[0] || own[0];
      a.href = "#t" + entry[0];
    });
    var text = "Пройдено " + done.length + " з " + TOPICS.length + " тем";
    if (totalTasks) text += " · задач " + Object.keys(solved).length + " з " + totalTasks;
    progress.textContent = text;
    barFill.style.width = Math.round(done.length / TOPICS.length * 100) + "%";
  }

  // ---------- підсвітка Python ----------
  var KW = "if elif else for while in not and or is break continue del def return import from pass " +
    "True False None class try except finally raise with as lambda async await yield global assert";
  var FN = "print input len range int float str bool type list tuple set dict sum min max sorted " +
    "enumerate round open isinstance map filter zip any all abs super";
  var re = new RegExp(
    "(#.*$)|(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')|\\b(\\d+(?:\\.\\d+)?)\\b|\\b(" +
    KW.split(" ").join("|") + ")\\b|\\b(" + FN.split(" ").join("|") + ")\\b(?=\\()|(@[A-Za-z_][\\w.]*)", "gm");
  var CLS = [null, "tk-com", "tk-str", "tk-num", "tk-kw", "tk-fn", "tk-fn"];

  function highlight() {
    Array.prototype.forEach.call(lessons.querySelectorAll("pre.py:not([data-hl])"), function (pre) {
      var src = pre.textContent, frag = document.createDocumentFragment(), last = 0, m;
      re.lastIndex = 0;
      while ((m = re.exec(src))) {
        if (m.index > last) frag.appendChild(document.createTextNode(src.slice(last, m.index)));
        var k = 1;
        while (k < 7 && m[k] === undefined) k++;
        frag.appendChild(el("span", CLS[k], m[0]));
        last = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(src.slice(last)));
      pre.textContent = "";
      pre.appendChild(frag);
      pre.setAttribute("data-hl", "1");
    });
  }

  // ---------- запуск Python ----------
  var worker = null, workerReady = null, pending = null, runSeq = 0;

  function startWorker() {
    worker = new Worker("py-worker.js");
    workerReady = new Promise(function (resolve, reject) {
      worker.onmessage = function (event) {
        var data = event.data;
        if ("ready" in data) {
          if (data.ready) resolve(); else reject(new Error(data.error));
          return;
        }
        if (pending && data.id === pending.id) {
          clearTimeout(pending.timer);
          var p = pending;
          pending = null;
          p.resolve(data.result);
        }
      };
      worker.onerror = function () { reject(new Error("worker")); };
    });
    workerReady.catch(function () { worker = null; });
  }

  // useModel: задача робить справжній запит, тож передаємо ключ і чекаємо довше
  function runPython(code, tests, useModel) {
    if (!worker) startWorker();
    var limit = useModel ? LLM_LIMIT_MS : HEAVY_RE.test(code + (tests || "")) ? HEAVY_LIMIT_MS : RUN_LIMIT_MS;
    return workerReady.then(function () {
      return new Promise(function (resolve) {
        var id = ++runSeq;
        pending = {
          id: id,
          resolve: resolve,
          timer: setTimeout(function () {
            worker.terminate();
            worker = null;
            pending = null;
            resolve({
              out: "", passed: null, message: "",
              error: "Код виконується довше " + limit / 1000 + " секунд. " +
                (useModel ? "Модель не відповіла вчасно." : "Схоже на нескінченний цикл.")
            });
          }, limit)
        };
        worker.postMessage({ id: id, code: code, tests: tests, llm: useModel ? llm : null });
      });
    });
  }

  // ---------- редактор коду ----------
  function setupEditor(area) {
    area.addEventListener("keydown", function (event) {
      var start = area.selectionStart, end = area.selectionEnd, value = area.value;
      if (event.key === "Tab" && !event.shiftKey) {
        event.preventDefault();
        area.setRangeText("    ", start, end, "end");
      } else if (event.key === "Enter") {
        // Новий рядок зберігає відступ, після двокрапки відступ збільшується
        event.preventDefault();
        var line = value.slice(value.lastIndexOf("\n", start - 1) + 1, start);
        var indent = /^ */.exec(line)[0];
        if (/:\s*$/.test(line)) indent += "    ";
        area.setRangeText("\n" + indent, start, end, "end");
      } else if (event.key === "Backspace" && start === end) {
        // Backspace на відступі прибирає одразу 4 пробіли
        var before = value.slice(value.lastIndexOf("\n", start - 1) + 1, start);
        if (before && /^ +$/.test(before) && before.length % 4 === 0) {
          event.preventDefault();
          area.setRangeText("", start - 4, start, "end");
        }
      } else return;
      area.dispatchEvent(new Event("input"));
    });
  }

  function buildTask(topic, index, task) {
    var key = topic + "-" + index;
    var codeKey = "konspekt-code-" + key;
    var box = el("div", "task");

    var head = el("h3");
    head.appendChild(el("span", "task-n", "Задача " + (index + 1)));
    head.appendChild(document.createTextNode(task.title));
    var badge = el("span", "task-badge", "розв'язано");
    badge.hidden = !solved[key];
    head.appendChild(badge);
    box.appendChild(head);

    var text = el("p");
    text.innerHTML = task.text;
    box.appendChild(text);
    if (task.llm) {
      box.appendChild(el("p", "task-llm",
        "Ця задача робить справжні запити до моделі твоїм ключем API. Перевірка коштує кілька запитів."));
    }

    var area = el("textarea", "code");
    area.id = "code-" + key;
    area.spellcheck = false;
    area.setAttribute("autocapitalize", "off");
    area.setAttribute("autocomplete", "off");
    area.setAttribute("aria-label", "Код до задачі " + (index + 1));
    area.value = read(codeKey, task.starter);
    area.rows = Math.max(6, area.value.split("\n").length + 1);
    area.addEventListener("input", function () {
      write(codeKey, area.value);
      area.rows = Math.max(6, area.value.split("\n").length + 1);
    });
    setupEditor(area);
    box.appendChild(area);

    var buttons = el("div", "task-buttons");
    var runBtn = el("button", "btn", "Запустити");
    var checkBtn = el("button", "btn primary", "Перевірити");
    var resetBtn = el("button", "btn ghost", "Скинути код");
    [runBtn, checkBtn, resetBtn].forEach(function (b) { b.type = "button"; buttons.appendChild(b); });
    box.appendChild(buttons);

    var output = el("pre", "task-out");
    output.hidden = true;
    var verdict = el("p", "verdict");
    verdict.hidden = true;
    verdict.setAttribute("role", "status");
    var images = el("div", "task-images");
    images.hidden = true;
    box.appendChild(output);
    box.appendChild(images);
    box.appendChild(verdict);

    function say(kind, message) {
      verdict.className = "verdict " + kind;
      verdict.textContent = message;
      verdict.hidden = false;
    }

    function run(withTests) {
      if (task.llm && !llm.key) {
        output.hidden = true;
        say("fail", "Для цієї задачі потрібен ключ API. Додай його в меню, у розділі «Ключ API».");
        return;
      }
      runBtn.disabled = checkBtn.disabled = true;
      output.hidden = true;
      say("wait", !workerReady ? "Завантажую Python, перший раз це займає кілька секунд..." :
        HEAVY_RE.test(area.value) ? "Виконую... Перший запуск з numpy чи pandas довантажує бібліотеки, це до хвилини." :
        task.llm ? "Чекаю на відповідь моделі..." : "Виконую...");
      runPython(area.value, withTests ? task.tests : "", task.llm).then(function (result) {
        var shown = result.out + (result.error ? (result.out ? "\n" : "") + result.error : "");
        output.textContent = shown;
        output.className = "task-out" + (result.error ? " err" : "");
        output.hidden = !shown;
        images.textContent = "";
        (result.images || []).forEach(function (src, i) {
          var img = el("img");
          img.src = "data:image/png;base64," + src;
          img.alt = "Графік " + (i + 1);
          images.appendChild(img);
        });
        images.hidden = !images.children.length;
        if (result.error) say("fail", "Код зупинився з помилкою.");
        else if (!withTests) {
          if (shown) verdict.hidden = true;
          else say("wait", "Код виконався, але нічого не надрукував.");
        } else if (result.passed) {
          say("ok", "Правильно!");
          solved[key] = true;
          write("konspekt-solved", solved);
          badge.hidden = false;
          updateProgress();
        } else say("fail", result.message);
      }).catch(function () {
        say("fail", "Не вдалося запустити Python. Перевір інтернет. Якщо сторінку відкрито просто з диска, " +
          "запусти в папці проєкту «python -m http.server» і відкрий http://localhost:8000");
      }).then(function () {
        runBtn.disabled = checkBtn.disabled = false;
      });
    }

    runBtn.addEventListener("click", function () { run(false); });
    checkBtn.addEventListener("click", function () { run(true); });
    resetBtn.addEventListener("click", function () {
      area.value = task.starter;
      area.dispatchEvent(new Event("input"));
      output.hidden = verdict.hidden = images.hidden = true;
    });

    // Підказка й розв'язок сховані, доки їх не відкрити
    var help = HELP[key];
    if (help) {
      var helpRow = el("div", "task-help");
      var hintBox = el("details", "help-block");
      hintBox.appendChild(el("summary", null, "Підказка"));
      var hintText = el("p");
      hintText.innerHTML = help.hint;
      hintBox.appendChild(hintText);

      var solutionBox = el("details", "help-block");
      solutionBox.appendChild(el("summary", null, "Розв'язок"));
      solutionBox.appendChild(el("p", "help-note",
        "Спершу спробуй самостійно. Підглянутий розв'язок вчить менше, ніж власна помилка."));
      solutionBox.appendChild(el("pre", "py", help.solution));
      var useBtn = el("button", "btn ghost", "Замінити мій код цим розв'язком");
      useBtn.type = "button";
      useBtn.addEventListener("click", function () {
        area.value = help.solution;
        area.dispatchEvent(new Event("input"));
        output.hidden = verdict.hidden = images.hidden = true;
        area.focus();
      });
      solutionBox.appendChild(useBtn);

      helpRow.appendChild(hintBox);
      helpRow.appendChild(solutionBox);
      box.appendChild(helpRow);
    }
    return box;
  }

  function buildQuiz(topic, index, item) {
    var key = "q" + topic + "-" + index;
    var box = el("fieldset", "task quiz");
    var legendEl = el("legend");
    legendEl.appendChild(el("span", "task-n", "Запитання " + (index + 1)));
    box.appendChild(legendEl);
    var question = el("p", "quiz-q");
    question.innerHTML = item.question;
    box.appendChild(question);

    var verdict = el("p", "verdict");
    verdict.hidden = true;
    verdict.setAttribute("role", "status");

    item.options.forEach(function (option, i) {
      var label = el("label", "quiz-option");
      var radio = el("input");
      radio.type = "radio";
      radio.name = key;
      radio.id = key + "-" + i;
      radio.addEventListener("change", function () {
        var right = i === item.answer;
        verdict.className = "verdict " + (right ? "ok" : "fail");
        verdict.textContent = right ? "Правильно. " + item.why : "Ні, спробуй ще раз.";
        verdict.hidden = false;
        if (right && !solved[key]) {
          solved[key] = true;
          write("konspekt-solved", solved);
          updateProgress();
        }
      });
      var caption = el("span");
      caption.innerHTML = option;
      label.appendChild(radio);
      label.appendChild(caption);
      box.appendChild(label);
    });
    box.appendChild(verdict);
    return box;
  }

  // Додає до уроку задачі, запитання та кнопку «пройдено». Робиться один раз на урок.
  function decorate(article, n) {
    if (article.getAttribute("data-ready")) return;
    article.setAttribute("data-ready", "1");

    var questions = QUIZ[n] || [];
    if (questions.length) {
      article.appendChild(el("h2", null, "Перевір себе"));
      questions.forEach(function (item, i) { article.appendChild(buildQuiz(n, i, item)); });
    }

    var tasks = TASKS[n] || [];
    if (tasks.length) {
      var heading = el("h2", null, "Задачі");
      article.appendChild(heading);
      article.appendChild(el("p", "tasks-hint",
        "Пиши код у полі. «Запустити» покаже, що він друкує. «Перевірити» скаже, чи задачу розв'язано."));
      tasks.forEach(function (task, i) { article.appendChild(buildTask(n, i, task)); });
      highlight();
    }

    var doneBtn = el("button", "done-btn");
    doneBtn.type = "button";
    function paint() {
      doneBtn.textContent = isDone(n) ? "Тему пройдено ✓ (скасувати)" : "Позначити тему пройденою";
      doneBtn.classList.toggle("is-done", isDone(n));
      doneBtn.setAttribute("aria-pressed", String(isDone(n)));
    }
    doneBtn.addEventListener("click", function () {
      if (isDone(n)) done.splice(done.indexOf(n), 1); else done.push(n);
      write("konspekt-done", done);
      paint();
      updateProgress();
    });
    paint();
    article.appendChild(doneBtn);
  }

  // ---------- перемикання уроків ----------
  function render(n, scroll) {
    Array.prototype.forEach.call(lessons.children, function (a) { a.hidden = a.id !== "t" + n; });
    decorate(document.getElementById("t" + n), n);
    TOPICS.forEach(function (t) {
      if (t[0] === n) links[t[0]].setAttribute("aria-current", "page");
      else links[t[0]].removeAttribute("aria-current");
    });
    pager.textContent = "";
    var prev = TOPICS[n - 2], next = TOPICS[n], a;
    if (prev) { a = el("a", null, "← " + prev[0] + ". " + prev[2]); a.href = "#t" + prev[0]; pager.appendChild(a); }
    else pager.appendChild(el("span"));
    if (next) { a = el("a", null, next[0] + ". " + next[2] + " →"); a.href = "#t" + next[0]; pager.appendChild(a); }
    showPart(TOPICS[n - 1][1]);
    if (mobile.matches) { sideHidden = true; applySide(); }
    write("konspekt-topic", n);
    document.title = n + ". " + TOPICS[n - 1][2] + " · Конспект Python і LLM";
    if (scroll) window.scrollTo(0, 0);
  }

  // Урок лежить в іншому файлі: підвантажуємо його, а якщо браузер не дає (файл відкрито з диска) — переходимо на ту сторінку.
  function load(n, scroll) {
    var page = PAGES[TOPICS[n - 1][1]];
    fetch(page).then(function (r) {
      if (!r.ok) throw new Error("not found");
      return r.text();
    }).then(function (html) {
      var src = new DOMParser().parseFromString(html, "text/html").getElementById("lessons");
      if (!src || !src.querySelector("#t" + n)) throw new Error("no lesson");
      Array.prototype.slice.call(src.children).forEach(function (child) {
        if (!document.getElementById(child.id)) lessons.appendChild(document.importNode(child, true));
      });
      highlight();
      render(n, scroll);
    }).catch(function () {
      location.href = page + "#t" + n;
    });
  }

  function show(n, scroll) {
    if (!links[n]) return;
    if (document.getElementById("t" + n)) render(n, scroll);
    else load(n, scroll);
  }

  function fromHash() {
    var m = /^#t(\d+)$/.exec(location.hash);
    return m ? Number(m[1]) : 0;
  }

  window.addEventListener("hashchange", function () { show(fromHash(), true); });

  highlight();
  updateProgress();
  var start = fromHash();
  if (!links[start]) {
    start = [Number(read("konspekt-topic", 0)) || 0, nextTopic()].filter(function (n) {
      return document.getElementById("t" + n);
    })[0] || Number(lessons.children[0].id.slice(1));
  }
  show(start, true);
})();
