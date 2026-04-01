<<<<<<< HEAD
# MAP_data
# 🗺️ AI 스트레스 지도 — 지도 데이터 전처리

서울특별시 행정동 경계 GeoJSON을 React Native SVG 지도용 JSON으로 변환하는 스크립트

## 📁 폴더 구조
```
map/
├── scripts/
│   ├── filter_seoul.js       # 전국 행정동 → 서울만 필터링
│   └── convert_geo.js        # GeoJSON → SVG Path JSON 변환
├── seoul_dong/               # 구별 GeoJSON (필터링 결과)
│   ├── 강남구.geojson
│   └── ...
├── output/                   # 변환된 최종 파일 (앱에서 사용)
│   ├── seoul_gu.json         # 서울 25개 구 SVG Path
│   └── seoul_dong/
│       ├── 강남구.json
│       └── ...
└── HangJeongDong_ver20260201.geojson  # 원본 데이터 (git 제외)
```

## 🚀 사용법

### 1. 의존성 설치
```bash
# Node.js만 있으면 됨 (외부 라이브러리 없음)
node -v
```

### 2. 원본 데이터 준비
[행정안전부 행정동 경계 파일](https://github.com/vuski/admdongkor) 에서
최신 GeoJSON 다운로드 후 `map/` 폴더에 저장

### 3. 서울 필터링
```bash
node scripts/filter_seoul.js
```
→ `seoul_dong/` 폴더에 구별 GeoJSON 25개 생성

### 4. SVG Path 변환
```bash
node scripts/convert_geo.js
```
→ `output/` 폴더에 앱용 JSON 파일 생성

## 📦 output 파일 설명

| 파일 | 설명 | 사용 화면 |
|---|---|---|
| `output/seoul_gu.json` | 서울 25개 구 경계 | 서울 지도 화면 |
| `output/seoul_dong/강남구.json` | 강남구 동 경계 | 구 클릭 후 동 지도 화면 |

## 🛠️ 데이터 출처
- 행정동 경계: [vuski/admdongkor](https://github.com/vuski/admdongkor)
- 좌표계: WGS84 (EPSG:4326)
=======
# geojson
>>>>>>> 58d787e8826ed6dd569093a9f57af336cfd5465b
