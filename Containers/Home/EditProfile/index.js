import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Header from '../../../component/LargeHeader/Header';
import color from '../../../component/AppColor';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../../../component/Loader/Loader';
import Api from '../../../network/Api';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { constants } from '../../../config/constants';
import Preference from 'react-native-preference';
import { strings } from '../../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dummyProfileImage = require('../../../assets/images/dp1.png');
const lang = Preference.get('language');

let country2 = [
  {
    value: 'beharain',
    label: 'Beharain',
  },
  {
    value: 'kingdom of saudia arabia (KSA) ',
    label: 'Kingdom of Saudia Arabia (KSA)',
  },
  {
    value: 'jordan',
    label: 'Jordan',
  },
];

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dateTimePickerVisible: false,
      showDateText: false,
      profileImage: [],
      countri: [],
      firstname: '',
      lastname: '',
      email: '',
      email2: '',
      mobileNumber: '',
      country: '',
      dob: '',
      dateOrTimeValue: new Date(),
      password: '',
      uri: '',
      uriCheck: '',
      ImagesList: [],
    };
  }
  imagePickFromGallery = () => {
    console.log('image picker------======');



    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      imageLoader: 'UNIVERSAL'
    }).then(response => {
      console.log('imagePickFromGallery', 'response', response.path,);
      const source = {
        uri:
          Platform.OS === 'ios'
            ? 'File:///' + response.path.split('file:/').join('')
            : response.path,
        name: moment().format('x') + '.jpeg',
        type: 'image/jpeg',
      };
      console.log('imagePickFromGallery', 'Addeed Object', source);
      this.setState({ profileImage: source });

    });


    // ImagePicker.openPicker({
    // }).then((response) => {
    //       });
  };

  lefAction() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      this.setCountries();
      this.get();
      this.rotation();
    });
  }
  rotation = () => {
    // //console.log('language',Preference.get("language"))
    if (Preference.get('language') == 'en') {
      //this.state.rotate ="0deg";
      this.setState({ rotate: '0deg' });
    } else {
      //this.state.rotate ="0deg";
      this.setState({ rotate: '180deg' });
      // console.log("180Deg")
    }
  };
  get() {
    this.setState({ loading: true });
    Api.profile()
      .then(
        function (response) {
          // console.log(
          //   'GET-ProfileApiDataResponse: ',
          //   JSON.stringify(response.data),
          // );
          let imageBaseUrl =
            'https://doshag.net/admin/public' + response.data.image;
          this.setState({
            firstname: response.data.first_name,
            lastname: response.data.last_name,
            email: response.data.email,
            mobileNumber: response.data.phone_no,
            dob: moment(response.data.dob).format('MM/DD/YYYY'),
            country: response.data.country,
            uriCheck: response.data.image,
            uri: imageBaseUrl,
          });
          this.setState({ loading: false });
          // //console.log('URI:------',this.state.uri)
        }.bind(this),
      )
      .catch(
        function (error) {
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
          this.setState({ loading: false });
        }.bind(this),
      );
  }
  userUpdateProfile() {
    console.log('url of selected image===>>>',this.state.profileImage.uri);
    this.setState({ loading: true });
    let body = new FormData();
    body.append('first_name', this.state.firstname);
    body.append('last_name', this.state.lastname);
    body.append('email', this.state.email);
    body.append('phone_no', this.state.mobileNumber);
    body.append(
      'dob',
      moment(this.state.dateOrTimeValue).format('MM/DD/YYYY').length == 0
        ? this.state.dob
        : moment(this.state.dateOrTimeValue).format('MM/DD/YYYY'),
    );
    body.append('country', this.state.country);
    body.append('password', this.state.password);
    if (this.state.profileImage.length == 0) {
      body.append('image', this.state.uriCheck);
    } else {
      body.append('image', this.state.profileImage);
    }
    console.log('BodyData', body);
    Api.updateProfile(body)
      .then(
        function (response) {
          // console.log(
          //   'Updated_Profile_Response: ',
          //   JSON.stringify(response.data),
          // );
          this.setState({ loading: false });
          if (response == undefined) {
            Alert.alert(strings('activities_screen.alert'), strings('edit_profile.check_input_fields'), [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          } else {
            this.props.navigation.navigate('MainBottomTab');
            Alert.alert(strings('activities_screen.alert'), strings('edit_profile.profile_updated'), [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
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
          this.setState({ loading: false });
        }.bind(this),
      );
  }
  setCountries = async () => {
    let countriesDetails = undefined;
    try {
      countriesDetails = JSON.parse(await AsyncStorage.getItem('countries'));
    } catch (error) {
      // console.log('AllCountries Error', JSON.stringify(error));
    }
    let country = [];
    let imageBaseUrl = 'https://doshag.net/admin/public';
    for (let i = 0; i < countriesDetails.length; i++) {
      country.push({
        label: countriesDetails[i].name,
        value: countriesDetails[i].name,
        icon: () => (
          <Image
            source={{ uri: imageBaseUrl + countriesDetails[i].flag_image }}
            style={{ width: 35, height: 20 }}
          />
        ),
      });
    }
    this.setState({
      countri: country,
    });
  };
  render() {
    let rotateBack = this.state.rotate;
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <Header
            leftIcon={require('../../../assets/images/back.png')}
            headerText={strings('edit_profile.edit_profile')}
            leftAction={this.lefAction.bind(this)}
            navigation={this.props.navigation}
          />
          {/*<Image source={require("../../../assets/images/dp1.png")} resizeMode={"contain"} style={{ width: 100, height: 100, position: "absolute", top: 140, left: "40%" }} />*/}
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: 100,
                height: 100,
                marginTop: -50,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#ffffff',
                borderWidth: 2,
                borderRadius: 50,
              }}
              onPress={() => {
                this.imagePickFromGallery();
              }}>
              <Image
                source={
                  (this.state.profileImage.length != 0 &&
                    this.state.profileImage) ||
                  (this.state.uriCheck && { uri: this.state.uri }) ||
                  dummyProfileImage
                }
                resizeMode={'cover'}
                style={{
                  width: 98,
                  height: 98,
                  borderRadius: 49,
                }}
              />
              <Image
                source={require('../../../assets/images/camera.png')}
                resizeMode={'contain'}
                style={{
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.innerContainer}>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  color: 'black',
                  // fontWeight: 'bold',
                }}>
                {strings('register_screen.first_name')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  borderRadius: 10,
                  borderColor: color.graylightBorder,
                  borderWidth: 4,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  onChangeText={(text) => this.setState({ firstname: text })}
                  placeholder={'Enter your First name'}
                  value={this.state.firstname}
                  style={{ paddingLeft: 10, height: 50, writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}
                />
              </View>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  color: 'black',
                  // fontWeight: 'bold',
                }}>
                {strings('register_screen.last_name')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  borderRadius: 10,
                  borderColor: color.graylightBorder,
                  borderWidth: 4,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  onChangeText={(text) => this.setState({ lastname: text })}
                  placeholder={'Enter your Last name'}
                  value={this.state.lastname}
                  style={{ paddingLeft: 10, height: 50, writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}
                />
              </View>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  color: 'black',
                  // fontWeight: 'bold',
                }}>
                {strings('register_screen.email_address')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  borderRadius: 10,
                  borderColor: color.graylightBorder,
                  borderWidth: 4,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  editable={false}
                  onChangeText={(text) => this.setState({ email: text })}
                  value={this.state.email}
                  style={{ paddingLeft: 10, height: 50, writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}
                />
              </View>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  color: 'black',
                  // fontWeight: 'bold',
                }}>
                {strings('register_screen.mobile_number')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  borderRadius: 10,
                  borderColor: color.graylightBorder,
                  borderWidth: 4,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  editable={false}
                  onChangeText={(text) => this.setState({ mobileNumber: text })}
                  value={this.state.mobileNumber}
                  style={{ paddingLeft: 10, height: 50, writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}
                />
              </View>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  color: 'black',
                  // fontWeight: 'bold',
                }}>
                {strings('register_screen.dob')}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    dateTimePickerVisible: true,
                    showDateText: true,
                  })
                }
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
                {this.state.showDateText ? (
                  <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}>
                    {!!this.state.dateOrTimeValue &&
                      this.state.dateOrTimeValue.toLocaleDateString()}
                  </Text>
                ) : (
                  <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}>{this.state.dob}</Text>
                )}
              </TouchableOpacity>
              {this.state.dateTimePickerVisible && Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={{ width: '100%' }}
                  onPress={() => this.setState({ dateTimePickerVisible: false })}>
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
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                  color: 'black',
                  // fontWeight: 'bold',
                }}>
                {strings('register_screen.select_country')}
              </Text>
              <DropDownPicker
                items={this.state.countri.sort(function (a, b) {
                  return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                })}
                containerStyle={{
                  height: 50,
                  width: '100%',
                  marginBottom: 10,
                }}
                style={{
                  backgroundColor: 'white',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                }}
                dropDownStyle={{ backgroundColor: 'white' }}
                onChangeItem={(item) =>
                  this.setState({
                    country: item.value,
                  })
                }
                placeholder={this.state.country}
                placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                showArrow={false}
              />
              <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity
                  //   onPress={() => {
                  //
                  //   }}
                  onPress={() => this.userUpdateProfile()}
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
                  <Text style={{ color: 'white', writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}>
                    {strings('change_password_screen.save')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: color.lightPink,
  },
  innerContainer: {
    margin: 20,
  },
});
