(function () {
  const lastSelectionKey = "patrolTraining.lastSelection";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("entryForm");
    const error = document.getElementById("entryError");
    const code = document.getElementById("entryCode");
    const name = document.getElementById("entryName");
    const rank = document.getElementById("entryRank");
    const station = document.getElementById("entryStation");
    const localOffice = document.getElementById("entryLocalOffice");
    const headquarters = document.getElementById("entryHeadquarters");
    const stationField = document.getElementById("stationField");
    const localOfficeField = document.getElementById("localOfficeField");
    const headquartersField = document.getElementById("headquartersField");
    const typeInputs = Array.from(document.querySelectorAll('input[name="entryOrgType"]'));

    populateOptions();
    restoreLastSelection();
    syncOrgFields();

    typeInputs.forEach((input) => input.addEventListener("change", syncOrgFields));
    station.addEventListener("change", () => {
      populateLocalOffices(station.value);
      saveLastSelection();
    });
    localOffice.addEventListener("change", saveLastSelection);
    headquarters.addEventListener("change", saveLastSelection);
    rank.addEventListener("change", saveLastSelection);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      error.textContent = "";

      if (code.value !== APP_CONFIG.accessCode) {
        error.textContent = "비밀번호를 확인하세요.";
        code.focus();
        return;
      }

      const org = getSelectedOrg();
      if (!org.unit) {
        error.textContent = "소속을 선택하세요.";
        return;
      }

      TrainingApp.setProfile({
        unit: org.unit,
        orgType: org.type,
        station: org.station,
        localOffice: org.localOffice,
        name: name.value.trim(),
        rank: rank.value,
        enteredAt: new Date().toISOString(),
      });
      saveLastSelection();

      window.location.href = "home.html";
    });

    TrainingApp.refreshIcons();

    function populateOptions() {
      fillSelect(headquarters, ORGANIZATION.headquarters, "소속 선택");
      fillSelect(station, ORGANIZATION.policeStations, "경찰서 선택", (value) => `${value}경찰서`);
      populateLocalOffices(station.value || ORGANIZATION.policeStations[0]);
    }

    function populateLocalOffices(stationName) {
      const offices = ORGANIZATION.localOffices[stationName] || [];
      fillSelect(localOffice, offices, "지역관서 선택");
    }

    function fillSelect(select, values, placeholder, labeler = (value) => value) {
      select.innerHTML = `<option value="">${placeholder}</option>`;
      values.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = labeler(value);
        select.appendChild(option);
      });
    }

    function getOrgType() {
      return typeInputs.find((input) => input.checked)?.value || "local";
    }

    function getSelectedOrg() {
      const type = getOrgType();
      if (type === "headquarters") {
        return {
          type,
          unit: headquarters.value,
          station: "",
          localOffice: "",
        };
      }

      if (type === "station") {
        return {
          type,
          unit: station.value ? `${station.value}경찰서` : "",
          station: station.value,
          localOffice: "",
        };
      }

      return {
        type,
        unit: station.value && localOffice.value ? `${station.value} / ${localOffice.value}` : "",
        station: station.value,
        localOffice: localOffice.value,
      };
    }

    function syncOrgFields() {
      const type = getOrgType();
      stationField.hidden = type === "headquarters";
      localOfficeField.hidden = type !== "local";
      headquartersField.hidden = type !== "headquarters";

      station.required = type !== "headquarters";
      localOffice.required = type === "local";
      headquarters.required = type === "headquarters";

      if (type === "headquarters" && !headquarters.value) headquarters.value = ORGANIZATION.headquarters[0] || "";
      if (type !== "headquarters" && !station.value) station.value = ORGANIZATION.policeStations[0] || "";
      if (type === "local" && station.value && !localOffice.value) populateLocalOffices(station.value);

      saveLastSelection();
    }

    function saveLastSelection() {
      localStorage.setItem(
        lastSelectionKey,
        JSON.stringify({
          orgType: getOrgType(),
          station: station.value,
          localOffice: localOffice.value,
          headquarters: headquarters.value,
          rank: rank.value,
        }),
      );
    }

    function restoreLastSelection() {
      try {
        const saved = JSON.parse(localStorage.getItem(lastSelectionKey));
        if (!saved) return;

        const type = saved.orgType || "local";
        const input = typeInputs.find((item) => item.value === type);
        if (input) input.checked = true;

        if (saved.headquarters) headquarters.value = saved.headquarters;
        if (saved.station) {
          station.value = saved.station;
          populateLocalOffices(saved.station);
        }
        if (saved.localOffice) localOffice.value = saved.localOffice;
        if (saved.rank) rank.value = saved.rank;
      } catch {
        localStorage.removeItem(lastSelectionKey);
      }
    }
  });
})();
