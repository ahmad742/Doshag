import React, { Component, useRef } from 'react';
import {
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
  ImageBackground,
  Alert,
  TextInput
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Api from '../../../network/Api';
import Preference from 'react-native-preference';
import Loader from '../../../component/Loader/Loader';
import { } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings } from '../../../i18n';
import AppFonts from '../../../assets/fonts/index';
import { isIPhoneX } from '../../../utils/Dimensions';
import AppColor from '../../../component/AppColor';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { black } from 'react-native-paper/lib/typescript/styles/colors';
const WelcomeScreen = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'WelcomeScreen' })],
});
const lang = Preference.get('language');
const _today = moment().format(_format);
const _format = 'YYYY-MM-DD';
export default class Search extends Component {


  constructor(props) {
    // //console.log('Search file');
    super(props);
    this.state = {
      loading: false,
      saudi: false,
      showModal: false,
      jordain: true,
      bahrain: false,
      flag: 'jordain',
      countri: [],
      country: '',
      SearchList: [],
      openModel: false,
      rotate: '0deg',
      rotate2: '180deg',
      selectedDateCheckIn: [],
      selectedDateCheckOut: [],
      selectedpooldate: [],
      selectedDates: [],
      morningcheck: false,
      eveningcheck: false,
      selectedItem: '',
      homescreenmodal: '',
      selected: '',
      selectDate: moment().format("YYYY-MM-DD")
    };
  }

  componentDidMount() {
    this.setState({ homescreenmodal: true })
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      if (Preference.get('token')) {
        this.blockedUserCheck();
      } else {
        this.get();
        this.setCountries();
        Preference.get('country') == 'Jordan' ? Preference.set('currency', 'JOD') : Preference.get('country') === 'Saudi Arabia' ? Preference.set('currency', 'SAR') : Preference.set('currency', 'BHD')
      }
    });
  }
  blockedUserCheck() {
    this.setState({ loading: true });
    Api.blockedUser()
      .then(
        function (response) {
          // console.log("User--Bloacked--OR---NOT",response.status);
          if (response.status == 100) {
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
                  // Alert.alert(strings('profile_screen.logout_sucess'));
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
          } else {
            this.get();
            this.setCountries();
          }
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({ loading: false });
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  }
  get() {
    this.setState({ loading: true });
    Api.home()
      .then(
        function (response) {
          console.log('HomeApiData: ', JSON.stringify(response.data));
          let temparray = [];
          for (let i = 0; i < response.data.length - 1; i++) {
            temparray.push({
              image:
                'https://doshag.net/admin/public' +
                response.data[i].type_image,
              name: response.data[i].type,
            });
          }

          this.setState({ SearchList: temparray, loading: false });
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({ loading: false });
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  }
  setCountries = async () => {
    // //console.log('language', Preference.get('language'));
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
        icon: imageBaseUrl + countriesDetails[i].flag_image,
      });
    }
    this.setState({
      countri: country,
    });
  };
  onDayPress = (dateString) => {
    console.log("dateString ==>>", dateString);
    this.state.selectedDateCheckIn.length = 0;
    let markedDates = {};
    markedDates[dateString] = {
      selected: true,
      startingDay: true,
      endingDay: true,
      color: '#B20C11',
      textColor: "white",
    };
    this.setState({
      _markedDates: markedDates,
      selectedDateCheckIn: [dateString],
    });
  };
  onCheckoutDayPress = (dateString) => {
    this.state.selectedDateCheckOut.length = 0;
    let markedDates = {};
    let selected_dates = [];
    selected_dates.push(dateString);
    markedDates[dateString] = {
      selected: true,
      selected: true,
      startingDay: true,
      endingDay: true,
      color: '#B20C11',
      textColor: "white",
    };
    this.setState({
      _markedDates: markedDates,
      selectedDateCheckOut: [dateString],
    });
  };
  onPoolDayPress = (dateString) => {
    this.state.selectedpooldate.length = 0;
    let markedDates = {};
    let selected_dates = [];
    selected_dates.push(dateString);
    markedDates[dateString] = {
      selected: true,
      startingDay: true,
      endingDay: true,
      color: '#B20C11',
      textColor: "white",
    };
    this.setState({
      _markedDates: markedDates,
      selectedpooldate: [dateString],
    });
  };


  onDayPressNew = (day) => {
    this.setState({ selectDate: day.dateString });
  }
  renderItem(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          //           {
          // console.log("I am here")
          //         }
          this.props.navigation.navigate('CategoryAll', { item: item.name })
        }>
        <Image source={{ uri: item.image }} style={styles.imgContainer} />
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            justifyContent: 'center',

          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
              textAlign: 'center',
              fontFamily: AppFonts.PoppinsRegular,
            }}>
            {item.name == 'Chalets and pools'
              ? strings('add_property_screen.summer_house')
              : item.name == 'Camps'
                ? strings('add_property_screen.camps')
                : item.name == 'Hotels'
                  ? strings('add_property_screen.Hotels')
                  : null}
          </Text>
        </View>
      </TouchableOpacity >
    );
  }

  modalRenderItem(item) {
    return (
      <TouchableOpacity
        style={{
          width: "30%",
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
          height: 100,
          borderRadius: 10,
          borderWidth: this.state.selectedItem === item.name ? 3 : 1,
          borderColor: this.state.selectedItem === item.name ? AppColor.redHead : 'lightgrey',
          shadowColor: this.state.selectedItem === item.name ? AppColor.redHead : 'grey',
          shadowOpacity: 0.20,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 10,
          elevation: 3,

        }}
        onPress={() =>
          this.setState({ selectedItem: item.name })
        }>



        <ImageBackground source={{ uri: item.image }}
          style={{
            height: "100%",
            width: "100%",
            alignItems: 'center',
            justifyContent: 'center',

          }}
          resizeMode='cover'
          borderRadius={10}
        >

          <Text
            style={{
              color: 'white',
              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
              textAlign: 'center',
              fontFamily: AppFonts.PoppinsRegular,
              fontWeight: 'bold',
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 5,
            }}>
            {item.name == 'Chalets and pools'
              ? strings('add_property_screen.summer_house')
              : item.name == 'Camps'
                ? strings('add_property_screen.camps')
                : item.name == 'Hotels'
                  ? strings('add_property_screen.Hotels')
                  : null}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    )
  }

  render() {
    let rotateBack = this.state.rotate;
    let rotateBack2 = this.state.rotate2;
    const { selectDate } = this.state;
    return (
      <LinearGradient
        colors={['#fbf4ed', '#fbf4ed']}
        style={{
          flex: 1,
          // paddingLeft: 15,
          // paddingRight: 15,
          borderRadius: 5,
        }}>
        <SafeAreaView style={styles.container}>
          <View
            style={{
              width: '100%',
              height: 70,
              backgroundColor: '#fbf4ed',
              justifyContent: 'center',
              paddingLeft: 15,
              paddingRight: 15,
            }}>
            <View
              style={{
                flex: 1,
                width: '100%',
                // backgroundColor:'red',
                // marginTop:29,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ showModal: !this.state.showModal });
                  }}
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Image
                    style={{
                      // marginTop: 5,
                      marginRight: 5,
                      width: 15,
                      height: 20,
                      resizeMode: 'contain',
                      // backgroundColor:'red'
                    }}
                    source={require('../../../assets/images/drop_down.png')}
                  />
                  <Image
                    style={{ width: 35, height: 20 }}
                    source={
                      Preference.get('country') == 'Saudi Arabia'
                        ? require('../../../assets/images/Flag_of_Saudi_Arabia.png')
                        : Preference.get('country') == 'Jordan'
                          ? require('../../../assets/images/Flag_of_Jordan.png')
                          : require('../../../assets/images/Flag_of_Bahrain.png')
                    }
                  />
                </TouchableOpacity>
                {this.state.showModal && (
                  <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => {
                      this.setModalVisible(!this.state.showModal);
                    }}>
                    <TouchableOpacity
                      style={{ height: '100%', width: '100%' }}
                      onPress={() => {
                        this.setState({ showModal: false });
                      }}>
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          left: 15,
                          top: Platform.OS === 'ios' ? 80 : 50,
                        }}>
                        <FlatList
                          style={{
                            elevation: 10,
                          }}
                          data={this.state.countri}
                          renderItem={({ item, index }) => {
                            return (
                              <View
                                style={{
                                  width: '25%',
                                  backgroundColor: '#FFFAFA',
                                  padding: 10,
                                  alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    {
                                      item.value === 'Jordan' ? Preference.set('currency', 'JOD') : item.value === 'Saudi Arabia' ? Preference.set('currency', 'SAR') : Preference.set('currency', 'BHD')
                                      console.log("itemSelected: ", JSON.stringify(item))
                                      Preference.set('country', item.value);
                                    }
                                    this.setState({
                                      country: item.value,
                                      showModal: false,
                                    });
                                  }}>
                                  {/* <Text>{item.label}</Text> */}
                                  {/* {item.icon} */}
                                  <Image
                                    source={{ uri: item.icon }}
                                    style={{ width: 35, height: 20 }}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                )}
              </View>
              <View
                style={{
                  marginTop: 10,
                  marginRight: 20,
                  resizeMode: 'contain',
                  width: "50%",
                  height: 54,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 20
                }}>
                <Image
                  // style={{resizeMode: 'contain', width: '100%'}}
                  style={{
                    resizeMode: 'contain',
                    resizeMode: 'contain',
                    width: 100,
                    height: 54,
                  }}
                  source={require('../../../assets/images/doshag_logo.png')}

                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ homescreenmodal: true })
                }}
              >

                <Image
                  style={{
                    // marginTop: 28,
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                  source={require('../../../assets/images/search.png')}
                />
              </TouchableOpacity>
              {this.state.homescreenmodal == true ?
                <Modal
                  animationType="none"
                  transparent={true}
                  visible={this.state.homescreenmodal}
                  onRequestClose={() => {
                    this.setModalVisible(!this.state.homescreenmodal);
                  }}>
                  <View style={{
                    width: '90%',
                    height: '70%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor: AppColor.DarkGray,
                    marginTop: "35%",
                    padding: 20,
                    opacity: 0.9
                  }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ homescreenmodal: false })
                        this.setState({ selectedItem: null })
                      }}
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                      }}
                    >

                      <Image
                        style={{
                          // marginTop: 28,
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                          tintColor: 'white'
                        }}
                        source={require('../../../assets/images/close.png')}
                      />
                    </TouchableOpacity>
                    <FlatList
                      numColumns={3}
                      style={{ width: '100%', alignSelf: 'center', marginTop: 20 }}
                      data={this.state.SearchList}
                      renderItem={({ item, index }) => this.modalRenderItem(item)}
                      extraData={this.state}
                      keyExtractor={(item) => item.id}
                    />
                    {
                      this.state.selectedItem == 'Chalets and pools' ?
                        <View style={{
                          width: "100%",
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                          height: '10%',
                          // marginTop: "50%",
                        }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ morningcheck: true })
                              this.setState({ eveningcheck: false })
                            }}
                            style={{
                              width: "45%",
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: 'grey',
                              backgroundColor: this.state.morningcheck == true ? AppColor.redHead : 'white',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: 15
                            }}>
                              <View style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: 'white',
                              }}>

                              </View>
                            </View>
                            <Text style={{
                              color: 'black',
                              fontSize: 16,
                            }}>
                              {lang == 'en'
                                ? strings('add_property_screen.morning')
                                : lang == 'ar'
                                  ? strings('add_property_screen.morning')

                                  : null}
                            </Text>

                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ eveningcheck: true })
                              this.setState({ morningcheck: false })
                            }}
                            style={{
                              width: "45%",
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: 'grey',
                              backgroundColor: this.state.eveningcheck == true ? AppColor.redHead : 'white',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: 15
                            }}>
                              <View style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: 'white',

                              }}>

                              </View>
                            </View>
                            <Text style={{
                              color: 'black',
                              fontSize: 16,
                              // marginLeft: 10
                            }}>
                              {lang == 'en'
                                ? strings('add_property_screen.evening')
                                : lang == 'ar'
                                  ? strings('add_property_screen.evening')

                                  : null}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    {
                      this.state.selectedItem == 'Hotels' ?
                        <View style={{
                          width: "90%",
                          alignSelf: 'center',
                          height: 70,
                          borderRadius: 10,
                          marginTop: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          // marginTop: '20%'

                        }}>
                          <TouchableOpacity
                            onPress={() => this.refinRBSheet.open()}
                            style={{
                              width: "48%",
                              justifyContent: 'center',
                              height: 50,
                              borderRadius: 10,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              borderColor: 'lightgrey',
                              shadowColor: 'grey',
                              shadowOpacity: 0.26,
                              shadowOffset: { width: 0, height: 2 },
                              shadowRadius: 10,
                              elevation: 3,
                            }}
                          // onPress={() => {
                          //     setTab(2)
                          //     setIsPhoneContacts(true)
                          // }}
                          >
                            <Text style={{
                              color: 'black',
                              textAlign: 'center',
                            }}>
                              {/* {'HOTEL & APARTMENT'} */}
                              {lang == 'en'
                                ? strings('add_property_screen.check_in')
                                : lang == 'ar'
                                  ? strings('add_property_screen.check_in')

                                  : null}
                            </Text>
                            <Text style={{ color: 'black', textAlign: 'center', fontSize: 12 }}>
                              {this.state.selectedDateCheckIn.length > 0
                                ? this.state.selectedDateCheckIn.toString()
                                : lang == 'en' ?
                                  strings('add_property_screen.select_check_in_date') :
                                  lang == 'ar' ?
                                    strings('add_property_screen.select_check_in_date') :
                                    null
                              }
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => this.RBSheet.open()}
                            style={{
                              width: "48%",
                              backgroundColor: 'lightgrey',
                              justifyContent: 'center',
                              height: 50,
                              borderRadius: 10,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              borderColor: 'lightgrey',
                              shadowColor: 'grey',
                              shadowOpacity: 0.26,
                              shadowOffset: { width: 0, height: 2 },
                              shadowRadius: 10,
                              elevation: 3,
                            }}
                          >
                            <Text
                              style={{
                                color: 'black',
                                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                textAlign: 'center',
                                fontFamily: AppFonts.PoppinsRegular,
                              }}>
                              {lang == 'en'
                                ? strings('add_property_screen.check_out')
                                : lang == 'ar'
                                  ? strings('add_property_screen.check_out')

                                  : null}
                            </Text>
                            <Text style={{ color: 'black', textAlign: 'center', fontSize: 12 }}>
                              {this.state.selectedDateCheckOut.length > 0
                                ? this.state.selectedDateCheckOut.toString()
                                :
                                lang == 'en' ?
                                  strings('add_property_screen.select_check_out_date') :
                                  lang == 'ar' ?
                                    strings('add_property_screen.select_check_out_date') :
                                    null
                              }
                            </Text>
                          </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    {
                      this.state.selectedItem == 'Camps' || this.state.selectedItem == 'Chalets and pools' ?
                        <TouchableOpacity
                          onPress={() => this.refpoolRBSheet.open()}
                          style={{
                            width: "90%",
                            alignSelf: 'center',
                            backgroundColor: 'lightgrey',
                            justifyContent: 'center',
                            height: 50,
                            borderRadius: 10,
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'lightgrey',
                            shadowColor: 'grey',
                            shadowOpacity: 0.26,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 10,
                            elevation: 3,
                            // marginTop: this.state.selectedItem == 'Camps' ? '70%' : 10
                          }}>
                          <Text style={{
                            color: 'black',
                            textAlign: 'center',
                          }}>
                            {this.state.selectedpooldate.length > 0
                              ? this.state.selectedpooldate.toString()
                              : lang == 'en'
                                ? strings('add_property_screen.camps_kashta_date')
                                : lang == 'ar'
                                  ? strings('add_property_screen.camps_kashta_date')

                                  : null}
                          </Text>
                        </TouchableOpacity>
                        :
                        null}
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                      <TouchableOpacity
                        onPress={() => {
                          if (this.state.selectedItem) {
                            if (this.state.selectedItem == 'Chalets and pools') {
                              if (((this.state.morningcheck || this.state.eveningcheck) && this.state.selectedpooldate != '')) {
                                this.props.navigation.navigate('CategoryAll', { item: this.state.selectedItem })
                                this.setState({ selectedItem: null })
                                this.setState({ homescreenmodal: false })
                              }
                              else {
                                alert("Please select time")
                              }
                            }
                            if (this.state.selectedItem == 'Camps') {
                              if (this.state.selectedpooldate != '') {
                                this.props.navigation.navigate('CategoryAll', { item: this.state.selectedItem })
                                this.setState({ selectedItem: null })
                                this.setState({ homescreenmodal: false })
                              }
                              else {
                                alert("Please select Date for camps & kashta")
                              }
                            }
                            if (this.state.selectedItem == 'Hotels') {
                              if ((this.state.selectedDateCheckIn && this.state.selectedDateCheckOut) == '') {
                                alert("Please select CheckIn & CheckOut Date")
                              }
                              else {
                                this.props.navigation.navigate('CategoryAll', { item: this.state.selectedItem })
                                this.setState({ selectedItem: null })
                                this.setState({ homescreenmodal: false })
                              }
                            }
                          }
                          else {
                            alert("Please select a venue")
                          }
                        }}
                        style={{
                          marginTop: 20,
                          width: "90%",
                          height: 50,
                          borderRadius: 50,
                          borderWidth: 1,
                          borderColor: AppColor.redHead,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: AppColor.redHead,
                          alignSelf: 'center',
                          flexDirection: "row"
                        }}
                      // onPress={() => {
                      //   this.props.navigation.navigate('Add');
                      // }}
                      >
                        <Image style={{
                          width: 20,
                          height: 20,
                          marginRight: 10
                        }} source={require('../../../assets/images/searchGray.png')} />
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                            textAlign: 'center',
                            fontFamily: AppFonts.PoppinsRegular,
                          }}>
                          {lang == 'en'
                            ? strings('add_property_screen.Search Hotels')
                            : lang == 'ar'
                              ? strings('add_property_screen.Search Hotels')

                              : null}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <RBSheet
                      ref={(ref) => {
                        this.refinRBSheet = ref;
                      }}
                      height={450}
                      openDuration={250}
                      customStyles={{
                        container: {
                          // justifyContent: "center",
                          // alignItems: "center",
                          borderTopLeftRadius: 15,
                          borderTopRightRadius: 15,
                        },
                      }}>
                      <View style={{ marginTop: 20 }}>
                        { /*   calendar for hotel check in    */}
                        <Calendar
                          type="gregorian"
                          minDate={_today}
                          onDayPress={({ dateString }) => {
                            console.log(
                              'calendar for hotel check in',

                              dateString,
                              moment(dateString).format('dddd'),
                            );
                            this.onDayPress(dateString);
                          }}
                          disableMonthChange={true}
                          onMonthChange={(month) => { }}
                         
                          hideExtraDays={false}
                          markedDates={this.state._markedDates}
                          markingType={"period"}
                          firstDay={1}
                          disableAllTouchEventsForDisabledDays={true}
                          enableSwipeMonths={true}
                          theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#00000020',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: 'black',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: 'black',
                            indicatorColor: 'blue',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 14,
                          }}
                        />



                        <TouchableOpacity
                          onPress={() => {
                            this.refinRBSheet.close();
                            // this.state.selectedDates.length > 0 
                            // this.filtered_property(this.state.selectedDates[0])
                          }}
                          style={{
                            backgroundColor: '#B20C11',
                            borderRadius: 10,
                            height: 45,
                            width: '45%',
                            marginTop: 10,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                            }}>
                            {strings('payment_screen.select_date')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </RBSheet>
                    <RBSheet
                      ref={ref => {
                        this.RBSheet = ref;
                      }}
                      // ref={(ref) => {
                      //   this.RBSheet = ref;
                      // }}
                      height={450}
                      openDuration={250}
                      customStyles={{
                        container: {
                          // justifyContent: "center",
                          // alignItems: "center",
                          borderTopLeftRadius: 15,
                          borderTopRightRadius: 15,
                        },
                      }}>
                      <View style={{ marginTop: 20 }}>
                        {/* calendar for hotel check out */}
                      <Calendar
                          type="gregorian"
                          minDate={_today}
                          onDayPress={({ dateString }) => {
                            console.log(
                              'calendar for hotel check in',

                              dateString,
                              moment(dateString).format('dddd'),
                            );
                            this.onCheckoutDayPress(dateString);
                          }}
                          disableMonthChange={true}
                          onMonthChange={(month) => { }}
                         
                          hideExtraDays={false}
                          markedDates={this.state._markedDates}
                          markingType={"period"}
                          firstDay={1}
                          disableAllTouchEventsForDisabledDays={true}
                          enableSwipeMonths={true}
                          theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#00000020',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: 'black',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: 'black',
                            indicatorColor: 'blue',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 14,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            this.RBSheet.close();
                            // this.state.selectedDates.length > 0 
                            // this.filtered_property(this.state.selectedDates[0])
                          }}
                          style={{
                            backgroundColor: '#B20C11',
                            borderRadius: 10,
                            height: 45,
                            width: '45%',
                            marginTop: 10,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                            }}>
                            {strings('payment_screen.select_date')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </RBSheet>
                    <RBSheet
                      ref={ref => {
                        this.refpoolRBSheet = ref;
                      }}
                      // ref={(ref) => {
                      //   this.RBSheet = ref;
                      // }}
                      height={450}
                      openDuration={250}
                      customStyles={{
                        container: {
                          // justifyContent: "center",
                          // alignItems: "center",
                          borderTopLeftRadius: 15,
                          borderTopRightRadius: 15,
                        },
                      }}>
                      <View style={{ marginTop: 20 }}>
                        {/* //  calendar for poos and kashta  */}

                        <Calendar
                          type="gregorian"
                          minDate={_today}
                          onDayPress={({ dateString }) => {
                            console.log(
                              ' calendar for poos and kashta',

                              dateString,
                              moment(dateString).format('dddd'),
                            );
                            this.onPoolDayPress(dateString);
                          }}
                          disableMonthChange={true}
                          onMonthChange={(month) => { }}
                         
                          hideExtraDays={false}
                          markedDates={this.state._markedDates}
                          markingType={"period"}
                          firstDay={1}
                          disableAllTouchEventsForDisabledDays={true}
                          enableSwipeMonths={true}
                          theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#00000020',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: 'black',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: 'black',
                            indicatorColor: 'blue',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 14,
                          }}
                        />


                        <TouchableOpacity
                          onPress={() => {
                            this.refpoolRBSheet.close();
                            // this.state.selectedDates.length > 0 
                            // this.filtered_property(this.state.selectedDates[0])
                          }}
                          style={{
                            backgroundColor: '#B20C11',
                            borderRadius: 10,
                            height: 45,
                            width: '45%',
                            marginTop: 10,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                            }}>
                            {strings('payment_screen.select_date')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </RBSheet>
                  </View>
                </Modal>
                :
                null}
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('NotificationScreen')
                }}
              >

                <Image
                  style={{
                    // marginTop: 28,
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                  source={require('../../../assets/images/NotificationRed.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={{ flex: 1 }}> */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.mainListContainer}>
              <FlatList
                style={{ width: '100%', alignSelf: 'center' }}
                data={this.state.SearchList}
                renderItem={({ item, index }) => this.renderItem(item)}
                extraData={this.state}
                keyExtractor={(item) => item.id}
              />
            </View>
          </ScrollView>

          {/* <TouchableOpacity style={styles.btnImg}>
                        <Text style={styles.btnText}>{'SAVE'}</Text>
                    </TouchableOpacity> */}

          {/* </View> */}
        </SafeAreaView>
        {this.state.loading && <Loader />}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    paddingVertical: Platform.OS == 'ios' && isIPhoneX() ? 30 : 5,
  },
  mainListContainer: {
    width: '95%',
    alignSelf: "center",
    // marginLeft: 10,
    // marginTop: '20%'
  },
  imgContainer: {
    marginTop: 15,
    width: '100%',
    height: 200,
    resizeMode: 'stretch',
    opacity: 0.72,
    borderRadius: 15
  },
});
