const APP_CONFIG = {
  accessCode: "1234",
  appName: "순찰차 탑재장비 교육",
};

const baseSteps = [
  "장비 외관과 구성품 이상 유무를 확인합니다.",
  "현장 안전을 확보한 뒤 필요한 위치에 착용 또는 휴대합니다.",
  "사용 후 오염, 파손, 배터리 잔량 등 관리 상태를 점검합니다.",
];

const baseCautions = [
  "소속 관서 지침과 현장 지휘에 따라 사용합니다.",
  "교육영상에는 민감한 전술, 보관 위치, 내부 문서 원문을 포함하지 않습니다.",
  "파손 또는 이상 발견 시 즉시 관리자에게 보고합니다.",
];

const requiredNames = Array.from({ length: 16 }, (_, index) => `필수장비 ${String(index + 1).padStart(2, "0")}`);
const optionalNames = Array.from({ length: 19 }, (_, index) => `선택장비 ${String(index + 1).padStart(2, "0")}`);

const EQUIPMENT_OVERRIDES = {
  "req-01": {
    name: "필수장비 01",
    videoUrl: "",
    thumbnailUrl: "",
  },
  "opt-01": {
    name: "선택장비 01",
    videoUrl: "",
    thumbnailUrl: "",
  },
};

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
    role: custom.role || `${label} ${displayNumber}의 역할과 사용 시점을 학습합니다. 실제 장비명과 설명으로 교체하세요.`,
    tags: [label, "순찰차", "기본교육"],
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
