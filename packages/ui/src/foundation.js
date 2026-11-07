/**
 * BaseComponent — only DOM factory in @einoder/ui.
 * Measured size is CSS custom properties. State is class names.
 */

export class BaseComponent {
  constructor(options = {}, deps = {}) {
    this.options = options;
    this.deps = deps;
    this.element = null;
    this.children = new Set();
    this.isDestroyed = false;
    this.componentType = options.componentType || 'default';
  }

  getF() {
    const cssF = globalThis.getComputedStyle?.(document.documentElement)
      ?.getPropertyValue('--f')
      ?.trim();
    const parsed = cssF ? parseFloat(cssF) : 14;
    const F = Number.isFinite(parsed) && parsed > 0 ? parsed : 14;
    return { F, F2: F / 2 };
  }

  createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
  }

  clearElement(element) {
    if (!element) return;
    element.replaceChildren();
  }

  appendElement(parent, child) {
    if (!parent || !child) return;
    parent.appendChild(child);
  }

  detachElement(element) {
    if (element?.parentNode) element.parentNode.removeChild(element);
  }

  setCssVar(element, name, value) {
    if (!element) return;
    element.style.setProperty(name, value);
  }

  setState(element, state, on) {
    if (!element) return;
    element.classList.toggle(`is-${state}`, Boolean(on));
  }

  addChild(child) {
    this.children.add(child);
    if (this.element && child.element) this.element.appendChild(child.element);
    return child;
  }

  removeChild(child) {
    this.children.delete(child);
    if (typeof child.destroy === 'function') child.destroy();
  }

  destroy() {
    if (this.isDestroyed) return;
    for (const child of this.children) {
      if (typeof child.destroy === 'function') child.destroy();
    }
    this.children.clear();
    this.detachElement(this.element);
    this.element = null;
    this.deps = {};
    this.isDestroyed = true;
  }

  render() {
    if (!this.element) {
      this.element = this.createElement('div', this.componentType);
    }
    return this.element;
  }
}
