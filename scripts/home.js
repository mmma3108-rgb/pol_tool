(function () {
  const state = {
    filter: "all",
    query: "",
  };

  const nodes = {};

  document.addEventListener("DOMContentLoaded", () => {
    const profile = TrainingApp.requireProfile();
    if (!profile) return;
    bindNodes();
    bindEvents();
    renderProfileSummary(profile);
    renderAll();
    TrainingApp.refreshIcons();
  });

  function bindNodes() {
    [
      "welcomeText",
      "progressValue",
      "completedValue",
      "quizValue",
      "leftValue",
      "searchInput",
      "resultCount",
      "equipmentGrid",
      "scenarioGrid",
      "equipmentSection",
      "scenarioSection",
      "profileButton",
      "profileDialog",
      "profileTitle",
      "profileUnit",
      "profileRank",
      "profileTime",
      "closeProfile",
      "resetProgress",
      "logoutButton",
    ].forEach((id) => {
      nodes[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    nodes.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value.trim().toLowerCase();
      renderEquipment();
    });

    document.querySelectorAll(".segment").forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        document.querySelectorAll(".segment").forEach((item) => item.classList.toggle("is-active", item === button));
        syncSections();
        renderEquipment();
      });
    });

    nodes.profileButton.addEventListener("click", openProfile);
    nodes.closeProfile.addEventListener("click", () => nodes.profileDialog.close());
    nodes.resetProgress.addEventListener("click", () => {
      TrainingApp.resetProgress();
      renderAll();
      nodes.profileDialog.close();
    });
    nodes.logoutButton.addEventListener("click", () => {
      TrainingApp.clearProfile();
      window.location.href = "index.html";
    });
  }

  function renderProfileSummary(profile) {
    nodes.welcomeText.textContent = `${profile.rank} ${profile.name}님, 필요한 장비부터 확인하세요.`;
  }

  function renderAll() {
    renderStatus();
    renderEquipment();
    renderScenarios();
    syncSections();
  }

  function renderStatus() {
    const summary = TrainingApp.getProgressSummary();
    nodes.progressValue.textContent = `${summary.percent}%`;
    nodes.completedValue.textContent = `${summary.completed}/${summary.total}`;
    nodes.quizValue.textContent = String(summary.quizzes);
    nodes.leftValue.textContent = String(summary.left);
  }

  function renderEquipment() {
    const progress = TrainingApp.getProgress();
    const filtered = EQUIPMENT.filter((item) => {
      const matchesCategory = state.filter === "all" || item.category === state.filter;
      const haystack = [item.name, item.role, item.category, ...item.tags, ...item.cautions].join(" ").toLowerCase();
      const matchesSearch = !state.query || haystack.includes(state.query);
      return state.filter !== "scenario" && matchesCategory && matchesSearch;
    });

    nodes.resultCount.textContent = `${filtered.length}개`;
    nodes.equipmentGrid.innerHTML = "";

    if (!filtered.length) {
      nodes.equipmentGrid.innerHTML = `<p class="empty-state">검색 결과가 없습니다.</p>`;
      return;
    }

    filtered.forEach((item) => {
      const itemProgress = progress[item.id] || {};
      const link = document.createElement("a");
      link.className = "equipment-row";
      link.href = `equipment.html?id=${encodeURIComponent(item.id)}`;
      link.innerHTML = `
        ${renderThumbnail(item)}
        <span class="equipment-copy">
          <strong>${TrainingApp.escapeHtml(item.name)}</strong>
          <small>${TrainingApp.escapeHtml(item.role)}</small>
        </span>
        <span class="row-status ${itemProgress.completed ? "done" : itemProgress.watched ? "watched" : ""}">
          ${itemProgress.completed ? "완료" : itemProgress.watched ? "시청" : "대기"}
        </span>
        <i data-lucide="chevron-right" aria-hidden="true"></i>
      `;
      nodes.equipmentGrid.appendChild(link);
    });

    TrainingApp.refreshIcons();
  }

  function renderThumbnail(item) {
    if (item.thumbnailUrl) {
      return `
        <span class="equipment-thumb ${item.category}">
          <img src="${TrainingApp.escapeHtml(item.thumbnailUrl)}" alt="" loading="lazy" />
        </span>
      `;
    }

    return `
      <span class="equipment-thumb ${item.category}" aria-hidden="true">
        <i data-lucide="shield-check"></i>
      </span>
    `;
  }

  function renderScenarios() {
    nodes.scenarioGrid.innerHTML = "";
    SCENARIOS.forEach((scenario) => {
      const linked = scenario.equipmentIds
        .map((id) => TrainingApp.getEquipmentById(id))
        .filter(Boolean);
      const article = document.createElement("article");
      article.className = "scenario-card";
      article.innerHTML = `
        <div class="scenario-title">
          <i data-lucide="radio" aria-hidden="true"></i>
          <h3>${TrainingApp.escapeHtml(scenario.title)}</h3>
        </div>
        <p>${TrainingApp.escapeHtml(scenario.summary)}</p>
        <div class="scenario-links">
          ${linked
            .map(
              (item) =>
                `<a href="equipment.html?id=${encodeURIComponent(item.id)}">${TrainingApp.escapeHtml(item.name)}</a>`,
            )
            .join("")}
        </div>
      `;
      nodes.scenarioGrid.appendChild(article);
    });
  }

  function syncSections() {
    const showScenarios = state.filter === "scenario";
    nodes.equipmentSection.hidden = showScenarios;
    nodes.scenarioSection.hidden = !showScenarios;
  }

  function openProfile() {
    const profile = TrainingApp.getProfile();
    if (!profile) return;
    nodes.profileTitle.textContent = profile.name;
    nodes.profileUnit.textContent = profile.unit;
    nodes.profileRank.textContent = profile.rank;
    nodes.profileTime.textContent = TrainingApp.formatDate(profile.enteredAt);
    nodes.profileDialog.showModal();
    TrainingApp.refreshIcons();
  }
})();
