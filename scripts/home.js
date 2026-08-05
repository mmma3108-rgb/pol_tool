(function () {
  const state = {
    view: "hub",
    filter: "all",
    query: "",
  };

  const nodes = {};

  document.addEventListener("DOMContentLoaded", () => {
    const profile = TrainingApp.requireProfile();
    if (!profile) return;
    bindNodes();
    bindEvents();
    restoreInitialView();
    renderProfileSummary(profile);
    renderAll();
    TrainingApp.sendAnalytics("home_open");
    TrainingApp.refreshIcons();
  });

  function bindNodes() {
    [
      "welcomeText",
      "searchInput",
      "resultCount",
      "toolSection",
      "equipmentGrid",
      "scenarioGrid",
      "equipmentSection",
      "scenarioSection",
      "progressSection",
      "progressLabel",
      "progressBar",
      "progressCompleted",
      "progressQuiz",
      "progressLeft",
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

    document.querySelectorAll(".entry-card").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.view, { scroll: true }));
    });

    document.querySelectorAll(".segment").forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        syncSegments();
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
    nodes.welcomeText.textContent = `(접속자) ${profile.rank} ${profile.name} / ${formatUnit(profile)}`;
  }

  function formatUnit(profile) {
    if (profile.orgType === "local" && profile.station && profile.localOffice) {
      return `${profile.station} ${profile.localOffice}`;
    }

    if (profile.orgType === "station" && profile.station) {
      return `${profile.station}경찰서`;
    }

    return profile.unit;
  }

  function renderAll() {
    renderStatus();
    renderEquipment();
    renderScenarios();
    syncEntryCards();
    syncSegments();
    syncSections();
  }

  function renderStatus() {
    const summary = TrainingApp.getProgressSummary();
    nodes.progressLabel.textContent = `${summary.percent}%`;
    nodes.progressBar.style.width = `${summary.percent}%`;
    nodes.progressCompleted.textContent = `${summary.completed}/${summary.total}`;
    nodes.progressQuiz.textContent = String(summary.quizzes);
    nodes.progressLeft.textContent = String(summary.left);
  }

  function renderEquipment() {
    const progress = TrainingApp.getProgress();
    const filtered = EQUIPMENT.filter((item) => {
      const matchesCategory = state.filter === "all" || item.category === state.filter;
      const haystack = [item.name, item.role, item.category, ...item.tags, ...item.cautions].join(" ").toLowerCase();
      const matchesSearch = !state.query || haystack.includes(state.query);
      return matchesCategory && matchesSearch;
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
      link.href = `equipment.html?id=${encodeURIComponent(item.id)}&filter=${encodeURIComponent(state.filter)}`;
      link.innerHTML = `
        ${renderThumbnail(item)}
        <span class="equipment-copy">
          <em>${TrainingApp.escapeHtml(item.group)}</em>
          <strong>${TrainingApp.escapeHtml(item.name)}</strong>
          <small>${TrainingApp.escapeHtml(item.role)}</small>
        </span>
        <span class="row-status ${itemProgress.completed ? "done" : itemProgress.watched ? "watched" : ""}">
          ${itemProgress.completed ? "시청 완료" : itemProgress.watched ? "시청" : "미시청"}
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
    nodes.toolSection.hidden = state.view !== "equipment";
    nodes.equipmentSection.hidden = state.view !== "equipment";
    nodes.scenarioSection.hidden = state.view !== "scenario";
    nodes.progressSection.hidden = state.view !== "progress";
  }

  function restoreInitialView() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    const filter = params.get("filter");
    if (["equipment", "scenario", "progress"].includes(view)) {
      state.view = view;
    }
    if (["all", "required", "optional"].includes(filter)) {
      state.filter = filter;
    }
  }

  function syncEntryCards() {
    document.querySelectorAll(".entry-card").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.view === state.view);
    });
  }

  function syncSegments() {
    document.querySelectorAll(".segment").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.filter === state.filter);
    });
  }

  function setView(view, options = {}) {
    state.view = view;
    syncEntryCards();
    syncSections();
    if (view === "equipment") renderEquipment();
    if (view === "scenario") renderScenarios();
    if (options.scroll) scrollToActiveSection();
  }

  function scrollToActiveSection() {
    const target =
      state.view === "equipment"
        ? nodes.toolSection
        : state.view === "scenario"
          ? nodes.scenarioSection
          : state.view === "progress"
            ? nodes.progressSection
            : null;

    if (!target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
