import React, { Component ,useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Header from '../../../component/TopHeader/Header';
import color from '../../../component/AppColor';
import { AirbnbRating } from 'react-native-ratings';
import DropDownPicker from 'react-native-dropdown-picker';
import Api from '../../../network/Api';
import Loader from '../../../component/Loader/Loader';
import { strings } from '../../../i18n';
import Preference from 'react-native-preference';

let country = [
  {
    value: 'Good',
  },
  {
    value: 'Bad',
  },
  {
    value: 'Normal',
  },
];
const lang = Preference.get('language');
export default class AppFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      count: '',
      city: '',
      comment: '',
      feedbackTypeOpen: false
    };
  }
  lefAction() {
    this.props.navigation.goBack();
  }
  inputcheck() {
    if (this.state.count === '') {
      alert(strings('app_feedback_screen.rating_first'));
    } else if (this.state.city === '') {
      alert(strings('app_feedback_screen.enter_feedback_type'));
    } else if (this.state.comment === '') {
      alert(strings('app_feedback_screen.leave_a_comment'));
      console.log('state of city===>',this.state.city)
    } else {
      this.appFeedback();
    }
  }

  setFeedbackTypeOpen = () => {
    this.setState({ feedbackTypeOpen: !this.state.feedbackTypeOpen })

  }

  appFeedback() {
    this.setState({ loading: true });
    let body = new FormData();
    body.append('rating', this.state.count);
    body.append('type', this.state.city);
    body.append('description', this.state.comment);

    //console.log('BodyData', body);
    Api.appFeedback(body)
      .then(
        function (response) {
          //console.log('RegisterAPIResponse: ', JSON.stringify(response));
          this.setState({
            loading: false,
            count: '',
            city: '',
            comment: '',
          });
          this.props.navigation.navigate('MainBottomTab');
          Alert.alert(
            strings('activities_screen.alert'),
            strings('app_feedback_screen.thanks_for_feedback'),
            [
              {
                text: strings('add_property_screen.ok'),
              },
            ],
          );
        }.bind(this),
      )
      .catch(
        function (error) {
          Alert.alert('Error', 'Check your internet!', [
            {
              text: strings('add_property_screen.ok'),
            },
          ]);
        }.bind(this),
      );
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          headerText={strings('app_feedback_screen.give_app_feedback')}
          leftAction={this.lefAction.bind(this)}
          navigation={this.props.navigation}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          // keyboardVerticalOffset={Platform.OS === 'ios' ? 54 : 0}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 20,
                  // marginTop: 40,
                  width: '50%',
                  textAlign: 'center',
                  marginBottom: 20,
                }}>
                {strings('app_feedback_screen.how_rate_our_app')}
              </Text>
              <AirbnbRating
                count={5}
                defaultRating={0}
                onFinishRating={(rating) => this.setState({ count: rating })}
                showRating={false}
                // type="custom"
                reviewSize={0}
                size={30}
                starContainerStyle={{ ratingBackgroundColor: 'black' }}
              />

              <DropDownPicker
                setOpen={() => { this.setFeedbackTypeOpen() }}
                open={this.state.feedbackTypeOpen}
               onSelectItem={(item) => {
                  console.log('feedbackTypeOpen: ', JSON.stringify(item.value))
                  this.setState({
                    city: item.value,
                  })
                 
                }}
                items={
                  lang == 'en'
                    ? [
                      { label: 'Good', value: 'good' },
                      { label: 'Normal', value: 'normal' },
                      { label: 'Bad', value: 'bad' },
                    ]
                    : [
                      { label: 'ممتاز', value: 'good' },
                      { label: 'جيد', value: 'normal' },
                      { label: 'سيئ', value: 'bad' },
                    ]
                }
                containerStyle={{
                  height: 50,
                  width: '80%',
                  marginBottom: 10,
                  alignSelf: 'center',
                  marginTop: 30,
                }}
                style={{
                  backgroundColor: 'white',
                  borderWidth: 0.5,
                  borderColor: '#999999',
                  borderRadius: 10,
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                  writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16,
                }}
                dropDownStyle={{ backgroundColor: 'white' }}
                // onChangeItem={() =>}
                placeholder={this.state.city==""?strings('app_feedback_screen.feedback_type'):this.state.city}
                placeholderStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: '#979191' }}
                selectedLabelStyle={{ writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize: 16, color: 'black' }}
                showArrow={false}
              />

              <View></View>
              <View
                style={{
                  width: '80%',
                  // height: 130,
                  marginTop: 20,
                  backgroundColor: 'white',
                  borderWidth: 0.5,
                  borderColor: '#999999',
                  borderRadius: 10,
                }}>
                <TextInput
                  onChangeText={(text) => this.setState({ comment: text })}
                  placeholder={strings('app_feedback_screen.leave_comment')}
                  multiline={true}
                  style={{
                    width: '100%',
                    // minHeight: 35,
                    height: 120,
                     textAlignVertical: 'top',
                    textAlign: lang == 'en' ? 'left' : 'right',
                    paddingHorizontal: 10,
                    paddingTop: 10,
                    
                    paddingBottom: 0,
                    writingDirection: lang == 'en' ? 'ltr' : 'rtl',
                  }}
                />
              </View>
              <TouchableOpacity
                // onPress={() => {
                //   Linking.openURL('https://play.google.com/store/apps?hl=en');
                // }}
                onPress={() => this.inputcheck()}
                style={{
                  marginTop: 30,
                  width: 180,
                  height: 50,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: color.redHead,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: color.redHead,
                }}>
                <Text style={{ color: 'white', writingDirection: lang == 'en' ? 'ltr' : 'rtl', }}>
                  {strings('app_feedback_screen.send_feedback')}
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.loading && <Loader />}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: "#fbf4ed",
  },
});
