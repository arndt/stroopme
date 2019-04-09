
import * as Mobx from 'mobx';
import * as leftPad from 'left-pad';

export enum TrailState {
  LAUNCHED,
  STARTED,
  FINISHED
}

export enum TrailMode {
  COLOR,
  TEXT
}

export class Step {
  public mode: TrailMode;
  public text: number;
  public color: number;
  public choices: [1, 2, 3, 0];
  public result: number;
  public success: boolean = false;
  public startTime: number;
  public duration: number;

  constructor(shuffle: boolean) {
    this.startTime = new Date().getTime();
    this.choices = [1, 2, 3, 0];
    const rnd1 = this.random(0, 3);
    const rnd2 = this.random(0, 3);
    this.text = rnd1;
    this.color = rnd2;
    if (shuffle) {
      this.shuffle();
    }
  }

  public shuffle = () => {
    for (let i = 0; i < this.choices.length; ++i) {
      const rnd = this.random(0, 3);
      const tmp = this.choices[i];
      this.choices[i] = this.choices[rnd];
      this.choices[rnd] = tmp;
    }
  }

  public commitSelection = (mode: TrailMode, selectedOption: number) => {
    this.mode = mode;
    this.result = this.choices[selectedOption];
    this.success =
      this.mode === 0 ? this.color === this.result : this.text === this.result;
    this.duration = new Date().getTime() - this.startTime;
//    console.log("This turn was correct? " + this.success);
    return this.success;
  }

  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export enum PulseState {
  STOPPED,
  STARTED
}

export interface IPulse {
  state: PulseState;
  seconds: number;

  start(): void;
  stop(): void;
}

export interface ITimerBorder {
  setInterval(cb: () => unknown, ms: number): unknown;
  setTimeout(cb: () => unknown, ms: number): unknown;
  clearInterval(timer: unknown): void;
  clearTimeout(timer: unknown): void;
}

export interface PulseProps {
  readonly timerShim: ITimerBorder;
}

const systemTimerBorder = {
  setInterval: (cb: () => unknown, ms: number) => setInterval(cb, ms),
  setTimeout:  (cb: () => unknown, ms: number) => setInterval(cb, ms),
  clearInterval: (timer: unknown) => clearInterval(timer as any),
  clearTimeout:  (timer: unknown) => clearTimeout(timer as any)
};

export class Pulse implements IPulse {
  @Mobx.observable
  public state: PulseState = PulseState.STOPPED;
  @Mobx.observable
  public seconds: number = 0;
  private timer: unknown;
  private readonly timerManager: ITimerBorder;

  constructor(props: PulseProps = { timerShim: systemTimerBorder }) {
    this.timerManager = props.timerShim;
  }

  public start() {
    if (this.state != PulseState.STOPPED) {
      throw new Error('pulse not in STOPPED state');
    }

    this.seconds = 0;
    this.timer = this.timerManager.setInterval(() => {
      this.seconds += 1;
    }, 1000);
    this.state = PulseState.STARTED;
  }

  public stop() {
    if (this.state != PulseState.STARTED) {
      throw new Error('pulse not in STARTED state');
    }
    this.timerManager.clearInterval(this.timer as number);
    this.state = PulseState.STOPPED;
  }
}

export interface TrailProps {
  readonly pulse: Pulse;
}

export class Trail {
  private readonly pulse: Pulse;

  public name: string;
  public startTime: number = 0;
  public stopTime: number = 0;
  public duration: number = 90;
  public state: TrailState = TrailState.LAUNCHED;
  @Mobx.observable
  public mode: TrailMode;
  @Mobx.observable
  public shuffle: boolean;
  public hitCount: number = 0;
  public failCount: number = 0;
  public index: number = 0;
  public current: Step;
  public steps: Step[] = [];

  constructor(props: TrailProps) {
    this.pulse = props.pulse;
    // TODO: does not work
    Mobx.action(() => {this.mode = TrailMode.COLOR; });
    Mobx.action(() => {this.shuffle = false; });

    this.mode = TrailMode.COLOR;

    Mobx.reaction(() => this.pulse.seconds, (data) => {
      if (data >= this.duration) {
        this.stop();
      }
    });

    Mobx.reaction(() => this.mode, (data) => {
      console.log('game mode data changed ', data);
    });
  }

  public start() {
    this.state = TrailState.STARTED;
    this.hitCount = 0;
    this.failCount = 0;
    this.startTime = new Date().getTime();
    this.current = new Step(true);
    this.pulse.start();
  }

  public stop() {
    this.state = TrailState.FINISHED;
    this.stopTime = new Date().getTime();
    this.index = Math.floor(
      ((this.hitCount - this.failCount) / this.duration) * 100
    );
    this.pulse.stop();
  }

  public get remainingTime(): string {
    const remaining = this.duration - this.pulse.seconds;
    const mins = Math.floor(remaining / 60);
    const secs = Math.floor(remaining % 60);
    return leftPad(mins, 2, '0') + ':' + leftPad(secs, 2, '0');
  }

  public get remainingMinutes(): string {
    return leftPad(Math.floor(this.duration / 60), 2, '0');
  }

  public get remainingSeconds(): string {
    return leftPad(this.duration % 60, 2, '0');
  }

  public validate(selectedOption: number): boolean {
    const success = this.current.commitSelection(this.mode, selectedOption);
    this.steps.push(this.current);
    success ? ++this.hitCount : ++this.failCount;
    return success;
  }

  public newStep = () => {
    const item = new Step(false);
    if (this.shuffle) {
      item.shuffle();
    } else {
      item.choices = this.current.choices;
    }
    this.current = item;
    return this.current;
  }
}
