import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Preference from 'react-native-preference';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
import {strings} from '../../../i18n';
import AppFonts from '../../../assets/fonts/index';

const MainBottomTab = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'MainBottomTab'})],
});
const lang = Preference.get('language');
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      otp: '',
      rotate: '0deg',
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      this.rotation();
    });
  }
  rotation = () => {
    // //console.log('language',Preference.get("language"))
    if (Preference.get('language') == 'en') {
      //this.state.rotate ="0deg";
      this.setState({rotate: '0deg'});
    } else {
      //this.state.rotate ="0deg";
      this.setState({rotate: '180deg'});
      // console.log("180Deg")
    }
  };
  inputcheck = () => {
    if (this.state.otp === '') {
      alert(strings('correct_code.enter_otp_first'));
    } else if (this.state.otp.length < 4) {
      alert(strings('correct_code.otp_not_enough'));
    } else {
      this.otpVerification();
    }
  };
  otpVerification = () => {
    this.setState({loading: true});
    const body = {
      code: this.state.otp,
      phone_no: Preference.get('phon_no'),
      device_token: Preference.get('FCMToken'),
    };
    console.log('BodyData', body);
    Api.otp(body)
      .then(
        function (response) {
          console.log('RegisterAPIResponse: ', JSON.stringify(response));
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
            this.setState({loading: false});
            //return false;
          } else {
            Preference.set({
              userId: response.data.id,
              country: response.data.country,
              phone_verified: 1,
              // phone_verified: response.data.phone_varify,
              userLogin: true,
            });
            this.setState({loading: false});
            this.props.navigation.dispatch(MainBottomTab);
            console.log(
              'Phone_verified or not',
              Preference.get('phone_verified'),
            );
            // Alert.alert('Registration Complete!');
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
  };
  resendOTP = () => {
    this.setState({loading: true});
    const body = {
      // verification_code: this.state.otp,
      phone_no: Preference.get('phon_no'),
    };
    //console.log('BodyData', body);
    Api.resendOtp(body)
      .then(
        function (response) {
          //console.log('RegisterAPIResponse: ', JSON.stringify(response));
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
            this.setState({loading: false});
            //return false;
          } else {
            Alert.alert(
              strings('activities_screen.alert'),
              JSON.stringify(response.message),
              [
                {
                  text: strings('add_property_screen.ok'),
                },
              ],
            );
            // Preference.set('userId', response.data.id);
            this.setState({loading: false});
            // this.props.navigation.dispatch(MainBottomTab);
            // Alert.alert('Registration Complete!');
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
  };
  render() {
    let rotateBack = this.state.rotate;
    return (
      <>
        <LinearGradient
          colors={['#fbf4ed', '#fbf4ed']}
          style={{
            flex: 1,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{
              position: 'absolute',
              left: 20,
              zIndex:99999
            }}>
            <Image
              style={{
                width: 20,
                height: 20,
                marginTop: 40,
                transform: [{rotate: rotateBack}],
              }}
              source={require('../../../assets/images/back-red.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: 'red',
              textAlign: 'center',
              marginTop: 90,
              fontFamily: AppFonts.PoppinsRegular,
            }}>
            {strings('correct_code.otp_sent_to')+"--"}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 5,
              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
              fontFamily: AppFonts.PoppinsMedium,
            }}>
            {Preference.get('phon_no')}
          </Text>

          <Text
            style={{
              marginTop: 50,
              fontFamily: AppFonts.PoppinsRegular,
            }}>
            {strings('correct_code.enter_code')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              borderRadius: 5,
              borderColor:
                this.state.otp === ''
                  ? '#F2F0F1'
                  : this.state.otp.length < 4
                  ? 'red'
                  : 'blue',
              borderWidth: 2,
              width: '100%',
              backgroundColor: 'white',
              marginTop: 10,
            }}>
            <TextInput
              onChangeText={(text) => this.setState({otp: text})}
              maxLength={4}
              keyboardType="phone-pad"
              secureTextEntry={true}
              style={{
                width: '88%',
                height: 50,
                borderColor: '#c9bdbe',
                paddingLeft: 7,
              }}
            />
            {this.state.otp.length > 0 &&
              (this.state.otp.length < 4 ? (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 10,
                  }}>
                  <Image
                    source={require('../../../assets/images/red-cross.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 15,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 10,
                  }}>
                  <Image
                    source={require('../../../assets/images/blue-tick.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 15,
                    }}
                  />
                </TouchableOpacity>
              ))}
          </View>
          <View>
            <TouchableOpacity
              //   onPress={() => this.props.navigation.navigate('MainBottomTab')}
              onPress={() => this.inputcheck()}
              style={{
                backgroundColor:
                  this.state.otp === ''
                    ? '#9ea3a0'
                    : this.state.otp.length < 4
                    ? 'red'
                    : 'blue',
                height: 40,
                width: '60%',
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 50,
                marginBottom: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: '#F2F0F1',
                  textAlign: 'center',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('correct_code.next')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.resendOTP()}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#9ea3a0',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('correct_code.resend_verification_code')}
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.loading && <Loader />}
        </LinearGradient>
      </>
    );
  }
}

export default index;
