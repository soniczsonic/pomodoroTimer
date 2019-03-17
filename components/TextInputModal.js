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
  // Modal,
  TextInput,
  
} from 'react-native'
import Modal from 'react-native-modal'

const {height, width} = Dimensions.get('window')
class TextInputModal extends Component {
  render() {
    console.warn('render text input modals')
    
    const {isVisibleTextInputModal} = this.props
    return (
      <View style={{height: 200}}>
      {/* <Modal style={{height: 200}} isVisible={isVisibleTextInputModal}> */}
        <KeyboardAvoidingView
          behavior="position"
          enabled
        >
          <View style={{backgroundColor: 'white'}}>
          <Text>lol</Text>
          <TextInput />
          </View>
        </KeyboardAvoidingView>
      {/* </Modal> */}
      </View>
    )
  }
}

export default TextInputModal