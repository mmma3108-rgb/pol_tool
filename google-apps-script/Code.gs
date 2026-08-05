const SHEET_NAMES = {
  eventLog: "EventLog",
  learners: "Learners",
  personal: "PersonalSummary",
  unit: "UnitSummary",
  station: "StationSummary",
};

const EVENT_HEADERS = [
  "수신시각",
  "이벤트시각",
  "이벤트",
  "앱버전",
  "클라이언트ID",
  "학습자키",
  "소속구분",
  "경찰서",
  "소속",
  "지역관서",
  "계급",
  "성명",
  "장비ID",
  "장비명",
  "장비구분",
  "완료장비수",
  "전체장비수",
  "완료율",
  "통과퀴즈수",
  "브라우저",
];

const LEARNER_HEADERS = [
  "최근갱신",
  "학습자키",
  "소속구분",
  "경찰서",
  "소속",
  "지역관서",
  "계급",
  "성명",
  "완료장비수",
  "전체장비수",
  "완료율",
  "통과퀴즈수",
  "최근이벤트",
  "클라이언트ID",
];

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheets_(ss);

    appendEvent_(ss, payload);
    upsertLearner_(ss, payload);
    rebuildSummaries_(ss);

    return jsonOutput_({ ok: true });
  } catch (error) {
    return jsonOutput_({ ok: false, error: String(error.message || error) });
  }
}

function doGet() {
  setupSheets();
  return jsonOutput_({ ok: true, message: "Training analytics web app is ready." });
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheets_(ss);
  rebuildSummaries_(ss);
}

function testPost() {
  const sample = {
    postData: {
      contents: JSON.stringify({
        eventType: "test_completed",
        eventAt: new Date().toISOString(),
        appVersion: "test",
        clientId: "test-client",
        userAgent: "Apps Script manual test",
        profile: {
          orgType: "local",
          station: "목포",
          unit: "목포 / 하당",
          localOffice: "하당",
          rank: "경위",
          name: "홍길동",
        },
        summary: {
          completed: 3,
          total: 35,
          percent: 9,
          quizzes: 2,
        },
        details: {
          equipmentId: "req-01",
          equipmentName: "필수장비 01",
          equipmentCategory: "required",
        },
      }),
    },
  };
  return doPost(sample);
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error("No payload");
  return JSON.parse(e.postData.contents);
}

function jsonOutput_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function ensureSheets_(ss) {
  ensureSheet_(ss, SHEET_NAMES.eventLog, EVENT_HEADERS);
  ensureSheet_(ss, SHEET_NAMES.learners, LEARNER_HEADERS);
  ensureSheet_(ss, SHEET_NAMES.personal, [
    "경찰서",
    "소속",
    "지역관서",
    "계급",
    "성명",
    "완료장비수",
    "전체장비수",
    "완료율",
    "통과퀴즈수",
    "최근갱신",
  ]);
  ensureSheet_(ss, SHEET_NAMES.unit, [
    "경찰서",
    "소속",
    "학습자수",
    "평균완료율",
    "100%완료자",
    "완료장비합계",
    "대상장비합계",
    "최근갱신",
  ]);
  ensureSheet_(ss, SHEET_NAMES.station, [
    "경찰서",
    "학습자수",
    "평균완료율",
    "100%완료자",
    "완료장비합계",
    "대상장비합계",
    "최근갱신",
  ]);
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeader = current.join("") === "" || current.some((value, index) => value !== headers[index]);
  if (needsHeader) {
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#123c35").setFontColor("#ffffff");
}

function appendEvent_(ss, payload) {
  const profile = payload.profile || {};
  const summary = payload.summary || {};
  const details = payload.details || {};
  const sheet = ss.getSheetByName(SHEET_NAMES.eventLog);
  const learnerKey = getLearnerKey_(profile);
  const policeStation = getPoliceStation_(profile);
  const completionRate = Number(summary.percent || 0) / 100;

  sheet.appendRow([
    new Date(),
    payload.eventAt ? new Date(payload.eventAt) : "",
    payload.eventType || "",
    payload.appVersion || "",
    payload.clientId || "",
    learnerKey,
    profile.orgType || "",
    policeStation,
    profile.unit || "",
    profile.localOffice || "",
    profile.rank || "",
    profile.name || "",
    details.equipmentId || "",
    details.equipmentName || "",
    details.equipmentCategory || "",
    Number(summary.completed || 0),
    Number(summary.total || 0),
    completionRate,
    Number(summary.quizzes || 0),
    payload.userAgent || "",
  ]);
  sheet.getRange(sheet.getLastRow(), 18).setNumberFormat("0%");
}

function upsertLearner_(ss, payload) {
  const profile = payload.profile || {};
  const summary = payload.summary || {};
  const sheet = ss.getSheetByName(SHEET_NAMES.learners);
  const learnerKey = getLearnerKey_(profile);
  if (!learnerKey) return;

  const values = sheet.getDataRange().getValues();
  let targetRow = values.findIndex((row, index) => index > 0 && row[1] === learnerKey) + 1;
  if (targetRow < 2) targetRow = sheet.getLastRow() + 1;

  const row = [
    new Date(),
    learnerKey,
    profile.orgType || "",
    getPoliceStation_(profile),
    profile.unit || "",
    profile.localOffice || "",
    profile.rank || "",
    profile.name || "",
    Number(summary.completed || 0),
    Number(summary.total || 0),
    Number(summary.percent || 0) / 100,
    Number(summary.quizzes || 0),
    payload.eventType || "",
    payload.clientId || "",
  ];

  sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
  sheet.getRange(targetRow, 11).setNumberFormat("0%");
}

function rebuildSummaries_(ss) {
  const learners = readLearners_(ss);
  rebuildPersonal_(ss, learners);
  rebuildUnit_(ss, learners);
  rebuildStation_(ss, learners);
}

function readLearners_(ss) {
  const sheet = ss.getSheetByName(SHEET_NAMES.learners);
  const values = sheet.getDataRange().getValues().slice(1);
  return values
    .filter((row) => row[1])
    .map((row) => ({
      updatedAt: row[0],
      learnerKey: row[1],
      orgType: row[2],
      policeStation: row[3],
      unit: row[4],
      localOffice: row[5],
      rank: row[6],
      name: row[7],
      completed: Number(row[8] || 0),
      total: Number(row[9] || 0),
      rate: Number(row[10] || 0),
      quizzes: Number(row[11] || 0),
    }));
}

function rebuildPersonal_(ss, learners) {
  const sheet = ss.getSheetByName(SHEET_NAMES.personal);
  const rows = learners
    .sort((a, b) => `${a.policeStation}${a.unit}${a.name}`.localeCompare(`${b.policeStation}${b.unit}${b.name}`, "ko"))
    .map((item) => [
      item.policeStation,
      item.unit,
      item.localOffice,
      item.rank,
      item.name,
      item.completed,
      item.total,
      item.rate,
      item.quizzes,
      item.updatedAt,
    ]);
  rewriteData_(sheet, rows, 10, [8]);
}

function rebuildUnit_(ss, learners) {
  const grouped = groupBy_(learners, (item) => `${item.policeStation}|||${item.unit}`);
  const rows = Object.keys(grouped)
    .sort((a, b) => a.localeCompare(b, "ko"))
    .map((key) => {
      const items = grouped[key];
      const first = items[0];
      const completedSum = sum_(items, "completed");
      const totalSum = sum_(items, "total");
      return [
        first.policeStation,
        first.unit,
        items.length,
        totalSum ? completedSum / totalSum : 0,
        items.filter((item) => item.rate >= 1).length,
        completedSum,
        totalSum,
        new Date(),
      ];
    });
  rewriteData_(ss.getSheetByName(SHEET_NAMES.unit), rows, 8, [4]);
}

function rebuildStation_(ss, learners) {
  const grouped = groupBy_(learners, (item) => item.policeStation || "미분류");
  const rows = Object.keys(grouped)
    .sort((a, b) => a.localeCompare(b, "ko"))
    .map((key) => {
      const items = grouped[key];
      const completedSum = sum_(items, "completed");
      const totalSum = sum_(items, "total");
      return [
        key,
        items.length,
        totalSum ? completedSum / totalSum : 0,
        items.filter((item) => item.rate >= 1).length,
        completedSum,
        totalSum,
        new Date(),
      ];
    });
  rewriteData_(ss.getSheetByName(SHEET_NAMES.station), rows, 7, [3]);
}

function rewriteData_(sheet, rows, columns, percentColumns) {
  const lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange(2, 1, lastRow - 1, columns).clearContent();
  if (rows.length) sheet.getRange(2, 1, rows.length, columns).setValues(rows);
  percentColumns.forEach((col) => {
    if (rows.length) sheet.getRange(2, col, rows.length, 1).setNumberFormat("0%");
  });
  sheet.autoResizeColumns(1, columns);
}

function groupBy_(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function sum_(items, field) {
  return items.reduce((total, item) => total + Number(item[field] || 0), 0);
}

function getLearnerKey_(profile) {
  if (!profile || !profile.unit || !profile.name) return "";
  return `${profile.unit}|${profile.name}`;
}

function getPoliceStation_(profile) {
  if (!profile) return "";
  if (profile.orgType === "headquarters") return "전남청 본부";
  return profile.station ? `${profile.station}경찰서` : "";
}
