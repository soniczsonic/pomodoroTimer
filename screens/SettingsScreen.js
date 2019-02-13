import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View
} from 'react-native';

class StopWatch extends Component {
  state = {
    timer: null,
    counter: 25 * 60,
    miliseconds: 0,
    startDisabled: true,
    stopDisabled: false,
  }

  componentDidMount = () => {
    this.start()
  }

  componentWillUnmount = () => {
    clearInterval(this.state.timer);
  }

  start = () => {
    let timer = setInterval(() => {
      let num = (this.state.miliseconds + 1)
      let count = this.state.counter
      
      if (this.state.miliseconds == 99 && this.state.counter !== 0) {
        count = (this.state.counter - 1)
        num = 0
      }
      
      this.setState({
        counter: count,
        miliseconds: num
      })
    }, 0)
    this.setState({ timer });
  }

  onButtonStart = () => {
    this.start();
  }

  onButtonStop = () => {
    clearInterval(this.state.timer);
  }

  onButtonClear = () => {
    this.setState({
      counter: 100,
      miliseconds: 0
    })
    clearInterval(this.state.timer);
  }

  render() {
    const {counter} = this.state
    const minutes = Math.floor(counter / 60)
    const seconds = counter % 60
    return (
      <View style={styles.container}>
        <View style={styles.counterWrapper}>
        <Text style={styles.counterText}>{minutes}:{seconds}</Text>
        </View>
        <View styles={styles.buttonWrapper}>
          <Text onPress={() => this.start()}>開始</Text>
          <Text onPress={() => this.onButtonStop()}>停止</Text>
          <Text onPress={() => this.onButtonClear()}>リセット</Text>
        </View>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  counterWrapper: {
    flex: 2
  },
  counter: {
    fontSize: 60,
    textAlign: 'center',
    height: 60,
    margin: 10,
  },
  counterText: {
    fontSize: 50
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  miniCounter: {
    fontSize: 20,
    position: 'relative',
    top: -32,
    right: -50
  }
});


module.exports = StopWatch;