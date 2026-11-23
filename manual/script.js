const status = document.querySelector('#copy-status');

for (const button of document.querySelectorAll('.copy-button')) {
  button.hidden = false;
  const example = button.closest('.code-example');
  const heading = example.previousElementSibling?.textContent || 'CSV';
  button.setAttribute('aria-label', `複製${heading}範例`);
  let timer;
  button.addEventListener('click', async () => {
    clearTimeout(timer);
    status.textContent = '';
    try {
      await navigator.clipboard.writeText(example.querySelector('code').textContent);
      button.textContent = '已複製';
      status.textContent = `已複製${heading}範例。`;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(example.querySelector('code'));
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = '已選取內容';
      status.textContent = '請使用系統的複製功能，複製已選取的 CSV 範例。';
    }
    timer = setTimeout(() => { button.textContent = '複製範例'; }, 2500);
  });
}

const links = [...document.querySelectorAll('nav a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href')));
let scheduled = false;
function updateNavigation() {
  const active = sections.filter(section => section.getBoundingClientRect().top <= 160).pop();
  links.forEach((link, index) => {
    if (sections[index] === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
