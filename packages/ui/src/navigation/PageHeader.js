import { BaseComponent } from '../foundation.js';

export class PageHeader extends BaseComponent {
  constructor(options = {}, deps = {}) {
    super({ ...options, componentType: 'header' }, deps);
    this.homeLabel = options.homeLabel ?? 'AEINODER';
    this.navLabel = options.navLabel ?? 'SECTIONS';
    this.onHome = options.onHome ?? null;
    this.onNav = options.onNav ?? null;
    this.open = false;
  }

  render() {
    if (this.element) return this.element;
    this.element = this.createElement('header', 'page-header');

    this.home = this.createElement('button', 'page-header-home');
    this.home.type = 'button';
    this.home.textContent = this.homeLabel;
    if (this.onHome) this.home.addEventListener('click', this.onHome);
    this.appendElement(this.element, this.home);

    this.nav = this.createElement('button', 'page-header-nav');
    this.nav.type = 'button';
    this.navText = this.createElement('span', '', this.navLabel);
    this.navGlyph = this.createElement('span', 'page-header-nav-glyph', '+');
    this.appendElement(this.nav, this.navText);
    this.appendElement(this.nav, this.navGlyph);
    this.nav.addEventListener('click', () => {
      this.open = !this.open;
      this.setState(this.nav, 'open', this.open);
      this.navGlyph.textContent = this.open ? '−' : '+';
      this.onNav?.(this.open);
    });
    this.appendElement(this.element, this.nav);
    return this.element;
  }
}
