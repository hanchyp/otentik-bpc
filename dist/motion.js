// Progressive enhancement: content is never hidden while waiting for the observer.
import {money} from './data.js';
const root = document.querySelector('#main');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const desktop = matchMedia('(min-width: 801px)');
let observer, collage, scrollFrame = 0;
const frames = new Map();
const seenCards = new Set();
const numberFinals = new Map();

function stopNumbers() {
  for (const [el, id] of frames) { cancelAnimationFrame(id); el.textContent = numberFinals.get(el); }
  frames.clear(); numberFinals.clear();
}
function count(el, from = 0) {
  const final = el.textContent;
  const target = Number(final.replace(/\D/g, ''));
  if (!Number.isFinite(target) || reduced.matches) return;
  const currency = final.includes('Rp');
  const format = n => currency ? money(n) : String(n).padStart(final.length, '0');
  el.setAttribute('aria-label', final);
  // Keep the final value in the accessibility tree throughout the count.
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  const accessible = document.createElement('span');
  accessible.className = 'sr-only'; accessible.textContent = final;
  el.replaceChildren(visual, accessible);
  numberFinals.set(el, final);
  visual.textContent = format(from);
  const start = performance.now();
  const tick = now => {
    if (!el.isConnected) { frames.delete(el); numberFinals.delete(el); return; }
    const progress = Math.max(0, Math.min(1, (now - start) / 650));
    visual.textContent = format(Math.round(from + (target - from) * (1 - (1 - progress) ** 3)));
    if (progress < 1) frames.set(el, requestAnimationFrame(tick));
    else { el.textContent = final; frames.delete(el); numberFinals.delete(el); }
  };
  frames.set(el, requestAnimationFrame(tick));
}
function reveal(el) {
  observer?.unobserve(el);
  if (reduced.matches) return;
  el.classList.add('motion-enter');
  if (el.matches('.stat')) el.querySelectorAll(':scope > strong').forEach(n => count(n));
}
function mark(selector, direction = 'up', step = 90, base = 0) {
  root.querySelectorAll(selector).forEach((el, i) => {
    if (el.hasAttribute('data-reveal')) return;
    el.dataset.reveal = direction;
    el.style.setProperty('--motion-delay', `${Math.min(base + i * step, 480)}ms`);
    if (el.matches('.art-card')) {
      const key = el.querySelector('a')?.getAttribute('href');
      if (seenCards.has(key)) return;
      seenCards.add(key);
    }
    observer?.observe(el);
  });
}
function parallax() {
  scrollFrame = 0;
  if (!collage) return;
  const rect = collage.getBoundingClientRect();
  const offset = reduced.matches || !desktop.matches ? 0 : Math.max(-16, Math.min(16, -rect.top * .035));
  collage.style.setProperty('--parallax-y', `${offset}px`);
}
function scheduleScroll() { if (!scrollFrame && collage) scrollFrame = requestAnimationFrame(parallax); }

function setupPage() {
  observer?.disconnect(); stopNumbers(); seenCards.clear();
  if (scrollFrame) cancelAnimationFrame(scrollFrame);
  scrollFrame = 0;
  observer = !reduced.matches && 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) reveal(e.target); }), {threshold: .08})
    : null;
  const heading = root.querySelector('.hero h1');
  if (heading && !heading.querySelector('.motion-line')) {
    // Preserve the original line breaks, text, and highlighted last line.
    const groups = []; let nodes = [];
    for (const node of [...heading.childNodes]) {
      if (node.nodeName === 'BR') { groups.push(nodes); nodes = []; }
      else nodes.push(node);
    }
    groups.push(nodes);
    heading.replaceChildren(...groups.map(group => {
      const line = document.createElement('span'); line.className = 'motion-line'; line.append(...group); return line;
    }));
  }
  mark('.hero-copy > .eyebrow', 'up', 0);
  mark('.motion-line', 'up', 80, 70);
  mark('.hero-copy > p, .hero-copy > .actions, .hero-note', 'up', 75, 250);
  mark('.collage-label, .collage-main, .collage-small, .royalty-note, .orbit-peek', 'up', 85, 80);
  mark('.trust-item', 'up', 90);
  mark('.section-head, .page > .page-heading, .home-search, .page > .search, .catalog-toolbar', 'up', 70);
  mark('.art-card', 'up', 90);
  mark('.how-intro', 'up', 0);
  mark('.steps > div', 'up', 100);
  mark('.creator-banner > div:first-child', 'left', 0);
  mark('.creator-banner > div:nth-child(2), .creator-banner > .button', 'up', 90, 90);
  mark('.detail-art', 'left', 0);
  mark('.license-panel', 'right', 0, 90);
  mark('.work-story', 'up', 0);
  mark('.checkout-work, .checkout-layout > section > .panel, .checkout-layout .notice, .checkout-total', 'up', 90);
  mark('.success-heading > .orbit', 'success', 0);
  mark('.success-heading > div, .certificate', 'up', 100, 100);
  mark('.stat', 'up', 90);
  mark('.table-wrap, .orbit-tip, .empty, .license-row', 'up', 80);
  mark('.split-track > span', 'fill', 0, 120);
  collage = root.querySelector('.hero-collage');
  parallax();
}

let previousPrices = [];
function rememberPrices() {
  previousPrices = [...root.querySelectorAll('#tier-summary .price-row > strong, #tier-summary .split > div > strong')].map(el => Number(el.textContent.replace(/\D/g, '')));
}
const mutations = new MutationObserver(records => {
  if (records.some(r => r.target === root)) { setupPage(); rememberPrices(); return; }
  if (records.some(r => r.target.id === 'results')) mark('.art-card', 'up', 70);
  if (records.some(r => r.target.id === 'tier-summary')) {
    stopNumbers();
    const oldPrices = previousPrices;
    rememberPrices();
    root.querySelectorAll('#tier-summary .price-row > strong, #tier-summary .split > div > strong').forEach((el, i) => count(el, oldPrices[i] ?? 0));
    // The ratio remains 80/20 on tier changes; do not replay the fill.
  }
});
mutations.observe(root, {childList: true, subtree: true});
root.addEventListener('focusin', e => {
  // Keyboard users should never focus a fading control.
  for (let el = e.target; el && el !== root; el = el.parentElement) {
    observer?.unobserve(el); el.classList.remove('motion-enter');
  }
});
window.addEventListener('scroll', scheduleScroll, {passive: true});
window.addEventListener('resize', scheduleScroll, {passive: true});
reduced.addEventListener('change', () => {
  observer?.disconnect(); stopNumbers();
  root.querySelectorAll('.motion-enter').forEach(el => el.classList.remove('motion-enter'));
  parallax();
});
setupPage(); rememberPrices();
