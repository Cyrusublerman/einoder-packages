import {
  PageHeader,
  Subheader,
  PageFooter,
  PageSlot,
  Button,
  Slider,
  AdminTabBar,
} from '@einoder/ui';
import { setInverted } from '@einoder/tokens';

export function mount(container) {
  const instances = [];

  const header = new PageHeader({
    homeLabel: 'EINODER LAB',
    navLabel: 'PRESET',
    onHome: () => header.setState(header.nav, 'open', false),
    onNav: (open) => subheader.setVisible(open),
  });
  const subheader = new Subheader({
    sectionTitle: 'DEV SHELL',
    visible: false,
  });
  const slot = new PageSlot({ label: 'Mount slot' });
  const footer = new PageFooter();

  const invert = new Button({
    text: 'INVERT',
    onClick: () => {
      const on = !document.documentElement.classList.contains('inverted');
      setInverted(on);
      invert.setState(invert.element, 'selected', on);
    },
  });
  const slider = new Slider({
    min: 0,
    max: 100,
    value: 42,
    ariaLabel: 'Demo slider',
  });
  const tabs = new AdminTabBar({
    ariaLabel: 'Demo tabs',
    tabs: [
      { id: 'one', label: 'ONE' },
      { id: 'two', label: 'TWO' },
    ],
  });

  instances.push(header, subheader, slot, footer, invert, slider, tabs);

  container.replaceChildren(
    header.render(),
    subheader.render(),
    slot.render(),
    footer.render(),
  );
  slot.mountChild(invert);
  slot.mountChild(slider);
  slot.mountChild(tabs);

  return () => instances.forEach((c) => c.destroy?.());
}
