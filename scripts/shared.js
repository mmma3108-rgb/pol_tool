(function () {
  const storageKeys = {
    profile: "patrolTraining.profile",
    progress: "patrolTraining.progress",
  };

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem(storageKeys.profile));
    } catch {
      return null;
    }
  }

  function setProfile(profile) {
    localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
  }

  function clearProfile() {
    localStorage.removeItem(storageKeys.profile);
  }

  function requireProfile() {
    const profile = getProfile();
    if (!profile) window.location.href = "index.html";
    return profile;
  }

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(storageKeys.progress)) || {};
    } catch {
      return {};
    }
  }

  function setProgress(progress) {
    localStorage.setItem(storageKeys.progress, JSON.stringify(progress));
  }

  function updateProgress(id, next) {
    const progress = getProgress();
    progress[id] = {
      ...(progress[id] || {}),
      ...next,
      updatedAt: new Date().toISOString(),
    };
    setProgress(progress);
    return progress[id];
  }

  function resetProgress() {
    localStorage.removeItem(storageKeys.progress);
  }

  function getEquipmentById(id) {
    return EQUIPMENT.find((item) => item.id === id);
  }

  function getProgressSummary() {
    const progress = getProgress();
    const completed = EQUIPMENT.filter((item) => progress[item.id]?.completed).length;
    const quizzes = EQUIPMENT.filter((item) => progress[item.id]?.quizPassed).length;
    const total = EQUIPMENT.length;
    return {
      completed,
      quizzes,
      total,
      left: total - completed,
      percent: Math.round((completed / total) * 100),
    };
  }

  function toEmbedUrl(url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
      if (parsed.hostname.includes("youtube.com")) {
        const id = parsed.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    } catch {
      return url;
    }
    return url;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDate(value) {
    return new Date(value).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js");
    });
  }

  window.TrainingApp = {
    storageKeys,
    getProfile,
    setProfile,
    clearProfile,
    requireProfile,
    getProgress,
    setProgress,
    updateProgress,
    resetProgress,
    getEquipmentById,
    getProgressSummary,
    toEmbedUrl,
    escapeHtml,
    formatDate,
    refreshIcons,
  };
})();
