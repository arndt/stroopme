import * as React from 'react';
import { TextField, Paper, Typography, Button, Card, Switch } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { TimeInput } from './TimeInput';
import * as Model from './Model';
import leftPad = require('left-pad');
import { DebugProps } from './DebugProps';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import { action } from 'mobx';

export interface SettingsProps {
  readonly trail: Model.Trail;
  readonly debug: DebugProps;
  readonly nextStep: () => void;
}

interface SettingsState {
  verbose: boolean;
  validForm: boolean;
}

const SettingsCard = styled(Card as React.FunctionComponent)`
    margin-top: 48px;
    margin-bottom: 48px;
    padding: 24px;
`;

const SettingsContent = styled('div')`
  width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

@observer
export class Settings extends React.Component<
SettingsProps,
SettingsState
> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = {
      verbose: props.debug.verbose,
      validForm: false
    };
  }

  public componentDidMount() {
    this.validateName(this.props.trail.name);
  }

  public render = () => {
    return (
      <SettingsContent>
        <SettingsCard>
          <Typography component="h1" variant="h4" align="center">
            Settings
          </Typography>
          <Typography variant="h6" gutterBottom>
            Your e-mail address
          </Typography>
          <TextField
            id="name"
            name="name"
            type="email"
            label="E-Mail Address"
            fullWidth
            required={true}
            defaultValue={this.props.trail.name}
            onChange={this.handleNameChange}
          />
          <p />
          <Typography variant="h6">
            Game mode
          </Typography>
          <ToggleButtonGroup>
            <ToggleButton
              value={Model.TrailMode.COLOR}
              onClick={() => this.handleModeChange(Model.TrailMode.COLOR)}
              selected={this.props.trail.mode === Model.TrailMode.COLOR}
            >
              Color mode
            </ToggleButton>
            <ToggleButton
              value={Model.TrailMode.TEXT}
              onClick={() => this.handleModeChange(Model.TrailMode.TEXT)}
              selected={this.props.trail.mode === Model.TrailMode.TEXT}
            >
              Text mode
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography>
            <Switch
              checked={this.props.trail.shuffle}
              value={true}
              onChange={this.handleShuffleSwitchChange}
            />
             Shuffle answers
           </Typography>
          <Typography variant="h6" gutterBottom>
            Duration
            </Typography>
          <div>
            <TimeInput
              type="text"
              initTime={this.props.trail.remainingTime}
              className="form-control"
              mountFocus={true}
              onTimeChange={this.handleDurationFieldChange}
            />
          </div>

          <Typography variant="h6" gutterBottom>
            Debugging
            </Typography>
          <Typography>
          <Switch
            checked={this.state.verbose}
            value={true}
            onChange={this.handleDebuggingChange}
          />Pause on results
          </Typography>
          {!this.state.validForm &&
            ' Please enter your mail above to identify yourself'}
          <p />
          <Button
            variant="contained" color="primary"
            disabled={!this.state.validForm}
            onClick={this.handleStartButtonClick}
          >
            Start challenge
        </Button>
        </SettingsCard>
      </SettingsContent>
    );
  }

  // tslint:disable-next-line:no-any
  private handleNameChange = (event: any) => {
    this.validateName(event.target.value);
    this.props.trail.name = event.target.value;
  }

  private handleDebuggingChange = () => {
    this.props.debug.verbose = !this.state.verbose;
    this.setState({
      verbose: this.props.debug.verbose
    });
  }

  private handleStartButtonClick = () => {
    this.props.nextStep();
  }

  @action
  private handleModeChange = (value: Model.TrailMode) => {
    this.props.trail.mode = value;
    // TODO: fixme
    this.forceUpdate();
  }

  private handleDurationFieldChange = (value: string) => {
    const mins = Number.parseInt(value.substr(0, 2), 10);
    const secs = Number.parseInt(value.substr(3, 2), 10);
    this.props.trail.duration = mins * 60 + secs;
  }

  @action
  private handleShuffleSwitchChange = () => {
    this.props.trail.shuffle = !this.props.trail.shuffle;
  }

  private validateName = (value: string) => {
    this.setState({
      validForm: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
    });
  }

}
