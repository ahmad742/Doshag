import React, { Component } from 'react';
import color from '../../../component/AppColor';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Api from '../../../network/Api';
import Preference from 'react-native-preference';
import { strings } from '../../../i18n';
import Loader from '../../../component/Loader/Loader';
import AppFonts from '../../../assets/fonts/index';
import { isIPhoneX } from '../../../utils/Dimensions';

const lang = Preference.get('language');


// const {params} = this.props.navigation.state;
const MainBottomTab = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'MainBottomTab' })],
});
const PropertyDetailScreen = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'PropertyDetailScreen' })],
});
const CorrectCode = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'CorrectCode' })],
});

class index extends Component {
  state = {
    email: 'sarmad.samiullah@appcrates.com',
    password: '12345678',
    hidePassword: true,
    rotate: '0deg',
    loading: false,
  };

  setPasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      this.rotation();
    });
  }
  rotation = () => {
    console.log('language', Preference.get("language"))
    if (Preference.get('language') == 'en') {
      //this.state.rotate ="0deg";
      this.setState({ rotate: '0deg' });
    } else {
      //this.state.rotate ="0deg";
      this.setState({ rotate: '180deg' });
      // console.log("180Deg")
    }
  };
  inputcheck() {
    if (this.state.email === '') {
      alert(strings('forget_pass_email.enter_email'));
    } else if (
      /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(
        this.state.email.trim(),
      ) == false
    ) {
      alert(strings('sign_in_with_email_screen.email_invalid'));
    } else if (this.state.password === '') {
      alert(strings('register_screen.enter_pass'));
    }
    // else if (this.state.password.length < 1) {
    //   alert(strings('sign_in_with_email_screen.incorrect_pass'));
    // }
    else {
      this.userLogin();
    }
  }
  userLogin() {
    const { params } = this.props.navigation.state;
    this.setState({ loading: true });
    const body = {
      email: this.state.email,
      password: this.state.password,
      device_token: Preference.get("FCMToken"),
    };
    console.log(body);
    Api.login(body)
      .then(
        function (response) {
          console.log('LoginApiResponse: ', JSON.stringify(response));
          // let phone_verified = 
          if (response.status != 200) {
            this.setState({ loading: false });
            Alert.alert(strings('activities_screen.alert'), JSON.stringify(response.message), [{
              text: strings('add_property_screen.ok'),
            },
            ]);
          } else {
            this.setState({ loading: false });

            Preference.set({
              phone_verified: response.data.phone_varify,
              phone_no: response.data.phone_no,
              userId: response.data.id,
              country: response.data.country,
              userLogin: true,
            });


            // let currency = Preference.get('currency');
            // console.log("Country and Currency: ", Preference.get('country') + Preference.get('currency'))
            console.log("USerSetLogni ", Preference.get('userLogin'));


            // if (currency == undefined) {
            //   currency = Preference.get('country') === 'Saudi Arabia' ? 'SAR' : Preference.get('country') === 'Jordan' ? 'JOD' : 'BHD'
            //   Preference.set('currency', currency)
            // } else {
            //   Preference.set('currency', currency)
            // }
            let currency = response.data.country === 'Saudi Arabia' ? 'SAR' : response.data.country === 'Jordan' ? 'JOD' : 'BHD'
            Preference.set('currency', currency)
            if (params.bookNow == true) {
              // this.props.navigation.dispatch(StackActions.reset({
              //   index: 0,
              //   actions: [NavigationActions.navigate({routeName: 'PropertyDetailScreen', params:{itemId:params.itemId}})],
              // }));
              this.props.navigation.goBack();
            } else {
              if (Preference.get('phone_verified') == 0) {
                this.props.navigation.dispatch(CorrectCode);
              } else {
                this.props.navigation.dispatch(MainBottomTab);
              }
            }
          }
          console.log(response.token);
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({ loading: false });
          Alert.alert('Error', 'Check your internet!', [{
            text: strings('add_property_screen.ok'),
          },
          ]);
        }.bind(this),
      );
  }

  render() {
    let rotateBack = this.state.rotate;
    return (
      <LinearGradient
        colors={['#fbf4ed', '#fbf4ed']}
        style={{
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 5,
          paddingVertical: (Platform.OS == 'ios' && isIPhoneX()) ? 30 : 0
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            // backgroundColor: '#f5d5d5',
            flex: 1,
          }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={{
                position: 'absolute',
                left: 15,
              }}>
              <Image
                style={{ width: 20, height: 20, marginTop: 40, transform: [{ rotate: rotateBack }], }}
                source={require('../../../assets/images/back-red.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 90,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 22,
                // fontWeight: 'bold',
                fontFamily: AppFonts.PoppinsMedium
              }}>
              {strings('sign_in_with_email_screen.sign_in')}
            </Text>

            <Text
              style={{
                textAlign: 'center',
                marginTop: 25,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                color: 'gray',
                fontFamily: AppFonts.PoppinsRegular
              }}>
              {strings('sign_in_with_email_screen.sign_in_with_email')}
            </Text>

            <Text
              style={{
                marginTop: 90,
                marginLeft: 5,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                fontFamily: AppFonts.PoppinsRegular
              }}>
              {strings('sign_in_with_email_screen.email_address')}
            </Text>
            <TextInput
              autoCapitalize={"none"}
              keyboardType={"email-address"}
              autoComplete={"email"}
              textContentType={"emailAddress"}
              onChangeText={(text) => this.setState({ email: text })}
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

            <Text
              style={{
                marginTop: 30,
                marginLeft: 5,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                color: 'black',
                fontFamily: AppFonts.PoppinsRegular
              }}>
              {strings('sign_in_with_email_screen.password')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                borderRadius: 5,
                borderColor: '#F2F0F1',
                borderWidth: 2,
                width: '95%',
                backgroundColor: 'white',
                marginTop: 10,
              }}>
              <TextInput
                onChangeText={(text) => this.setState({ password: text })}
                secureTextEntry={this.state.hidePassword}
                style={{
                  height: 50,
                  width: '88%',
                  borderColor: '#c9bdbe',
                  paddingLeft: 7,
                  // backgroundColor:"red"
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.setPasswordVisibility}
                style={{
                  position: 'absolute',
                  right: 10,
                }}>
                <Image
                  source={
                    this.state.hidePassword
                      ? require('../../../assets/images/eye.png')
                      : require('../../../assets/images/eye.png')
                  }
                  resizeMode={'contain'}
                  style={{
                    width: 20,
                    height: 20,
                    marginTop: 15,
                  }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text
                style={{
                  color: '#9e0916',
                  textAlign: 'right',
                  marginRight: 10,
                  marginTop: 30,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                  fontFamily: AppFonts.PoppinsRegular
                }}
                onPress={() =>
                  this.props.navigation.navigate('ForgotPasswordEmail')
                }>
                {strings('sign_in_with_email_screen.forgot_password')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.inputcheck()}
              style={{
                backgroundColor: '#B20C11',
                height: 40,
                width: '40%',
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 50,
                marginBottom: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  fontFamily: AppFonts.PoppinsRegular
                }}>
                {strings('sign_in_with_email_screen.sign_in')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={{
                  color: '#9e0916',
                  textAlign: 'right',
                  marginRight: 10,
                  marginVertical: 30,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                  fontFamily: AppFonts.PoppinsRegular
                }}
                onPress={() =>
                  this.props.navigation.navigate('WelcomeScreen')
                }>
                {strings('sign_in_with_email_screen.dont_have_acc')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.state.loading && <Loader />}
      </LinearGradient>
    );
  }
}

export default index;
