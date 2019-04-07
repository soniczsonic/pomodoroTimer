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
  TextInput
} from 'react-native'
import { Card, Button } from 'react-native-paper'

const { height, width } = Dimensions.get('window')
class TextInputModal extends Component {
  state = {
    autoFocus: false
  }

  // モーダルが開かれたら、textInputをフォーカスする。
  componentDidUpdate (prevProps, prevState) {
    if (
      prevProps.isTextInputModalVisible === false &&
      this.props.isTextInputModalVisible === true
    ) {
      this.textInput.focus()
    }
  }

  onEndEditing = () => {
    this.props.todoState.onEndEditing()
    this.props.closeModal()
  }

  render () {
    console.warn('render text input modals')

    const { isTextInputModalVisible, todoState } = this.props
    return (
      <Card>
        <View style={{ height: 200 }}>
          <KeyboardAvoidingView behavior='position' enabled>
            <View style={styles.TextInputContainer}>
              <TextInput
                style={styles.textInput}
                ref={input => (this.textInput = input)}
                value={todoState.state.formText}
                placeholder={'新しいタスク'}
                onChangeText={item => todoState.onChangeText(item)}
                enablesReturnKeyAutomatically
                onEndEditing={this.onEndEditing}
              />
            </View>
            <Button onPress={this.onEndEditing}>保存</Button>
          </KeyboardAvoidingView>
        </View>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30
  },
  red: {
    color: 'red'
  },
  TextInputContainer: {
    backgroundColor: 'gray',
    height: 100
  },
  textInput: {
    fontSize: 24
  }
})

export default TextInputModal
