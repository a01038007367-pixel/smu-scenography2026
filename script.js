// ★ 링크는 여기서 수정하세요
const MAKING = "https://www.youtube.com/"; // 메이킹 필름 링크
const YOUTUBE = "https://www.youtube.com/",
  INSTAGRAM = "https://www.instagram.com/",
  SMU = "https://www.smu.ac.kr/",
  MAP =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("서울 용산구 이태원로 1289 BUNCKER");
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
$("#yt1").href = $("#yt2").href = YOUTUBE;
$("#yt3").href = MAKING;
$("#insta").href = INSTAGRAM;
$("#smu").href = SMU;
$("#mapl").href = $("#mapb").href = MAP;

$("#mq").textContent = "A to .ZIP ✕ unzip the stage ✕ 2026.12.09–12.12 ✕ BUNCKER B1,B2 ✕ ".repeat(
  8,
);
// intro
const L = $("#letters");
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((c, i) => {
  const s = document.createElement("span");
  s.textContent = c;
  s.style.cssText = `left:${Math.random() * 95}%;top:${Math.random() * 85}%;font-size:${60 + Math.random() * 160}px;animation-delay:${-Math.random() * 7}s`;
  L.appendChild(s);
});
const lensL = $("#lensL"),
  tt2 = $("#tt2"),
  sh = $("#sh"),
  zu = $$(".zu"),
  zc = $$(".zc");
let t0 = null,
  cur = 0,
  AM = 0.34,
  diving = 0,
  first = 1,
  mrx = 0,
  mry = 0,
  brx = 14,
  tz = 0;
const scene = $("#scene");
function setScene() {
  scene.style.transform = `translateZ(${tz}px) rotateY(${mry}deg) rotateX(${mrx + brx}deg)`;
}
function lens(sx) {
  cur = sx;
  const W = innerWidth,
    H = innerHeight,
    cy = H / 2,
    A = H * AM,
    N = 80,
    up = [],
    dn = [];
  for (let i = 0; i <= N; i++) {
    const x = (W * i) / N,
      h = A * Math.sin((Math.PI * i) / N) * Math.min(Math.max((sx - x) / (W * 0.28), 0), 1);
    up.push([x, cy - h]);
    dn.push([x, cy + h]);
  }
  lensL.style.clipPath =
    "polygon(" +
    up
      .concat([...dn].reverse())
      .map((p) => p[0].toFixed(1) + "px " + p[1].toFixed(1) + "px")
      .join(",") +
    ")";
  const d = (a) =>
    a.length > 1 ? "M" + a.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") : "";
  const u = up.filter((p) => p[0] <= sx),
    l = dn.filter((p) => p[0] <= sx);
  zu[0].setAttribute("d", d(u));
  zu[1].setAttribute("d", d(l));
  zu[2].setAttribute("d", d(u));
  zu[3].setAttribute("d", d(l));
  const xs = Math.min(sx, W - 26);
  zc.forEach((p) => p.setAttribute("d", sx < W ? `M${Math.max(sx, 0)},${cy}H${W}` : ""));
  sh.setAttribute("transform", `translate(${xs} ${cy})`);
}
function zip(t) {
  if (!t0) t0 = t + 200;
  const k = Math.min(Math.max((t - t0) / 1500, 0), 1),
    e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  lens(e * innerWidth * 1.3);
  brx = 14 * (1 - e);
  setScene();
  if (k < 1) requestAnimationFrame(zip);
  else {
    window.zd = 1;
    if (first) {
      first = 0;
      setTimeout(enter, 450);
    }
  }
}
lens(0);
requestAnimationFrame(zip);
addEventListener("resize", () => lens(cur));
document.addEventListener("mousemove", (e) => {
  if (!document.body.classList.contains("intro")) return;
  const x = e.clientX / innerWidth - 0.5,
    y = e.clientY / innerHeight - 0.5;
  tt2.style.transform = `perspective(900px) rotateY(${x * 22}deg) rotateX(${-y * 16}deg)`;
  mry = x * 10;
  mrx = -y * 8;
  setScene();
  L.style.transform = `translate(${-x * 40}px,${-y * 40}px)`;
});
let lock = 0; // enter() 중복 실행 방지용 타이머
function enter() {
  if (!document.body.classList.contains("intro") || Date.now() < lock || diving) return;
  diving = 1;
  lock = Date.now() + 2500;
  $("#intro").classList.add("dive");
  lensL.style.background = "#fff";
  const s = performance.now();
  (function f(t) {
    const k = Math.min((t - s) / 750, 1);
    AM = 0.34 + 1.3 * k * k * k;
    tz = k * k * 520;
    setScene();
    lens(cur);
    if (k < 1) requestAnimationFrame(f);
    else {
      lensL.style.clipPath = "none";
      document.body.classList.remove("intro");
      tt2.style.transform = "";
      $("#tt").style.transform = "none";
      scrollTo(0, 0);
      diving = 0;
      flip();
      setTimeout(spill, 300);
    }
  })(s);
}
addEventListener(
  "wheel",
  () => {
    if (window.zd) enter();
  },
  { passive: true },
);
addEventListener(
  "touchmove",
  () => {
    if (window.zd) enter();
  },
  { passive: true },
);
addEventListener("keydown", () => {
  if (window.zd) enter();
});
$("#intro").onclick = () => {
  if (window.zd) enter();
};
$("#title").onclick = () => {
  if (!document.body.classList.contains("intro")) show("about");
};
// nav
function show(v) {
  $$(".view").forEach((x) => x.classList.toggle("on", x.id === "v-" + v));
  $$("nav button").forEach((b) => b.classList.toggle("on", b.dataset.v === v));
  resetD(); // 어떤 메뉴로 이동하든 Designer는 폴더 목록 상태로 초기화
  scrollTo(0, 0);
  setTimeout(obs, 50);
  setTimeout(flip, 60);
  if (v === "about") spill();
}
$$("nav button").forEach((b) => (b.onclick = () => show(b.dataset.v)));
// committee
/* ★ 졸업전시 준비 위원회 이름은 여기서 수정하세요
   name 에 이름을 적으면 카드에 표시됩니다. (여러 명이면 "홍길동, 김철수" 처럼 쉼표로 구분) */
const COMMITTEE = [
  { role: "위원장", name: "이서빈" },
  { role: "부위원장", name: "이진 조은아" },
  { role: "디피팀", name: "서수빈 오은지 이해인" },
  { role: "편집팀", name: "이가령 권효정 조다현" },
  { role: "총무", name: "김민경" },
  { role: "세트장", name: "김서영" },
  { role: "프덕장", name: "홍종표" },
  { role: "의상장", name: "박소연" },
];
COMMITTEE.forEach((m, i) => {
  $("#cg").insertAdjacentHTML(
    "beforeend",
    `<div class="cm" style="--i:${i}"><span>0${i + 1}</span><b>${m.role}</b><em>${m.name}</em></div>`,
  );
});
// reveal
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in");
    }),
  { threshold: 0.2 },
);
function obs() {
  $$(".rv,.posters").forEach((x) => io.observe(x));
}
obs();
// posters
$$(".pc").forEach((p, i) => {
  p.style.setProperty("--sx", (1.5 - i) * 105 + "%");
  p.style.setProperty("--rr", (i - 1.5) * 9 + "deg");
  p.style.transitionDelay = i * 0.12 + "s";
  p.addEventListener("mousemove", (e) => {
    const r = p.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    p.style.setProperty("--ty", x * 22 + "deg");
    p.style.setProperty("--tx", -y * 22 + "deg");
    p.style.transitionDelay = "0s";
    p.style.zIndex = 5;
  });
  p.addEventListener("mouseleave", () => {
    p.style.setProperty("--ty", "0deg");
    p.style.setProperty("--tx", "0deg");
    p.style.zIndex = 0;
  });
});
setTimeout(() => $("#ps").classList.add("fan"), 100);
/* ==========================================================================
   DESIGNER
   - 큰 폴더 3개(Set / Production / Costume) → 클릭 → 디자이너 폴더 카드 목록
   - 카드 클릭 → 상세 페이지 (프로필 → 작품 소개 → 작품 사진)
   ========================================================================== */

const names = ["Set Design", "Production Design", "Costume Design"];
const ROLES = ["Scenic Designer", "Production Designer", "Costume Designer"]; // 카드 상단 문구
const FOLDER_COLORS = [
  "#7ecfdc", // 하늘
  "#8fd196", // 연두
  "#3b78cf", // 파랑
  "#ee4b36", // 빨강
  "#cbe88c", // 라임
  "#8f8f8f", // 회색
  "#ee7e55", // 주황
  "#e8628c", // 분홍
];

/* ★ 디자이너 정보는 여기서 수정하세요
   DESIGNERS[파트][순서] = { ... }
   파트: 0 = Set Design, 1 = Production Design, 2 = Costume Design
   photo / workImage 에는 이미지 경로를 넣으면 됩니다. (예: "images/designer/set01.jpg") */
const PLACEHOLDER = {
  ko: "조은아",
  en: "Cho Euna",
  title: "Shtter Island", // 작품 제목
  email: "Gmail.id@gmail.com",
  photo: "", // 프로필 사진
  desc: "텍스트를 입력하세요.", // 작품 소개
  subject: "텍스트를 입력하세요.", // 주제
  concept: "텍스트를 입력하세요.", // 컨셉
  workImage: "", // 작품 사진
  caption: "텍스트를 입력하세요.", // 작품 사진 설명
};
const DESIGNERS = names.map(() => Array.from({ length: 12 }, () => ({ ...PLACEHOLDER })));
// 예) DESIGNERS[0][0] = { ...PLACEHOLDER, ko: "고윤정", en: "Go Youn jung", title: "Shtter Island" };

const F = $("#folders"),
  dh = $("#dh"),
  dg = $("#dg"),
  dd = $("#dd"),
  hint = $("#hint");
let goBack = resetD; // "← 파트명" 버튼이 돌아갈 곳

/* ---------- 1) 큰 폴더 3개 ---------- */
names.forEach((n, i) =>
  F.insertAdjacentHTML(
    "beforeend",
    `<div class="fo" data-i="${i}"><h3>${n}</h3><small>0${i + 1} / ${DESIGNERS[i].length}</small></div>`,
  ),
);
const fos = $$(".fo");
document.addEventListener("mousemove", (e) => {
  if (!F.offsetParent) return;
  fos.forEach((f) => {
    const r = f.getBoundingClientRect(),
      cy = r.top + 60,
      d = Math.abs(e.clientY - cy);
    const open = Math.max(0, 1 - d / 260);
    f.style.setProperty("--r", -26 + open * 24 + "deg");
  });
});
fos.forEach((f) => (f.onclick = () => openD(+f.dataset.i)));

/* ---------- 2) 디자이너 폴더 카드 목록 ---------- */
function openD(i) {
  F.style.display = "none";
  hint.style.display = "none";
  dd.classList.remove("on");
  $("#v-designer").classList.remove("detail");

  dg.classList.add("on");
  dg.innerHTML = DESIGNERS[i]
    .map(
      (d, k) => `
      <div class="pf" data-k="${k}" style="--i:${k};--c:${FOLDER_COLORS[k % FOLDER_COLORS.length]}">
        <div class="fd">
          <i class="tab"></i>
          <i class="paper"></i>
          <div class="fb">
            <small>${ROLES[i]}</small>
            <b>${d.title}</b>
            <p class="nm"><span>${d.ko}</span><span>${d.en}</span></p>
          </div>
        </div>
      </div>`,
    )
    .join("");

  $$(".pf").forEach((p) => {
    const fd = p.querySelector(".fd");
    p.onclick = () => openP(i, +p.dataset.k);
    // 커서 위치에 따라 폴더가 살짝 기울며 따라 움직임
    p.onmousemove = (e) => {
      const r = p.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      fd.style.setProperty("--ry", x * 14 + "deg");
      fd.style.setProperty("--rx", -y * 14 + "deg");
      fd.style.setProperty("--tx", x * 8 + "px");
    };
    p.onmouseleave = () => {
      fd.style.setProperty("--ry", "0deg");
      fd.style.setProperty("--rx", "0deg");
      fd.style.setProperty("--tx", "0px");
    };
  });

  dh.textContent = "← " + names[i];
  dh.style.display = "block";
  goBack = resetD;
  scrollTo(0, 0);
}
$$(".dtabs button").forEach((b, i) => (b.onclick = () => openD(i)));

/* ---------- 3) 디자이너 상세 페이지 ---------- */
function openP(i, k) {
  const d = DESIGNERS[i][k];
  dg.classList.remove("on");
  $("#v-designer").classList.add("detail");

  dd.innerHTML = `
    <!-- 1. 프로필 -->
    <div class="dp dp1">
      <div class="dp1-info rv">
        <h4 class="role">${ROLES[i]}</h4>
        <div class="who">
          <span class="ko">${d.ko}</span><span class="en">${d.en}</span>
        </div>
        <p class="mail"><b>E-Mail</b>${d.email}</p>
        <h3 class="wt">${d.title}</h3>
      </div>
      <div class="dp1-photo rv">${d.photo ? `<img alt="${d.en}" src="${d.photo}">` : "<span>PROFILE</span>"}</div>
    </div>

    <!-- 2. 작품 소개 -->
    <div class="dp dp-dark dp2">
      <div class="dk rv">
        <h3>${d.title}</h3>
        <hr>
        <p class="center">${d.desc}</p>
        <hr>
        <div class="two">
          <div><b>주제</b><p>${d.subject}</p></div>
          <div><b>컨셉</b><p>${d.concept}</p></div>
        </div>
        <hr>
      </div>
    </div>

    <!-- 3. 작품 사진 -->
    <div class="dp dp-dark dp3">
      <div class="dk rv">
        <h3>${d.title}</h3>
        <hr>
        <div class="shot">${d.workImage ? `<img alt="${d.title}" src="${d.workImage}">` : "<span>등록 사진</span>"}</div>
        <p class="center">${d.caption}</p>
      </div>
    </div>`;
  dd.classList.add("on");
  obs();

  dh.textContent = "← " + names[i];
  goBack = () => openD(i); // 상세 → 해당 파트 목록
  scrollTo(0, 0);
}

/* ---------- 4) 폴더 목록(처음 화면)으로 복귀 ---------- */
function resetD() {
  F.style.display = "";
  hint.style.display = "";
  dg.classList.remove("on");
  dd.classList.remove("on");
  $("#v-designer").classList.remove("detail");
  $$(".dtabs button").forEach((b) => b.classList.remove("on"));
  dh.style.display = "none";
  goBack = resetD;
}
dh.onclick = () => goBack();

// 카드 넘기는 느낌: 화면 위치에 따라 섹션이 기울며 사라지고 나타남
const small = matchMedia("(max-width:800px),(max-height:700px)");
function flip() {
  const H = innerHeight;
  $$(".view section").forEach((s) => {
    if (small.matches || !s.offsetParent) {
      s.style.transform = s.style.opacity = "";
      return;
    }
    const p = s.getBoundingClientRect().top / H;
    let t = "",
      o = 1;
    if (p < 0) {
      const k = Math.min(-p, 1);
      t = `perspective(1400px) rotateX(${k * 16}deg) scale(${1 - k * 0.08})`;
      o = 1 - k * 0.85;
    } else if (p > 0) {
      const k = Math.min(p, 1);
      t = `perspective(1400px) rotateX(${-k * 10}deg) scale(${1 - k * 0.05})`;
      o = 1 - k * 0.6;
    }
    s.style.transformOrigin = p < 0 ? "50% 100%" : "50% 0";
    s.style.transform = t;
    s.style.opacity = o;
  });
}
addEventListener("scroll", flip, { passive: true });
addEventListener("resize", flip);
// About 첫 화면: 닫힌 가방이 흔들리다 열리며 물건이 쏟아짐
function spill() {
  const o = $("#obj");
  if (!o) return;
  o.classList.remove("go");
  void o.offsetWidth;
  setTimeout(() => o.classList.add("go"), 200);
}

/* ==========================================================================
   CUSTOM CURSOR — 초록 사각형 + 검은색 십자선
   ========================================================================== */
if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  const root = document.documentElement;
  const cx = document.createElement("div"),
    cy = document.createElement("div"),
    cb = document.createElement("div");
  cx.className = "cur-x";
  cy.className = "cur-y";
  cb.className = "cur-box";
  document.body.append(cx, cy, cb);
  root.classList.add("cc");

  let mx = 0,
    my = 0,
    raf = 0;
  const paint = () => {
    raf = 0;
    cx.style.transform = `translate(${mx}px,${my}px)`;
    cy.style.transform = `translate(${mx}px,${my}px)`;
    cb.style.transform = `translate(${mx}px,${my}px)`;
  };
  document.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      root.classList.add("cc-on");
      root.classList.toggle("cc-hover", !!e.target.closest("a,button,[onclick],.fo,.pf,.cm,.pc"));
      if (!raf) raf = requestAnimationFrame(paint);
    },
    { passive: true },
  );
  document.addEventListener("mouseleave", () => root.classList.remove("cc-on"));
  document.addEventListener("mouseenter", () => root.classList.add("cc-on"));
}
