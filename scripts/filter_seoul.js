// scripts/filter_seoul.js
const fs = require('fs');

const all = JSON.parse(fs.readFileSync('HangJeongDong_ver20260201.geojson', 'utf-8'));

// 서울만 필터링 (sido === "11")
const seoul = all.features.filter(f => f.properties.sido === "11");

console.log(`서울 동 개수: ${seoul.length}개`);

// ① 서울 전체 동 저장 (혹시 필요할 때용)
fs.writeFileSync('seoul_dong_all.geojson', JSON.stringify({
  type: "FeatureCollection",
  features: seoul
}, null, 2));

// ② 구별로 분리해서 저장
const byGu = {};
seoul.forEach(f => {
  const guName = f.properties.sggnm; // "종로구", "강남구" 등
  if (!byGu[guName]) byGu[guName] = [];
  byGu[guName].push(f);
});

// 폴더 없으면 생성
if (!fs.existsSync('seoul_dong')) fs.mkdirSync('seoul_dong');

Object.entries(byGu).forEach(([guName, features]) => {
  fs.writeFileSync(
    `seoul_dong/${guName}.geojson`,
    JSON.stringify({ type: "FeatureCollection", features }, null, 2)
  );
  console.log(`${guName}: ${features.length}개 동`);
});

console.log('완료!');