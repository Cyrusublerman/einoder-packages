import { BaseComponent } from '../foundation.js';

export class Slider extends BaseComponent {
  constructor(options = {}, deps = {}) {
    super({ ...options, componentType: 'slider' }, deps);
    this.min = options.min ?? 0;
    this.max = options.max ?? 100;
    this.step = options.step ?? 1;
    this.value = options.value ?? this.min;
    this.trackHF = options.trackHF ?? 2;
    this.thumbWF = options.thumbWF ?? 0.5;
    this.borders = { top: true, right: true, bottom: true, left: true, ...(options.borders || {}) };
    this.ariaLabel = options.ariaLabel ?? '';
    this.onInput = options.onInput ?? (() => {});
    this.onChange = options.onChange ?? (() => {});
  }

  render() {
    if (this.element) return this.element;
    const { F } = this.getF();
    this.element = this.createElement('input', 'slider');
    this.element.type = 'range';
    this.element.min = String(this.min);
    this.element.max = String(this.max);
    this.element.step = String(this.step);
    this.element.value = String(this.value);
    if (this.ariaLabel) this.element.setAttribute('aria-label', this.ariaLabel);

    const trackPx = F * this.trackHF;
    const edge = (on) => (on ? '1px solid var(--c-border)' : 'none');
    const topB = this.borders.top ? 1 : 0;
    const botB = this.borders.bottom ? 1 : 0;
    this.setCssVar(this.element, '--slider-track-h', `${trackPx}px`);
    this.setCssVar(this.element, '--slider-thumb-w', `${F * this.thumbWF}px`);
    this.setCssVar(this.element, '--slider-thumb-h', `${trackPx - topB - botB}px`);
    this.setCssVar(this.element, '--slider-bd-top', edge(this.borders.top));
    this.setCssVar(this.element, '--slider-bd-right', edge(this.borders.right));
    this.setCssVar(this.element, '--slider-bd-bottom', edge(this.borders.bottom));
    this.setCssVar(this.element, '--slider-bd-left', edge(this.borders.left));

    this.element.addEventListener('input', (e) => {
      this.value = parseFloat(e.target.value);
      this.onInput(this.value);
    });
    this.element.addEventListener('change', (e) => {
      this.value = parseFloat(e.target.value);
      this.onChange(this.value);
    });
    return this.element;
  }

  getValue() {
    return this.value;
  }

  setValue(val, triggerChange = false) {
    this.value = val;
    if (this.element) this.element.value = String(val);
    if (triggerChange) this.onChange(val);
  }
}
