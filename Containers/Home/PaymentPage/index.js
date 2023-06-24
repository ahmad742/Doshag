import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import Header from '../../../component/TopHeader/Header';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {strings} from '../../../i18n';
import Preference from 'react-native-preference';
import Api from '../../../network/Api';
import {ParallaxImageStatus} from 'react-native-snap-carousel';
import Loader from '../../../component/Loader/Loader';
import {WebView} from 'react-native-webview';

let today = new Date();
const _format = 'YYYY-MM-DD';
const _today = moment().format(_format);
const _maxDate = moment().add(30, 'days').format(_format);
const lang = Preference.get('language');

class index extends Component {
  initialState = {
    [_today]: {disabled: true},
  };

  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      rotate: '0deg',
      date: new Date(),
      time: '8:25 AM',
      show: false,
      textShow: false,
      loader: false,
      markedDates: {},
      _markedDates: this.initialState,
      fixedMarkedDates: this.initialState,
      _closedDates: this.initialState,
      selectedDates: [],
      id: params.id,
      eng_name: params.name_In_English,
      reservations: params.reservations,
      first: params.first,
      second: params.second,
      startTime: params.startTime,
      endTime: params.endTime,
      morningShiftStartTime: params.morningShiftStartTime,
      morningShiftEndTime: params.morningShiftEndTime,
      eve_start_time: params.eve_start_time,
      eve_end_time: params.eve_end_time,
      priceDetails: params.priceDetails,
      booking_price: 0,
      promo_code: '',
      special_request: '',
      payment: 0,
      multiDatePrice: 0,
      showMorningShift: true,
      showEveningShift: true,
      upcoming_dates: [],
      cancel_dates: [],
      totalLength: 0,
      termsAndConditions: false,
      webViewDisplay: false,
    };
    //console.log('eng_name', this.state.eng_name);
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      this.rotation();
      this.fetchCancelReservation();
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
  fetchCancelReservation() {
    this.setState({loader: true});
    const {params} = this.props.navigation.state;
    const id = params ? params.id : null;
    let body = new FormData();
    body.append('property_id', id);
    //console.log('BodyData', body);
    Api.fetchcancelReservation(body)
      .then(
        function (response) {
          console.log('Reservation Date:-- ', JSON.stringify(response));
          this.setState(
            {
              closed: response.data.cancel_total,
              past: response.data.past_total,
              upcoming: response.data.upcoming_total,
              upcoming_dates: response.data.upcoming_bookings,
              cancel_dates: response.data.cancel_reservation,
            },
            () => {
              let markedDates = {};
              let closedDates = {};
              let dublicateCancel = [];
              // let sortedCancel = [];
              let bookingTemp = response.data.upcoming_bookings,
                count = {},
                cancelTemp = response.data.cancel_reservation,
                past_bookings = response.data.past_bookings;

              let double = [];
              let single = [];
              let newList = bookingTemp;

              bookingTemp.map((item, index) => {
                let dum = [];
                for (let i = 0; i < newList.length; i++) {
                  if (newList[i].date == item.date) {
                    dum.push(item);
                  }
                }
                if (dum.length > 1) {
                  double.push(item);
                } else if (dum.length > 0) {
                  single.push(item);
                }
                newList = newList.filter((item2) => item2.date != item.date);
              });

              // console.log('Double', double);
              // console.log('Single', single);
              // console.log('NewList', newList);

              for (let i = 0; i < double.length; i++) {
                markedDates[double[i].date] = {
                  disabled: true,
                  disableTouchEvent: true,
                };
              }

              for (let i = 0; i < single.length; i++) {
                if (single[i].shift == '0') {
                  markedDates[single[i].date] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                  closedDates[single[i].date] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                } else if (single[i].shift == '1') {
                  markedDates[single[i].date] = {
                    dots: [{color: 'yellow'}],
                  };
                } else if (single[i].shift == '2') {
                  markedDates[single[i].date] = {
                    dots: [{color: 'blue'}],
                  };
                } else if (single[i].shift == '3') {
                  markedDates[single[i].date] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                  closedDates[single[i].date] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                }
              }
              for (let i = 0; i < cancelTemp.length; i++) {
                if (cancelTemp[i].period == 3) {
                  markedDates[cancelTemp[i].date] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                  closedDates[cancelTemp[i].date] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                } else if (cancelTemp[i].period == 0) {
                  markedDates[cancelTemp[i].date] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                  closedDates[cancelTemp[i].date] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                } else if (cancelTemp[i].period == 1) {
                  markedDates[cancelTemp[i].date] = {dots: [{color: 'green'}]};
                } else if (cancelTemp[i].period == 2) {
                  markedDates[cancelTemp[i].date] = {
                    dots: [{color: '#640141'}],
                  };
                }
              }
              this.setState({
                _markedDates: markedDates,
                fixedMarkedDates: markedDates,
                totalLength: Object.keys(markedDates).length,
                _closedDates: closedDates,
                loader: false,
              });
            },
          );
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

  lefAction() {
    this.props.navigation.goBack();
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
    this.setState({time: moment(date).format('LT')});
    //console.log('date', moment(date).format('LT'));
  };

  show = (mode) => {
    this.setState({
      show: true,
      mode,
    });
  };

  datepicker = () => {
    this.show('date');
  };

  timepicker = () => {
    this.show('time');
  };

  booking() {
    const {params} = this.props.navigation.state;
    const id = params ? params.id : null;
  }

  onDaySelect = (day) => {
    this.calculatePriceByDay(day);
    let loading = true;
    const _selectedDay = moment(day.dateString).format(_format);
    let selected_dates = this.state.selectedDates;
    let closedDates = this.state._closedDates;
    selected_dates.find((v, index) => {
      if (v == day.dateString) {
        selected_dates.splice(index, 1);
        loading = false;
      }
    });
    loading && selected_dates.push(day.dateString);

    let selected = true;
    if (this.state._markedDates[_selectedDay]) {
      selected = !this.state._markedDates[_selectedDay].selected;
    }
    const updatedMarkedDates = {
      ...this.state._markedDates,
      ...{[_selectedDay]: {selected}},
    };

    // Triggers component to render again, picking up the new state
    this.setState(
      {_markedDates: updatedMarkedDates, selectedDates: selected_dates},
      // () => {
      //   //console.log('selectedDates Dates:-----', this.state.selectedDates);
      // },
    );
  };
  calculatePriceByDay = (date) => {
    let loading = true;
    const {params} = this.props.navigation.state;
    const specialOffer = params ? params.specialOffer : null;
    let prices = this.state.priceDetails;
    let selected_dates = this.state.selectedDates;
    selected_dates.map((value, index) => {
      if (value == date.dateString) {
        loading = false;
        prices.map((value, index) => {
          if (moment(date.dateString).format('dddd') === value.day) {
            let price = this.state.multiDatePrice - parseInt(value.price);
            this.setState({multiDatePrice: price});
            this.setState({
              booking_price:
                specialOffer != '0'
                  ? (
                      price -
                      (parseInt(specialOffer) / 100) * parseInt(price)
                    ).toFixed(2)
                  : price,
            });
          }
        });
      }
    });
    {
      loading &&
        prices.map((value, index) => {
          if (moment(date.dateString).format('dddd') === value.day) {
            let price = this.state.multiDatePrice + parseInt(value.price);
            this.setState({multiDatePrice: price});
            this.setState({
              booking_price:
                specialOffer != '0'
                  ? (
                      price -
                      (parseInt(specialOffer) / 100) * parseInt(price)
                    ).toFixed(2)
                  : price,
            });
          }
        });
    }
  };
  calculatePriceByDayForOneDay = (dateString) => {
    const {params} = this.props.navigation.state;
    const specialOffer = params ? params.specialOffer : null;
    let prices = this.state.priceDetails;
    prices.map((value, index) => {
      if (moment(dateString).format('dddd') === value.day) {
        let price = parseInt(value.price);
        this.setState({
          booking_price:
            specialOffer != '0'
              ? (
                  price -
                  (parseInt(specialOffer) / 100) * parseInt(price)
                ).toFixed(2)
              : price,
        });
      }
    });
  };

  getDay(day) {
    moment(day).format('');
  }
  onDayPress = (dateString) => {
    let updateCalender = true;
    let object;
    this.setState({showMorningShift: true, showEveningShift: true});

    this.checkShifts(dateString);
    this.state.selectedDates.length = 0;
    //console.log('Latest Console for date', dateString);
    let markedDates = {};
    let selected_dates = this.state.selectedDates;
    let closedDates = this.state._closedDates;
    let finalSelectedDates = this.state.fixedMarkedDates;
    selected_dates.push(dateString);
    markedDates[dateString] = {selected: true};
    // this.setState({_markedDates: this.state.fixedMarkedDates});
    for (var key of Object.keys(closedDates)) {
      // console.log(key + '->' + closedDates[key]);
      if (key == dateString) {
        console.log('Yes!', key, dateString);
        // delete finalSelectedDates[dateString];
        updateCalender = false;
      }
    }
    if (updateCalender) {
      this.calculatePriceByDayForOneDay(dateString);
      object = {...finalSelectedDates, ...markedDates};
      this.setState({
        _markedDates: object,
        selectedDates: selected_dates,
      });
    }
  };

  checkShifts = (date) => {
    let arrayUpcoming = this.state.upcoming_dates;
    let arrayClosed = this.state.cancel_dates;
    for (let i = 0; i < arrayUpcoming.length; i++) {
      if (date === arrayUpcoming[i].date) {
        if (arrayUpcoming[i].shift === 0) {
          null;
        } else {
          if (arrayUpcoming[i].shift === 1) {
            this.setState({showMorningShift: false});
          } else {
            if (arrayUpcoming[i].shift === 2) {
              this.setState({showEveningShift: false});
            }
          }
        }
      }
    }
    for (let i = 0; i < arrayClosed.length; i++) {
      if (date === arrayClosed[i].date) {
        if (arrayClosed[i].period === 0 || arrayClosed[i].period === 3) {
          null;
        } else {
          if (arrayClosed[i].period === 1) {
            this.setState({showMorningShift: false});
          } else {
            if (arrayClosed[i].period === 2) {
              this.setState({showEveningShift: false});
            }
          }
        }
      }
    }
  };
  inputcheck() {
    let shift = '';
    if (this.state.first == true && this.state.second == false) {
      Alert.alert(
        strings('activities_screen.alert'),
        strings('payment_screen.check_time_shift'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
    } else {
      this.doBooking();
    }
  }
  setBookingPrice() {}

  doBooking = () => {
    const {params} = this.props.navigation.state;
    this.setState({loading: true});
    let daySelected = this.state.selectedDates;
    let shift = '';
    if (this.state.first == 1) {
      shift = '1';
    } else if (this.state.first == 2) {
      shift = '2';
    }
    // else if (this.state.first == true && this.state.second == true) {
    //   shift = '3';
    // }
    let tempDateArray = [];
    if (params.reservations == 1 && params.first == 1) {
      daySelected.push(params.startTime, params.endTime);
      tempDateArray.push(daySelected);
    } else if (params.reservations == 2 && this.state.first == 1) {
      daySelected.push(
        params.morningShiftStartTime,
        params.morningShiftEndTime,
      );
      tempDateArray.push(daySelected);
    } else if (params.reservations == 2 && this.state.first == 2) {
      daySelected.push(params.eve_start_time, params.eve_end_time);
      tempDateArray.push(daySelected);
    } else if (params.reservations == 1 && params.second == 1) {
      daySelected.map((value, index) => {
        let days = [];
        //console.log('checkssssssssssss', daySelected[index]);
        days.push(daySelected[index]);
        days.push('');
        days.push('');
        tempDateArray.push(days);
      });
    }
    if (daySelected.length == 0) {
      alert(strings('payment_screen.select_a_date'));
    } else if (this.state.date == null) {
      alert(strings('payment_screen.asstimated_arrival_time'));
    } else if (this.state.payment == 0) {
      alert(strings('payment_screen.select_payment_method'));
    } else if (params.reservations == 2 && this.state.first == 0) {
      alert('Please select morning or evening period');
    } else if (this.state.termsAndConditions == false) {
      alert(strings('add_property_screen.terms&conditions'));
    } else {
      this.setState({loader: true});
      let body = {
        property_id: this.state.id,
        days: daySelected.length,
        total_price: this.state.booking_price,
        date_time: tempDateArray,
        down_payment: Math.round(
          (20 / 100) * parseInt(this.state.booking_price, 10),
        ),

        promo_code: this.state.promo_code === '' ? null : this.state.promo_code,
        special_request:
          this.state.special_request === '' ? null : this.state.special_request,
        arrival_time: moment(
          '1976-04-19T' + this.state.date.toLocaleTimeString(),
        ).format('hh:mm a'),
        payment_method: this.state.payment,
        shift: params.reservations == 1 ? '0' : shift,
        booking_date_time:
          daySelected[0] + ' ' + moment(this.state.date).format('HH:mm'),
        check_in:
          params.reservations == 1
            ? params.second == 1
              ? moment(
                  '1976-04-19T' + this.state.date.toLocaleTimeString(),
                ).format('hh:mm a')
              : params.morningShiftStartTime
            : this.state.first == 2
            ? params.eve_start_time
            : params.morningShiftStartTime,
        check_out:
          params.reservations == 1
            ? params.second == 1
              ? null
              : params.morningShiftEndTime
            : this.state.first == 2
            ? params.eve_end_time
            : params.morningShiftEndTime,
      };
      // console.log('APiDate:----', JSON.stringify(body));

      Api.book_property(body)
        .then(
          function (response) {
            console.log('APiDate:----', JSON.stringify(response));
            if (response.status != 200) {
              this.setState({loader: false});
              Alert.alert(
                strings('activities_screen.alert'),
                lang == 'en'?response.message:response.message_arabic,
                [
                  {
                    text: strings('add_property_screen.ok'),
                  },
                ],
              );
            } else {
              console.log('TypeAPIResponse: ', JSON.stringify(response));
              Alert.alert(
                strings('activities_screen.alert'),
                strings('payment_screen.booking_placed'),
                [
                  {
                    text: strings('add_property_screen.ok'),
                  },
                ],
              );
              this.setState({loader: false});
              this.props.navigation.navigate('DebitCard');
            }
          }.bind(this),
        )
        .catch(
          function (error) {
            this.setState({loader: false});
            Alert.alert('Error', 'Check your internet!', [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          }.bind(this),
        );
    }
  };

  render() {
    let rotateBack = this.state.rotate;
    const {show, date, mode} = this.state;
    const {params} = this.props.navigation.state;
    const eng_name = params ? params.eng_name : null;
    const reservations = params ? params.reservations : null;
    const second = params ? params.second : null;
    const first = params ? params.first : null;
    const startTime = params ? params.startTime : null;
    const endTime = params ? params.endTime : null;
    const morningShiftStartTime = params ? params.morningShiftStartTime : null;
    const morningShiftEndTime = params ? params.morningShiftEndTime : null;
    const eve_start_time = params ? params.eve_start_time : null;
    const eve_end_time = params ? params.eve_end_time : null;
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={eng_name}
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
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 30,
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                }}>
                {reservations == 1
                  ? first == 1
                    ? strings('payment_screen.one_day')
                    : strings('payment_screen.multi_day')
                  : strings('payment_screen.two_resrvation')}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => this.RBSheet.open()}
              style={{
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#979191',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}>
                {this.state.selectedDates.length == 0
                  ? strings('payment_screen.select_reservation_day')
                  : this.state.selectedDates.toString()}
              </Text>
              <Image
                resizeMode={'contain'}
                style={{
                  width: 15,
                  height: 15,
                  // marginTop: 5,
                  transform: [{rotate: rotateBack}],
                }}
                source={require('../../../assets/images/forward.png')}
              />
            </TouchableOpacity>

            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
              }}
              height={450}
              openDuration={250}
              customStyles={{
                container: {
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                },
              }}>
              <View>
                <Calendar
                  type="gregorian"
                  minDate={_today}
                  onDayPress={
                    reservations == 1 && second == 1
                      ? this.onDaySelect
                      : ({dateString}) => {
                          this.onDayPress(dateString);
                        }
                  }
                  hideExtraDays={true}
                  markedDates={this.state._markedDates}
                  markingType={'multi-dot'}
                  firstDay={1}
                  disableAllTouchEventsForDisabledDays={true}
                  enableSwipeMonths={true}
                  theme={{
                    textSectionTitleColor: '#B20C11',
                    selectedDayBackgroundColor: 'red',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#B20C11',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#00000020',
                    dotColor: '#00adf5',
                    monthTextColor: 'black',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'black',
                    disabledArrowColor: '#d9e1e8',
                    indicatorColor: 'blue',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14,
                  }}
                />
              </View>

              {reservations == 2 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      marginTop: 5,
                      marginLeft: 20,
                    }}>
                    {this.state.showMorningShift && (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({first: this.state.first != 1 ? 1 : 0});
                        }}
                        style={{
                          justifyContent: 'flex-start',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 20,
                          padding: 10,
                        }}>
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 20 / 2,
                            borderColor:
                              this.state.first == 1 ? '#B20C11' : '#979191',
                            borderWidth: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={{
                              width: 10,
                              height: 10,
                              backgroundColor:
                                this.state.first == 1 ? '#B20C11' : 'white',
                              borderRadius: 10 / 2,
                            }}></TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            color: 'gray',
                            marginLeft: 10,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                          }}>
                          {strings('payment_screen.morning_period')}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {this.state.showEveningShift && (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({first: this.state.first != 2 ? 2 : 0});
                        }}
                        style={{
                          justifyContent: 'flex-start',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 10,
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 20 / 2,
                            borderColor:
                              this.state.first == 2 ? '#B20C11' : '#979191',
                            borderWidth: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={{
                              width: 10,
                              height: 10,
                              backgroundColor:
                                this.state.first == 2 ? '#B20C11' : 'white',
                              borderRadius: 10 / 2,
                            }}></TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            color: 'gray',
                            marginLeft: 10,
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                          }}>
                          {strings('payment_screen.eve_period')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => this.RBSheet.close()}
                    style={{
                      backgroundColor: '#B20C11',
                      borderRadius: 10,
                      marginRight: 20,
                      height: 45,
                      width: '45%',
                      marginTop: 20,
                      flexDirection: 'row',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}>
                      {strings('payment_screen.select_date')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.RBSheet.close();
                    this.setBookingPrice();
                  }}
                  style={{
                    backgroundColor: '#B20C11',
                    borderRadius: 10,
                    marginRight: 20,
                    height: 45,
                    width: '45%',
                    marginTop: 20,
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('payment_screen.select_date')}
                  </Text>
                </TouchableOpacity>
              )}
            </RBSheet>

            {second == 0 ? (
              <View
                style={{
                  marginLeft: 5,
                  marginTop: 20,
                  flexDirection: 'column',
                }}>
                <Text style={{writingDirection: lang == 'en' ? 'ltr' : 'rtl'}}>
                  {reservations == 1
                    ? strings('property_detail_screen.one_day')
                    : strings('property_detail_screen.morning_shift')}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    color: '#B20C11',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                  }}>
                  {reservations == 1
                    ? startTime + '-' + endTime
                    : morningShiftStartTime + '-' + morningShiftEndTime}
                </Text>
                {reservations == 2 && (
                  <View>
                    <Text
                      style={{
                        marginTop: 10,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}>
                      {strings('property_detail_screen.evening_shift')}
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        color: 'gray',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                      }}>
                      {eve_start_time + '-' + eve_end_time}
                    </Text>
                  </View>
                )}
              </View>
            ) : null}

            <View
              style={{
                marginTop: 20,
                borderBottomColor: '#F2F0F1',
                borderBottomWidth: 2,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text
                style={{
                  color: '#979191',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                }}>
                {strings('payment_screen.total_price')}
              </Text>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                  color: '#B20C11',
                }}>
                {Preference.get('currency')+" " + this.state.booking_price}
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
                borderBottomColor: '#F2F0F1',
                borderBottomWidth: 2,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text
                style={{
                  color: '#979191',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                }}>
                {strings('payment_screen.down_payment')}
              </Text>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                }}>
                {Preference.get('currency')+" " +
                  Math.round(
                    (20 / 100) * parseInt(this.state.booking_price, 10),
                  )}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 40,
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                  marginTop: 10,
                }}>
                {strings('payment_screen.promo_code')}
              </Text>
              <TextInput
                onChangeText={(text) =>
                  this.setState({
                    promo_code: text,
                  })
                }
                style={{
                  height: 50,
                  width: '55%',
                  textAlign: lang == 'en' ? 'left' : 'right',
                  borderColor: '#F2F0F1',
                  borderRadius: 5,
                  borderWidth: 2,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginTop: 40,
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                  marginTop: 10,
                }}>
                {strings('payment_screen.special_request')}
              </Text>
              <TextInput
                onChangeText={(text) =>
                  this.setState({
                    special_request: text,
                  })
                }
                multiline={true}
                placeholder={strings('payment_screen.placeholder_special')}
                placeholderTextColor="#d1cbcb"
                style={{
                  height: 140,
                  width: '100%',
                  marginTop: 30,
                  borderColor: '#F2F0F1',
                  textAlign: lang == 'en' ? 'left' : 'right',
                  borderRadius: 5,
                  borderWidth: 2,
                  textAlignVertical: 'top',
                  // paddingBottom: 110,
                  // paddingLeft: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                  marginTop: 10,
                }}>
                {strings('payment_screen.estimated_arrival')}
              </Text>
              <TouchableOpacity
                style={{marginTop: 10}}
                onPress={() => this.setState({textShow: true, show: true})}>
                {this.state.textShow ? (
                  <Text style={{alignSelf: 'center', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20}}>
                    {
                      date == null
                        ? strings('payment_screen.select_time')
                        : moment(date).format('LT')
                      // moment(
                      //   '1976-04-19T' + this.state.date.toLocaleTimeString(),
                      // ).format('hh:mm a')
                    }
                  </Text>
                ) : (
                  <Text style={{alignSelf: 'center', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20}}>
                    {strings('payment_screen.select_time')}
                  </Text>
                )}
              </TouchableOpacity>
              {show && Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={{width: '100%'}}
                  onPress={() => this.setState({show: false})}>
                  <Text style={{alignSelf: 'flex-end', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16}}>
                    {strings('add_property_screen.close')}
                  </Text>
                </TouchableOpacity>
              )}
              {show && (
                <DateTimePicker
                  is24Hour={false}
                  onTouchCancel={() => {
                    //console.log('kjwbckjbdwc');
                  }}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                  onCancel={() => {
                    //console.log('kjwbckjbdwc');
                  }}
                  value={date}
                  onChange={(event, value) => {
                    //console.log('value:', value);
                    if (value == undefined) {
                      null;
                    } else {
                      this.setState({
                        date: value,
                        show: Platform.OS === 'ios' ? true : false,
                      });
                    }
                    if (event.type === 'set') {
                      //console.log('value:', value);
                    }
                  }}
                />
              )}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                    marginTop: 10,
                  }}>
                  {strings('payment_screen.payment_method')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({payment: this.state.payment != 1 ? 1 : 0});
                  }}
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 15,
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      borderColor:
                        this.state.payment == 1 ? '#B20C11' : '#979191',
                      borderWidth: 1.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor:
                          this.state.payment == 1 ? '#B20C11' : 'white',
                        borderRadius: 10 / 2,
                      }}></TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: 'gray',
                      marginLeft: 10,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('debit_card_screen.debit_card')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({payment: this.state.payment != 2 ? 2 : 0});
                  }}
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 15,
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      borderColor:
                        this.state.payment == 2 ? '#B20C11' : '#979191',
                      borderWidth: 1.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor:
                          this.state.payment == 2 ? '#B20C11' : 'white',
                        borderRadius: 10 / 2,
                      }}></TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: 'gray',
                      marginLeft: 10,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                    }}>
                    {strings('credit_card_screen.credit_card')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 50,
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    termsAndConditions: !this.state.termsAndConditions,
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
              <Text style={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12}}>
                {strings('payment_screen.terms_condition1')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({webViewDisplay: true})}
              style={{alignItems: 'center', marginLeft: 20}}>
              <Text style={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12, color: '#B20C11'}}>
                {strings('payment_screen.terms_condition2')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.doBooking();
                //this.props.navigation.navigate('DebitCard')}
              }}
              disabled={!this.state.termsAndConditions}
              style={{
                backgroundColor: this.state.termsAndConditions
                  ? '#B20C11'
                  : 'gray',
                height: 40,
                width: '40%',
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
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                }}>
                {strings('payment_screen.book')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
        {this.state.loader && <Loader />}
        {this.state.webViewDisplay && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: '#FFF2F2',
            }}>
            <WebView
              style={{flex: 1}}
              contentInset={{top: 10, bottom: 10, right: 10, left: 10}}
              source={{uri: 'https://doshag.net/terms-of-service-2/'}}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({webViewDisplay: false});
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
      </View>
    );
  }
}

export default index;
