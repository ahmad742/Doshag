import React, { Component } from 'react';
import {
    View,
    Image,
    Modal,
    StyleSheet,
    TextInput,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Platform,
    Alert,
    Button,
    Dimensions,
    Pressable

} from 'react-native';
import AppColor from '../../../component/AppColor';
import Header from '../../../component/TopHeader/Header';
import Preference from 'react-native-preference';
import AppFonts from '../../../assets/fonts';
import Loader from '../../../component/Loader/Loader';
import Api from '../../../network/Api';
const lang = Preference.get('language');
export default class AddHotel extends Component {

    constructor(props) {
        super(props);
        const AddHotelResponse = props?.navigation?.getParam("AddHotelResponse")
        const hotelId = props?.navigation?.getParam("hotelId")
        const noOfRooms = props?.navigation?.getParam("noOfRooms")
        console.log("noOfRooms ----->>>>", noOfRooms);
        console.log("no of floors ----->>>>", AddHotelResponse);
        console.log("noOfRooms ----->>>>", noOfRooms);
        this.state = {
            hotelResponse: props?.navigation?.getParam("AddHotelResponse"),
            hotelFloors: [],
            numOfFloor: props?.navigation?.getParam("AddHotelResponse"),
            modalVisible: false,
            noOfRoom: '',
            floorNo: '',
            hotelID: props?.navigation?.getParam("hotelId"),
            loading: false,
            floorID: '',
            allFloors: '',
            TotalRoomsNo: props?.navigation?.getParam("noOfRooms"),
            addNewFloorRooms: ''

        }
    };

    addAllFloors = async () => {
        this.floorSet()
    }
    floorSet() {
        let addFloors = [];
        for (let i = 0; i < this.state.numOfFloor; i++) {
            addFloors.push({
                floorNumber: i + 1,
                apparments: 0
            })
        }
        this.setState({ hotelFloors: addFloors }, () => {
        })
    }

    add_floor = async () => {

        const formData = new FormData();

        formData.append('property_id', this.state.hotelID,);
        formData.append('name', this.state.floorNo);
        formData.append('total_rooms', this.state.noOfRoom);

        console.log("Body Formn Data add_floor ---???>>>", formData);
        this.setState({ loading: true });
        try {
            const response = await Api.add_apartment(formData)
            console.log("add_apartment-response.status", response.floor.no_of_rooms)
            if (response.status == 200) {
                console.log('Add apartment APIResponse: ', JSON.stringify(response.floor.id));
                this.setState({
                    floorID: response.floor.id,
                    addNewFloorRooms: response.floor.no_of_rooms
                })
                this.checkTotalRoom()
                console.log("addNewFloorRooms   -----   ", this.state.addNewFloorRooms);
                this.all_floor()
                this.setState({
                    noOfRoom: null,
                    floorNo: null
                })
            }
        } catch (error) {
            console.log("add_Property-error", error)
        }
        finally {
            this.setState({ loading: false });
        }
    };
    all_floor = async () => {

        const formData = new FormData();

        formData.append('id', this.state.hotelID);

        console.log("Body Formn Data get all apartment ---???>>>", formData);
        this.setState({ loading: true });
        try {
            const response = await Api.all_apart(formData)
            // console.log("all_apart-response.status", response)
            if (response.status == 200) {
                console.log('all_apart  APIResponse: ', JSON.stringify(response.floor));
                this.setState({ allFloors: response.floor })
            }
        } catch (error) {
            console.log("all_apart-error", error)
        }
        finally {
            this.setState({ loading: false });
        }
    };
    componentDidMount() {
        this.addAllFloors()
        this.all_floor()
    }

    checkTotalRoom() {
        let checkTotal = 0
        checkTotal = checkTotal + this.state.addNewFloorRooms
        console.log("check total rooms", checkTotal)
    }

    renderItem(item) {
        console.log("item ==>>",item);      
        return (
            <>
                {
                    this.state.allFloors.length != 0 ?
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('FloorsScreen', { 
                                floorNumber: item.name,
                                propertyID:this.state.hotelID,
                                floorID:item?.id
                            })}
                            style={styles.mainFlatlistContainer}>
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: '500', marginLeft: 10 }}>
                                {`Floor No ${item?.name}`}
                            </Text>
                        </TouchableOpacity>
                        :
                        <Text style={{ justifyContent: "center", alignItems: 'center', fontSize: 20, fontWeight: '700', color: 'black' }}>
                            {'No Floors found'}
                        </Text>
                }
            </>
        )
    }
    listEmptyRenderItem() {
        return (
            <View style={{ justifyContent: "center", alignItems: 'center', width: '100%', }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: 'black', }}>
                    {'No Floors found'}
                </Text>
            </View>
        )
    }
    render() {
        let hotels = this.state.hotelFloors
        const { modalVisible } = this.state;
        return (
            <>
                <Header
                    leftIcon={require('../../../assets/images/back.png')}
                    headerText={'Add Floors'}
                    navigation={this.props.navigation}
                    rightIcon={require('../../../assets/images/plus.png')}
                    rightAction={() => this.setState({ modalVisible: true })}
                    leftAction={() => { this.props.navigation.goBack() }}
                />
                {/* <ScrollView style={{ marginBottom: 30 }}> */}
                {/* {
                        this.state.hotelFloors.length > 0 ?
                            this.state.hotelFloors.map((item, index) =>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('FloorsScreen', { floorNumber: item.floorNumber })}
                                    style={styles.mainFlatlistContainer}>
                                    <Text style={{ color: 'black', fontSize: 18, fontWeight: '500', marginLeft: 10 }}>
                                        {`Floor No ${item.floorNumber}`}
                                    </Text>
                                </TouchableOpacity>
                            )

                            :
                            <Text>
                                {'No floors to show'}
                            </Text>
                    } */}
                <FlatList

                    data={this.state.allFloors}
                    renderItem={({ item, index }) => this.renderItem(item)}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => this.listEmptyRenderItem()}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        this.setState({ modalVisible: !modalVisible });
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                onPress={() => this.setState({ modalVisible: !modalVisible })}
                                style={{
                                    width: '100%',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center'
                                }}>
                                <Image style={{
                                    width: 20, height: 20, tintColor: AppColor.redHead
                                }} source={require('../../../assets/images/close.png')} />
                            </TouchableOpacity>
                            <View
                                style={{
                                    flex: 1,
                                }}>
                                <Text
                                    style={{
                                        marginTop: 15,
                                        marginLeft: 5,
                                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                        fontFamily: AppFonts.PoppinsRegular,
                                    }}>
                                    {'No. of Rooms'}
                                    {/* {strings('add_property_screen.name_english')} */}
                                </Text>
                                <TextInput
                                    placeholderTextColor="#979191"
                                    placeholder={'Enter no. of Rooms'}
                                    value={this.state.noOfRoom}
                                    onChangeText={(text) =>
                                        this.setState({
                                            noOfRoom: text,
                                        })
                                    }
                                    style={{
                                        height: 50,
                                        backgroundColor: 'white',
                                        width: '95%',
                                        borderColor: '#999999',
                                        borderRadius: 5,
                                        borderWidth: 0.5,
                                        alignSelf: 'center',
                                        marginTop: 10,
                                        paddingLeft: 10,
                                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                                    }}
                                />
                                <Text
                                    style={{
                                        marginTop: 15,
                                        marginLeft: 5,
                                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 14,
                                        fontFamily: AppFonts.PoppinsRegular,
                                    }}>
                                    {'Enter Floor No.'}
                                </Text>
                                <TextInput
                                    placeholderTextColor="#979191"
                                    placeholder={'Enter Floor'}
                                    value={this.state.floorNo}
                                    onChangeText={(text) =>
                                        this.setState({
                                            floorNo: text,
                                        })
                                    }
                                    style={{
                                        height: 50,
                                        backgroundColor: 'white',
                                        width: '95%',
                                        borderColor: '#999999',
                                        borderRadius: 5,
                                        borderWidth: 0.5,
                                        alignSelf: 'center',
                                        marginTop: 10,
                                        paddingLeft: 10,
                                        writingDirection: lang == 'en' ? 'ltr' : 'rtl'
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.add_floor()
                                    this.setState({ modalVisible: !modalVisible })
                                }}
                                style={{
                                    backgroundColor: '#B20C11',
                                    height: 40,
                                    width: '60%',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    marginTop: 10,
                                    marginBottom: 20,
                                    borderRadius: 10,
                                }}>
                                <Text
                                    style={{
                                        color: 'white',
                                        textAlign: 'center',
                                    }}>
                                    {'Add Floor'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {this.state.loading && <Loader />}
                {/* </ScrollView> */}
            </>
        );
    }
}

const styles = StyleSheet.create({
    mainFlatlistContainer: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: AppColor.DarkGray,
        height: 50,
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        marginTop: 20
    },
    listView: {
        width: '100%',
        height: '50%',
        backgroundColor: 'yellow'
    },
    modalView: {
        margin: 20,
        backgroundColor: AppColor.graylightBorder,
        borderRadius: 20,
        padding: 35,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        height: "50%"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});


