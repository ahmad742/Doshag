import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Header from '../../../component/TopHeader/Header';
import color from '../../../component/AppColor';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
import {strings} from '../../../i18n';
import Preference from 'react-native-preference';
const lang = Preference.get('language');

export default class Likes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      likesList: [
        // {
        //   image: require('../../../assets/images/img.png'),
        //   name: 'Chalet Name',
        // },
        // {
        //   image: require('../../../assets/images/img.png'),
        //   name: 'Chalet Name',
        // },
        // {
        //   image: require('../../../assets/images/img.png'),
        //   name: 'Chalet Name',
        // },
        // {
        //   image: require('../../../assets/images/img.png'),
        //   name: 'Chalet Name',
        // },
      ],
    };
  }
  componentDidMount() {
    this.get();
  }

  get() {
    this.setState({loading: true});
    Api.likes()
      .then(
        function (response) {
          //console.log('LikesApiDataResponse: ', JSON.stringify(response.data));
          this.setState({
            loading: false,
            likesList: response.data,
          });
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({loading: false});
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  }

  renderItem(item) {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('PropertyDetailScreen', {
              itemId: item.id,
            })
          }
          style={styles.mainContainer}>
          <Image
            style={styles.imagSty}
            source={
              item.photo != null
                ? {
                    uri:
                      'https://doshag.net/admin/public/images/property_images/' +
                      item.photo,
                  }
                : require('../../../assets/images/img.png')
            }
            resizeMode="cover"
          />
          <View style={{width: '60%'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                marginStart: 20,
                marginEnd: 10,
              }}>
              <Text style={{width: '70%', writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16}}>
                {lang == 'en' ? item.eng_name : item.arabic_name}
              </Text>
              <Image
                source={require('../../../assets/images/heart.png')}
                resizeMode={'contain'}
                style={{marginStart: 10, width: 20, height: 20}}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flex: 1,
                padding: 10,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <AirbnbRating
                  count={5}
                  defaultRating={item.property_rating}
                  showRating={false}
                  type="custom"
                  reviewSize={0}
                  size={15}
                  isDisabled={true}
                />
                <Text style={{color: color.fontColor, writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 12}}>
                  {'(' + item.rated_person + ')'}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: color.yellowColor,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 18,
                  }}>
                  {Preference.get('currency')+" " + item.price}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  lefAction() {
    this.props.navigation.goBack();
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('likes_screen.likes')}
          // leftMargin={-20}
          leftAction={this.lefAction.bind(this)}
          navigation={this.props.navigation}
        />
        <ScrollView
          contentContainerStyle={{flexGrow: 1, backgroundColor: '#fbf4ed'}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {this.state.likesList.length > 0 ? (
            <View style={styles.mainListContainer}>
              <FlatList
                data={this.state.likesList}
                renderItem={({item, index}) => this.renderItem(item)}
                extraData={this.state}
                keyExtractor={(item) => item.id}
              />
            </View>
          ) : (
            <View style={styles.mainListContainer}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20, fontWeight: 'bold'}}>
                  {strings('likes_screen.no_property_liked')}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
        {this.state.loading && <Loader />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  mainContainer: {
    marginStart: 10,
    marginEnd: 10,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: color.graylightBorder,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  imagSty: {
    width: '40%',
    height: 150,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 10,
    resizeMode: 'cover',
  },
  mainListContainer: {
    flex: 1,
    // margin: 10,
  },
});
