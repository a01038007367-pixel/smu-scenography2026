(() => {
  const body = document.body;
  const prints = document.getElementById('prints');

  // 기본 발자국 위치 [x%, y%, 회전각] (PC 기준 오리지널 경로)
  const basePath = [
    [6, 74, -14], [15, 62, 12], [10, 44, -8], [19, 30, 14],
    [30, 16, -6], [43, 6, 10],  [58, 10, -10], [72, 4, 12],
    [86, 20, -8], [90, 42, 10], [82, 62, -12], [88, 80, 8],
  ];

  const footSVG =
    '<svg viewBox="0 0 60 130" aria-hidden="true">' +
    '<ellipse cx="30" cy="36" rx="24" ry="34"/>' +
    '<ellipse cx="30" cy="106" rx="16" ry="21"/></svg>';

  // 발자국 생성 함수
  const buildPrints = () => {
    prints.innerHTML = '';
    
    // 현재 모바일 화면인지 확인 (너비 768px 이하)
    const isMobile = window.innerWidth <= 768;

    basePath.forEach(([x, y, r], i) => {
      const el = document.createElement('div');
      el.className = 'print';
      
      // 모바일일 경우 발자국이 좌우 화면 밖으로 탈출하지 않도록 X축 좌표를 안쪽(25%~75% 사이)으로 보정
      if (isMobile) {
        // 기존 0~100% 사이의 스케일을 모바일의 중앙 영역으로 압축 계산
        el.style.left = (25 + (x * 0.5)) + '%';
        el.style.top = y + '%';
      } else {
        el.style.left = x + '%';
        el.style.top = y + '%';
      }
      
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

  // 모바일 가로/세로 회전이나 브라우저 리사이즈 시 발자국 위치 재연산
  window.addEventListener('resize', () => {
    if (body.dataset.screen === '1') {
      buildPrints();
    }
  });
})();
