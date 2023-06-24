import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../component/TopHeader/Header';
import {Avatar} from 'react-native-paper';
import {strings} from '../../../i18n';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
import AppFonts from '../../../assets/fonts/index';
import Preference from 'react-native-preference';
import moment from 'moment';
import {NavigationActions, StackActions} from 'react-navigation';

const lang = Preference.get('language');

export class NewScreen extends Component {
  constructor(props) {
    // //console.log('Search file');
    super(props);
    this.state = {
      loading: false,
      notificationList: [],
      currentDate: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    };
  }
  componentDidMount() {
    // this.fetchNotification();
    // const {navigation} = this.props;
    // this.focusListener = navigation.addListener('willFocus', () => {
    if (Preference.get('token')) {
      this.fetchNotification();
    } else {
      // Alert.alert(strings('activities_screen.sign_in_first'));
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'WelcomeScreen'})],
        }),
      );
    }
    // });
  }
  fetchNotification() {
    this.setState({loading: true});
    Api.notification()
      .then(
        function (response) {
          console.log('HomeApiData: ', JSON.stringify(response.data));
          let current_noti = response.data.current_notifications;
          let temparray = [];
          for (let i = 0; i < current_noti.length; i++) {
            let created_at = moment(current_noti[i].created_at).format(
              'DD/MM/YYYY HH:mm:ss',
            );
            let ms = moment(this.state.currentDate, 'DD/MM/YYYY HH:mm:ss').diff(
              moment(created_at, 'DD/MM/YYYY HH:mm:ss'),
            );
            let d = moment.duration(ms);
            // //console.log('Datessss',d.hours())
            temparray.push({
              image:
                'https://doshag.net/admin/public' + current_noti[i].image,
              first_name: current_noti[i].first_name,
              last_name: current_noti[i].last_name,
              message_english: current_noti[i].message_english,
              message_arabic: current_noti[i].message_arabic,
              title: current_noti[i].title,
              notification_type: current_noti[i].notification_type,
              hours: d.hours(),
              min: d.minutes(),
            });
          }
          this.setState({notificationList: temparray, loading: false});
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

  renderItem(item) {
    return (
      <View
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
          // backgroundColor:'yellow'
        }}>
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            marginTop: 40,
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor:'red'
          }}>
          <Avatar.Image
            size={50}
            source={
              item.image != null
                ? {uri: item.image}
                : require('../../../assets/images/dp1.png')
            }
          />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                bottom: 13,
                marginLeft: 15,
                textTransform: 'capitalize',
              }}>
              {item.first_name + ' ' + item.last_name}
            </Text>
            {/* <Text
              style={{
                bottom: 12,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 13,
                color: '#979191',
                marginLeft:10
              }}>
              {item.title}
            </Text> */}
          </View>
        </View>
        <Text
          style={{
            width: '60%',
            left: 75,
            bottom: 20,
            color: '#979191',
            writingDirection: lang == 'en' ? 'ltr' : 'rtl'
          }}>
          {lang == 'en' ? item.message_english : item.message_arabic}
        </Text>
        <Text
          style={{
            left: 76,
            bottom: 10,
            color: '#B20C11',
            writingDirection: lang == 'en' ? 'ltr' : 'rtl'
          }}>
          {item.hours == 0
            ? item.min + strings('notification_screen.min_ago')
            : item.hours + strings('notification_screen.hours_ago')}
        </Text>
      </View>
    );
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
          contentContainerStyle={{flexGrow: 1}}>
          {this.state.notificationList != 0 ? (
            <FlatList
              data={this.state.notificationList}
              renderItem={({item, index}) => this.renderItem(item, index)}
              extraData={this.state.notificationList}
              // keyExtractor={(item) => item.id}
            />
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  // alignSelf: 'center',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                  fontFamily: AppFonts.PoppinsMedium,
                }}>
                {strings('notification_screen.no_new_notification')}
              </Text>
            </View>
          )}
          {/* {this.renderItem()} */}
        </ScrollView>
        {this.state.loading && <Loader />}
      </LinearGradient>
    );
  }
}

class PreviousScreen extends Component {
  constructor(props) {
    // //console.log('Search file');
    super(props);
    this.state = {
      loading: false,
      notificationList: [],
      currentDate: new Date(),
    };
  }
  componentDidMount() {
    // const {navigation} = this.props;
    // this.focusListener = navigation.addListener('willFocus', () => {
    if (Preference.get('token')) {
      this.fetchNotification();
    } else {
      // Alert.alert(strings('activities_screen.sign_in_first'));
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'WelcomeScreen'})],
        }),
      );
    }
    // });
  }
  fetchNotification() {
    this.setState({loading: true});
    Api.notification()
      .then(
        function (response) {
          //console.log('HomeApiData: ', JSON.stringify(response.data));
          let current_noti = response.data.past_notifications;
          let temparray = [];
          for (let i = 0; i < current_noti.length; i++) {
            let created_at = moment(current_noti[i].created_at).format(
              'DD/MM/YYYY HH:mm:ss',
            );
            let ms = moment(this.state.currentDate, 'DD/MM/YYYY HH:mm:ss').diff(
              moment(created_at, 'DD/MM/YYYY HH:mm:ss'),
            );
            let d = moment.duration(ms);
            // //console.log('Datessss',d.hours())
            temparray.push({
              image:
                'https://doshag.net/admin/public' + current_noti[i].image,
              first_name: current_noti[i].first_name,
              last_name: current_noti[i].last_name,
              message_english: current_noti[i].message_english,
              message_arabic: current_noti[i].message_arabic,
              title: current_noti[i].title,
              notification_type: current_noti[i].notification_type,
              days: d.days(),
              hours: d.hours(),
            });
          }
          this.setState({notificationList: temparray, loading: false});
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

  renderItem(item) {
    return (
      <View
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
          // backgroundColor:'yellow'
        }}>
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            marginTop: 40,
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor:'red'
          }}>
          <Avatar.Image
            size={50}
            source={
              item.image != null
                ? {uri: item.image}
                : require('../../../assets/images/dp1.png')
            }
          />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 15,
                bottom: 13,
                marginLeft: 15,
                textTransform: 'capitalize',
              }}>
              {item.first_name + ' ' + item.last_name}
            </Text>
            {/* <Text
              style={{
                bottom: 13,
                writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 13,
                color: '#979191',
                marginLeft:10
              }}>
              {item.title}
            </Text> */}
          </View>
        </View>
        <Text
          style={{
            width: '60%',
            left: 75,
            bottom: 20,
            color: '#979191',
            writingDirection: lang == 'en' ? 'ltr' : 'rtl'
          }}>
          {lang == 'en' ? item.message_english : item.message_arabic}
        </Text>
        <Text
          style={{
            left: 76,
            bottom: 10,
            color: '#B20C11',
            writingDirection: lang == 'en' ? 'ltr' : 'rtl'
          }}>
          {item.days == 0
            ? item.hours + strings('notification_screen.hours_ago')
            : item.days + strings('notification_screen.days_ago')}
        </Text>
      </View>
    );
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
          contentContainerStyle={{flexGrow: 1}}>
          {this.state.notificationList != 0 ? (
            <FlatList
              data={this.state.notificationList}
              renderItem={({item, index}) => this.renderItem(item, index)}
              extraData={this.state.notificationList}
              // keyExtractor={(item) => item.id}
            />
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  // alignSelf: 'center',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                  fontFamily: AppFonts.PoppinsMedium,
                }}>
                {strings('notification_screen.no_prev_notification')}
              </Text>
            </View>
          )}
          {/* {this.renderItem()} */}
        </ScrollView>
        {this.state.loading && <Loader />}
      </LinearGradient>
    );
  }
}

const Tab = createMaterialTopTabNavigator();

export class index extends Component {
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('willFocus', () => {
      if (Preference.get('token')) {
        this.render();
      } else {
        this.render2();
        Alert.alert(strings('activities_screen.alert'),strings('activities_screen.sign_in_first'), [
          {
            text: strings('add_property_screen.ok'),
          },
        ]);
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'WelcomeScreen'})],
          }),
        );
      }
    });
  }
  lefAction() {
    this.props.navigation.goBack();
  }
  render2() {
    <View>
      <Header
        leftIcon={require('../../../assets/images/back.png')}
        headerText={strings('notification_screen.notification')}
        // leftMargin={-80}
        leftAction={this.lefAction.bind(this)}
        navigation={this.props.navigation}
      />
    </View>;
  }
  render() {
    return (
      <NavigationContainer>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('notification_screen.notification')}
          // leftMargin={-80}
          leftAction={this.lefAction.bind(this)}
          navigation={this.props.navigation}
        />
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: {backgroundColor: 'white', height: 5},
            tabBarLabelStyle: {writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12, color: 'white'},
            // tabStyle: { width: 100 },
            tabBarStyle: {backgroundColor: '#B20C11'},
          }}>
          <Tab.Screen
            name={strings('notification_screen.new')}
            component={NewScreen}
          />
          <Tab.Screen
            name={strings('notification_screen.previous')}
            component={PreviousScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default index;
