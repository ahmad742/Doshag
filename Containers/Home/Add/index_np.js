import React, { Component } from 'react';
import {
  View,
  Image,
  Modal,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  Button,
  Dimensions,

} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../component/TopHeader/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import Api from '../../../network/Api';
import Preference from 'react-native-preference';
import Loader from '../../../component/Loader/Loader';
import { constants } from '../../../config/constants';
import { strings } from '../../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AppFonts from '../../../assets/fonts';
import { WebView } from 'react-native-webview';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Select } from 'native-base'

const { width, height } = Dimensions.get('window');
const lang = Preference.get('language');

export default class Add extends Component {
  constructor(props) {
    super(props);
    const now = new Date();
    // const Item = props?.navigation?.getParam("Item")
    // console.log("item ==+++=>>>", Item);
    this.myDropdown1 = null;
    this.myDropdown2 = null;
    this.myDropdown3 = null;
    this.myDropdown4 = null;
    this.myDropdown5 = null;
    this.state = {
      show: false,
      toggleCheckBox: false,
      toggleCheckBox2: false,
      toggleCheckBox3: false,
      toggleCheckBox4: false,
      toggleCheckBox5: false,
      first: 0,
      second: 0,
      isVisible: false,
      priceModal: false,
      count: 0,
      OkClick: false,
      resourcePath: {},
      reservations: 0,
      broadcasting: false,
      showPopup: false,
      selectDate: false,
      multipleShifts: false,
      isChecked: false,
      rangeLow: now,
      rangeHigh: now,
      min: now,
      imageArray: [],
      list: [],
      max: new Date(now.getTime() + 1000 * 60 * 60 * 24),
      startTimeShow: false,
      morningShiftStartTimeShow: false,
      eveningShiftStartTimeShow: false,
      startTimeTextShow: false,
      morningShiftStartTimeTextShow: false,
      eveningShiftStartTimeTextShow: false,
      endTimeShow: false,
      morningShiftEndTimeShow: false,
      eveningShiftEndTimeShow: false,
      endTimeTextShow: false,
      morningShiftEndTimeTextShow: false,
      eveningShiftEndTimeTextShow: false,
      startTime: new Date(),
      startTimeCheck: false,
      morningShiftStartTime: new Date(),
      morningShiftStartTimeCheck: false,
      eveningShiftStartTime: new Date(),
      eveningShiftStartTimeCheck: false,
      endTime: new Date(),
      endTimeCheck: false,
      morningShiftEndTime: new Date(),
      morningShiftEndTimeCheck: false,
      eveningShiftEndTime: new Date(),
      eveningShiftEndTimeCheck: false,
      loading: false,
      name_In_English: '',
      name_In_Arabic: '',
      countries: '',
      arabicCountry: '',
      cities: '',
      property_Type: '',
      // specific_Type: '',
      description: '',
      inputNumber: '',
      inputNumber2: '',
      inputNumber3: '',
      inputNumber4: '',
      inputNumber5: '',
      inputNumber6: '',
      inputNumber7: '',
      astbeltProgress: 0,
      error: '',
      region: null,
      isMapReady: false,
      marginTop: 1,
      userLocation: '',
      location: 'Search',
      regionChangeProgress: false,
      countri: [],
      ImagesList: [],
      address: '',
      longitude: null,
      latittude: null,
      listAmanties: [],
      citiesDropdownJordan: [],
      citiesDropdownSaudi: [],
      citiesDropdownBahrain: [],
      selectedCities: [],
      termsAndConditions: false,
      webViewDisplay: false,


      propertyTypePickerOpen: false,
      cityPickerOpen: false,
      countryPickerOpen: false,
      reservationPickerOpen: false
    };
  }

  componentDidMount() {

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      if (Preference.get('token')) {
        this.setCountries();
        this.getAmanaties();
        this.resetMyDropdown();
      } else {
        Alert.alert(
          strings('activities_screen.alert'),
          strings('activities_screen.sign_in_first', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]),
        );
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'WelcomeScreen' })],
          }),
        );
      }
    });
  }
  resetMyDropdown() {
    if (this.myDropdown1) {
      // console.log("I am In this.myDropdown",this.myDropdown.state)
      this.myDropdown1.state.choice.icon = null;
      this.myDropdown1.state.choice.label = null;
      this.myDropdown1.state.choice.value = null;
    }
    if (this.myDropdown2) {
      this.myDropdown2.state.choice.icon = null;
      this.myDropdown2.state.choice.label = null;
      this.myDropdown2.state.choice.value = null;
    }
    if (this.myDropdown3) {
      this.myDropdown3.state.choice.icon = null;
      this.myDropdown3.state.choice.label = null;
      this.myDropdown3.state.choice.value = null;
    }
    if (this.myDropdown4) {
      this.myDropdown4.state.choice.icon = null;
      this.myDropdown4.state.choice.label = null;
      this.myDropdown4.state.choice.value = null;
    }
    if (this.myDropdown5) {
      this.myDropdown5.state.choice.icon = null;
      this.myDropdown5.state.choice.label = null;
      this.myDropdown5.state.choice.value = null;
    }
  }
  getAmanaties() {
    this.setState({ loading: true });
    Api.Amanaties()
      .then(
        function (response) {
          //console.log('AmanatiesApiDAta:--', JSON.stringify(response.data));
          this.setState({ listAmanties: response.data, loading: false });
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
  getAddressByLatLong(long, lat) {
    //console.log('function call');
    // if (this.state.isConnected) {
    var latlng = lat + ',' + long;
    let url =
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
      latlng +
      constants.googleApiKey;
    fetch(url, {
      method: 'GET', // or 'PUT'
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((response) => {
        if (response) {
          // console.log(
          //   'Address:',
          //   JSON.stringify(response.results[0].formatted_address),
          // );
          this.setState({ address: response.results[0].formatted_address });
          // this.state.fullAddress = this.state.address
        }
      })
      .catch((error) => {
        //console.log('Error:', error);
      });
  }
  onMapReady = () => {
    this.setState({ isMapReady: true, marginTop: 0 });
  };

  // Fetch location details as a JOSN from google map API
  fetchAddress = () => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      this.state.region.latitude +
      ',' +
      this.state.region.longitude +
      '&key=' +
      'AIzaSyAkJxebFC8lBRDzjb1BB9NqxeZcWPRygy8',
    )
      .then((response) => response.json())
      .then((responseJson) => {
        const userLocation = responseJson.results[0].formatted_address;
        this.setState({
          userLocation: userLocation,
          regionChangeProgress: false,
        });
      });
  };

  onLocationSelect = () => alert(this.state.userLocation);

  show = (mode) => {
    this.setState({
      show: true,
      mode,
    });
  };

  datepicker = () => {
    this.show('date');
  };
  //  imagePickFromGallery = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true
  //   }).then(image => {
  //     console.log(image);
  //   });
  // };
  imagePickFromGallery = async () => {
    console.log("In Picker Fn.")
    try {
      const response = await ImagePicker.openPicker({
        imageLoader: 'UNIVERSAL',
        multiple: true,
        compressImageQuality: 0.3,
        width: 400,
        
        height: 400
      })

      console.log('imagePickFromGallery', 'response', response);
      let sources = this.state.list;
      if (Array.isArray(response) && response.length > 0) {
        response.map((item) => {
          sources.push({
            uri:
              Platform.OS === 'ios'
                ? 'File:///' + item.path.split('file:/').join('')
                : item.path,
            name: moment().format('x') + '.jpeg',
            type: 'image/jpeg',
          });
          // "file:///" + this.state.profileImage.split("file:/").join("");
        });
        this.setState({ list: sources }, () => {
          //console.log('Imageslist', JSON.stringify(this.state.list));
        });
      }
    } catch (err) {
      console.log('Image Picker :', err)
    };
  };

  timepicker = () => {
    this.show('time');
  };

  setCount = () =>
    this.setState((prevState) => ({ ...prevState, count: this.state.count + 1 }));

  checkBox(text) {
    this.setState({ first: 0, second: 0 });
    if (text === 'first' && this.state.first === 0) {
      this.setState({ first: 1, second: 0 });
    } else if (text === 'first' && this.state.first === 1) {
      this.setState({ first: 0, second: 0 });
    } else if (text === 'second' && this.state.second === 0) {
      this.setState({ first: 0, second: 1 });
    } else if (text === 'second' && this.state.second === 1) {
      this.setState({ first: 0, second: 0 });
    }
  }

  lefAction() {
    this.props.navigation.goBack();
  }

  onRegionChange(region) {
    this.setState({ region });
  }
  inputcheck() {
    console.log(
      this.state.reservations,
      this.state.first,
      this.state.startTimeCheck,
      this.state.endTimeCheck,
    );
    if (this.state.name_In_English === '') {
      alert(strings('add_property_screen.enter_name_in_in_english'));
    } else if (this.state.name_In_Arabic === '') {
      alert(strings('add_property_screen.enter_name_in_in_arabic'));
    } else if (this.state.countries === '') {
      alert(strings('add_property_screen.enter_country'));
    } else if (this.state.cities === '') {
      alert(strings('add_property_screen.enter_city'));
    } else if (this.state.latittude === null || this.state.longitude === null) {
      alert(strings('add_property_screen.select_property_location'));
    } else if (this.state.property_Type === '') {
      alert(strings('add_property_screen.property_type'));
    } else if (this.state.description === '') {
      alert(strings('add_property_screen.property_description'));
    } else if (this.state.reservations === 0) {
      alert(strings('add_property_screen.no_of_reservation'));
    } else if (
      this.state.reservations === 1 &&
      this.state.first === 0 &&
      this.state.second === 0
    ) {
      alert(strings('add_property_screen.select_multi_or_single'));
    } else if (
      this.state.reservations == 1 &&
      this.state.first == 1 &&
      (this.state.startTimeCheck == false || this.state.endTimeCheck == false)
    ) {
      console.log('Enter Time One Day');
      alert(strings('add_property_screen.enter_time'));
    } else if (
      this.state.reservations == 2 &&
      (this.state.morningShiftStartTimeCheck == false ||
        this.state.morningShiftEndTimeCheck == false ||
        this.state.eveningShiftStartTimeCheck == false ||
        this.state.eveningShiftEndTimeCheck == false)
    ) {
      console.log('Enter Time Two Day');
      alert(strings('add_property_screen.enter_time'));
    } else if (this.state.inputNumber === '') {
      alert(strings('add_property_screen.enter_price_per_day'));
    } else if (this.state.inputNumber2 === '') {
      alert(strings('add_property_screen.enter_price_per_day'));
    } else if (this.state.inputNumber3 === '') {
      alert(strings('add_property_screen.enter_price_per_day'));
    } else if (this.state.inputNumber4 === '') {
      alert(strings('add_property_screen.enter_price_per_day'));
    } else if (this.state.inputNumber5 === '') {
      alert(strings('add_property_screen.enter_price_per_day'));
    } else if (this.state.inputNumber6 === '') {
      alert(strings('add_property_screen.enter_price_per_day'));
    } else if (this.state.inputNumber7 === '') {
      alert(strings('add_property_screen.enter_price_per_day'));
    } else if (this.state.astbeltProgress === '') {
      alert(strings('add_property_screen.select_special_offer'));
    } else if (this.state.termsAndConditions == false) {
      alert(strings('add_property_screen.terms&conditions'));
    } else {
      if (this.state.list.length == 0) {
        this.add_Property();
      } else {
        this.uploadImagesToServer();
      }
    }
  }
  add_Property = () => {

   console.log(startTime+'----'+endTime+'----'+this.state.reservations)
  


  
    this.setState({ loading: true });
    let tempData = [];
    let Mon = (20 / 100) * parseInt(this.state.inputNumber);
    let Tue = (20 / 100) * parseInt(this.state.inputNumber2);
    let wed = (20 / 100) * parseInt(this.state.inputNumber3);
    let thu = (20 / 100) * parseInt(this.state.inputNumber4);
    let fri = (20 / 100) * parseInt(this.state.inputNumber5);
    let sat = (20 / 100) * parseInt(this.state.inputNumber6);
    let sun = (20 / 100) * parseInt(this.state.inputNumber7);
    let day1 = ['Monday', this.state.inputNumber, Mon.toFixed(1)];
    let day2 = ['Tuesday', this.state.inputNumber2, Tue.toFixed(1)];
    let day3 = ['Wednesday', this.state.inputNumber3, wed.toFixed(1)];
    let day4 = ['Thursday', this.state.inputNumber4, thu.toFixed(1)];
    let day5 = ['Friday', this.state.inputNumber5, fri.toFixed(1)];
    let day6 = ['Saturday', this.state.inputNumber6, sat.toFixed(1)];
    let day7 = ['Sunday', this.state.inputNumber7, sun.toFixed(1)];
    tempData.push(day1);
    tempData.push(day2);
    tempData.push(day3);
    tempData.push(day4);
    tempData.push(day5);
    tempData.push(day6);
    tempData.push(day7);

    
    // let subtype;
    // if (this.state.property_Type == 'Chalets and pools') {
    //   subtype = this.state.specific_Type;
    // } else {
    //   subtype = null;
    // }
    let startTime = '';
    if (this.state.reservations == 1) {
      if (this.state.first == 1) {
        startTime = moment(this.state.startTime).format('hh:mm a');
      } else {
        startTime = null;
      }
    } else {
      startTime = moment(this.state.morningShiftStartTime).format('hh:mm a');
    }
    let endTime = '';
    if (this.state.reservations == 1) {
      if (this.state.first == 1) {
        endTime = moment(this.state.endTime).format('hh:mm a');
      } else {
        endTime = null;
      }
    } else {
      endTime = moment(this.state.morningShiftEndTime).format('hh:mm a');
    }
    let eve_start_time = '';
    if (this.state.reservations == 2) {
      eve_start_time = moment(this.state.eveningShiftStartTime).format('hh:mm a');
    } else {
      eve_start_time = null;
    }
    let eve_end_time = '';
    if (this.state.reservations == 2) {
      eve_end_time = moment(this.state.eveningShiftEndTime).format('hh:mm a');
    } else {
      eve_end_time = null;
    }
    let imgtemp = [];
    for (let i = 0; i < this.state.ImagesList.length; i++) {
      imgtemp.push(this.state.ImagesList[i].file_name);
    }
    console.log(tempData)
    console.log(imgtemp)
   
    const FormBody = new FormData();
    FormBody.append('eng_name',this.state.name_In_English)
    FormBody.append('arabic_name',this.state.name_In_Arabic)
    FormBody.append('country',this.state.countries)
    FormBody.append('city',this.state.cities ? this.state.cities : '',)
    FormBody.append('location',this.state.address)
    FormBody.append('type',this.state.property_Type)
    FormBody.append('description',this.state.description)
    FormBody.append('price',tempData)
    FormBody.append('special_offer',this.state.astbeltProgress.toFixed(0),)
    FormBody.append('images',imgtemp)

    FormBody.append('reservation',this.state.reservations)
    FormBody.append('full_day',this.state.second)
    FormBody.append('specific_time',this.state.first)
    FormBody.append('start_time',startTime)
    FormBody.append('end_time',endTime)
    FormBody.append('eve_start_time',eve_start_time)
    FormBody.append('eve_end_time',eve_end_time)
    FormBody.append('latitude',this.state.latittude)
    FormBody.append('longitude', this.state.longitude)


    // let bodyData = {
    //   eng_name: this.state.name_In_English,
    //   arabic_name: this.state.name_In_Arabic,
    //   country: this.state.countries,
    //   city: this.state.cities ? this.state.cities : '',
    //   location: this.state.address,
    //   type: this.state.property_Type,
    //   // sub_type: subtype,
    //   description: this.state.description,
    //   price: tempData,
    //   special_offer: this.state.astbeltProgress.toFixed(0),
    //   images: imgtemp,
    //   reservation: this.state.reservations,
    //   full_day: this.state.second,
    //   specific_time: this.state.first,
    //   start_time: startTime,
    //   end_time: endTime,
    //   eve_start_time: eve_start_time,
    //   eve_end_time: eve_end_time,
    //   latitude: this.state.latittude,
    //   longitude: this.state.longitude,
    // };

    console.log('DATA:----', FormBody);
    
    Api.add_Property(FormBody)
      .then(
        function (response) {
          
          console.log('AddPropertyAPIResponse: ', JSON.stringify(response));

          if (response.status == 200) {
            this.saveAminitiesToServer(response.data.id, response.data.user_id);
            Alert.alert(
              strings('add_property_screen.thank_You'),
              strings('add_property_screen.admin_review'),
              [
                {
                  text: strings('add_property_screen.ok'),
                },
              ],
            );
            this.setState({
              show: false,
              toggleCheckBox: false,
              toggleCheckBox2: false,
              toggleCheckBox3: false,
              toggleCheckBox4: false,
              toggleCheckBox5: false,
              first: 0,
              second: 0,
              isVisible: false,
              priceModal: false,
              count: 0,
              OkClick: false,
              resourcePath: {},
              reservations: 0,
              broadcasting: false,
              showPopup: false,
              selectDate: false,
              multipleShifts: false,
              isChecked: false,
              rangeLow: new Date(),
              rangeHigh: new Date(),
              min: new Date(),
              imageArray: [],
              list: [],
              max: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
              startTimeShow: false,
              morningShiftStartTimeShow: false,
              eveningShiftStartTimeShow: false,
              startTimeTextShow: false,
              morningShiftStartTimeTextShow: false,
              eveningShiftStartTimeTextShow: false,
              endTimeShow: false,
              morningShiftEndTimeShow: false,
              eveningShiftEndTimeShow: false,
              endTimeTextShow: false,
              morningShiftEndTimeTextShow: false,
              eveningShiftEndTimeTextShow: false,
              startTime: new Date(),
              morningShiftStartTime: new Date(),
              eveningShiftStartTime: new Date(),
              endTime: new Date(),
              morningShiftEndTime: new Date(),
              eveningShiftEndTime: new Date(),
              loading: false,
              name_In_English: '',
              name_In_Arabic: '',
              countries: '',
              cities: '',
              property_Type: '',
              // specific_Type: '',
              description: '',
              inputNumber: '',
              inputNumber2: '',
              inputNumber3: '',
              inputNumber4: '',
              inputNumber5: '',
              inputNumber6: '',
              inputNumber7: '',
              astbeltProgress: 0,
              error: '',
              region: null,
              isMapReady: false,
              marginTop: 1,
              userLocation: '',
              regionChangeProgress: false,
              countri: [],
              ImagesList: [],
              address: '',
              longitude: null,
              latittude: null,
              listAmanties: [],
              citiesDropdownJordan: [],
              citiesDropdownSaudi: [],
              citiesDropdownBahrain: [],
              selectedCities: [],
              termsAndConditions: false,
            });
          } else {
            this.setState({ loading: false });
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
          console.log('adding error ',error)
          this.setState({ loading: false });
          Alert.alert(strings('activities_screen.alert'), + error.message, [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  };

  setPropertyTypePickerOpen = () => {
    this.setState({ propertyTypePickerOpen: !this.state.propertyTypePickerOpen })
  }

  setReservationPickerOpen = () => {
    this.setState({ reservationPickerOpen: !this.state.reservationPickerOpen })
  }



  setCityPickerOpen = () => {
    this.setState({ cityPickerOpen: !this.state.cityPickerOpen })
  }

  setCountryPickerOpen = () => {
    this.setState({ countryPickerOpen: !this.state.countryPickerOpen })
  }

  saveAminitiesToServer = async (id, userId) => {
    //console.log('UPLOADINAMINITIES');
    let Ameneties = this.state.listAmanties;
    let tempArray = [];
    for (let i = 0; i < Ameneties.length; i++) {
      tempArray.push({
        amenity: Ameneties[i].id,
        quantity: Ameneties[i].quantity,
      });
    }
    const body = JSON.stringify({
      property_id: id,
      amenities: tempArray,
    });
    Api.storeAmeneties(body)
      .then(
        function (response) {
          this.setState({ loading: false });
          //console.log('storeAmenetiesAPIResponse: ', JSON.stringify(response));
          if (response.status == 201) {
            //return false;
            //Alert.alert("Alert","Aminities Saved")
            this.props.navigation.navigate('Search');
          } else {
            Alert.alert(strings('activities_screen.alert'), response.message, [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
            // Preference.set('phon_no', this.state.mobile_Number);
          }
        }.bind(this),
      )
      .catch(
        function (error) {
          Alert.alert(strings('activities_screen.alert'), error.message, [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  };
  uploadImagesToServer = async () => {
    this.setState({ loading: true });
    //console.log('UPLOADIMGIMAGE');
    let data = new FormData();
    await this.state.list.forEach((item, i) => {
      data.append({
        // uri: item.uri,
        uri:Platform.OS === "ios" ? item.uri.replace("file://", "") : item.uri,
        type: item.type,
        name: item.filename || `filename${i}.jpg`,
      });
    });

    //console.log('ApiURL: ', constants.ApiBaseURL + 'local_image_storage');
    //console.log('ApiDATA: ', JSON.stringify(data));
    // console.log(
    //   'ApiToken: ',
    //   JSON.stringify('Bearer ' + Preference.get('token')),
    // );

    console.log('uploading images to server are',data)
    console.log('uploading images to server are',JSON.stringify(data))

    fetch(constants.ApiBaseURL + 'local_image_storage', {
      method: 'POST',
      headers: {
        //Accept: "application/json",
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + Preference.get('token'),
      },
      body: {'images':data},
    })
      .then((response) => {
        console.log('Response from server is after uploading images ',response)
        console.log('Response from server is ' ,JSON.stringify( response))

        console.log(response.status);
        return response.json();
      })
      .then((response) => {
        console.log('ApiDATA: ', JSON.stringify(response));
        let oldImages = this.state.ImagesList;
        response.data.map((item) => {
          oldImages.push(item.file_name);
        });

        this.setState({ ImagesList: response.data });
        this.add_Property();
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert('Error while uploading images')
        console.error('error uploading images: ', err);
      });
  };

  setCities = async (shaher) => {
    //console.log('AllCountries');
    // let cities = undefined;
    // try {
    //   cities = JSON.parse(await AsyncStorage.getItem('countries'));
    //   ////console.log('AllCountries', JSON.stringify(cities));
    //   this.setState({ cities: cities });
    //   if (cities !== null) {
    //     // We have data!!
    //     //console.log("AllCountries ",cities);
    //   }
    // } catch (error) {
    //   //console.log('AllCountries Error', JSON.stringify(error));
    // }

    let realCities = [];
    // console.log('AllCountries=============================================', shaher);
    for (let j = 0; j < shaher.length; j++) {
      realCities.push({
        label: lang == 'en' ? shaher[j].eng_name : shaher[j].arabic_name,
        value: lang == 'en' ? shaher[j].eng_name : shaher[j].arabic_name,//shaher[j].eng_name,
      });
    }

    this.setState({ selectedCities: realCities }
      // , () => { console.log('real cities===>>', realCities);
    );
  };
  setCountries = async () => {
    let countriesDetails = undefined;
    try {
      countriesDetails = JSON.parse(await AsyncStorage.getItem('countries'));
    } catch (error) {
      //console.log('AllCountries Error', JSON.stringify(error));
    }
    let country = [];
    let imageBaseUrl = 'https://doshag.net/admin/public';
    //await this.setCountiesCities()
    for (let i = 0; i < countriesDetails.length; i++) {
      country.push({
        label:
          lang == 'en'
            ? countriesDetails[i].name
            : countriesDetails[i].arabic_name,
        value: countriesDetails[i].name,
        icon: () => (
          <Image
            source={{ uri: imageBaseUrl + countriesDetails[i].flag_image }}
            style={{ width: 35, height: 20 }}
          />
        ),
        cities: countriesDetails[i].cities,
      });
    }
    // console.log('SettingAllCountries: ', JSON.stringify(country))
    this.setState({
      countri: country,
    });
  };


  render() {
    const { show, date, mode } = this.state;
    let { imageArray } = this.state;
    const { count } = this.state;
    const {
      broadcasting,
      astbeltProgress,
      rangeLow,
      rangeHigh,
      min,
      max,
    } = this.state;
    let Mon = (20 / 100) * parseInt(this.state.inputNumber);
    let Tue = (20 / 100) * parseInt(this.state.inputNumber2);
    let wed = (20 / 100) * parseInt(this.state.inputNumber3);
    let thu = (20 / 100) * parseInt(this.state.inputNumber4);
    let fri = (20 / 100) * parseInt(this.state.inputNumber5);
    let sat = (20 / 100) * parseInt(this.state.inputNumber6);
    let sun = (20 / 100) * parseInt(this.state.inputNumber7);
    return (
      <>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('add_property_screen.add_property')}
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
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{
              width: '100%',
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  marginTop: 10,
                  padding: 5,
                  flex: 1,
                  backgroundColor: 'white',
                  borderColor: '#F2F0F1',
                  borderRadius: 5,
                  borderWidth: 2,
                  height: '9%',
                  width: '100%',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                }}>
                <FlatList
                  style={{
                    backgroundColor: 'white',
                    flex: 1,
                    height: '90%',
                    margin: 5,
                    borderColor: '#F2F0F1',
                    borderRadius: 5,
                    borderWidth: 2,
                  }}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={this.state.list}
                  extraData={this.state}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 120,
                          width: 90,
                          margin: 5,
                          padding: 5
                        }}>
                        <Image
                          source={item}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            let temp = this.state.list;
                            temp.splice(index, 1);
                            this.setState({ list: temp });
                          }}
                          style={{
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            backgroundColor: 'red',
                          }}>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                            }}
                            source={require('../../../assets/images/close.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index}
                />

                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    height: '90%',
                    width: '29%',
                    borderColor: '#F2F0F1',
                    borderRadius: 5,
                    borderWidth: 2,
                  }}
                  onPress={() => {
                    this.imagePickFromGallery()
                  }}>
                  <Image
                    source={require('../../../assets/images/down.png')}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <View
                    style={{
                      flex: 1,
                      height: 150,
                    }}>
                    <Image
                      style={{
                        bottom: 70,
                        alignSelf: 'center',
                        height: 25,
                        width: 30,
                      }}
                      source={require('../../../assets/images/add.png')}
                    />
                    <Text
                      style={{
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 10,
                        color: '#cdd1ce',
                        bottom: 60,
                        alignSelf: 'center',
                        fontFamily: AppFonts.PoppinsRegular,
                      }}>
                      {strings('add_property_screen.add_photo')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    marginTop: 15,
                    marginLeft: 5,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                    fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {strings('add_property_screen.name_english')}
                </Text>
                <TextInput
                  placeholderTextColor="#979191"
                  placeholder={strings(
                    'add_property_screen.placeholder_prop_name',
                  )}
                  value={this.state.name_In_English}
                  onChangeText={(text) =>
                    this.setState({
                      name_In_English: text,
                    })
                  }
                  style={{
                    height: 50,
                    backgroundColor: 'white',
                    width: '95%',
                    borderColor: '#999999',
                    borderRadius: 5,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    marginTop: 10,
                    paddingLeft: 10,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                  }}
                />
                <Text
                  style={{
                    marginTop: 15,
                    marginLeft: 5,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                    fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {strings('add_property_screen.name_arabic')}
                </Text>
                <TextInput
                  placeholderTextColor="#979191"
                  placeholder={strings(
                    'add_property_screen.placeholder_prop_name',
                  )}
                  value={this.state.name_In_Arabic}
                  onChangeText={(text) =>
                    this.setState({
                      name_In_Arabic: text,
                    })
                  }
                  style={{
                    height: 50,
                    backgroundColor: 'white',
                    width: '95%',
                    borderColor: '#999999',
                    borderRadius: 5,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    marginTop: 10,
                    paddingLeft: 10,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                  }}
                />
              </View>
              {Platform.OS === 'ios' ? (
                <View style={{ zIndex: 10 }}>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('add_property_screen.country')}
                  </Text>
                  <DropDownPicker
                    setOpen={() => { this.setCountryPickerOpen() }}
                    open={this.state.countryPickerOpen}
                    onSelectItem={(item) => {
                      console.log('SelectingCountry============>>>>: ', (item.label))
                      this.setCities(item.cities);
                      this.setState({
                        countries: item.value,
                        arabicCountry: item.label

                      });
                    }}
                    items={this.state.countri.sort(function (a, b) {
                      return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                    })}
                    // ref={(c) => (this.myDropdown1 = c)}
                    containerStyle={{
                      height: 50,
                      width: '96%',
                      marginBottom: 10,
                      alignSelf: 'center',
                      marginTop: 10,

                    }}
                    style={{
                      backgroundColor: 'white',
                      borderWidth: 0.5,
                      borderColor: '#999999',
                      borderRadius: 10,
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                    }}
                    dropDownStyle={{ backgroundColor: 'white' }}
                    // onChangeItem={(item) => {
                    //   this.setCities(item.value);
                    //   this.setState({
                    //     countries: item.value,

                    //   });
                    // }}
                    placeholder={this.state.arabicCountry ? this.state.arabicCountry : strings(
                      'add_property_screen.placeholder_country',
                    )}
                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                    showArrow={false}
                  />
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('add_property_screen.country')}
                  </Text>
                  <DropDownPicker
                    items={this.state.countri.sort(function (a, b) {
                      return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                    })}
                    //ref={(c) => (this.myDropdown1 = c)}
                    containerStyle={{
                      height: 50,
                      width: '96%',
                      marginBottom: 10,
                      alignSelf: 'center',
                      marginTop: 10,

                    }}
                    style={{
                      backgroundColor: 'white',
                      borderWidth: 0.5,
                      borderColor: '#999999',
                      borderRadius: 10,
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                    }}
                    setOpen={() => { this.setCountryPickerOpen() }}
                    open={this.state.countryPickerOpen}
                    dropDownStyle={{ backgroundColor: 'white' }}
                    onSelectItem={(item) => {
                      console.log('select all city from selected country===>>>>>,', item.value);
                      this.setCities(item.cities);
                      this.setState({
                        countries: item.value,
                        arabicCountry: item.label
                      });
                    }}
                    value={this.state.arabicCountry}
                    placeholder={strings(
                      'add_property_screen.placeholder_country',
                    )}
                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                    showArrow={false}
                  />
                </View>
              )}
              {/* <View style={{zIndex:10}}> */}
              {Platform.OS === 'ios' ? (
                <View style={{ zIndex: 1 }}>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('add_property_screen.city')}
                  </Text>
                  <DropDownPicker
                    setOpen={() => {
                      this.setCityPickerOpen()

                    }}
                    open={this.state.cityPickerOpen}
                    onSelectItem={(item) => {
                      console.log('SelectingCities: ', JSON.stringify(item))
                      this.setState({
                        cities: item.value,
                      })
                    }}
                    items={this.state.selectedCities.sort(function (a, b) {
                      return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                    })}
                    //ref={(c) => (this.myDropdown2 = c)}
                    containerStyle={{
                      height: 50,
                      width: '95%',
                      marginBottom: 10,
                      alignSelf: 'center',
                      marginTop: 10,

                    }}
                    style={{
                      backgroundColor: 'white',
                      borderWidth: 0.5,
                      borderColor: '#999999',
                      borderRadius: 10,
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                    }}
                    dropDownStyle={{ backgroundColor: 'white' }}
                    onChangeItem={(item) =>
                      this.setState({

                        cities: item.value,
                      })
                    }
                    placeholder={this.state.cities ? this.state.cities : strings(
                      'add_property_screen.placeholder_city',
                    )}
                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                    showArrow={false}
                  />
                </View>
              ) : (
                <></>
                // <View style={{ zIndex: 1 }}>
                //   <Text
                //     style={{
                //       marginTop: 15,
                //       marginLeft: 5,
                //       writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                //       fontFamily: AppFonts.PoppinsRegular,
                //     }}>
                //     {strings('add_property_screen.city')}
                //   </Text>
                //   <DropDownPicker
                //     setOpen={() => {
                //        this.setCityPickerOpen()
                //        console.log('cities state of picker ===>>>',this.state.selectedCities);
                //      }}
                //      autoScroll={true}

                //     open={this.state.cityPickerOpen}
                //     onSelectItem={(item) => {
                //       console.log('SelectingPropertyType: ', JSON.stringify(item))
                //       this.setState({
                //         cities: item.value,
                //       })
                //     }}
                //     items={this.state.selectedCities.sort(function (a, b) {
                //       return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                //     })}

                //     //ref={(c) => (this.myDropdown2 = c)}
                //     containerStyle={{
                //       height: 100,
                //       width: '95%',
                //       marginBottom: 10,
                //       alignSelf: 'center',
                //       marginTop: 10,
                //       backgroundColor:'pink'


                //     }}
                //     style={{
                //       backgroundColor: 'white',
                //       borderWidth: 0.5,
                //       borderColor: '#999999',
                //       borderRadius: 10,
                //     }}
                //     itemStyle={{

                //       justifyContent: 'flex-start',
                //       writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,

                //     }}
                //     dropDownStyle={{ backgroundColor: 'white' }}
                //     // onChangeItem={(item) =>
                //     //   this.setState({
                //     //     cities: item.value,
                //     //   })
                //     // }
                //     placeholder={this.state.cities ? this.state.cities : strings(
                //       'add_property_screen.placeholder_city',
                //     )}
                //     placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                //     selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                //     showArrow={false}
                //   />
                // </View>
              )}
              {/* <TouchableOpacity
               
              >
                <Text>{strings('add_property_screen.placeholder_city')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                backgroundColor: 'white',
                borderWidth: 0.5,
                borderColor: '#999999',
                borderRadius: 10,
                height: 50,
                width: '95%',
                marginBottom: 10,
                alignSelf: 'center',
                marginTop: 10,
                justifyContent:"center",
                
              }}
              onPress={() => {
                this.setCityPickerOpen()
              }}
              >
                <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' ,marginLeft:10}}>{this.state.cities ? this.state.cities : strings('add_property_screen.placeholder_city')}</Text>
              </TouchableOpacity> */}
              <Modal
                visible={this.state.cityPickerOpen}
                animationType="slide"
              >
                <View>
                  <View style={{ padding: 5, alignItems: "flex-end", borderBottomWidth: 1, }}>
                    <TouchableOpacity
                      style={{ width: 50, height: 50, alignItems: "center", justifyContent: "center", marginTop: 40 }}
                      onPress={() => {
                        this.setCityPickerOpen()
                      }}
                    >
                      <Image
                        source={require('../../../assets/images/close.png')}
                        style={{ width: 20, height: 20, tintColor: "red", }}
                      />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={this.state.selectedCities}
                    renderItem={({ item }) => {
                      // console.log('first itemsss=====>>>>', item.value);
                      return (<View>

                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              cities: item.value,
                            })
                            this.setCityPickerOpen()
                          }}
                          style={{ padding: 10, borderBottomWidth: .5, marginVertical: 5, justifyContent: "center", }}>
                          <Text>{item?.value}</Text>
                        </TouchableOpacity>
                      </View>

                      )
                    }}
                  />
                </View>
              </Modal>
              <View
                style={{
                  flex: 1,
                  marginTop: 15,
                  height: '40%',
                }}>
                <Text
                  style={{
                    // marginTop: 15,
                    marginLeft: 5,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                    fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {strings('add_property_screen.pick_location')}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: 10,
                }}>
                <GooglePlacesAutocomplete
                  ref={(ref) => (this.input = ref)}
                  placeholder={
                    Preference.get('language') == 'ar' ? 'بحث' : 'Search'
                  }
                  minLength={2}
                  autoFocus={false}
                  listViewDisplayed={false}
                  renderDescription={(row) => row.description}
                  keyboardShouldPersistTaps="always"
                  fetchDetails={true}
                  onPress={(data, geometry) => {
                    this.setState({
                      latittude: String(geometry.geometry.location.lat),
                      longitude: String(geometry.geometry.location.lng),
                      address: data.description,
                    });
                  }}
                  styles={{
                    textInput: {
                      backgroundColor: 'white',
                      color: 'black',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 13,
                    },
                    textInputContainer: {
                      width: '95%',
                      height: 50,
                      backgroundColor: 'white',
                      borderWidth: 0.5,
                      borderColor: '#999999',
                      borderRadius: 5,
                      flexDirection: 'row',
                      marginLeft: 10,
                    },
                    description: {
                      color: 'black',
                      backgroundColor: 'transparent',
                    },
                    predefinedPlacesDescription: {
                      color: 'red',
                    },
                    poweredContainer: { color: 'red' },
                  }}
                  onFail={(error) => console.log('error' + error)}
                  getDefaultValue={(data) =>
                    console.log('Location placed', data)
                  }
                  query={{
                    key: 'AIzaSyAkJxebFC8lBRDzjb1BB9NqxeZcWPRygy8',
                    language: 'en',
                    type: 'geocode',
                  }}
                  GooglePlacesDetailsQuery={{ fields: 'geometry' }}
                />
                {/* {console.log('latitudeded', this.state.latittude)} */}
              </View>
              <Text
                style={{
                  marginTop: 15,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('add_property_screen.latitude')}
              </Text>
              <TextInput
                placeholderTextColor="#979191"
                keyboardType="decimal-pad"
                placeholder={strings('add_property_screen.enter_latittude')}
                value={this.state.latittude}
                // defaultValue={this.state.latittude}
                onChangeText={(text) =>
                  this.setState({
                    latittude: text,
                  })
                }
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  width: '95%',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  alignSelf: 'center',
                  marginTop: 10,
                  paddingLeft: 10,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}
              />
              <Text
                style={{
                  marginTop: 15,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('add_property_screen.longitude')}
              </Text>
              <TextInput
                placeholderTextColor="#979191"
                keyboardType="decimal-pad"
                placeholder={strings('add_property_screen.enter_logitude')}
                value={this.state.longitude}
                onChangeText={(text) =>
                  this.setState({
                    longitude: text,
                  })
                }
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  width: '95%',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  alignSelf: 'center',
                  marginTop: 10,
                  paddingLeft: 10,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}
              />
              {Platform.OS === 'ios' ? (
                <View style={{ zIndex: 10 }}>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      //backgroundColor: "red",
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('add_property_screen.property_typ')}
                  </Text>
                  <DropDownPicker
                    setOpen={() => { this.setPropertyTypePickerOpen() }}
                    onSelectItem={(item) => {
                      console.log('SelectingPropertyType: ', JSON.stringify(item))
                      this.setState({ property_Type: item.value })
                    }}


                    open={this.state.propertyTypePickerOpen}
                    items={[
                      {
                        label: strings('add_property_screen.camps'),
                        value: 'Camps',
                      },
                     
                      {
                        label: strings('add_property_screen.summer_house'),
                        value: 'Chalets and pools',
                      },
                    ]}
                    //ref={(c) => (this.myDropdown3 = c)}
                    containerStyle={{
                      height: 50,
                      width: '95%',
                      marginBottom: 10,
                      alignSelf: 'center',
                      marginTop: 10,
                    }}
                    style={{
                      backgroundColor: 'white',
                      borderWidth: 0.5,
                      borderColor: '#999999',
                      borderRadius: 10,
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                    }}
                    dropDownStyle={{ backgroundColor: 'white' }}
                    placeholder={this.state.property_Type ? this.state.property_Type : strings(
                      'add_property_screen.placeholder_prop_type',
                    )}
                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                    showArrow={false}
                  />
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('add_property_screen.property_typ')}
                  </Text>
                  <DropDownPicker
                    setOpen={() => { this.setPropertyTypePickerOpen() }}
                    onSelectItem={(item) => {
                      console.log('SelectingPropertyType: ', JSON.stringify(item))
                      this.setState({ property_Type: item.value })
                    }}
                    value={this.state.property_Type}

                    open={this.state.propertyTypePickerOpen}
                    items={[
                      {
                        label: strings('add_property_screen.camps'),
                        value: 'Camps',
                      },
                      {
                        label: strings(
                          'add_property_screen.furnished_appartments',
                        ),
                        value: 'Furnished Apartments',
                      },
                      {
                        label: strings('add_property_screen.summer_house'),
                        value: 'Chalets and pools',
                      },
                    ]}
                    //ref={(c) => (this.myDropdown3 = c)}
                    containerStyle={{
                      height: 50,
                      width: '95%',
                      marginBottom: 10,
                      alignSelf: 'center',
                      marginTop: 10,
                    }}
                    style={{
                      backgroundColor: 'white',
                      borderWidth: 0.5,
                      borderColor: '#999999',
                      borderRadius: 10,
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                    }}
                    dropDownStyle={{ backgroundColor: 'white' }}
                    onChangeItem={(item) =>
                      this.setState({
                        property_Type: item.value,
                      })
                    }
                    placeholder={strings(
                      'add_property_screen.placeholder_prop_type',
                    )}
                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                    showArrow={false}
                  />
                </View>
              )}
              {/* {this.state.property_Type === 'Chalets and pools' ? (
                Platform.OS === 'ios' ? (
                  <View style={{ zIndex: 1 }}>
                    <Text
                      style={{
                        marginTop: 15,
                        marginLeft: 5,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                        fontFamily: AppFonts.PoppinsRegular,
                      }}>
                      {strings('add_property_screen.specific_type')}
                    </Text>
                    <DropDownPicker
                      items={[
                        {
                          label: strings('add_property_screen.chalet'),
                          value: 'Chalet',
                        },
                        {
                          label: strings('add_property_screen.istehara'),
                          value: 'Estraha',
                        },
                        {
                          label: strings('add_property_screen.farms'),
                          value: 'Farms',
                        },
                      ]}
                      ref={(c) => (this.myDropdown4 = c)}
                      containerStyle={{
                        height: 50,
                        width: '95%',
                        marginBottom: 10,
                        alignSelf: 'center',
                        marginTop: 10,
                        zIndex: 1,
                      }}
                      style={{
                        backgroundColor: 'white',
                        borderWidth: 0.5,
                        borderColor: '#999999',
                        borderRadius: 10,
                      }}
                      itemStyle={{
                        justifyContent: 'flex-start',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                      }}
                      dropDownStyle={{ backgroundColor: 'white' }}
                      onChangeItem={(item) =>
                        this.setState({
                          specific_Type: item.value,
                        })
                      }
                      placeholder={strings(
                        'add_property_screen.select_specific_type',
                      )}
                      placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                      selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                      showArrow={false}
                    />
                  </View>
                ) : (
                    <View>
                      <Text
                        style={{
                          marginTop: 15,
                          marginLeft: 5,
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                          fontFamily: AppFonts.PoppinsRegular,
                        }}>
                        {strings('add_property_screen.specific_type')}
                      </Text>
                      <DropDownPicker
                        items={[
                          {
                            label: strings('add_property_screen.chalet'),
                            value: 'Chalet',
                          },
                          {
                            label: strings('add_property_screen.istehara'),
                            value: 'Estraha',
                          },
                          {
                            label: strings('add_property_screen.farms'),
                            value: 'Farms',
                          },
                        ]}
                        ref={(c) => (this.myDropdown4 = c)}
                        containerStyle={{
                          height: 50,
                          width: '95%',
                          marginBottom: 10,
                          alignSelf: 'center',
                          marginTop: 10,
                        }}
                        style={{
                          backgroundColor: 'white',
                          borderWidth: 0.5,
                          borderColor: '#999999',
                          borderRadius: 10,
                        }}
                        itemStyle={{
                          justifyContent: 'flex-start',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                        }}
                        dropDownStyle={{ backgroundColor: 'white' }}
                        onChangeItem={(item) =>
                          this.setState({
                            specific_Type: item.value,
                          })
                        }
                        placeholder={strings(
                          'add_property_screen.select_specific_type',
                        )}
                        placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                        selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                        showArrow={false}
                      />
                    </View>
                  )
              ) : null} */}
              <View style={{ marginTop: 15, width: '100%' }}>
                <FlatList
                  data={this.state.listAmanties}
                  contentContainerStyle={{ width: '100%' }}
                  style={{ width: '100%' }}
                  numColumns={3}
                  renderItem={({ item }) => {
                    let baseUrl = 'https://doshag.net/admin/public';
                    if (item.quantity > 0) {
                      return (
                        <View
                          style={{
                            alignItems: 'center',
                            width: '33%',
                            paddingVertical: 10,
                          }}>
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                              resizeMode: 'contain',
                            }}
                            source={{ uri: baseUrl + item.icon }}
                          />
                          <Text
                            style={{
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12,
                              textAlign: 'center',
                              paddingTop: 5,
                              fontFamily: AppFonts.PoppinsRegular,
                            }}>
                            {item.quantity > 1 && (
                              <Text
                                style={{
                                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12,
                                  textAlign: 'center',
                                  paddingTop: 5,
                                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                                  fontFamily: AppFonts.RobotRegular,
                                }}>
                                {item.quantity} {'✕'} {'\n'}
                              </Text>
                            )}{' '}
                            {lang == 'en' ? item.eng_name : item.arabic_name}
                          </Text>
                        </View>
                      );
                    } else {
                      null;
                    }

                    // }
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => this.setState({ isVisible: true })}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 5,
                  marginTop: 10,
                  paddingVertical: 10,
                }}>
                <Text
                  style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14, fontFamily: AppFonts.PoppinsRegular }}>
                  {strings('add_property_screen.ameneties')}
                </Text>
                <Text
                  style={{
                    color: '#B20C11',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                    fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {strings('add_property_screen.add')}
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                marginTop: 20,
                marginLeft: 5,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                zIndex: -10,
                fontFamily: AppFonts.PoppinsRegular,
              }}>
              {strings('add_property_screen.description')}
            </Text>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                width: '95%',
                borderColor: '#999999',
                borderRadius: 5,
                borderWidth: 0.5,
                alignSelf: 'center',
                marginTop: 10,
              }}>
              <TextInput
                placeholderTextColor="#979191"
                placeholder={strings(
                  'add_property_screen.placeholder_description',
                )}
                value={this.state.description}
                onChangeText={(text) =>
                  this.setState({
                    description: text,
                  })
                }
                multiline={true}
                style={{
                  textAlignVertical: 'top',
                  paddingLeft: 10,
                  borderColor: '#c9bdbe',
                  minHeight: 120,
                  maxHeight: 150,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}
              />
            </View>

            <Text
              style={{
                marginTop: 15,
                marginLeft: 5,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                fontFamily: AppFonts.PoppinsRegular,
              }}>
              {strings('add_property_screen.no_of_reservations')}
            </Text>
            <DropDownPicker
              setOpen={() => { this.setReservationPickerOpen() }}
              onSelectItem={(item) => {
                console.log('SelectingPropertyType: ', JSON.stringify(item))
                this.setState({ reservations: item.value });
              }}


              open={this.state.reservationPickerOpen}
              items={[
                { label: '1', value: 1 },
                { label: '2', value: 2 },
              ]}
              //ref={(c) => (this.myDropdown5 = c)}
              containerStyle={{
                height: 50,
                width: '95%',
                marginBottom: 10,
                alignSelf: 'center',
                marginTop: 10,
              }}
              style={{
                backgroundColor: 'white',
                borderWidth: 0.5,
                borderColor: '#999999',
                borderRadius: 10,
              }}
              itemStyle={{
                justifyContent: 'flex-start',
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
              }}
              dropDownStyle={{ backgroundColor: 'white' }}
              onChangeItem={(item) => {
                // console.log("item", item)
                this.setState({ reservations: item.value });
              }}
              placeholder={strings('add_property_screen.placeholder_no_reserv')}
              placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
              selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
              showArrow={false}
            />

            <View
              style={{
                marginTop: 15,
                marginLeft: 10,
              }}>
              {this.state.reservations === 1 && (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ selectDate: !this.state.selectDate });
                      this.checkBox('first');
                    }}
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20 / 2,
                        borderColor:
                          this.state.first === 1 ? '#B20C11' : '#979191',
                        borderWidth: 1.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ selectDate: !this.state.selectDate });
                          this.checkBox('first');
                        }}
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor:
                            this.state.first === 1 ? '#B20C11' : 'white',
                          borderRadius: 10 / 2,
                        }}></TouchableOpacity>
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: '#979191',
                        marginLeft: 20,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                        fontFamily: AppFonts.PoppinsRegular,
                      }}>
                      {strings('add_property_screen.specific_day_reserv')}
                    </Text>
                  </TouchableOpacity>

                  {this.state.first === 1 ? (
                    <View
                      style={{
                        width: '95%',
                        bottom: 0,
                        marginTop: 15,
                        alignSelf: 'center',
                      }}>
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 3,
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                startTimeShow: true,
                                startTimeTextShow: true,
                                endTimeShow: false,
                              })
                            }
                            style={{
                              height: 50,
                              width: '40%',
                              backgroundColor: 'white',
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: 'gray',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            {this.state.startTimeTextShow ? (
                              <Text>
                                {!!this.state.startTime &&
                                  moment(this.state.startTime).format('LT')}
                              </Text>
                            ) : (
                              <Text>
                                {strings(
                                  'add_property_screen.select_start_time',
                                )}
                              </Text>
                            )}
                          </TouchableOpacity>

                          <View
                            style={{
                              width: '2%',
                              height: 2,
                              backgroundColor: 'black',
                              marginTop: 25,
                            }}
                          />
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                endTimeShow: true,
                                endTimeTextShow: true,
                                startTimeShow: false,
                              })
                            }
                            style={{
                              height: 50,
                              width: '40%',
                              backgroundColor: 'white',
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: 'gray',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            {this.state.endTimeTextShow ? (
                              <Text>
                                {!!this.state.endTime &&
                                  moment(this.state.endTime).format('LT')}
                              </Text>
                            ) : (
                              <Text>
                                {strings('add_property_screen.select_end_time')}
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View></View>
                  )}
                  {this.state.startTimeShow && Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={{ width: '100%' }}
                      onPress={() => this.setState({ startTimeShow: false })}>
                      <Text
                        style={{
                          alignSelf: 'flex-end',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                          marginTop: 10,
                        }}>
                        {strings('add_property_screen.close')}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {this.state.startTimeShow && (
                    <DateTimePicker
                      is24Hour={false}
                      mode="time"
                      // display='default'
                      display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                      value={this.state.startTime}
                      onChange={(event, value) => {
                        // console.log("Canceled Value",value)
                        if (value == undefined) {
                          this.setState({
                            startTime: new Date(),
                            startTimeCheck: true,
                            startTimeShow: Platform.OS === 'ios' ? true : false,
                          });
                        } else {
                          this.setState({
                            startTime: value,
                            startTimeCheck: true,
                            startTimeShow: Platform.OS === 'ios' ? true : false,
                          });
                        }

                        if (event.type === 'set') {
                          //console.log('value:', value);
                        }
                      }}
                    />
                  )}
                  {this.state.endTimeShow && Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={{ width: '100%' }}
                      onPress={() => this.setState({ endTimeShow: false })}>
                      <Text
                        style={{
                          alignSelf: 'flex-end',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                          marginTop: 10,
                        }}>
                        {strings('add_property_screen.close')}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {this.state.endTimeShow && (
                    <DateTimePicker
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                      is24Hour={false}
                      value={this.state.endTime}
                      onChange={(event, value) => {
                        if (value == undefined) {
                          this.setState({
                            endTime: new Date(),
                            endTimeCheck: true,
                            endTimeShow: Platform.OS === 'ios' ? true : false,
                          });
                        } else {
                          this.setState({
                            endTime: value,
                            endTimeCheck: true,
                            endTimeShow: Platform.OS === 'ios' ? true : false,
                          });
                        }

                        if (event.type === 'set') {
                          //console.log('value:', value);
                        }
                      }}
                    />
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        multipleShifts: !this.state.multipleShifts,
                      });
                      this.checkBox('second');
                    }}
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <TouchableOpacity
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20 / 2,
                        borderColor:
                          this.state.second === 1 ? '#B20C11' : '#979191',
                        borderWidth: 1.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            multipleShifts: !this.state.multipleShifts,
                          });
                          this.checkBox('second');
                        }}
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor:
                            this.state.second === 1 ? '#B20C11' : 'white',
                          borderRadius: 10 / 2,
                        }}></TouchableOpacity>
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: '#979191',
                        marginLeft: 20,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                        fontFamily: AppFonts.PoppinsRegular,
                      }}>
                      {strings('add_property_screen.multiple_day_reserv')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {this.state.reservations === 2 ? (
                <View
                  style={{
                    width: '95%',
                    marginTop: 15,
                  }}>
                  <View>
                    <Text
                      style={{
                        marginTop: 15,
                        marginLeft: 5,
                        marginBottom: 10,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                        fontFamily: AppFonts.PoppinsRegular,
                      }}>
                      {strings('add_property_screen.morning_shift')}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 3,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            morningShiftStartTimeShow: true,
                            morningShiftStartTimeTextShow: true,
                            morningShiftEndTimeShow: false,
                          })
                        }
                        style={{
                          height: 50,
                          width: '40%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: 'gray',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {this.state.morningShiftStartTimeTextShow ? (
                          <Text>
                            {!!this.state.morningShiftStartTime &&
                              moment(this.state.morningShiftStartTime).format(
                                'LT',
                              )}
                          </Text>
                        ) : (
                          <Text>
                            {strings('add_property_screen.select_start_time')}
                          </Text>
                        )}
                      </TouchableOpacity>
                      <View
                        style={{
                          width: '2%',
                          height: 2,
                          backgroundColor: 'black',
                          marginTop: 25,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            morningShiftEndTimeShow: true,
                            morningShiftEndTimeTextShow: true,
                            morningShiftStartTimeShow: false,
                          })
                        }
                        style={{
                          height: 50,
                          width: '40%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: 'gray',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {this.state.morningShiftEndTimeTextShow ? (
                          <Text>
                            {!!this.state.morningShiftEndTime &&
                              moment(this.state.morningShiftEndTime).format(
                                'LT',
                              )}
                          </Text>
                        ) : (
                          <Text>
                            {strings('add_property_screen.select_end_time')}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    {this.state.morningShiftStartTimeShow &&
                      Platform.OS === 'ios' && (
                        <TouchableOpacity
                          style={{ width: '100%' }}
                          onPress={() =>
                            this.setState({ morningShiftStartTimeShow: false })
                          }>
                          <Text
                            style={{
                              alignSelf: 'flex-end',
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                              marginTop: 10,
                            }}>
                            {strings('add_property_screen.close')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    {this.state.morningShiftStartTimeShow && (
                      <DateTimePicker
                        is24Hour={false}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                        value={this.state.morningShiftStartTime}
                        onChange={(event, value) => {
                          if (value == undefined) {
                            this.setState({
                              morningShiftStartTime: new Date(),
                              morningShiftStartTimeCheck: true,
                              morningShiftStartTimeShow:
                                Platform.OS === 'ios' ? true : false,
                            });
                          } else {
                            this.setState({
                              morningShiftStartTime: value,
                              morningShiftStartTimeCheck: true,
                              morningShiftStartTimeShow:
                                Platform.OS === 'ios' ? true : false,
                            });
                          }
                          if (event.type === 'set') {
                            //console.log('value:', value);
                          }
                        }}
                      />
                    )}
                    {this.state.morningShiftEndTimeShow &&
                      Platform.OS === 'ios' && (
                        <TouchableOpacity
                          style={{ width: '100%' }}
                          onPress={() =>
                            this.setState({ morningShiftEndTimeShow: false })
                          }>
                          <Text
                            style={{
                              alignSelf: 'flex-end',
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                              marginTop: 10,
                            }}>
                            {strings('add_property_screen.close')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    {this.state.morningShiftEndTimeShow && (
                      <DateTimePicker
                        is24Hour={false}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                        value={this.state.morningShiftEndTime}
                        onChange={(event, value) => {
                          if (value == undefined) {
                            this.setState({
                              morningShiftEndTime: new Date(),
                              morningShiftEndTimeCheck: true,
                              morningShiftEndTimeShow:
                                Platform.OS === 'ios' ? true : false,
                            });
                          } else {
                            this.setState({
                              morningShiftEndTime: value,
                              morningShiftEndTimeCheck: true,
                              morningShiftEndTimeShow:
                                Platform.OS === 'ios' ? true : false,
                            });
                          }
                          if (event.type === 'set') {
                            //console.log('value:', value);
                          }
                        }}
                      />
                    )}

                    <Text
                      style={{
                        marginTop: 15,
                        marginLeft: 5,
                        marginBottom: 10,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                        fontFamily: AppFonts.PoppinsRegular,
                      }}>
                      {strings('add_property_screen.evening_shift')}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 3,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            eveningShiftStartTimeShow: true,
                            eveningShiftStartTimeTextShow: true,
                            eveningShiftEndTimeShow: false,
                          })
                        }
                        style={{
                          height: 50,
                          width: '40%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: 'gray',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {this.state.eveningShiftStartTimeTextShow ? (
                          <Text>
                            {!!this.state.eveningShiftStartTime &&
                              moment(this.state.eveningShiftStartTime).format(
                                'LT',
                              )}
                          </Text>
                        ) : (
                          <Text>
                            {strings('add_property_screen.select_start_time')}
                          </Text>
                        )}
                      </TouchableOpacity>
                      <View
                        style={{
                          width: '2%',
                          height: 2,
                          backgroundColor: 'black',
                          marginTop: 25,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            eveningShiftEndTimeShow: true,
                            eveningShiftEndTimeTextShow: true,
                            eveningShiftStartTimeShow: false,
                          })
                        }
                        style={{
                          height: 50,
                          width: '40%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: 'gray',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {this.state.eveningShiftEndTimeTextShow ? (
                          <Text>
                            {!!this.state.eveningShiftEndTime &&
                              moment(this.state.eveningShiftEndTime).format(
                                'LT',
                              )}
                          </Text>
                        ) : (
                          <Text>
                            {strings('add_property_screen.select_end_time')}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View></View>
              )}
            </View>
            {this.state.eveningShiftStartTimeShow && Platform.OS === 'ios' && (
              <TouchableOpacity
                style={{ width: '100%' }}
                onPress={() =>
                  this.setState({ eveningShiftStartTimeShow: false })
                }>
                <Text
                  style={{ alignSelf: 'flex-end', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, marginTop: 10 }}>
                  {strings('add_property_screen.close')}
                </Text>
              </TouchableOpacity>
            )}
            {this.state.eveningShiftStartTimeShow && (
              <DateTimePicker
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                value={this.state.eveningShiftStartTime}
                onChange={(event, value) => {
                  if (value == undefined) {
                    this.setState({
                      eveningShiftStartTime: new Date(),
                      eveningShiftStartTimeCheck: true,
                      eveningShiftStartTimeShow:
                        Platform.OS === 'ios' ? true : false,
                    });
                  } else {
                    this.setState({
                      eveningShiftStartTime: value,
                      eveningShiftStartTimeCheck: true,
                      eveningShiftStartTimeShow:
                        Platform.OS === 'ios' ? true : false,
                    });
                  }
                  if (event.type === 'set') {
                    //console.log('value:', value);
                  }
                }}
              />
            )}
            {this.state.eveningShiftEndTimeShow && Platform.OS === 'ios' && (
              <TouchableOpacity
                style={{ width: '100%' }}
                onPress={() => this.setState({ eveningShiftEndTimeShow: false })}>
                <Text
                  style={{ alignSelf: 'flex-end', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, marginTop: 10 }}>
                  {strings('add_property_screen.close')}
                </Text>
              </TouchableOpacity>
            )}
            {this.state.eveningShiftEndTimeShow && (
              <DateTimePicker
                is24Hour={false}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                value={this.state.eveningShiftEndTime}
                onChange={(event, value) => {
                  if (value == undefined) {
                    this.setState({
                      eveningShiftEndTime: new Date(),
                      eveningShiftEndTimeCheck: true,
                      eveningShiftEndTimeShow:
                        Platform.OS === 'ios' ? true : false,
                    });
                  } else {
                    this.setState({
                      eveningShiftEndTime: value,
                      eveningShiftEndTimeCheck: true,
                      eveningShiftEndTimeShow:
                        Platform.OS === 'ios' ? true : false,
                    });
                  }
                  if (event.type === 'set') {
                    //console.log('value:', value);
                  }
                }}
              />
            )}

            <Text
              style={{
                marginTop: 25,
                marginLeft: 5,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                fontFamily: AppFonts.PoppinsRegular,
              }}>
              {strings('add_property_screen.price_details')}
            </Text>
            {this.state.inputNumber == '' &&
              this.state.inputNumber2 == '' &&
              this.state.inputNumber3 == '' &&
              this.state.inputNumber4 == '' &&
              this.state.inputNumber5 == '' &&
              this.state.inputNumber5 == '' &&
              this.state.inputNumber6 == '' &&
              this.state.inputNumber7 == '' ? (
              <TouchableOpacity
                onPress={() => this.setState({ priceModal: true })}
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: 50,
                  backgroundColor: 'white',
                  width: '95%',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  // alignSelf: 'center',
                  // paddingTop: 15,
                  alignItems: 'center',
                  paddingLeft: 10,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12, fontFamily: AppFonts.PoppinsRegular }}>
                  {strings('add_property_screen.days_price')}
                </Text>
                <Text
                  style={{
                    color: '#B20C11',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                    fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {strings('add_property_screen.add')}
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                  // height: 50,
                  backgroundColor: 'white',
                  paddingBottom: 10,
                  width: '95%',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 25,
                  }}>
                  <Text
                    style={{
                      color: 'gray',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('add_property_screen.days')}
                  </Text>
                  <Text
                    style={{
                      color: 'gray',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('add_property_screen.price')}
                  </Text>
                  <Text
                    style={{
                      color: 'gray',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                      fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {strings('add_property_screen.down_payment')}
                  </Text>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: '#B20C11',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                    textAlign: 'right',
                    right: 60,
                  }}>
                  20%
                </Text>
                {this.state.inputNumber != '' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 10,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        color: '#B20C11',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        marginTop: 10,
                        width: '15%',
                      }}>
                      {strings('days.monday')}
                    </Text>

                    <TextInput
                      placeholderTextColor="#979191"
                      editable={false}
                      value={this.state.inputNumber}
                      onChangeText={(text) =>
                        this.setState({
                          inputNumber: text,
                        })
                      }
                      keyboardType="numeric"
                      placeholder={
                        this.state.countries == 'Jordan'
                          ? 'JOD'
                          : this.state.countries == 'Bahrain'
                            ? 'BHD'
                            : 'SAR'
                      }
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 5,
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}
                    />
                    <View
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                      }}>
                      {this.state.inputNumber != '' ? (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {Mon.toFixed(1)}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {this.state.countries == 'Jordan'
                            ? 'JOD'
                            : this.state.countries == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                {this.state.inputNumber2 != '' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 10,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        color: '#B20C11',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        marginTop: 10,
                        width: '15%',
                      }}>
                      {strings('days.tuesday')}
                    </Text>

                    <TextInput
                      placeholderTextColor="#979191"
                      editable={false}
                      value={this.state.inputNumber2}
                      onChangeText={(text) =>
                        this.setState({
                          inputNumber2: text,
                        })
                      }
                      keyboardType="numeric"
                      placeholder={
                        this.state.countries == 'Jordan'
                          ? 'JOD'
                          : this.state.countries == 'Bahrain'
                            ? 'BHD'
                            : 'SAR'
                      }
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 5,
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}
                    />
                    <View
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                      }}>
                      {this.state.inputNumber2 != '' ? (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {Tue.toFixed(1)}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {this.state.countries == 'Jordan'
                            ? 'JOD'
                            : this.state.countries == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                {this.state.inputNumber3 != '' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 10,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        color: '#B20C11',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        marginTop: 10,
                        width: '15%',
                      }}>
                      {strings('days.wednesday')}
                    </Text>

                    <TextInput
                      placeholderTextColor="#979191"
                      editable={false}
                      value={this.state.inputNumber3}
                      onChangeText={(text) =>
                        this.setState({
                          inputNumber3: text,
                        })
                      }
                      keyboardType="numeric"
                      placeholder={
                        this.state.countries == 'Jordan'
                          ? 'JOD'
                          : this.state.countries == 'Bahrain'
                            ? 'BHD'
                            : 'SAR'
                      }
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 5,
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}
                    />
                    <View
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                      }}>
                      {this.state.inputNumber3 != '' ? (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {wed.toFixed(1)}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {this.state.countries == 'Jordan'
                            ? 'JOD'
                            : this.state.countries == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                {this.state.inputNumber4 != '' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 10,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        color: '#B20C11',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        marginTop: 10,
                        width: '15%',
                      }}>
                      {strings('days.thursday')}
                    </Text>

                    <TextInput
                      placeholderTextColor="#979191"
                      editable={false}
                      value={this.state.inputNumber4}
                      onChangeText={(text) =>
                        this.setState({
                          inputNumber4: text,
                        })
                      }
                      keyboardType="numeric"
                      placeholder={
                        this.state.countries == 'Jordan'
                          ? 'JOD'
                          : this.state.countries == 'Bahrain'
                            ? 'BHD'
                            : 'SAR'
                      }
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 5,
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}
                    />
                    <View
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                      }}>
                      {this.state.inputNumber4 != '' ? (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {thu.toFixed(1)}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {this.state.countries == 'Jordan'
                            ? 'JOD'
                            : this.state.countries == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                {this.state.inputNumber5 != '' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 10,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        color: '#B20C11',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        marginTop: 10,
                        width: '15%',
                      }}>
                      {strings('days.friday')}
                    </Text>

                    <TextInput
                      placeholderTextColor="#979191"
                      editable={false}
                      value={this.state.inputNumber5}
                      onChangeText={(text) =>
                        this.setState({
                          inputNumber5: text,
                        })
                      }
                      keyboardType="numeric"
                      placeholder={
                        this.state.countries == 'Jordan'
                          ? 'JOD'
                          : this.state.countries == 'Bahrain'
                            ? 'BHD'
                            : 'SAR'
                      }
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 5,
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}
                    />
                    <View
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                      }}>
                      {this.state.inputNumber5 != '' ? (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {fri.toFixed(1)}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {this.state.countries == 'Jordan'
                            ? 'JOD'
                            : this.state.countries == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                {this.state.inputNumber6 != '' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 10,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        color: '#B20C11',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        marginTop: 10,
                        width: '15%',
                      }}>
                      {strings('days.saturday')}
                    </Text>

                    <TextInput
                      placeholderTextColor="#979191"
                      editable={false}
                      value={this.state.inputNumber6}
                      onChangeText={(text) =>
                        this.setState({
                          inputNumber6: text,
                        })
                      }
                      keyboardType="numeric"
                      placeholder={
                        this.state.countries == 'Jordan'
                          ? 'JOD'
                          : this.state.countries == 'Bahrain'
                            ? 'BHD'
                            : 'SAR'
                      }
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 5,
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}
                    />
                    <View
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                      }}>
                      {this.state.inputNumber6 != '' ? (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {sat.toFixed(1)}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {this.state.countries == 'Jordan'
                            ? 'JOD'
                            : this.state.countries == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                {this.state.inputNumber7 != '' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 10,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        color: '#B20C11',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        marginTop: 10,
                        width: '15%',
                      }}>
                      {strings('days.sunday')}
                    </Text>

                    <TextInput
                      placeholderTextColor="#979191"
                      editable={false}
                      value={this.state.inputNumber7}
                      onChangeText={(text) => {
                        let temp = text;
                        if (temp < 6) {
                          this.setState({
                            inputNumber7: text,
                          });
                        }
                      }}
                      keyboardType="numeric"
                      placeholder={
                        this.state.countries == 'Jordan'
                          ? 'JOD'
                          : this.state.countries == 'Bahrain'
                            ? 'BHD'
                            : 'SAR'
                      }
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 5,
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}
                    />
                    <View
                      style={{
                        height: 40,
                        width: '20%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                      }}>
                      {this.state.inputNumber7 != '' ? (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {sun.toFixed(1)}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginTop: 10,
                            marginLeft: 5,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            textAlign: 'center',
                          }}>
                          {this.state.countries == 'Jordan'
                            ? 'JOD'
                            : this.state.countries == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => this.setState({ priceModal: true })}
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text></Text>
                  <Text
                    style={{
                      color: '#B20C11',
                      marginRight: 40,
                    }}>
                    {strings('add_property_screen.add')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  left: 5,
                  marginTop: 30,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {strings('add_property_screen.special_offer')}
              </Text>
              <Slider
                style={{ width: '100%', height: 50 }}
                value={this.state.astbeltProgress}
                minimumValue={0}
                maximumValue={100}
                inverted={Preference.get('language') == 'ar' ? true : false}
                minimumTrackTintColor="#B20C11"
                thumbTintColor="#B20C11"
                maximumTrackTintColor="#99999920"
                onSlidingComplete={(value) => {
                  this.setState({ astbeltProgress: value });
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 5,
                }}>
                <Text>{'0%'}</Text>
                <Text>{this.state.astbeltProgress.toFixed(0) + '%'}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 40,
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    termsAndConditions:
                      this.state.termsAndConditions == false ? true : false,
                  })
                }
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  borderColor: this.state.termsAndConditions
                    ? '#B20C11'
                    : 'gray',
                  marginRight: 10,
                  borderRadius: 5,
                }}>
                {this.state.termsAndConditions && (
                  <Image
                    source={require('../../../assets/images/blue-tick.png')}
                    style={{
                      width: 20,
                      height: 20,
                      right: lang == 'en' ? -5 : 0,
                      left: lang == 'en' ? 0 : -5,
                      top: -5,
                      resizeMode: 'contain',
                      tintColor: '#B20C11',
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12 }}>
                {strings('payment_screen.terms_condition1')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({ webViewDisplay: true })}
              style={{ alignItems: 'center', marginLeft: 20 }}>
              <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12, color: '#B20C11' }}>
                {strings('payment_screen.terms_condition2')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.uploadImagesToServer()
                // this.inputcheck();
                // this.add_Property()
              }}
              disabled={!this.state.termsAndConditions}
              style={{
                backgroundColor: this.state.termsAndConditions
                  ? '#B20C11'
                  : 'gray',
                height: 40,
                width: '60%',
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 10,
                marginBottom: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                }}>
                {strings('add_property_screen.submit')}
              </Text>
            </TouchableOpacity>

            <Modal
              style={{ height: 700 }}
              animationType="slide"
              transparent={true}
              visible={this.state.isVisible}
              onRequestClose={() => {
                this.setState({ isVisible: false });
                // Alert.alert('Modal has been closed.');
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#00000099',
                }}>
                <View
                  style={{
                    height: 500,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: '100%',
                      width: '92%',
                      paddingVertical: 15,
                      marginTop: 22,
                      margin: 40,
                      backgroundColor: 'white',
                    }}>
                    <View
                      style={{
                        paddingHorizontal: 30,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{ fontWeight: 'bold', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16 }}>
                        {strings('add_property_screen.add_amanaties')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ isVisible: false });
                        }}>
                        <Image
                          source={require('../../../assets/images/close.png')}
                          style={{ width: 20, height: 20, resizeMode: 'contain' }}
                        />
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      data={this.state.listAmanties}
                      extraData={this.state.listAmanties}
                      renderItem={({ item, index }) => {
                        // if(index==0&&item.isSelected>0){
                        //   item.isSelected=this.state.count
                        //   console.log(item.isSelected,this.state.count)
                        // }
                        let baseUrl = 'https://doshag.net/admin/public';
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 18,
                              margin: 20,
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '25%',
                              }}>
                              <Image
                                style={{
                                  width: '100%',
                                  height: 25,
                                  resizeMode: 'contain',
                                  // borderColor:"red",
                                  // borderWidth:1
                                }}
                                source={{ uri: baseUrl + item.icon }}
                              />
                              <Text
                                style={{
                                  color: 'gray',
                                  marginTop: 10,
                                  alignSelf: 'center',
                                  textAlign: 'center',
                                }}>
                                {lang == 'en'
                                  ? item.eng_name
                                  : item.arabic_name}
                              </Text>
                            </View>
                            {item.quantity != 0 ? (
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  justifyContent: 'space-evenly',
                                }}>
                                {/* {console.log("yes",item.isSelected)} */}
                                <TouchableOpacity
                                  onPress={() => {
                                    let temp = this.state.listAmanties;
                                    for (let i = 0; i < temp.length; i++) {
                                      if (i === index && item.quantity > 1) {
                                        temp[i].quantity = temp[i].quantity - 1;
                                      }
                                    }
                                    this.setState({ listAmanties: temp });
                                  }}
                                  style={{
                                    backgroundColor: '#e9ecf2',
                                    height: 30,
                                    width: '15%',
                                    borderRadius: 5,
                                    // marginTop: 10,
                                  }}>
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 23,
                                    }}>
                                    -
                                  </Text>
                                </TouchableOpacity>
                                <Text
                                // style={{
                                //   marginTop: 15,
                                // }}
                                >
                                  {item.quantity}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    // this.setState({count: count + 1});
                                    let temp = this.state.listAmanties;
                                    for (let i = 0; i < temp.length; i++) {
                                      if (i === index) {
                                        // console.log(index)
                                        temp[i].quantity = temp[i].quantity + 1;
                                      }
                                    }
                                    this.setState({ listAmanties: temp });
                                    // console.log(this.state.listAmanties)
                                  }}
                                  style={{
                                    backgroundColor: '#e9ecf2',
                                    height: 30,
                                    width: '15%',
                                    borderRadius: 5,
                                    // marginTop: 10,
                                  }}>
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 23,
                                    }}>
                                    +
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : null}
                            <CheckBox
                              onTintColor="white"
                              onCheckColor="white"
                              onFillColor="green"
                              disabled={false}
                              value={item.quantity == 0 ? false : true}
                              onValueChange={() => {
                                let temparray = this.state.listAmanties;
                                if (temparray[index].quantity == 0) {
                                  temparray[index].quantity = 1;
                                } else if (temparray[index].quantity > 0) {
                                  //console.log('else');
                                  temparray[index].quantity = 0;
                                }

                                this.setState({ listAmanties: temparray });
                              }}
                            />
                          </View>
                        );
                      }}
                    />

                    <TouchableOpacity
                      style={{ marginTop: 15 }}
                      onPress={() => {
                        this.setState({ isVisible: false });
                      }}>
                      <Text
                        style={{
                          // marginTop:50,
                          color: '#B20C11',
                          textAlign: 'right',
                          marginRight: 20,
                        }}>
                        {strings('add_property_screen.ok')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              onRequestClose={() => {
                this.setState({ priceModal: false });
              }}
              visible={this.state.priceModal}>
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#000000AA',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <KeyboardAwareScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  style={{
                    width: '100%',
                    flex: 1,
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      width: '90%',
                      paddingBottom: 15,
                      marginTop: 100,
                      margin: 40,
                      backgroundColor: 'white',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 18,
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          marginTop: 10,
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                        }}>
                        {strings('add_property_screen.days_price')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ priceModal: false });
                        }}>
                        <Image
                          style={{
                            marginTop: 10,
                            height: 20,
                            width: 20,
                            marginRight: 20,
                            // backgroundColor:'red'
                          }}
                          source={require('../../../assets/images/close.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 25,
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: 'gray',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                          width: '20%',
                        }}>
                        {strings('add_property_screen.days')}
                      </Text>
                      <Text
                        style={{
                          color: 'gray',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        }}>
                        {strings('add_property_screen.price')}
                      </Text>
                      <Text
                        style={{
                          color: 'gray',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        }}>
                        {strings('add_property_screen.down_payment')}
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginTop: 10,
                        color: '#B20C11',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                        textAlign: 'right',
                        right: 60,
                      }}>
                      20%
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                          marginTop: 10,
                          width: '15%',
                        }}>
                        {strings('days.monday')}
                      </Text>

                      <TextInput
                        placeholderTextColor="#979191"
                        value={this.state.inputNumber}
                        onChangeText={(text) => {
                          let temp = text;
                          if (temp.length < 7) {
                            this.setState({
                              inputNumber: text,
                            });
                          }
                        }}
                        keyboardType="numeric"
                        placeholder={
                          Preference.get('country') == 'Jordan'
                            ? 'JOD'
                            : Preference.get('country') == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'
                        }
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                          padding: 5,
                          textAlign: 'center',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                        }}
                      />
                      <View
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                        }}>
                        {this.state.inputNumber != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {Mon.toFixed(1)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {Preference.get('country') == 'Jordan'
                              ? 'JOD'
                              : Preference.get('country') == 'Bahrain'
                                ? 'BHD'
                                : 'SAR'}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                          marginTop: 10,
                          width: '15%',
                        }}>
                        {strings('days.tuesday')}
                      </Text>

                      <TextInput
                        placeholderTextColor="#979191"
                        value={this.state.inputNumber2}
                        onChangeText={(text) => {
                          let temp = text;
                          if (temp.length < 7) {
                            this.setState({
                              inputNumber2: text,
                            });
                          }
                        }}
                        keyboardType="numeric"
                        placeholder={
                          Preference.get('country') == 'Jordan'
                            ? 'JOD'
                            : Preference.get('country') == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'
                        }
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                          padding: 5,
                          textAlign: 'center',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                        }}
                      />
                      <View
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                        }}>
                        {this.state.inputNumber2 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {Tue.toFixed(1)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {Preference.get('country') == 'Jordan'
                              ? 'JOD'
                              : Preference.get('country') == 'Bahrain'
                                ? 'BHD'
                                : 'SAR'}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                          marginTop: 10,
                          width: '15%',
                        }}>
                        {strings('days.wednesday')}
                      </Text>

                      <TextInput
                        placeholderTextColor="#979191"
                        value={this.state.inputNumber3}
                        onChangeText={(text) => {
                          let temp = text;
                          if (temp.length < 7) {
                            this.setState({
                              inputNumber3: text,
                            });
                          }
                        }}
                        keyboardType="numeric"
                        placeholder={
                          Preference.get('country') == 'Jordan'
                            ? 'JOD'
                            : Preference.get('country') == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'
                        }
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                          padding: 5,
                          textAlign: 'center',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                        }}
                      />
                      <View
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                        }}>
                        {this.state.inputNumber3 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {wed.toFixed(1)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {Preference.get('country') == 'Jordan'
                              ? 'JOD'
                              : Preference.get('country') == 'Bahrain'
                                ? 'BHD'
                                : 'SAR'}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                          marginTop: 10,
                          width: '15%',
                        }}>
                        {strings('days.thursday')}
                      </Text>

                      <TextInput
                        placeholderTextColor="#979191"
                        value={this.state.inputNumber4}
                        onChangeText={(text) => {
                          let temp = text;
                          if (temp.length < 7) {
                            this.setState({
                              inputNumber4: text,
                            });
                          }
                        }}
                        keyboardType="numeric"
                        placeholder={
                          Preference.get('country') == 'Jordan'
                            ? 'JOD'
                            : Preference.get('country') == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'
                        }
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                          padding: 5,
                          textAlign: 'center',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                        }}
                      />
                      <View
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                        }}>
                        {this.state.inputNumber4 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {thu.toFixed(1)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {Preference.get('country') == 'Jordan'
                              ? 'JOD'
                              : Preference.get('country') == 'Bahrain'
                                ? 'BHD'
                                : 'SAR'}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                          marginTop: 10,
                          width: '15%',
                        }}>
                        {strings('days.friday')}
                      </Text>

                      <TextInput
                        placeholderTextColor="#979191"
                        value={this.state.inputNumber5}
                        onChangeText={(text) => {
                          let temp = text;
                          if (temp.length < 7) {
                            this.setState({
                              inputNumber5: text,
                            });
                          }
                        }}
                        keyboardType="numeric"
                        placeholder={
                          Preference.get('country') == 'Jordan'
                            ? 'JOD'
                            : Preference.get('country') == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'
                        }
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                          padding: 5,
                          textAlign: 'center',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                        }}
                      />
                      <View
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                        }}>
                        {this.state.inputNumber5 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {fri.toFixed(1)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {Preference.get('country') == 'Jordan'
                              ? 'JOD'
                              : Preference.get('country') == 'Bahrain'
                                ? 'BHD'
                                : 'SAR'}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                          marginTop: 10,
                          width: '15%',
                        }}>
                        {strings('days.saturday')}
                      </Text>

                      <TextInput
                        placeholderTextColor="#979191"
                        value={this.state.inputNumber6}
                        onChangeText={(text) => {
                          let temp = text;
                          if (temp.length < 7) {
                            this.setState({
                              inputNumber6: text,
                            });
                          }
                        }}
                        keyboardType="numeric"
                        placeholder={
                          Preference.get('country') == 'Jordan'
                            ? 'JOD'
                            : Preference.get('country') == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'
                        }
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                          padding: 5,
                          textAlign: 'center',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                        }}
                      />
                      <View
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                        }}>
                        {this.state.inputNumber6 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {sat.toFixed(1)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {Preference.get('country') == 'Jordan'
                              ? 'JOD'
                              : Preference.get('country') == 'Bahrain'
                                ? 'BHD'
                                : 'SAR'}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                          marginTop: 10,
                          width: '15%',
                        }}>
                        {strings('days.sunday')}
                      </Text>

                      <TextInput
                        placeholderTextColor="#979191"
                        value={this.state.inputNumber7}
                        onChangeText={(text) => {
                          let temp = text;
                          if (temp.length < 7) {
                            this.setState({
                              inputNumber7: text,
                            });
                          }
                        }}
                        keyboardType="numeric"
                        placeholder={
                          Preference.get('country') == 'Jordan'
                            ? 'JOD'
                            : Preference.get('country') == 'Bahrain'
                              ? 'BHD'
                              : 'SAR'
                        }
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                          padding: 5,
                          textAlign: 'center',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                        }}
                      />
                      <View
                        style={{
                          height: 40,
                          width: '20%',
                          backgroundColor: 'white',
                          borderRadius: 10,
                          borderColor: 'gray',
                          borderWidth: 1,
                        }}>
                        {this.state.inputNumber7 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {sun.toFixed(1)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                              textAlign: 'center',
                            }}>
                            {Preference.get('country') == 'Jordan'
                              ? 'JOD'
                              : Preference.get('country') == 'Bahrain'
                                ? 'BHD'
                                : 'SAR'}
                          </Text>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ priceModal: false });
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          textAlign: 'right',
                          marginRight: 20,
                          marginTop: 10,
                        }}>
                        {strings('add_property_screen.ok')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </KeyboardAwareScrollView>
          {this.state.loading && <Loader />}
          {this.state.webViewDisplay && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: '#fbf4ed',
              }}>
              <WebView
                style={{ flex: 1 }}
                contentInset={{ top: 10, bottom: 10, right: 10, left: 10 }}
                source={{ uri: 'https://doshag.net/terms-of-service-2/' }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ webViewDisplay: false });
                }}
                style={{
                  // flex: 1,
                  height: 40,
                  width: '60%',
                  marginVertical: 20,
                  marginRight: 10,
                  padding: 8,
                  borderColor: '#B20C11',
                  borderRadius: 10,
                  borderWidth: 1,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: '#B20C11',
                    textAlign: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                  }}>
                  {strings('add_property_screen.close')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingTop: 150,
    alignItems: 'center',
    backgroundColor: '#cbf35c',
  },
  less: { writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 25, color: '#4d3398', fontWeight: 'bold' },
  greater: { writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 25, color: '#f3845c', fontWeight: 'bold' },
  button: {
    width: 150,
    height: 50,
    alignItems: 'center',
    paddingTop: 10,
    borderRadius: 10,
    backgroundColor: '#3498db',
  },
  buttonText: {
    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 25,
    color: '#fff',
  },
});
