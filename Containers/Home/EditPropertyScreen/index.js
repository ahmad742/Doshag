import React, {Component} from 'react';
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
  Alert,
  Button,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../component/TopHeader/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment, {invalid} from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import Api from '../../../network/Api';
import Preference from 'react-native-preference';
import Loader from '../../../component/Loader/Loader';
import {constants} from '../../../config/constants';
import {strings} from '../../../i18n';
import Slider from '@react-native-community/slider';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

const lang = Preference.get('language');
const {width, height} = Dimensions.get('window');
let country = [
  {
    value: 'saudi',
    label: 'Saudi',
  },
  {
    value: 'jordain',
    label: 'Jordain',
  },
  {
    value: 'beharain',
    label: 'Beharain',
  },
];

let length;
export default class Add extends Component {
  constructor(props) {
    super(props);
    const now = new Date();
    this.state = {
      show: false,
      property_id: undefined,
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
      listUploadLocally: [],
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
      startTime2: new Date(),
      morningShiftStartTime: new Date(),
      morningShiftStartTime2: new Date(),
      eveningShiftStartTime: new Date(),
      eveningShiftStartTime2: new Date(),
      endTime: new Date(),
      endTime2: new Date(),
      morningShiftEndTime: new Date(),
      morningShiftEndTime2: new Date(),
      eveningShiftEndTime: new Date(),
      eveningShiftEndTime2: new Date(),
      loading: false,
      name_In_English: '',
      name_In_Arabic: '',
      countries: '',
      city: '',
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
      slider: '100',
      error: '',
      countri: [],
      region: null,
      isMapReady: false,
      marginTop: 1,
      userLocation: '',
      regionChangeProgress: false,
      selectedCities: [],
      longitude: null,
      latittude: null,
      cities: '',
      listAmantie2: [],
      listAmanties: [],
      address: '',
    };
  }

  componentDidMount() {
    this.get();
    // this.location();
    this.setCountries();
  }

  get() {
    this.setState({loading: true});
    const {params} = this.props.navigation.state;
    const itemId = params ? params.itemId : null;
    this.setState({property_id: itemId});
    // //console.log('PropertyID: ', itemId);
    let body = new FormData();
    body.append('property_id', itemId);
    //console.log('BodyData', body);
    Api.propertyDetailById(body)
      .then(
        function (response) {
          console.log('Property Details:-- ', JSON.stringify(response));
          // //console.log('Property Details:-- ', JSON.stringify(response.Eminities));
          let mainResponse = response.data[0];
          // console.log(
          //   'Property Details:----',
          //   mainResponse.special_offer,
          //   typeof parseInt(mainResponse.special_offer),
          // );
          length = parseInt(mainResponse.special_offer);
          let tempPrice = [];
          tempPrice = mainResponse.property_prices;
          const region = {
            latitude: parseFloat(mainResponse.latitude),
            longitude: parseFloat(mainResponse.longitude),
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          };
          let tempArray = response.data[0].property_files;
          let pricesArray = response.data[0].property_prices;
          for (let i = 0; i < pricesArray.length; i++) {
            if (pricesArray[i].day == 'Sunday') {
              this.setState({inputNumber7: pricesArray[i].price});
            }
            if (pricesArray[i].day == 'Saturday') {
              this.setState({inputNumber6: pricesArray[i].price});
            }
            if (pricesArray[i].day == 'Friday') {
              this.setState({inputNumber5: pricesArray[i].price});
            }
            if (pricesArray[i].day == 'Thursday') {
              this.setState({inputNumber4: pricesArray[i].price});
            }
            if (pricesArray[i].day == 'Wednesday') {
              this.setState({inputNumber3: pricesArray[i].price});
            }
            if (pricesArray[i].day == 'Tuesday') {
              this.setState({inputNumber2: pricesArray[i].price});
            }
            if (pricesArray[i].day == 'Monday') {
              this.setState({inputNumber: pricesArray[i].price});
            }
          }
          let temp = response.Eminities[0].property_amenities,
            tempAminities = [];
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].quantity > 0) {
              tempAminities.push({
                id: temp[i].id,
                user_id: temp[i].user_id,
                property_id: temp[i].property_id,
                amenity_id: temp[i].amenity_id,
                quantity: temp[i].quantity,
                created_at: temp[i].created_at,
                updated_at: temp[i].updated_at,
                aminity: {
                  id: temp[i].aminity.id,
                  eng_name: temp[i].aminity.eng_name,
                  arabic_name: temp[i].aminity.arabic_name,
                  icon: temp[i].aminity.icon,
                  created_at: temp[i].aminity.created_at,
                  updated_at: temp[i].aminity.updated_at,
                },
              });
            }
          }
          this.setState({
            loading: false,
            name_In_English: mainResponse.eng_name,
            name_In_Arabic: mainResponse.arabic_name,
            countries: mainResponse.country,
            city: mainResponse.city,
            property_Type: mainResponse.type,
            // specific_Type: mainResponse.sub_type,
            description: mainResponse.description,
            astbeltProgress: parseInt(mainResponse.special_offer),
            reservations: mainResponse.reservation,
            first: mainResponse.specific_time,
            second: mainResponse.full_day,
            startTime:
              mainResponse.start_time == null
                ? new Date()
                : mainResponse.start_time,
            endTime:
              mainResponse.end_time == null
                ? new Date()
                : mainResponse.end_time,
            morningShiftStartTime:
              mainResponse.start_time == null
                ? new Date()
                : mainResponse.start_time,
            morningShiftEndTime:
              mainResponse.end_time == null
                ? new Date()
                : mainResponse.end_time,
            eveningShiftStartTime:
              mainResponse.eve_start_time == null
                ? new Date()
                : mainResponse.eve_start_time,
            eveningShiftEndTime:
              mainResponse.eve_end_time == null
                ? new Date()
                : mainResponse.eve_end_time,
            listAmanties: response.Eminities[0].property_amenities,
            listAmantie2: tempAminities,
            // count: parseInt(response.Eminities[0].no_of_bathroom),
            // region: region,
            address: mainResponse.location,
            latittude: mainResponse.latitude,
            longitude: mainResponse.longitude,
            list: tempArray,
          });
          this.setCities(this.state.countries);
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

  // location() {
  //   this.setState({loading: true});
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       // //console.log('-------------', 'mee aa gyasaaa');
  //       const region = {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         latitudeDelta: 0.001,
  //         longitudeDelta: 0.001,
  //       };

  //       // console.log(region);
  //       this.setState({
  //         region: region,
  //         loading: false,
  //         error: null,
  //       });
  //     },
  //     (error) => {
  //       // //console.log('location error', error);
  //       // alert(error.message);
  //       this.setState({
  //         // error: error.message,
  //         loading: false,
  //       });
  //       if (error.code == 2) {
  //         if (Platform.OS === 'ios') {
  //           Linking.openURL('app-settings:');
  //         } else {
  //           RNSettings.openSetting(
  //             RNSettings.ACTION_LOCATION_SOURCE_SETTINGS,
  //           ).then((result) => {
  //             if (result === RNSettings.ENABLED) {
  //               this.location();
  //             }
  //           });
  //         }
  //       }
  //       if (error.code == 3) {
  //         this.location();
  //       }
  //     },
  //     {enableHighAccuracy: false, timeout: 200000, maximumAge: 5000},
  //   );
  // }

  onMapReady = () => {
    this.setState({isMapReady: true, marginTop: 0});
  };

  // Fetch location details as a JOSN from google map API
  fetchAddress = () => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        this.state.region.latitude +
        ',' +
        this.state.region.longitude +
        '&key=' +
        'AIzaSyAXW-WDp0MF5si6oFXaukDQuThTr1wqmDE',
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
  // Update state on region change
  onRegionChange = (region) => {
    this.setState(
      {
        region,
        regionChangeProgress: true,
      },
      () => this.fetchAddress(),
    );
  };

  // Action to be taken after select location button click
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
  imagePickFromGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      compressImageQuality: 0.3,
      width: 400,
      height: 400,
      // cropping: true,
    }).then((response) => {
      //console.log('imagePickFromGallery', 'response', response);
      let sources = this.state.listUploadLocally;
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
        });
        this.setState({listUploadLocally: sources}, () => {
          console.log(
            'Imageslist',
            JSON.stringify(this.state.listUploadLocally),
          );
          this.uploadImagesToServer();
        });
      }
    });
  };

  uploadImagesToServer = async () => {
    //console.log('UPLOADIMGIMAGE');
    let data = new FormData();
    await this.state.listUploadLocally.forEach((item, i) => {
      data.append('images[]', {
        uri: item.uri,
        type: item.type,
        name: item.filename || `filename${i}.jpg`,
      });
    });
    //console.log('ApiURL: ', constants.ApiBaseURL + 'local_image_storage');
    //console.log('ApiDATA: ', JSON.stringify(data));
    console.log(
      'ApiToken: ',
      JSON.stringify('Bearer ' + Preference.get('token')),
    );
    fetch(constants.ApiBaseURL + 'local_image_storage', {
      method: 'POST',
      headers: {
        //Accept: "application/json",
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + Preference.get('token'),
      },
      body: data,
    })
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((response) => {
        //console.log('ApiDATA: ', JSON.stringify(response));
        let oldImages = this.state.ImagesList;
        response.data.map((item) => {
          this.state.list.push(item);
        });

        this.setState({ImagesList: response.data});
        /*Alert.alert(
                "Success",
                "Bill of Loading Uploaded Successfully!",
                [{text: "OK", onPress: () => that.props.close()}],
                {cancelable: false}
            );*/
      })
      .catch((err) => {
        console.error('error uploading images: ', err);
      });
  };

  timepicker = () => {
    this.show('time');
  };

  setCount = () =>
    this.setState((prevState) => ({...prevState, count: this.state.count + 1}));

  checkBox(text) {
    this.setState({first: 0, second: 0});
    if (text === 'first' && this.state.first === 0) {
      this.setState({first: 1, second: false});
    } else if (text === 'first' && this.state.first === 1) {
      this.setState({first: 0, second: 1});
    } else if (text === 'second' && this.state.second === 0) {
      this.setState({first: 0, second: 1});
    } else if (text === 'second' && this.state.second === 1) {
      this.setState({first: 0, second: 0});
    }
  }

  lefAction() {
    this.props.navigation.goBack();
  }

  onRegionChange(region) {
    this.setState({region});
  }

  updateProperty = () => {
    this.setState({loading: true});
    let tempData = [];
    let Mon = (20 / 100) * parseInt(this.state.inputNumber);
    let Tue = (20 / 100) * parseInt(this.state.inputNumber2);
    let wed = (20 / 100) * parseInt(this.state.inputNumber3);
    let thu = (20 / 100) * parseInt(this.state.inputNumber4);
    let fri = (20 / 100) * parseInt(this.state.inputNumber5);
    let sat = (20 / 100) * parseInt(this.state.inputNumber6);
    let sun = (20 / 100) * parseInt(this.state.inputNumber7);
    let day1 = ['Monday', this.state.inputNumber, Mon.toFixed(2)];
    let day2 = ['Tuesday', this.state.inputNumber2, Tue.toFixed(2)];
    let day3 = ['Wednesday', this.state.inputNumber3, wed.toFixed(2)];
    let day4 = ['Thursday', this.state.inputNumber4, thu.toFixed(2)];
    let day5 = ['Friday', this.state.inputNumber5, fri.toFixed(2)];
    let day6 = ['Saturday', this.state.inputNumber6, sat.toFixed(2)];
    let day7 = ['Sunday', this.state.inputNumber7, sun.toFixed(2)];
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
    //   subtype = '';
    // }
    let startTime = '';
    let endTime = '';
    let eveStartTime = '';
    let eveEndTime = '';
    if (this.state.reservations == 1) {
      if (this.state.first == 1) {
        startTime = moment(this.state.startTime).format('hh:mm a');
        endTime = moment(this.state.endTime).format('hh:mm a');
        eveStartTime = '';
        eveEndTime = '';
      } else {
        startTime = '';
        endTime = '';
        eveStartTime = '';
        eveEndTime = '';
      }
    } else {
      startTime = moment(this.state.morningShiftStartTime).format('hh:mm a');
      endTime = moment(this.state.morningShiftEndTime).format('hh:mm a');
      eveStartTime = moment(this.state.eveningShiftEndTime).format('hh:mm a');
      eveEndTime = moment(this.state.eveningShiftStartTime).format('hh:mm a');
    }
    let temp = this.state.list,
      images = [];
    for (let i = 0; i < temp.length; i++) {
      images.push(temp[i].file_name);
    }
    let bodyData = {
      property_id: this.state.property_id,
      eng_name: this.state.name_In_English,
      arabic_name: this.state.name_In_Arabic,
      country: this.state.countries,
      city: this.state.city,
      location: this.state.address,
      type: this.state.property_Type,
      // sub_type: subtype,
      description: this.state.description,
      price: tempData,
      special_offer: this.state.astbeltProgress.toFixed(0),
      images: images,
      reservation: this.state.reservations,
      full_day: this.state.second,
      specific_time: this.state.first,
      start_time: startTime,
      end_time: endTime,
      eve_end_time: eveStartTime,
      eve_start_time: eveEndTime,
      latitude: this.state.latittude,
      longitude: this.state.longitude,
    };

    //console.log('DATA:----', JSON.stringify(bodyData));
    Api.updateProperty(bodyData)
      .then(
        function (response) {
          console.log('UpdateAPIResponse: ', JSON.stringify(bodyData));
          if (response.status == 200) {
            this.saveAminitiesToServer();
            // this.props.navigation.goBack();

            return false;
          } else {
            // Preference.set('phon_no', this.state.mobile_Number);
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

  saveAminitiesToServer = async () => {
    //console.log('UPLOADINAMINITIES');
    let Ameneties = this.state.listAmanties;
    let tempArray = [];
    for (let i = 0; i < Ameneties.length; i++) {
      tempArray.push({
        amenity: Ameneties[i].aminity.id,
        quantity: Ameneties[i].quantity,
      });
    }
    const body = JSON.stringify({
      property_id: this.state.property_id,
      amenities: tempArray,
    });
    // let body = new FormData();
    // body.append('property_id', this.state.property_id);
    // body.append('user_id', Preference.get('userId'));
    // body.append('television', Ameneties[1].isSelected);
    // body.append('balcony', Ameneties[3].isSelected);
    // body.append('bed_room', Ameneties[4].isSelected);
    // body.append('bedroom_comforts', Ameneties[5].isSelected);
    // body.append('big_tent', Ameneties[6].isSelected);
    // body.append('campfire', Ameneties[7].isSelected);
    // body.append('car_parking', Ameneties[8].isSelected);
    // body.append('coffee_maker', Ameneties[9].isSelected);
    // body.append('dish_washer', Ameneties[10].isSelected);
    // body.append('dryer', Ameneties[11].isSelected);
    // body.append('elevator', Ameneties[12].isSelected);
    // body.append('fireplace', Ameneties[13].isSelected);
    // body.append('floor', Ameneties[14].isSelected);
    // body.append('garden', Ameneties[15].isSelected);
    // body.append('gym', Ameneties[16].isSelected);
    // body.append('heater', Ameneties[17].isSelected);
    // body.append('hair_dryer', Ameneties[18].isSelected);
    // body.append('bathroom_essentials', Ameneties[19].isSelected);
    // body.append('jacuzzi', Ameneties[20].isSelected);
    // body.append('kitchen', Ameneties[21].isSelected);
    // body.append('pitch', Ameneties[23].isSelected);
    // body.append('pool', Ameneties[24].isSelected);
    // body.append('refrigerator', Ameneties[25].isSelected);
    // body.append('sausage', Ameneties[26].isSelected);
    // body.append('security_room', Ameneties[27].isSelected);
    // body.append('small_tent', Ameneties[28].isSelected);
    // body.append('stereo', Ameneties[30].isSelected);
    // body.append('laundry_room', Ameneties[31].isSelected);
    // body.append('kids_games', Ameneties[32].isSelected);
    // body.append('volleyball_pitch', Ameneties[34].isSelected);
    // body.append('bathroom', Ameneties[0].isSelected);
    // body.append('air_conditioner', Ameneties[33].isSelected);
    // body.append('microwave', Ameneties[22].isSelected);
    // body.append('wifi', Ameneties[2].isSelected);
    // body.append('security', Ameneties[29].isSelected);
    // body.append('no_of_bathroom', this.state.count);
    //console.log('DatasendingAminities: ', JSON.stringify(body));
    Api.storeAmeneties(body)
      .then(
        function (response) {
          this.setState({loading: false});
          //console.log('storeAmenetiesAPIResponse: ', JSON.stringify(response));
          if (response.status == 201) {
            //return false;
            //Alert.alert("Alert","Aminities Saved")
            this.props.navigation.goBack();
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
      country.push({
        label:
          lang == 'en'
            ? countriesDetails[i].name
            : countriesDetails[i].arabic_name,
        value: countriesDetails[i].name,
        icon: () => (
          <Image
            source={{uri: imageBaseUrl + countriesDetails[i].flag_image}}
            style={{width: 35, height: 20}}
          />
        ),
      });
    }
    this.setState({
      countri: country,
    });
  };
  setCities = async (shaher) => {
    ////console.log('AllCountries');
    let cities = undefined;
    try {
      cities = JSON.parse(await AsyncStorage.getItem('countries'));
      ////console.log('AllCountries', JSON.stringify(cities));
      this.setState({cities: cities});
      if (cities !== null) {
        // We have data!!
        //console.log("AllCountries ",cities);
      }
    } catch (error) {
      //console.log('AllCountries Error', JSON.stringify(error));
    }

    let realCities = [];
    // //console.log('AllCountries', JSON.stringify(cities));
    for (let i = 0; i < cities.length; i++) {
      ////console.log('AllCountries', cities[i].name+"=="+mulk );
      if (cities[i].name === shaher) {
        let real = cities[i].cities;
        ////console.log('cities', JSON.stringify(real));
        for (let j = 0; j < real.length; j++) {
          realCities.push({
            label: lang == 'en' ? real[j].eng_name : real[j].arabic_name,
            value: real[j].eng_name,
          });
        }
      }
    }
    this.setState({selectedCities: realCities}, () => {});
  };
  remove = (index, id) => {
    //console.log('imageID:-----', index, id);
    if (id == undefined) {
      this.state.list.splice(index, 1);
    } else {
      let body = new FormData();
      body.append('id', id);
      //console.log('deletingImage: ', JSON.stringify(body));
      Api.removeFile(body)
        .then(
          function (response) {
            this.setState({loading: false});
            console.log(
              'storeAmenetiesAPIResponse: ',
              JSON.stringify(response),
            );
            if (response.Status == 200) {
              this.state.list.splice(index, 1);
            } else {
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
            Alert.alert(strings('activities_screen.alert'), error.message, [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          }.bind(this),
        );
    }
  };

  render() {
    const {show, date, mode} = this.state;
    let {imageArray} = this.state;
    const {count} = this.state;
    const {
      broadcasting,
      astbeltProgress,
      rangeLow,
      rangeHigh,
      min,
      max,
    } = this.state;
    return (
      <>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('add_property_screen.edit_propert')}
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
                  renderItem={({item, index}) => {
                    return (
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            backgroundColor: 'navy',
                            height: 120,
                            width: 90,
                            margin: 5,
                          }}>
                          <Image
                            source={{
                              uri:
                                'https://doshag.net/admin/public/images/property_images/' +
                                item.file_name,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              resizeMode: 'cover',
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            this.remove(index, item.id);
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
                    this.imagePickFromGallery();
                  }}>
                  <Image
                    source={require('../../../assets/images/down.png')}
                    style={{width: '100%', height: '100%'}}
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
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                  }}>
                  {strings('add_property_screen.name_english')}
                </Text>
                <TextInput
                  placeholder={'Enter you property name in English'}
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
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                  }}>
                  {strings('add_property_screen.name_arabic')}
                </Text>
                <TextInput
                  placeholder={'Enter you property name In Arabic'}
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
              {/* <View style={{zIndex:10}}> */}
              {Platform.OS === 'ios' ? (
                <View style={{zIndex: 10}}>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('add_property_screen.country')}
                  </Text>
                  <DropDownPicker
                    items={this.state.countri.sort(function (a, b) {
                      return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                    })}
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
                    dropDownStyle={{backgroundColor: 'white'}}
                    onChangeItem={(item) => {
                      this.setCities(item.value);
                      this.setState({
                        countries: item.value,
                      });
                    }}
                    placeholder={this.state.countries}
                    placeholderStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191'}}
                    selectedLabelStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black'}}
                    showArrow={false}
                  />
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('add_property_screen.country')}
                  </Text>
                  <DropDownPicker
                    items={this.state.countri.sort(function (a, b) {
                      return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                    })}
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
                    dropDownStyle={{backgroundColor: 'white'}}
                    onChangeItem={(item) => {
                      this.setCities(item.value);
                      this.setState({
                        countries: item.value,
                      });
                    }}
                    placeholder={this.state.countries}
                    placeholderStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191'}}
                    selectedLabelStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black'}}
                    showArrow={false}
                  />
                </View>
              )}
              {/* <View style={{zIndex:1}}> */}
              {Platform.OS === 'ios' ? (
                <View style={{zIndex: 1}}>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('add_property_screen.city')}
                  </Text>
                  <DropDownPicker
                    items={this.state.selectedCities.sort(function (a, b) {
                      return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                    })}
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
                    dropDownStyle={{backgroundColor: 'white'}}
                    onChangeItem={(item) =>
                      this.setState({
                        city: item.value,
                      })
                    }
                    placeholder={this.state.city}
                    placeholderStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191'}}
                    selectedLabelStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black'}}
                    showArrow={false}
                  />
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('add_property_screen.city')}
                  </Text>
                  <DropDownPicker
                    items={this.state.selectedCities.sort(function (a, b) {
                      return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                    })}
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
                    dropDownStyle={{backgroundColor: 'white'}}
                    onChangeItem={(item) =>
                      this.setState({
                        city: item.value,
                      })
                    }
                    placeholder={this.state.city}
                    placeholderStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191'}}
                    selectedLabelStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black'}}
                    showArrow={false}
                  />
                </View>
              )}
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
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl'
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
                    this.state.address == ''
                      ? Preference.get('language') == 'ar'
                        ? 'بحث'
                        : 'Search'
                      : this.state.address
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
                    // console.log(
                    //   'Location Dattaata',
                    //   JSON.stringify(data.description),
                    // );
                    // console.log(
                    //   'Location Dattaata',
                    //   JSON.stringify(geometry.geometry.location),
                    // );
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
                      // width:'70%',
                      color: 'black',
                      backgroundColor: 'transparent',
                    },
                    predefinedPlacesDescription: {
                      color: 'red',
                    },
                    poweredContainer: {color: 'red'},
                  }}
                  onFail={(error) => console.log('error' + error)}
                  getDefaultValue={(data) =>
                    console.log('Location placed', data)
                  }
                  query={{
                    key: 'AIzaSyCbKjAEKyhGhDu_g1-EzhbstJb9taqx88c',
                    language: 'en',
                    type: 'geocode',
                  }}
                  GooglePlacesDetailsQuery={{fields: 'geometry'}}
                />
                {/* {//console.log('latitudeded',this.state.latittude)} */}
              </View>
              <Text
                style={{
                  marginTop: 15,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}>
                {strings('add_property_screen.latitude')}
              </Text>
              <TextInput
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
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}>
                {strings('add_property_screen.longitude')}
              </Text>
              <TextInput
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
                <View style={{zIndex: 10}}>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('add_property_screen.property_typ')}
                  </Text>
                  <DropDownPicker
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
                    dropDownStyle={{backgroundColor: 'white'}}
                    onChangeItem={(item) =>
                      this.setState({
                        property_Type: item.value,
                      })
                    }
                    placeholder={this.state.property_Type}
                    placeholderStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191'}}
                    selectedLabelStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black'}}
                    showArrow={false}
                  />
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 5,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('add_property_screen.property_typ')}
                  </Text>
                  <DropDownPicker
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
                    dropDownStyle={{backgroundColor: 'white'}}
                    onChangeItem={(item) =>
                      this.setState({
                        property_Type: item.value,
                      })
                    }
                    placeholder={this.state.property_Type}
                    placeholderStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191'}}
                    selectedLabelStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black'}}
                    showArrow={false}
                  />
                </View>
              )}

              {/* {this.state.property_Type === 'Chalets and pools' ? (
                Platform.OS === 'ios' ? (
                  <View style={{zIndex: 1}}>
                    <Text
                      style={{
                        marginTop: 15,
                        marginLeft: 5,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
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
                      dropDownStyle={{backgroundColor: 'white'}}
                      onChangeItem={(item) =>
                        this.setState({
                          specific_Type: item.value,
                        })
                      }
                      placeholder={this.state.specific_Type}
                      placeholderStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191'}}
                      selectedLabelStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black'}}
                      showArrow={false}
                    />
                  </View>
                ) : (
                  <View>
                    <Text
                      style={{
                        marginTop: 15,
                        marginLeft: 5,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
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
                      dropDownStyle={{backgroundColor: 'white'}}
                      onChangeItem={(item) =>
                        this.setState({
                          specific_Type: item.value,
                        })
                      }
                      placeholder={this.state.specific_Type}
                      placeholderStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191'}}
                      selectedLabelStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black'}}
                      showArrow={false}
                    />
                  </View>
                )
              ) : null} */}

              <FlatList
                data={this.state.listAmanties}
                extraData={this.state}
                horizontal
                style={{width: '100%'}}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => {
                  let baseUrl = 'https://doshag.net/admin/public';
                  //console.log('ShowDetails: ', JSON.stringify(item.quantity));
                  if (item.quantity > 0) {
                    //console.log('ShowDetails: ', 'true');
                    return (
                      <View
                        style={{
                          alignItems: 'center',
                          // width:'25%',
                          padding: 10,
                        }}>
                        <Image
                          style={{width: 25, height: 25, resizeMode: 'contain'}}
                          source={{uri: baseUrl + item.aminity.icon}}
                        />
                        <Text
                          style={{
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12,
                            textAlign: 'center',
                            paddingTop: 5,
                          }}>
                          {item.quantity > 1 && (
                            <Text
                              style={{
                                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12,
                                textAlign: 'center',
                                paddingTop: 5,
                              }}>
                              {item.quantity} {'✕'}
                            </Text>
                          )}{' '}
                          {lang == 'en'
                            ? item.aminity.eng_name
                            : item.aminity.arabic_name}
                        </Text>
                      </View>
                    );
                  } else {
                    return <View style={{width: 0, height: 0}} />;
                  }
                }}
              />
              {/* <View
                style={{
                  height: '100%',
                  flexDirection: 'row',
                  backgroundColor: 'yellow',
                }}>
                {this.state.listAmanties.map((item) => {})}
              </View> */}
              {/* }
                  }}
                /> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // marginTop: 10,
                  marginHorizontal: 5,
                  marginTop: 10,
                }}>
                <Text style={{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>{strings('add_property_screen.ameneties')}</Text>

                <TouchableOpacity
                  onPress={() => this.setState({isVisible: true})}
                  style={{
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#B20C11',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('add_property_screen.add')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text
              style={{
                marginTop: 20,
                marginLeft: 5,
                zIndex: -10,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl'
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
                zIndex: -10,
              }}>
              <TextInput
                placeholder={this.state.description}
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
                writingDirection: lang == 'en' ? 'ltr' : 'rtl'
              }}>
              {strings('add_property_screen.no_of_reservations')}
            </Text>
            <DropDownPicker
              items={[
                {label: '1', value: 1},
                {label: '2', value: 2},
              ]}
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
              dropDownStyle={{backgroundColor: 'white'}}
              onChangeItem={(item) => {
                // console.log("item", item)
                this.setState({reservations: item.value});
              }}
              placeholder={this.state.reservations}
              placeholderStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191'}}
              selectedLabelStyle={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black'}}
              showArrow={false}
            />

            <View
              style={{
                marginTop: 15,
                marginLeft: 10,
              }}>
              {this.state.reservations === 1 && (
                <View>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({selectDate: !this.state.selectDate});
                        this.checkBox('first');
                      }}
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
                          this.setState({selectDate: !this.state.selectDate});
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
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                        color: '#979191',
                        marginLeft: 20,
                      }}>
                      {strings('add_property_screen.specific_day_reserv')}
                    </Text>
                  </View>

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
                            <Text style= {{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>
                              {this.state.startTime
                                ? moment(this.state.startTime).format('LT') ==
                                  'Invalid date'
                                  ? this.state.startTime
                                  : moment(this.state.startTime).format('LT')
                                : strings(
                                    'add_property_screen.select_start_time',
                                  )}
                            </Text>
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
                            <Text style= {{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>
                              {this.state.endTime
                                ? moment(this.state.endTime).format('LT') ==
                                  'Invalid date'
                                  ? this.state.endTime
                                  : moment(this.state.endTime).format('LT')
                                : strings(
                                    'add_property_screen.select_end_time',
                                  )}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View></View>
                  )}
                  {this.state.startTimeShow && Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={{width: '100%'}}
                      onPress={() => this.setState({startTimeShow: false})}>
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
                      display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                      value={this.state.startTime2}
                      onChange={(event, value) => {
                        this.setState({
                          startTime: value,
                          startTime2: value,
                          startTimeShow: Platform.OS === 'ios' ? true : false,
                        });

                        if (event.type === 'set') {
                          //console.log('value:', value);
                        }
                      }}
                    />
                  )}
                  {this.state.endTimeShow && Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={{width: '100%'}}
                      onPress={() => this.setState({endTimeShow: false})}>
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
                      value={this.state.endTime2}
                      onChange={(event, value) => {
                        this.setState({
                          endTime: value,
                          endTime2: value,
                          endTimeShow: Platform.OS === 'ios' ? true : false,
                        });

                        if (event.type === 'set') {
                          //console.log('value:', value);
                        }
                      }}
                    />
                  )}

                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          multipleShifts: !this.state.multipleShifts,
                        });
                        this.checkBox('second');
                      }}
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
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                        color: '#979191',
                        marginLeft: 20,
                      }}>
                      {strings('add_property_screen.multiple_day_reserv')}
                    </Text>
                  </View>
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
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                        marginBottom: 10,
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
                        <Text style= {{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>
                          {this.state.morningShiftStartTime
                            ? moment(this.state.morningShiftStartTime).format(
                                'LT',
                              ) == 'Invalid date'
                              ? this.state.morningShiftStartTime
                              : moment(this.state.morningShiftStartTime).format(
                                  'LT',
                                )
                            : strings('add_property_screen.select_start_time')}
                        </Text>
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
                        <Text style= {{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>
                          {this.state.morningShiftEndTime
                            ? moment(this.state.morningShiftEndTime).format(
                                'LT',
                              ) == 'Invalid date'
                              ? this.state.morningShiftEndTime
                              : moment(this.state.morningShiftEndTime).format(
                                  'LT',
                                )
                            : strings('add_property_screen.select_end_time')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {this.state.morningShiftStartTimeShow &&
                      Platform.OS === 'ios' && (
                        <TouchableOpacity
                          style={{width: '100%'}}
                          onPress={() =>
                            this.setState({morningShiftStartTimeShow: false})
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
                        value={this.state.morningShiftStartTime2}
                        onChange={(event, value) => {
                          this.setState({
                            morningShiftStartTime: value,
                            morningShiftStartTime2: value,
                            morningShiftStartTimeShow:
                              Platform.OS === 'ios' ? true : false,
                          });

                          if (event.type === 'set') {
                            //console.log('value:', value);
                          }
                        }}
                      />
                    )}
                    {this.state.morningShiftEndTimeShow &&
                      Platform.OS === 'ios' && (
                        <TouchableOpacity
                          style={{width: '100%'}}
                          onPress={() =>
                            this.setState({morningShiftEndTimeShow: false})
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
                        value={this.state.morningShiftEndTime2}
                        onChange={(event, value) => {
                          this.setState({
                            morningShiftEndTime: value,
                            morningShiftEndTime2: value,
                            morningShiftEndTimeShow:
                              Platform.OS === 'ios' ? true : false,
                          });

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
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                        marginBottom: 10,
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
                        <Text style= {{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>
                          {this.state.eveningShiftStartTime
                            ? moment(this.state.eveningShiftStartTime).format(
                                'LT',
                              ) == 'Invalid date'
                              ? this.state.eveningShiftStartTime
                              : moment(this.state.eveningShiftStartTime).format(
                                  'LT',
                                )
                            : strings('add_property_screen.select_start_time')}
                        </Text>
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
                        <Text style= {{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>
                          {this.state.eveningShiftEndTime
                            ? moment(this.state.eveningShiftEndTime).format(
                                'LT',
                              ) == 'Invalid date'
                              ? this.state.eveningShiftEndTime
                              : moment(this.state.eveningShiftEndTime).format(
                                  'LT',
                                )
                            : strings('add_property_screen.select_end_time')}
                        </Text>
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
                style={{width: '100%'}}
                onPress={() =>
                  this.setState({eveningShiftStartTimeShow: false})
                }>
                <Text
                  style={{alignSelf: 'flex-end', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, marginTop: 10}}>
                  {strings('add_property_screen.close')}
                </Text>
              </TouchableOpacity>
            )}
            {this.state.eveningShiftStartTimeShow && (
              <DateTimePicker
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                value={this.state.eveningShiftStartTime2}
                onChange={(event, value) => {
                  this.setState({
                    eveningShiftStartTime: value,
                    eveningShiftStartTime2: value,
                    eveningShiftStartTimeShow:
                      Platform.OS === 'ios' ? true : false,
                  });

                  if (event.type === 'set') {
                    //console.log('value:', value);
                  }
                }}
              />
            )}
            {this.state.eveningShiftEndTimeShow && Platform.OS === 'ios' && (
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => this.setState({eveningShiftEndTimeShow: false})}>
                <Text
                  style={{alignSelf: 'flex-end', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, marginTop: 10}}>
                  {strings('add_property_screen.close')}
                </Text>
              </TouchableOpacity>
            )}
            {this.state.eveningShiftEndTimeShow && (
              <DateTimePicker
                is24Hour={false}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                value={this.state.eveningShiftEndTime2}
                onChange={(event, value) => {
                  this.setState({
                    eveningShiftEndTime: value,
                    eveningShiftEndTime2: value,
                    eveningShiftEndTimeShow:
                      Platform.OS === 'ios' ? true : false,
                  });

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
                writingDirection: lang == 'en' ? 'ltr' : 'rtl'
              }}>
              {strings('add_property_screen.price_details')}
            </Text>

            <TouchableOpacity
              onPress={() => this.setState({priceModal: true})}
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
              <Text style= {{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>{strings('add_property_screen.days_price')}</Text>
              <Text
                style={{
                  color: '#B20C11',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}>
                {strings('add_property_screen.add')}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                  left: 5,
                  marginTop: 30,
                }}>
                {strings('add_property_screen.special_offer')}
              </Text>
              {/* <Slider
                value={this.state.astbeltProgress}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor="#B20C11"
                minimumTrackTintColor="#B20C11"
                maximumTrackTintColor="#99999920"
                onValueChange={(value) =>
                  this.setState({astbeltProgress: value})
                }
              /> */}
              <Slider
                style={{width: '100%', height: 50}}
                value={this.state.astbeltProgress}
                minimumValue={0}
                maximumValue={100}
                inverted={Preference.get('language') == 'ar' ? true : false}
                minimumTrackTintColor="#B20C11"
                thumbTintColor="#B20C11"
                maximumTrackTintColor="#99999920"
                onSlidingComplete={(value) =>
                  this.setState({astbeltProgress: value})
                }
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 5,
                }}>
                <Text style= {{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>{'0%'}</Text>
                <Text style= {{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>
                  {this.state.astbeltProgress.toFixed(0)}
                  {'%'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.updateProperty();
              }}
              style={{
                backgroundColor: '#B20C11',
                height: 40,
                width: '60%',
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 40,
                marginBottom: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}>
                {strings('add_property_screen.submit')}
              </Text>
            </TouchableOpacity>

            <Modal
              style={{height: 700}}
              animationType="slide"
              transparent={true}
              visible={this.state.isVisible}
              onRequestClose={() => {
                this.setState({isVisible: false});
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
                      <Text style={{fontWeight: 'bold', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16}}>
                        {strings('add_property_screen.add_amanaties')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({isVisible: false});
                        }}>
                        <Image
                          source={require('../../../assets/images/close.png')}
                          style={{width: 20, height: 20, resizeMode: 'contain'}}
                        />
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      data={this.state.listAmanties}
                      // extraData={this.state.listAmantie}
                      renderItem={({item, index}) => {
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
                                source={{uri: baseUrl + item.aminity.icon}}
                              />
                              <Text
                                style={{
                                  color: 'gray',
                                  marginTop: 10,
                                  alignSelf: 'center',
                                  textAlign: 'center',
                                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                                }}>
                                {lang == 'en'
                                  ? item.aminity.eng_name
                                  : item.aminity.arabic_name}
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
                                    this.setState({listAmantie: temp});
                                    // this.setState({listAmantie2:temp})
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
                                style={{
                                  // marginTop: 15,
                                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                                }}
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
                                    this.setState({listAmantie: temp});
                                    // this.setState({listAmantie2:temp})
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
                              onValueChange={
                                () => {
                                  let temparray = this.state.listAmanties;
                                  if (temparray[index].quantity == 0) {
                                    temparray[index].quantity = 1;
                                  } else if (temparray[index].quantity > 0) {
                                    //console.log('else');
                                    temparray[index].quantity = 0;
                                  }

                                  this.setState({listAmanties: temparray});
                                }
                                /*  this.setState({
                                                                                                    item.: !this.state.toggleCheckBox4,
                                                                                                  }) */
                              }
                            />
                          </View>
                        );
                      }}
                      // keyExtractor={(item, index) => index}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        this.setState({isVisible: false});
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          textAlign: 'right',
                          marginRight: 20,
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl'
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
                this.setState({priceModal: false});
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
                          this.setState({priceModal: false});
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
                        // marginRight: 2,
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
                        right: 47,
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
                          alignItems: 'center',
                        }}>
                        {this.state.inputNumber != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            }}>
                            {Math.round(
                              (20 / 100) * parseInt(this.state.inputNumber, 10),
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
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
                          alignItems: 'center',
                        }}>
                        {this.state.inputNumber2 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            }}>
                            {Math.round(
                              (20 / 100) *
                                parseInt(this.state.inputNumber2, 10),
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
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
                          alignItems: 'center',
                        }}>
                        {this.state.inputNumber3 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            }}>
                            {Math.round(
                              (20 / 100) *
                                parseInt(this.state.inputNumber3, 10),
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
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
                          alignItems: 'center',
                        }}>
                        {this.state.inputNumber4 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            }}>
                            {Math.round(
                              (20 / 100) *
                                parseInt(this.state.inputNumber4, 10),
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
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
                          alignItems: 'center',
                        }}>
                        {this.state.inputNumber5 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            }}>
                            {Math.round(
                              (20 / 100) *
                                parseInt(this.state.inputNumber5, 10),
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
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
                          alignItems: 'center',
                        }}>
                        {this.state.inputNumber6 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            }}>
                            {Math.round(
                              (20 / 100) *
                                parseInt(this.state.inputNumber6, 10),
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
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
                        value={this.state.inputNumber7}
                        onChangeText={(text) =>
                          this.setState({
                            inputNumber7: text,
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
                          alignItems: 'center',
                        }}>
                        {this.state.inputNumber7 != '' ? (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                            }}>
                            {Math.round(
                              (20 / 100) *
                                parseInt(this.state.inputNumber7, 10),
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 10,
                              marginLeft: 5,
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
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

                    <TouchableOpacity
                      onPress={() => {
                        this.setState({priceModal: false});
                      }}>
                      <Text
                        style={{
                          color: '#B20C11',
                          textAlign: 'right',
                          marginRight: 20,
                          marginTop: 10,
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                        }}>
                        {strings('add_property_screen.ok')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </KeyboardAwareScrollView>
        </LinearGradient>
        {this.state.loading && <Loader />}
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
  less: {writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 25, color: '#4d3398', fontWeight: 'bold'},
  greater: {writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 25, color: '#f3845c', fontWeight: 'bold'},
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
