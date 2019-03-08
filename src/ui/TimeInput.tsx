import * as React from 'react';
import { Card } from '@material-ui/core';

export interface TimeInputDefaultProps {
  placeholder: string;
}

export interface TimeInputProps {
  readonly name?: string;
  readonly initTime?: string;
  readonly disabled?: boolean;
  readonly mountFocus: boolean;
  readonly onTimeChange: (val: string) => void;
  readonly onBlurHandler?: (e: React.FocusEvent) => void;
  readonly onFocusHandler?: (e: React.FocusEvent) => void;
  readonly placeholder: string;
  readonly type: string;
  readonly defaultProps?: TimeInputDefaultProps;
  readonly className: string;
}

export interface TimeInputState {
  time: string;
}

function isValidHour(hours: number) {
  return Number.isInteger(hours) && hours >= 0 && hours < 24;
}
function isValidMinutes(hours: number, minutes: number) {
  return (
    (Number.isInteger(minutes) && isValidHour(hours)) ||
    Number.isNaN(minutes)
  );
}

export class TimeInput extends React.PureComponent<TimeInputProps, TimeInputState> {

  public static readonly defaultProps: TimeInputDefaultProps = {
    placeholder: ' '
  };

  public lastVal: string;
  public _input: HTMLInputElement;

  constructor(props: TimeInputProps) {
    super(props);
    this.state = {
      time: this.props.initTime || ''
    };
    this.lastVal = '';
  }

  public componentDidMount() {
    if (!this.props.disabled && this.props.mountFocus) {
      setTimeout(() => {
        //        this._input.focus();
      }, 0);
    }
  }

  public componentDidUpdate() {
    if (this.props.mountFocus) {
      setTimeout(() => {
        this._input.focus();
      }, 0);
    }
  }

  public componentWillReceiveProps(nextProps: TimeInputProps) {
    if (nextProps.initTime) {
      this.onChangeHandler(nextProps.initTime);
    }
  }

  public isValid(val: string) {
    const letterArr = val
        .split(':')
        .join('')
        .split(''),
      regexp = /^\d{0,2}?\:?\d{0,2}$/;
    const valArr: string[] = [];
    const [hoursStr, minutesStr] = val.split(':');

    if (!regexp.test(val)) {
      return false;
    }

    const hours: number = Number(hoursStr);
    const minutes: number = Number(minutesStr);

    if (!isValidHour(hours) || !isValidMinutes(hours, minutes)) {
      return false;
    }

    if (minutes < 10 && Number(minutesStr[0]) > 5) {
      return false;
    }

    if (valArr.indexOf(':')) {
      valArr.push.apply(valArr, val.split(':'));
    } else {
      valArr.push(val);
    }

    // check mm and HH
    if (
      valArr[0] &&
      valArr[0].length &&
      (parseInt(valArr[0], 10) < 0 || parseInt(valArr[0], 10) > 23)
    ) {
      return false;
    }

    if (
      valArr[1] &&
      valArr[1].length &&
      (parseInt(valArr[1], 10) < 0 || parseInt(valArr[1], 10) > 59)
    ) {
      return false;
    }

    return true;
  }

  public onChangeHandler(val: string) {
    if (val === this.props.initTime ) {
      return;
    }
    if (this.isValid(val)) {
      if (
        val.length === 2 &&
        this.lastVal.length !== 3 &&
        val.indexOf(':') === -1
      ) {
        val = val + ':';
      }

      if (val.length === 2 && this.lastVal.length === 3) {
        val = val.slice(0, 1);
      }

      if (val.length > 5) {
        return false;
      }

      this.lastVal = val;

      this.setState({
        time: val
      });

      if (val.length === 5) {
        this.props.onTimeChange(val);
      }
    }
  }

  public getType() {
    return this.props.type || 'tel';
  }

  public render() {
    return (
      <input
        name={this.props.name ? this.props.name : undefined}
        className={this.props.className}
        type={this.getType()}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
        value={this.state.time}
        onChange={e => this.onChangeHandler(e.target.value)}
        onFocus={
          this.props.onFocusHandler
            ? e => this.props.onFocusHandler(e)
            : undefined
        }
        onBlur={
          this.props.onBlurHandler
            ? e => this.props.onBlurHandler(e)
            : undefined
        }
        ref={c => (this._input = c)}
      />
    );
  }
}
