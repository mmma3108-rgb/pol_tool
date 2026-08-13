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
      "backToList",
      "videoFrame",
      "videoStatus",
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
    nodes.submitQuiz.addEventListener("click", submitQuiz);
    nodes.videoFrame.addEventListener("contextmenu", blockVideoSave);
    nodes.videoFrame.addEventListener("dragstart", blockVideoSave);
  }

  function loadEquipment() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    currentEquipment = TrainingApp.getEquipmentById(id);

    if (!currentEquipment) {
      document.body.innerHTML = `
        <main class="not-found">
          <h1>장비 정보를 찾을 수 없습니다.</h1>
          <a class="button button-primary" href="home.html?view=equipment">목록으로 이동</a>
        </main>
      `;
      return;
    }

    document.title = `전남경찰청 탑재장비 모바일 학습 앱 | ${currentEquipment.name}`;
    renderBackLink(params);
    nodes.detailCategory.textContent = currentEquipment.category === "required" ? "필수장비" : "선택장비";
    nodes.detailCategory.classList.toggle("optional", currentEquipment.category === "optional");
    nodes.detailTitle.textContent = currentEquipment.name;
    nodes.detailRole.textContent = currentEquipment.role;
    renderThumbnail();
    renderVideo();
    renderSteps();
    renderQuiz();
    renderProgressState();
    TrainingApp.sendAnalytics("equipment_open", getEquipmentDetails());
  }

  function renderBackLink(params) {
    const filter = params.get("filter");
    const validFilter = ["all", "required", "optional"].includes(filter) ? filter : "all";
    nodes.backToList.href = `home.html?view=equipment&filter=${encodeURIComponent(validFilter)}`;
  }

  function renderThumbnail() {
    if (currentEquipment.thumbnailUrl) {
      nodes.detailThumb.innerHTML = `<img src="${TrainingApp.escapeHtml(currentEquipment.thumbnailUrl)}" alt="" />`;
      return;
    }

    nodes.detailThumb.innerHTML = `<i data-lucide="shield-check" aria-hidden="true"></i>`;
  }

  async function renderVideo() {
    if (!currentEquipment.videoUrl) {
      renderVideoPlaceholder();
      return;
    }

    const videoUrl = currentEquipment.videoUrl;
    const hasVideo = await checkVideoExists(videoUrl);
    if (!hasVideo) {
      renderVideoPlaceholder();
      return;
    }

    const watermarkText = TrainingApp.escapeHtml(getWatermarkText());
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(videoUrl)) {
      nodes.videoFrame.innerHTML = `
        <div class="secure-video-shell">
          <video
            controls
            controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
            disablePictureInPicture
            playsinline
            preload="metadata"
            draggable="false"
          >
            <source src="${TrainingApp.escapeHtml(videoUrl)}" type="video/mp4" />
            현재 브라우저에서 영상을 재생할 수 없습니다.
          </video>
          <div class="video-watermark" aria-hidden="true">${watermarkText}</div>
          <div class="video-security-note" aria-hidden="true">저장·녹화·공유 금지</div>
          <button class="secure-fullscreen-button" type="button" aria-label="전체화면">
            <i data-lucide="maximize" aria-hidden="true"></i>
          </button>
        </div>
      `;
    } else {
      nodes.videoFrame.innerHTML = `
        <div class="secure-video-shell">
          <iframe
            title="${TrainingApp.escapeHtml(currentEquipment.name)} 교육영상"
            src="${TrainingApp.toEmbedUrl(videoUrl)}"
            allowfullscreen
            loading="lazy"
          ></iframe>
          <div class="video-watermark" aria-hidden="true">${watermarkText}</div>
          <div class="video-security-note" aria-hidden="true">저장·녹화·공유 금지</div>
          <button class="secure-fullscreen-button" type="button" aria-label="전체화면">
            <i data-lucide="maximize" aria-hidden="true"></i>
          </button>
        </div>
      `;
    }

    const video = nodes.videoFrame.querySelector("video");
    const fullscreenButton = nodes.videoFrame.querySelector(".secure-fullscreen-button");
    nodes.videoFrame.addEventListener("click", markVideoComplete, { once: true });
    if (video) video.addEventListener("play", markVideoComplete, { once: true });
    if (fullscreenButton) fullscreenButton.addEventListener("click", openSecureFullscreen);
    TrainingApp.refreshIcons();
  }

  function renderVideoPlaceholder() {
    nodes.videoFrame.innerHTML = `
      <div class="video-placeholder">
        <i data-lucide="video" aria-hidden="true"></i>
        <strong>영상 준비 중</strong>
        <span>교육영상 준비 후 재생 가능</span>
      </div>
    `;
    TrainingApp.refreshIcons();
  }

  async function checkVideoExists(url) {
    try {
      const response = await fetch(url, { method: "HEAD", cache: "no-store" });
      return response.ok;
    } catch {
      return false;
    }
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
    nodes.videoStatus.textContent = progress.completed ? "영상 시청 완료" : "영상 미시청";
    nodes.videoStatus.classList.toggle("is-done", Boolean(progress.completed));
    nodes.quizStatus.textContent = progress.quizPassed ? "통과" : "미응시";
  }

  function markVideoComplete() {
    const progress = TrainingApp.getProgress()[currentEquipment.id] || {};
    if (progress.completed) return;
    TrainingApp.updateProgress(currentEquipment.id, { watched: true, completed: true });
    renderProgressState();
    TrainingApp.sendAnalytics("completed", getEquipmentDetails());
  }

  function blockVideoSave(event) {
    event.preventDefault();
  }

  function getWatermarkText() {
    const profile = TrainingApp.getProfile() || {};
    const person = [profile.rank, profile.name].filter(Boolean).join(" ");
    const unit = formatUnit(profile);
    return [`접속자 ${person}`, unit].filter(Boolean).join(" / ");
  }

  function openSecureFullscreen(event) {
    event.stopPropagation();
    const shell = nodes.videoFrame.querySelector(".secure-video-shell");
    if (!shell) return;

    if (shell.requestFullscreen) {
      shell.requestFullscreen();
    } else if (shell.webkitRequestFullscreen) {
      shell.webkitRequestFullscreen();
    }
  }

  function formatUnit(profile) {
    if (profile.orgType === "local" && profile.station && profile.localOffice) {
      return `${profile.station} ${profile.localOffice}`;
    }

    if (profile.orgType === "station" && profile.station) {
      return `${profile.station}경찰서`;
    }

    return profile.unit || "";
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
      TrainingApp.sendAnalytics("quiz_passed", {
        ...getEquipmentDetails(),
        correct,
        totalQuestions: currentEquipment.quiz.length,
      });
    }
  }

  function getEquipmentDetails() {
    return {
      equipmentId: currentEquipment.id,
      equipmentName: currentEquipment.name,
      equipmentCategory: currentEquipment.category,
    };
  }
})();
