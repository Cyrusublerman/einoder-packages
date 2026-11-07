import { BaseComponent } from '../foundation.js';

const DEFAULT_LINKS = [
  { label: '@A.EINODER', href: 'https://www.instagram.com/a.einoder/' },
  { label: 'CONTACT', href: '#contact' },
];

export class PageFooter extends BaseComponent {
  constructor(options = {}, deps = {}) {
    super({ ...options, componentType: 'footer' }, deps);
    this.links = options.links ?? DEFAULT_LINKS;
  }

  render() {
    if (this.element) return this.element;
    this.element = this.createElement('footer', 'page-footer');
    for (const link of this.links) {
      const item = this.createElement(link.href ? 'a' : 'button', 'footer-item', link.label);
      if (link.href) {
        item.href = link.href;
        if (/^https?:/i.test(link.href)) item.target = '_blank';
      } else {
        item.type = 'button';
      }
      if (link.onClick) item.addEventListener('click', link.onClick);
      this.appendElement(this.element, item);
    }
    return this.element;
  }
}
