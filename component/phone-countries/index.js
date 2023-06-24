import React, {Component} from 'react';
import {View, FlatList,TouchableOpacity,Text} from 'react-native';
import countries from '../../assets/phone-countries/countries-emoji.json'
import nodeEmoji from 'node-emoji';
import moment from 'moment';

const listOfContries = Object.values(countries)

export default class Countries extends Component {
    state = {
       countryName:"",
       countryCode:"",
      };
  render() {
    return (
        <View>
        <FlatList
          data={listOfContries}
          keyExtractor={(item) => item.flag}
          listKey={moment().format('x').toString()}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{marginBottom: 20}}
          extraData={this.state}
          contentContainerStyle={{width: '100%'}}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#00000020',
              }}
            />
          )}
          style={{width: '100%'}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingVertical: 15,
                  paddingHorizontal: 5,
                }}
                onPress={()=>{this.setState({countryName:item.flag,countryCode:item.callingCode[0]})}}>
                
                <Text style={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 22}}>
                  {nodeEmoji.get(item.flag)}
                </Text>
                <View style={{flex: 1, marginHorizontal: 5}}>
                  <Text style={{color: 'black', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 22}}>
                    {item.name.common}
                  </Text>
                </View>
                <Text style={{color: 'black', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 22}}>
                  {'+' + item.callingCode[0]}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}
