import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Header from '../../../component/TopHeader/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { strings } from '../../../i18n';
import Preference from 'react-native-preference';
import { TextInput } from 'react-native-gesture-handler';
// let maxValue = '';
// let minValue = '';
const _format = 'YYYY-MM-DD';
const _today = moment().format(_format);
const _maxDate = moment().add(30, 'days').format(_format);
const lang = Preference.get('language');
class index extends Component {
  initialState = {
    [_today]: { disabled: true },
  };
  constructor(props) {
    super(props);
    this.myDropdown1 = null;
    const now = new Date();
    this.state = {
      _markedDates: this.initialState,
      isChecked: 0,
      min: '',
      max: '',
      city: '',
      sub_type: '',
      swimming_pool: 0,
      selectedDates: [],
      switchValue: false,
      selectedCities: [],
      cities: '',
      selectedCity: '',
      rotate: '0deg',
      rotate2: '0deg',

      cityPickerOpen: false,
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      this.rotation();
      this.rotation2();
      this.setCities(Preference.get('country'));
    });
  }
  resetMyDropdown() {
    if (this.myDropdown1) {
      // console.log("I am In this.myDropdown",this.myDropdown.state)
      this.myDropdown1.state.choice.icon = null;
      this.myDropdown1.state.choice.label = null;
      this.myDropdown1.state.choice.value = null;
    }
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
  lefAction() {
    this.props.navigation.navigate('CategoryAll', {
      onGoBack: () => this.filtered_property(),
      date: this.state.selectedDates[0],
      min_value: this.state.min,
      max_value: this.state.max,
      sub_type: this.state.sub_type,
      swimming_pool: this.state.swimming_pool,
      city: this.state.city,
      selected_City: this.state.selectedCity,
      filter_call: false,
    });
  }

  toggleSwitch = (value) => {
    if (value == false) {
      this.setState({ swimming_pool: null, switchValue: value });
    } else if (value == true) {
      this.setState({ swimming_pool: 27, switchValue: value });
    }
  };

  onDayPress = (dateString) => {
    this.state.selectedDates.length = 0;
    let markedDates = {};
    let selected_dates = this.state.selectedDates;
    selected_dates.push(dateString);
    markedDates[dateString] = { selected: true };
    this.setState({
      _markedDates: markedDates,
      selectedDates: selected_dates,
    });
  };
  setCities = async (shaher) => {
    ////console.log('AllCountries');
    let cities = undefined;
    try {
      cities = JSON.parse(await AsyncStorage.getItem('countries'));
      // console.log('AllCountries', JSON.stringify(cities));
      this.setState({ cities: selectedCity });
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
    this.setState({ selectedCities: realCities }, () => { });
  };
  reset() {
    this.resetMyDropdown();
    // this.refs._rangeSlider.setLowValue(0);
    // this.refs._rangeSlider.setHighValue(10000);
    this.setState({
      _markedDates: this.initialState,
      isChecked: 0,
      min: '',
      max: '',
      city: '',
      sub_type: '',
      selectedCity:'',
      swimming_pool: 0,
      selectedDates: [],
      switchValue: false,
    });
  }

  setCityPickerOpen = () => {
    this.setState({ cityPickerOpen: !this.state.cityPickerOpen })
  }

  apply() {
    // console.log(
    //   'Latest Console for SWitch',
    //   JSON.stringify(this.state.sub_type),
    // );
    // console.log(
    //   'Latest Console for SWitch',
    //   JSON.stringify(this.state.switchValue),
    // );
    console.log('selectedCity ===>>>', this.state.selectedCity);
    if (
      this.state.selectedDates.length == 0 &&
      this.state.min == '' &&
      this.state.max == '' &&
      this.state.selectedCity == '' &&
      this.state.sub_type == '' &&
      this.state.swimming_pool == '' 
      // this.state.city == ''
    ) {
      Alert.alert(
        strings('activities_screen.alert'),
        strings('filter_screen.please_enter_something'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
    } else if (this.state.min == '' && this.state.max != '') {
      Alert.alert(
        strings('activities_screen.alert'),
        strings('filter_screen.please_enter_starting'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
    } 
    else if (this.state.min != '' && this.state.max == '') {
      Alert.alert(
        strings('activities_screen.alert'),
        strings('filter_screen.please_ending_starting'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
    } 
    else if (this.state.selectedCity == '') {
      alert('please select city')
      
    } 
    else if (parseInt(this.state.min) >= parseInt(this.state.max)) {
      Alert.alert(
        strings('activities_screen.alert'),
        strings('filter_screen.price_comparision'),
        [
          {
            text: strings('add_property_screen.ok'),
          },
        ],
      );
    } else {
      this.props.navigation.navigate('CategoryAll', {
        onGoBack: () => this.filtered_property(),
        date: this.state.selectedDates[0],
        min_value: this.state.min,
        max_value: this.state.max,
        sub_type: this.state.sub_type,
        selected_City: this.state.selectedCity,
        swimming_pool: this.state.swimming_pool,
        // city: this.state.city,
        filter_call: true,
      });
    }
  }
  rotation2 = () => {
    if (Preference.get('language') == 'en') {
      this.setState({ rotate2: '180deg' });
    } else {
      this.setState({ rotate2: '0deg' });
    }
  };
  render() {
    let rotateBack = this.state.rotate;
    const { params } = this.props.navigation.state;
    let rotateBack2 = this.state.rotate2;
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={lang == 'en' ? 'Filter' : 'حدد خياراتك'}
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
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
            }}>
            {/* <TouchableOpacity
              onPress={() => this.RBSheet.open()}
              style={{
                marginLeft: 5,
                marginTop: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                }}>
                {strings('filter_screen.when_to_book')}
              </Text>
              <Image
                resizeMode={'contain'}
                style={{
                  // marginTop: 5,
                  width: 15,
                  height: 15,
                  transform: [{rotate: rotateBack}],
                }}
                source={require('../../../assets/images/forward.png')}
              />
            </TouchableOpacity> */}

            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
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
                <Calendar
                  type="gregorian"
                  // current={'2020-09-04'}
                  minDate={_today}
                  // maxDate={_maxDate}
                  onDayPress={({ dateString }) => {
                    console.log(
                      'selected day',
                      dateString,
                      moment(dateString).format('dddd'),
                    );
                    this.onDayPress(dateString);
                  }}
                  // monthFormat={'dd MM yyyy'}
                  disableMonthChange={true}
                  onMonthChange={(month) => {
                    //console.log('month changed', month);
                  }}
                  // hideArrows={false}
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
                  hideExtraDays={false}
                  markedDates={this.state._markedDates}
                  markingType={'multi-dot'}
                  // disableMonthChange={false}
                  firstDay={1}
                  // hideDayNames={false}
                  // showWeekNumbers={false}
                  // onPressArrowLeft={(subtractMonth) => subtractMonth()}
                  // onPressArrowRight={(addMonth) => addMonth()}
                  // disableArrowLeft={false}
                  // disableArrowRight={false}
                  disableAllTouchEventsForDisabledDays={true}
                  // renderHeader={(date) => {
                  //   /*Return JSX*/
                  // }}
                  enableSwipeMonths={true}
                  theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    // textSectionTitleDisabledColor: '#d9e1e8',
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
                    // this.setBookingPrice();
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

            {this.state.selectedDates.length != 0 ? (
              <View
                style={{
                  marginLeft: 5,
                  marginTop: 10,
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    color: 'gray',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}>
                  {strings('filter_screen.check_in')}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}>
                  {this.state.selectedDates}
                </Text>
              </View>
            ) : (
              <View></View>
            )}

            <Text
              style={{
                writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                fontSize: 15,
                left: 5,
                marginTop: 30,
                fontWeight: 'bold',
              }}>
              {strings('filter_screen.price_range')}
            </Text>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={{width: '30%'}}>{'0'}</Text>
              <Text>{'To'}</Text>
              <Text style={{width: '30%'}}>{'10000'}</Text>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <TextInput
                value={this.state.min}
                keyboardType="number-pad"
                placeholder="0"
                style={{
                  height: 40,
                  width: '30%',
                  backgroundColor: 'white',
                  textAlign: 'center',
                }}
                onChangeText={(text) =>
                  this.setState({
                    min: text,
                  })
                }
              />
              <Text style={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl' }}>
                {lang == 'en' ? 'To' : 'إلى'}
              </Text>
              <TextInput
                value={this.state.max}
                keyboardType="number-pad"
                placeholder="10000"
                style={{
                  height: 40,
                  width: '30%',
                  backgroundColor: 'white',
                  textAlign: 'center',
                }}
                onChangeText={(text) =>
                  this.setState({
                    max: text,
                  })
                }
              />
            </View>
            {/* <RangeSlider
              // ref={r => this.slider = r}
              ref="_rangeSlider"
              rangeEnabled={true}
              style={{width: '95%', height: 60, bottom: 20}}
              gravity={'center'}
              min={0}
              max={10000}
              step={20}
              selectionColor="#B20C11"
              blankColor="#F2F0F1"
              onValueChanged={(low, high, fromUser) => {
               minValue = low;
               maxValue = high;
              }}
            /> */}
            {/* {params.property_type == 'Chalets and pools' && (
              <View>
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                    marginLeft: 5,
                    fontWeight: 'bold',
                  }}>
                  {strings('add_property_screen.property_typ')}
                </Text>

                <View
                  style={{
                    marginTop: 20,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                      marginLeft: 5,
                    }}>
                    {strings('add_property_screen.chalet')}
                  </Text>

                  <CheckBox
                    style={{padding: 5}}
                    onClick={() => {
                      this.setState({
                        isChecked: 1,
                        sub_type: 'Chalet',
                      });
                    }}
                    isChecked={this.state.isChecked == 1 ? true : false}
                    checkBoxColor={'#B20C11'}
                  />
                </View>

                <View
                  style={{
                    marginTop: 20,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                      marginLeft: 5,
                    }}>
                    {strings('add_property_screen.istehara')}
                  </Text>

                  <CheckBox
                    style={{padding: 5}}
                    onClick={() => {
                      this.setState({
                        isChecked: 2,
                        sub_type: 'Estraha',
                      });
                    }}
                    isChecked={this.state.isChecked == 2 ? true : false}
                    checkBoxColor={'#B20C11'}
                  />
                </View>

                <View
                  style={{
                    marginTop: 20,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                      marginLeft: 5,
                    }}>
                    {strings('add_property_screen.farms')}
                  </Text>

                  <CheckBox
                    style={{padding: 5}}
                    onClick={() => {
                      this.setState({
                        isChecked: 3,
                        sub_type: 'Farms',
                      });
                    }}
                    isChecked={this.state.isChecked == 3 ? true : false}
                    checkBoxColor={'#B20C11'}
                  />
                </View>
              </View>
            )} */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 25,
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                {strings('add_property_screen.swimming_pool')}
              </Text>
              <Switch
                onValueChange={this.toggleSwitch}
                value={this.state.switchValue}
                trackColor={{ false: 'white', true: 'red' }}
                thumbColor={'#B20C11'}
              />
            </View>

            <View
              style={{
                marginTop: 30,
              }}>
              <Text
                style={{
                  marginLeft: 5,
                  marginBottom: 15,
                  fontWeight: 'bold',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {strings('filter_screen.select_city')}
              </Text>

              <DropDownPicker
                setOpen={() => { this.setCityPickerOpen() }}
                open={this.state.cityPickerOpen}
                onSelectItem={(item) => {
                  console.log('SelectingCities: ', JSON.stringify(item))
                  this.setState({
                    selectedCity: item.value,
                    cities: item.value,
                  })
                }}
                items={this.state.selectedCities.sort(function (a, b) {
                  return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
                })}
                containerStyle={{ height: 48, width: '100%', marginBottom: 10 }}
                ref={(c) => (this.myDropdown1 = c)}
                style={{
                  backgroundColor: 'white',
                  borderWidth: 0.5,
                  borderColor: '#999999',
                  borderRadius: 10,
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                }}
                dropDownStyle={{ backgroundColor: 'white' }}
                onChangeItem={(item) =>
                  this.setState({
                    city: item.value,
                  })
                }
                placeholder={this.state.selectedCity != '' ? this.state.selectedCity : strings('filter_screen.select_city')}
                placeholderStyle={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                  color: '#979191',
                }}
                selectedLabelStyle={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                  color: 'black',
                }}
                showArrow={false}
              />
              <Image
                source={require('../../../assets/images/down.png')}
                resizeMode={'contain'}
                style={{
                  position: 'absolute',
                  bottom: 26,
                  right: 10,
                  tintColor: '#979191',
                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 200, // I think its wrong :(
                marginBottom: 20,
              }}>
              <TouchableOpacity
                onPress={() => this.reset()}
                style={{
                  flex: 1,
                  marginRight: 10,
                  padding: 8,
                  borderColor: '#B20C11',
                  borderRadius: 10,
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    color: '#B20C11',
                    textAlign: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 15,
                  }}>
                  {strings('filter_screen.reset')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.apply()}
                style={{
                  backgroundColor: '#B20C11',
                  flex: 1,
                  borderColor: '#B20C11',
                  marginLeft: 10,
                  padding: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 13,
                  }}>
                  {strings('filter_screen.apply')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}

export default index;
