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
import ApiUtils from '../../../network/ApiUtils';
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
import axios from 'axios'

const { width, height } = Dimensions.get('window');
const lang = Preference.get('language');

export default class AddHotel extends Component {
    constructor(props) {
        super(props);
        const Item = props?.navigation?.getParam("Item")
        console.log("item ==---------->>>", Item);
        const now = new Date();
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
            noOfFloors: 0,
            images: [],
            propertyTypePickerOpen: false,
            cityPickerOpen: false,
            countryPickerOpen: false,
            reservationPickerOpen: false,
            noOfFloorsPickerOpen: false,
            itemName:""
        };
    }

    componentDidMount() {
        this.setState({itemName: this.props.Item})
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('willFocus', () => {
            if (Preference.get('token')) {
                this.setCountries();
                this.getAmanaties();
                this.resetMyDropdown();
            } else {
                // Alert.alert(
                //     strings('activities_screen.alert'),
                //     strings('activities_screen.sign_in_first', [
                //         {
                //             text: strings('add_property_screen.ok'),
                //         },
                //     ]),
                // );
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
                    // Alert.alert('Error', 'Check your internet!', [
                    //     {
                    //         text: strings('add_property_screen.ok'),
                    //     },
                    // ]);
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

    // onLocationSelect = () => alert(this.state.userLocation);

    show = (mode) => {
        this.setState({
            show: true,
            mode,
        });
    };
    datepicker = () => {
        this.show('date');
    };
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
                response.map((item, index) => {
                    sources.push({
                        uri:
                            Platform.OS === 'ios'
                                ? 'file:///' + item.path.split('file:/').join('')
                                : item.path,
                        name: item.filename,
                        type: item.mime,
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
        if (this.state.name_In_English === '') {
            // alert(strings('add_property_screen.enter_name_in_in_english'));
        }
        // else if (this.state.name_In_Arabic === '') {
        //     alert(strings('add_property_screen.enter_name_in_in_arabic'));
        // }
        // else if (this.state.countries === '') {
        //     alert(strings('add_property_screen.enter_country'));
        // } else if (this.state.cities === '') {
        //     alert(strings('add_property_screen.enter_city'));
        // } else if (this.state.latittude === null || this.state.longitude === null) {
        //     alert(strings('add_property_screen.select_property_location'));
        // }
        //  else if (this.state.property_Type === '') {
        //     alert(strings('add_property_screen.property_type'));
        // } 
        // else if (this.state.description === '') {
        //     alert(strings('add_property_screen.property_description'));
        // } else if (this.state.reservations === 0) {
        //     alert(strings('add_property_screen.no_of_reservation'));
        // }

        // else if (
        //     this.state.reservations === 1 &&
        //     this.state.first === 0 &&
        //     this.state.second === 0
        // ) {
        //     alert(strings('add_property_screen.select_multi_or_single'));
        // } else if (
        //     this.state.reservations == 1 &&
        //     this.state.first == 1 &&
        //     (this.state.startTimeCheck == false || this.state.endTimeCheck == false)
        // ) {
        //     console.log('Enter Time One Day');
        //     alert(strings('add_property_screen.enter_time'));
        // } else if (
        //     this.state.reservations == 2 &&
        //     (this.state.morningShiftStartTimeCheck == false ||
        //         this.state.morningShiftEndTimeCheck == false ||
        //         this.state.eveningShiftStartTimeCheck == false ||
        //         this.state.eveningShiftEndTimeCheck == false)
        // ) {
        //     console.log('Enter Time Two Day');
        //     alert(strings('add_property_screen.enter_time'));
        // } else if (this.state.inputNumber === '') {
        //     alert(strings('add_property_screen.enter_price_per_day'));
        // } else if (this.state.inputNumber2 === '') {
        //     alert(strings('add_property_screen.enter_price_per_day'));
        // } else if (this.state.inputNumber3 === '') {
        //     alert(strings('add_property_screen.enter_price_per_day'));
        // } else if (this.state.inputNumber4 === '') {
        //     alert(strings('add_property_screen.enter_price_per_day'));
        // } else if (this.state.inputNumber5 === '') {
        //     alert(strings('add_property_screen.enter_price_per_day'));
        // } else if (this.state.inputNumber6 === '') {
        //     alert(strings('add_property_screen.enter_price_per_day'));
        // } else if (this.state.inputNumber7 === '') {
        //     alert(strings('add_property_screen.enter_price_per_day'));
        // } else if (this.state.astbeltProgress === '') {
        //     alert(strings('add_property_screen.select_special_offer'));
        // } 
        else if (this.state.termsAndConditions == false) {
            // alert(strings('add_property_screen.terms&conditions'));
        } else {
            if (this.state.list.length == 0) {
                this.add_Property();
            } else {
                this.uploadImagesToServer();
            }
        }
    }
    add_Property = async () => {

        const formData = new FormData();

        formData.append('eng_name', this.state.name_In_English,);
        formData.append('address', this.state.name_In_Arabic);
        formData.append('latitude', this.state.latittude);
        formData.append('longitude', this.state.longitude);
        this.state.list.map((_item) => {
            formData.append('hotel_images[0]', _item);
        })
        formData.append('description', this.state.description);
        formData.append('type', 'Hotels');
        formData.append('city', this.state.cities);
        formData.append('country', this.state.countries);
        formData.append('no_of_floors', this.state.noOfFloors);
        formData.append('no_of_apartments', this.state.reservations);

        console.log("Body Formn Data ---???>>>", formData);
        this.setState({ loading: true });
        try {
            const response = await Api.add_Property(formData)
            console.log("add_Property-response.status", response)
            if (response.status == 200) {
                console.log('Add Hotel APIResponse: ', JSON.stringify(response));
                this.props.navigation.navigate('AddFloors',{
                    AddHotelResponse: JSON.stringify(response?.data.no_of_floors),
                    hotelId:JSON.stringify(response?.data?.id),
                    noOfRooms:JSON.stringify(response?.data?.no_of_apartments),
                })
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
        } catch (error) {
            console.log("add_Property-error", error)
            this.setState({ loading: false });
        }
    };

    



    setPropertyTypePickerOpen = () => {
        this.setState({ propertyTypePickerOpen: !this.state.propertyTypePickerOpen })
    }
    setReservationPickerOpen = () => {
        this.setState({ reservationPickerOpen: !this.state.reservationPickerOpen })
    }
    setNoOfFloorsPickerOpen = () => {
        this.setState({ noOfFloorsPickerOpen: !this.state.noOfFloorsPickerOpen })
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
                        // Alert.alert(strings('activities_screen.alert'), response.message, [
                        //     {
                        //         text: strings('add_property_screen.ok'),
                        //     },
                        // ]);
                        // Preference.set('phon_no', this.state.mobile_Number);
                    }
                }.bind(this),
            )
            .catch(
                function (error) {
                    // Alert.alert(strings('activities_screen.alert'), error.message, [
                    //     {
                    //         text: strings('add_property_screen.ok'),
                    //     },
                    // ]);
                }.bind(this),
            );
    };
    uploadImagesToServer = async () => {
        this.setState({ loading: true });
        //console.log('UPLOADIMGIMAGE');
        let data = new FormData();
        await this.state.list.forEach((item, i) => {
            data.append('hotel_images', {
                uri: item.uri,
                type: item.type,
                name: item.filename || `filename${i}.jpg`,
            });
        });
        console.log('Data: ', data?._parts)
        this.setState({ images: data?._parts })
        console.log("Images ===>>>>", this.state.images);
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
                console.log('ApiDATA: ', JSON.stringify(response));
                let oldImages = this.state.ImagesList;
                response.data.map((item) => {
                    oldImages.push(item.file_name);
                });

                this.setState({ ImagesList: response.data });
                this.add_Property();
            })
            .catch((err) => {
                this.setState({ loading: true });
                console.error('error uploading images: ', err);
            });
    };
    setCities = async (shaher) => {
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
                    headerText={'Add Hotel'}
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
                                    {'Address'}
                                </Text>
                                <TextInput
                                    placeholderTextColor="#979191"
                                    placeholder={'Enter your property address'}
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
                            )}
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
                            <Text
                                style={{
                                    marginTop: 15,
                                    marginLeft: 5,
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                    fontFamily: AppFonts.PoppinsRegular,
                                }}>
                                {'Number of floors in hotel'}
                            </Text>
                            <DropDownPicker
                                zIndex={3000}
                                setOpen={() => {
                                    this.setState({ reservationPickerOpen: false })
                                    this.setNoOfFloorsPickerOpen()
                                }}
                                onSelectItem={(item) => {
                                    console.log('SelectingPropertyType: ', JSON.stringify(item))
                                    this.setState({ noOfFloors: item.value });
                                }}


                                open={this.state.noOfFloorsPickerOpen}
                                items={[
                                    { label: '1', value: 1 },
                                    { label: '2', value: 2 },
                                    { label: '3', value: 3 },
                                    { label: '4', value: 4 },
                                    { label: '5', value: 5 },
                                    { label: '6', value: 6 },
                                    { label: '7', value: 7 },
                                    { label: '8', value: 8 },
                                    { label: '9', value: 9 },
                                    { label: '10', value: 10 },
                                    { label: '11', value: 11 },
                                    { label: '12', value: 12 },
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
                                    this.setState({ noOfFloors: item.value });
                                }}
                                placeholder={this.state.noOfFloors ? this.state.noOfFloors : 'Select no. of floors'}
                                placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                                selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                                showArrow={false}
                            />
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
                            {'Number of apartments in hotel'}
                        </Text>
                        <DropDownPicker
                            setOpen={() => {
                                this.setState({ noOfFloorsPickerOpen: false })
                                this.setReservationPickerOpen()
                            }}
                            onSelectItem={(item) => {
                                console.log('SelectingPropertyType: ', JSON.stringify(item))
                                this.setState({ reservations: item.value });
                            }}


                            open={this.state.reservationPickerOpen}
                            items={[
                                { label: '1', value: 1 },
                                { label: '2', value: 2 },
                                { label: '3', value: 3 },
                                { label: '4', value: 4 },
                                { label: '5', value: 5 },
                                { label: '6', value: 6 },
                                { label: '7', value: 7 },
                                { label: '8', value: 8 },
                                { label: '9', value: 9 },
                                { label: '10', value: 10 },
                                { label: '11', value: 11 },
                                { label: '12', value: 12 },
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
                            placeholder={this.state.reservations ? this.state.reservations : 'Select no. of apartments'}
                            placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                            selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                            showArrow={false}
                        />
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
                                // this.inputcheck();
                                //if (this.state.list.length == 0) {
                                this.add_Property();
                                // } else {
                                //     this.uploadImagesToServer();
                                // }
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
                                            extraData={this.state.listAmantie}
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
                                                                        this.setState({ listAmantie: temp });
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
                                                                        this.setState({ listAmantie: temp });
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
