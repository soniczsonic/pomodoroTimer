import React, { Component } from 'react'
import {
  Text,
  View,
  Dimensions,
  AsyncStorage,
  FlatList,
  Image,
  ScrollView,
  Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button, List, TextInput, Banner, Card, Title, Paragraph, Avatar, Surface, TouchableRipple, } from 'react-native-paper'

const ANIMATION_DURATION = 500

export default class TodoListItem extends Component{
  constructor(props) {
    super(props);

    this._animated = new Animated.Value(0);
  }

  componentDidMount() {
    const animation = Animated.timing(this._animated, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    })
    animation.start()
  }

  onRemove = (item) => {
    Animated.timing(this._animated, {
      toValue: 0,
      duration: ANIMATION_DURATION,
    }).start(() => this.props.todoState.onPressTodoTrash(item))
  }

  render() {
    const {todoState, item} = this.props
    const rowStyles = [
      { opacity: this._animated },
    ]
    return (
      <Animated.View
        style={rowStyles}
      >
        <List.Item
          title={item.title}
          right={props => 
            <View style={{flexDirection: 'row'}}>
              <TouchableRipple onPress={() => todoState.onPressTodoCheck(item)}>
                <List.Icon  icon="check" />
              </TouchableRipple>
              <Ionicons  onPress={() => this.onRemove(item)} style={{ paddingTop: 20 }} name="ios-trash" size={22} />
            </View>
          }
        />
      </Animated.View>
    )
  }
}


