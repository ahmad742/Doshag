import React, { Component } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  Dimensions,
  FlatList,
  Share,
  TextInput,
  Linking,
  Modal,
  SafeAreaView
} from 'react-native';
import { Avatar } from 'react-native-paper';
import AppFonts from '../../../assets/fonts/index';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
import MapView, { Marker } from 'react-native-maps';
import Header from '../../../component/TopHeader/Header';
import moment from 'moment';
import { strings } from '../../../i18n';
import Preference from 'react-native-preference';
import { WebView } from 'react-native-webview';
import AppColor from '../../../component/AppColor';
//import sdkConfigurations from '../../../../sdkConfigurations';
import { ImagesBaseURL } from '../../../config/constants'
import RNGoSell from '@tap-payments/gosell-sdk-react-native'
const {
  Languages,
  PaymentTypes,
  AllowedCadTypes,
  TrxMode,
  SDKMode
} = RNGoSell.goSellSDKModels;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const _format = 'YYYY-MM-DD';
const _today = moment().format(_format);
const lang = Preference.get('language');
let dateChange = false;
const sorter = {
  // "sunday": 0, // << if sunday is first day of week
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const paymentReference = {
  track: 'track',
  payment: 'payment',
  gateway: 'gateway',
  acquirer: 'acquirer',
  transaction: 'trans_910101',
  order: 'order_262625',
  gosellID: null,
};

const appCredentials = {
  production_secrete_key: (Platform.OS == 'ios') ? 'sk_live_RkPt4dymGTWnL5x8ebYiOUZa' : 'sk_live_RkPt4dymGTWnL5x8ebYiOUZa',
  language: Languages.EN,
  sandbox_secrete_key: (Platform.OS == 'ios') ? 'sk_test_zISdBZ8jlkFpeqVHPKYMuvC0' : 'sk_test_zISdBZ8jlkFpeqVHPKYMuvC0',
  bundleID: (Platform.OS == 'ios') ? 'com.app.rn.doshag' : 'com.app.rn.doshag',
};

const shipping = [
  {
    name: 'shipping 1',
    description: 'shiping description 1',
    amount: 0.0,
  },
];
const customer = {
  isdNumber: '965',
  number: '00000000',
  customerId: '',
  first_name: 'test',
  middle_name: 'test',
  last_name: 'test',
  email: 'test@test.com',
};
const taxes = [
  {
    name: 'tax1',
    description: 'tax describtion',
    amount: { type: 'F', value: 0.0, maximum_fee: 0.0, minimum_fee: 0.0 },
  },
];

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Propertytype: props?.navigation?.getParam("Propertytype"),
      rotate: '0deg',
      rotate2: '0deg',
      show: false,
      date: new Date(),
      showPopup: false,
      isVisible: false,
      activeIndex: 0,
      activeSlide: 0,
      id: '',
      name_In_English: '',
      name_In_Arabic: '',
      description: '',
      city: '',
      reservations: 0,
      first: 0,
      second: 0,
      startTime: '',
      endTime: '',
      morningShiftStartTime: '',
      morningShiftEndTime: '',
      eve_start_time: '',
      eve_end_time: '',
      region: null,
      marginTop: 1,
      prices: [],
      listAmanties: [],
      reviews: [],
      location: '',
      zoomIn: false,
      reviewsView: false,
      astbeltProgress: '',
      status: 0,
      upcoming_dates: [],
      cancel_dates: [],
      selectedDates: [],
      discount: 0,
      showMorningShift: true,
      showEveningShift: true,
      disabledButton: false,
      booking_price: 0,
      multiDatePrice: 0,
      payment: 0,
      markedDates: {},
      _markedDates: this.initialState,
      fixedMarkedDates: this.initialState,
      _closedDates: this.initialState,
      totalLength: 0,
      promo_code: '',
      special_request: '',
      termsAndConditions: false,
      webViewDisplay: false,
      past_bookings: undefined,
      discountedAmount: 0,
      down_payment: 0,
      noOfFloor: '',
      noOfRooms: '',
      country: "",
      hotelRooms: [],
      longitude: '',
      latitude: '',
      rangeObject: {},
      newSelectedDates: [],
      modalVisible: false,
      name: '',
      isname: false,
      mobile_number: "",
      isMob_num: false,
      email: "",
      isEmail: false,

      textArray: [
        {
          image: require('../../../assets/images/summer-days.png'),
        },
        {
          image: require('../../../assets/images/furnished_appartment.png'),
        },
        {
          image: require('../../../assets/images/camps.png'),
        },
        {
          image: require('../../../assets/images/esteraha.png'),
        },
        {
          image: require('../../../assets/images/chalet.png'),
        },
      ],
      allConfigurations: undefined,
    };
  }

  componentDidMount() {
    const token = Preference.get('token')
    console.log('Token==>>', token)
    console.log('PropertyType ==>>', this.state.Propertytype)
    const { navigation } = this.props;
    // console.log("SelectedCurrency:: ", Preference.get('currency'))
    this.focusListener = navigation.addListener('willFocus', () => {
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
          dayNamesShort: [
            'الأحد',
            'الإثنين',
            'الثلاثاء',
            'الأربعاء',
            'الخميس',
            'الجمعة',
            'السبت',
          ],
        };
        LocaleConfig.defaultLocale = 'ar';
        dateChange = true;
      } else {
        this.rotation2();
      }
      this.get();
    });
  }
  rotation2 = () => {
    if (Preference.get('language') == 'en') {
      this.setState({ rotate2: '180deg' });
    } else {
      this.setState({ rotate2: '0deg' });
    }
  };
  fetchCancelReservation = () => {
    console.log("fetchCancelReservation------------------")
    this.setState({ loading: true });
    const { params } = this.props.navigation.state;
    const reservations = this.state.reservations;
    const second = this.state.second;
    let date = params.date ? params.date : null;
    const itemId = params ? params.itemId : null;
    let body = new FormData();
    body.append('property_id', itemId);
    console.log('BodyData', JSON.stringify(body));
    Api.fetchcancelReservation(body)
      .then(
        function (response) {
          console.log('Reservation Date:-- ', JSON.stringify(response.data.upcoming_bookings));
          this.setState(
            {
              closed: response.data.cancel_total,
              past: response.data.past_total,
              upcoming: response.data.upcoming_total,
              upcoming_dates: response.data.upcoming_bookings,
              cancel_dates: response.data.cancel_reservation,
              past_bookings: response.data.past_bookings
            },
            // console.log("upcoming===>>>",upcoming),
            () => {
              let markedDates = {};
              let closedDates = {};
              let dublicateCancel = [];
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
                  if (this.fomatDateTime(newList[i].booking_date_time) == this.fomatDateTime(item.booking_date_time)) {
                    dum.push(item);
                  }
                }
                if (dum.length > 1) {
                  double.push(item);
                } else if (dum.length > 0) {
                  single.push(item);
                }
                newList = newList.filter((item2) => this.fomatDateTime(item2.booking_date_time) != this.fomatDateTime(item.booking_date_time));
              });
              cancelTemp.map((item) => {
                if (item.date === date) {
                  date = null;
                }
              })

              // console.log('Double', double);
              // console.log('Single', single);
              // console.log('NewList', newList);

              for (let i = 0; i < double.length; i++) {
                markedDates[this.fomatDateTime(double[i].booking_date_time)] = {
                  disabled: true,
                  disableTouchEvent: true,
                };
              }

              for (let i = 0; i < single.length; i++) {
                if (single[i].shift == '0') {
                  markedDates[this.fomatDateTime(single[i].booking_date_time)] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                  closedDates[this.fomatDateTime(single[i].booking_date_time)] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                } else if (single[i].shift == '1') {
                  markedDates[this.fomatDateTime(single[i].booking_date_time)] = {
                    dots: [{ color: 'yellow' }],
                  };
                } else if (single[i].shift == '2') {
                  markedDates[this.fomatDateTime(single[i].booking_date_time)] = {
                    dots: [{ color: 'blue' }],
                  };
                } else if (single[i].shift == '3') {
                  markedDates[this.fomatDateTime(single[i].booking_date_time)] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                  closedDates[this.fomatDateTime(single[i].booking_date_time)] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                }
              }
              for (let i = 0; i < cancelTemp.length; i++) {
                if (cancelTemp[i].period == 3) {
                  markedDates[this.fomatDateTime(cancelTemp[i].date)] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                  closedDates[this.fomatDateTime(cancelTemp[i].date)] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                } else if (cancelTemp[i].period == 0) {
                  markedDates[this.fomatDateTime(cancelTemp[i].date)] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                  closedDates[this.fomatDateTime(cancelTemp[i].date)] = {
                    disabled: true,
                    disableTouchEvent: true,
                  };
                } else if (cancelTemp[i].period == 1) {
                  markedDates[this.fomatDateTime(cancelTemp[i].date)] = { dots: [{ color: 'green' }] };
                } else if (cancelTemp[i].period == 2) {
                  markedDates[this.fomatDateTime(cancelTemp[i].date)] = {
                    dots: [{ color: '#640141' }],
                  };
                }
              }

              console.log("MArkedDates:: ", JSON.stringify(markedDates))
              let pushDate = [];
              pushDate.push(date);

              // date != null && (markedDates[date] = {selected: true});
              // date != null && this.setState({selectedDates: pushDate});
              // date != null && this.calculatePriceByDayForOneDay(date);
              this.setState({
                _markedDates: markedDates,
                fixedMarkedDates: markedDates,
                totalLength: Object.keys(markedDates).length,
                _closedDates: closedDates,
                loading: false,
              });
            },
          );
          {
            date != null && (reservations == 1 && second == 1
              ? this.onDaySelect(date)
              : this.onDayPress(date))
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
  onApplyPromoPress = async () => {
    const formData = new FormData()
    formData.append('promo_code', this.state.promo_code)
    let percent = 0;
    try {
      const response = await Api.applyPromoCode(formData)
      console.log('onApplyPromoPress response=>', response, this.state.booking_price)
      if (response.status != '100') {
        if (response.data.percentage > 0) {
          let disPayment = Math.round((20 / 100) * parseInt(this.state.booking_price, 10));
          let discountedAmt = (disPayment * parseInt(response.data.percentage)) / 100;
          this.setState({ down_payment: disPayment - discountedAmt, discountedAmount: discountedAmt, promo_code_id: response.data.id })

        } else {
          Alert.alert('Success', response.message)
        }
      } else {
        Alert.alert('Alert...!', response.message)
      }

    } catch (error) {
      console.log('onApplyPromoPress Error=>', error)

    }
    // if(percent !== 0){
    // let discountedAmount = ((parseInt(this.state.down_payment)) * this.state.discount)/100
    // this.setState({down_payment:parseInt(this.state.down_payment)-discountedAmount})
    // }
  }


  fomatDateTime = (date) => {
    if (date) {
      let dateTime = date.split(" ");
      return dateTime[0]

    }
  }

  checkShifts = (date) => {
    let arrayUpcoming = this.state.upcoming_dates;
    let arrayClosed = this.state.cancel_dates;
    for (let i = 0; i < arrayUpcoming.length; i++) {
      let listedDate = arrayUpcoming[i].booking_date_time;
      let checkDate = listedDate.split(' ');
      console.log("Check_dates::-->", JSON.stringify(date) + "---" + JSON.stringify(checkDate[0]))
      if (date == checkDate[0]) {
        console.log("checkDate::-->", 'true')
        if (arrayUpcoming[i].shift === "0") {
          null;
        } else {
          if (arrayUpcoming[i].shift === '1') {
            console.log("showMorningShift::-->", 'false')
            this.setState({ showMorningShift: false });
          } else {
            if (arrayUpcoming[i].shift === '2') {
              console.log("showEveningShift::-->", 'false')
              this.setState({ showEveningShift: false });
            }
          }
        }
      } else {
        console.log("checkDate::-->", 'false')
      }
    }
    for (let i = 0; i < arrayClosed.length; i++) {
      console.log("Checking CloseDates: ", date + "= = =" + arrayClosed[i].date)
      if (date === arrayClosed[i].date) {
        if (arrayClosed[i].shift === 0 || arrayClosed[i].shift === 3) {
          null;
        } else {
          if (arrayClosed[i].shift === 1) {
            this.setState({ showMorningShift: false });
          } else {
            if (arrayClosed[i].shift === 2) {
              this.setState({ showEveningShift: false });
            }
          }
        }
      }
    }
  };
  calculatePriceByDay = (date) => {
    // console.log('DAtes',date)
    let loading = true;
    const specialOffer = this.state.astbeltProgress;
    let prices = this.state.prices;
    // console.log("PRices",prices)
    let selected_dates = this.state.selectedDates;
    // console.log("selected value", selected_dates)
    selected_dates.map((value, index) => {
      if (value == date) {
        loading = false;
        prices.map((value, index) => {
          if (moment(date).format('dddd') === value.day) {

            let price = this.state.multiDatePrice - parseInt(value.price);
            this.setState({ multiDatePrice: price });
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
      } else {
        console.log("ELSE PROPERTY")
      }
    });
    {
      loading &&
        prices.map((value, index) => {
          if (moment(date).format('dddd') === value.day) {
            let price = this.state.multiDatePrice + parseInt(value.price);
            this.setState({ multiDatePrice: price });
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

  checkDetail = async () => {
    console.log("CheckDetails")
    if (this.state.name == '') {
      this.setState({ isname: true })
      return
    } else {
      this.setState({ isname: false })
    }
    if (this.state.email == '') {
      this.setState({ isEmail: true })
      return
    } else {
      this.setState({ isEmail: false })
    }
    if (this.state.mobile_number == '') {
      this.setState({ isMob_num: true })
      return
    } else {
      this.setState({ isMob_num: false })
    }
    this.setState({ modalVisible: false }, () => {
      console.log("CheckDetailsmodalVisible: ", this.state.modalVisible)
      setTimeout(() => {
        console.log("DoPayment")
        this.doPayment()
      }, 2000);
    })

  }

  calculatePriceByDayForOneDay = (dateString) => {
    console.log('calculatePriceByDayForOneDay', dateString);
    const { params } = this.props.navigation.state;
    const specialOffer = this.state.astbeltProgress;
    let prices = this.state.prices;
    // //console.log('PricesOutPut: ' + JSON.stringify(prices));
    prices.map((value, index) => {
      // console.log(
      //   'DAys: ',
      //   /* date, */ JSON.stringify(
      //     moment(dateString).format('dddd'),
      //   ) +
      //     ' ----' +
      //     value.day,
      // );
      if (moment(dateString).format('dddd') === value.day) {
        // console.log(
        //   'Value----price',
        //   value.price,
        // );
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
    this.setState({ showMorningShift: true, showEveningShift: true });
    console.log("checking dates clicked.....", dateString)
    this.checkShifts(dateString);
    this.state.selectedDates.length = 0;
    //console.log('Latest Console for date', dateString);
    let markedDates = {};
    let selected_dates = this.state.selectedDates;
    let closedDates = this.state._closedDates;
    let finalSelectedDates = this.state.fixedMarkedDates;
    selected_dates.push(dateString);
    console.log("checking dates clicked.....", JSON.stringify(selected_dates))
    markedDates[dateString] = {
      selected: true,
      selected: true,
      startingDay: true,
      endingDay: true,
      color: '#B20C11',
      textColor: "white",
    };
    // this.setState({_markedDates: this.state.fixedMarkedDates});
    if (!!closedDates) {
      for (var key of Object.keys(closedDates)) {
        // console.log(key + '->' + closedDates[key]);
        if (key == dateString) {
          console.log('Yes!', key, dateString);
          // delete finalSelectedDates[dateString];
          updateCalender = false;
        }
      }
    }

    if (updateCalender) {
      this.calculatePriceByDayForOneDay(dateString);
      object = { ...finalSelectedDates, ...markedDates };
      this.setState({
        _markedDates: object,
        selectedDates: selected_dates,
      }, () => {
        console.log("SelectedDateforbooking: ", JSON.stringify(this.state.selectedDates))
      });
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
      //this.doBooking();
    }
  }


  handleResult = (error, status) => {
    console.log('------------', status)
    var myString = JSON.stringify(status);
    console.log('status is ' + status.sdk_result);
    // console.log(myString);
    var resultStr = String(status.sdk_result);
    if (resultStr === 'SUCCESS') {
      console.log("PayemntResponse: ", status.charge_id)
      console.log("PayemntResponse: ", status.sdk_result)
      if (Preference.get('userLogin')) {
        console.log('i am here')
        this.doBooking(status)
      } else {
        console.log("guest is here")
        this.doBookingGuest(status)
      }

    } else {

      Alert.alert("Rejected", "Your payment is failed please try again later.\n" + status.message)
    }
  }

  handleSDKResult(result) {
    console.log('trx_mode::::');
    console.log(result['trx_mode'])
    switch (result['trx_mode']) {
      case "CHARGE":
        console.log('Charge');
        console.log(result);
        this.printSDKResult(result);
        break;

      case "AUTHORIZE":
        console.log('AUTHORIZE');
        this.printSDKResult(result);
        break;

      case "SAVE_CARD":
        console.log('SAVE_CARD');
        this.printSDKResult(result);
        break;

      case "TOKENIZE":
        console.log('TOKENIZE');
        Object.keys(result).map((key) => {
          console.log(`TOKENIZE \t${key}:\t\t\t${result[key]}`);
        })

        // responseID = tapSDKResult['token'];
        break;
    }
  }

  printSDKResult(result) {
    if (!result) return
    Object.keys(result).map((key) => {
      console.log(`${result['trx_mode']}\t${key}:\t\t\t${result[key]}`);
    })
  }


  doPayment = () => {
    console.log("Starting Payment")
    this.setState({
      allConfigurations: {
        appCredentials: appCredentials,
        sessionParameters: {
          paymentStatementDescriptor: 'Property reservation',
          transactionCurrency: Preference.get('currency') == 'JOD' ? 'BHD' : Preference.get('currency'),
          isUserAllowedToSaveCard: true,
          paymentType: PaymentTypes.ALL,
          amount: Preference.get('currency') == 'JOD' ? (((20 / 100) * parseInt(this.state.booking_price, 10)) / 1.87).toString()
            : (Math.round((20 / 100) * parseInt(this.state.booking_price, 10)) - parseFloat(this.state.discountedAmount)).toString(),
          //shipping: shipping,
          allowedCadTypes: AllowedCadTypes.ALL,
          //paymentitems: paymentitems,
          //paymenMetaData: { a: 'a meta', b: 'b meta' },
          //applePayMerchantID: 'applePayMerchantID',
          authorizeAction: { timeInHours: 10, time: 10, type: 'CAPTURE' },
          cardHolderName: 'Card Holder NAME',
          editCardHolderName: true,
          postURL: '',
          paymentDescription: 'Property reservation down payment 20%',
          destinations: 'null',
          trxMode: TrxMode.PURCHASE,
          taxes: taxes,
          merchantID: '',
          SDKMode: SDKMode.Sandbox,
          //SDKMode: SDKMode.Production,
          customer: customer,
          isRequires3DSecure: true,
          receiptSettings: { id: null, email: false, sms: true },
          allowsToSaveSameCardMoreThanOnce: false,
          paymentReference: paymentReference,
        },
      }
    }, () => {
      RNGoSell.goSellSDK.startPayment(this.state.allConfigurations, 0, this.handleResult)
    })
    //RNGoSell.goSellSDK.startPayment(sdkConfigurations, this.handleResult)

  }


  doBooking = (paymentResponse) => {
    let daySelected = [...this.state.selectedDates]
    console.log("Selected Dates on calendar", daySelected)

    // return false;

    let shift = '';
    if (this.state.first == 1) {
      shift = '1';
    } else if (this.state.first == 2) {
      shift = '2';
    }
    let tempDateArray = [];
    if (this.state.reservations == 1 && this.state.first == 1) {
      daySelected.push(this.state.startTime, this.state.endTime);
      tempDateArray.push(daySelected);
    } else if (this.state.reservations == 2 && this.state.first == 1) {
      daySelected.push(
        this.state.morningShiftStartTime,
        this.state.morningShiftEndTime,
      );
      tempDateArray.push(daySelected);
    } else if (this.state.reservations == 2 && this.state.first == 2) {
      daySelected.push(this.state.eve_start_time, this.state.eve_end_time);
      tempDateArray.push(daySelected);
    } else if (this.state.reservations == 1 && this.state.second == 1) {
      daySelected.map((value, index) => {
        let days = [];
        //console.log('checkssssssssssss', daySelected[index]);
        days.push(daySelected[index]);
        // days.push('');
        // days.push('');
        tempDateArray.push(days);
      });
    }
    if (daySelected.length == 0) {
      alert(strings('payment_screen.select_a_date'));
    }
    //  else if (this.state.date == null) {
    //   alert(strings('payment_screen.asstimated_arrival_time'));
    // }
    // else if (this.state.payment == 0) {
    //   alert(strings('payment_screen.select_payment_method'));
    // } 
    else if (this.state.reservations == 2 && this.state.first == 0) {
      alert('Please select morning or evening period');
    } else if (this.state.termsAndConditions == false) {
      alert(strings('add_property_screen.terms&conditions'));
    } else {
      // this.setState({loader: true});
      console.log("Marked dates", this.state._markedDates)
      console.log("Selected Dates on calendar", this.state.selectedDates)

      // return false
      //this.setState({ loading: true });
      let body = {
        property_id: this.state.id,
        // days: daySelected.length,
        days: this.state.selectedDates.length,
        total_price: this.state.booking_price,
        //date_time: tempDateArray,
        down_payment: Math.round(
          (20 / 100) * parseInt(this.state.booking_price, 10),
        ),
        promo_code: this.state.promo_code === '' ? null : this.state.promo_code,
        promo_code_id: this.state.promo_code_id,
        // special_request:
        //   this.state.special_request === '' ? null : this.state.special_request,
        // arrival_time: moment(
        //   '1976-04-19T' + this.state.date.toLocaleTimeString(),
        // ).format('hh:mm a'),
        payment_method: 1,
        shift: this.state.reservations == 1 ? '0' : shift,
        //booking_date_time: daySelected.slice(0,1),
        booking_date_time: this.state.selectedDates,
        // + moment(this.state.date).format('HH:mm')
        date: daySelected[0] + ' ' + moment(this.state.date).format('HH:mm'),
        check_in:
          this.state.reservations == 1
            ? this.state.second == 1
              ? moment('1976-04-19T' + this.state.date.toLocaleTimeString()).format('hh:mm a')
              : this.state.morningShiftStartTime
            : this.state.first == 2
              ? this.state.eve_start_time
              : this.state.morningShiftStartTime,
        check_out:
          this.state.reservations == 1
            ? this.state.second == 1
              ? null
              : this.state.morningShiftEndTime
            : this.state.first == 2
              ? this.state.eve_end_time
              : this.state.morningShiftEndTime,
        customer_id: Preference.get('userId'),
        charge_id: paymentResponse.charge_id,
        payment_status: paymentResponse.sdk_result,
        start_time: ["8:00 pm", "8:00 am"],
        end_time: ["7:00 pm", "9:00 pm"],
      };
      console.log('SendingData:----', JSON.stringify(body));


      Api.book_property(body)
        .then(function (response) {
          console.log('body===>>>', body);
          console.log('APiDate:----', JSON.stringify(response));
          if (response.status != 200) {
            this.setState({ loading: false });
            Alert.alert(
              strings('activities_screen.alert'),
              lang == 'en' ? response.message : response.message_arabic,
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
            this.setState({ loading: false });
            this.props.navigation.goBack();
            //this.props.navigation.navigate('DebitCard');
          }
        }.bind(this),
        )
        .catch(
          function (error) {
            console.log('BookingError : ', JSON.stringify(error));
            this.setState({ loading: false });
            Alert.alert('Error', 'Check your internet!', [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          }.bind(this),
        );
    }
  };
  doBookingGuest = (paymentResponse) => {
    let daySelected = [...this.state.selectedDates]
    console.log("Selected Dates on calendar", daySelected)

    // return false;

    let shift = '';
    if (this.state.first == 1) {
      shift = '1';
    } else if (this.state.first == 2) {
      shift = '2';
    }
    let tempDateArray = [];
    if (this.state.reservations == 1 && this.state.first == 1) {
      daySelected.push(this.state.startTime, this.state.endTime);
      tempDateArray.push(daySelected);
    } else if (this.state.reservations == 2 && this.state.first == 1) {
      daySelected.push(
        this.state.morningShiftStartTime,
        this.state.morningShiftEndTime,
      );
      tempDateArray.push(daySelected);
    } else if (this.state.reservations == 2 && this.state.first == 2) {
      daySelected.push(this.state.eve_start_time, this.state.eve_end_time);
      tempDateArray.push(daySelected);
    } else if (this.state.reservations == 1 && this.state.second == 1) {
      daySelected.map((value, index) => {
        let days = [];
        //console.log('checkssssssssssss', daySelected[index]);
        days.push(daySelected[index]);
        // days.push('');
        // days.push('');
        tempDateArray.push(days);
      });
    }
    if (daySelected.length == 0) {
      alert(strings('payment_screen.select_a_date'));
    }
    //  else if (this.state.date == null) {
    //   alert(strings('payment_screen.asstimated_arrival_time'));
    // }
    // else if (this.state.payment == 0) {
    //   alert(strings('payment_screen.select_payment_method'));
    // } 
    else if (this.state.reservations == 2 && this.state.first == 0) {
      alert('Please select morning or evening period');
    } else if (this.state.termsAndConditions == false) {
      alert(strings('add_property_screen.terms&conditions'));
    } else {
      // this.setState({loader: true});
      console.log("Marked dates", this.state._markedDates)
      console.log("Selected Dates on calendar", this.state.selectedDates)

      // return false
      //this.setState({ loading: true });
      let body = {
        first_name: this.state.name,
        last_name: this.state.name,
        email: this.state.email,
        phone_no: this.state.mobile_number,
        property_id: this.state.id,
        days: this.state.selectedDates.length,
        total_price: this.state.booking_price,
        down_payment: Math.round(
          (20 / 100) * parseInt(this.state.booking_price, 10),
        ),
        promo_code: this.state.promo_code === '' ? null : this.state.promo_code,
        promo_code_id: this.state.promo_code_id,
        payment_method: 1,
        shift: this.state.reservations == 1 ? '0' : shift,
        booking_date_time: this.state.selectedDates,
        date: daySelected[0] + ' ' + moment(this.state.date).format('HH:mm'),
        check_in:
          this.state.reservations == 1
            ? this.state.second == 1
              ? moment('1976-04-19T' + this.state.date.toLocaleTimeString()).format('hh:mm a')
              : this.state.morningShiftStartTime
            : this.state.first == 2
              ? this.state.eve_start_time
              : this.state.morningShiftStartTime,
        check_out:
          this.state.reservations == 1
            ? this.state.second == 1
              ? null
              : this.state.morningShiftEndTime
            : this.state.first == 2
              ? this.state.eve_end_time
              : this.state.morningShiftEndTime,
        customer_id: Preference.get('userId'),
        charge_id: paymentResponse.charge_id,
        payment_status: paymentResponse.sdk_result,
        start_time: ["8:00 pm", "8:00 am"],
        end_time: ["7:00 pm", "9:00 pm"],
        // days: daySelected.length,

        //date_time: tempDateArray,

        // special_request:
        //   this.state.special_request === '' ? null : this.state.special_request,
        // arrival_time: moment(
        //   '1976-04-19T' + this.state.date.toLocaleTimeString(),
        // ).format('hh:mm a'),

        //booking_date_time: daySelected.slice(0,1),

        // + moment(this.state.date).format('HH:mm')

      };
      console.log('SendingData:----', JSON.stringify(body));


      Api.book_property_guest(body)
        .then(function (response) {
          console.log('body===>>>', body);
          console.log('APiDate:----', JSON.stringify(response));
          if (response.status != 200) {
            this.setState({ loading: false });
            Alert.alert(
              strings('activities_screen.alert'),
              lang == 'en' ? response.message : response.message_arabic,
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
            this.setState({ loading: false });
            this.props.navigation.goBack();
            //this.props.navigation.navigate('DebitCard');
          }
        }.bind(this),
        )
        .catch(
          function (error) {
            console.log('BookingError : ', JSON.stringify(error));
            this.setState({ loading: false });
            Alert.alert('Error', 'Check your internet!', [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          }.bind(this),
        );
    }
  };

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

  lefAction() {
    this.props.navigation.goBack();
  }

  location() {
    this.setState({ loading: true });
    Geolocation.getCurrentPosition(
      (position) => {
        // //console.log('-------------', 'mee aa gyasaaa');
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };

        // console.log(region);
        this.setState({
          region: region,
          loading: false,
          error: null,
        });
      },
      (error) => {
        alert(error.message);
        this.setState({
          error: error.message,
          loading: false,
        });
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 },
    );
  }
  CheckLowestPrice = (ara) => {
    console.log(ara)
  }
  get() {
    this.setState({ loading: true });
    const { params } = this.props.navigation.state;
    const itemId = params ? params.itemId : null;
    const userId = Preference.get('userId');
    let body = new FormData();
    body.append('property_id', itemId);
    userId && body.append('user_id', userId);
    //console.log('BodyData', body);
    Api.propertyDetailById(body)
      .then(
        function (response) {
          // console.log('Property Details By ID:-- ', JSON.stringify(response));
          this.setState({ loading: false });
          let mainResponse = response.data[0];
          // console.log('Property Details By ID:-- ',mainResponse );
          let reviewsArray = mainResponse.reviews;
          // console.log('*********************', mainResponse.reviews)
          let updatedReviewsArray = [];
          reviewsArray.forEach((element) => {
            // if (element.r_status === 1) {
            updatedReviewsArray.push(element);
            // }
          });
          let listAmantiesTemp = response.Eminities[0].property_amenities;
          listAmantiesTemp = listAmantiesTemp.filter(
            (item) => item.quantity > -1,
          );
          const region = {
            latitude: parseFloat(mainResponse.latitude),
            longitude: parseFloat(mainResponse.longitude),
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          };
          // console.log('location:--------------', region);
          let tempArray = [],
            array = response.data[0].property_files;
          for (let i = 0; i < array.length; i++) {
            tempArray.push({
              uri:
                'https://doshag.net/admin_clone/doshag_new/public/images/property_images/' +
                array[i].file_name,
            });
          }
          this.setState({
            id: mainResponse.id,
            name_In_English:
              lang == 'en' ? mainResponse.eng_name : '',
            name_In_Arabic:
              lang == 'ar' ? mainResponse.arabic_name : '',
            location: mainResponse.location,
            //     name_In_Arabic: mainResponse.arabic_name,
            //     countries: mainResponse.country,
            city: mainResponse.city,
            //     property_Type: mainResponse.type,
            description: mainResponse.description,
            astbeltProgress: mainResponse.special_offer,
            reservations: mainResponse.reservation,
            first: mainResponse.specific_time,
            second: mainResponse.full_day,
            startTime: mainResponse.start_time,
            endTime: mainResponse.end_time,
            morningShiftStartTime: mainResponse.start_time,
            morningShiftEndTime: mainResponse.end_time,
            eve_start_time: mainResponse.eve_start_time,
            eve_end_time: mainResponse.eve_end_time,
            listAmanties: listAmantiesTemp,
            reviews: updatedReviewsArray,
            prices: mainResponse.property_prices,
            region: region,
            longitude: mainResponse.longitude,
            latitude: mainResponse.latitude,
            textArray: tempArray,
            status: mainResponse.likes,
            noOfFloor: mainResponse.no_of_floors,
            noOfRooms: mainResponse.no_of_apartments,
            country: mainResponse.country,
            hotelRooms: mainResponse.rooms
          });
          this.state.prices.sort(function sortByDay(a, b) {
            let day1 = a.day.toLowerCase();
            let day2 = b.day.toLowerCase();
            return sorter[day1] - sorter[day2];
          });
          // if (Preference.get('userLogin'))
          this.fetchCancelReservation();
          // console.log(this.state.prices);
          // //console.log('amaneties list ------>', this.state.listAmanties);
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
  }
  loginCheck() {
    if (Preference.get('userLogin')) {
      this.like();
    } else {
      // this.props.navigation.navigate('WelcomeScreen')
      Alert.alert(
        strings('activities_screen.alert'),
        strings('categoryall_screen.login_first'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
      this.setState({ status: 0 });
    }
  }
  onDaySelect = (day) => {
    let closedDates = this.state.past_bookings;
    let dateContain = false;
    closedDates.find((v, index) => {
      console.log("Selected date: ", day + "--" + moment(v.booking_date_time).format('YYYY-MM-DD'))
      if (moment(v.booking_date_time).format('YYYY-MM-DD') == day) {
        dateContain = true;
      }
    })

    if (!dateContain) {
      this.calculatePriceByDay(day);
      let loading = true;
      const _selectedDay = moment(day).format(_format);
      let selected_dates = this.state.selectedDates;

      selected_dates.find((v, index) => {
        if (v == day) {
          selected_dates.splice(index, 1);
          loading = false;
        }
      });
      loading && selected_dates.push(day);

      let selected = true;
      if (this.state._markedDates[_selectedDay]) {
        selected = !this.state._markedDates[_selectedDay].selected;
      }
      const updatedMarkedDates = {
        ...this.state._markedDates,
        ...{ [_selectedDay]: { selected } },
      };

      this.setState({
        _markedDates: updatedMarkedDates,
        selectedDates: selected_dates,
      });
    } else {
      alert('This property is already booked on this date')
    }



  };
  //


  //
  like() {
    // this.setState({loading: true});
    const { params } = this.props.navigation.state;
    const itemId = params ? params.itemId : null;
    let body = new FormData();
    body.append('property_id', itemId);
    body.append('status', this.state.status == 1 ? 0 : 1);
    //console.log('BodyData', body);
    Api.likeDetail(body)
      .then(function (response) { }.bind(this))
      .catch((error) => {
        Alert.alert('Error', 'Check your internet!', [
          {
            text: strings('add_property_screen.ok'),
          },
        ]);
        this.setState({ status: this.state.status == 0 ? 1 : 0 });
      });
  }

  onMapReady = () => {
    this.setState({ isMapReady: true, marginTop: 0 });
  };



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
            width: '100%',
            height: 48,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              // left: 15,
              writingDirection: lang == 'en' ? 'ltr' : 'rtl',
            }}>
            {strings('property_detail_screen.details')}
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
    );
  }
  emptyRoomsComponent() {
    return (
      <View style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
      }}>
        <Text style={{
          fontSize: 16,
          color: 'black',
          fontWeight: '700'
        }}>
          {'No rooms added against this hotel!'}
        </Text>
      </View>
    )
  }


  hotelRoomsrenderItem(item, index) {
    let currency = Preference.get('country') === 'Saudi Arabia' ? 'SAR ' : Preference.get('country') === 'Bahrain' ? 'BHD ' : 'JOD '
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('RoomDetails', {
              roomdet: item,
              imageIndex: index
            })
          }}
        >
          <View
            style={{
              marginTop: 15,
              margin: 5,
            }}>
            <View
              style={{
                borderRadius: 15,
                borderWidth: 3,
                borderColor: AppColor.graylightBorder,
                backgroundColor: 'white',
              }}>
              <Image
                style={{
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  borderWidth: 3,
                  width: '100%',
                  height: 120,
                }}
                // source={require('../../../assets/images/img.png')}
                source={{ uri: "https://doshag.net/admin_clone/doshag_new/public/images/property_images/" + item?.room_images[0]?.image }}
              />
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                  paddingHorizontal: 10,
                  height: 50

                }}>
                <View style={{
                  alignItems: 'flex-start',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 12,
                  width: '50%',
                  marginLeft: 10
                }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'grey',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      fontSize: 14,
                      // marginStart: 5,
                    }}>
                    {
                      lang == 'en' ?
                        strings("property_detail_screen.room_type") + " : " + item?.bed_type :
                        lang == 'ar' ?
                          strings("property_detail_screen.room_type") + " : " + item?.bed_type_arabic: ' '
                    }

                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'grey',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      fontSize: 14,
                      // marginStart: 5,
                    }}>
                    {
                      lang == 'en' ?
                        strings("property_detail_screen.room_avail") + " : " + item?.room_no :
                        lang == 'ar' ?
                          strings("property_detail_screen.room_avail") + " : " + item?.room_no : null
                    }
                    {/* {"Available : " + item.room_no} */}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'flex-end',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 12,
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: AppColor.yellowColor,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      fontSize: 18,
                      marginStart: 5,
                    }}>

                    {
                      lang == 'en' ?
                        strings("property_detail_screen.start_from") :
                        lang == 'ar' ?
                          strings("property_detail_screen.start_from") : null
                    }


                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: AppColor.yellowColor,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      fontSize: 18,
                      marginStart: 5,
                    }}>

                    {item.prices.length > 0 && currency + item?.prices[0].price}

                    {/* {currency}{  item?.prices[0]?.price==undefined?50:item.prices[0]?.price} */}
                  </Text>

                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
  _renderItem = ({ item, index }) => {


    return (
      <View
        style={{
          width: '100%',
          height: 200,
          backgroundColor: 'grey',
        }}>
        <Image
          style={{
            width: '100%',
            height: 200,
            resizeMode: 'cover',
          }}
          source={{ uri: item.uri }}
        />
        <TouchableOpacity
          onPress={() => {
            // //console.log('Hi?')
            this.setState({ zoomIn: true });
          }}
          style={{
            position: 'absolute',
            width: 30,
            height: 30,
            top: 10,
            right: 10,
          }}>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
            }}
            source={require('../../../assets/images/zoomin.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };
  _renderItem2 = ({ item, index }) => {
    return (
      <View
        style={{
          width: windowWidth,
          height: windowHeight,
          backgroundColor: '#00000090',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
          source={{ uri: item.uri }}
        />
        <TouchableOpacity
          onPress={() => {
            this.setState({ zoomIn: false });
          }}
          style={{
            position: 'absolute',
            width: 30,
            height: 30,
            top: 40,
            left: 20,
          }}>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
            }}
            source={require('../../../assets/images/close.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };
  get pagination() {
    const { textArray, activeSlide } = this.state;
    return (
      <Pagination
        tappableDots={true}
        dotsLength={this.state.textArray.length}
        activeDotIndex={this.state.activeSlide}
        containerStyle={{
          position: 'absolute',
          bottom: -10,
          alignSelf: 'center',
        }}
        dotStyle={{
          width: 5,
          height: 5,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'white',
        }}
        inactiveDotStyle={{}}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        message: 'https://app.wewa.life/PropertyDetailScreen/' + this.state.id,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  render() {
    const { modalVisible } = this.state;
    const { show, date } = this.state;
    const reservations = this.state.reservations;
    const second = this.state.second;
    const first = this.state.first;
    const morningShiftStartTime = this.state.morningShiftStartTime;
    const morningShiftEndTime = this.state.morningShiftEndTime;
    let PricesDetails = this.state.prices;
    const startTime = this.state.startTime;
    const endTime = this.state.endTime;
    const eve_start_time = this.state.eve_start_time;
    const eve_end_time = this.state.eve_end_time;
    let rotateBack2 = this.state.rotate2;
    let variable = '';
    for (let i = 0; i < PricesDetails.length; i++) {
      variable = PricesDetails[i].price;
    }
    let rotateBack = this.state.rotate;
    return (
      // console.log("currency", Preference.get('country')),
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            this.setState({ modalVisible: !modalVisible });
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 22,
                    fontFamily: AppFonts.PoppinsMedium,
                  }}>
                  {
                    lang == "en" ? strings('register_screen.enter_detail')
                      : strings('register_screen.enter_detail')}
                  {/* {'Enter Detail'} */}
                </Text>
                <TouchableOpacity onPress={() => this.setState({ modalVisible: false })} style={{ backgroundColor: "#B20C11", alignSelf: "center", borderRadius: 12, padding: 5 }}>
                  <Image source={require('../../../assets/images/close.png')}
                    style={{ width: 16, height: 16, justifyContent: 'center', alignItems: "center", tintColor: 'white' }} />
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
                  onChangeText={(text) => this.setState({ name: text })}
                  textContentType="givenName"
                  style={{
                    height: 50,
                    marginLeft: 10,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
              </View>
              <Text
                style={{
                  // marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'red',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {this.state.isname == true ? "name is required" : null}
              </Text>

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
                  onChangeText={(text) => this.setState({ email: text })}
                  textContentType="emailAddress"
                  style={{
                    height: 50,
                    marginLeft: 10,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
              </View>
              <Text
                style={{
                  // marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'red',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {this.state.isEmail == true ? "email is required" : null}
              </Text>
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
                  justifyContent: 'center',
                  borderColor: '#999999',
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <TextInput
                  onChangeText={(text) => this.setState({ mobile_number: text })}
                  textContentType='telephoneNumber'
                  style={{
                    height: 50,
                    marginLeft: 10,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
              </View>
              <Text
                style={{
                  // marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  color: 'red',
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {this.state.isMob_num == true ? "Phone Number is required" : null}
              </Text>

              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={async () => {
                  await this.checkDetail()
                  // this.setState({modalVisible: !modalVisible})
                }}>
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>


        </Modal>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={lang == 'en' ? this.state.name_In_English :
            lang == 'ar' ? this.state.name_In_Arabic : ''}
          leftAction={this.lefAction.bind(this)}
          // titleview={{flex: null, width: '70%', paddingLeft: '20%'}}
          textStyle={{ textTransform: 'capitalize' }}
          numberOfLines={1}
          navigation={this.props.navigation}
        />
        <View
          style={{
            width: '100%',
          }}>
          <Carousel
            layout={'default'}
            ref={(ref) => (this.carousel = ref)}
            data={this.state.textArray}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            itemHeight={300}
            scrollEnabled={true}
            renderItem={this._renderItem}
            onSnapToItem={(index) => this.setState({ activeSlide: index })}
          />
          {this.pagination}
        </View>
        <LinearGradient
          colors={['#fbf4ed', '#fbf4ed']}
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 5,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 18,
                  color: '#B20C11',
                  fontWeight: 'bold',
                  maxWidth: '80%',
                  textTransform: 'capitalize',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
               {lang == 'en' ? this.state.name_In_English :
            lang == 'ar' ? this.state.name_In_Arabic : ""}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 3,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ status: this.state.status == 0 ? 1 : 0 });
                    this.loginCheck();
                  }}>
                  <Image
                    style={{
                      marginRight: 10,
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                    }}
                    source={
                      this.state.status == 1
                        ? require('../../../assets/images/heart.png')
                        : require('../../../assets/images/blank-heart.png')
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onShare()}>
                  <Image
                    style={{
                      marginRight: 20,
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/share.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {this.state.second == 0 ? (
              <View
                style={{
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  {this.state.reservations == 1
                    ? this.state.first == 1
                      ? strings('property_detail_screen.one_day')
                      : strings('property_detail_screen.multi_day')
                    : strings('property_detail_screen.two_resrvation')}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}>
                  {strings('property_detail_screen.morning_shift')}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    color: 'gray',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}>
                  {this.state.reservations == 1
                    ? this.state.startTime + '-' + this.state.endTime
                    : this.state.morningShiftStartTime +
                    '-' +
                    this.state.morningShiftEndTime}
                </Text>
                {this.state.reservations == 2 && (
                  <View>
                    <Text
                      style={{
                        marginTop: 10,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      }}>
                      {strings('property_detail_screen.evening_shift')}
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        color: 'gray',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      }}>
                      {this.state.eve_start_time +
                        '-' +
                        this.state.eve_end_time}
                    </Text>
                  </View>
                )}
              </View>
            ) : null}
            <View>
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>
                {strings('property_detail_screen.description')}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {this.state.description}
              </Text>
            </View>
            {this.state.listAmanties.length > 0 ? (
              <Text
                style={{
                  marginTop: 20,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>
                {strings('property_detail_screen.amanaties')}
              </Text>
            )
              : null
            }

            <View style={{ marginTop: 20, width: '100%' }}>
              <FlatList
                data={this.state.listAmanties}
                contentContainerStyle={{ width: '100%' }}
                style={{ width: '100%' }}
                numColumns={3}
                renderItem={({ item }) => {
                  let imageBaseUrl =
                    'https://doshag.net/admin/public' + item.aminity.icon;
                  return (
                    <View
                      style={{
                        alignItems: 'center',
                        width: '33%',
                        paddingVertical: 10,
                      }}>
                      <Image
                        style={{ width: 25, height: 25, resizeMode: 'contain' }}
                        source={{ uri: imageBaseUrl }}
                      />
                      <Text
                        style={{
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                          fontSize: 12,
                          textAlign: 'center',
                          paddingTop: 5,
                        }}>
                        {item.quantity > 1 && (
                          <Text
                            style={{
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                              fontSize: 12,
                              textAlign: 'center',
                              paddingTop: 5,
                            }}>
                            {item.quantity} {'✕'} {'\n'}
                          </Text>
                        )}{' '}
                        {lang == 'en'
                          ? item.aminity.eng_name
                          : item.aminity.arabic_name}
                      </Text>
                    </View>
                  );
                  // }
                }}
              />
            </View>
            {
              this.state.Propertytype == 'Hotels' ?
                <>
                  {
                    (this.state.longitude && this.state.latitude) ?
                      <View style={{ flex: 1 }}>
                        <View
                          style={{

                            position: 'absolute',
                            zIndex: 1,
                            top: 120,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              const location = `${this.state.region.latitude},${this.state.region.longitude}`;
                              Linking.openURL(
                                Platform.OS === 'ios'
                                  ? 'googleMaps://app?daddr=' +
                                  this.state.region.latitude +
                                  '+' +
                                  this.state.region.longitude
                                  : 'google.navigation:q=' +
                                  this.state.region.latitude +
                                  '+' +
                                  this.state.region.longitude,
                              );
                            }}
                            style={{
                              backgroundColor: '#B20C11',
                              height: 40,
                              width: '40%',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              borderRadius: 10,
                            }}>
                            <Text
                              style={{
                                color: 'white',
                                textAlign: 'center',
                                writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                              }}>
                              {strings('property_detail_screen.view_on_map')}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <MapView
                          style={[
                            { ...styles.v, marginTop: this.state.marginTop },
                            {
                              height: 200,
                              width: '100%',
                              marginTop: 10,
                            },
                          ]}
                          initialRegion={this.state.region}
                          showsUserLocation={true}
                          onMapReady={this.onMapReady}>

                          <Marker
                            draggable
                            coordinate={this.state.region}
                            title={'Location'}>

                            <Image source={require('../../../assets/images/location.png')} style={{ height: 25, width: 25 }} resizeMode='contain' />
                          </Marker>

                        </MapView>
                      </View>
                      : null



                  }

                  <Text
                    style={{
                      marginTop: 20,
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      fontSize: 15,
                      fontWeight: 'bold',
                      // marginLeft: 15,
                    }}>
                    {strings('property_detail_screen.location')}
                  </Text>
                  <Text
                    style={{
                      marginTop: 20,
                      // marginLeft: 15,
                      color: 'gray',
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    }}>
                    {this.state.country}
                  </Text>

                </>
                :
                null
            }
            <View
              style={{
                // marginLeft: 15,
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 15,
                  fontWeight: 'bold',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {strings('property_detail_screen.city')}
              </Text>
              <Text
                style={{
                  marginRight: 10,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {this.state.city}
              </Text>
            </View>

            <View
              style={{
                marginTop: 20,
                borderBottomColor: '#F2F0F1',
                borderBottomWidth: 2,
              }}
            />

            {
              this.state.Propertytype != 'Hotels' ?
                <>
                  {
                    (this.state.longitude && this.state.latitude) ?
                      <View style={{ flex: 1 }}>
                        <View
                          style={{

                            position: 'absolute',
                            zIndex: 1,
                            top: 120,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              const location = `${this.state.region.latitude},${this.state.region.longitude}`;
                              Linking.openURL(
                                Platform.OS === 'ios'
                                  ? 'googleMaps://app?daddr=' +
                                  this.state.region.latitude +
                                  '+' +
                                  this.state.region.longitude
                                  : 'google.navigation:q=' +
                                  this.state.region.latitude +
                                  '+' +
                                  this.state.region.longitude,
                              );
                            }}
                            style={{
                              backgroundColor: '#B20C11',
                              height: 40,
                              width: '40%',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              borderRadius: 10,
                            }}>
                            <Text
                              style={{
                                color: 'white',
                                textAlign: 'center',
                                writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                              }}>
                              {strings('property_detail_screen.view_on_map')}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <MapView
                          style={[
                            { ...styles.v, marginTop: this.state.marginTop },
                            {
                              height: 200,
                              width: '100%',
                              marginTop: 10,
                            },
                          ]}
                          initialRegion={this.state.region}
                          showsUserLocation={true}
                          onMapReady={this.onMapReady}>

                          <Marker
                            draggable
                            coordinate={this.state.region}
                            title={'Location'}>

                            <Image source={require('../../../assets/images/location.png')} style={{ height: 25, width: 25 }} resizeMode='contain' />
                          </Marker>

                        </MapView>
                      </View>
                      : null

                  }
                  {this.state.reviews.length == 0 ? (
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        style={{
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                          fontSize: 20,
                          fontWeight: 'bold',
                          marginVertical: 20,
                        }}>
                        {strings('property_detail_screen.no_reviews_yet')}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          marginLeft: 15,
                          marginTop: 20,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}>
                          {strings('property_detail_screen.customer_reviews')}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({ reviewsView: !this.state.reviewsView })
                          }
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              marginRight: 5,
                              color: 'gray',
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                            }}>
                            {this.state.reviewsView
                              ? strings('property_detail_screen.less')
                              : strings('property_detail_screen.view_all')}
                          </Text>
                          <Image
                            style={{
                              // marginTop: 5,
                              transform: [{ rotate: rotateBack }],
                              width: 15,
                              height: 15,
                              resizeMode: 'contain',
                            }}
                            source={require('../../../assets/images/forward.png')}
                          />
                        </TouchableOpacity>
                      </View>
                      <FlatList
                        data={
                          this.state.reviewsView == true
                            ? this.state.reviews
                            : this.state.reviews.slice(this.state.reviews, 2)
                        }
                        renderItem={({ item }) => {
                          if (this.state.reviews) {
                            let imageCheck = item.users.image;
                            let imageBaseUrl =
                              'https://doshag.net/admin/public' +
                              imageCheck;
                            return (
                              <View
                                style={{
                                  marginLeft: 15,
                                  marginTop: 35,
                                }}>
                                <Avatar.Image
                                  size={50}
                                  source={
                                    imageCheck
                                      ? { uri: imageBaseUrl }
                                      : require('../../../assets/images/dp1.png')
                                  }
                                />
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    position: 'absolute',
                                    left: 60,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                                      fontSize: 16,
                                      textTransform: 'capitalize',
                                      textAlign: 'center',
                                    }}>
                                    {item.users.first_name +
                                      ' ' +
                                      item.users.last_name}
                                  </Text>
                                  <Image
                                    style={{ marginLeft: 10, width: 25, height: 15 }}
                                    source={
                                      item.users.country == 'Jordan'
                                        ? require('../../../assets/images/Flag_of_Jordan.png')
                                        : item.users.country == 'Saudi Arabia'
                                          ? require('../../../assets/images/Flag_of_Saudi_Arabia.png')
                                          : require('../../../assets/images/Flag_of_Bahrain.png')
                                    }
                                  />
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    position: 'absolute',
                                    left: 58,
                                    top: 20,
                                    // marginTop: 5,
                                    alignItems: 'center',
                                  }}>
                                  <AirbnbRating
                                    count={5}
                                    defaultRating={item.rating}
                                    ratingBackgroundColor={'red'}
                                    showRating={false}
                                    type="custom"
                                    reviewSize={0}
                                    size={15}
                                    style={{ paddingVertical: 10 }}
                                  />

                                  <Text
                                    style={{
                                      color: 'gray',
                                      // marginTop: 7,
                                      marginLeft: 10,
                                      writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                                    }}>
                                    {moment(item.created_at).format('MM/DD/YYYY')}
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    left: 63,
                                    marginTop: 0,
                                    width: '70%',
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                                  }}>
                                  {item.review}
                                </Text>
                              </View>
                            );
                          } else {
                            null;
                          }
                        }}
                      />
                    </View>
                  )}
                  {this.renderItem()}
                  {this.state.showPopup == true ? (
                    <View style={{ flex: 1, marginHorizontal: 20 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            width: '30%',
                            color: 'gray',
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                          }}>
                          {strings('property_detail_screen.days')}
                        </Text>
                        <Text
                          style={{
                            width: '30%',
                            color: 'gray',
                            textAlign: 'center',
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                          }}>
                          {strings('property_detail_screen.price')}
                        </Text>
                        <Text
                          style={{
                            width: '30%',
                            color: 'gray',
                            textAlign: 'center',
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                          }}>
                          {strings('property_detail_screen.down_payment')}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            width: '30%',
                            color: 'gray',
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                          }}></Text>
                        <Text
                          style={{
                            width: '30%',
                            color: 'gray',
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                          }}></Text>
                        <Text
                          style={{
                            width: '30%',
                            color: '#B20C11',
                            textAlign: 'center',
                            writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                          }}>
                          20%
                        </Text>
                      </View>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.prices}
                        renderItem={({ item }) => {
                          if (item.price == null || item.price == '') {
                            null;
                          } else {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginTop: 5,
                                }}>
                                <Text
                                  style={{
                                    width: '30%',
                                    color: '#B20C11',
                                    marginTop: 5,
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                                  }}>
                                  {item.day == 'Monday'
                                    ? strings('add_property_screen.monday')
                                    : item.day == 'Tuesday'
                                      ? strings('add_property_screen.tuesday')
                                      : item.day == 'Wednesday'
                                        ? strings('add_property_screen.wednesday')
                                        : item.day == 'Thursday'
                                          ? strings('add_property_screen.thursday')
                                          : item.day == 'Friday'
                                            ? strings('add_property_screen.friday')
                                            : item.day == 'Saturday'
                                              ? strings('add_property_screen.saturday')
                                              : item.day == 'Sunday'
                                                ? strings('add_property_screen.sunday')
                                                : null}
                                </Text>
                                <View style={{ width: '30%', alignItems: 'center' }}>
                                  <View
                                    style={{
                                      width: '70%',
                                      borderColor: '#999999',
                                      borderRadius: 5,
                                      borderWidth: 0.5,
                                    }}>
                                    <Text
                                      style={{
                                        padding: 5,
                                        textAlign: 'center',
                                        writingDirection:
                                          lang == 'en' ? 'ltr' : 'rtl',
                                      }}>
                                      {item.price}
                                    </Text>
                                  </View>
                                </View>
                                <View style={{ width: '30%', alignItems: 'center' }}>
                                  <View
                                    style={{
                                      // marginRight: 10,
                                      width: '70%',
                                      borderColor: '#999999',
                                      borderRadius: 5,
                                      borderWidth: 0.5,
                                    }}>
                                    <Text
                                      style={{
                                        padding: 5,
                                        textAlign: 'center',
                                        writingDirection:
                                          lang == 'en' ? 'ltr' : 'rtl',
                                      }}>
                                      {parseInt(item.price) * 0.20}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            );
                          }
                        }}
                      />
                    </View>
                  ) : (
                    <View></View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 30,
                    }}>
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
                      }}>
                      {reservations == 1
                        ? first == 1
                          ? strings('payment_screen.one_day')
                          : strings('payment_screen.multi_day')
                        : strings('payment_screen.two_resrvation')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    // onPress={() => this.RBSheet.open()}
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      paddingBottom: 10,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#979191',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      }}>
                      {this.state.selectedDates.length == 0
                        ? strings('payment_screen.select_reservation_day')
                        : this.state.selectedDates.toString()}
                    </Text>
                  </TouchableOpacity>
                  {this.state.reservations == 1 && this.state.first != 1 && (
                    <Text
                      style={{
                        color: '#B20C11',
                        paddingHorizontal: 20,
                        paddingBottom: 10,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      }}>
                      {strings('property_detail_screen.note')}
                    </Text>
                  )}
                  <View style={{ width: '100%' }}>
                    <View>
                      <Calendar
                        key={dateChange}
                        type="gregorian"
                        current={_today}
                        minDate={_today}
                        onDayPress={
                          reservations == 1 && second == 1
                            ? ({ dateString }) => { this.onDaySelect(dateString) }
                            : ({ dateString }) => {
                              this.onDayPress(dateString);
                            }
                          // console.log("on day press", this.state._markedDates)
                        }
                        hideExtraDays={true}
                        markedDates={this.state._markedDates}
                        markingType={'period'}
                        firstDay={1}
                        disableAllTouchEventsForDisabledDays={true}
                        enableSwipeMonths={true}
                        renderArrow={(direction) =>
                          direction === 'left' ? (
                            <Image
                              style={{
                                height: 15,
                                width: 20,
                                resizeMode: 'contain',
                                tintColor: 'black',
                                transform: [{ rotate: rotateBack }],
                              }}
                              source={require('../../../assets/images/back.png')}
                            />
                          ) : (
                            <Image
                              style={{
                                height: 15,
                                width: 20,
                                resizeMode: 'contain',
                                tintColor: 'black',
                                transform: [{ rotate: rotateBack2 }],
                              }}
                              source={require('../../../assets/images/back.png')}
                            />
                          )
                        }
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
                    </View>

                    {
                      reservations == 2 ? (
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
                                disabled={this.state.showMorningShift ? false : true}
                                onPress={() => {
                                  this.setState({
                                    first: this.state.first != 1 ? 1 : 0,
                                  });
                                }}
                                // onPress={()=>alert("hello")}
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
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                                  }}>
                                  {strings('payment_screen.morning_period')}
                                </Text>
                              </TouchableOpacity>
                            )}

                            {this.state.showEveningShift && (
                              <TouchableOpacity
                                disabled={this.state.showEveningShift ? false : true}
                                onPress={() => {
                                  this.setState({
                                    first: this.state.first != 2 ? 2 : 0,
                                  });
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
                                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                                  }}>
                                  {strings('payment_screen.eve_period')}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      ) : null
                    }
                  </View>
                  {second == 0 ? (
                    <View
                      style={{
                        marginLeft: 5,
                        marginTop: 20,
                        flexDirection: 'column',
                      }}>
                      <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}>
                        {reservations == 1
                          ? strings('property_detail_screen.one_day')
                          : strings('property_detail_screen.morning_shift')}
                      </Text>
                      <Text
                        style={{
                          marginTop: 5,
                          color: '#B20C11',
                          writingDirection: lang == 'en' ? 'ltr' : 'rtl',
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
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                            }}>
                            {strings('property_detail_screen.evening_shift')}
                          </Text>
                          <Text
                            style={{
                              marginTop: 5,
                              color: 'gray',
                              writingDirection: lang == 'en' ? 'ltr' : 'rtl',
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
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
                      }}>
                      {strings('payment_screen.total_price')}
                    </Text>
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
                        color: '#B20C11',
                      }}>
                      {Preference.get('currency') + " " + this.state.booking_price}
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
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
                      }}>
                      {strings('payment_screen.down_payment')}
                    </Text>
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
                      }}>
                      {Preference.get('currency') + " " +
                        Math.round(
                          (20 / 100) * parseInt(this.state.booking_price, 10),
                        )}
                    </Text>
                  </View>
                  {this.state.discountedAmount > 0 && <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 20,
                    }}>
                    <Text
                      style={{
                        color: '#979191',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
                      }}>
                      {'Discount on Down Payment'}
                    </Text>
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
                      }}>
                      {Preference.get('currency') + " " + this.state.discountedAmount}
                    </Text>
                  </View>}

                  {this.state.discountedAmount > 0 && <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 20,
                    }}>
                    <Text
                      style={{
                        color: '#979191',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
                      }}>
                      {'Total Down Payment'}
                    </Text>
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
                      }}>
                      {Preference.get('currency') + " " + ((Math.round(
                        (20 / 100) * parseInt(this.state.booking_price, 10),
                      )) - parseFloat(this.state.discountedAmount))}
                    </Text>
                  </View>}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 40,
                    }}>
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 18,
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
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      }}
                    />
                    <TouchableOpacity
                      style={{ justifyContent: 'center' }}
                      onPress={this.onApplyPromoPress}>
                      <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 17 }}>Apply</Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                    }}>
                  </View>

                  <View
                    style={{
                      marginTop: 30,
                      borderBottomColor: '#F2F0F1',
                      borderBottomWidth: 2,
                    }}
                  />
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
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 12,
                      }}>
                      {strings('payment_screen.terms_condition1')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.setState({ webViewDisplay: true })}
                    style={{ alignItems: 'center', marginLeft: 20 }}>
                    <Text
                      style={{
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                        fontSize: 12,
                        color: '#B20C11',
                      }}>
                      {strings('payment_screen.terms_condition2')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (Preference.get('userLogin')) {
                        //this.doBooking();
                        console.log("Selected Dates", this.state.selectedDates)
                        this.doPayment()
                      } else {
                        this.setState({ modalVisible: !modalVisible }, () => {
                          console.log('modal value', this.state.modalVisible)
                        });
                        // this.props.navigation.navigate('SignInScreenEmail', {
                        //   bookNow: true,
                        //   itemId: this.state.id,
                        // });
                        // Alert.alert(
                        //   strings('activities_screen.alert'),
                        //   strings('categoryall_screen.login_first'),
                        //   [
                        //     {
                        //       text: strings('add_property_screen.ok'),
                        //     },
                        //   ],
                        // );
                      }
                    }
                    }
                    disabled={!this.state.termsAndConditions}
                    style={{
                      backgroundColor: this.state.termsAndConditions
                        ? '#B20C11'
                        : 'gray',
                      height: 40,
                      width: '40%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      marginTop: 30,
                      borderRadius: 10,
                      marginVertical: 20,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                      }}>
                      {strings('property_detail_screen.book_now')}
                    </Text>
                  </TouchableOpacity>
                </>
                :
                null
            }
            {
              this.state.Propertytype == 'Hotels' ?

                <View style={{ marginBottom: 50 }}>
                  <Text style={{
                    marginTop: 10,
                    color: 'gray',
                    fontSize: 18,
                    fontWeight: 'bold',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    marginTop: 15
                  }}>
                    {
                      lang == 'en' ?
                        strings("property_detail_screen.rooms") :
                        lang == 'ar' ?
                          strings("property_detail_screen.rooms") : null
                    }
                  </Text>
                  <FlatList

                    data={this.state.hotelRooms}
                    renderItem={({ item, index }) => this.hotelRoomsrenderItem(item, index)}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => this.emptyRoomsComponent()}
                  />
                </View>
                :
                null
            }


          </ScrollView>
        </LinearGradient>
        {this.state.zoomIn && (
          <View
            style={{
              //  flex:1,
              position: 'absolute',
              //  top:90
            }}>
            <Carousel
              layout={'default'}
              ref={(ref) => (this.carousel = ref)}
              data={this.state.textArray}
              sliderWidth={windowWidth}
              itemWidth={windowWidth}
              itemHeight={windowHeight}
              scrollEnabled={true}
              renderItem={this._renderItem2}
              onSnapToItem={(index) => this.setState({ activeSlide: index })}
            />
            {this.pagination}
          </View>
        )}
        {this.state.loading && <Loader />}
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
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 15,
                }}>
                {strings('add_property_screen.close')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: "#000000aa"
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    marginTop: 20,

  },
  buttonOpen: {
    backgroundColor: 'black',
  },
  buttonClose: {
    backgroundColor: '#B20C11',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
