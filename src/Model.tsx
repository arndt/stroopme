
enum TrailState {
  LAUNCHED,
  STARTED,
  FINISHED
}

enum TrailMode {
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

export class Trail {
  public name: string;
  public startTime: number = 0;
  public stopTime: number = 0;
  public duration: number = 90;
  public state: TrailState = TrailState.LAUNCHED;
  public mode: TrailMode = TrailMode.COLOR;
  public shuffle: boolean = false;
  public hitCount: number = 0;
  public failCount: number = 0;
  public index: number = 0;
  public current: Step;
  public steps: Step[] = [];

  public start() {
    this.state = TrailState.STARTED;
    this.hitCount = 0;
    this.failCount = 0;
    this.startTime = new Date().getTime();
    this.current = new Step(true);
  }

  public stop() {
    this.state = TrailState.FINISHED;
    this.stopTime = new Date().getTime();
    this.index = Math.floor(
      ((this.hitCount - this.failCount) / this.duration) * 100
    );
  }

  public validate(selectedOption: number) {
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
