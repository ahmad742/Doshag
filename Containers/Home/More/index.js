import React, { Component } from 'react';
import ReactNative, {
  View,
  Image,
  StyleSheet,
  Linking,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { NavigationActions, StackActions , NavigationEvents } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import color from '../../../component/AppColor';
import Header from '../../../component/TopHeader/Header';
import Api from '../../../network/Api';
import Preference from 'react-native-preference';
import Loader from '../../../component/Loader/Loader';
import RNRestart from 'react-native-restart';
import { isRTL, strings } from '../../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
const lang = Preference.get('language');
const WelcomeScreen = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'WelcomeScreen' })],
});
const CustomCheckBox = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        marginStart: 30,
        marginEnd: 30,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
      }}>
      <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: color.DarkGray }}>{props.title}</Text>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 20 / 2,
          borderColor: props.isChecked ? color.redHead : color.DarkGray,
          borderWidth: 1.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: props.isChecked ? color.redHead : 'white',
            borderRadius: 10 / 2,
          }}></View>
      </View>
    </TouchableOpacity>
  );
};

export default class More extends Component {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isVisible: false,
      jordan: false,
      bahrain: false,
      saudi: false,
      isVisibleLang: false,
      english: false,
      arabic: false,
      country: '',
      country2: '',
      language: 0,
      isRTL: ReactNative.I18nManager.isRTL,
      rotate: '0deg',
      countri: [],
      countri2: [],
      selectedNewCountry: false
    };
  }
  componentDidMount = () => {
    this.setCountries();
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      if (Preference.get('token')) {
        if (Preference.get('language') == 'en') {
          this.setState({ rotate: '0deg', english: true });
        } else {
          this.setState({ rotate: '180deg', arabic: true });
        }
      } else {
        Alert.alert(strings('activities_screen.alert'), strings('activities_screen.sign_in_first'), [
          {
            text: strings('add_property_screen.ok'),
          },
        ]);
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'WelcomeScreen' })],
          }),
        );
      }
    });
  };
  setCountries = async () => {
    // //console.log('language', Preference.get('language'));
    let countriesDetails = undefined;
    try {
      countriesDetails = JSON.parse(await AsyncStorage.getItem('countries'));
      // console.log("country details==>>>", countriesDetails)
    } catch (error) {
      //console.log('AllCountries Error', JSON.stringify(error));
    }
    let country = [];
    let country2 = [];
    let imageBaseUrl = 'https://doshag.net/admin/public';
    for (let i = 0; i < countriesDetails.length; i++) {
      let lang =
        Preference.get('language') == 'en'
          ? countriesDetails[i].name
          : countriesDetails[i].arabic_name;
      country.push(lang);
      country2.push(countriesDetails[i].name);
    }
    this.setState({
      countri: country,
      countri2: country,
    });
  };
  onShare = async () => {
    try {
      const result = await Share.share({ message:  'Android : https://play.google.com/store/apps/details?id=com.app.rn.doshag' + '\n' +
          'IOS: https://apps.apple.com/pk/app/doshag/id1560947568',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  checkBox(text) {
    this.setState(
      {
        jordan: false,
        bahrain: false,
        saudi: false,
        selectedNewCountry: true
      },
      () => {
        if (text === this.state.countri2[0]) {
          this.setState({ jordan: true });
          Preference.set('country', this.state.countri2[0]);
        } else if (text === this.state.countri2[2]) {
          this.setState({ bahrain: true });
          Preference.set('country', this.state.countri2[2]);
        } else if (text === this.state.countri2[1]) {
          this.setState({ saudi: true });
          Preference.set('country', this.state.countri2[1]);
        }
      },
    );
  }
  checkBoxLang(text) {
    if (text === 'english') {
      this.setState({ english: true, arabic: false });
    } else if (text === 'arabic') {
      this.setState({ english: false, arabic: true });
    }
  }
  setCountryFun() {
    let countrii = '';
    this.setState({ loading: true });
    if (this.state.jordan == true) {
      countrii = 'Jordan';
    } else if (this.state.bahrain == true) {
      countrii = 'Bahrain';
    } else if (this.state.saudi == true) {
      countrii = 'Saudi Arabia';
    }
    this.setState({ isVisible: false });
    let body = new FormData();
    body.append('country', countrii);
    Api.contryChange(body)
      .then(
        function (response) {
          this.setState(
            {
              jordan: false,
              bahrain: false,
              saudi: false,
              selectedNewCountry: false,
              loading: false
            });
          if (response.status != 200) {
            Alert.alert(strings('activities_screen.alert'), JSON.stringify(response.message), [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          } else {
            Alert.alert(strings('activities_screen.alert'), strings('more_screen.country_updated'), [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          }
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({loading:false})
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  }
  inAppLanguageChange = () => {
    if (this.state.arabic == true) {
      ReactNative.I18nManager.forceRTL(true);
      Preference.set('language', 'ar');
      RNRestart.Restart();
      // console.log(Preference.get('language'));
    } else if (this.state.english == true) {
      Preference.set('language', 'en');
      ReactNative.I18nManager.forceRTL(false);
      RNRestart.Restart();
      // console.log(Preference.get('language'));
    }
  };
  setLanguageFun() {
    let languagii = 0;
    this.setState({ loading: true });
    if (this.state.english == true) {
      languagii = 1;
    } else if (this.state.arabic == true) {
      languagii = 2;
    }
    this.setState({ isVisible: false });
    let body = new FormData();
    body.append('language', languagii);
    //console.log('BodyData', body);
    Api.languageChange(body)
      .then(
        function (response) {
          //console.log('Language Api Response: ', JSON.stringify(response));
          if (response.status != 200) {
            Alert.alert(strings('activities_screen.alert'), JSON.stringify(response.message), [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          } else {
            this.setState({ loading: false });
            this.setState({ isVisibleLang: false });
            Alert.alert(strings('activities_screen.alert'), strings('more_screen.language_updated'), [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
            this.inAppLanguageChange();
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
  
  deleteAccount()
  {
    let bodyData={
      user_id:Preference.get('userId')
    }
    Api.Delete_Account(bodyData)
  .then(
    function (response) {
      
      console.log('UpdateAPIResponse: ', JSON.stringify(bodyData));
      if (response.status == 200) {
        //this.userLogout()
        this.setState({ loading: false });
        Preference.clear();
        Preference.set('FCMToken', token);
        Preference.set('language', lang);
        this.props.navigation.dispatch(WelcomeScreen);
        Alert.alert(strings('activities_screen.alert'), strings('profile_screen.logout_sucess'), [
          {
            text: strings('add_property_screen.ok'),
          },
        ]);
      } else {
       
        this.setState({loading: false});
        Alert.alert(strings('activities_screen.alert'), response.message, [
          {
            text: strings('add_property_screen.ok'),
          },
        ]);
      }
    }.bind(this),
  )
  .catch(
    
    function (error) {
      this.setState({loading: false});
      Alert.alert(strings('activities_screen.alert'), error.message, [
        {
          text: strings('add_property_screen.ok'),
        },
      ]);
    }.bind(this),
  );
};


  userLogout() {
    // this.props.navigation.dispatch(WelcomeScreen);
    this.setState({ loading: true });
    Api.Logout()
      .then(
        function (response) {
          let token = Preference.get('FCMToken');
          let lang = Preference.get('language');
          //console.log('LogoutAPIResponse: ', JSON.stringify(response));
          this.setState({ loading: false });
          Preference.clear();
          Preference.set('FCMToken', token);
          Preference.set('language', lang);
          this.props.navigation.dispatch(WelcomeScreen);
          Alert.alert(strings('activities_screen.alert'), strings('profile_screen.logout_sucess'), [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
          //Alert.alert('Logout Successfully!');
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
countryStateUpdate(){
  const preferenceCountry = Preference.get(`country`);
  if (preferenceCountry == `Bahrain`) {
    this.setState({ bahrain: true, jordan: false, saudi: false })
  }
  else if (preferenceCountry == `Jordan`) {
    this.setState({ jordan: true, bahrain: false, saudi: false })
  }
  else {
    this.setState({ saudi: true, jordan: false, bahrain: false })
  }
}
  render() {
    const { jordan, bahrain, saudi , selectedNewCountry } = this.state;
    let rotateBack = this.state.rotate;
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.countryStateUpdate()} />
        <Header
          headerText={strings('bottom_tab.more')}
          // leftIcon={require("../../../assets/images/back.png")}
          // leftAction={this.leftAction.bind(this)}
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
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, margin: 20, marginTop: 30 }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('NotificationScreen')
                }
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/NotificationRed.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  style={{
                    marginBottom: 25,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.Notification')}
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 5,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  //Linking.openURL('https://wa.me/message/D6WEPIQFW5TPE1');
                  Linking.openURL('https://api.whatsapp.com/send?phone=97333022726');
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/text.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  style={{
                    marginBottom: 30,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.live_chat')}
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ isVisible: true })}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/flag.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20, marginTop: 3 }}
                />
                <Text
                  style={{
                    marginBottom: 25,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.country')}
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ isVisibleLang: true })}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/translate.png')}
                  resizeMode={'contain'}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                <Text
                  style={{
                    marginBottom: 30,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.language')}
                </Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                  }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 5,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('MyProperty');
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/home-run.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  style={{
                    marginBottom: 30,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.my_property')}
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 5,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AppFeedback');
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/feedback.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20, marginTop: 3 }}
                />
                <Text
                  style={{
                    marginBottom: 30,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.give_app_feedback')}
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  {Platform.OS=='ios'?
                  Linking.openURL( 'https://apps.apple.com/pk/app/doshag/id1560947568')
                  :Linking.openURL('https://play.google.com/store/apps/details?id=com.app.rn.doshag')
                }
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/star.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  style={{
                    marginBottom: 30,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.rate_the_app')}
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 3,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.onShare();
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/sharerRed.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20, bottom: 1 }}
                />
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                    marginBottom: 25,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.share_the_app')}
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 3,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ChangePassword')}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/feedback.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20, marginTop: 3 }}
                />
                <Text
                  style={{
                    marginBottom: 30,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.change_password')}
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert(
                  "Delete My Account",
                  "Do you want to delete your account",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => this.deleteAccount() }
                  ]
                )}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/delete.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20, marginTop: 3 ,tintColor:color.lightRed}}
                />
                <Text
                  style={{
                    marginBottom: 30,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                    Delete Your Account
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => this.userLogout()}
                style={{ marginTop: 5 }}>
                <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14, fontWeight: 'bold', marginTop: 20 }}>
                {strings('more_screen.logout')}
                </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
              onPress={() => this.userLogout()}
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 4,
                }}>
                <Image
                  source={require('../../../assets/images/logout.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20, marginTop: 3 }}
                />
                <Text
                  style={{
                    marginBottom: 30,
                    color: '#979191',
                    marginStart: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('more_screen.logout')}
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      transform: [{ rotate: rotateBack }],
                    }}
                  />
                </View>
              </TouchableOpacity>
              
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.isVisible}
            // onRequestClose={() => {
            //   Alert.alert('Modal has been closed.');
            // }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ margin: 20, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ isVisible: false });
                      }}>
                      <Image
                        source={require('../../../assets/images/close.png')}
                        resizeMode={'contain'}
                        style={{ width: 15, height: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'flex-start',
                      paddingHorizontal: 20,
                    }}>
                    <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, fontWeight: 'bold' }}>
                      {strings('more_screen.choose_country')}
                    </Text>
                  </View>
                  <CustomCheckBox
                    title={this.state.countri[2]}
                    isChecked={bahrain}
                    onPress={() => {
                      this.checkBox(this.state.countri2[2]);
                    }}
                  />
                  <CustomCheckBox
                    title={this.state.countri[0]}
                    isChecked={jordan}
                    onPress={() => {
                      this.checkBox(this.state.countri2[0]);
                    }}
                  />
                  <CustomCheckBox
                    title={this.state.countri[1]}
                    isChecked={saudi}
                    onPress={() => {
                      this.checkBox(this.state.countri2[1]);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if(selectedNewCountry){
                        this.setCountryFun();
                      }
                      else{
                        this.setState({isVisible:false})
                      }
                    }}>
                    <Text
                      style={{
                        marginStart: 30,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                        textAlign: 'center',
                        margin: 20,
                      }}>
                      {strings('add_property_screen.ok')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.isVisibleLang}
            // onRequestClose={() => {
            //   Alert.alert('Modal has been closed.');
            // }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ margin: 20, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ isVisibleLang: false });
                      }}>
                      <Image
                        source={require('../../../assets/images/close.png')}
                        resizeMode={'contain'}
                        style={{
                          width: 15,
                          height: 15,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'flex-start',
                      paddingHorizontal: 20,
                    }}>
                    <Text
                      style={{
                        // marginStart: 30,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {strings('more_screen.choose_language')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.checkBoxLang('english');
                    }}
                    style={{
                      marginStart: 30,
                      marginEnd: 30,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                        color: color.DarkGray,
                      }}>
                      {strings('more_screen.english')}
                    </Text>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20 / 2,
                        borderColor: this.state.english
                          ? color.redHead
                          : color.DarkGray,
                        borderWidth: 1.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: this.state.english
                            ? color.redHead
                            : 'white',
                          borderRadius: 10 / 2,
                        }}></View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.checkBoxLang('arabic');
                    }}
                    style={{
                      marginStart: 30,
                      marginEnd: 30,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: color.DarkGray }}>
                      {strings('more_screen.arabic')}
                    </Text>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20 / 2,
                        borderColor: this.state.arabic
                          ? color.redHead
                          : color.DarkGray,
                        borderWidth: 1.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: this.state.arabic
                            ? color.redHead
                            : 'white',
                          borderRadius: 10 / 2,
                        }}></View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setLanguageFun();
                    }}>
                    <Text
                      style={{
                        marginStart: 30,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                        textAlign: 'center',
                        margin: 20,
                      }}>
                      {strings('add_property_screen.ok')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
          {this.state.loading && <Loader />}
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    margin: 40,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
