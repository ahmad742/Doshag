import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Modal,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { Avatar } from 'react-native-paper';
import Header from '../../../component/TopHeader/Header';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment, { locale } from 'moment';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
import { strings } from '../../../i18n';
import Preference from 'react-native-preference';

const _format = 'YYYY-MM-DD';
const _today = moment().format(_format);
const _maxDate = moment().add(30, 'days').format(_format);
const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' };
const massage = { key: 'massage', color: 'blue', selectedDotColor: 'blue' };
const workout = { key: 'workout', color: 'green' };
let count = 0;
const lang = Preference.get('language');
let dateChange = false;

let arrayCancel = [];

export class CalenderScreen extends Component {
  initialState = {
    [_today]: { disabled: true },
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      isVisible: false,
      selectedDates: [],
      _markedDates: this.initialState,
      fixedMarkedDates: this.initialState,
      // _closedDates: this.initialState,
      id: undefined,
      switchValue: false,
      switchValue2: false,
      loading: false,
      closedDates: [],
      demo_cancel: [],
      upcoming_dates: [],
      closed: 0,
      past: 0,
      upcoming: 0,
      totalLength: 0,
      refreshing: false,
      showMorningShift: true,
      showEveningShift: true,
      showMorningShiftClosed: true,
      showEveningShiftClosed: true,
      rotate: '0deg',
      rotate2: '0deg',
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      // alert('testing focus listener')
      this.fetchCancelReservation();
    });
    if (lang != 'en') {
      this.rotation();
      LocaleConfig.locales.ar = {
        monthNames: [
          'يناير',
          'فبراير',
          'مارس',
          'أبريل',
          'مايو',
          'يونيو',
          'يوليو',
          'أغسطس',
          'سبتمبر',
          'أكتوبر',
          'نوفمبر',
          'ديسمبر',
        ],
        monthNamesShort: [
          'يناير',
          'فبراير',
          'مارس',
          'أبريل',
          'مايو',
          'يونيو',
          'يوليو',
          'أغسطس',
          'سبتمبر',
          'أكتوبر',
          'نوفمبر',
          'ديسمبر',
        ],
        dayNames: [
          'يَوم الأحَد',
          'يَوم الإثنين',
          'يَوم الثلاثاء',
          'يَوم الأربعاء',
          'يَوم الخميس',
          'يَوم الجمعة',
          'يَوم السبت',
        ],
        dayNamesShort: ['الأحد',
          'الإثنين',
          'الثلاثاء',
          'الأربعاء',
          'الخميس',
          'الجمعة',
          'السبت',],
      };
      LocaleConfig.defaultLocale = 'ar';
      dateChange = true;
    } else {
      this.rotation2();
    }
  }
  rotation = () => {
    if (Preference.get('language') == 'en') {
      this.setState({ rotate: '0deg' });
    } else {
      this.setState({ rotate: '180deg' });
    }
  };
  rotation2 = () => {
    if (Preference.get('language') == 'en') {
      this.setState({ rotate2: '180deg' });
    } else {
      this.setState({ rotate2: '0deg' });
    }
  };
  fetchCancelReservation = () => {
    this.setState({ loading: true, refreshing: true });
    const { item } = this.props;
    let body = new FormData();
    body.append('property_id', item.itemId);
    console.log('BodyData', body);
    Api.fetchcancelReservation(body)
      .then(
        function (response) {
          console.log(
            'Reservation Date:-- ',
            JSON.stringify(response),
          );
          arrayCancel = [...response.data.cancel_reservation];
          this.setState(
            {
              loading: false,
              closedDates: response.data.cancel_reservation,
              closed: response.data.cancel_total,
              past: response.data.past_total,
              upcoming: response.data.upcoming_total,
              upcoming_dates: [...response.data.upcoming_bookings],
            },
            () => {
              let markedDates = {};
              let dublicateCancel = [];
              let selectedDate=[]
              // let sortedCancel = [];
              let bookingTemp = response.data.upcoming_bookings,
                count = {},
                cancelTemp = response.data.cancel_reservation,
                past_bookings = response.data.past_bookings;
              for (let i = 0; i < cancelTemp.length; i++) {
                for (let j = i + 1; j < cancelTemp.length; j++) {
                  if (cancelTemp[i].date == cancelTemp[j].date) {
                    // //console.log('hamza Add and delete');
                    // markedDates[cancelTemp[i].date] = {
                    //   dots: [{color: 'green'}, {color: '#640141'}],
                    //   selected: true,
                    // };
                    dublicateCancel.push(cancelTemp[i]);
                    cancelTemp.splice(i, 1);
                  }
                }
              }
              for (let i = 0; i < bookingTemp.length; i++) {
                let dateSelected = bookingTemp[i].booking_date_time;
                let selectedDate = dateSelected.split(" ");
                if (bookingTemp[i].shift == '0') {
                  markedDates[selectedDate[0]] = {
                    // disabled: true, startingDay: true, color: 'blue', endingDay: true
                    customStyles: {
                      container: {
                        backgroundColor: 'blue',
                      },
                      text: {
                        color: 'black',
                        fontWeight: 'bold',
                      },
                    },
                  };
                } else if (bookingTemp[i].shift == '1') {
                  let loading2 = true;
                  for (var key of Object.keys(markedDates)) {
                    if (key == selectedDate[0]) {
                      loading2 = false;
                    }
                  }
                  loading2 ?
                    (markedDates[selectedDate[0]] = {
                      dots: [{ color: 'yellow' }],
                    })
                    :
                    (markedDates[selectedDate[0]] = {
                      dots: [{ color: 'yellow' }, { color: 'blue' }],
                      selected: true,
                      selectedColor: 'pink',
                      disabled: true,
                      disableTouchEvent: true,
                    });
                } else if (bookingTemp[i].shift == '2') {
                  let loading2 = true;
                  for (var key of Object.keys(markedDates)) {
                    if (key == selectedDate[0]) {
                      loading2 = false;
                    }
                  }
                  loading2
                    ? (markedDates[selectedDate[0]] = {
                      dots: [{ color: 'blue' }],
                    })
                    : (markedDates[selectedDate[0]] = {
                      dots: [{ color: 'yellow' }, { color: 'blue' }],
                      selected: true,
                      selectedColor: 'pink',
                      disabled: true,
                      disableTouchEvent: true,
                    });
                } else if (bookingTemp[i].shift == '3') {
                  markedDates[selectedDate[0]] = {
                    dots: [{ color: 'yellow' }, { color: 'blue' }],
                    selected: true,
                    selectedColor: 'pink',
                    disabled: true,
                    disableTouchEvent: true,
                  };
                }
              }
              for (let i = 0; i < cancelTemp.length; i++) {
                // //console.log('fghfhgfhg',cancelTemp[i].date)

                if (cancelTemp[i].period == 3) {
                  markedDates[cancelTemp[i].date] = {
                    dots: [{ color: 'green' }, { color: '#640141' }],
                    selected: true,
                    disabled: true,
                    disableTouchEvent: true,
                  };
                  // } else if (cancelTemp[i].date == cancelTemp[i].date) {
                  //   markedDates[cancelTemp[i].date] = {
                  //     dots: [{color: 'green'}, {color: '#640141'}],
                  //     selected: true,
                  //   };
                } else if (cancelTemp[i].period == 2) {
                  let loading2 = true;
                  for (var key of Object.keys(markedDates)) {
                    if (key == cancelTemp[i].date) {
                      loading2 = false;
                    }
                  }

                  loading2
                    ? (markedDates[cancelTemp[i].date] = {
                      dots: [{ color: '#640141' }],
                    })
                    : (markedDates[cancelTemp[i].date] = {
                      dots: [{ color: '#640141' }, { color: 'yellow' }],
                      disabled: true,
                      disableTouchEvent: true,
                    });
                } else if (cancelTemp[i].period == 1) {
                  let loading2 = true;
                  for (var key of Object.keys(markedDates)) {
                    if (key == cancelTemp[i].date) {
                      loading2 = false;
                    }
                  }

                  loading2
                    ? (markedDates[cancelTemp[i].date] = {
                      dots: [{ color: 'green' }],
                    })
                    : (markedDates[cancelTemp[i].date] = {
                      dots: [{ color: 'green' }, { color: 'blue' }],
                      disabled: true,
                      disableTouchEvent: true,
                    });
                } else if (cancelTemp[i].period == 0) {
                  markedDates[cancelTemp[i].date] = {
                    // disabled: true, startingDay: true, color: 'red', endingDay: true
                    customStyles: {
                      container: {
                        backgroundColor: 'red',
                      },
                      text: {
                        color: 'black',
                        fontWeight: 'bold',
                      },
                    },
                  };
                }
              }
              for (let i = 0; i < dublicateCancel.length; i++) {
                markedDates[dublicateCancel[i].date] = {
                  dots: [{ color: 'green' }, { color: '#640141' }],
                  selected: true,
                  disabled: true,
                  disableTouchEvent: true,
                };
              }

              console.log('marked_Dates', markedDates);
              this.setState({
                _markedDates: markedDates,
                fixedMarkedDates: markedDates,
                totalLength: Object.keys(markedDates).length,
                refreshing: false,
              });
            },
          );
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({ loading: false, refreshing: false });
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  };

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }

  toggleSwitch = (value) => {
    this.setState({ switchValue: value });
  };
  toggleSwitch2 = (value) => {
    this.setState({ switchValue2: value });
  };
  reservation2OnDayPress = (dateString) => {
    let updateCalender = true;
    let object;
    // this.setState({showMorningShift: true, showEveningShift: true});

    // this.checkShifts(dateString);
    this.state.selectedDates.length = 0;
    //console.log('Latest Console for date', dateString);
    let markedDates = {};
    let selected_dates = this.state.selectedDates;
    // let closedDates = this.state._closedDates;
    let finalSelectedDates = this.state.fixedMarkedDates;
    selected_dates.push(dateString);
    markedDates[dateString] = { selected: true, selectedColor: 'green' };
    // this.setState({_markedDates: this.state.fixedMarkedDates});
    // for (var key of Object.keys(closedDates)) {
    //   // console.log(key + '->' + closedDates[key]);
    //   if (key == dateString) {
    //     console.log('Yes!', key, dateString);
    //     // delete finalSelectedDates[dateString];
    //     updateCalender = false;
    //   }
    // }
    if (updateCalender) {
      // this.calculatePriceByDayForOneDay(dateString);
      object = { ...finalSelectedDates, ...markedDates };
      this.setState({
        _markedDates: object,
        selectedDates: selected_dates,
      });
    }
  };
  onDayPress = (dateString) => {
    // //console.log('Total Length',this.state.totalLength)
    const { item } = this.props;
    let length = this.state.totalLength;
    let loading = true;
    let loading2 = true;
    let object;
    this.state.selectedDates.length = 0;
    // //console.log('Latest Console for date', dateString);
    let markedDates = {};
    let selected_dates = this.state.selectedDates;
    let finalSelectedDates = this.state._markedDates;
    // //console.log('Type of _marked datess',JSON.stringify(finalSelectedDates))
    selected_dates.push(dateString);
    markedDates[dateString] =
      item.reservation == 2
        ? { selected: true, selectedColor: 'green' }
        : { customStyles: { container: { backgroundColor: 'green' } } };

    if (length == Object.keys(finalSelectedDates).length) {
      for (var key of Object.keys(finalSelectedDates)) {
        // console.log(key + '->' + finalSelectedDates[key]);
        if (key == dateString) {
          // //console.log('Yes!', key, dateString);
          // delete finalSelectedDates[dateString];
          loading2 = false;
        }
      }
      if (loading2) {
        object = { ...finalSelectedDates, ...markedDates };
        this.setState({
          _markedDates: object,
          selectedDates: selected_dates,
        });
      }
    } else {
      for (var key of Object.keys(finalSelectedDates)) {
        // console.log(key + '->' + finalSelectedDates[key]);
        if (key == dateString) {
          // //console.log('Yes!', key, dateString);
          loading = false;
        }
        object = { ...finalSelectedDates };
        this.setState({
          _markedDates: object,
          selectedDates: selected_dates,
        });
      }
      if (loading) {
        delete finalSelectedDates[dateString];
        let LastItem = Object.keys(finalSelectedDates).pop();
        //console.log('LAst Item : --- ', LastItem);
        delete finalSelectedDates[LastItem];
        object = { ...finalSelectedDates, ...markedDates };
        this.setState({
          _markedDates: object,
          selectedDates: selected_dates,
        });
      }
    }
  };
  periodCheck(date) {
    let fullPackedDate = true;
    let arrayUpcoming = this.state.upcoming_dates;
    let arrayClosed = arrayCancel;
    if (this.state.selectedDates.length == 0) {
      Alert.alert(strings('activities_screen.alert'), strings('reservation_calender_screen.select_date'), [
        {
          text: strings('add_property_screen.ok'),
        },
      ]);
    } else {
      for (let i = 0; i < arrayUpcoming.length; i++) {
        if (date === arrayUpcoming[i].date) {
          if (arrayUpcoming[i].shift === 0) {
            fullPackedDate = false;
          } else {
            if (arrayUpcoming[i].shift === 1) {
              this.state.showMorningShift = false;
            } else if (arrayUpcoming[i].shift === 3) {
              fullPackedDate = false;
            } else {
              if (arrayUpcoming[i].shift === 2) {
                this.state.showEveningShift = false;
              }
            }
          }
        }
      }
      // console.log("Dates",JSON.stringify(this.state.demo_cancel))
      for (let i = 0; i < arrayClosed.length; i++) {
        // console.log("Number of times loop run"+JSON.stringify(arrayClosed[i]))
        if (date === arrayClosed[i].date) {
          if (arrayClosed[i].period === 0 || arrayClosed[i].period === 3) {
            fullPackedDate = false;
          } else if (arrayClosed[i].period === 1) {
            this.state.showMorningShiftClosed = false;
          } else if (arrayClosed[i].period === 2) {
            this.state.showEveningShiftClosed = false;
          }
        }
      }
      if (
        fullPackedDate == true &&
        this.state.showEveningShift == false &&
        this.state.showMorningShift == false
      ) {
        Alert.alert(
          strings('activities_screen.alert'),
          strings('reservation_calender_screen.alert_full_day_closed'),
          [
            {
              text: strings('add_property_screen.ok'),
            },
          ],
        ),
          this.setState({
            showEveningShift: true,
            showMorningShift: true,
            showEveningShiftClosed: true,
            showMorningShiftClosed: true,
            selectedDates: [],
          });
      } else if (
        fullPackedDate == true &&
        this.state.showEveningShiftClosed == false &&
        this.state.showMorningShiftClosed == false
      ) {
        Alert.alert(
          strings('activities_screen.alert'),
          strings('reservation_calender_screen.alert_full_day_closed'),
          [
            {
              text: strings('add_property_screen.ok'),
            },
          ],
        ),
          this.setState({
            showEveningShift: true,
            showMorningShift: true,
            showEveningShiftClosed: true,
            showMorningShiftClosed: true,
            selectedDates: [],
          });
      } else if (
        fullPackedDate == true &&
        (this.state.showEveningShift == true ||
          this.state.showMorningShift == true ||
          this.state.showMorningShiftClosed == true ||
          this.state.showEveningShiftClosed == true)
      ) {
        this.setState({ isVisible: true });
      } else {
        Alert.alert(
          strings('activities_screen.alert'),
          strings('reservation_calender_screen.alert_full_day_closed'),
          [
            {
              text: strings('add_property_screen.ok'),
            },
          ],
        ),
          this.setState({
            showEveningShift: true,
            showMorningShift: true,
            showEveningShiftClosed: true,
            showMorningShiftClosed: true,
            selectedDates: [],
          });
      }
    }
  }
  closeDate() {
    if (this.state.selectedDates.length == 0) {
      Alert.alert(strings('activities_screen.alert'), strings('reservation_calender_screen.select_date'), [
        {
          text: strings('add_property_screen.ok'),
        },
      ]);
    } else {
      let loading2 = true;
      let loading3 = true;
      let closedDates = this.state.closedDates;
      let upcomingDates = this.state.upcoming_dates;
      //  console.log('Dates',closedDates);
      for (let i = 0; i < closedDates.length; i++) {
        if (closedDates[i].date == this.state.selectedDates[0]) {
          loading2 = false;
        }
      }
      for (let i = 0; i < upcomingDates.length; i++) {
        if (upcomingDates[i].date == this.state.selectedDates[0]) {
          loading3 = false;
        }
      }

      loading2 && loading3
        ? this.hitApi()
        : Alert.alert(strings('activities_screen.alert'), strings('reservation_calender_screen.select_date'), [
          {
            text: strings('add_property_screen.ok'),
          },
        ]);
    }
  }
  checkSwitch() {
    if (this.state.switchValue == false && this.state.switchValue2 == false) {
      Alert.alert(strings('activities_screen.alert'), strings('reservation_calender_screen.select_period'), [
        {
          text: strings('add_property_screen.ok'),
        },
      ]);
    } else {
      this.hitApi();
    }
  }
  hitApi() {
    this.setState({ loading: true });
    let period;
    if (this.state.switchValue == true && this.state.switchValue2 == true) {
      period = 3;
    } else if (
      this.state.switchValue == true &&
      this.state.switchValue2 == false
    ) {
      period = 1;
    } else if (
      this.state.switchValue == false &&
      this.state.switchValue2 == true
    ) {
      period = 2;
    } else {
      period = 0;
    }
    const { item } = this.props;
    let body = new FormData();
    body.append('property_id', item.itemId);
    body.append('period', period);
    body.append('date', this.state.selectedDates[0]);
    //console.log('BodyData', body);
    Api.cancelReservation(body)
      .then(
        function (response) {
          //console.log('Canceled:-- ', JSON.stringify(response));
          this.setState({ loading: false });
          this.fetchCancelReservation();
          Alert.alert(strings('activities_screen.alert'), strings('activities_screen.date_closed'), [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
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
  render() {
    const { item } = this.props;

    console.log("item====>>>>>",item)

    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    let rotateBack = this.state.rotate;
    let rotateBack2 = this.state.rotate2;
    return (
      <LinearGradient
        colors={['#fbf4ed', '#fbf4ed']}
        style={{
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 5,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.fetchCancelReservation();
              }}
            />
          }>
          <View
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
            }}>
            <View
              style={{
                marginTop: 30,
                padding: 15,
                backgroundColor: 'white',
                borderColor: '#F2F0F1',
                borderRadius: 5,
                borderWidth: 2,
                // height: '50%',
                // width: '100%',
                flexDirection: 'row',
                // alignSelf: 'center',
                // alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                  }}>
                  {this.state.closed}
                </Text>
                <Text
                  style={{
                    color: '#979191',
                    marginTop: 10,
                  }}>
                  {strings('reservation_calender_screen.closed')}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 7,
                  height: 60,
                  borderLeftWidth: 1,
                  borderLeftColor: '#F2F0F1',
                }}
              />

              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                  }}>
                  {this.state.upcoming}
                </Text>
                <Text
                  style={{
                    color: '#979191',
                    marginTop: 10,
                  }}>
                  {strings('activities_screen.upcoming')}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  height: 60,
                  borderLeftWidth: 1,
                  borderLeftColor: '#F2F0F1',
                }}
              />

              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                  }}>
                  {this.state.past}
                </Text>
                <Text
                  style={{
                    color: '#979191',
                    marginTop: 10,
                  }}>
                  {strings('notification_screen.previous')}
                </Text>
              </View>
            </View>

            {item.reservation == 2 ? (
              <View>
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 90 / 2,
                      borderColor: 'yellow',
                      borderWidth: 2,
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 15,
                    }}>
                    {strings(
                      'reservation_calender_screen.morning_period_reserve',
                    )}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 90 / 2,
                      borderColor: 'blue',
                      borderWidth: 2,
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 15,
                    }}>
                    {strings('reservation_calender_screen.eve_period_reserve')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 90 / 2,
                      borderColor: 'pink',
                      borderWidth: 2,
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 15,
                    }}>
                    {strings('reservation_calender_screen.full_day_reserved')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 90 / 2,
                      borderColor: 'green',
                      borderWidth: 2,
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 15,
                    }}>
                    {strings('reservation_calender_screen.morning_closed')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 90 / 2,
                      borderColor: '#640141',
                      borderWidth: 2,
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 15,
                    }}>
                    {strings('reservation_calender_screen.eve_closed')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 90 / 2,
                      borderColor: 'red',
                      borderWidth: 2,
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 15,
                    }}>
                    {strings('reservation_calender_screen.full_day_closed')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 90 / 2,
                      borderColor: 'blue',
                      borderWidth: 2,
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 15,
                    }}>
                    {strings('reservation_calender_screen.date_reserved')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 90 / 2,
                      borderColor: 'red',
                      borderWidth: 2,
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 15,
                    }}>
                    {strings('reservation_calender_screen.closed_date')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                flex: 1,
                marginTop: 30,
                justifyContent: 'center',
              }}>
              <Calendar
                type="gregorian"
                key={dateChange}
                // Initially visible month. Default = Date()
                current={_today}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={_today}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                // maxDate={_maxDate}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={({ dateString }) => {
                  item.reservation == 2
                    ? this.reservation2OnDayPress(dateString)
                    : this.onDayPress(dateString);
                }}
                // Handler which gets executed on day long press. Default = undefined
                //onDayLongPress={(day) => { //console.log('selected day', day) }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                // monthFormat={'dd MM yyyy'}
                // onMonthChange={(month) => { //console.log('month changed', month) }}
                // Hide month navigation arrows. Default = false
                hideArrows={false}
                renderArrow={(direction) => direction === 'left' ?
                  <Image style={{ height: 15, width: 20, resizeMode: "contain", tintColor: "black", transform: [{ rotate: rotateBack }] }}
                    source={require('../../../assets/images/back.png')} /> :
                  <Image style={{ height: 15, width: 20, resizeMode: "contain", tintColor: "black", transform: [{ rotate: rotateBack2 }] }}
                    source={require('../../../assets/images/back.png')} />}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                //renderArrow={(direction) => (<Arrow />)}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                markedDates={this.state._markedDates}
                markingType={item.reservation == 2 ? 'multi-dot' : 'custom'}
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                // disableMonthChange={false}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                // hideDayNames={false}
                // Show week numbers to the left. Default = false
                // showWeekNumbers={false}
                // onPressArrowLeft={subtractMonth => subtractMonth()}
                // onPressArrowRight={addMonth => addMonth()}
                // disableArrowLeft={false}
                // disableArrowRight={false}
                disableAllTouchEventsForDisabledDays={true}
                enableSwipeMonths={true}
                theme={{
                  textSectionTitleColor: '#B20C11',
                  // textSectionTitleDisabledColor: '#d9e1e8',
                  // selectedDayBackgroundColor: '',
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
                  // textDayFontFamily: 'Papyrus',
                  // textMonthFontFamily: 'Papyrus',
                  // textDayHeaderFontFamily: 'monospace',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 14,
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              item.reservation == 2
                ? this.periodCheck(this.state.selectedDates[0])
                : this.closeDate();
            }}
            style={{
              backgroundColor: '#B20C11',
              height: 40,
              width: '60%',
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: 30,
              marginBottom: 20,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
              }}>
              {strings('reservation_calender_screen.close_reservation')}
            </Text>
          </TouchableOpacity>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isVisible}
            onRequestClose={() => {
              this.setState({
                isVisible: false,
                showEveningShift: true,
                showEveningShiftClosed: true,
                showMorningShift: true,
                showMorningShiftClosed: true,
              });
              // Alert.alert('Modal has been closed.');
            }}>
            <View
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#000000AA',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  paddingBottom: 15,
                  marginTop: 22,
                  margin: 40,
                  backgroundColor: 'white',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginTop: 18,
                  }}></View>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isVisible: false,
                      showEveningShift: true,
                      showEveningShiftClosed: true,
                      showMorningShift: true,
                      showMorningShiftClosed: true,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    marginLeft: 20,
                    justifyContent: 'flex-end',
                  }}>
                  <Image
                    style={{
                      height: 15,
                      width: 15,
                      marginRight: 20,
                    }}
                    source={require('../../../assets/images/close.png')}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: 20,
                  }}>
                  {strings('reservation_calender_screen.close_reservation')}
                </Text>
                <Text
                  style={{
                    marginLeft: 20,
                    color: '#979191',
                    marginTop: 15,
                  }}>
                  {this.state.selectedDates[0]}
                </Text>
                {this.state.showMorningShift &&
                  this.state.showMorningShiftClosed && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 3,
                        marginTop: 20,
                        // backgroundColor:"pink"
                      }}>
                      <Text
                        style={{
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 13,
                          marginLeft: 20,
                          marginTop: 10,
                        }}>
                        {strings(
                          'reservation_calender_screen.close_morning_period',
                        )}
                      </Text>
                      <TouchableOpacity
                        style={{
                          marginRight: 10,
                          marginTop: 5,
                        }}>
                        <Switch
                          onValueChange={this.toggleSwitch}
                          value={this.state.switchValue}
                          trackColor={{ false: 'gray', true: '#f5a4a4' }}
                          thumbColor={'#B20C11'}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                {this.state.showEveningShift &&
                  this.state.showEveningShiftClosed && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 3,
                      }}>
                      <Text
                        style={{
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 13,
                          marginLeft: 20,
                          marginTop: 10,
                        }}>
                        {strings(
                          'reservation_calender_screen.close_eve_period',
                        )}
                      </Text>
                      <TouchableOpacity
                        style={{
                          marginRight: 10,
                          marginTop: 5,
                        }}>
                        <Switch
                          onValueChange={this.toggleSwitch2}
                          value={this.state.switchValue2}
                          trackColor={{ false: 'gray', true: '#f5a4a4' }}
                          thumbColor={'#B20C11'}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isVisible: false,
                      showEveningShift: true,
                      showEveningShiftClosed: true,
                      showMorningShift: true,
                      showMorningShiftClosed: true,
                    }),
                      this.checkSwitch();
                  }}>
                  <Text
                    style={{
                      color: '#B20C11',
                      textAlign: 'center',
                      marginRight: 20,
                      marginTop: 20,
                    }}>
                    {strings('add_property_screen.ok')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
        {this.state.loading && <Loader />}
      </LinearGradient>
    );
  }
}

let CloseDays = [
  {
    value: 'july 17, 2020',
    label: 'July 17, 2020',
  },
  {
    value: 'July 18, 2020',
    label: 'July 18, 2020',
  },
  {
    value: 'July 19, 2020',
    label: 'July 19, 2020',
  },
];

let UpcomingReser = [
  {
    value: 'july 17, 2020',
    label: 'July 17, 2020',
  },
  {
    value: 'July 18, 2020',
    label: 'July 18, 2020',
  },
  {
    value: 'July 19, 2020',
    label: 'July 19, 2020',
  },
];

let prreviousReser = [
  {
    value: 'july 17, 2020',
    label: 'July 17, 2020',
  },
  {
    value: 'July 18, 2020',
    label: 'July 18, 2020',
  },
  {
    value: 'July 19, 2020',
    label: 'July 19, 2020',
  },
];

class DetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,
      secondPopup: false,
      thirdPopup: false,
      isVisible: false,
      OkClick: false,
      closed: [],
      upcoming: [],
      past: [],
      totalPrice: '',
      downPayment: '',
      arrivalTime: '',
      firstName: '',
      lastName: '',
      image: '',
      email: '',
      phoneNo: '',
      refreshing: false,
      special_request: '',
    };
  }
  componentDidMount() {
    // const {navigation} = this.props;
    // this.focusListener = navigation.addListener('willFocus', () => {
    this.fetchCancelReservation();
    // });
  }
  fetchCancelReservation = () => {
    this.setState({ loading: true, refreshing: true });
    const { item } = this.props;
    let body = new FormData();
    body.append('property_id', item.itemId);
    console.log('BodyData', body);
    Api.fetchcancelReservation(body)
      .then(
        function (response) {
          // console.log(
          //   'Reservation Date on Detail Page:-- ',
          //   JSON.stringify(response),
          // );
          this.setState({
            loading: false,
            closed: response.data.cancel_reservation,
            upcoming: response.data.upcoming_bookings,
            past: response.data.past_bookings,
            refreshing: false,
          });
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({ loading: false, refreshing: false });
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  };
  removeClosedDays(id, index) {
    this.setState({ loading: true });
    let body = new FormData();
    body.append('reservation_id', id);
    //console.log('reservation_id', id);
    Api.deleteClosedReservation(body)
      .then(
        function (response) {
          // console.log(
          //   'Reservation Closed Cancel:-- ',
          //   JSON.stringify(response),
          // );
          this.state.closed.splice(index, 1);
          this.fetchCancelReservation();
          this.setState({ loading: false });
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
  userProfile(id) {
    this.setState({ loading: true });
    let body = new FormData();
    body.append('booking_id', id);
    //console.log('booking_id', id);
    Api.userData(body)
      .then(
        function (response) {
          console.log(
            'Reservation Closed Cancel:-- ',
            JSON.stringify(response),
          );
          this.setState({
            totalPrice: response.data[0].total_price,
            downPayment: response.data[0].down_payment,
            // arrivalTime: response.data[0].arrival_time,
            firstName: response.data[0].user.first_name,
            lastName: response.data[0].user.last_name,
            image: response.data[0].user.image,
            email: response.data[0].user.email,
            phoneNo: response.data[0].user.phone_no,
            special_request: response.data[0].special_request,
            loading: false,
            isVisible: true,
            refreshing: false,
          });
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
  renderItem() {
    return (
      <View
        style={{
          marginTop: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ showPopup: !this.state.showPopup });
          }}
          style={{
            backgroundColor: 'blue',
            width: '95%',
            height: 48,
            backgroundColor: 'white',
            borderWidth: 0.5,
            borderColor: '#999999',
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingHorizontal: 10,
          }}>
          <Text>{strings('reservation_calender_screen.closed_days')}</Text>
          <Image
            source={require('../../../assets/images/down.png')}
            resizeMode={'contain'}
            style={{
              position: 'absolute',
              bottom: 18,
              right: 15,
              tintColor: '#979191',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  date =(date) =>{
   let formatDate = date.split(" ")
   return formatDate[0];
  }

  render() {
    return (
      <LinearGradient
        colors={['#fbf4ed', '#fbf4ed']}
        style={{
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 5,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.fetchCancelReservation();
              }}
            />
          }>
          <View
            style={{
              marginTop: 50,
              width: '100%',
              flex: 1,
            }}>
            {this.renderItem()}
            {this.state.showPopup == true ? (
              <View
                style={{
                  width: '95%',
                  bottom: 5,
                  backgroundColor: 'white',
                  borderWidth: 0.5,
                  borderColor: '#999999',
                  paddingBottom: 10,
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  alignSelf: 'center',
                }}>
                {this.state.closed.length > 0 ? (
                  <FlatList
                    data={this.state.closed}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 3,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 13,
                                color: '#979191',
                                marginLeft: 10,
                                marginTop: 10,
                              }}>
                              {item.date}
                            </Text>
                            <Text
                              style={{
                                marginLeft: 10,
                                marginTop: 10,
                              }}>
                              {item.period == 0
                                ? ''
                                : item.period == 1
                                  ? strings('reservation_calender_screen.morning')
                                  : item.period == 2
                                    ? strings('reservation_calender_screen.evening')
                                    : item.period == 3
                                      ? strings(
                                        'reservation_calender_screen.both_morning_eve',
                                      )
                                      : null}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.removeClosedDays(item.id, index);
                            }}>
                            <Image
                              style={{
                                height: 20,
                                width: 20,
                                marginRight: 10,
                                marginTop: 10,
                              }}
                              source={require('../../../assets/images/red-cross.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 50,
                    }}>
                    <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16 }}>
                      {strings('reservation_calender_screen.no_date_closed')}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View></View>
            )}

            <View
              style={{
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ secondPopup: !this.state.secondPopup });
                  console.log('My Property Upcoming.......', this.state.upcoming)
                }}
                style={{
                  backgroundColor: 'blue',
                  width: '95%',
                  height: 48,
                  backgroundColor: 'white',
                  borderWidth: 0.5,
                  borderColor: '#999999',
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingHorizontal: 10,
                }}>
                <Text>
                  {strings('reservation_calender_screen.Upcoming_reservation')}
                </Text>
                <Image
                  source={require('../../../assets/images/down.png')}
                  resizeMode={'contain'}
                  style={{
                    position: 'absolute',
                    bottom: 18,
                    right: 15,
                    tintColor: '#979191',
                  }}
                />
              </TouchableOpacity>
            </View>


            {this.state.secondPopup == true ? (
              <View
                style={{
                  width: '95%',
                  bottom: 5,
                  backgroundColor: 'white',
                  borderWidth: 0.5,
                  paddingBottom: 10,
                  borderColor: '#999999',
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  alignSelf: 'center',
                }}>
                {this.state.upcoming.length > 0 ? (
                  console.log('yyyyyyyyyyyyyy', this.state.upcoming),
                  <FlatList
                    data={this.state.upcoming}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 3,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 13,
                                color: '#979191',
                                marginLeft: 10,
                                marginTop: 10,
                              }}>
                              
                              {this.date(item.booking_date_time)}
                            </Text>
                            <Text
                              style={{
                                marginLeft: 10,
                                marginTop: 10,
                              }}>
                              {item.shift == 0
                                ? ''
                                : item.shift == 1
                                  ? '( Morning )'
                                  : item.shift == 2
                                    ? '( Evening)'
                                    : item.shift == 3
                                      ? '( Morning + Evening)'
                                      : null}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.userProfile(item.booking_id);
                            }}>
                            <Text
                              style={{
                                marginRight: 10,
                                marginTop: 10,
                                color: '#B20C11',
                              }}>
                              {item.first_name + ' ' + item.last_name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 50,
                    }}>
                    <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16 }}>
                      {strings(
                        'reservation_calender_screen.no_upcming_booking',
                      )}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View></View>
            )}

            <View
              style={{
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ thirdPopup: !this.state.thirdPopup });
                }}
                style={{
                  backgroundColor: 'blue',
                  width: '95%',
                  height: 48,
                  backgroundColor: 'white',
                  borderWidth: 0.5,
                  borderColor: '#999999',
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingHorizontal: 10,
                }}>
                <Text>
                  {strings('reservation_calender_screen.previo_reser')}
                </Text>
                <Image
                  source={require('../../../assets/images/down.png')}
                  resizeMode={'contain'}
                  style={{
                    position: 'absolute',
                    bottom: 18,
                    right: 15,
                    tintColor: '#979191',
                  }}
                />
              </TouchableOpacity>
            </View>

            {this.state.thirdPopup == true ? (
              <View
                style={{
                  width: '95%',
                  bottom: 5,
                  backgroundColor: 'white',
                  borderWidth: 0.5,
                  paddingBottom: 10,
                  borderColor: '#999999',
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  alignSelf: 'center',
                }}>
                {this.state.past.length > 0 ? (
                  <FlatList
                    data={this.state.past}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 3,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 13,
                                color: '#979191',
                                marginLeft: 10,
                                marginTop: 10,
                              }}>
                              {item.date}
                            </Text>
                            <Text
                              style={{
                                marginLeft: 10,
                                marginTop: 10,
                              }}>
                              {item.shift == 0
                                ? ''
                                : item.shift == 1
                                  ? strings('reservation_calender_screen.morning')
                                  : item.shift == 2
                                    ? strings('reservation_calender_screen.evening')
                                    : item.shift == 3
                                      ? strings(
                                        'reservation_calender_screen.both_morning_eve',
                                      )
                                      : null}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.userProfile(item.booking_id);
                            }}>
                            <Text
                              style={{
                                marginRight: 10,
                                marginTop: 10,
                                color: '#B20C11',
                              }}>
                              {item.first_name + ' ' + item.last_name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 50,
                    }}>
                    <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16 }}>
                      {strings('reservation_calender_screen.no_prev_booking')}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View></View>
            )}
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isVisible}
            onRequestClose={() => {
              this.setState({ isVisible: false });
              // Alert.alert('Modal has been closed.');
            }}>
            <View
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#000000AA',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  paddingBottom: 15,
                  marginTop: 22,
                  margin: 40,
                  backgroundColor: 'white',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginTop: 18,
                  }}>
                  <Avatar.Image
                    style={{
                      marginLeft: 15,
                    }}
                    size={60}
                    source={
                      this.state.image
                        ? {
                          uri:
                            'https://doshag.net/admin/public' +
                            this.state.image,
                        }
                        : require('../../../assets/images/dp1.png')
                    }
                  />
                  <Text
                    style={{
                      marginLeft: 20,
                      marginTop: 25,
                    }}>
                    {this.state.firstName + ' ' + this.state.lastName}
                  </Text>
                  <TouchableOpacity
                    style={{
                      height: 25,
                      width: 25,
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      right: 15,
                    }}
                    onPress={() => this.setState({ isVisible: false })}>
                    <Image
                      style={{
                        height: 15,
                        width: 15,
                      }}
                      source={require('../../../assets/images/close.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderBottomColor: '#F2F0F1',
                    borderBottomWidth: 1,
                    marginTop: 20,
                    width: '90%',
                    alignSelf: 'center',
                  }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 20,
                    marginTop: 15,
                  }}>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/gmail.png')}
                  />
                  <Text
                    style={{
                      marginLeft: 20,
                    }}>
                    {this.state.email}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 20,
                    marginTop: 15,
                  }}>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                    }}
                    source={require('../../../assets/images/red-phone.png')}
                  />
                  <Text
                    style={{
                      marginLeft: 20,
                    }}>
                    {this.state.phoneNo}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 20,
                    marginTop: 25,
                  }}>
                  <Text
                    style={{
                      color: 'gray',
                    }}>
                    {strings('reservation_calender_screen.remaining_amount')}
                  </Text>
                  <Text
                    style={{
                      color: '#B20C11',
                      marginLeft: 10,
                    }}>
                    {parseInt(this.state.totalPrice) -
                      parseInt(this.state.downPayment)}
                  </Text>
                </View>

                {/* <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 20,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: 'gray',
                    }}>
                    {strings(
                      'reservation_calender_screen.estimated_arrival_time',
                    )}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 15,
                    }}>
                    {this.state.arrivalTime}
                  </Text>
                </View> */}
                {this.state.special_request != null && (
                  <View style={{ margin: 10, padding: 10 }}>
                    <Text style={{ color: 'gray' }}>
                      {strings('payment_screen.special_request')}
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                      {this.state.special_request}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ isVisible: false });
                  }}>
                  <Text
                    style={{
                      color: '#B20C11',
                      textAlign: 'right',
                      marginRight: 20,
                    }}>
                    { }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
        {this.state.loading && <Loader />}
      </LinearGradient>
    );
  }
}

const Tab = createMaterialTopTabNavigator();

export class index extends Component {
  lefAction() {
    this.props.navigation.goBack();
  }
  render() {
    const { params } = this.props.navigation.state;
    // console.log(params);
    return (
      <NavigationContainer>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={lang == 'en' ? 'My Property' : 'عقاري'}
          // leftMargin={-80}
          leftAction={this.lefAction.bind(this)}
          navigation={this.props.navigation}
        />
        <Tab.Navigator
          tabBarOptions={{
            indicatorStyle: { backgroundColor: 'white', height: 5 },
            labelStyle: { writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12, color: 'white' },
            // tabStyle: { width: 100 },
            style: { backgroundColor: '#B20C11' },
          }}>
          <Tab.Screen
            name={lang == 'en' ? 'Calender' : 'التقويم'}
            component={() => {
              return (
                <CalenderScreen
                  item={params}
                  navigation={this.props.navigation}
                />
              
              );
            }}
          />
          <Tab.Screen
            name={lang == 'en' ? 'Details' : 'تفاصيل'}
            component={() => {
              return (
                <DetailScreen
                  item={params}
                  navigation={this.props.navigation}
                />
              );
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default index;
