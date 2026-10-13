const categories = {
  moral: {
    kicker: "思想道德 · 最低2学分",
    name: "参与思想教育与校园文化活动",
    description: "这一类主要记录讲座、演讲、观众参与，以及可以认定二课学分的团日活动。",
    examples: ["参加学校或学院组织的讲座", "参与演讲活动或现场观众", "参加可认定学分的团日活动"],
    credit: "2"
  },
  culture: {
    kicker: "文化健康 · 最低2学分",
    name: "在文艺和校园健康活动中留下记录",
    description: "合唱、舞蹈、文艺比赛和其他文体活动是这一类最常见的参与方式。",
    examples: ["参加合唱比赛", "参加舞蹈大赛或其他文艺活动", "参与可认定学分的校园文体活动"],
    credit: "2"
  },
  practice: {
    kicker: "社会实践 · 最低3学分",
    name: "通过志愿服务和社团活动积累实践经历",
    description: "这一类重视参与校园服务和实际活动，是四类中毕业要求最高的一类。",
    examples: ["参与迎新志愿服务", "参加扫雪等校园服务", "参与可认定学分的社团活动"],
    credit: "3"
  },
  innovation: {
    kicker: "创新创业 · 最低1学分",
    name: "用比赛和创新活动拓展能力",
    description: "部分辩论、讲座和创新类比赛可以认定创新创业学分，参加前需确认活动类别。",
    examples: ["参加学院辩论赛", "参加相关讲座", "参加创新类比赛或项目"],
    credit: "1"
  }
};

const sharedTutorialSteps = [
  {
    short: "填写学校、学号和密码",
    title: "登录Dear课堂",
    body: "学校选择沈阳工业大学，账号填写本人学号。默认密码通常为出生年月日，例如20061009。",
    image: "assets/tutorial-login.jpeg",
    alt: "Dear课堂登录页面",
    caption: "登录信息填写页面"
  },
  {
    short: "在首页点击“我要签到”",
    title: "现场扫描活动二维码完成签到",
    body: "进入Dear课堂首页，点击“我要签到”，扫描活动现场提供的二维码。签到成功后保留结果页面，便于核对。",
    image: "assets/tutorial-checkin.jpeg",
    alt: "Dear课堂首页“我要签到”入口",
    caption: "首页“我要签到”入口"
  },
  {
    short: "查看学分与成绩单详情",
    title: "打开“我的”查询二课成绩",
    body: "点击右下角“我的”，查看累计学分和“我的成绩单”。经济学院学生也可以使用页面下方的扫码查询入口查看成绩详情。",
    image: "assets/tutorial-score.jpeg",
    alt: "Dear课堂“我的”页面与成绩单入口",
    caption: "个人中心与成绩单入口"
  }
];

const tutorialData = {
  wechat: {
    label: "微信端 · 四步完成",
    title: "从找到入口到查询成绩",
    steps: [
      {
        short: "搜索“Dear课堂”小程序",
        title: "打开微信，搜索小程序“Dear课堂”",
        body: "在微信顶部搜索框输入“Dear课堂”，进入对应小程序。首次使用时先完成登录。",
        image: "assets/tutorial-wechat-entry.jpg",
        alt: "微信中Dear课堂小程序入口",
        caption: "微信小程序入口"
      },
      ...sharedTutorialSteps
    ]
  },
  work: {
    label: "企业微信端 · 四步完成",
    title: "从工作台入口到查询成绩",
    steps: [
      {
        short: "工作台中打开Dear课堂",
        title: "打开企业微信“工作台”",
        body: "进入工作台，在校内应用中找到“Dear课堂”。可以使用顶部搜索功能快速定位应用。",
        image: "assets/tutorial-work-entry.jpeg",
        alt: "企业微信工作台中的Dear课堂入口",
        caption: "企业微信工作台入口"
      },
      ...sharedTutorialSteps
    ]
  }
};

const categoryTabs = document.querySelectorAll(".category-tab");
const categoryKicker = document.querySelector("#category-kicker");
const categoryName = document.querySelector("#category-name");
const categoryDescription = document.querySelector("#category-description");
const categoryExamples = document.querySelector("#category-examples");
const categoryCredit = document.querySelector("#category-credit");

function selectCategory(key) {
  const category = categories[key];
  if (!category) return;

  categoryTabs.forEach((tab) => {
    const active = tab.dataset.category === key;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  categoryKicker.textContent = category.kicker;
  categoryName.textContent = category.name;
  categoryDescription.textContent = category.description;
  categoryExamples.replaceChildren(
    ...category.examples.map((example) => {
      const item = document.createElement("li");
      item.textContent = example;
      return item;
    })
  );
  categoryCredit.textContent = category.credit;
}

categoryTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectCategory(tab.dataset.category));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
    const nextIndex = (index + direction + categoryTabs.length) % categoryTabs.length;
    categoryTabs[nextIndex].focus();
    selectCategory(categoryTabs[nextIndex].dataset.category);
  });
});

const creditRange = document.querySelector("#credit-range");
const creditValue = document.querySelector("#credit-value");
const goalLabel = document.querySelector("#goal-label");
const goalValue = document.querySelector("#goal-value");
const creditProgress = document.querySelector("#credit-progress");
const calculatorStatus = document.querySelector("#calculator-status");
const categoryWarning = document.querySelector("#category-warning");
const yearButtons = document.querySelectorAll(".year-control button");
const categoryChecks = document.querySelectorAll(".category-checks input");

let currentTarget = 10;
let currentGoalName = "大三及以后";

function updateCalculator() {
  const credits = Number(creditRange.value);
  const progress = Math.min((credits / currentTarget) * 100, 100);
  const difference = currentTarget - credits;
  const checkedCategories = [...categoryChecks].filter((input) => input.checked);
  const categoryProgress = checkedCategories.reduce((sum, input) => sum + Number(input.dataset.credit), 0);

  creditValue.textContent = credits.toFixed(1);
  goalValue.textContent = `${currentTarget}学分`;
  creditProgress.style.width = `${progress}%`;
  creditProgress.style.backgroundColor = difference <= 0 ? "var(--jade)" : "var(--coral)";

  if (difference > 0) {
    calculatorStatus.innerHTML = `距离${currentGoalName}目标还差 <strong>${difference.toFixed(1).replace(".0", "")}学分</strong>。`;
  } else {
    calculatorStatus.innerHTML = `<strong>已经达到${currentGoalName}目标。</strong>仍要继续核对四类最低学分。`;
  }

  if (checkedCategories.length === categoryChecks.length && credits >= 10) {
    categoryWarning.textContent = "总学分和四类底线都已勾选完成，请再进入成绩单确认系统认定结果。";
    categoryWarning.style.color = "var(--jade-dark)";
  } else if (categoryProgress > 0) {
    categoryWarning.textContent = `已勾选分类底线 ${categoryProgress} 学分。注意：类别要求与总学分都要满足，缺项可能带来延毕风险。`;
    categoryWarning.style.color = "var(--coral-dark)";
  } else {
    categoryWarning.textContent = "类别要求与总学分都要满足。即使总分达到10分，类别缺项也可能带来延毕风险。";
    categoryWarning.style.color = "var(--coral-dark)";
  }
}

yearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentTarget = Number(button.dataset.target);
    currentGoalName = button.textContent.trim();
    yearButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    goalLabel.textContent = `${currentGoalName}目标`;
    updateCalculator();
  });
});

creditRange.addEventListener("input", updateCalculator);
categoryChecks.forEach((input) => input.addEventListener("change", updateCalculator));
updateCalculator();

let selectedPlatform = "wechat";
let selectedStep = 0;

const platformButtons = document.querySelectorAll(".platform-switch button");
const stepButtons = document.querySelectorAll(".step-button");
const tutorialLabel = document.querySelector("#tutorial-label");
const tutorialTitle = document.querySelector("#tutorial-title");
const instructionTitle = document.querySelector("#instruction-title");
const instructionBody = document.querySelector("#instruction-body");
const tutorialImage = document.querySelector("#tutorial-image");
const loginFacts = document.querySelector("#login-facts");
const nextStepButton = document.querySelector("#next-step");

function renderTutorial() {
  const platform = tutorialData[selectedPlatform];
  const step = platform.steps[selectedStep];

  platformButtons.forEach((button) => {
    const active = button.dataset.platform === selectedPlatform;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  stepButtons.forEach((button, index) => {
    const active = index === selectedStep;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    const short = button.querySelector("small");
    if (short && index === 0) short.textContent = platform.steps[0].short;
  });

  tutorialLabel.textContent = platform.label;
  tutorialTitle.textContent = platform.title;
  instructionTitle.textContent = step.title;
  instructionBody.textContent = step.body;
  tutorialImage.src = step.image;
  tutorialImage.alt = step.alt;
  loginFacts.hidden = selectedStep !== 1;
  nextStepButton.textContent = selectedStep === platform.steps.length - 1 ? "回到第一步" : "下一步";
}

platformButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedPlatform = button.dataset.platform;
    selectedStep = 0;
    renderTutorial();
  });
});

stepButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    selectedStep = index;
    renderTutorial();
  });
});

nextStepButton.addEventListener("click", () => {
  selectedStep = (selectedStep + 1) % tutorialData[selectedPlatform].steps.length;
  renderTutorial();
});

const copyFeedback = document.querySelector("#copy-feedback");
document.querySelector("#copy-password").addEventListener("click", async () => {
  const format = "出生年月日，例如 20061009";
  try {
    await navigator.clipboard.writeText(format);
    copyFeedback.textContent = "密码格式已复制。";
  } catch {
    copyFeedback.textContent = `密码格式：${format}`;
  }
});

const viewer = document.querySelector("#image-viewer");
const viewerImage = document.querySelector("#viewer-image");
const viewerCaption = document.querySelector("#viewer-caption");

function openViewer(src, alt, caption) {
  viewerImage.src = src;
  viewerImage.alt = alt;
  viewerCaption.textContent = caption;
  viewer.showModal();
}

document.querySelector("#open-viewer").addEventListener("click", () => {
  const step = tutorialData[selectedPlatform].steps[selectedStep];
  openViewer(step.image, step.alt, step.caption);
});

document.querySelector("#qr-viewer-button").addEventListener("click", () => {
  openViewer("assets/image21.jpg", "二课成绩查询二维码", "二课成绩查询二维码");
});

document.querySelector("#viewer-close").addEventListener("click", () => viewer.close());
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});

document.querySelectorAll(".faq-item > button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const icon = button.querySelector(".faq-icon");
    const willOpen = !item.classList.contains("is-open");

    document.querySelectorAll(".faq-item").forEach((otherItem) => {
      const otherButton = otherItem.querySelector("button");
      const otherAnswer = otherItem.querySelector(".faq-answer");
      const otherIcon = otherItem.querySelector(".faq-icon");
      otherItem.classList.remove("is-open");
      otherButton.setAttribute("aria-expanded", "false");
      otherAnswer.hidden = true;
      otherIcon.textContent = "+";
    });

    if (willOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      answer.hidden = false;
      icon.textContent = "−";
    }
  });
});

const checklistInputs = document.querySelectorAll(".checklist input[type='checkbox']");
const checklistStorageKey = "second-classroom-checklist";

function loadChecklist() {
  try {
    const saved = JSON.parse(localStorage.getItem(checklistStorageKey) || "[]");
    checklistInputs.forEach((input, index) => {
      input.checked = Boolean(saved[index]);
    });
  } catch {
    localStorage.removeItem(checklistStorageKey);
  }
}

function saveChecklist() {
  localStorage.setItem(
    checklistStorageKey,
    JSON.stringify([...checklistInputs].map((input) => input.checked))
  );
}

checklistInputs.forEach((input) => input.addEventListener("change", saveChecklist));
document.querySelector("#reset-checklist").addEventListener("click", () => {
  checklistInputs.forEach((input) => {
    input.checked = false;
  });
  saveChecklist();
});
loadChecklist();

const scrollProgress = document.querySelector(".scroll-progress span");
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const navLinks = [...document.querySelectorAll(".main-nav a")];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5] }
);

navSections.forEach((section) => navObserver.observe(section));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  const revealTargets = document.querySelectorAll(
    ".section-heading, .definition-layout, .category-explorer, .calculator, .milestone-list, .tutorial, .query-layout, .checklist, .faq-layout"
  );
  revealTargets.forEach((target) => target.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

renderTutorial();
