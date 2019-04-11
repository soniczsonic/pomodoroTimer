import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  AsyncStorage,
  FlatList,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  LayoutAnimation,
  NativeModules
} from 'react-native'
import { Provider, Subscribe, Container } from 'unstated'
import { PersistContainer } from 'unstated-persist'
import { Ionicons } from '@expo/vector-icons'
import { Button, List, TextInput, Banner, Card, Title, Paragraph, Avatar, Surface, TouchableRipple, } from 'react-native-paper'
import {Audio} from 'expo'
import Color from '../assets/color'

import TodoListItem from '../components/TodoListItem'
import TextInputModal from '../components/TextInputModal'

import plusIcon from '../assets/images/plusIcon.png'
import timerState from '../globalStates/timerState'
import {differenceInMinutes, differenceInSeconds, parse} from 'date-fns'
import {retrieveData} from '../utils/AsyncStorageHelper'

console.disableYellowBox = true

const { UIManager } = NativeModules
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class todoState extends PersistContainer {
  persist = {
    key: 'todoState',
    version: 1,
    storage: AsyncStorage
  }

  state = {
    formText: '',
    // idは0から始まる
    todoList: [],
    doneList: []
  }

  onChangeText = formText => {
    this.setState({ formText })
  }

  onEndEditing = async () => {
    if (!this.state.formText) return

    const todoList = await [
      ...this.state.todoList,
      { id: Date.now(), title: this.state.formText }
    ]
    this.setState({ todoList, formText: '' })
  }

  onPressTodoTrash = obj => {
    const todoList = this.state.todoList.filter(value => value.id !== obj.id)
    this.setState({ todoList })
  }

  onPressTodoCheck = obj => {
    const todoList = this.state.todoList.filter(value => value.id !== obj.id)
    const doneList = [
      this.state.todoList.find(value => value.id === obj.id),
      ...this.state.doneList
    ]
    this.setState({ todoList, doneList })
  }

  onPressDoneTrash = obj => {
    const doneList = this.state.doneList.filter(value => value.id !== obj.id)
    this.setState({ doneList })
  }
}

const { height, width } = Dimensions.get('window')

class HomeScreen extends Component {
  miliseconds = 0
  state = {
    isTextInputModalVisible: false,
    isLoading: true
  }
  componentWillUnmount = () => {
    this.props.timerState.clearInterval()
  }
  
  componentDidMount = () => {
    this.loadDataFromAsyncStorage()
    this.calcTimeToDisplay()
  }
  
  loadDataFromAsyncStorage = async() => {
    this.setState({isLoading: true})
    const activatingAlertTime = await retrieveData('activatingAlertTime')
    this.setState({activatingAlertTime, isLoading: false})
  }
  
  // 実装自体は酔いが、 
  calcTimeToDisplay = () => {
    
    // １秒ずつ、インクリメントする。
    let timer = setInterval(() => {
        let counterNumber = differenceInSeconds(new Date(), parse(this.state.activatingAlertTime))
        this.setState({ counterNumber })
      
    }, 100)
    // id を紐づけておく。
    this.timer = timer
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.timerState.state.counter !== 0 &&
      this.props.timerState.state.counter === 0
    ) {
      const { timerState } = this.props
      timerState.updateCounterInComponentDidUpdate()
      timerState.clearInterval()
    }
  }

  onButtonStart = () => {
    this.props.timerState.start()
  }

  onButtonStop = () => {
    const { timerState } = this.props
    timerState.clearInterval(this.timer)
    timerState.setTimerState({ isRunning: false })
  }

  onButtonClear = () => {
    const { timerState } = this.props
    timerState.setTimerState({
      counter: 100
    })
    timerState.clearMiliseconds()
    timerState.clearInterval()
  }

  onEndEditing = () => {
    const { timerState } = this.props
    timerState.setTimerState({ formText: '' })
  }

  onPressNewTodoItemButton = async() => {
    LayoutAnimation.easeInEaseOut()
    this.setState({ isTextInputModalVisible: true })
  }

  onCloseModal = () => {
    LayoutAnimation.easeInEaseOut()
    this.this.setState({ isTextInputModalVisible: false })
  }

  render () {
    if (this.state.isLoading) return null
    const { isTextInputModalVisible, isLoading, counterNumber } = this.state
    const { timerState, todoState } = this.props
    const { isRest, isRunning } = timerState.state
    const minutes = (25 - Math.floor(counterNumber / 60) > 0 ) ? 25 - Math.floor(counterNumber / 60) : 0
    const seconds = 60 - counterNumber % 60


    return (
      <View style={styles.container}>
        <Card>
          <Card.Content>
            <View
              style={
                (styles.timerContainer,
                { backgroundColor: isRest ? 'green' : 'red' })
              }
            >
              <View style={styles.counterWrapper}>
                <Text style={styles.counterText}>
                  {minutes}:{seconds}
                </Text>
                <Text>{this.state.counterNumber}</Text>
              </View>
              <View styles={styles.buttonWrapper}>
                {isRunning ? (
                  <Button
                    color='white'
                    mode='outlined'
                    onPress={() => this.onButtonStop()}
                  >
                    停止
                  </Button>
                ) : (
                  <Button
                    color='white'
                    mode='outlined'
                    onPress={() => this.onButtonStart()}
                  >
                    開始
                  </Button>
                )}
                {/* <Text style={styles.resetButton} onPress={() => this.onButtonClear()}>リセット(実装中)</Text> */}
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={{ paddingTop: 20 }} />

        <ScrollView>
          <View style={styles.todoContainer}>
            <Card style={styles.todoCard}>
              <Text style={{ alignSelf: 'center', fontSize: 20 }}>TODO</Text>
              {todoState.state.todoList.map(x => (
                <TodoListItem item={x} todoState={todoState} />
              ))}
            </Card>

            <View style={{ paddingTop: 20 }} />

            <Card>
              <Text style={{ alignSelf: 'center', fontSize: 20 }}>完了</Text>
              {todoState.state.doneList.map(x => (
                <List.Item
                  title={x.title}
                  // description="Item description"
                  right={props => (
                    <View style={{ flexDirection: 'row' }}>
                      <Ionicons
                        onPress={() => todoState.onPressDoneTrash(x)}
                        style={{ paddingTop: 20 }}
                        name='ios-trash'
                        size={22}
                        color='green'
                      />
                    </View>
                  )}
                />
              ))}
            </Card>
          </View>
        </ScrollView>

        <Button
          style={styles.newTaskButton}
          mode='contained'
          color={Color.materialBlue}
          onPress={this.onPressNewTodoItemButton}
        >
          {/* <Ionicons name="ios-add" size={32} color="white" /> */}
          <Image source={plusIcon} />
          <Text style={{ color: 'white', fontSize: 20 }}>
            新しいタスクを追加
          </Text>
        </Button>

        <View
          isVisible={isTextInputModalVisible}
          style={
            isTextInputModalVisible ? styles.visibleModal : styles.hiddenModal
          }
          onPress={this.onCloseModal}
        >
          <TextInputModal
            todoState={todoState}
            isTextInputModalVisible={isTextInputModalVisible}
            closeModal={() => this.setState({ isTextInputModalVisible: false })}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  timerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height / 4,
    width: width
  },
  counterWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  counter: {
    fontSize: 60,
    textAlign: 'center',
    height: 60,
    margin: 10
  },
  counterText: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold'
  },
  buttonWrapper: {
    flexDirection: 'row'
  },
  startButton: {
    borderWidth: 1
  },
  stopButton: {
    borderWidth: 1
  },
  resetButton: {
    borderWidth: 1
  },
  textInput: {
    borderWidth: 1
  },
  miniCounter: {
    fontSize: 20,
    position: 'relative',
    top: -32,
    right: -50
  },
  todoContainer: {},
  todoListItem: {
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 30
  },
  doneListItem: {
    borderTopWidth: 1,
    height: 30
  },
  todoListItemText: {
    fontSize: 20
  },
  newTaskButton: {
    borderRadius: 50,
    marginBottom: 30
  },
  visibleModal: {
    top: 200,
    height: 100,
    width: width,
    position: 'absolute',
    zIndex: 3
  },
  hiddenModal: {
    top: height,
    height: height,
    width: width,
    position: 'absolute',
    backgroundColor: 'green'
  },
  todoCard: {
    paddingTop: 20
  }
})

export default (App = () => (
  <Subscribe to={[timerState, todoState]}>
    {(timerState, todoState) => (
      <HomeScreen timerState={timerState} todoState={todoState} />
    )}
  </Subscribe>
))
