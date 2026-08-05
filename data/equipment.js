const APP_CONFIG = {
  accessCode: "1234",
  appName: "전남경찰청 탑재장비 모바일 학습 앱",
};

const baseSteps = [
  "외관·구성품 이상 확인",
  "현장 안전 확보 후 착용 또는 휴대",
  "사용 후 오염·파손·배터리 상태 점검",
];

const baseCautions = [
  "소속 관서 지침과 현장 지휘 준수",
  "민감 전술·보관 위치·내부 문서 외부 공유 금지",
  "파손·이상 발견 시 즉시 보고",
];

const EQUIPMENT_OVERRIDES = {
  "req-01": {
    name: "방탄헬멧",
    group: "신체보호 장비",
    role: "머리·안면부 보호, 위험도에 따라 착용",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-01-bulletproof-helmet.jpg",
  },
  "req-02": {
    name: "목보호대",
    group: "신체보호 장비",
    role: "목 부위 충격·자상 위험 방지",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-02-neck-guard.jpg",
  },
  "req-03": {
    name: "방탄방검복",
    group: "신체보호 장비",
    role: "흉기·충격 위험 현장 상체 보호",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-03-ballistic-stab-vest.jpg",
  },
  "req-04": {
    name: "방검토시",
    group: "신체보호 장비",
    role: "팔 부위 자상 위험 방지",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-04-cut-resistant-sleeves.jpg",
  },
  "req-05": {
    name: "방검장갑",
    group: "신체보호 장비",
    role: "손 부위 베임·찔림 위험 방지",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-05-cut-resistant-gloves.jpg",
  },
  "req-06": {
    name: "중형방패",
    group: "신체보호 장비",
    role: "위험 대상자와 거리 유지, 신체 보호",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-06-medium-shield.jpg",
  },
  "req-07": {
    name: "소형방패",
    group: "신체보호 장비",
    role: "기동성과 방어가 필요한 현장 대응",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-07-small-shield.jpg",
  },
  "req-08": {
    name: "장봉(삼단봉)",
    group: "신체보호 장비",
    role: "위험 대상자 제지, 안전거리 확보",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-08-baton.jpg",
  },
  "req-09": {
    name: "안전경고등",
    group: "현장안전 장비",
    role: "위험 표시, 2차 사고 예방",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-09-standing-warning-light.jpg",
  },
  "req-10": {
    name: "라바콘",
    group: "현장안전 장비",
    role: "차량·보행자 진입 통제, 현장 경계 표시",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-10-traffic-cone.jpg",
  },
  "req-11": {
    name: "폴리스라인",
    group: "현장안전 장비",
    role: "통제 구역 표시, 일반인 접근 제한",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-11-police-line.jpg",
  },
  "req-12": {
    name: "불꽃신호기",
    group: "현장안전 장비",
    role: "야간·시야 제한 상황 시인성 확보",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-12-flare.jpg",
  },
  "req-13": {
    name: "소화기",
    group: "현장안전 장비",
    role: "초기 화재 대응, 현장 안전 확보",
    videoUrl: "assets/videos/fire.mp4",
    thumbnailUrl: "assets/thumbnails/req-13-fire-extinguisher.jpg",
    steps: [
      "주변 위험요소를 확인하고 인명 대피와 현장 통제를 우선 실시",
      "소화기 압력계, 안전핀, 호스와 노즐 상태 확인",
      "화점과 안전거리를 유지한 상태에서 안전핀 제거",
      "노즐을 화점 하단으로 향하게 하고 손잡이를 눌러 분사",
      "좌우로 쓸듯이 분사한 뒤 재발화 여부 확인 및 사용 장비 교체 보고",
    ],
    cautions: [
      "불길이 크거나 연기가 확산되면 무리한 진입보다 대피와 지원 요청 우선",
      "전기·유류 등 화재 유형과 주변 위험물 여부 확인",
      "분말 분사 후 시야 저하, 미끄럼, 흡입 위험에 유의",
      "사용 후에는 잔량과 파손 상태를 확인하고 즉시 보충 또는 교체",
    ],
    quiz: [
      {
        question: "소화기 사용 전 가장 먼저 고려할 사항은 무엇입니까?",
        options: ["인명 대피와 현장 안전 확보", "소화기 외관 색상", "촬영 위치 선정"],
        answer: 0,
      },
      {
        question: "소화기 분사 방향으로 가장 적절한 곳은 어디입니까?",
        options: ["화점의 하단", "불꽃 위쪽 공중", "주변 차량 유리"],
        answer: 0,
      },
      {
        question: "소화기 사용 후 필요한 조치로 맞는 것은 무엇입니까?",
        options: ["재발화 여부 확인 및 장비 교체 보고", "현장에 그대로 방치", "잔량 확인 없이 보관"],
        answer: 0,
      },
    ],
  },
  "req-14": {
    name: "화재마스크",
    group: "현장안전 장비",
    role: "화재 연기 등 유해 환경 호흡 보호",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-14-fire-mask.jpg",
  },
  "req-15": {
    name: "신호봉",
    group: "현장안전 장비",
    role: "교통 관리·현장 유도 시인성 확보",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-15-signal-baton.jpg",
  },
  "req-16": {
    name: "음주감지기",
    group: "음주단속 장비",
    role: "음주 의심 운전자 확인",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/req-16-breathalyzer.jpg",
  },
  "opt-01": {
    name: "안전모",
    group: "신체보호 장비",
    role: "낙하물·충격 위험 현장 머리 보호",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-01-safety-helmet.jpg",
  },
  "opt-02": {
    name: "내피형 방검복",
    group: "신체보호 장비",
    role: "복장 안쪽 착용, 상체 위해 위험 방지",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-02-inner-stab-vest.jpg",
  },
  "opt-03": {
    name: "D형 보호복",
    group: "신체보호 장비",
    role: "감염·오염 우려 현장 신체 노출 방지",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-03-type-d-protective-suit.jpg",
  },
  "opt-04": {
    name: "우의",
    group: "신체보호 장비",
    role: "우천 등 기상 악화 상황 신체·복장 보호",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-04-raincoat.jpg",
  },
  "opt-05": {
    name: "라텍스 장갑",
    group: "신체보호 장비",
    role: "감염·오염 가능 물체 취급 시 손 보호",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-05-latex-gloves.jpg",
  },
  "opt-06": {
    name: "손소독제",
    group: "신체보호 장비",
    role: "현장 활동 전후 손 위생 관리",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-06-hand-sanitizer.jpg",
  },
  "opt-07": {
    name: "비접촉 체온계",
    group: "신체보호 장비",
    role: "비접촉 체온 확인, 감염 의심 초기 확인",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-07-noncontact-thermometer.jpg",
  },
  "opt-08": {
    name: "구명환",
    group: "인명구조 장비",
    role: "수난 상황 대상자 부력 제공",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-08-life-ring.jpg",
  },
  "opt-09": {
    name: "구명조끼",
    group: "인명구조 장비",
    role: "수난 현장 구조자·대상자 부력 확보",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-09-life-jacket.jpg",
  },
  "opt-10": {
    name: "구명로프",
    group: "인명구조 장비",
    role: "구조 상황 대상자 접근·견인 지원",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-10-rescue-rope.jpg",
  },
  "opt-11": {
    name: "자동심장충격기",
    group: "인명구조 장비",
    role: "심정지 의심 환자 응급처치 지원",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-11-aed.jpg",
  },
  "opt-12": {
    name: "구급함",
    group: "인명구조 장비",
    role: "응급처치 기본 물품 보관·활용",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-12-first-aid-kit.jpg",
  },
  "opt-13": {
    name: "모래주머니",
    group: "재해재난 장비",
    role: "침수·누수 상황 물길 차단·임시 보강",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-13-sandbag.jpg",
  },
  "opt-14": {
    name: "스노우체인",
    group: "재해재난 장비",
    role: "강설·결빙 도로 이동 안전 확보",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-14-snow-chain.jpg",
  },
  "opt-15": {
    name: "삽",
    group: "재해재난 장비",
    role: "눈·토사·장애물 제거",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-15-shovel.jpg",
  },
  "opt-16": {
    name: "염화칼슘",
    group: "재해재난 장비",
    role: "결빙 도로·보행로 미끄럼 위험 방지",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-16-calcium-chloride.jpg",
  },
  "opt-17": {
    name: "대형라이트",
    group: "재해재난 장비",
    role: "야간·정전·수색 상황 조도 확보",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-17-large-flashlight.jpg",
  },
  "opt-18": {
    name: "검문안내판",
    group: "재해재난 장비",
    role: "검문·통제 현장 안내 표시",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-18-checkpoint-sign.jpg",
  },
  "opt-19": {
    name: "락카",
    group: "재해재난 장비",
    role: "현장 표시·임시 표식·위험 구역 구분",
    videoUrl: "",
    thumbnailUrl: "assets/thumbnails/opt-19-lacquer-spray.jpg",
  },
};

const requiredNames = Array.from({ length: 16 }, (_, index) => EQUIPMENT_OVERRIDES[`req-${String(index + 1).padStart(2, "0")}`].name);
const optionalNames = Array.from({ length: 19 }, (_, index) => EQUIPMENT_OVERRIDES[`opt-${String(index + 1).padStart(2, "0")}`].name);

function makeEquipment(name, category, index) {
  const label = category === "required" ? "필수장비" : "선택장비";
  const idPrefix = category === "required" ? "req" : "opt";
  const displayNumber = String(index + 1).padStart(2, "0");
  const id = `${idPrefix}-${displayNumber}`;
  const custom = EQUIPMENT_OVERRIDES[id] || {};
  const title = custom.name || name;
  const defaultQuiz = [
    {
      question: `${title} 사용 전 가장 먼저 확인할 사항은 무엇입니까?`,
      options: ["외관과 구성품 이상 유무", "영상 재생 횟수", "개인 휴대전화 기종"],
      answer: 0,
    },
    {
      question: `${title}의 사용 기준으로 가장 적절한 것은 무엇입니까?`,
      options: ["현장 상황과 소속 관서 지침", "개인 선호", "임의 판단만으로 결정"],
      answer: 0,
    },
    {
      question: `장비 이상 발견 시 적절한 조치는 무엇입니까?`,
      options: ["관리자에게 보고", "임의 폐기", "별도 기록 없이 보관"],
      answer: 0,
    },
  ];

  return {
    id,
    name: title,
    category,
    group: custom.group || label,
    role: custom.role || `${label} ${displayNumber}의 역할과 사용 시점을 학습합니다. 실제 장비명과 설명으로 교체하세요.`,
    tags: [label, custom.group || "", "순찰차", "기본교육"].filter(Boolean),
    videoUrl: custom.videoUrl || "",
    thumbnailUrl: custom.thumbnailUrl || "",
    steps: custom.steps || baseSteps,
    cautions: custom.cautions || baseCautions,
    quiz: custom.quiz || defaultQuiz,
  };
}

const EQUIPMENT = [
  ...requiredNames.map((name, index) => makeEquipment(name, "required", index)),
  ...optionalNames.map((name, index) => makeEquipment(name, "optional", index)),
];

const SCENARIOS = [
  {
    id: "weapon-report",
    title: "흉기 소지 신고접수",
    summary: "위험도 확인, 안전거리 확보, 보호장비 착용 여부를 중심으로 점검합니다.",
    equipmentIds: ["req-01", "req-02", "req-03", "opt-01"],
  },
  {
    id: "traffic-crash",
    title: "교통사고 신고접수",
    summary: "2차 사고 방지, 현장 표시, 응급조치 지원 장비를 중심으로 점검합니다.",
    equipmentIds: ["req-04", "req-05", "req-06", "opt-02"],
  },
  {
    id: "water-rescue",
    title: "익수 신고접수",
    summary: "구조 가능성, 접근 안전, 구명장비 준비 여부를 중심으로 점검합니다.",
    equipmentIds: ["req-07", "req-08", "opt-03", "opt-04"],
  },
];
