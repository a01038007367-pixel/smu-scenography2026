# A to .ZIP — unzip the stage

> 상명대학교 예술대학 무대미술전공 제 28회 졸업전시회 **「A to .ZIP — unzip the stage」** 티저 웹페이지

- **전시 기간:** 12.09 – 12.12
- **형태:** 정적 웹페이지 (HTML / CSS / Vanilla JS, 빌드 도구·프레임워크 없음)
- **핵심 콘셉트:** 무대미술 도구가 담긴 검은 가방을 X-ray로 스캔(= unzip)해 안쪽을 드러내고, "Coming Soon" 화면으로 전환되는 8초짜리 루프 모션

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [디렉터리 구조](#2-디렉터리-구조)
3. [시작하기](#3-시작하기)
4. [화면 시퀀스](#4-화면-시퀀스)
5. [파일별 상세 설명](#5-파일별-상세-설명)
6. [반응형 처리](#6-반응형-처리)
7. [접근성](#7-접근성)
8. [커스터마이징 가이드](#8-커스터마이징-가이드)
9. [배포 (GitHub Pages)](#9-배포-github-pages)
10. [알려진 이슈 및 개선 제안](#10-알려진-이슈-및-개선-제안)

---

## 1. 프로젝트 개요

단일 페이지로 구성된 졸업전시 티저 사이트입니다. 페이지가 로드되면 아래 세 화면이 **8초 주기로 무한 반복**됩니다.

| 화면 | 시간 | 내용 |
| --- | --- | --- |
| 1 | 0s ~ 3s | 무대 바닥 느낌의 회색 배경 위로 발자국이 순차적으로 나타났다 사라지고, 검은 가방 사진이 보임 |
| 2 | 3s ~ 5s | 파란 스캔 라인이 좌→우로 지나가며 가방이 X-ray 이미지로 전환 |
| 3 | 5s ~ 8s | 텍스트가 `Coming Soon....` 문구로 교체되고, 날짜 글자가 하나씩 뒤집힘 |

### 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 마크업 | HTML5 |
| 스타일 | CSS3 (CSS 변수, Container Query 단위 `cqw`, `clip-path`, `mix-blend-mode`, `@keyframes`) |
| 스크립트 | Vanilla JavaScript (ES6+, IIFE) |
| 폰트 | Google Fonts — **Inter** (300/600/900), **Noto Sans KR** (700) |
| 외부 의존성 | Google Fonts CDN 외 없음 |

### 브라우저 요구사항

`cqw` 단위와 `container-type`(CSS Container Queries)을 사용하므로 최신 브라우저가 필요합니다.

- Chrome / Edge 105+
- Safari 16+
- Firefox 110+

---

## 2. 디렉터리 구조

```
smu-scenography2026/
├── index.html          # 마크업 (화면 1·2·3의 모든 요소 포함)
├── style.css           # 레이아웃, 애니메이션, 반응형
├── script.js           # 화면 전환 타이머, 발자국 생성
└── image/
    ├── bag-photo.png   # 검은 가방 사진 (1254 × 1254, RGB)
    ├── bag-xray.png    # X-ray 가방 이미지 (1350 × 1165, RGBA)
    └── favicon.png     # 파비콘 (1254 × 1254)
```

---

## 3. 시작하기

### 로컬 실행

별도 설치나 빌드가 필요 없습니다.

```bash
git clone https://github.com/<계정명>/smu-scenography2026.git
cd smu-scenography2026
```

**방법 1.** `index.html`을 브라우저로 직접 열기

**방법 2.** 로컬 서버 사용 (권장)

```bash
# Python
python3 -m http.server 8000

# 또는 Node.js
npx serve .
```

이후 `http://localhost:8000` 접속.

> 폰트를 Google Fonts CDN에서 불러오므로 인터넷 연결이 필요합니다.

---

## 4. 화면 시퀀스

화면 상태는 `<body>`의 `data-screen` 속성(`1` / `2` / `3`)으로 관리하며, **CSS는 이 속성을 셀렉터로 삼아 스타일을 전환**합니다. JS는 속성값만 바꾸고, 실제 모션은 전부 CSS transition/animation이 담당합니다.

```
t = 0s      data-screen="1"   buildPrints() 호출, 발자국 애니메이션 시작
t = 3s      data-screen="2"   스캔 라인 이동 + X-ray 이미지 노출
t = 5s      data-screen="3"   Coming Soon 텍스트 등장, 날짜 글자 뒤집힘
t = 8s      cycle() 재호출 → 다시 화면 1
```

### 상태별 요소 변화

| 요소 | 화면 1 | 화면 2 | 화면 3 |
| --- | --- | --- | --- |
| `.bg` (회색 배경) | 표시 | 페이드아웃 | 숨김 |
| `.prints` (발자국) | 표시 | 페이드아웃 | 숨김 |
| `.bag-photo` | 보임 (`multiply`, opacity .82) | 반전·이동 후 투명 | 투명 |
| `.bag-xray` | `clip-path`로 완전히 가려짐 | 좌→우로 드러남 | 완전히 보임 |
| `.scan` (스캔 라인) | 숨김 | `scan` 애니메이션 실행 | 숨김 |
| `.s12` 텍스트 (`.ZIP`, `unzip the`, `stage`) | 표시 | 표시 | 위로 사라짐 |
| `.s3` 텍스트 (`Com`, `ing`, `Soon....` 등) | 숨김 | 숨김 | 아래에서 올라오며 등장 |
| `.date i` (날짜 글자) | `scaleX(-1)` (뒤집힘) | 뒤집힘 | `scaleX(1)` (순차 복원) |

---

## 5. 파일별 상세 설명

### 5.1 `index.html`

- `lang="ko"`, 타이틀은 `A to .ZIP — unzip the stage`
- 모든 텍스트 요소에 공통 클래스 `.t`를 부여하고, 개별 클래스로 위치·크기를 지정
- 화면 구분용 클래스
  - `.s12` : 화면 1·2에서 보이는 텍스트
  - `.s3` : 화면 3에서만 보이는 텍스트
- 날짜는 글자별로 `<i>` 태그로 쪼개어(`1`,`2`,`.`,`0`,`9` …) 글자 단위 뒤집기 애니메이션을 구현
- `.ZIP`의 `P`는 `.flip` 클래스로 항상 좌우 반전

**DOM 레이어 구조**

```
body[data-screen]
├── .bg              배경 (fixed)
├── .prints          발자국 컨테이너 (fixed, JS가 채움)
└── main.frame       1440 × 950 비율 고정 캔버스
    ├── img.bag-photo
    ├── img.bag-xray
    ├── .scan
    ├── p.caption
    └── .t 텍스트들 (A, TO, 날짜, .ZIP, unzip the, stage, Com, ing, Soon...., set, custom, production)
```

### 5.2 `style.css`

**① 디자인 캔버스 (`.frame`)**

```css
.frame {
  width: min(100vw, calc(100vh * 1.516));
  aspect-ratio: 1440 / 950;
  container-type: inline-size;
}
```

- 디자인 시안 크기 **1440 × 950**을 기준으로 비율을 고정합니다.
- `container-type: inline-size`를 선언해, 프레임 안의 모든 크기를 **`cqw`(컨테이너 너비의 1%)** 로 지정합니다. 즉 화면 크기가 달라져도 시안 비율 그대로 확대·축소됩니다.
- 위치는 모두 `%`, 폰트 크기는 모두 `cqw`로 표기되어 있어 시안 수치를 그대로 옮기기 쉽습니다.

**② 발자국 (`.print`)**

- `script.js`가 생성한 `div.print`에 CSS 변수 `--r`(회전각), `--f`(좌우 반전 ±1), `--i`(순번)를 주입
- `@keyframes step` : 흐릿하게 나타났다 위로 이동하며 사라짐
- `animation-delay: calc(var(--i) * .2s)` 로 12개 발자국이 0.2초 간격으로 순차 등장

**③ 가방 이미지 전환**

- `.bag-photo` : `mix-blend-mode: multiply`로 배경에 스며들게 처리. 화면 2부터 색 반전(`invert` + `hue-rotate`)되며 투명해짐
- `.bag-xray` : 초기값 `clip-path: inset(0 100% 0 0)`(완전히 가려짐) → 화면 2부터 `inset(0)`으로 열리며 좌→우로 드러남. 이 transition(1.4s linear)과 `.scan` 이동 시간(1.4s linear)이 일치해야 스캔 라인이 X-ray 경계와 맞물립니다

**④ 스캔 라인 (`.scan`)**

- 세로 그라디언트 + `box-shadow` 글로우로 파란 빛줄기 표현
- `@keyframes scan` : `left: 30.9% → 81%` 이동, 양 끝에서 페이드

### 5.3 `script.js`

즉시 실행 함수(IIFE)로 전역 오염 없이 작성되어 있습니다.

| 구성 요소 | 설명 |
| --- | --- |
| `basePath` | 발자국 12개의 `[x%, y%, 회전각]` 좌표 배열. PC 기준 경로이며 화면 가장자리를 따라 한 바퀴 도는 형태 |
| `footSVG` | 발 모양 SVG 문자열 (타원 2개: 앞꿈치 + 뒤꿈치) |
| `buildPrints()` | 발자국 DOM 생성. 모바일(≤768px)이면 X좌표를 `25 + x × 0.5`로 압축해 중앙으로 모음 |
| `cycle()` | `data-screen`을 1→2→3으로 전환하는 `setTimeout` 3개 + 8초 후 자기 자신 재호출 |
| `load` 이벤트 | `document.fonts.ready` 이후에 `cycle()` 시작 (폰트 로딩 전 레이아웃 튐 방지) |
| `resize` 이벤트 | 화면 1일 때만 `buildPrints()` 재실행 (회전/리사이즈 대응) |

**타이밍 상수 (수정 시 CSS와 함께 확인)**

```js
setTimeout(() => { body.dataset.screen = '2'; }, 3000);   // 화면 2 진입
setTimeout(() => { body.dataset.screen = '3'; }, 5000);   // 화면 3 진입
setTimeout(cycle, 8000);                                  // 전체 주기
```

---

## 6. 반응형 처리

브레이크포인트는 **768px 단일 기준**(`@media (max-width: 768px)`)입니다.

| 항목 | PC | 모바일 (≤ 768px) |
| --- | --- | --- |
| 레이아웃 | 절대 위치(`position: absolute`) 시안 재현 | 세로 flex 컬럼 + `position: relative !important`로 중앙 정렬 |
| 스크롤 | `overflow: hidden` | `overflow-y: auto` |
| 발자국 크기 | `6.5vw`, blur `1.1vw` | `12vw`, blur `2.5vw` |
| 발자국 X좌표 | 0~100% 전체 | 25~75% 구간으로 압축 |
| 가방 이미지 | 절대 위치 | 너비 75%, 가운데 정렬. X-ray는 음수 `margin-top`으로 사진 위에 겹침 |
| 스캔 라인 | `left: 30.9% → 81%` | `left: 12.5% → 87.5%` (별도 `@keyframes scan` 재정의) |
| 텍스트 | `cqw` 기반 개별 크기 | 모바일용 `cqw` 값으로 재정의 |

---

## 7. 접근성

- 장식용 요소(`.bg`, `.prints`, `.scan`)에는 `aria-hidden="true"` 적용
- 가방 사진에는 대체 텍스트 제공, 장식용 X-ray 이미지는 `alt=""`
- 글자 단위로 쪼갠 날짜는 `aria-label="12.09 - 12.12"`로 스크린리더에 온전한 값 전달
- `prefers-reduced-motion: reduce` 대응 : 발자국·전환 지속시간을 `0.01s`로 단축하고 스캔 애니메이션 비활성화

---

## 8. 커스터마이징 가이드

### 텍스트·날짜 수정

- 전시 문구 : `index.html`의 `.caption`
- 날짜 : `.date` 안의 `<i>` 글자들과 `aria-label`을 **함께** 수정. 글자 수가 바뀌어도 `script.js`가 `--n` 값을 자동으로 부여하므로 별도 수정 불필요

### 이미지 교체

`image/` 폴더의 파일을 **같은 파일명**으로 교체하면 코드 수정 없이 반영됩니다. 비율이 달라질 경우 `style.css`의 `.bag-photo`, `.bag-xray`의 `left / top / width`와 `.scan` 이동 범위를 조정해야 합니다.

> `bag-photo`는 `multiply` 블렌드를 사용하므로 **흰 배경**의 이미지가 가장 자연스럽게 섞입니다.

### 발자국 경로 변경

`script.js`의 `basePath` 배열을 수정합니다. 개수를 늘리면 `animation-delay`가 순번(`--i`)에 비례해 커지므로, 화면 1 길이(3초) 안에 모두 등장하는지 확인하세요. (현재 12개 × 0.2s = 최대 2.4s 지연 + 1.5s 재생)

### 타이밍 조정

화면 전환 시간은 `script.js`의 세 숫자에서, 각 모션 길이는 `style.css`의 `transition` / `animation` 값에서 변경합니다. 스캔 라인 이동(`1.4s`)과 X-ray `clip-path` 전환(`1.4s`)은 **반드시 같은 값**으로 유지하세요.

---

## 9. 배포 (GitHub Pages)

정적 사이트이므로 GitHub Pages로 바로 배포할 수 있습니다.

1. 저장소를 GitHub에 푸시
2. **Settings → Pages**
3. **Source** : `Deploy from a branch` → Branch `main` / 폴더 `/ (root)` 선택 후 저장
4. 몇 분 후 `https://<계정명>.github.io/<저장소명>/` 에서 확인

> 이미지·CSS·JS가 모두 **상대 경로**로 연결되어 있어 하위 경로(저장소명)에서도 별도 설정 없이 동작합니다.

---

## 10. 알려진 이슈 및 개선 제안

### 개선 권장

| 우선순위 | 항목 | 설명 |
| --- | --- | --- |
| 높음 | **이미지 용량 최적화** | `bag-photo.png`(약 2.3MB), `bag-xray.png`(약 2.8MB), `favicon.png`(약 360KB)로 총 5MB 이상. WebP 변환 및 리사이즈 시 로딩 속도가 크게 개선되며, 모바일 데이터 환경에서 특히 중요 |
| 높음 | **파비콘 축소** | 1254×1254 이미지를 파비콘으로 사용 중. 32×32 / 180×180(apple-touch-icon) 등으로 별도 제작 권장 |
| 중간 | **`viewport` 메타 태그 중복** | `index.html`의 `<head>`에 viewport 태그가 두 번 선언되어 있음. 하나 제거 필요 |
| 중간 | **OG / SEO 메타 태그 부재** | SNS 공유 시 미리보기를 위해 `og:title`, `og:description`, `og:image`, `description` 메타 추가 권장 |
| 낮음 | **JS 타이머 정리** | `cycle()`이 `setTimeout`을 누적 호출하는 구조. 탭이 백그라운드에 있다 복귀할 때 타이밍이 어긋날 수 있어, 타이머 ID를 보관해 정리하거나 `requestAnimationFrame` / CSS 애니메이션 기반으로 개선 가능 |

### 알려진 동작상 제약

- **모바일 레이아웃의 빈 공간** : 모바일에서는 `.t`가 `position: relative`로 전환되고 숨김 처리가 `opacity`로만 이루어지므로, 화면 3 전용 텍스트(`.s3`)가 화면 1·2에서도 **공간을 차지**합니다. 필요하다면 화면별로 `display` 전환 또는 겹침 배치(grid stacking)로 개선할 수 있습니다.
- **모바일 X-ray 겹침 값** : `.bag-xray`의 `margin-top: calc(-75vw * 0.65)`는 이미지 비율에 맞춘 근사값입니다. 이미지를 교체하면 재조정이 필요합니다.
- **리사이즈 대응 범위** : `resize` 시 발자국은 화면 1에서만 다시 계산됩니다. 화면 2·3 중에 회전하면 다음 주기(화면 1)부터 반영됩니다.
- **브레이크포인트 단일화** : 태블릿 가로 해상도(769px 이상) 등에서는 PC 레이아웃이 그대로 적용됩니다.

---

## 제작

상명대학교 예술대학 무대미술전공 제 28회 졸업전시회

## 라이선스

<!-- 라이선스를 지정해 주세요. 예) MIT, CC BY-NC 4.0, All rights reserved -->
미정
