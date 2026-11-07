import { BaseComponent } from '../foundation.js';

export class Button extends BaseComponent {
  constructor(options = {}, deps = {}) {
    super({ ...options, componentType: 'button' }, deps);
    this.text = options.text ?? '';
    this.title = options.title ?? '';
    this.onClick = options.onClick ?? null;
    this.disabled = options.disabled ?? false;
    this.buttons = options.buttons ?? null;
    this.mode = options.mode ?? 'action';
    this.size = options.size ?? 'm';
    this.fill = options.fill ?? false;
    this.selected = options.selected ?? false;
    this.activeValue = options.activeValue ?? null;
    this.activeValues = options.activeValues ?? [];
    this.onSelect = options.onSelect ?? (() => {});
    this.buttonElements = [];
  }

  render() {
    if (this.element) return this.element;
    if (this.buttons?.length) return this._renderGroup();
    return this._renderSingle();
  }

  _sizeClass() {
    return `button button--${this.size}${this.fill ? ' button--fill' : ''}`;
  }

  _renderSingle() {
    this.element = this.createElement('button', this._sizeClass());
    this.element.type = 'button';
    this.element.disabled = this.disabled;
    this.element.title = this.title;
    this.element.textContent = this.text;
    this.setState(this.element, 'selected', this.selected);
    if (this.onClick) {
      this.element.addEventListener('click', () => {
        if (!this.disabled) this.onClick();
      });
    }
    return this.element;
  }

  _renderGroup() {
    this.element = this.createElement('div', 'button-group');
    this.buttonElements = [];
    this.buttons.forEach((btn, index) => {
      const value = btn.value ?? index;
      const el = this.createElement('button', `button button--${this.size} button-group-item`);
      el.type = 'button';
      el.title = btn.title ?? '';
      el.dataset.value = String(value);
      el.textContent = btn.text ?? '';
      this.setState(el, 'selected', this._isActive(value));
      el.addEventListener('click', () => this._handleClick(btn, index));
      this.appendElement(this.element, el);
      this.buttonElements.push(el);
    });
    return this.element;
  }

  _isActive(value) {
    if (this.mode === 'radio') return this.activeValue === value;
    if (this.mode === 'toggle') return this.activeValues.includes(value);
    return false;
  }

  _handleClick(btn, index) {
    const value = btn.value ?? index;
    if (this.mode === 'action') {
      btn.onClick?.();
      this.onSelect(value);
      return;
    }
    if (this.mode === 'radio') this.activeValue = value;
    if (this.mode === 'toggle') {
      const i = this.activeValues.indexOf(value);
      if (i >= 0) this.activeValues.splice(i, 1);
      else this.activeValues.push(value);
    }
    this._sync();
    this.onSelect(value);
  }

  _sync() {
    this.buttonElements.forEach((el, i) => {
      this.setState(el, 'selected', this._isActive(this.buttons[i].value ?? i));
    });
  }

  setDisabled(disabled) {
    this.disabled = disabled;
    if (this.element && !this.buttons) this.element.disabled = disabled;
  }

  setText(text) {
    this.text = text;
    if (this.element && !this.buttons) this.element.textContent = text;
  }
}
