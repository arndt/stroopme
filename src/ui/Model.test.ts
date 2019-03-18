import * as Mobx from 'mobx';
import { Pulse, PulseState, Trail } from './Model';
import { doesNotReject } from 'assert';
import { TREE_NODE_LIST } from '@blueprintjs/core/lib/esm/common/classes';

test ('pulseInitialStateTest', () => {
    const pulse = new Pulse();
    expect(pulse.state).toBe(PulseState.STOPPED);
});

test ('pulseLCStateTest', () => {
    const pulse = new Pulse();
    pulse.start();
    expect(pulse.state).toBe(PulseState.STARTED);
    pulse.stop();
    expect(pulse.state).toBe(PulseState.STOPPED);
});

test ('pulseLCStateTest', (done) => {
    const pulse = new Pulse();
    const states = [PulseState.STOPPED, PulseState.STARTED, PulseState.STOPPED];
    Mobx.reaction(() => pulse.state, (data, reaction) => {
        expect(data).toBe(states.shift());
        // tslint:disable-next-line:no-unused-expression
        states.length === 0 && done();
    }, {
        fireImmediately: true
    });
    pulse.start();
    pulse.stop();
});

test ('pulseDoubleStartTest ', () => {
    const pulse = new Pulse();
    pulse.start();
    expect(pulse.state).toBe(PulseState.STARTED);
    expect(() => pulse.start()).toThrowError();
    pulse.stop();
});

test ('pulseTimerShimTest ', () => {
    const timerManager = {
        setInterval: jest.fn(() => 42),
        setTimeout:  jest.fn(),
        clearInterval: jest.fn(),
        clearTimeout:  jest.fn()
    };

    const pulse = new Pulse({timerShim: timerManager});
    expect(timerManager.setInterval).toHaveBeenCalledTimes(0);
    pulse.start();
    expect(timerManager.setInterval).toHaveBeenCalledTimes(1);
    expect(timerManager.clearInterval).toHaveBeenCalledTimes(0);
    pulse.stop();
    expect(timerManager.setInterval).toHaveBeenCalledTimes(1);
    expect(timerManager.clearInterval).toHaveBeenCalledTimes(1);
    expect(timerManager.clearInterval.mock.calls[0][0]).toBe(42);
});

test ('pulseSecondIncreaseTest ', (done) => {
    const timerManager = {
        setInterval: (cb: () => {}) => setInterval(cb, 1),
        setTimeout:  jest.fn(),
        clearInterval: (x: unknown) => clearInterval(x as any),
        clearTimeout:  jest.fn()
    };

    const expectedValues = [0, 1, 2];

    const pulse = new Pulse({timerShim: timerManager});
    Mobx.reaction(() => pulse.seconds, (data) => {
        expect(data).toBe(expectedValues.shift());
        // tslint:disable-next-line:no-unused-expression
        if (expectedValues.length === 0) {
            pulse.stop();
            done();
        }
    }, {fireImmediately: true});
    pulse.start();
});

test ('pulseRestartTest ', (done) => {
    const timerManager = {
        setInterval: (cb: () => {}) => setInterval(cb, 1),
        setTimeout:  jest.fn(),
        clearInterval: (x: unknown) => clearInterval(x as any),
        clearTimeout:  jest.fn()
    };

    const pulse = new Pulse({timerShim: timerManager});

    const mock = jest.fn();

    Mobx.reaction(() => pulse.seconds, (data) => {
        mock(data);
        // tslint:disable-next-line:no-unused-expression
        switch (data) {
            case 1:
            expect(mock.mock.calls).toEqual([[1]]);
            pulse.stop();
            pulse.start();
            break;
            case 0:
            expect(mock.mock.calls).toEqual([[1], [0]]);
            pulse.stop();
            done();
            break;
        }
    });

    pulse.start();
});

test('trailRemainingTimeFormatTest', () => {
    const pulse = new Pulse();
    const trail = new Trail({pulse: pulse});

    trail.duration = 90;
    expect(trail.remainingTime).toBe('01:30');
    expect(trail.remainingMinutes).toBe('01');
    expect(trail.remainingSeconds).toBe('30');

    trail.duration = 5;
    expect(trail.remainingTime).toBe('00:05');
    expect(trail.remainingMinutes).toBe('00');
    console.log(trail.remainingSeconds);
    expect(trail.remainingSeconds).toBe('05');
});
