import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
export default class Loader extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backgroundColor: '#00000020',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#B20C11" />
      </View>
    );
  }
}
