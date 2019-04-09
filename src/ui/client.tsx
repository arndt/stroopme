import * as React from 'react';
import { render } from 'react-dom';
import { AppBar, Card, CardContent, Toolbar, Typography, Paper, CssBaseline } from '@material-ui/core';
import * as Mobx from 'mobx';

import { PanelControl } from './PanelControl';
import * as Model from './Model';

// TODO enable strict mode
/*
Mobx.configure({
  enforceActions: 'always'
});
*/

const trail = new Model.Trail({ pulse: new Model.Pulse() });

function App() {
  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              StroopMe
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <PanelControl trail={trail} />
        </main>
      </React.Fragment>
    </div>);
}

render(<App />, document.getElementById('root'));
