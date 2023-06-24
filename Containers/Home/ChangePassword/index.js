import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import Header from '../../../component/TopHeader/Header';
import LinearGradient from 'react-native-linear-gradient';
import Preference from 'react-native-preference';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
import {strings} from '../../../i18n';
const WelcomeScreen = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'WelcomeScreen'})],
});

const lang = Preference.get('language');

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hidePassword: true,
      hidePassword2: true,
      password: '',
      re_Enter_Password: '',
    };
  }
  setPasswordVisibilityReEnter = () => {
    this.setState({hidePassword2: !this.state.hidePassword2});
  };
  setPasswordVisibilityEnter = () => {
    this.setState({hidePassword: !this.state.hidePassword});
  };

  changePassword() {
    this.setState({loading: true});
    if (this.state.password === '') {
      Alert.alert(
        strings('activities_screen.alert'),
        strings('change_password_screen.enter_new_pass'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
      this.setState({loading: false});
    } else if (this.state.re_Enter_Password === '') {
      Alert.alert(
        strings('activities_screen.alert'),
        strings('change_password_screen.re_enter_pass'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
      this.setState({loading: false});
    } else if (this.state.password.length < 6) {
      Alert.alert(
        strings('activities_screen.alert'),
        strings('change_password_screen.password_short'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
      this.setState({loading: false});
    } else if (this.state.password === this.state.re_Enter_Password) {
      let body = new FormData();
      body.append('password', this.state.password);
      //console.log('BodyData', body);
      Api.changePasswordApi(body)
        .then(
          function (response) {
            if (response.status != 200) {
              Alert.alert(
                strings('activities_screen.alert'),
                JSON.stringify(response.message),
                [
                  {
                    text: strings('add_property_screen.ok'),
                  },
                ],
              );
            } else {
              let token = Preference.get('FCMToken');
              let lang = Preference.get('language');
              this.setState({loading: false});
              Preference.clear();
              Preference.set('FCMToken', token);
              Preference.set('language', lang);
              this.props.navigation.dispatch(WelcomeScreen);
              // this.setState({loading: false});
              // this.props.navigation.navigate('WelcomeScreen');
              Alert.alert(
                strings('activities_screen.alert'),
                strings('change_password_screen.please_login'),
                [
                  {
                    text: strings('add_property_screen.ok'),
                  },
                ],
              );
            }
          }.bind(this),
        )
        .catch(
          function (error) {
            this.setState({loading: false});
            Alert.alert('Error', 'Check your internet!', [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          }.bind(this),
        );
    } else {
      Alert.alert(
        strings('activities_screen.alert'),
        strings('change_password_screen.password_not_match'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
      this.setState({loading: false});
    }
  }
  lefAction() {
    this.props.navigation.goBack();
  }
  render() {
    return (
      <>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('change_password_screen.change_password')}
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                // backgroundColor: '#f5d5d5',
                flex: 1,
              }}>
              <Text
                style={{
                  marginTop: 90,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {strings('change_password_screen.enter_new_pass')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginTop: 10,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <TextInput
                  onChangeText={(text) => this.setState({password: text})}
                  secureTextEntry={this.state.hidePassword}
                  textContentType="password"
                  style={{
                    width: '90%',
                    height: 50,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
                <TouchableOpacity
                  TouchableOpacity={0.8}
                  onPress={this.setPasswordVisibilityEnter}>
                  <Image
                    source={require('../../../assets/images/eye.png')}
                    resizeMode={'contain'}
                    style={{width: 20, height: 20, marginTop: 4, right: 8}}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  marginTop: 30,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {strings('change_password_screen.re_enter_pass')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginTop: 10,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <TextInput
                  onChangeText={(text) =>
                    this.setState({re_Enter_Password: text})
                  }
                  secureTextEntry={this.state.hidePassword2}
                  textContentType="password"
                  style={{
                    width: '90%',
                    height: 50,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
                <TouchableOpacity
                  TouchableOpacity={0.8}
                  onPress={this.setPasswordVisibilityReEnter}>
                  <Image
                    source={require('../../../assets/images/eye.png')}
                    resizeMode={'contain'}
                    style={{width: 20, height: 20, marginTop: 4, right: 8}}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => this.changePassword()}
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
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}>
                  {strings('change_password_screen.save')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {this.state.loading && <Loader />}
        </LinearGradient>
      </>
    );
  }
}

export default index;
