import ReactNative from 'react-native';
import Preference from 'react-native-preference';
import I18n from 'react-native-i18n';


// Import all locales
import en from '../locales/en.json';
import ar from '../locales/ar.json';
// import DeviceInfo from 'react-native-device-info';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
    ar,
    en,
};

const currentLocale = I18n.currentLocale();

if (Preference.get('language') == undefined) {
    I18n.locale = 'en';
    Preference.set('language', 'en');
    ////console.log('SelectedLanguage1--inside i18n' + deviceLocale);
} else {
    I18n.locale = Preference.get('language');
    //console.log('SelectedLanguage1--inside i18n' + Preference.get('language'));
}

//export const isRTL = currentLocale.indexOf('en') === 0 || currentLocale.indexOf('ar') === -1;
//console.log('en', currentLocale.indexOf('en'));
//console.log('ar', currentLocale.indexOf('ar'));

//console.log('LanguageSelected ===' + Preference.get('language'));

console.log(ReactNative.I18nManager.isRTL);
console.log(Preference.get('language'));
if (Preference.get('language') == 'ar') {
    ReactNative.I18nManager.forceRTL(true);
    //console.log('ar', ReactNative.I18nManager.isRTL)
    /* this.state.locale */;


    /*  alert(this.state.locale) */
    /* this.setState({locale:'ar'}) */
    /*  alert(this.state.locale) */
    //ReactNative.I18nManager.forceRTL(true);

} else if (Preference.get('language') == 'en') {
    ReactNative.I18nManager.forceRTL(false);
    //console.log('en', ReactNative.I18nManager.isRTL);

    /*  alert(this.state.locale) */
    /*   alert(this.state.locale) */
    /* this.setState({locale:'en'}) */
}

/* if (ReactNative.I18nManager.isRTL==true &&Preference.get('language') == "ar") {
    ReactNative.I18nManager.forceRTL(false);
} else if(ReactNative.I18nManager.isRTL==false &&Preference.get('language') == "en") {
    ReactNative.I18nManager.forceRTL(true);
}
else if(ReactNative.I18nManager.isRTL){
    ReactNative.I18nManager.forceRTL(false);
    RNRestart.Restart();
} */

// if(Preference.get("language")==undefined){
//     Preference.set("language","en")
// }
// else if(Preference.get("language")=="en")
// {
//     ReactNative.I18nManager.forceRTL(true);
//    /*  alert(Preference.get("language")) */
//      I18n.locale = Preference.get("language");
// }else
// {
//     ReactNative.I18nManager.forceRTL(false);
//     I18n.locale = Preference.get("language");
// }
// if(Preference.get("language")==undefined){
//     Preference.set("language","en")
// }
// else
// if(currentLocale.indexOf('en') === 1)
// {
//     ReactNative.I18nManager.forceRTL(false);
/*  alert(Preference.get("language"))
  I18n.locale =  Preference.get("language"); */
// }
// else if(currentLocale.indexOf('ar') === 0)
// {
//     ReactNative.I18nManager.forceRTL(true);
//     I18n.locale = Preference.get("language");
// }

// Allow RTL alignment in RTL languages
// ReactNative.I18nManager.allowRTL(true);
// ReactNative.I18nManager.forceRTL(false);
// I18n.locale = Preference.get("language");
// The method we'll use instead of a regular string
export function strings(name, params = {}) {
    /* //console.log('i18 is called')
    console.log("DevicesLocale=", JSON.stringify(params)) */
    return I18n.t(name, params);
};

export default I18n;
