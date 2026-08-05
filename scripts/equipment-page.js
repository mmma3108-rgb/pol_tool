(function () {
  let currentEquipment = null;
  const nodes = {};

  document.addEventListener("DOMContentLoaded", () => {
    if (!TrainingApp.requireProfile()) return;
    bindNodes();
    loadEquipment();
    bindEvents();
    TrainingApp.refreshIcons();
  });

  function bindNodes() {
    [
      "detailCategory",
      "detailThumb",
      "detailTitle",
      "detailRole",
      "videoFrame",
      "markWatched",
      "markComplete",
      "detailSteps",
      "detailCautions",
      "quizStatus",
      "quizList",
      "submitQuiz",
      "quizFeedback",
    ].forEach((id) => {
      nodes[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    nodes.markWatched.addEventListener("click", () => {
      TrainingApp.updateProgress(currentEquipment.id, { watched: true });
      renderProgressState();
    });
    nodes.markComplete.addEventListener("click", () => {
      TrainingApp.updateProgress(currentEquipment.id, { watched: true, completed: true });
      renderProgressState();
    });
    nodes.submitQuiz.addEventListener("click", submitQuiz);
  }

  function loadEquipment() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    currentEquipment = TrainingApp.getEquipmentById(id);

    if (!currentEquipment) {
      document.body.innerHTML = `
        <main class="not-found">
          <h1>장비 정보를 찾을 수 없습니다.</h1>
          <a class="button button-primary" href="home.html">목록으로 이동</a>
        </main>
      `;
      return;
    }

    document.title = `순찰차 탑재장비 교육 | ${currentEquipment.name}`;
    nodes.detailCategory.textContent = currentEquipment.category === "required" ? "필수장비" : "선택장비";
    nodes.detailCategory.classList.toggle("optional", currentEquipment.category === "optional");
    nodes.detailTitle.textContent = currentEquipment.name;
    nodes.detailRole.textContent = currentEquipment.role;
    renderThumbnail();
    renderVideo();
    renderSteps();
    renderQuiz();
    renderProgressState();
  }

  function renderThumbnail() {
    if (currentEquipment.thumbnailUrl) {
      nodes.detailThumb.innerHTML = `<img src="${TrainingApp.escapeHtml(currentEquipment.thumbnailUrl)}" alt="" />`;
      return;
    }

    nodes.detailThumb.innerHTML = `<i data-lucide="shield-check" aria-hidden="true"></i>`;
  }

  function renderVideo() {
    if (!currentEquipment.videoUrl) {
      nodes.videoFrame.innerHTML = `
        <div class="video-placeholder">
          <i data-lucide="video" aria-hidden="true"></i>
          <strong>영상 준비 중</strong>
          <span>촬영 완료 후 data/equipment.js에 영상 링크를 연결하세요.</span>
        </div>
      `;
      return;
    }

    nodes.videoFrame.innerHTML = `
      <iframe
        title="${TrainingApp.escapeHtml(currentEquipment.name)} 교육영상"
        src="${TrainingApp.toEmbedUrl(currentEquipment.videoUrl)}"
        allowfullscreen
        loading="lazy"
      ></iframe>
    `;
  }

  function renderSteps() {
    nodes.detailSteps.innerHTML = currentEquipment.steps
      .map((step) => `<li>${TrainingApp.escapeHtml(step)}</li>`)
      .join("");
    nodes.detailCautions.innerHTML = currentEquipment.cautions
      .map((caution) => `<li>${TrainingApp.escapeHtml(caution)}</li>`)
      .join("");
  }

  function renderQuiz() {
    nodes.quizList.innerHTML = "";
    currentEquipment.quiz.forEach((quiz, index) => {
      const block = document.createElement("fieldset");
      block.className = "quiz-question";
      block.innerHTML = `
        <legend>${index + 1}. ${TrainingApp.escapeHtml(quiz.question)}</legend>
        ${quiz.options
          .map(
            (option, optionIndex) => `
              <label>
                <input type="radio" name="quiz-${index}" value="${optionIndex}" />
                <span>${TrainingApp.escapeHtml(option)}</span>
              </label>
            `,
          )
          .join("")}
      `;
      nodes.quizList.appendChild(block);
    });
  }

  function renderProgressState() {
    const progress = TrainingApp.getProgress()[currentEquipment.id] || {};
    nodes.markWatched.classList.toggle("is-done", Boolean(progress.watched));
    nodes.markComplete.classList.toggle("is-done", Boolean(progress.completed));
    nodes.quizStatus.textContent = progress.quizPassed ? "통과" : "미응시";
  }

  function submitQuiz() {
    let correct = 0;
    currentEquipment.quiz.forEach((quiz, index) => {
      const selected = nodes.quizList.querySelector(`input[name="quiz-${index}"]:checked`);
      if (selected && Number(selected.value) === quiz.answer) correct += 1;
    });

    const passed = correct === currentEquipment.quiz.length;
    nodes.quizFeedback.textContent = `${correct}/${currentEquipment.quiz.length} 정답`;
    nodes.quizFeedback.classList.toggle("success", passed);

    if (passed) {
      TrainingApp.updateProgress(currentEquipment.id, { quizPassed: true });
      renderProgressState();
    }
  }
})();
