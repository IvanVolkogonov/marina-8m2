// ====== Настройки под вас ======
const CONFIG = {
  herName: "Марина",
  nickname: "кошечка",
  fromName: "Ваня",
  meetDate: "2025-08-30",
  voiceFile: "assets/audio/voice.mp3", // положи сюда свой голос (mp3)
  photos: [
    // Замени на ваши фото: assets/photos/01.jpg ... (или любые имена)
    { src: "assets/photos/01.jpg", cap: "Наш момент 💗" },
    { src: "assets/photos/02.jpg", cap: "Улыбка, которую я люблю" },
    { src: "assets/photos/03.jpg", cap: "Тепло рядом с тобой" },
    { src: "assets/photos/04.jpg", cap: "Калининград — и мы" },
    { src: "assets/photos/05.jpg", cap: "Кафедральный собор" },
    { src: "assets/photos/06.jpg", cap: "Ты — моя принцесса" },
  ],
};

// ====== Сердечки ======
function startHearts(){
  const hearts = document.getElementById("hearts");
  if(!hearts) return;

  function spawnHeart(){
    const h = document.createElement("div");
    h.className = "heart";
    const left = Math.random()*100;
    const size = 10 + Math.random()*18;
    const dur = 4 + Math.random()*4;
    const hue = 330 + Math.random()*35;
    h.style.left = left + "vw";
    h.style.bottom = "-30px";
    h.style.width = size + "px";
    h.style.height = size + "px";
    h.style.color = `hsl(${hue}, 90%, 72%)`;
    h.style.animationDuration = dur + "s";
    hearts.appendChild(h);
    setTimeout(()=>h.remove(), dur*1000);
  }

  setInterval(spawnHeart, 260);
  window.__burstHearts = () => { for(let i=0;i<48;i++) setTimeout(()=>spawnHeart(), i*25); };
}

// ====== Хелперы ======
function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

function setText(id, text){
  const el = document.getElementById(id);
  if(el) el.textContent = text;
}

function daysSince(dateISO){
  const start = new Date(dateISO+"T00:00:00");
  const now = new Date();
  const diff = now - start;
  return Math.max(0, Math.floor(diff / (1000*60*60*24)));
}

function safeLocalDate(dateISO){
  const d = new Date(dateISO+"T00:00:00");
  return d.toLocaleDateString("ru-RU", { day:"2-digit", month:"long", year:"numeric" });
}

// ====== Состояние игры ======
const STORAGE_KEY = "marina_game_progress_v1";

function loadProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return { level: 1, completed: [] };
    return JSON.parse(raw);
  }catch{
    return { level: 1, completed: [] };
  }
}
function saveProgress(p){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
function resetProgress(){
  localStorage.removeItem(STORAGE_KEY);
}

// ====== Аудио (голос) ======
function setupVoice(){
  const btn = qs("#playVoice");
  const audio = qs("#voice");
  if(!btn || !audio) return;

  btn.addEventListener("click", async () => {
    try{
      if(audio.paused){
        await audio.play();
        btn.textContent = "Пауза ⏸️";
        if(window.__burstHearts) window.__burstHearts();
      }else{
        audio.pause();
        btn.textContent = "Нажми и послушай 🎧";
      }
    }catch{
      alert("Браузер не дал включить звук. Попробуй нажать ещё раз 🙂");
    }
  });
}

// ====== Рендер галереи ======
function renderGallery(){
  const grid = qs("#gallery");
  if(!grid) return;

  const items = CONFIG.photos;
  grid.innerHTML = "";
  for(const item of items){
    const wrap = document.createElement("div");
    wrap.className = "photo";

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.cap;

    // если фото нет — покажем заглушку (чтобы не было "битых" картинок)
    img.onerror = () => {
      wrap.innerHTML = `<div class="panel" style="height:100%;display:flex;align-items:center;justify-content:center;text-align:center;">
        <div style="color:rgba(255,255,255,.78);font-weight:750;">
          Фото скоро будет 💗<div style="font-weight:600;opacity:.8;margin-top:6px;font-size:12px;">${item.cap}</div>
        </div>
      </div>`;
    };

    const cap = document.createElement("div");
    cap.className = "cap";
    cap.textContent = item.cap;

    wrap.appendChild(img);
    wrap.appendChild(cap);
    grid.appendChild(wrap);
  }
}

// ====== Контент уровней ======
const LEVELS = [
  {
    id: 1,
    title: "Уровень 1 — «Наше знакомство»",
    hint: "Подсказка: что вы предложили сделать в палатках?",
    answer: "полежать в обнимку",
    memory: () => `Марина, моя ${CONFIG.nickname}…\n\nЯ помню то первое знакомство — палатки и твоё «да» на предложение полежать в обнимку.\nВ тот момент мир стал тише, а сердце — громче.\nИ я понял: рядом с тобой мне по-настоящему спокойно. 💗`
  },
  {
    id: 2,
    title: "Уровень 2 — «Калининград»",
    hint: "Подсказка: по какому городу вы часто гуляли вместе?",
    answer: "калининград",
    memory: () => `Наши прогулки по Калининграду — это когда время будто растворяется.\nЯ смотрю на тебя, на твою улыбку… и понимаю, что счастье выглядит именно так.\nТы — мой самый тёплый маршрут. 🥺`
  },
  {
    id: 3,
    title: "Уровень 3 — «Кафедральный собор»",
    hint: "Подсказка: что это было за место? (2 слова)",
    answer: "кафедральный собор",
    memory: () => `Прогулка у Кафедрального собора — как сцена из кино.\nТолько лучше, потому что это было по-настоящему.\nИ потому что ты рядом.\nЯ люблю твои волосы, их запах, и то, как ты становишься ещё красивее, когда улыбаешься. ✨`
  },
  {
    id: 4,
    title: "Уровень 4 — «Первый приезд»",
    hint: "Подсказка: с чем ты приехал к ней впервые?",
    answer: "букет",
    memory: () => `Первый приезд к тебе… и букет цветов.\nЯ тогда волновался, но стоило увидеть тебя — и всё стало правильно.\nМарина, ты — моя принцесса.\nИ я хочу быть твоей опорой, особенно когда учёба давит и ты стрессуешь.\nЯ рядом. Всегда. 🤍`
  }
];

// ====== Страницы ======
function initIndex(){
  startHearts();
  setText("nameLine", `${CONFIG.herName}, это мини-игра для тебя 💗`);
  setText("dateLine", `Мы знакомы с ${safeLocalDate(CONFIG.meetDate)} — это уже ${daysSince(CONFIG.meetDate)} дней тепла.`);
  const startBtn = qs("#start");
  if(startBtn){
    startBtn.addEventListener("click", () => {
      // стартуем игру
      const p = loadProgress();
      if(!p.level) saveProgress({ level: 1, completed: [] });
      location.href = "game.html";
    });
  }
}

function initGame(){
  startHearts();

  const p = loadProgress();
  const level = Math.min(Math.max(p.level || 1, 1), 4);
  const L = LEVELS.find(x => x.id === level) || LEVELS[0];

  setText("lvlTitle", L.title);
  setText("lvlHint", L.hint);

  // прогресс точки
  const dots = qsa(".dot");
  dots.forEach((d, i) => d.classList.toggle("on", i < level));

  // Memory box
  const memory = qs("#memory");
  const input = qs("#answer");
  const check = qs("#check");
  const next = qs("#next");
  const msg = qs("#msg");

  function norm(s){
    return (s || "").trim().toLowerCase()
      .replaceAll("ё","е")
      .replace(/\s+/g," ");
  }

  function success(){
    if(memory) memory.textContent = L.memory();
    if(memory) memory.style.display = "block";
    if(msg){ msg.textContent = "Правильно, моя умница 💗"; msg.style.opacity = "1"; }
    if(window.__burstHearts) window.__burstHearts();

    // сохраняем прогресс
    const pp = loadProgress();
    if(!pp.completed.includes(L.id)) pp.completed.push(L.id);
    pp.level = Math.min(4, L.id + 1);
    saveProgress(pp);

    if(next){
      next.style.display = "inline-flex";
      next.textContent = (L.id === 4) ? "Финал 💌" : "Дальше →";
    }
  }

  function fail(){
    if(msg){
      msg.textContent = "Почти! Подумай ещё чуть-чуть, кошечка 🙂";
      msg.style.opacity = "1";
    }
  }

  if(check){
    check.addEventListener("click", () => {
      const v = norm(input?.value);
      if(!v){ fail(); return; }

      // принимаем некоторые варианты
      const okAnswers = [
        norm(L.answer),
        // доп. варианты для удобства
        ...(L.id === 4 ? [norm("букет цветов"), norm("цветы")] : []),
        ...(L.id === 1 ? [norm("в обнимку"), norm("полежать обнимку")] : []),
      ];

      if(okAnswers.includes(v)) success();
      else fail();
    });
  }

  if(input){
    input.addEventListener("keydown", (e) => {
      if(e.key === "Enter") check?.click();
    });
  }

  if(next){
    next.addEventListener("click", () => {
      const pp = loadProgress();
      if(L.id === 4 || pp.level > 4){
        location.href = "final.html";
      }else{
        location.reload();
      }
    });
  }

  // reset (для тебя)
  const resetBtn = qs("#reset");
  if(resetBtn){
    resetBtn.addEventListener("click", () => {
      resetProgress();
      location.reload();
    });
  }

  renderGallery();
}

function initFinal(){
  startHearts();
  setupVoice();
  renderGallery();

  setText("finalTitle", `${CONFIG.herName}, моя ${CONFIG.nickname} 💗`);
  setText("finalSub", `С 8 Марта, принцесса. Это письмо — от ${CONFIG.fromName}.`);

  const reasons = [
    "за твою улыбку — она лечит любые дни",
    "за твои волосы — я люблю их так сильно, что словами не объяснить",
    "за то, как ты умеешь быть нежной и сильной одновременно",
    "за твою доброту и мягкость",
    "за твой ум и то, как ты стараешься",
    "за твою искренность",
    "за твой смех — он самый родной",
    "за твою заботу о близких",
    "за то, что рядом с тобой хочется быть лучше",
    "за твою красоту — настоящую, живую",
    "за твою честность",
    "за то, как ты умеешь поддерживать",
    "за наши прогулки и простые моменты",
    "за твоё «я рядом» (даже когда ты устала)",
    "за то, что ты — моя принцесса",
    "за то, что ты — моя кошечка",
    "за то, как ты переживаешь за учёбу, но всё равно идёшь вперёд",
    "за твою хрупкость, которую хочется беречь",
    "за наше «мы»",
    "и просто… за тебя."
  ];

  const ul = qs("#reasons");
  if(ul){
    ul.innerHTML = "";
    for(const r of reasons){
      const li = document.createElement("li");
      li.textContent = r;
      ul.appendChild(li);
    }
  }

  const letter = `Моя любимая Марина ❤️

С 8 Марта, моя кошечка, моя принцесса.

Я сделал для тебя эту маленькую игру, потому что ты — не “просто праздник”.
Ты — целая вселенная, в которой мне спокойно и тепло.

Я помню наше знакомство: палатки и то самое «полежать в обнимку».
Я помню прогулки по Калининграду.
Я помню Кафедральный собор — и то, как ты сияла рядом.
Я помню свой первый приезд к тебе с букетом — и как сильно я хотел обнять тебя и больше не отпускать.

И ещё я знаю: иногда тебе тяжело из-за учёбы, ты стрессуешь и переживаешь.
Пожалуйста, помни одну вещь:
ты умница. ты справишься. и ты не одна.
Я рядом — обниму, выслушаю, помогу, и буду верить в тебя даже тогда, когда ты устала верить сама.

Я люблю тебя.
Твои волосы, твою улыбку, твой голос, твою душу.
Спасибо, что ты есть.

Твой Ваня 💕`;

  const box = qs("#letter");
  if(box) box.textContent = letter;

  const copyBtn = qs("#copy");
  if(copyBtn){
    copyBtn.addEventListener("click", async () => {
      try{
        await navigator.clipboard.writeText(letter);
        alert("Скопировано 💗");
      }catch{
        alert("Не получилось скопировать. Можно выделить текст вручную 🙂");
      }
    });
  }

  const burstBtn = qs("#burst");
  if(burstBtn){
    burstBtn.addEventListener("click", () => window.__burstHearts?.());
  }

  // подключаем аудио файл
  const voice = qs("#voice");
  if(voice){
    voice.src = CONFIG.voiceFile;
  }
}

// ====== Авто-инициализация по странице ======
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body?.dataset?.page;
  if(page === "index") initIndex();
  if(page === "game") initGame();
  if(page === "final") initFinal();
});