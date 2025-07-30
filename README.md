# 카드 선택 게임

HTML, CSS, JavaScript로 만든 카드 선택 게임입니다.

## 기능

- **덱 선택**: 불(🔥), 물(💧), 풀(🌿) 중에서 선택
- **자동 랜덤 선택**: 덱 선택 시 자동으로 5장의 카드가 랜덤 선택
- **수동 선택**: "내가 채우기" 버튼으로 원하는 카드 직접 선택
- **카드 사용**: 선택된 카드 클릭으로 사용 (제거)
- **다시 선택**: 새로운 랜덤 5장 선택

## 파일 구조

```
deck/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── script.js           # JavaScript 로직
├── README.md           # 프로젝트 설명
└── img/                # 카드 이미지 폴더
    ├── img_fire/       # 불 속성 카드들
    ├── img_water/      # 물 속성 카드들
    └── img_leaf/       # 풀 속성 카드들
```

## 실행 방법

1. 모든 파일을 다운로드
2. `index.html` 파일을 웹 브라우저에서 열기
3. 또는 로컬 서버 실행:
   ```bash
   python3 -m http.server 8000
   ```
   후 브라우저에서 `http://localhost:8000` 접속

## 기술 스택

- HTML5
- CSS3 (Flexbox, Grid, 애니메이션)
- JavaScript (ES6+)
- 반응형 디자인

## 라이선스

MIT License 