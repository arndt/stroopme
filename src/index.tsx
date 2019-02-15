import * as React from 'react';
import { render } from 'react-dom';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';

import { PanelControl } from './PanelControl';
import * as Model from './Model';

const trail = new Model.Trail();

const App = () => (
  <div>
    <PanelControl trail={trail} />
  </div>
);

render(<App />, document.getElementById('root'));
