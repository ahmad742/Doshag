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
const WelcomeScreen = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'WelcomeScreen' })],
});
const lang = Preference.get('language');
const _today = moment().format(_format);
const _format = 'YYYY-MM-DD';
export default class Add_Property extends Component {


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
            rotate2: '0deg',
            selectedDateCheckIn: [],
            selectedDateCheckOut: [],
            selectedpooldate: [],
            selectedDates: [],
            morningcheck: false,
            eveningcheck: false,
            selectedItem: '',
            dateModal: true
        };
    }

    componentDidMount() {
        console.log("in Use Effect")
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
        this.setState({ selectedItem: '' })
        Api.home()
            .then(
                function (response) {
                    console.log('HomeApiData: ', JSON.stringify(response.data));
                    let temparray = [];
                    for (let i = 0; i < response.data.length; i++) {
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
        let selected_dates = [];
        selected_dates.push(dateString);
        markedDates[dateString] = { selected: true };
        this.setState({
            _markedDates: markedDates,
            selectedDateCheckIn: selected_dates,
        });
    };
    onCheckoutDayPress = (dateString) => {
        this.state.selectedDateCheckOut.length = 0;
        let markedDates = {};
        let selected_dates = [];
        selected_dates.push(dateString);
        markedDates[dateString] = { selected: true };
        this.setState({
            _markedDates: markedDates,
            selectedDateCheckOut: selected_dates,
        });
    };
    onPoolDayPress = (dateString) => {
        this.state.selectedpooldate.length = 0;
        let markedDates = {};
        let selected_dates = [];
        selected_dates.push(dateString);
        markedDates[dateString] = { selected: true };
        this.setState({
            _markedDates: markedDates,
            selectedpooldate: selected_dates,
        });
    };

    renderItem(item) {
        return (
            <TouchableOpacity
                style={{
                    width: "80%",
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 5,
                    padding: 10,
                    height: 100,
                    borderRadius: 10,
                    backgroundColor: this.state.selectedItem == item.name ? AppColor.redHead : 'white',
                    borderWidth: 1,
                    borderColor: this.state.selectedItem == item.name ? AppColor.redHead : 'lightgrey',
                    shadowColor: this.state.selectedItem == item.name ? AppColor.redHead : 'grey',
                    shadowOpacity: 0.20,
                    shadowOffset: { width: 0, height: 1 },
                    shadowRadius: 10,
                    elevation: 3,
                    marginTop: 10

                }}
                onPress={() =>
                //     {
                //     this.props.navigation.push('Add', { Item: item.name })
                //     this.setState({ selectedItem: item.name })
                // }
                {
                    if (item.name == 'Hotels') {
                        this.props.navigation.navigate('AddHotel' ,{ Item: item.name })
                        this.setState({ selectedItem: item.name })
                    }
                    else {
                        this.props.navigation.navigate('Add')
                        this.setState({ selectedItem: item.name })
                    }
                }

                }>
                <Text
                    style={{
                        color: this.state.selectedItem === item.name ? 'white' : 'black',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 16,
                        textAlign: 'center',
                        fontFamily: AppFonts.PoppinsRegular,
                    }}>
                    {item.name == 'Chalets and pools'
                        ? strings('add_property_screen.summer_house')
                        : item.name == 'Camps'
                            ? strings('add_property_screen.camps')
                            : item.name == 'Hotels'
                                ? 'Hotels'
                                : null}
                </Text>
            </TouchableOpacity>
        );
    }

    render() {
        let rotateBack = this.state.rotate;
        let rotateBack2 = this.state.rotate2;
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
                                        animationType="none"
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
                            <Image
                                // style={{resizeMode: 'contain', width: '100%'}}
                                source={require('../../../assets/images/doshag_logo.png')}
                                style={{
                                    resizeMode: 'contain',
                                    marginTop: 10,
                                    marginRight: 20,
                                    resizeMode: 'contain',
                                    width: 85,
                                    height: 54,
                                }}
                            />
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
                    <View
                        visible={this.state.dateModal}>
                        <View style={{
                            width: "100%",
                            // backgroundColor: 'lightgrey',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                width: '100%',
                                alignSelf: 'center',
                                flex: 1
                            }}>
                                <ScrollView
                                    contentContainerStyle={{ flexGrow: 1 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}>
                                    <View style={styles.mainListContainer}>
                                        <FlatList
                                            style={{ width: '100%', alignSelf: 'center', marginTop: "10%" }}
                                            data={this.state.SearchList}
                                            renderItem={({ item, index }) => this.renderItem(item)}
                                            extraData={this.state}
                                            keyExtractor={(item) => item.id}
                                        />
                                    </View>
                                    {/* <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100%', bottom: 30 }}>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.selectedItem) {
                      if (this.state.selectedItem == 'Chalets and pools') {
                        this.props.navigation.navigate('Add')
                      }
                      if (this.state.selectedItem == 'Camps') {
                          this.props.navigation.navigate('Add')
                      }
                      if (this.state.selectedItem == 'Furnished Apartments') {
                          this.props.navigation.navigate('Add', { item: this.state.selectedItem })
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
                >
                  <Image style={{
                    width: 20,
                    height: 20,
                    marginRight: 10
                  }} source={require('../../../assets/images/searchGray.png')} />
                  <Text style={{ color: 'white' }}>
                    {"Search hotels"}
                  </Text>
                </TouchableOpacity>
              </View> */}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

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
        marginLeft: 10,
        marginTop: '20%'
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
