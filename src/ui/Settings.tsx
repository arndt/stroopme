import * as React from 'react';
import { Button, Card, Switch } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { TimeInput } from './TimeInput';
import * as Model from './Model';
import leftPad = require('left-pad');
import { DebugProps } from './DebugProps';

export interface SettingsProps {
  readonly trail: Model.Trail;
  readonly debug: DebugProps;
  readonly nextStep: () => void;
}

interface SettingsState {
  verbose: boolean;
  validForm: boolean;
}

export class Settings extends React.PureComponent<
  SettingsProps,
  SettingsState
> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = { verbose: true, validForm: false };
  }

  public componentDidMount() {
    this.validateName(this.props.trail.name);
  }

  public render = () => {
    return (
      <Card>
        <Card className="example-card hide">
          <div className="example-header">Settings</div>
          <h3>Your e-mail address</h3>
          <input
            name="name"
            type="email"
            required={true}
            className="form-control email"
            defaultValue={this.props.trail.name}
            onChange={this.handleNameChange}
          />
          <h3>Game mode</h3>
          <ToggleButtonGroup>
            <ToggleButton
              onClick={this.handleModeChange.bind(this, 0)}
              selected={this.props.trail.mode === 0}
            >
              Color mode
            </ToggleButton>
            <ToggleButton
              onClick={this.handleModeChange.bind(this, 1)}
              selected={this.props.trail.mode === 1}
            >
              Text mode
            </ToggleButton>
          </ToggleButtonGroup>
          <p />
          <div>
            <Switch
              checked={this.props.trail.shuffle}
              value="Shuffle answers"
              onChange={this.handleShuffleSwitchChange}
            />
          </div>
          <h3>Duration</h3>
          <div>
            <TimeInput
              type="text"
              initTime={this.props.trail.remainingTime}
              className="form-control"
              mountFocus={true}
              onTimeChange={this.handleDurationFieldChange}
            />
          </div>

          <h3>Debugging</h3>
          <Switch
            checked={this.props.debug.verbose}
            value="Pause on results"
            onChange={this.handleDebuggingChange}
          />
        </Card>
        <Button
          disabled={!this.state.validForm}
          onClick={this.handleStartButtonClick}
        >
          Start challenge
        </Button>
        {!this.state.validForm &&
          ' Please enter your mail above to identify yourself'}
      </Card>
    );
  }

  // tslint:disable-next-line:no-any
  private handleNameChange = (event: any) => {
    this.validateName(event.target.value);
    this.props.trail.name = event.target.value;
  }

  private handleDebuggingChange = () => {
    this.props.debug.verbose = !this.props.debug.verbose;
  }

  private handleStartButtonClick = () => {
    this.props.nextStep();
  }

  private handleModeChange = (value: number) => {
    this.props.trail.mode = value;
    // WHAAT!?
    this.forceUpdate();
  }

  private handleDurationFieldChange = (value: string) => {
    const mins = Number.parseInt(value.substr(0, 2), 10);
    const secs = Number.parseInt(value.substr(3, 2), 10);
    this.props.trail.duration = mins * 60 + secs;
  }

  private handleShuffleSwitchChange = () => {
    this.props.trail.shuffle = !this.props.trail.shuffle;
  }

  private validateName = (value: string) => {
    this.setState({
      validForm: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
    });
  }

}
