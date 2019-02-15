import * as React from "react";

import * as Model from "./Model";
import { Settings } from "./Settings";
import { Field } from "./Field";
import { Summary } from "./Summary";

export interface PanelControlProps {
  trail: Model.Trail;
}

export class PanelControl extends React.PureComponent<PanelControlProps, {}> {
  constructor(props: PanelControlProps) {
    super(props);
    this.state = {
      trail: props.trail,
      debug: { verbose: false },
      step: 1
    };
  }

  public startGame = () => {
    this.setState({
      step: this.state.step + 1
    });
    this.state.trail.start();
  };

  public finishGame = () => {
    this.state.trail.stop();
    this.setState({
      step: this.state.step + 1
    });
  };

  public resetGame = () => {
    this.setState({
      step: 1
    });
  };

  // Same as nextStep, but decrementing
  public previousStep = () => {
    this.setState({
      step: this.state.step - 1
    });
  };

  public render() {
    switch (this.state.step) {
      case 1:
        return (
          <div>
            <Settings
              nextStep={this.startGame}
              trail={this.state.trail}
              debug={this.state.debug}
            />
          </div>
        );
        break;
      case 2:
        return (
          <Field
            nextStep={this.finishGame}
            trail={this.state.trail}
            debug={this.state.debug}
          />
        );
        break;
      case 3:
        return <Summary nextStep={this.resetGame} trail={this.state.trail} />;
        break;
      default:
        return <div>unknown</div>;
    }
    return <div />;
  }
}
