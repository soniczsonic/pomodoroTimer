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
  TextInput,
} from 'react-native'
import Modal from 'react-native-modal'

const {height, width} = Dimensions.get('window')
class TextInputModal extends Component {

  onEndEditing = () => {
    this.props.todoState.onEndEditing()
    this.props.closeModal()
  }

  render() {
    console.warn('render text input modals')
    
    const {isVisibleTextInputModal, todoState} = this.props
    return (
      <View style={{height: 200}}>
      {/* <Modal style={{height: 200}} isVisible={isVisibleTextInputModal}> */}
        <KeyboardAvoidingView
          behavior="position"
          enabled
          
          >
          <View style={styles.TextInputContainer}>
          <TextInput
            autoFocus={true}
            value={todoState.state.formText}
            placeholder={'Aさんにメール'}
            onChangeText={item => todoState.onChangeText(item)}
            enablesReturnKeyAutomatically
            onEndEditing={this.onEndEditing}
          />
          </View>
        </KeyboardAvoidingView>
      {/* </Modal> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
  TextInputContainer: {
    backgroundColor: 'gray',
    height: 50,
  }
});

export default TextInputModal