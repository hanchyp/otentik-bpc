import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {money} from '../dist/data.js';

// Deterministic lifecycle tests; no browser preferences or user data are changed.
const source = readFileSync(new URL('../dist/motion.js', import.meta.url), 'utf8').replace("import {money} from './data.js';", '');
class Element {
  constructor(text = '') { this.value = text; this.children = []; this.attrs = {}; this.dataset = {}; this.isConnected = true; this.style = {setProperty: (k,v) => this.attrs[k] = v}; this.classList = {add: () => {}, remove: () => {}}; }
  get textContent() { return this.children.length ? this.children.map(c => c.textContent).join('') : this.value; }
  set textContent(value) { this.value = value; this.children = []; }
  setAttribute(k,v) { this.attrs[k] = v; }
  hasAttribute(k) { return k in this.attrs; }
  replaceChildren(...children) { this.children = children; }
  querySelectorAll() { return []; }
  querySelector() { return null; }
  addEventListener() {}
}
function harness(reduce = false, wide = true, supported = true) {
  const root = new Element(), collage = new Element();
  collage.getBoundingClientRect = () => ({top: -1000});
  root.querySelector = selector => selector === '.hero-collage' ? collage : null;
  const callbacks = new Map(); let next = 0, observers = 0;
  const reduced = {matches: reduce, addEventListener: (_, fn) => reduced.change = fn};
  class Observer { constructor() { observers++; } observe() {} disconnect() {} unobserve() {} }
  const context = vm.createContext({money, document: {querySelector: () => root, createElement: () => new Element()},
    matchMedia: q => q.includes('reduced') ? reduced : {matches: wide},
    window: {addEventListener() {}, ...(supported ? {IntersectionObserver: Observer} : {})},
    IntersectionObserver: Observer, MutationObserver: class {observe() {}},
    performance: {now: () => 100}, requestAnimationFrame: fn => {callbacks.set(++next, fn); return next;},
    cancelAnimationFrame: id => callbacks.delete(id)});
  vm.runInContext(source + '\n globalThis.testMotion = {count, stopNumbers, setupPage};', context);
  return {api: context.testMotion, reduced, callbacks, collage, observers: () => observers,
    tick(time) {const batch = [...callbacks.values()]; callbacks.clear(); batch.forEach(fn => fn(time));}};
}
const normal = harness();
assert.equal(normal.collage.attrs['--parallax-y'], '16px');
const price = new Element(money(35000));
normal.api.count(price, 75000);
normal.tick(99); // RAF's frame timestamp may precede performance.now().
assert.equal(price.children[0].textContent, money(75000));
assert.equal(price.children[1].textContent, money(35000));
normal.tick(800);
assert.equal(price.textContent, money(35000));
assert.equal(normal.callbacks.size, 0);
const royalty = new Element(money(232000));
normal.api.count(royalty);
normal.tick(250);
normal.reduced.matches = true; normal.reduced.change();
assert.equal(royalty.textContent, money(232000));
assert.equal(normal.callbacks.size, 0);
assert.equal(normal.collage.attrs['--parallax-y'], '0px');
const reduce = harness(true);
const stable = new Element(money(172000)); reduce.api.count(stable);
assert.equal(stable.textContent, money(172000));
assert.equal(reduce.callbacks.size, 0);
assert.equal(reduce.observers(), 0);
assert.equal(harness(false, false).collage.attrs['--parallax-y'], '0px');
assert.equal(harness(false, true, false).observers(), 0);
const interrupted = harness();
const total = new Element(money(450000)); interrupted.api.count(total);
interrupted.api.setupPage();
assert.equal(interrupted.callbacks.size, 0);
assert.equal(total.textContent, money(450000));
console.log('PASS: reduced-motion startup/live change, final accessible values, bounded counters, mobile parallax, unavailable observer, route cleanup.');
