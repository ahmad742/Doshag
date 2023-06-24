import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Header from '../../../component/TopHeader/Header';
import LinearGradient from 'react-native-linear-gradient';
import Api from '../../../network/Api';
import {strings} from '../../../i18n';
import Preference from 'react-native-preference';

const lang = Preference.get('language');

class index extends Component {
  state = {
    phon: '',
  };
  lefAction() {
    this.props.navigation.goBack();
  }
  inputcheck() {
    if (this.state.phon === '') {
      Alert.alert(strings('activities_screen.alert'),strings('forget_pass_num.enter_num'), [
        {
          text: strings('add_property_screen.ok'),
        },
      ]);
    } else {
      this.forgetPhon();
    }
  }
  forgetPhon() {
    const body = {
      phone_no: this.state.phon,
    };
    console.log(body);
    Api.phonForget(body)
      .then(
        function (response) {
          //   //console.log('Login_Response: ', JSON.stringify(response));
          if (response != 200) {
            Alert.alert(strings('activities_screen.alert'), response.message, [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          } else {
            Alert.alert(strings('activities_screen.alert'),strings('forget_pass_num.new_pass_to_num'), [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
            this.props.navigation.goBack();
          }
        }.bind(this),
      )
      .catch(
        function (error) {
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  }
  render() {
    return (
      <>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('forget_pass_email.forget_password')}
          leftAction={this.lefAction.bind(this)}
          navigation={this.props.navigation}
        />
        <LinearGradient
          colors={['#fbf4ed', '#fbf4ed']}
          style={{
            flex: 1,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 5,
          }}>
          <View
            style={{
              // backgroundColor: '#f5d5d5',
              flex: 1,
            }}>
            <Text
              style={{
                marginTop: 90,
                marginLeft: 5,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl'
              }}>
              {strings('forget_pass_num.enter_number')}
            </Text>
            <TextInput
              onChangeText={(text) => this.setState({phon: text})}
              style={{
                height: 50,
                width: '95%',
                backgroundColor: 'white',
                borderColor: '#F2F0F1',
                borderRadius: 5,
                borderWidth: 2,
                alignSelf: 'center',
                marginTop: 15,
                paddingLeft: 10,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl'
              }}
            />

            <TouchableOpacity
              onPress={() => this.inputcheck()}
              style={{
                backgroundColor: '#B20C11',
                height: 40,
                width: '40%',
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 50,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}>
                {strings('forget_pass_email.submit')}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </>
    );
  }
}

export default index;
