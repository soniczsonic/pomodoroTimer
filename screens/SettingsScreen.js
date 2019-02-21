import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  AsyncStorage,
  FlatList,
  Image,
  ScrollView
} from 'react-native'
import { Provider, Subscribe, Container } from 'unstated'
import { PersistContainer } from 'unstated-persist'
import { Ionicons } from '@expo/vector-icons'
import { Button, List, TextInput, Banner, Card, Title, Paragraph, Avatar, Surface, TouchableRipple, } from 'react-native-paper';

const TodoListItem = (props) => (
  <View>
    <Text></Text>
  </View>
)


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
    // idは0から始まる
    todoList: [],
    doneList: [],
  }

  onChangeText = (formText) => {
    console.warn(this.state.formText)
    this.setState({ formText })
  }

  onEndEditing = async () => {
    const todoList = await [...this.state.todoList, { id: Date.now(), title: this.state.formText }]
    this.setState({ todoList, formText: '' })
  }

  onPressTodoTrash = (obj) => {
    const todoList = this.state.todoList.filter(value => value.id !== obj.id)
    this.setState({todoList})
  }

  onPressTodoCheck = (obj) => {
    const todoList = this.state.todoList.filter(value => value.id !== obj.id)
    const doneList = [this.state.todoList.find(value => value.id === obj.id), ...this.state.doneList]
    this.setState({todoList, doneList})
  }

  onPressDoneTrash = (obj) => {
    const doneList = this.state.doneList.filter(value => value.id !== obj.id)
    this.setState({doneList})
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
    visible: true,
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
    this.setState({ isRunning: false })
  }

  onButtonClear = () => {
    this.setState({
      counter: 100,
      miliseconds: 0
    })
    clearInterval(this.state.timer);
  }

  onEndEditing = () => {
    this.setState({ formText: '' })
  }

  render() {
    const { timerState, todoState } = this.props
    const { counter, isRest, isRunning } = this.state
    const minutes = Math.floor(counter / 60)
    const seconds = counter % 60

    return (
      <View style={styles.container}>

        <Card>
          <Card.Content>
          <View style={styles.timerContainer, {backgroundColor: isRest ? 'green': 'red'}}>
            <View style={styles.counterWrapper}>
              <Text style={styles.counterText}>{minutes}:{seconds}</Text>
            </View>
            <View styles={styles.buttonWrapper}>
              {isRunning
                ? <Button color='white' mode="outlined" onPress={() => this.onButtonStop()}>停止</Button>
                : <Button color='white' mode="outlined" onPress={() => this.onButtonStart()}>開始</Button>}
              <Text style={styles.resetButton} onPress={() => this.onButtonClear()}>リセット</Text>
            </View>
          </View>
          </Card.Content>
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>

        <ScrollView>

        <View style={styles.todoContainer}>
          <View style={styles.TextInput} >
            <TextInput
              type='outlined'
              onChangeText={(formText) => todoState.onChangeText(formText)}
              onEndEditing={() => todoState.onEndEditing()}
              value={todoState.state.formText} />
          </View>
          <Text style={{ alignSelf: 'center', fontSize: 20 }}>TODO</Text>
          {todoState.state.todoList.map(x =>
            <List.Item
              title={x.title}
              // description="Item description"
              right={props => 
                <View style={{flexDirection: 'row'}}>
                  <TouchableRipple onPress={() => todoState.onPressTodoCheck(x)}>
                    <List.Icon  icon="check" />
                  </TouchableRipple>
                  <Ionicons  onPress={() => todoState.onPressTodoTrash(x)} style={{ paddingTop: 20 }} name="ios-trash" size={22} color="green" />
                </View>
              }
            />
          )}
          <Text style={{ alignSelf: 'center', fontSize: 20 }}>完了</Text>

          {todoState.state.doneList.map(x =>
            <List.Item
              title={x.title}
              // description="Item description"
              right={props => 
                <View style={{flexDirection: 'row'}}>
                  <Ionicons  onPress={() => todoState.onPressDoneTrash(x)} style={{ paddingTop: 20 }} name="ios-trash" size={22} color="green" />
                </View>
              }
            />
          )}

        </View>
      </ScrollView >
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  todoListItem: {
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 30,
  },
  doneListItem: {
    borderTopWidth: 1,
    height: 30,
  },
  todoListItemText: {
    fontSize: 20
  }
});

export default App = () => (
  <Subscribe to={[timerState, todoState]}>
    {(timerState, todoState) => <HomeScreen timerState={timerState} todoState={todoState} />}
  </Subscribe>
)
