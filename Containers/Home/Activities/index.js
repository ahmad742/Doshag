import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Header from '../../../component/TopHeader/Header';
import color from '../../../component/AppColor';
import { AirbnbRating } from 'react-native-ratings';
import Api from '../../../network/Api';
import Preference from 'react-native-preference';
import Loader from '../../../component/Loader/Loader';
import { strings } from '../../../i18n';
import AppFonts from '../../../assets/fonts/index';
import moment from 'moment';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ActivityDetailScreen from '../ActivityDetailsScreen'
const lang = Preference.get('language');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const onShare = async (item) => {
  try {
    const result = await Share.share({
      message: 'https://app.wewa.life/PropertyDetailScreen/' + item,
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

export default class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cancelModal: false,
      count: '',
      comment: '',
      upcoming_activities: [],
      past_activities: [],
      cancelMessage: '',
      dateModal: false,
      dateList: [],
      all_past_Activities: [],
      hotel_data: [],
      prop_data: []
    };
  }



  // lefAction() {
  //     this.props.navigation.goBack()
  // }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      if (Preference.get('token')) {
        this.get();
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
  get() {
    this.setState({ loading: true });
    Api.activities()
      .then(
        function (response) {
          console.log('ActivityApiDataResponse: ', JSON.stringify(response));

          this.setState({
            upcoming_activities: [
              ...response.hotel_data?.upcoming_activities,
              ...response.prop_data?.upcoming_activities
            ],
            past_activities: [
              ...response.hotel_data?.past_activities,
              ...response.prop_data?.past_activities
            ],
            //firstname: response.data.first_name,
            //lastname: response.data.last_name,
            loading: false,
          });
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({ loading: false });
          console.log('Error: ', JSON.stringify(error));
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );

  };





  getDates(booking_id) {
    this.setState({ loading: true });
    let body = new FormData();
    body.append('booking_id', booking_id);
    console.log("Body", body)
    Api.getBookingDates(body)
      .then(
        function (response) {
          this.setState({ loading: false, dateModal: true, dateList: response.data });
          console.log('GET BOOKING DATES Response: ', JSON.stringify(response));
          this.setState({});
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
  cancel_booking = (booking_id) => {
    this.setState({ loading: true });
    let body = new FormData();
    body.append('booking_id', booking_id);
    // console.log('BodyData', body);
    Api.cancel_reservation(body)
      .then(
        function (response) {
          // console.log('ProfileApiDataResponse: ', JSON.stringify(response));
          if (response.status != 200) {
            this.setState({ loading: false });
            this.get();
            Alert.alert('Error:-' + response.message, [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          } else {
            this.setState({
              loading: false,
              cancelModal: true,
              cancelMessage:
                lang == 'en' ? response.message : response.message_arabic,
            });
            this.get();
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
  };
  post_review = (property_id, booking_id) => {
    this.setState({ loading: true });
    let body = new FormData();
    body.append('property_id', property_id);
    body.append('booking_id', booking_id);
    body.append('rating', this.state.count);
    body.append('review', this.state.comment);
    //console.log('BodyData', body);
    Api.post_review(body)
      .then(
        function (response) {
          console.log('SubmitReviewApiDataResponse: ', JSON.stringify(response));
          if (response.status != 200) {
            this.setState({ loading: false });
            this.get();
            Alert.alert('Error:- ' + response.message, [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
          } else {
            Alert.alert(strings('activities_screen.alert'), response.message, [
              {
                text: strings('add_property_screen.ok'),
              },
            ]);
            this.get();
            this.setState({ loading: false });
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
  };


  renderItem(item, index) {
    console.log('item===1>>', item);

    return (
      <>
        {item?.status != '0' &&
          <View style={styles.cardMain}>
            <View
              style={{
                width: '100%',
                height: 2,
                backgroundColor: color.graylightBorder,
              }}
            />
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ActivityDetailsScreen', {
                  itemId: item[0].property_id,
                  item: item[0]

                })
              }
              style={styles.cardInner}>
              <View style={{ flexDirection: 'row' }}>
                {item[0].type == 'Hotels' ?  <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 16,
                    fontFamily: AppFonts.PoppinsRegular,
                    paddingHorizontal: 10,
                  }}>
                  {lang == 'en' ? strings("Activity_screen.hotel") + ":" : strings("Activity_screen.hotel")}
                </Text> : null}
               
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 16,
                    fontFamily: AppFonts.PoppinsRegular,

                  }}>
                  {lang == 'en' ? item[0].eng_name : item[0].arabic_name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => onShare(item.property_id)}>
                <Image
                  source={require('../../../assets/images/share.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            {item[0].type == "Hotels"?    <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                  fontFamily: AppFonts.PoppinsRegular,
                  paddingHorizontal: 10,
                }}>
                {lang == 'en' ? strings("Activity_screen.room") + ":" : strings("Activity_screen.room")}
              </Text>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                  fontFamily: AppFonts.PoppinsRegular,

                }}>
                {lang == 'en' ? item[0].bed_type : item[0].bed_type_arabic}
              </Text>
            </View> : null}
         

            <View
              style={{
                flexDirection: 'row',
                margin: 10,
                paddingHorizontal: 10,

              }}>
              <Text
                style={{
                  color: '#ADADAD',
                  fontFamily: AppFonts.PoppinsRegular,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {strings('activities_screen.remaining_amount') + ':'}
              </Text>
              <Text
                style={{
                  color: '#B20C11',
                  marginLeft: 7,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 14,
                  fontFamily: AppFonts.PoppinsRegular,
                }}>
                {(item[0].total_price - item[0].down_payment).toFixed(2)}
              </Text>
            </View>
            <View style={styles.contentStyle}>
              <TouchableOpacity
                style={{ width: '50%' }}
              // onPress={() => {
              //   // this.setState({dateModal: true});
              //   this.getDates(item[0].booking_id)
              //   // console.log('asdasf',item.booking_id)
              // }}
              >
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 12,
                    color: '#ADADAD',
                    fontFamily: AppFonts.PoppinsRegular,

                  }}>
                  {strings('activities_screen.do_reservation')}
                </Text>
                <Text
                  style={{

                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 13,
                    fontFamily: AppFonts.PoppinsRegular,
                    marginTop: 5,
                  }}>

                  {item.map(itm => (moment(itm.booking_date_time).format('DD-MM-YYYY')) + ',')
                  }



                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  {
                    item.status == 3
                      ? Alert.alert(
                        strings('activities_screen.alert'),
                        strings('activities_screen.cancel_booking_checking'),
                        [
                          {
                            text: strings('activities_screen.cancel'),
                            onPress: () => console.log('Cancel Pressed'),
                            style: strings('activities_screen.cancel'),
                          },
                          {
                            text: strings('add_property_screen.ok'),
                            onPress: () => this.cancel_booking(item[0].booking_id),
                          },
                        ],
                        { cancelable: false },
                      )
                      : Alert.alert(
                        strings('activities_screen.alert'),
                        strings(
                          'activities_screen.cancel_request_under_review',
                        ),
                        [
                          {
                            text: strings('add_property_screen.ok'),
                          },
                        ],
                      );
                  }
                }}
                style={styles.btnStyle}>
                <Text
                  style={{
                    color: 'white',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}>
                  {strings('activities_screen.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>}
      </>
    );
  }
  lefAction() {
    this.props.navigation.goBack();
  }
  renderItem2(item, index) {
    console.log('Item---2',item)
    if (item.status !== '0') {
      return (
        <View style={{ borderColor: 'black', borderWidth: 0.4, margin: 5, borderRadius: 5 }}>
          <View style={styles.cardMain}>
            <View style={{
              width: '100%',
              height: 2,
              backgroundColor: color.graylightBorder,
            }} />
            <View style={styles.cardInner}>
              <View style={{flexDirection:"row"}}>
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 16,
                    fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {lang == 'en' ? strings("Activity_screen.hotel") + ":" : strings("Activity_screen.hotel")}
                </Text>
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 16,
                    fontFamily: AppFonts.PoppinsRegular,
                    marginLeft:10
                  }}>
                  {lang == 'en' ? item[0].eng_name : item[0].arabic_name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => onShare(item[0].property_id)}>
                <Image
                  source={require('../../../assets/images/share.png')}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
            {item[0].type == "Hotels" ?  <View style={{ flexDirection: 'row',}}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                  fontFamily: AppFonts.PoppinsRegular,
                  paddingHorizontal: 10,
                }}>
                {lang == 'en' ? strings("Activity_screen.room") + ":" : strings("Activity_screen.room")}
              </Text>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                  fontFamily: AppFonts.PoppinsRegular,

                }}>
                {lang == 'en' ? item[0].bed_type : item[0].bed_type_arabic}
              </Text>
            </View> : null }
           
            <View style={styles.contentStyle}>
              <TouchableOpacity
                onPress={() => {
                  this.getDates(item.booking_id)
                }}>
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 12,
                    color: '#ADADAD',
                    fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {strings('activities_screen.do_reservation')}
                </Text>
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 13,
                    fontFamily: AppFonts.PoppinsRegular,
                    marginTop: 5,
                  }}>
                  {moment(item.booking_date_time).format('DD-MM-YYYY')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        
          <Text
            style={{
              textAlign: 'center',
              marginStart: 20,
              marginTop: 20,
              color: '#979191',
              writingDirection: lang == 'en' ? 'ltr' : 'rtl',
              fontSize: 16,
              fontFamily: AppFonts.PoppinsRegular,
            }}>
            {strings('activities_screen.how_rate_our_app')}
          </Text>

          <AirbnbRating
            count={5}
            reviews={false}
            defaultRating={0}
            ratingBackgroundColor={'red'}
            onFinishRating={(rating) => this.setState({ count: rating })}
            showRating={true}
            type="custom"
            reviewSize={0}
            size={30}
            style={{ paddingVertical: 10 }}
          />

          <View>
            <TextInput
              onChangeText={(text) => this.setState({ comment: text })}
              multiline={true}
              style={{
                height: 120,
                backgroundColor: 'white',
                textAlign: lang == 'en' ? 'left' : 'right',
                margin: 10,
                borderRadius: 5,
                textAlignVertical: 'top',
                marginStart: 40,
                marginEnd: 40,
                borderColor: color.graylightBorder,
                borderWidth: 2,
                paddingLeft: 10,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl',
              }}
              placeholder={strings('app_feedback_screen.leave_comment')}
            />
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flex: 1,
              marginEnd: 10,
            }}>
            <TouchableOpacity
              onPress={() => this.post_review(item.property_id, item.booking_id)}>
              <Text
                style={{
                  color: color.redHead,
                  marginBottom: 10,
                  marginEnd: 40,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                  fontFamily: AppFonts.RobotMedium,
                }}>
                {strings('activities_screen.post')}
              </Text>
            </TouchableOpacity>
          </View>
        </View >
      );
    }
    else {
      return (<></>);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('activities_screen.activities')}
          leftAction={this.lefAction.bind(this)}
          navigation={this.props.navigation}
        />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fbf4ed' }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {this.state.upcoming_activities.length != 0 ? (
            <View style={styles.mainContainer}>
              <View style={styles.cardMain}>
                <Text
                  style={{
                    margin: 10,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 14,
                    fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {strings('activities_screen.upcoming')}
                </Text>
              </View>
              <FlatList
                data={this.state.upcoming_activities}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                extraData={this.state.upcoming_activities}
              // keyExtractor={(item) => item.id}
              />
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text
                style={{
                  alignSelf: 'center',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 20,
                  fontFamily: AppFonts.PoppinsMedium,
                }}>
                {strings('activities_screen.no_booking_available')}
              </Text>
            </View>
          )}
          {this.state.past_activities.length != 0 ? (
            <View style={styles.mainContainer}>
              <View style={styles.cardMain}>
                <Text
                  style={{
                    margin: 10,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 14,
                    fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {strings('activities_screen.previous')}
                </Text>
              </View>
              <FlatList
                data={this.state.past_activities}
                renderItem={({ item, index }) => this.renderItem2(item, index)}
                extraData={this.state.past_activities}
              // keyExtractor={(item) => item.id}
              />
            </View>
          ) : null}
        </ScrollView>
        {this.state.cancelModal && (
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor: '#80808066',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}>
            <View style={{ backgroundColor: 'white', width: '90%', padding: 20 }}>
              <Text
                style={{
                  marginTop: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                {'Alert!'}
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 16,
                }}>
                {this.state.cancelMessage}
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({ cancelModal: false })}
                style={{ width: '100%' }}>
                <Text
                  style={{
                    marginTop: 40,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                    fontSize: 16,
                    alignSelf: 'flex-end',
                  }}>
                  {'Ok'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Modal transparent visible={this.state.dateModal}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ dateModal: false })
            }}
            style={{
              flex: 1,
              backgroundColor: '#00000020',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '80%',
                height: windowHeight / 2,
                backgroundColor: '#fbf4ed',
                alignItems: "center",
                borderRadius: 20
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  fontSize: 22,
                  color: '#ADADAD',
                  fontFamily: AppFonts.PoppinsRegular,
                  marginBottom: 20
                }}>
                {strings('activities_screen.do_reservation')}
              </Text>
              <FlatList
                data={this.state.dateList}
                extraData={this.state.dateList}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <Text style={{ marginBottom: 10, fontSize: 22 }}>
                        {/* {moment(item.booking_date_time).format('DD-MM-YYYY')}  */}

                      </Text>
                    </View>
                  )
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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
  },
  mainContainer: {
    width: '100%',
    marginTop: 20,
  },
  cardMain: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: color.graylightBorder,
    backgroundColor: 'white',
  },
  cardInner: {
    marginHorizontal: 10,
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  contentStyle: {
    alignItems: 'center',
    margin: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,

  },
  btnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 120,
    backgroundColor: '#FFB300',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'white',

  },
});
