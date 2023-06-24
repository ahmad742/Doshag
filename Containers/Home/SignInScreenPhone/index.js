import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Api from '../../../network/Api';
import Preference from 'react-native-preference';
import {strings} from '../../../i18n';
import Loader from '../../../component/Loader/Loader';
import countries from '../../../assets/phone-countries/countries-emoji.json';
import nodeEmoji from 'node-emoji';
import moment from 'moment';
import AppFonts from '../../../assets/fonts/index';
import {isIPhoneX} from '../../../utils/Dimensions';

const lang = Preference.get('language');
 
const listOfContries = Object.values(countries);
const MainBottomTab = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'MainBottomTab'})],
});
const CorrectCode = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'CorrectCode'})],
});

class index extends Component {
  state = {
    phon: '',
    password: '',
    hidePassword: true,
    rotate: '0deg',
    loading: false,
    countries: false,
    flag: 'flag-af',
    countryCode: '+93',
  };
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      this.rotation();
    });
  }
  setPasswordVisibility = () => {
    this.setState({hidePassword: !this.state.hidePassword});
  };
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
  inputcheck() {
    if (this.state.phon === '') {
      alert(strings('forget_pass_num.enter_num'));
    } else if (this.state.password === '') {
      alert(strings('register_screen.enter_pass'));
    } else if (this.state.password.length < 6) {
      alert(strings('sign_in_with_email_screen.incorrect_pass'));
    } else {
      this.userLogin();
    }
  }
  userLogin() {
    this.setState({loading: true});
    const body = {
      phone_no: this.state.countryCode + this.state.phon,
      password: this.state.password,
      device_token: Preference.get('FCMToken'),
    };
    console.log(body);
    Api.login(body)
      .then(
        function (response) {
          console.log('Login_Response: ', JSON.stringify(response));
          // let phone_verified =
          if (response.status != 200) {
            this.setState({loading: false});

            Alert.alert(strings('activities_screen.alert'), JSON.stringify(response.message), [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          } else {
            this.setState({loading: false});

            Preference.set({
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              password: response.data.password,
              email: response.data.email,
              phone_no: response.data.phone_no,
              //   type: response.type,3465356547647
              //   token: response.token,
              phone_verified: response.data.phone_varify,
              userId: response.data.id,
              country: response.data.country,
              userLogin: true,
            });
            // let currency = Preference.get('currency');
            // console.log("Country and Currency on Login: ", Preference.get('country') + Preference.get('currency'))
            // if (country == undefined) {
            //   currency = response.data.country === 'Saudi Arabia' ? 'SAR' : response.data.country === 'Jordan' ? 'JOD' : 'BHD'
            //   Preference.set('currency', currency)
            // } else {
            //   Preference.set('currency', currency)
            // }
            let currency = response.data.country === 'Saudi Arabia' ? 'SAR' :response.data.country === 'Jordan' ? 'JOD' : 'BHD'
            Preference.set('currency', currency)
            // this.props.navigation.dispatch(MainBottomTab);
            if (Preference.get('phone_verified') == 0) {
              this.props.navigation.dispatch(CorrectCode);
            } else {
              this.props.navigation.dispatch(MainBottomTab);
            }
            // Alert.alert('LogIn Succesfull');
          }
          console.log(response.token);
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
          paddingVertical: Platform.OS == 'ios' && isIPhoneX() ? 30 : 0,
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
                textAlign: 'center',
                marginTop: 90,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 22,
                // fontWeight: 'bold',
                fontFamily: AppFonts.PoppinsMedium,
              }}>
              {strings('sign_in_with_email_phon.sign_in')}
            </Text>

            <Text
              style={{
                textAlign: 'center',
                marginTop: 25,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                color: 'gray',
                fontFamily: AppFonts.PoppinsRegular,
              }}>
              {strings('sign_in_with_email_phon.sign_in_with_phone_no')}
            </Text>

            <Text
              style={{
                marginTop: 90,
                marginLeft: 5,
                fontFamily: AppFonts.PoppinsRegular,
              }}>
              {strings('sign_in_with_email_phon.enter_phone')}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this.setState({countries: true})}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 5,
                  width: '22%',
                  height: 50,
                  backgroundColor: 'white',
                  borderColor: '#F2F0F1',
                  borderRadius: 5,
                  borderWidth: 2,
                  marginTop: 15,
                  marginLeft: 10,
                }}>
                <Text>{nodeEmoji.get(this.state.flag)}</Text>
                <Text>{this.state.countryCode}</Text>
              </TouchableOpacity>
              <TextInput
                onChangeText={(text) => this.setState({phon: text})}
                keyboardType="number-pad"
                style={{
                  height: 50,
                  width: '71%',
                  backgroundColor: 'white',
                  borderColor: '#F2F0F1',
                  borderRadius: 5,
                  borderWidth: 2,
                  alignSelf: 'center',
                  marginTop: 15,
                  paddingLeft: 10,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}
              />
            </View>
            <Text
              style={{
                marginTop: 30,
                marginLeft: 5,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                color: 'black',
                fontFamily: AppFonts.PoppinsRegular,
              }}>
              {strings('sign_in_with_email_phon.password')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                borderRadius: 5,
                backgroundColor: 'white',
                borderColor: '#F2F0F1',
                borderWidth: 2,
                width: '95%',
                marginTop: 10,
                paddingLeft: 10,
              }}>
              <TextInput
                onChangeText={(text) => this.setState({password: text})}
                secureTextEntry={this.state.hidePassword}
                style={{
                  height: 50,
                  width: '88%',
                  borderColor: '#c9bdbe',
                  paddingLeft: 7,
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
                  source={require('../../../assets/images/eye.png')}
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
                  fontFamily: AppFonts.PoppinsRegular,
                }}
                onPress={() =>
                  this.props.navigation.navigate('ForgotPasswordPhone')
                }>
                {strings('sign_in_with_email_phon.forgot_password')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.userLogin()}
              style={{
                backgroundColor: '#B20C11',
                height: 40,
                width: '40%',
                alignSelf: 'center',
                justifyContent: 'center',
                marginVertical: 50,
                marginBottom: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('sign_in_with_email_phon.sign_in')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.state.loading && <Loader />}
        {this.state.countries && (
          <View>
            <FlatList
              data={listOfContries}
              keyExtractor={(item) => item.flag}
              listKey={moment().format('x').toString()}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{marginBottom: 20}}
              extraData={this.state}
              contentContainerStyle={{width: '100%'}}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#00000020',
                  }}
                />
              )}
              style={{width: '100%'}}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 15,
                      paddingHorizontal: 5,
                    }}
                    onPress={() => {
                      this.setState({
                        flag: item.flag,
                        countryCode: '+' + item.callingCode[0],
                        countries: false,
                      });
                    }}>
                    <Text style={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 22}}>
                      {nodeEmoji.get(item.flag)}
                    </Text>
                    <View style={{flex: 1, marginHorizontal: 5}}>
                      <Text style={{color: 'black', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 22}}>
                        {item.name.common}
                      </Text>
                    </View>
                    <Text style={{color: 'black', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 22}}>
                      {'+' + item.callingCode[0]}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </LinearGradient>
    );
  }
}

export default index;
