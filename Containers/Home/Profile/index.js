import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import Header from '../../../component/LargeHeader/Header';
import color from '../../../component/AppColor';
import Preference from 'react-native-preference';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
import {strings} from '../../../i18n';
import AppFonts from '../../../assets/fonts/index';
const WelcomeScreen = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'WelcomeScreen'})],
});
const lang = Preference.get('language');
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      firstname: '',
      lastname: '',
      uri: '',
      uriCheck: '',
      points: '',
      rotate: '0deg',
    };
  }
  rightAction() {
    this.props.navigation.navigate('EditProfile');
  }
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      if (Preference.get('token')) {
        this.rotation();
        this.get();
      } else {
        Alert.alert(strings('activities_screen.alert'),strings('activities_screen.sign_in_first'), [
          {
            text: strings('add_property_screen.ok'),
          },
        ]);
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'WelcomeScreen'})],
          }),
        );
      }
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
  get() {
    this.setState({loading: true});
    Api.profile()
      .then(
        function (response) {
          //console.log('ProfileApiDataResponse: ', JSON.stringify(response));
          let imageBaseUrl =
            'https://doshag.net/admin/public' + response.data.image;
          this.setState({
            firstname: response.data.first_name,
            lastname: response.data.last_name,
            uri: imageBaseUrl,
            uriCheck: response.data.image,
            points: response.data.points,
            loading: false,
          });
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
  userLogout() {
    this.setState({loading: true});
    Api.Logout()
      .then(
        function (response) {
          let token = Preference.get('FCMToken');
          let lang = Preference.get('language');
          this.setState({loading: false});
          Preference.clear();
          Preference.set('FCMToken', token);
          Preference.set('language', lang);
          this.props.navigation.dispatch(WelcomeScreen);
          Alert.alert(strings('activities_screen.alert'),strings('profile_screen.logout_sucess'), [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
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
      <View style={styles.container}>
        <ScrollView>
          <Header
            rightIcon={require('../../../assets/images/filter.png')}
            headerRightText={strings('profile_screen.edit')}
            rightAction={this.rightAction.bind(this)}
            navigation={this.props.navigation}
          />
          <View
            style={{
              width: 98,
              height: 98,
              position: 'absolute',
              top: 130,
              alignSelf: 'center',
              // marginLeft: '32%',
              borderRadius: 48,
            }}>
            <Image
              source={
                !this.state.uriCheck
                  ? require('../../../assets/images/dp1.png')
                  : {uri: this.state.uri}
              }
              resizeMode={'cover'}
              style={{
                width: 98,
                height: 98,
                // position: 'absolute',
                // top: 130,
                // marginLeft: '32%',
                borderRadius: 48,
              }}
            />
          </View>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 60,
              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
              fontFamily: AppFonts.PoppinsRegular,
            }}>
            {this.state.firstname + ' ' + this.state.lastname}
          </Text>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                width: 170,
                flexDirection: 'row',
                marginTop: 10,
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  margin: 10,
                  marginEnd: 30,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  color: '#979191',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('profile_screen.points')}
              </Text>
              <Text
                style={{
                  margin: 10,
                  fontFamily: AppFonts.PoppinsMedium,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                }}>
                {this.state.points}
              </Text>
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: '#fbf4ed',
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.innerContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('MyProperty');
                }}
                style={{flexDirection: 'row', marginTop: 30}}>
                <Image
                  source={require('../../../assets/images/home-run.png')}
                  resizeMode={'contain'}
                  style={{width: 20, height: 20}}
                />
                <View style={{marginStart: 20}}>
                  <Text
                    style={{
                      marginBottom: 20,
                      color: '#979191',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('profile_screen.my_property')}
                  </Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 5,
                      transform: [{rotate: rotateBack}],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* <View
                style={{
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 2,
                }}
              /> */}

              {/* <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AppFeedback');
                }}
                style={{flexDirection: 'row', marginTop: 30}}>
                <Image
                  source={require('../../../assets/images/feedback.png')}
                  resizeMode={'contain'}
                  style={{width: 20, height: 20, bottom: 4}}
                />
                <View style={{marginStart: 20, bottom: 6}}>
                  <Text
                    style={{
                      marginBottom: 20,
                      color: '#979191',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('profile_screen.comments_and_feedback')}
                  </Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      transform: [{rotate: rotateBack}],
                    }}
                  />
                </View>
              </TouchableOpacity> */}
              <View
                style={{
                  borderBottomColor: color.graylightBorder,
                  borderBottomWidth: 2,
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Likes');
                }}
                style={{flexDirection: 'row', marginTop: 25}}>
                <Image
                  source={require('../../../assets/images/like.png')}
                  resizeMode={'contain'}
                  style={{width: 20, height: 20, bottom: 4}}
                />
                <View style={{marginStart: 20, bottom: 6}}>
                  <Text
                    style={{
                      color: '#979191',
                      marginTop: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('profile_screen.likes')}
                  </Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Image
                    source={require('../../../assets/images/forward.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 3,
                      transform: [{rotate: rotateBack}],
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomColor: color.graylightBorder,
                borderBottomWidth: 2,
              }}
            />
            <TouchableOpacity onPress={() => this.userLogout()}>
              <Text
                style={{
                  fontWeight: 'bold',
                  margin: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('profile_screen.logout')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
        {this.state.loading && <Loader />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: "#fbf4ed",
  },
  imgSty: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  innerContainer: {
    margin: 20,
    marginTop: 50,
  },
});
