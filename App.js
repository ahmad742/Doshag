import React, { Component } from 'react';
import { StatusBar, SafeAreaView, View, StyleSheet, Alert, Linking, LogBox } from 'react-native';
import Routing from './Routing';
import Preference from 'react-native-preference';
import { firebase } from '@react-native-firebase/app';
import { NavigationActions } from 'react-navigation';
import { NativeBaseProvider} from "native-base";
StatusBar.setHidden(false);
//console.disableYellowBox = true;
LogBox.ignoreAllLogs(true)
import NotificationPopup from 'react-native-push-notification-popup';
import messaging from '@react-native-firebase/messaging';


let FCM_token = "";
messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);
function onMessageReceived(message) {
    console.log("MessageCloud: ", JSON.stringify(message))
}
const prefix = 'Doshag://';

export default class App extends Component {

    componentDidMount() {
        let currency = Preference.get('currency');
        // console.log("Country and Currency: ", Preference.get('country') + Preference.get('currency'))
        if (currency == undefined) {
            currency= Preference.get('country') === 'Saudi Arabia' ? 'SAR' : Preference.get('country') === 'Jordan' ? 'JOD' : 'BHD'
            Preference.set('currency', currency)
        } else { 
            Preference.set('currency', currency)
        }
        // console.log("Country and Currency: ", Preference.get('country') + Preference.get('currency'))
        // console.log('SetCurrency', Preference.get('currency'))
        // console.log('Selected Country', Preference.get('country'))

        this.requestUserPermission();
        this.onAppBootstrap();
        this.createNotificationListeners();

    }


    async createNotificationListeners() {
        messaging().onMessage(async remoteMessage => {
            const { data } = remoteMessage;
            this.onNotificationRecieve(data);
            console.log("GotNotification", "data: " + JSON.stringify(data))
            this.showNotification(remoteMessage.notification.title, remoteMessage.notification.body);
        });
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            const { data } = remoteMessage;
            this.onNotificationRecieve(data);

            console.log("GotNotification", "data: " + JSON.stringify(data))
            console.log("GotNotification", "data: " + remoteMessage)
            this.showNotification(remoteMessage.notification.title, remoteMessage.notification.body);

        });

    }
    requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
    }

    async onAppBootstrap() {
        console.log("gvhjkl;")
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log("fcmToken", "_---------------------------------->" + token);
        Preference.set("FCMToken", token)
    }
    showNotification(title, body) {

        if (this.popup) {
            this.popup.show({
                onPress: () => {
                },
                appIconSource: require('./assets/images/doshag_logo.png'),
                appTitle: 'Doshag',
                timeText: 'Now',
                title: title,
                body: body,
                slideOutTime: 5000
            });
        }
    }
    onNotificationRecieve = (data) => {
        console.log("onNotificationRecieve", data)
        if (data?.notification_type === "2" && data?.property_id) {
            if (this.navigator) {
                this.navigator.dispatch(
                    NavigationActions.navigate({
                        routeName: 'PropertyDetailScreen',
                        params: {
                            itemId: data.property_id,
                        }
                    })
                );
            }

        }
        else if (data?.notification_type === "3" && data?.property_id) {
            if (this.navigator) {
                this.navigator.dispatch(
                    NavigationActions.navigate({
                        routeName: 'PropertyDetailScreen',
                        params: {
                            itemId: data.property_id,
                        }
                    })
                );
            }

        }
        else if (data?.notification_type === "4" && data?.property_id) {
            if (this.navigator) {
                this.navigator.dispatch(
                    NavigationActions.navigate({
                        routeName: 'PropertyDetailScreen',
                        params: {
                            itemId: data.property_id,
                        }
                    })
                );
            }

        }
    }






    render() {

        return (
            <NativeBaseProvider>
            <SafeAreaView style={styles.container}>
                <Routing ref={ref => {
                    this.navigator = ref;
                }}
                    // uriPrefix={'Doshag://',prefix}
                    //uriPrefix={"https://app.wewa.life", "https://"}
                />
                <NotificationPopup ref={ref => this.popup = ref} style={{ zIndex: 99999 }} />
            </SafeAreaView>
            </NativeBaseProvider>
            // <SafeAreaView style={styles.container}>
            /* <View style={{}}> */
            // <StatusBar backgroundColor="#FFF2F2" barStyle="light-content"/>
            /* </View> */

            // </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
