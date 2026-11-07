import '@einoder/tokens/css';
import '@einoder/ui/css';
import { applyPreset } from '@einoder/tokens';
import { mount } from './demo-page.js';

applyPreset('site');
mount(document.getElementById('app'));
