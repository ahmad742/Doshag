import React from 'react';
import { StyleSheet, Image,View,Text} from "react-native";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {strings} from './i18n';
import AppFonts from './assets/fonts/index';

import color from "./component/AppColor"


//Screens
import SplashScreen from './Containers/Home/SplashScreen';
import Search from './Containers/Home/Search';
import Activities from './Containers/Home/Activities';
import Profile from './Containers/Home/Profile';
import Add from './Containers/Home/Add';
import More from './Containers/Home/More';
import CategoryAll from './Containers/Home/CategoryAll';
import WelcomeScreen from './Containers/Home/WelcomeScreen';
import SignInScreenEmail from './Containers/Home/SignInScreenEmail';
import SignInScreenPhone from './Containers/Home/SignInScreenPhone';
import ForgotPasswordEmail from './Containers/Home/ForgotPasswordEmail';
import ForgotPasswordPhone from './Containers/Home/ForgotPasswordPhone';
import IncorrectCode from './Containers/Home/IncorrectCode';
import Register from './Containers/Home/Register';
import EditProfile from './Containers/Home/EditProfile';
import FilterScreen from './Containers/Home/FilterScreen';
import CorrectCode from './Containers/Home/CorrectCode';
import PropertyDetailScreen from './Containers/Home/PropertyDetailScreen';
import CodeVerificationScreen from './Containers/Home/CodeVerificationScreen';
import PaymentPage from './Containers/Home/PaymentPage';
import DebitCard from './Containers/Home/DebitCard';  
import MyProperty from './Containers/Home/MyProperty';
import ReservationCalender from './Containers/Home/ReservationCalender';
import Likes from './Containers/Home/Likes';
import EditPropertyScreen from './Containers/Home/EditPropertyScreen';
import NotificationScreen from './Containers/Home/NotificationScreen';
import AppFeedback from './Containers/Home/AppFeedback';
import ChangePassword from './Containers/Home/ChangePassword';
import Add_Property from './Containers/Home/Add_Property'
import AddHotel from './Containers/Home/AddHotel';
import AddFloors from './Containers/Home/AddFloors';
import AddRoom from './Containers/Home/AddRoom'
import FloorsScreen from './Containers/Home/FloorsScreen';
import RoomDetails from './Containers/Home/RoomDetails';
import ActivityDetailsScreen from './Containers/Home/ActivityDetailsScreen';
const MainBottomTab = createBottomTabNavigator({
        Search: {
      screen: Search,
            navigationOptions: ({navigation})=>({
                title: strings('bottom_tab.search'),
            }),
        },
        Activities: {
            screen: Activities,
            navigationOptions: ({navigation})=>({
                title: strings('bottom_tab.activities'),
            }),
        },
        Add_Property: {
            screen: Add,
            navigationOptions: ({navigation})=>({
                title: '',
            }),
        },
        Profile: {
            screen: Profile,
            navigationOptions: ({navigation})=>({
                title: strings('bottom_tab.profile'),
            }),
        },

        More: {
            screen: More,
            navigationOptions: ({navigation})=>({
                title: strings('bottom_tab.more'),
            }),
        },

    },
    {
        tabBarOptions: {
            showLabel:true,
            activeTintColor:color.redHead ,
            inactiveTintColor: '#979191',
            keyboardHidesTabBar: true,
            color:"#979191",
            pressColor: 'gray',
            style: {
                padding: 10,
                height: 70,
                backgroundColor: "white",
                borderTopWidth:0,
            },
        },
        lazy:true,
        initialRouteName: 'Search',
        defaultNavigationOptions: ({navigation})=>({
            tabBarIcon: ({focused, horizontal, tintColor })=>{
                const {routeName} = navigation.state;
                if (routeName === 'Search') {
                    if (focused) {
                        return <Image resizeMode={'contain'} style={{width:30,height:30}} source={require('./assets/images/search.png')}/>
                    } else {
                        return <Image resizeMode={'contain'} style={{width:30,height:30}}  source={require('./assets/images/searchGray.png')}/>
                    }
                }
               else if(routeName === 'Activities'){
                    if (focused) {
                        return <Image resizeMode={'contain'} style={{width:30,height:30}} source={require('./assets/images/hand-bagRed.png')}
                        />
                    } else {
                        return <Image resizeMode={'contain'} style={{width:30,height:30}} source={require('./assets/images/hand-bag.png')}
                        />
                    }
                }
                else if(routeName === 'More'){
                    if (focused) {
                        return <Image resizeMode={'contain'} style={{width:30,height:30}} source={require('./assets/images/morered.png')}
                        />
                    } else {
                        return <Image resizeMode={'contain'} style={{width:30,height:30}} source={require('./assets/images/more.png')}
                        />
                    }
                }
                else if(routeName === 'Add_Property'){
                    if (focused) {
                        return <Image resizeMode={'contain'} style={{width: 40, height: 40,marginTop:18 }} source={require('./assets/images/plusred.png')}
                        />
                    } else {
                        return <Image resizeMode={'contain'} style={{width: 40, height: 40,marginTop:18 }} source={require('./assets/images/plus.png')}
                        />
                    }
                }
                else if(routeName === 'Profile'){
                    if (focused) {
                        return <Image resizeMode={'contain'} style={{width:30,height:30}} source={require('./assets/images/userred.png')}
                        />
                    } else {
                        return <Image resizeMode={'contain'} style={{width:30,height:30}} source={require('./assets/images/profile.png')}
                        />
                    }
                }


            },
        })
    }
);

const AppNavigator = createStackNavigator(
    {
        SplashScreen: SplashScreen,
        WelcomeScreen: WelcomeScreen,
        'MainBottomTab': MainBottomTab,
        SignInScreenPhone: SignInScreenPhone,
        SignInScreenEmail: SignInScreenEmail,
        ForgotPasswordEmail: ForgotPasswordEmail,
        ForgotPasswordPhone: ForgotPasswordPhone,
        CategoryAll:CategoryAll,
        Register:Register,
        FilterScreen: FilterScreen,
        PropertyDetailScreen: PropertyDetailScreen,
        IncorrectCode: IncorrectCode,
        CorrectCode: CorrectCode,
        ChangePassword: ChangePassword,
        ReservationCalender: ReservationCalender,
        EditProfile:EditProfile,
        PaymentPage: PaymentPage,
        DebitCard: DebitCard,
        Add: Add,
        EditPropertyScreen: EditPropertyScreen,
        NotificationScreen: NotificationScreen,
        CodeVerificationScreen: CodeVerificationScreen,
        MyProperty:MyProperty,
        Likes:Likes,
        AppFeedback:AppFeedback,
        Add_Property:Add_Property,
        AddHotel:AddHotel,
        AddFloors:AddFloors,
        AddRoom:AddRoom,
        FloorsScreen:FloorsScreen,
        RoomDetails:RoomDetails,
        ActivityDetailsScreen:ActivityDetailsScreen,
    },
    {
        initialRouteName: 'SplashScreen',
        headerMode: 'none',
    },
);
export default createAppContainer(AppNavigator);
