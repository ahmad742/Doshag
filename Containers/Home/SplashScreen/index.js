import React from 'react';
import {ImageBackground, StatusBar, Alert, Linking} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import Preference from 'react-native-preference';
import Api from '../../../network/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'WelcomeScreen'})],
});
const HomeScreen = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'MainBottomTab'})],
});
const CorrectCode = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'CorrectCode'})],
});

class SplashScreen extends React.Component {
  constructor(props) {
    // //console.log('Search file');
    super(props);
    this.state = {
      countri: [],
    };
  }

  componentDidMount() {
    this.countries();

    setTimeout(() => {
      if (Platform.OS === 'android') {
        Linking.getInitialURL().then((url) => {
          this.navigate(url);
        });
      } else {
        Linking.addEventListener('url', this.handleOpenURL);
      }
      console.log('USERLogin:', Preference.get('userLogin'));
      console.log('phone_verified: ', Preference.get('phone_verified'));
      if (Preference.get('userLogin')===true) {
        if (Preference.get('phone_verified') == 0) {
          console.log('phone_verified', Preference.get('phone_verified'));
          this.props.navigation.dispatch(CorrectCode);
        } else {
          this.props.navigation.dispatch(HomeScreen);
        }
      } else {
        this.props.navigation.dispatch(WelcomeScreen)
      }
    }, 3000);
  }
  componentWillUnmount() {
    // C
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  handleOpenURL = (event) => {
    // D
    this.navigate(event.url);
  };
  navigate = (url) => {
    // E
    //console.log('Url:--',url)
    const {navigate} = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/)[1];
    const routeName = route.split('/')[0];
    //console.log('routeName:--',id,route,routeName)

    if (routeName === 'app.wewa.life') {
      navigate('PropertyDetailScreen', {itemId: id});
    }
  };
  countries() {
    Api.get_countries()
      .then(
        function (response) {
          // console.log('AllCountries:----- ', response);
          //   let country = [];
          //   let imageBaseUrl = 'https://doshag.net/admin/public';
          let countriesDetails = response.data;
          this.storeCountries(countriesDetails);

          //   for (let i = 0; i < countriesDetails.length; i++) {
          //     country.push({
          //       label: countriesDetails[i].name,
          //       value: countriesDetails[i].name,
          //       icon: () => (
          //         <Image
          //           source={{uri: imageBaseUrl + countriesDetails[i].flag_image}}
          //           style={{width: 20, height: 20}}
          //         />
          //       ),
          //     });
          //   }
          //   this.setState({
          //     // loading: false,
          //     countri: country,
          //   });
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
  storeCountries = async (countries) => {
    try {
      await AsyncStorage.setItem('countries', JSON.stringify(countries));
      // //console.log('AllCountries :::', await AsyncStorage.getItem('countries'));
    } catch (error) {
      // Error saving data
    }
  };
  render() {
    return (
      <ImageBackground
        source={require('../../../assets/images/Splash.png')}
        style={{
          flex: 1,
          resizeMode: 'cover',
        }}>
        <StatusBar
          hidden={true}
          translucent={true}
          backgroundColor="transparent"
        />
      </ImageBackground>
    );
  }
}

export default SplashScreen;
