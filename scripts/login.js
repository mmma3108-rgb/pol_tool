(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("entryForm");
    const error = document.getElementById("entryError");
    const code = document.getElementById("entryCode");
    const unit = document.getElementById("entryUnit");
    const name = document.getElementById("entryName");
    const rank = document.getElementById("entryRank");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      error.textContent = "";

      if (code.value !== APP_CONFIG.accessCode) {
        error.textContent = "비밀번호를 확인하세요.";
        code.focus();
        return;
      }

      TrainingApp.setProfile({
        unit: unit.value.trim(),
        name: name.value.trim(),
        rank: rank.value,
        enteredAt: new Date().toISOString(),
      });

      window.location.href = "home.html";
    });

    TrainingApp.refreshIcons();
  });
})();
