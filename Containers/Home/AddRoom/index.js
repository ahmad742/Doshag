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

export default class AddRoom extends Component {
    constructor(props) {
        super(props);
        const now = new Date();
        const PropID = props?.navigation?.getParam("PropID")
        const Flid = props?.navigation?.getParam("Flid")
        console.log("propertyID : ", PropID);
        console.log("floorID : ", Flid);
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
            reservationPickerOpen: false,


            roomNo: '',
            floorName: '',
            roomType: '',
            roomTypePickerOption: false,
            NoOfAdults: '',
            NoOfAdultsPickerOption: false,
            noOfChildren: '',
            noOfChildrenPickerOption: false,
            noOfBeds: '',
            noOfBedsPickerOption: false,
            bedType: '',
            bedTypePickerOption: false,
            Status: '',
            StatusPickerOption: false,
            roomSize: '',
            roomSizePickerOption: false,
            price: '',
            discount: '',
            PropertyID: props?.navigation?.getParam("PropID"),
            FloorID: props?.navigation?.getParam("Flid")

        };
    }


    lefAction() {
        this.props.navigation.goBack();
    }
    inputcheck() {
        if (this.state.name_In_English === '') {
            alert(strings('add_property_screen.enter_name_in_in_english'));
        }
    }

    componentDidMount() {
        this.getAmanaties()
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

    add_room = async () => {

        const formData = new FormData();

        formData.append('room_no', this.state.roomNo,);
        formData.append('name', this.state.floorName);
        formData.append('no_of_adults', this.state.NoOfAdults);
        formData.append('no_of_children', this.state.noOfChildren);
        formData.append('size', this.state.roomSize);
        formData.append('no_of_beds', this.state.noOfBeds);
        formData.append('bed_type', this.state.bedType);
        formData.append('price', this.state.price);
        formData.append('discount', this.state.discount);
        formData.append('status', this.state.Status);
        formData.append('property_id', this.state.PropertyID);
        formData.append('floor_id', this.state.FloorID);

        console.log("Body Formn Data add_room ---???>>>", formData);
        this.setState({ loading: true });
        try {
            const response = await Api.add_room(formData)
            console.log("add_room-response.status", response)
            if (response.status == 200) {
                console.log(' add_room APIResponse: ', JSON.stringify(response));
                this.setState({
                    roomNo: null,
                    floorName: null,
                    roomNo: null,
                    NoOfAdults: null,
                    noOfChildren: null,
                    roomSize: null,
                    noOfBeds: null,
                    bedType: null,
                    Status: null,
                    price: null,
                    discount: null
                })
                this.props.navigation.navigate('FloorsScreen', {
                    roomId: response.room.id
                })
                alert(response.message)
            }
        } catch (error) {
            console.log("add_Property-error", error)
        }
        finally {
            this.setState({ loading: false });
        }
    };

    setRoomType = () => {
        this.setState({
            roomTypePickerOption: !this.state.roomTypePickerOption,
            NoOfAdultsPickerOption: false,
            noOfChildrenPickerOption: false,
            roomSizePickerOption: false,
            noOfBedsPickerOption: false,
            bedTypePickerOption: false,
            StatusPickerOption: false,
        })
    }
    setNoOfAdults = () => {
        this.setState({
            NoOfAdultsPickerOption: !this.state.NoOfAdultsPickerOption,
            noOfChildrenPickerOption: false,
            roomSizePickerOption: false,
            noOfBedsPickerOption: false,
            bedTypePickerOption: false,
            StatusPickerOption: false,
            roomTypePickerOption: false
        })
    }
    setNoOfChildren = () => {
        this.setState({
            noOfChildrenPickerOption: !this.state.noOfChildrenPickerOption,
            roomSizePickerOption: false,
            noOfBedsPickerOption: false,
            bedTypePickerOption: false,
            StatusPickerOption: false,
            roomTypePickerOption: false,
            NoOfAdultsPickerOption: false,
        })
    }
    setRoomSize = () => {
        this.setState({
            roomSizePickerOption: !this.state.roomSizePickerOption,
            noOfChildrenPickerOption: false,
            NoOfAdultsPickerOption: false,
            noOfBedsPickerOption: false,
            bedTypePickerOption: false,
            StatusPickerOption: false,
            roomTypePickerOption: false
        })
    }
    setNoOfBeds = () => {
        this.setState({
            noOfBedsPickerOption: !this.state.noOfBedsPickerOption,
            noOfChildrenPickerOption: false,
            NoOfAdultsPickerOption: false,
            roomSizePickerOption: false,
            bedTypePickerOption: false,
            StatusPickerOption: false,
            roomTypePickerOption: false
        })
    }
    setBedType = () => {
        this.setState({
            bedTypePickerOption: !this.state.bedTypePickerOption,
            noOfChildrenPickerOption: false,
            NoOfAdultsPickerOption: false,
            roomSizePickerOption: false,
            noOfBedsPickerOption: false,
            StatusPickerOption: false,
            roomTypePickerOption: false
        })
    }
    setStatus = () => {
        this.setState({
            StatusPickerOption: !this.state.StatusPickerOption,
            noOfChildrenPickerOption: false,
            NoOfAdultsPickerOption: false,
            roomSizePickerOption: false,
            noOfBedsPickerOption: false,
            bedTypePickerOption: false,
            roomTypePickerOption: false,
        })
    }

    render() {
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
                    headerText={'Add Room'}
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
                            <Text
                                style={{
                                    marginTop: 15,
                                    marginLeft: 5,
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                    fontFamily: AppFonts.PoppinsRegular,
                                }}>
                                {'Room no.'}
                            </Text>
                            <TextInput
                                placeholderTextColor="#979191"
                                placeholder={'Enter room no.'}
                                value={this.state.roomNo}
                                onChangeText={(text) =>
                                    this.setState({
                                        roomNo: text,
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
                                {'Name'}
                            </Text>
                            <TextInput
                                placeholderTextColor="#979191"
                                placeholder={'Enter floor name'}
                                value={this.state.floorName}
                                onChangeText={(text) =>
                                    this.setState({
                                        floorName: text,
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
                                    //backgroundColor: "red",
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                    fontFamily: AppFonts.PoppinsRegular,
                                }}>
                                {'Room Type'}
                            </Text>
                            <View style={{ zIndex: this.state.roomTypePickerOption == true ? 999 : 10 }}>
                                <DropDownPicker
                                    setOpen={() => { this.setRoomType() }}
                                    onSelectItem={(item) => {
                                        console.log('SelectingPropertyType: ', JSON.stringify(item))
                                        this.setState({ roomType: item.value })
                                    }}


                                    open={this.state.roomTypePickerOption}
                                    items={[
                                        {
                                            label: 'Luxury',
                                            value: 'Luxury',
                                        },
                                        {
                                            label: 'Normal',
                                            value: 'Normal',
                                        },
                                        {
                                            label: 'VIP',
                                            value: 'VIP',
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
                                    placeholder={this.state.roomType ? this.state.roomType : 'Select your room type'}
                                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                                    showArrow={false}
                                />
                            </View>
                            <Text
                                style={{
                                    marginTop: 15,
                                    marginLeft: 5,
                                    //backgroundColor: "red",
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                    fontFamily: AppFonts.PoppinsRegular,
                                }}>
                                {'No. of Adults'}
                            </Text>
                            <View style={{ zIndex: this.state.NoOfAdultsPickerOption == true ? 9999 : 10 }}>
                                <DropDownPicker
                                    setOpen={() => { this.setNoOfAdults() }}
                                    onSelectItem={(item) => {
                                        console.log('SelectingPropertyType: ', JSON.stringify(item))
                                        this.setState({ NoOfAdults: item.value })
                                    }}


                                    open={this.state.NoOfAdultsPickerOption}
                                    items={[
                                        {
                                            label: '1',
                                            value: '1',
                                        },
                                        {
                                            label: '2',
                                            value: '2',
                                        },
                                        {
                                            label: '3',
                                            value: '3',
                                        },
                                        {
                                            label: '4',
                                            value: '4',
                                        },
                                        {
                                            label: '5',
                                            value: '5',
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
                                    placeholder={this.state.NoOfAdults ? this.state.NoOfAdults : 'Select number of adults'}
                                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                                    showArrow={false}
                                />
                            </View>
                            <View style={{ zIndex: this.state.noOfChildrenPickerOption == true ? 999 : 10 }}>
                                <Text
                                    style={{
                                        marginTop: 15,
                                        marginLeft: 5,
                                        //backgroundColor: "red",
                                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                        fontFamily: AppFonts.PoppinsRegular,
                                    }}>
                                    {'No. of children'}
                                </Text>
                                <DropDownPicker
                                    setOpen={() => { this.setNoOfChildren() }}
                                    onSelectItem={(item) => {
                                        console.log('SelectingPropertyType: ', JSON.stringify(item))
                                        this.setState({ noOfChildren: item.value })
                                    }}


                                    open={this.state.noOfChildrenPickerOption}
                                    items={[
                                        {
                                            label: '1',
                                            value: '1',
                                        },
                                        {
                                            label: '2',
                                            value: '2',
                                        },
                                        {
                                            label: '3',
                                            value: '3',
                                        },
                                        {
                                            label: '4',
                                            value: '4',
                                        },
                                        {
                                            label: '5',
                                            value: '5',
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
                                    placeholder={this.state.noOfChildren ? this.state.noOfChildren : 'Select no. of children'}
                                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                                    showArrow={false}
                                />
                            </View>
                            <Text
                                style={{
                                    marginTop: 15,
                                    marginLeft: 5,
                                    //backgroundColor: "red",
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                    fontFamily: AppFonts.PoppinsRegular,
                                }}>
                                {'Room Size'}
                            </Text>
                            <View style={{ zIndex: this.state.roomSizePickerOption == true ? 999 : 10 }}>
                                <DropDownPicker
                                    setOpen={() => { this.setRoomSize() }}
                                    onSelectItem={(item) => {
                                        console.log('SelectingPropertyType: ', JSON.stringify(item))
                                        this.setState({ roomSize: item.value })
                                    }}


                                    open={this.state.roomSizePickerOption}
                                    items={[
                                        {
                                            label: 'Small',
                                            value: 'Small',
                                        },
                                        {
                                            label: 'Big',
                                            value: 'Big',
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
                                    placeholder={this.state.roomSize ? this.state.roomSize : 'Select room size'}
                                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                                    showArrow={false}
                                />
                            </View>
                            <Text
                                style={{
                                    marginTop: 15,
                                    marginLeft: 5,
                                    //backgroundColor: "red",
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                    fontFamily: AppFonts.PoppinsRegular,
                                }}>
                                {'No. of Beds'}
                            </Text>
                            <View style={{ zIndex: this.state.noOfBedsPickerOption == true ? 999 : 10 }}>
                                <DropDownPicker
                                    setOpen={() => { this.setNoOfBeds() }}
                                    onSelectItem={(item) => {
                                        console.log('SelectingPropertyType: ', JSON.stringify(item))
                                        this.setState({ noOfBeds: item.value })
                                    }}


                                    open={this.state.noOfBedsPickerOption}
                                    items={[
                                        {
                                            label: '1',
                                            value: '1',
                                        },
                                        {
                                            label: '2',
                                            value: '2',
                                        },
                                        {
                                            label: '3',
                                            value: '3',
                                        },
                                        {
                                            label: '4',
                                            value: '4',
                                        },
                                        {
                                            label: '5',
                                            value: '5',
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
                                    placeholder={this.state.noOfBeds ? this.state.noOfBeds : 'Select no. of beds'}
                                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                                    showArrow={false}
                                />
                            </View>
                            <Text
                                style={{
                                    marginTop: 15,
                                    marginLeft: 5,
                                    //backgroundColor: "red",
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                    fontFamily: AppFonts.PoppinsRegular,
                                }}>
                                {'Bed Type'}
                            </Text>
                            <View style={{ zIndex: this.state.bedTypePickerOption == true ? 999 : 10 }}>
                                <DropDownPicker
                                    setOpen={() => { this.setBedType() }}
                                    onSelectItem={(item) => {
                                        console.log('SelectingPropertyType: ', JSON.stringify(item))
                                        this.setState({ bedType: item.value })
                                    }}


                                    open={this.state.bedTypePickerOption}
                                    items={[
                                        {
                                            label: 'Single',
                                            value: 'Single',
                                        },
                                        {
                                            label: 'Double',
                                            value: 'Double',
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
                                    placeholder={this.state.bedType ? this.state.bedType : 'Select bed type'}
                                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                                    showArrow={false}
                                />
                            </View>
                            <Text
                                style={{
                                    marginTop: 15,
                                    marginLeft: 5,
                                    //backgroundColor: "red",
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                    fontFamily: AppFonts.PoppinsRegular,
                                }}>
                                {'Status'}
                            </Text>
                            <View style={{ zIndex: this.state.StatusPickerOption == true ? 999 : 10 }}>
                                <DropDownPicker
                                    setOpen={() => { this.setStatus() }}
                                    onSelectItem={(item) => {
                                        console.log('SelectingPropertyType: ', JSON.stringify(item))
                                        this.setState({ Status: item.value })
                                    }}


                                    open={this.state.StatusPickerOption}
                                    items={[
                                        {
                                            label: 'Open',
                                            value: 'Open',
                                        },
                                        {
                                            label: 'Close',
                                            value: 'Close',
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
                                    placeholder={this.state.Status ? this.state.Status : 'Select bed type'}
                                    placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                                    selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                                    showArrow={false}
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
                            <Text
                                style={{
                                    marginTop: 15,
                                    marginLeft: 5,
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                    fontFamily: AppFonts.PoppinsRegular,
                                }}>
                                {'Price'}
                            </Text>
                            {/* <TextInput
                                placeholderTextColor="#979191"
                                placeholder={'Enter room price'}
                                value={this.state.price}
                                onChangeText={(text) =>
                                    this.setState({
                                        price: text,
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
                            /> */}
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
                             <TextInput
                                placeholderTextColor="#979191"
                                placeholder={'Enter price'}
                                value={this.state.price}
                                onChangeText={(text) =>
                                    this.setState({
                                        price: text,
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
                                {'Discount'}
                            </Text>
                            <TextInput
                                placeholderTextColor="#979191"
                                placeholder={'Enter Discount'}
                                value={this.state.discount}
                                onChangeText={(text) =>
                                    this.setState({
                                        discount: text,
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
                            <TouchableOpacity
                                onPress={() => {
                                    this.add_room()
                                }}
                                style={{
                                    backgroundColor: '#B20C11',
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
                                    {'Add Room'}
                                </Text>
                            </TouchableOpacity>



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
