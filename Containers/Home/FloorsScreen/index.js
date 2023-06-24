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

} from 'react-native';
import AppColor from '../../../component/AppColor';
import Header from '../../../component/TopHeader/Header';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
export default class FloorsScreen extends Component {

    constructor(props) {
        super(props);
        const floorNumber = props?.navigation?.getParam("floorNumber")
        const propertyID = props?.navigation?.getParam("propertyID")
        const floorID = props?.navigation?.getParam("floorID")
        const roomId = props?.navigation?.getParam("roomId")
        console.log("floorID : ", floorID);
        // console.log("propertyID : ", propertyID);
        // console.log("roomId : ", roomId);
        this.state = {
            floorno: props?.navigation?.getParam("floorNumber"),
            fID:props?.navigation?.getParam("floorID"),
            PID:props?.navigation?.getParam("propertyID"),
            roomID:props?.navigation?.getParam("roomId"),
            loading: false,
        }

    };
    getRoom = async () => {

        const formData = new FormData();

        formData.append('id', this.state.fID);

        console.log("Body Formn Data get all apartment ---???>>>", formData);
        this.setState({ loading: true });
        try {
            const response = await Api.all_room(formData)
            // console.log("all_apart-response.status", response)
            if (response.status == 200) {
                console.log('get_room  APIResponse: ', JSON.stringify(response));
            }
        } catch (error) {
            console.log("get_room-error", error)
        }
        finally {
            this.setState({ loading: false });
        }
    };
    componentDidMount() {
        this.getRoom()
    }

    render() {
        return (
            <>
                <Header
                    leftIcon={require('../../../assets/images/back.png')}
                    headerText={`Floor No. ${this.state.floorno}`}
                    navigation={this.props.navigation}
                    rightIcon={require('../../../assets/images/plus.png')}
                    rightAction={() => this.props.navigation.navigate('AddRoom',{
                        Flid:this.state.fID,
                        PropID:this.state.PID
                    })}
                    leftAction={() => this.props.navigation.goBack()}
                />
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    flex: 1
                }}>
                    <Text style={{ color: 'black', fontSize: 18, fontWeight: '500', marginLeft: 10 }}>
                        {'You have not added any room yet!'}
                    </Text>
                </View>
                {/* <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('AddRoom')} 
                    style={styles.mainFlatlistContainer}>
                    <Text style={{ color: 'black', fontSize: 18, fontWeight: '500', marginLeft: 10 }}>
                        {'First Floor'}
                    </Text>
                </TouchableOpacity> */}
{this.state.loading && <Loader />}
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
    }
});


