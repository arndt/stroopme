import * as React from 'react';
import { Button, Card } from '@blueprintjs/core';
import * as Model from './Model';

import * as firebase from 'firebase/app';
// import 'firebase/database';

const config = {
  apiKey: 'AIzaSyBT7faM7nvVgaIrcpq6Km_1Pulw53Xs7_s',
  authDomain: 'stroopme.firebaseapp.com',
  databaseURL: 'https://stroopme.firebaseio.com',
  projectId: 'stroopme',
  storageBucket: 'testcollection',
  messagingSenderId: '99325480610'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
export { firebase };

export interface SummaryProps {
  readonly trail: Model.Trail;
  readonly nextStep: () => void;
}

export interface SummaryState {
  newPostKey: string;
}

export class Summary extends React.Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps) {
    super(props);
    this.state = {
      newPostKey: ''
    };
  }

  public componentDidMount() {
    this.saveResult();
  }

  private handleClickNext = () => {
    this.props.nextStep();
  }

  private saveResult = () => {
    const database = firebase.database();
    const result = JSON.parse(JSON.stringify(this.props.trail));
    console.log('saving result', result);
    const newPostRef = database.ref('results').push(result);
    this.setState({
      newPostKey: newPostRef.key
    });
    console.log('saving done', newPostRef.key);
  }

  public render = () => {
    return (
      <Card>
        <Card className="example-card hide">
          <div className="example-header">Summary</div>
          <h3>Game mode</h3>
          <p>
            Chosen mode was: {this.props.trail.mode === 0 ? 'color' : 'text'},{' '}
            {this.props.trail.shuffle ? 'rotation' : 'no rotation'}
          </p>
          <h3>Duration</h3>
          <div>
            Requested: {this.props.trail.duration}s, actual{' '}
            {(this.props.trail.stopTime - this.props.trail.startTime) / 1000}s
          </div>
          <h3>Scores</h3>
          <div>
            Absolute: {this.props.trail.hitCount - this.props.trail.failCount},
            hits: {this.props.trail.hitCount}, fails:{' '}
            {this.props.trail.failCount}
          </div>
          <h3>Index</h3>
          <div>Total: {this.props.trail.index}</div>
        </Card>
        <div className="bp3-callout">
          Result has been indexed with reference '{this.state.newPostKey}' for
          later analysis. If you are offline do not close this window until you
          are reconnected otherwise result will not be persisted.
        </div>
        <br />
        <Button
          text="Next challenge"
          onClick={this.handleClickNext.bind(this)}
        />
      </Card>
    );
  }
}
