const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const taskSlot = document.querySelector('[data-task-slot]');
const taskButton = document.querySelector('[data-task-button]');
const diagnosis = document.querySelector('[data-diagnosis]');
const diagnosisResult = document.querySelector('[data-diagnosis-result]');

document.body.classList.add('ready');

const tasks = [
  'ワークを開いて、1問だけ',
  '英単語を5個だけ確認',
  '昨日の間違いを1問見直す',
  '問題カードを1枚だけ',
  '60秒だけ机に向かう',
  '丸つけしたページに印をつける'
];

let taskIndex = 0;

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuButton.classList.toggle('open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

taskButton?.addEventListener('click', () => {
  taskIndex = (taskIndex + 1) % tasks.length;
  taskSlot.textContent = tasks[taskIndex];
  localStorage.setItem('kyouichi-last-task', tasks[taskIndex]);
});

const savedTask = localStorage.getItem('kyouichi-last-task');
if (savedTask && taskSlot) taskSlot.textContent = savedTask;

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  io.observe(el);
});

window.addEventListener('load', () => {
  window.setTimeout(() => {
    document.querySelectorAll('.reveal:not(.reveal-visible)').forEach((el) => el.classList.add('reveal-visible'));
  }, 1400);
});

function updateDiagnosis() {
  if (!diagnosis || !diagnosisResult) return;
  const checked = [...diagnosis.querySelectorAll('input:checked')];
  const score = checked.reduce((sum, input) => sum + Number(input.value), 0);
  localStorage.setItem('kyouichi-diagnosis', JSON.stringify(checked.map((input) => input.parentElement.textContent.trim())));

  if (score >= 4) {
    diagnosisResult.innerHTML = '<span class="result-kicker">おすすめ</span><strong>きょういちセットpro</strong><p>親の管理負担まで軽くしたい今は、AI伴走と情報管理まで入ったproが合いそうです。</p>';
  } else if (score > 0) {
    diagnosisResult.innerHTML = '<span class="result-kicker">おすすめ</span><strong>きょういちセット</strong><p>まずは紙で今日の1コを見える化するところから。通常セットで小さく始められます。</p>';
  } else {
    diagnosisResult.innerHTML = '<span class="result-kicker">おすすめ</span><strong>まずはチェックしてみてください</strong><p>選んだ内容に合わせて、通常セットかproを表示します。</p>';
  }
}

diagnosis?.addEventListener('change', updateDiagnosis);
updateDiagnosis();
