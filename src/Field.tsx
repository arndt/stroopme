import * as React from 'react';
import { Card, Button, Intent } from '@blueprintjs/core';
import * as Model from './Model';
import * as leftPad from 'left-pad';

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
  readonly seconds: number;
  readonly trail: Model.Trail;
}

export class Field extends React.PureComponent<FieldProps, FieldState> {
  private interval: unknown;

  public constructor(props: FieldProps) {
    super(props);

    this.state = {
      debug: props.debug,
      started: false,
      paused: false,
      seconds: 0,
      trail: props.trail
    };
  }

  public tick() {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));

    if (this.state.seconds >= this.state.trail.duration) {
      this.finish();
    }
  }

  public componentDidMount() {
    this.startTimer();
  }

  public componentWillUnmount() {
    // tslint:disable-next-line:no-any
    clearInterval(this.interval as any);
  }

  public render() {
    return (
      <Card className="example-card">
        <div className="example-header">
          StroopMe - {this.state.trail.mode === 0 ? 'color' : 'text'} mode
        </div>
        <h3>
          {this.state.debug.verbose}
          Time left: {this.timeLeft()}, hits: {this.state.trail.hitCount},
          fails: {this.state.trail.failCount}
        </h3>
        <Card className="container">
          <Button
            onClick={this.checkAnswer.bind(this, 0)}
            className="box-top-left"
            intent={Intent.NONE}
            text={this.getCaption(this.state.trail.current.choices[0])}
            disabled={this.state.paused}
          />
          <div className="box-spacer" />
          <Button
            onClick={this.checkAnswer.bind(this, 1)}
            className="box-top-right"
            intent={Intent.NONE}
            text={this.getCaption(this.state.trail.current.choices[1])}
            disabled={this.state.paused}
          />
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
            onClick={this.checkAnswer.bind(this, 2)}
            className="box-bottom-left"
            intent={Intent.NONE}
            text={this.getCaption(this.state.trail.current.choices[2])}
            disabled={this.state.paused}
          />
          <div className="box-spacer" />
          <Button
            onClick={this.checkAnswer.bind(this, 3)}
            className="box-bottom-right"
            intent={Intent.NONE}
            text={this.getCaption(this.state.trail.current.choices[3])}
            disabled={this.state.paused}
          />
        </Card>
        {this.debugPanel()}
        <br />
        <Button
          onClick={this.finish}
          className=""
          intent={Intent.PRIMARY}
          text="End challenge"
        />
      </Card>
    );
  }

  private startTimer = () => {
    this.interval = setInterval(() => this.tick(), 1000);
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
    // tslint:disable-next-line:no-any
    clearInterval(this.interval as any);
    this.props.nextStep();
  }

  private timeLeft = () => {
    const remaining = this.state.trail.duration - this.state.seconds;
    const mins = Math.floor(remaining / 60);
    const secs = Math.floor(remaining % 60);
    return leftPad(mins, 2) + ':' + leftPad(secs, 2);
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
            intent={Intent.NONE}
            text="resume"
            disabled={!this.state.paused}
          />
        </Card>
      );
    }
    return <></>;
  }
}
