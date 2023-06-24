import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

import Header from '../../../component/TopHeader/Header';
import Preference from 'react-native-preference';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
import color from '../../../component/AppColor';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { strings } from '../../../i18n';
import AppColor from '../../../component/AppColor';

const lang = Preference.get('language');

export default class MyProperty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      loading: false,
      propertyList: [
        /*  {
          image: require('../../../assets/images/img.png'),
          name: 'Chalet Name',
        },
        {
          image: require('../../../assets/images/img.png'),
          name: 'Chalet Name',
        }, */
      ],
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      this.userProperties();
    });
  }
  userProperties() {
    this.setState({ loading: true });
    Api.myProperties()
      .then(
        function (response) {
          console.log('userPropertiesAPIResponse: ', JSON.stringify(response));
          this.setState({ loading: false, propertyList: response.data });
          let tempArray = [],
            array = response.data;

          for (let i = 0; i < array.length; i++) {
            tempArray.push({
              id: array[i].id,
              user_id: array[i].user_id,
              eng_name: lang == 'en' ? array[i].eng_name : array[i].arabic_name,
              // arabic_name: array[i].arabic_name,
              country: array[i].country,
              city: array[i].city,
              location: array[i].location,
              type: array[i].type,
              description: array[i].description,
              special_offer: array[i].special_offer,
              priority: array[i].priority,
              status: array[i].status,
              reservation: array[i].reservation,
              specific_time: array[i].specific_time,
              full_day: array[i].full_day,
              start_time: array[i].start_time,
              end_time: array[i].end_time,
              eve_start_time: array[i].eve_start_time,
              eve_end_time: array[i].eve_end_time,
              created_at: array[i].created_at,
              updated_at: array[i].updated_at,
              property_files: array[i].property_files,
              likes: array[i].likes,
              property_rating: array[i].property_rating,
              rated_person: array[i].rated_person,
              price: array[i].price,
              admin_approval_bit: array[i].admin_approval_bit,
              isDropdown: false,
              displayImgUri:
                'https://doshag.net/admin/public/images/property_images/' +
                array[i].photo,
              uriCheck: array[i].photo,
            });
          }
          // console.log(
          //   'userProperties',
          //   'tempArray[0].displayImgUri',
          //   array[i].photo,
          // );
          this.setState({ propertyList: tempArray });
          //   Preference.clear();
          //   this.props.navigation.navigate('WelcomeScreen');
          //   Alert.alert('Logout Successfully!');
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

  del_Property = async (item) => {
    console.log("item ==>>>", item?.id);
    const formData = new FormData();
    formData.append('property_id', item?.id);

    console.log("del_Property Body Formn Data ---???>>>", formData);

    try {
      this.setState({ loading: true });
      const response = await Api.del_hotel(formData)
      console.log("del_Property-response.status", response.status)
      if (response.status == 200) {
        this.userProperties()
        console.log('Add Hotel APIResponse: ', JSON.stringify(response));
        Alert.alert(response.message,
          [
            {
              text: strings('add_property_screen.ok'),
            },
          ],
        );
      } else {
        this.setState({ loading: false });
        Alert.alert(strings('del_Property.alert'), response.message, [
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
  renderItem(item, index) {
    // console.log('Single Property Item', item)
    // console.log('Single Property Item Location....', item.location)
    return (
      <View>
        <View style={styles.mainContainer}>
          <View style={{ height: 130 }}>
            <Image
              style={[styles.imagSty, { height: 130, resizeMode: 'cover' }]}
              // style={{width: 100, height: 100, resizeMode: 'contain'}}
              source={
                !item.uriCheck
                  ? require('../../../assets/images/img.png')
                  : { uri: item.displayImgUri }
              }
            />
            <View
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  // padding: 5,
                  borderWidth: 3,
                  borderColor: item.admin_approval_bit == 1 ? 'green' : 'red',
                  width: '40%',
                }}>
                <Text
                  style={{
                    color: item.admin_approval_bit == 1 ? 'green' : 'red',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                    textAlign: 'center',
                    // marginTop: 20,
                    // fontFamily: AppFonts.PoppinsRegular,
                  }}>
                  {item.admin_approval_bit == 1
                    ? strings('my_property_screen.approved')
                    : item.admin_approval_bit == 2
                      ? strings('my_property_screen.under_review')
                      : strings('my_property_screen.rejected')}
                </Text>
              </View>
            </View>
          </View>
          {item.special_offer != '0' && (
            <TouchableOpacity
              style={{
                width: 80,
                height: 25,
                backgroundColor: color.lightRed,
                position: 'absolute',
                right: 0,
                marginTop: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: 'white' }}>
                {item.special_offer + strings('my_property_screen.off')}
              </Text>
            </TouchableOpacity>
          )}
          {item.isDropdown ? (
            <View
              style={{
                width: '55%',
                height: 150,
                marginStart: 10,
                backgroundColor: AppColor.graylightBorder,
                position: 'absolute',
                justifyContent: 'center',
                marginTop: 20,
                zIndex: 1,
              }}>
              <TouchableOpacity
                style={{ padding: 20 }}
                onPress={() => {
                  item.isDropdown = false;
                  this.props.navigation.navigate('EditPropertyScreen', {
                    itemId: item.id,
                  });
                }}>
                <Text
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 11,
                    color: '#979191',
                  }}>
                  {strings('my_property_screen.edit')}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomColor: '#979191',
                  borderBottomWidth: 0.5,
                  top: 0,
                  width: '85%',
                  alignSelf: 'center',
                }}
              />

              <TouchableOpacity
                style={{
                  padding: 20,
                }}
                onPress={() => {
                  item.isDropdown = false;
                  this.props.navigation.push('ReservationCalender', {
                    itemId: item.id,
                    reservation: item.reservation,
                    specific_time: item.specific_time,
                    full_day: item.full_day,
                  });
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 11,
                    // top: 40,
                    // marginLeft: 10,
                    color: '#979191',
                  }}>
                  {strings('my_property_screen.reserv_calender')}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomColor: '#979191',
                  borderBottomWidth: 0.5,
                  top: 0,
                  width: '85%',
                  alignSelf: 'center',
                }}
              />

              <TouchableOpacity
                style={{
                  padding: 20,
                }}
                onPress={() => {
                  item.isDropdown = false;
                  Alert.alert('Are you sure', 'You want to delete your property', [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    { text: 'Yes', onPress: () => this.del_Property(item) },
                  ]);
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 11,
                    color: '#979191',
                  }}>
                  {'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View></View>
          )}
          <TouchableOpacity
            onPress={() => {
              let tempArray = this.state.propertyList;
              for (let i = 0; i < tempArray.length; i++) {
                if (index === i) {
                  tempArray[i].isDropdown = true;
                } else {
                  tempArray[i].isDropdown = false;
                }
              }
              this.setState({ propertyList: tempArray });
              console.log(this.state.propertyList);
            }}
            style={{
              width: 40,
              height: 60,
              marginStart: 10,
              backgroundColor: '#1C2510AA',
              position: 'absolute',
              left: 0,
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../assets/images/menu.png')}
              resizeMode={'contain'}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
                alignItems: 'center',
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12,
                width: '60%',
              }}>
              <Image
                style={{ width: 15, height: 15, resizeMode: 'contain' }}
                source={require('../../../assets/images/location.png')}
              />
              <Text
                numberOfLines={1}
                style={{ color: color.fontColor, writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12, marginStart: 10 }}>
                {item.location == null ? item.country + ', ' + item.city : item.location}
              </Text>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row' }}>
              <Image
                source={require('../../../assets/images/heart.png')}
                style={{
                  marginEnd: 10,
                  resizeMode: 'contain',
                  width: 20,
                  height: 20,
                }}
              />
              <Text
                style={{
                  color: color.fontColor,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12,
                  marginStart: 5,
                  marginEnd: 10,
                }}>
                {item.likes + strings('my_property_screen.likes')}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginStart: 10, writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18 }}>
            {item.eng_name /* 'Chalet Name' */}
          </Text>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              marginStart: 10,
            }}>

            <Text
              style={{ color: color.yellowColor, writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20, marginEnd: 10 }}>
              {/* {Preference.get('country') === 'Saudi Arabia' ? 'SAR' + item.price : Preference.get('country') === 'Bahrain ' ? 'BHD ' : 'JOD ' + item.price} */}
              {item.country === 'Saudi Arabia' ? 'SAR' + " " + item.price : item.country === 'Jordan' ? 'JOD' + " " + item.price : item.country === 'Bahrain' ? 'BHD' + " " + item.price : null}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                margin: 20,
                alignItems: 'center',
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12,
              }}>
              <AirbnbRating
                count={5}
                defaultRating={item.property_rating}
                showRating={false}
                type="custom"
                reviewSize={0}
                size={20}
                isDisabled={true}
              />
              <Text
                style={{ color: color.fontColor, writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12, marginEnd: 10 }}>
                {'(' + item.rated_person + ')'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  lefAction() {
    this.props.navigation.goBack();
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('my_property_screen.my_property')}
          // leftMargin={-80}
          leftAction={this.lefAction.bind(this)}
          navigation={this.props.navigation}
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fbf4ed' }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {this.state.propertyList.length > 0 ? (
            <View style={styles.mainListContainer}>
              <FlatList
                data={this.state.propertyList}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                extraData={this.state}
                keyExtractor={(item) => item.id}
              />
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Add')}
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
                  <Text style={{ color: 'white' }}>
                    {strings('my_property_screen.add_new_prop')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.mainListContainer}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  {strings('my_property_screen.no_property_added')}
                </Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Add')}
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
                  }}
                // onPress={() => {
                //   this.props.navigation.navigate('Add');
                // }}
                >
                  <Text style={{ color: 'white' }}>
                    {strings('my_property_screen.add_new_prop')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  },
  mainContainer: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 3,

    borderColor: color.graylightBorder,
    backgroundColor: 'white',
  },

  imagSty: {
    resizeMode: 'stretch',
    width: '100%',
  },
  mainListContainer: {
    flex: 1,
    margin: 10,
  },
});
