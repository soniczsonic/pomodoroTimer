import {AsyncStorage} from 'react-native';


export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error)
  }
};

export const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      return value
    }
    return null
  } catch (error) {
    console.log('error at retieve data')
    return null
  }
};
