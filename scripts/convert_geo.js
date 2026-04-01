// scripts/convert_geo.js
const fs = require('fs');

// 경도/위도 → SVG 픽셀 좌표 변환 (서울 범위 기준)
function project(lng, lat, width, height) {
  const minLng = 126.734, maxLng = 127.269;
  const minLat = 37.413,  maxLat = 37.716;
  const x = (lng - minLng) / (maxLng - minLng) * width;
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * height;
  return [x, y];
}

// GeoJSON Feature → SVG d 문자열
function featureToPath(feature, w, h) {
  const geom = feature.geometry;
  const polys = geom.type === 'Polygon'
    ? [geom.coordinates]
    : geom.coordinates;

  return polys.map(poly =>
    poly.map(ring =>
      ring.map((pt, i) => {
        const [x, y] = project(pt[0], pt[1], w, h);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      }).join(' ') + 'Z'
    ).join(' ')
  ).join(' ');
}

// 출력 폴더 생성
if (!fs.existsSync('output')) fs.mkdirSync('output');
if (!fs.existsSync('output/seoul_dong')) fs.mkdirSync('output/seoul_dong');

// ① 서울 전체 동 변환 (구 경계용)
const seoulAll = JSON.parse(fs.readFileSync('seoul_dong_all.geojson', 'utf-8'));

// 구별로 그룹핑해서 구 경계 만들기
const guMap = {};
seoulAll.features.forEach(f => {
  const guName = f.properties.sggnm;
  const guCode = f.properties.sgg;
  if (!guMap[guName]) guMap[guName] = { code: guCode, name: guName, features: [] };
  guMap[guName].features.push(f);
});

// 구 단위 SVG Path (각 구의 동들을 하나로 합침)
const seoulGu = Object.values(guMap).map(gu => ({
  code: gu.code,
  name: gu.name,
  d: gu.features.map(f => featureToPath(f, 400, 400)).join(' '),
}));

fs.writeFileSync('output/seoul_gu.json', JSON.stringify(seoulGu, null, 2));
console.log(`서울 구 변환 완료: ${seoulGu.length}개`);

// ② 구별 동 단위 변환
const guFiles = fs.readdirSync('seoul_dong').filter(f => f.endsWith('.geojson'));

guFiles.forEach(file => {
  const guName = file.replace('.geojson', '');
  const data = JSON.parse(fs.readFileSync(`seoul_dong/${file}`, 'utf-8'));

  const result = data.features.map(f => ({
    code: f.properties.adm_cd2,
    name: f.properties.adm_nm.split(' ').pop(), // "서울특별시 종로구 사직동" → "사직동"
    d: featureToPath(f, 400, 400),
  }));

  fs.writeFileSync(
    `output/seoul_dong/${guName}.json`,
    JSON.stringify(result, null, 2)
  );
  console.log(`${guName} 변환 완료: ${result.length}개 동`);
});

console.log('\n모든 변환 완료!');
console.log('output/seoul_gu.json → 서울 구 지도용');
console.log('output/seoul_dong/*.json → 각 구 동 지도용');