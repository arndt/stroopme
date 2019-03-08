import * as React from 'react';
// import { Card, Button, Intent } from '@blueprintjs/core';
import { Card, Button } from '@material-ui/core';
import styled from '@emotion/styled';
import * as Model from './Model';
import { observer } from 'mobx-react';
import { ButtonProps } from '@material-ui/core/Button';

export interface FieldProps {
  readonly trail: Model.Trail;
  // tslint:disable-next-line:no-any
  readonly debug: any;
  readonly nextStep: Function;
}

interface FieldState {
  // tslint:disable-next-line:no-any
  readonly debug: any;
  readonly started: boolean;
  readonly paused: boolean;
  readonly trail: Model.Trail;
}

interface FieldButtonProps extends ButtonProps {
  readonly position: FieldButtonType;
}

enum FieldButtonType {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT
}

function colorize (props: {position: FieldButtonType}) {
  switch (props.position) {
    case FieldButtonType.TOP_LEFT:
    break;
    default:
    return 'red';
  }
  return 'black';
}

const FieldButton = styled(Button as React.SFC<FieldButtonProps>)`
  background-color: $((props) => colorize(props))
  flex: 30%;
  margin-bottom: 10%;
  font-weight: bold;
  height: 50px;
  font-size: 18px;
`;

@observer
export class Field extends React.Component<FieldProps, FieldState> {

  public constructor(props: FieldProps) {
    super(props);

    this.state = {
      debug: props.debug,
      started: false,
      paused: false,
      trail: props.trail
    };
  }

  public render() {
    return (
      <Card className="example-card">
        <div className="example-header">
          StroopMe - {this.state.trail.mode === 0 ? 'color' : 'text'} mode
        </div>
        <h3>
          {this.state.debug.verbose}
          Time left: {this.state.trail.remainingTime}, hits: {this.state.trail.hitCount},
          fails: {this.state.trail.failCount}
        </h3>
        <Card className="container">
          <FieldButton
            onClick={() => this.checkAnswer(0)}
            position={FieldButtonType.TOP_LEFT}
            variant="contained"
            disabled={this.state.paused}
          >
            {this.getCaption(this.state.trail.current.choices[0])}
          </FieldButton>
          <div className="box-spacer" />
          <Button
            onClick={() => this.checkAnswer(1)}
            className="box-top-right"
            variant="contained"
            disabled={this.state.paused}
          >
            {this.getCaption(this.state.trail.current.choices[1])}
          </Button>
          <div className="box-spacer" />
          <Card className="box-center">
            <span
              style={{ color: this.getColor(this.state.trail.current.color) }}
            >
              {this.getCaption(this.state.trail.current.text)}
            </span>
          </Card>
          <div className="box-spacer" />
          <Button
            onClick={() => this.checkAnswer(2)}
            className="box-bottom-left"
            variant="contained"
            disabled={this.state.paused}
          >
            {this.getCaption(this.state.trail.current.choices[2])}
          </Button>
          <div className="box-spacer" />
          <Button
            onClick={() => this.checkAnswer(3)}
            className="box-bottom-right"
            variant="contained"
            disabled={this.state.paused}
          >
            {this.getCaption(this.state.trail.current.choices[3])}
          </Button>
        </Card>
        {this.debugPanel()}
        <br />
        <Button
          onClick={this.finish}
          variant="contained"
        >
          End challenge
        </Button>
      </Card>
    );
  }

  private getColor = (value: number) => {
    const color = ['#f30013', '#0072cf', '#66bc29', '#f4af00'];
    return color[value];
  }

  private getCaption = (value: number) => {
    const caption = ['Red', 'Blue', 'Green', 'Yellow'];
    return caption[value];
  }

  private checkAnswer = (value: number) => {
    if (!this.state.started) {
      this.setState({
        started: true
      });
    }

    this.state.trail.validate(value);
    if (this.state.debug.verbose) {
      this.pause();
    } else {
      this.nextStep();
    }
  }

  private pause = () => {
    this.setState({
      paused: true
    });
  }

  private resume = () => {
    this.setState(
      {
        paused: false
      },
      () => {
        this.nextStep();
      }
    );
  }

  private nextStep = () => {
    this.state.trail.newStep();
    this.forceUpdate();
  }

  private finish = () => {
    this.props.nextStep();
  }

  private debugPanel() {
    if (this.state.paused) {
      return (
        <Card>
          <p>
            {'Mode: ' +
              this.state.trail.mode +
              ', Button: ' +
              this.getCaption(this.state.trail.current.result) +
              ', Success: ' +
              this.state.trail.current.success}
          </p>
          <Button
            onClick={this.resume}
            className=""
            variant="contained"
            disabled={!this.state.paused}
          >
            resume
          </Button>
        </Card>
      );
    }
    return <></>;
  }
}
