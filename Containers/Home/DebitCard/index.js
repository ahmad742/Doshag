import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../../component/TopHeader/Header';
import LinearGradient from 'react-native-linear-gradient';
import {strings} from '../../../i18n';
import Preference from 'react-native-preference';

const lang = Preference.get('language');

class index extends Component {
  lefAction() {
    this.props.navigation.goBack();
  }
  render() {
    return (
      <>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('debit_card_screen.debit_card')}
          leftAction={this.lefAction.bind(this)}
          navigation={this.props.navigation}

        />
        <LinearGradient
          colors={['#fbf4ed', '#fbf4ed']}
          style={{
            flex: 1,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 5,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  marginTop: 50,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {strings('debit_card_screen.card_num')}
              </Text>
              <TextInput
                keyboardType="number-pad"
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  width: '95%',
                  borderColor: '#F2F0F1',
                  borderRadius: 5,
                  borderWidth: 2,
                  alignSelf: 'center',
                  marginTop: 15,
                  paddingLeft: 10,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}
              />

              <Text
                style={{
                  marginTop: 30,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {strings('debit_card_screen.name_on_card')}
              </Text>
              <TextInput
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  width: '95%',
                  borderColor: '#F2F0F1',
                  borderRadius: 5,
                  borderWidth: 2,
                  alignSelf: 'center',
                  marginTop: 15,
                  paddingLeft: 10,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}
              />

              <Text
                style={{
                  marginTop: 30,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {strings('debit_card_screen.expiration')}
              </Text>
              <TextInput
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  width: '95%',
                  borderColor: '#F2F0F1',
                  borderRadius: 5,
                  borderWidth: 2,
                  alignSelf: 'center',
                  marginTop: 15,
                  paddingLeft: 10,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}
              />

              <Text
                style={{
                  marginTop: 30,
                  marginLeft: 5,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}>
                {strings('debit_card_screen.digit')}
              </Text>
              <TextInput
                maxLength={3}
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  width: '95%',
                  borderColor: '#F2F0F1',
                  borderRadius: 5,
                  borderWidth: 2,
                  alignSelf: 'center',
                  marginTop: 15,
                  paddingLeft: 10,
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                }}
              />

              <TouchableOpacity
              onPress={()=>{this.props.navigation.navigate('Activities');}}
                style={{
                  backgroundColor: '#B20C11',
                  height: 40,
                  width: '60%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginTop: 80,
                  marginBottom: 20,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}>
                {strings('debit_card_screen.pay_now')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </>
    );
  }
}

export default index;
