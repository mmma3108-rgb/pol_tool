# 순찰차 탑재장비 교육앱

GitHub Pages에 올려서 사용할 수 있는 정적 PWA입니다. 영상 촬영 후 `data/equipment.js`의 `videoUrl` 값을 채우면 장비별 영상이 표시됩니다.

## 페이지 구성

- `index.html`: 접속 비밀번호, 소속, 성명, 계급 입력
- `home.html`: 장비 목록, 검색, 분류, 학습현황, 상황별 학습
- `equipment.html?id=req-01`: 장비별 영상, 절차, 주의사항, 체크퀴즈

## 수정할 곳

- 접속 비밀번호: `data/equipment.js`의 `APP_CONFIG.accessCode`
- 소속 선택 목록: `data/organization.js`
- 장비명/영상 링크: `data/equipment.js`의 `EQUIPMENT_OVERRIDES`
- 장비 사진: `assets/thumbnails` 폴더에 사진을 넣고 `thumbnailUrl`에 경로 입력
- 공통 설명: `baseSteps`, `baseCautions`, `makeEquipment` 기본 문구

YouTube 링크는 일반 보기 링크와 `youtu.be` 링크를 넣어도 자동으로 임베드 주소로 변환됩니다.

예시:

```js
const EQUIPMENT_OVERRIDES = {
  "req-01": {
    name: "장비명",
    role: "장비의 핵심 역할을 한 문장으로 입력",
    thumbnailUrl: "assets/thumbnails/req-01.jpg",
    videoUrl: "https://youtu.be/영상ID",
  },
};
```

## 배포

1. GitHub 저장소에 이 폴더의 파일을 업로드합니다.
2. 저장소 `Settings > Pages`에서 배포 브랜치와 폴더를 선택합니다.
3. 생성된 Pages 주소를 QR코드로 변환해 교육자료에 넣습니다.

Pages 주소는 `index.html`로 안내하면 됩니다. 정상 입장 후 자동으로 `home.html`로 이동하고, 장비 선택 시 `equipment.html`로 이동합니다.

## 보안 메모

이 앱의 비밀번호와 입장정보 입력은 강한 인증이 아니라 접근 억제와 고지 목적입니다. 실제 민감한 전술, 장비 취약점, 내부 문서 원문, 보관 위치, 사건 정보는 영상에 포함하지 않는 것을 권장합니다.
