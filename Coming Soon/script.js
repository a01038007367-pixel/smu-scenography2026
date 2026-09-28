(() => {
  const body = document.body;
  const prints = document.getElementById('prints');

  // 발자국 위치 [x%, y%, 회전각] — 왼쪽 아래에서 오른쪽 위로 걸어가는 경로
  const path = [
    [6, 74, -14], [15, 62, 12], [10, 44, -8], [19, 30, 14],
    [30, 16, -6], [43, 6, 10],  [58, 10, -10], [72, 4, 12],
    [86, 20, -8], [90, 42, 10], [82, 62, -12], [88, 80, 8],
  ];

  const footSVG =
    '<svg viewBox="0 0 60 130" aria-hidden="true">' +
    '<ellipse cx="30" cy="36" rx="24" ry="34"/>' +
    '<ellipse cx="30" cy="106" rx="16" ry="21"/></svg>';

  // 발자국 생성 (왼발/오른발 번갈아) — 반복될 때마다 애니메이션을 다시 시작
  const buildPrints = () => {
  prints.innerHTML = '';
  path.forEach(([x, y, r], i) => {
    const el = document.createElement('div');
    el.className = 'print';
    el.style.left = x + '%';
    el.style.top = y + '%';
    el.style.setProperty('--r', r + 'deg');
    el.style.setProperty('--f', i % 2 ? -1 : 1);
    el.style.setProperty('--i', i);
    el.innerHTML = footSVG;
    prints.appendChild(el);
  });
  };

  // 날짜 글자가 하나씩 뒤집히도록 딜레이 값 지정
  document.querySelectorAll('.date i').forEach((c, i) => c.style.setProperty('--n', i));

  // 화면 전환 시퀀스 (무한 반복)
  // 화면 1 → (3초) → 화면 2 X-ray → (2초) → 화면 3 → (3초) → 화면 1
  const cycle = () => {
    buildPrints();
    body.dataset.screen = '1';
    setTimeout(() => { body.dataset.screen = '2'; }, 3000);
    setTimeout(() => { body.dataset.screen = '3'; }, 5000);
    setTimeout(cycle, 8000);
  };

  // 폰트·이미지 로딩 후 타이머 시작
  window.addEventListener('load', () => {
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(cycle);
  });
})();
