import 'react-native';
import timerState from '../timerState'
import React from 'react';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';

describe('timerState test', () => {
  jest.useFakeTimers();
  const timer = new timerState()

  it('initial timer have 25 minutes', () => {
    expect(timer.state.counter).toEqual(25 * 60)
  })

  // timer.startで、timerStateの中の、this.timerに、setIntervalの返り値をassignする。
  // そのため、timer.timerは、nullではなくなる。
  it('start must assign timer to this', () => {
    timer.start()
    expect(!!timer.timer).toEqual(true)
  })

  // conterの値が、0になると、停止になる。
  // 停止を押すと、isRestの値に応じて、nextInterValが決定され、setStateされる。
  // conterの値が0の時に、startを押すと、何が起こる？ それをテストに記述する。
  // isRestの時は、緑色になる。

  
});