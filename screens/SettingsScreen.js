import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  Button,
  View,
  Dimensions,
  TextInput,
  AsyncStorage,
  FlatList,
} from 'react-native'
import { Provider, Subscribe, Container } from 'unstated'
import { PersistContainer } from 'unstated-persist'


class timerState extends PersistContainer {
  persist = {
    key: 'timerState',
    version: 1,
    storage: AsyncStorage,
  }

  state = {
  }

  increment() {
    this.setState({ count: this.state.count + 1, countHistory: [...this.state.countHistory, { lol: 77 }] });
  }
}

class todoState extends PersistContainer {
  persist = {
    key: 'todoState',
    version: 1,
    storage: AsyncStorage,
  }

  state = {
    formText: '',
    todoList: [{title: 'todo1'}, {title: 'todo2'}],
    doneList: [{title: 'done1'}, {title: 'done2'}],
  }

  increment() {
    this.setState({ count: this.state.count + 1, countHistory: [...this.state.countHistory, { lol: 77 }] });
  }

  onChangeText = (formText) => {
    console.warn(this.state.formText)
    this.setState({formText})
  }

  onEndEditing = async() => {
    const todoList =  await [{title: this.state.formText}, ...this.state.todoList]
    this.setState({todoList, formText: ''})
  }

}

const { height, width } = Dimensions.get('window')

class HomeScreen extends Component {
  state = {
    timer: null,
    counter: 25 * 60,
    miliseconds: 0,
    startDisabled: true,
    stopDisabled: false,
    isRest: false,
    isRunning: false,
    formText: '',
  }

  componentDidMount = () => {
    // this.start()
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
    this.setState({ timer, isRunning: true });
  }

  onButtonStart = () => {
    this.start();
  }

  onButtonStop = () => {
    console.warn(this.state.timer)
    clearInterval(this.state.timer);
    this.setState({isRunning: false})
  }

  onButtonClear = () => {
    this.setState({
      counter: 100,
      miliseconds: 0
    })
    clearInterval(this.state.timer);
  }

  onEndEditing = () => {
    this.setState({formText: ''})
  }

  render() {
    const {timerState, todoState} = this.props
    const { counter, isRest, isRunning } = this.state
    const minutes = Math.floor(counter / 60)
    const seconds = counter % 60

    return (
      <View style={styles.container}>
        <View style={styles.timerContainer, {backgroundColor: isRest ? 'green': 'red'}}>
          <View style={styles.counterWrapper}>
            <Text style={styles.counterText}>{minutes}:{seconds}</Text>
          </View>
          <View styles={styles.buttonWrapper}>
            {<isRunning></isRunning>
              ? <Text style={styles.stopButton} onPress={() => this.onButtonStop()}>停止</Text>
              : <Text style={styles.startButton} onPress={() => this.start()}>開始</Text>}
            <Text style={styles.resetButton} onPress={() => this.onButtonClear()}>リセット</Text>
          </View>
        </View>

        <View style={styles.todoContainer}>
          <View style={styles.TextInput} >
            <TextInput 
              onChangeText={(formText) => todoState.onChangeText(formText)}
              onEndEditing={() => todoState.onEndEditing()}
              value={todoState.state.formText}/>
          </View>
          <Text>TODO</Text>
          {todoState.state.todoList.map(x => <Text>{x.title}</Text>)}
          <Text>完了</Text>
          {todoState.state.doneList.map(x => <Text>{x.title}</Text>)}
        </View>
      </View >
    )
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  timerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height / 4,
    width: width,
  },
  counterWrapper: {
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
    flexDirection: 'row'
  },
  startButton: {
    borderWidth: 1,
  },
  stopButton: {
    borderWidth: 1,
  },
  resetButton: {
    borderWidth: 1,
  },
  textInput: {
    borderWidth: 1,
  },
  miniCounter: {
    fontSize: 20,
    position: 'relative',
    top: -32,
    right: -50
  },
  todoContainer: {
    backgroundColor: 'blue'
  }
});

export default App = () => (
  <Subscribe to={[timerState, todoState]}>
    {(timerState, todoState) => <HomeScreen timerState={timerState} todoState={todoState} />}
  </Subscribe>
)
