import React, {Component, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Alert,
  FlatList,
} from 'react-native';
import {constants} from '../../../config/constants';
const API_REGISTRATION = 'registration';
import color from '../../../component/AppColor';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NavigationActions, StackActions} from 'react-navigation';
import Api from '../../../network/Api';
import Preference from 'react-native-preference';
import Loader from '../../../component/Loader/Loader';
import {strings} from '../../../i18n';
import countries from '../../../assets/phone-countries/countries-emoji.json';
import nodeEmoji from 'node-emoji';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppFonts from '../../../assets/fonts/index';
import BottomSheet from 'reanimated-bottom-sheet';
import {isIPhoneX} from '../../../utils/Dimensions';

const lang = Preference.get('language');

let listOfContries = Object.values(countries);
let day = [];
for (let i = 1; i <= 31; i++) {
  day.push({label: i, value: i});
}
let month = [];
for (let i = 1; i <= 12; i++) {
  month.push({label: i, value: i});
}
let today = new Date();
let CurrrentYear = parseInt(today.getFullYear());

let year = [];
for (let i = CurrrentYear; i <= 2050; i++) {
  year.push({label: i, value: i});
}
const CorrectCode = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'CorrectCode'})],
});

// const sheetRef = React.useRef(null);

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotate: '0deg',
      loading: false,
      selectedStartDate: null,
      dateTimePickerVisible: false,
      dateOrTimeValue: new Date(),
      hidePassword1: true,
      hidePassword2: true,
      first_Name: '',
      last_Name: '',
      email_Address: '',
      mobile_Number: '',
      dob: '',
      password: '',
      password_re_enter: '',
      country2: 'Bahrain',
      openCountryModal:false,
      countri: [],
      countries: false,
      flag: 'flag-af',
      countryCode: '+93',
      searchText: '',
      listOfItems: listOfContries.length > 0 ? listOfContries : [],
      finalItems: listOfContries.length > 0 ? listOfContries : [],
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  setPasswordVisibility = () => {
    this.setState({hidePassword1: !this.state.hidePassword1});
  };
  setPasswordVisibilityReEnter = () => {
    this.setState({hidePassword2: !this.state.hidePassword2});
  };
  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      this.rotation();
      this.setCountries();
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
  inputcheck() {
    if (this.state.first_Name === '') {
      alert(strings('register_screen.enter_first_name'));
    } else if (this.state.last_Name === '') {
      alert(strings('register_screen.enter_last_name'));
    } else if (this.state.email_Address === '') {
      alert(strings('register_screen.email_required'));
    } else if (
      /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(
        this.state.email_Address.trim(),
      ) == false
    ) {
      alert(strings('register_screen.email_format_invalid'));
    } else if (this.state.mobile_Number === '') {
      alert(strings('register_screen.enter_mob_no'));
    } else if (this.state.mobile_Number.length < 7) {
      alert(strings('register_screen.mob_no_sort'));
    } else if (this.state.country2 === '') {
      alert(strings('register_screen.enter_country'));
    } else if (this.state.password === '') {
      alert(strings('register_screen.enter_pass'));
    } else if (this.state.password_re_enter === '') {
      alert(strings('register_screen.re_enter_pass'));
    } else if (this.state.password != this.state.password_re_enter) {
      alert(strings('register_screen.pass_not_same'));
    } else if (this.state.password.length < 6) {
      alert(strings('register_screen.pass_short'));
    } else {
      this.userRegister();
    }
  }
  userRegister() {
    this.setState({loading: true});
    let body = new FormData();
    body.append('first_name', this.state.first_Name);
    body.append('last_name', this.state.last_Name);
    body.append('email', this.state.email_Address);
    body.append('phone_no', this.state.countryCode + this.state.mobile_Number);
    body.append('dob', "12-09-1934");
    body.append('country', this.state.country2);
    body.append('password', this.state.password);
    // const body = {
    //   first_name: this.state.first_Name,
    //   last_name: this.state.last_Name,
    //   email: this.state.email_Address,
    //   phone_no: this.state.countryCode + this.state.mobile_Number,
    //   dob: this.state.dateOrTimeValue,
    //   country: this.state.country2,
    //   password: this.state.password,
    // };
    console.log('BodyData', body);
    fetch(constants.ApiBaseURL + API_REGISTRATION, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        //'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.status != 200) {
          console.log('BodAPI_REGISTRATIONyResponse', JSON.stringify(response));
          this.setState({loading: false});
          Alert.alert(
            strings('activities_screen.alert'),
            JSON.stringify(response.message),
            [
              {
                text: strings('add_property_screen.ok'),
              },
            ],
          );
          //return false;
        } else {
          Preference.set(
            'phon_no',
            this.state.countryCode + this.state.mobile_Number,
            'userLogin',
            true,
            // 'userId', response.data.id,
          );
          this.setState({loading: false});
          this.props.navigation.navigate('CorrectCode');
          // Alert.alert('Registration Complete!');
        }
      })
      .catch((error) => {
        this.setState({loading: false});
        console.log('ApiError:', error);
        //SimpleToast.show(Label.WentWrong);
      });

    // Api.register(JSON.stringify(body))
    //   .then(
    //     function (response) {
    //       //console.log('RegisterAPIResponse: ', JSON.stringify(response));
    //       if (response.status != 200) {
    //         this.setState({loading: false});
    //         Alert.alert(
    //           strings('activities_screen.alert'),
    //           JSON.stringify(response.message),
    //           [
    //             {
    //               text: strings('add_property_screen.ok'),
    //             },
    //           ],
    //         );
    //         //return false;
    //       } else {
    //         Preference.set(
    //           'phon_no',
    //           this.state.countryCode + this.state.mobile_Number,
    //           'userLogin',
    //           true,
    //           // 'userId', response.data.id,
    //         );
    //         this.setState({loading: false});
    //         this.props.navigation.navigate('CorrectCode');
    //         // Alert.alert('Registration Complete!');
    //       }
    //     }.bind(this),
    //   )
    //   .catch(
    //     function (error) {
    //       console.log('ErrorInApi:', JSON.stringify(error));
    //       console.log('ErrorInApi:', JSON.stringify(error.message));
    //       this.setState({loading: false});
    //       Alert.alert('Error', 'Check your internet!', [
    //         {
    //           text: strings('add_property_screen.ok'),
    //         },
    //       ]);
    //     }.bind(this),
    //   );
  }
  setCountries = async () => {
    let countriesDetails = undefined;
    try {
      countriesDetails = JSON.parse(await AsyncStorage.getItem('countries'));
    } catch (error) {
      //console.log('AllCountries Error', JSON.stringify(error));
    }
    let country = [];
    let imageBaseUrl = 'https://doshag.net/admin/public';
    for (let i = 0; i < countriesDetails.length; i++) {
      let lang =
        Preference.get('language') == 'en'
          ? countriesDetails[i].name
          : countriesDetails[i].arabic_name;
      country.push({
        label: lang,
        value: countriesDetails[i].name,
        icon: () => (
          <Image
            source={{uri: imageBaseUrl + countriesDetails[i].flag_image}}
            style={{width: 35, height: 30}}
            resizeMode={'contain'}
          />
        ),
      });
    }
    this.setState({
      countri: country,
    });
  };

  renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 450,
      }}>
      <Text>Swipe down to close</Text>
    </View>
  );
  render() {
    const {selectedStartDate} = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    let rotateBack = this.state.rotate;
    return (
      <LinearGradient
        colors={['#fbf4ed', '#fbf4ed']}
        style={{
          // width: '100%',
          // height: '100%',
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 5,
          paddingVertical: Platform.OS == 'ios' && isIPhoneX() ? 30 : 0,
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          // keyboardVerticalOffset={Platform.OS === 'ios' ? 54 : 0}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.innerContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 50,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  style={{
                    padding: 5,
                  }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      transform: [{rotate: rotateBack}],
                    }}
                    source={require('../../../assets/images/back-red.png')}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    textAlign: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 22,
                    fontFamily: AppFonts.PoppinsMedium,
                  }}>
                  {strings('register_screen.create_acc')}
                </Text>
                <View />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 15,
                  color: color.DarkGray,
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('register_screen.fill_the_details')}
              </Text>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'black',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('register_screen.first_name')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  onChangeText={(text) => this.setState({first_Name: text})}
                  textContentType="givenName"
                  style={{
                    height: 50,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'black',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('register_screen.last_name')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  onChangeText={(text) => this.setState({last_Name: text})}
                  textContentType="familyName"
                  style={{
                    height: 50,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'black',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('register_screen.email_address')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  onChangeText={(text) => this.setState({email_Address: text})}
                  textContentType="emailAddress"
                  style={{
                    height: 50,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'black',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('register_screen.mobile_number')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
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
                    borderColor: '#999999',
                    borderRadius: 5,
                    borderWidth: 0.5,
                    marginTop: 15,
                    // marginLeft: 10,
                  }}>
                  <Text>{nodeEmoji.get(this.state.flag)}</Text>
                  <Text>{this.state.countryCode}</Text>
                </TouchableOpacity>
                <TextInput
                  placeholder="XXXXXXXX"
                  onChangeText={(text) => this.setState({mobile_Number: text})}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  style={{
                    height: 50,
                    width: '77%',
                    backgroundColor: 'white',
                    borderColor: '#999999',
                    borderRadius: 5,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    marginTop: 15,
                    paddingLeft: 10,
                    marginLeft: 5,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
              </View>

              {/* <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'black',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('register_screen.dob')}
              </Text>

              <TouchableOpacity
                onPress={() => this.setState({dateTimePickerVisible: true})}
                style={{
                  marginTop: 10,
                  width: '100%',
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <Text>
                  {!!this.state.dateOrTimeValue &&
                    this.state.dateOrTimeValue.toLocaleDateString()}
                </Text>
              </TouchableOpacity> */}
              {this.state.dateTimePickerVisible && Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={{width: '100%'}}
                  onPress={() => this.setState({dateTimePickerVisible: false})}>
                  <Text
                    style={{
                      alignSelf: 'flex-end',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      fontSize: 16,
                      marginTop: 10,
                    }}>
                    {strings('add_property_screen.close')}
                  </Text>
                </TouchableOpacity>
              )}
              {this.state.dateTimePickerVisible && (
                <DateTimePicker
                  maximumDate={new Date()}
                  mode="date"
                  display="spinner"
                  value={this.state.dateOrTimeValue}
                  onChange={(event, value) => {
                    if (value !== undefined) {
                      this.setState({
                        dateOrTimeValue: value,
                        dateTimePickerVisible:
                          Platform.OS === 'ios' ? true : false,
                      });
                    }
                    if (event.type === 'set') console.log('value:', value);
                  }}
                />
              )}
              <Text
                style={{
                  marginLeft: 5,
                  marginBottom: 15,
                  marginTop: 20,
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('register_screen.select_country')}
              </Text>

              {/* <TouchableOpacity
                onPress={() => this.sheetRef.snapTo(0)}
                style={{
                  height: 50,
                  width: '100%',
                  marginBottom: 10,
                  backgroundColor: 'white',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                }}>

                </TouchableOpacity>
              <BottomSheet
        ref={ref=>this.sheetRef=ref}
        snapPoints={[450, 300, 0]}
        borderRadius={10}
        renderContent={this.renderContent}
      /> */}
      
      
              <DropDownPicker
                items={this.state.countri.sort(function (a, b) {
                  return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                })}
                onPress={()=>this.setState({openCountryModal:true})}
                open={this.state.openCountryModal}
                containerStyle={{
                  height: 50,
                  width: '100%',
                  marginBottom: 10,
                }}
                style={{
                 // backgroundColor: 'red',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                }}
                onClose={()=>this.setState({openCountryModal:false})}
                dropDownStyle={{backgroundColor: 'white'}}
                // setItems={(item) => {
                // console.log('jbjjjbjbbjbjbjbjbj');
                //   // Preference.set('country', item.value);
                //   this.setState({
                //     country2: item.value,
                //   });
                // }}
                onSelectItem={(item) => {
                  Preference.set('country', item.value);
                  this.setState({
                    country2: item.value,
                  });
                }}
                value={this.state.country2}
                placeholder={lang == 'en' ? 'Bahrain' : 'البحرين'}
                placeholderStyle={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                  color: '#979191',
                }}
                selectedLabelStyle={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                  color: 'black',
                }}

                showArrow={false}
              />

              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'black',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('register_screen.enter_pass')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  onChangeText={(text) => this.setState({password: text})}
                  secureTextEntry={this.state.hidePassword1}
                  textContentType="password"
                  style={{
                    width: '88%',
                    height: 50,
                    paddingLeft: 5,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
                <TouchableOpacity
                  TouchableOpacity={0.8}
                  onPress={this.setPasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: 10,
                  }}>
                  <Image
                    source={
                      this.state.hidePassword1
                        ? require('../../../assets/images/eye.png')
                        : require('../../../assets/images/eye.png')
                    }
                    resizeMode={'contain'}
                    style={{width: 20, height: 20, marginTop: 3}}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'black',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('register_screen.re_enter_pass')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  onChangeText={(text) =>
                    this.setState({password_re_enter: text})
                  }
                  secureTextEntry={this.state.hidePassword2}
                  textContentType="password"
                  style={{
                    width: '88%',
                    height: 50,
                    paddingLeft: 5,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
                <TouchableOpacity
                  TouchableOpacity={0.8}
                  onPress={this.setPasswordVisibilityReEnter}
                  style={{
                    position: 'absolute',
                    right: 10,
                  }}>
                  <Image
                    source={
                      this.state.hidePassword2
                        ? require('../../../assets/images/eye.png')
                        : require('../../../assets/images/eye.png')
                    }
                    resizeMode={'contain'}
                    style={{width: 20, height: 20, marginTop: 3}}
                  />
                </TouchableOpacity>
              </View>
              <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.inputcheck()}
                  style={{
                    marginTop: 20,
                    width: 180,
                    height: 50,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: color.redHead,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: color.redHead,
                  }}>
                  <Text
                    style={{
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      fontSize: 14,
                      color: 'white',
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('register_screen.sign_up')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {this.state.loading && <Loader />}
        {this.state.countries && (
          <View style={{width: '100%', height: '100%'}}>
            <View
              style={{
                justifyContent: 'center',
                borderColor: '#999999',
                borderRadius: 5,
                borderWidth: 0.5,
                marginTop: 10,
                backgroundColor: 'white',
              }}>
              <TextInput
                onChangeText={(text) => {
                  let filteredListOfItemsTemp = this.state.listOfItems;
                  if (text !== '') {
                    filteredListOfItemsTemp = filteredListOfItemsTemp.filter(
                      (item) => {
                        return (
                          item.name.common
                            .toLowerCase()
                            .indexOf((text + '').toLowerCase()) >= 0
                        );
                      },
                    );
                  }
                  this.setState({
                    searchText: text,
                    finalItems: filteredListOfItemsTemp,
                  });
                }}
                textContentType="countryName"
                value={this.state.searchText}
                style={{
                  height: 50,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}
              />
            </View>
            <FlatList
              data={this.state.finalItems}
              keyExtractor={(item) => item.flag}
              listKey={moment().format('x').toString()}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{marginVertical: 20}}
              extraData={this.state.finalItems}
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
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 22,
                      }}>
                      {nodeEmoji.get(item.flag)}
                    </Text>
                    <View style={{flex: 1, marginHorizontal: 5}}>
                      <Text
                        style={{
                          color: 'black',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                          fontSize: 22,
                        }}>
                        {item.name.common}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: 'black',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 22,
                      }}>
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  imgSty: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  innerContainer: {
    margin: 5,
  },
});
