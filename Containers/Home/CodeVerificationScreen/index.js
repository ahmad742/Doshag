import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';


class index extends Component {
    render() {
        return (
            <>
                <LinearGradient colors={['#fbf4ed', '#fbf4ed']}
                    style={{
                        flex: 1,
                        paddingLeft: 15,
                        paddingRight: 15,
                        borderRadius: 5
                    }}>
                    <Text style={{
                        color: 'red',
                        textAlign: 'center',
                        marginTop: 90
                    }} >Message sent to</Text>
                    <Text style={{
                        textAlign: 'center',
                        marginTop: 5,
                        writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20
                    }} >03126560908</Text>

                    <View style={{
                        marginTop: 40
                    }} >
                        <Text>Enter Code</Text>
                        <TextInput secureTextEntry={true}
                            style={{
                                height: 50,
                                backgroundColor: 'white',
                                width: '97%',
                                borderColor: '#F2F0F1',
                                borderRadius: 5,
                                borderWidth: 2,
                                alignSelf: 'center',
                                marginTop: 15,
                                paddingLeft: 10
                            }} />
                    </View>

                    <View>
                        <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('IncorrectCode')}
                                
                        style={{
                            backgroundColor: '#9ea3a0',
                            height: 40,
                            width: '60%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            marginTop: 50,
                            marginBottom: 20,
                            borderRadius: 10,
                        }}>

                            <Text
                                style={{
                                    color: 'white',
                                    textAlign: 'center',

                                }} >Next</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{
                                textAlign: 'center',
                                color: '#9ea3a0'
                                
                            }} >Resend Verification Code?</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </>
        )
    }
}

export default index
