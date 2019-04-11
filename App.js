import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from 'unstated'
import { Provider as PaperProvider } from 'react-native-paper';
import { AsyncStorageDebug } from './utils/AsyncStorageDebug'
if (__DEV__) AsyncStorageDebug()

export default class App extends React.Component {
  render() {
    return (
      <PaperProvider>
        <Provider>
          <AppNavigator />
        </Provider>
      </PaperProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
