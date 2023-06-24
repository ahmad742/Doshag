/*
TextaAlt-Black
TextaAlt-Bold
TextaAlt-BlackIt
TextaAlt-Heavy
TextaAlt-Regular
Texta-ThintIt
Texta-Medium
Texta-MediumIt
Texta-Bold
Texta-Light
Texta-LightIt
Texta-BoldIt
Texta-Thin
Texta-Regular
Texta-It
Texta-HeavyIt
Texta-Book
Texta-BookIt
Texta-BlackIt

*/

import { Platform } from "react-native";

const DEFAULT = {
    PoppinsMedium: 'PingFangHK-Medium',
    PoppinsRegular: 'PingFangHK-Regular',
    RalewaySemiBold: 'Rockwell-Bold',
    RobotMedium: 'Rockwell-Bold',
    RobotRegular: 'Rockwell-Regular',
    etab: 'Rockwell-Regular'
}

const FONT_ANDROID = {

    PoppinsMedium: 'Poppins-Medium',  
    PoppinsRegular: 'Poppins-Regular',
    RalewaySemiBold: 'Raleway-SemiBold',
    RobotMedium: 'Roboto-Medium',
    RobotRegular: 'Roboto-Regular',
    etab: 'etab'
}

const AppFonts = Platform.select({
    ios: DEFAULT,
    android:  FONT_ANDROID
})

export default AppFonts