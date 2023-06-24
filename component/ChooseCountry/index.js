import React, { useState, useRef, useEffect } from 'react'
import {

    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ImageBackground,
    Keyboard,
    Image,
    Switch,
    FlatList,
    PermissionsAndroid,
    StyleSheet,
    Modal,
    Pressable

} from 'react-native'
import { strings } from '../../i18n'
import color from '../AppColor'
// -------------------------------------

const ChooseCountry = (props) => {
    const [tab, setTab] = useState(1)
    const [radio, setRadio] = useState(false)
    const [loading, setLoading] = useState(false)
    const [getAppContacts, setGetAppContacts] = useState([])
    const [contactModal, setContactModal] = useState(false)
    const [isPhoneContacts, setIsPhoneContacts] = useState(false)
    const [contacts, setContacts] = useState([])
    const [total, setTotal] = useState([])
    const [selectedContacts, setSelectedContacts] = useState([])
    const [radioChecked, setRadioChecked] = useState(false)
    return (
        <Modal
            animationType='slide'
            visible={props.visible}
            transparent={true}>
            <View style={{ flex: 0.75, justifyContent: 'center', marginTop: "40%" }}>
                <View style={[styles.mainContainer, { height: '90%' }]}>
                    <View style={styles.tabBar}>
                        <TouchableOpacity style={styles.modalButtonStyle}
                            onPress={props.onChooseCountryPress}
                        >
                            <Text style={styles.modalText}>
                                {'Choose Country'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        width: '90%',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 60,
                    }}>
                        <Text style={[styles.modalText,{fontSize:20}]}>
                            {'LOGO FOR PROPERTY TYPE'}
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.hotelSelectionButton}
                        // onPress={() => {
                        //     setTab(2)
                        //     setIsPhoneContacts(true)
                        // }}
                        >
                            <Text style={styles.modalText}>
                                {'HOTEL & APARTMENT'}
                                {/* {strings('add_property_screen.furnished_appartments')} */}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hotelSelectionButton}
                        // onPress={() => {
                        //     setTab(2)
                        //     setIsPhoneContacts(true)
                        // }}
                        >
                            <Text style={styles.modalText}>
                                {strings('add_property_screen.summer_house')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hotelSelectionButton}
                        // onPress={() => {
                        //     setTab(2)
                        //     setIsPhoneContacts(true)
                        // }}
                        >
                            <Text style={styles.modalText}>
                                {strings('add_property_screen.camps')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        width: "90%",
                        alignSelf: 'center',
                        height: 70,
                        borderRadius: 10,
                        marginTop: 80,
                        flexDirection: 'row',
                        justifyContent: 'space-between'

                    }}>
                        <TouchableOpacity style={styles.checkinout}
                        // onPress={() => {
                        //     setTab(2)
                        //     setIsPhoneContacts(true)
                        // }}
                        >
                            <Text style={styles.modalText}>
                                {/* {'HOTEL & APARTMENT'} */}
                                {"Check In"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.checkinout}
                        // onPress={() => {
                        //     setTab(2)
                        //     setIsPhoneContacts(true)
                        // }}
                        >
                            <Text style={styles.modalText}>
                                {'Check Out'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tabBar}>
                        <TouchableOpacity style={styles.modalButtonStyle}
                        // onPress={() => {
                        //     setTab(2)
                        //     setIsPhoneContacts(true)
                        // }}
                        >
                            <Text style={styles.modalText}>
                                {'Choose date in case pool and kashta'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity style={styles.btnImg}>
                        <Text style={styles.btnText}>{'SAVE'}</Text>
                    </TouchableOpacity> */}

                </View>
            </View>
        </Modal>


    )
}

export default ChooseCountry

const styles = StyleSheet.create({
    flatListMainContainer: {
        height: 65,
        width: '100%',
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 10,
    },
    mainContainer: {
        width: '85%',
        alignSelf: 'center',
        opacity: 0.80,
        backgroundColor: 'darkgrey',
    },
    rowContainer: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    headingText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        padding: 5,
    },

    tabBar: {
        width: "90%",
        alignSelf: 'center',
        height: 50,
        borderRadius: 10,
        marginTop: 30,
        flexDirection: 'row',

    },
    btnImg: {
        width: '90%',
        height: 50,
        backgroundColor: 'red',
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 20,
        position: 'absolute',
        bottom: 10
    },
    modalText: {
        color: color.redHead,
        textAlign: 'center',
    },
    modalButtonStyle:{
        width: "100%",
        backgroundColor: 'lightgrey',
        height: "100%",
        justifyContent: 'center'
    },
    hotelSelectionButton:{
        width: "30%",
        backgroundColor: 'lightgrey',
        height: "100%",
        justifyContent: 'center'
    },
    checkinout:{
        width: "40%",
        backgroundColor: 'lightgrey',
        height: "100%",
        justifyContent: 'center'
    },
    buttonContainer:{
        width: "90%",
        alignSelf: 'center',
        height: 50,
        borderRadius: 10,
        // marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'

    }


})

