import React, {Component} from "react";
import {
    View,
    Dimensions,
    Image,
    StyleSheet,Text,
    TouchableOpacity
} from "react-native";
const {height, width} = Dimensions.get("window");
import Preference from 'react-native-preference';
import color from '../../component/AppColor'
import AppFonts from '../../assets/fonts/index';
const lang = Preference.get('language');
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
      rotate: '0deg',
        }
    }
    componentDidMount() {
        const {navigation} = this.props;
        this.focusListener = navigation.addListener('willFocus', () => {
            this.rotation();
        })
      }
      rotation = () => {
        if (Preference.get('language') == 'en') {
          this.setState({rotate: '0deg'});
        } else {
          this.setState({rotate: '180deg'});
        }
      };
    render() {
        
        let rotateBack = this.state.rotate;
        this.props.bgIcon
        return (
            <View style={[styles.mainContainer,this.props.Container]}>
                {/* {(this.props.leftIcon != null && this.props.leftIcon != undefined) && */}
                <TouchableOpacity
                    style={styles.headerLeftImageStyle}
                    onPress={()=>{
                        if(typeof this.props.leftAction == 'function')
                            this.props.leftAction();
                    }}>
                    <Image
                        style={[styles.imageStyle,{transform: [{rotate: rotateBack}]
                    }]}
                        source={this.props.leftIcon}
                    />
                </TouchableOpacity>  
                {/* } */}
                <View style={[styles.textContainer,this.props.titleview]}>
                    <Text style={[styles.textStyle,{marginLeft:this.props.leftMargin,writingDirection: lang == 'en' ? 'ltr' : 'rtl', fontSize:18,fontFamily:AppFonts.PoppinsRegular},this.props.textStyle]} numberOfLines={this.props.numberOfLines}>{this.props.headerText}</Text>
                </View>
                {/* {(this.props.rightIcon != null && this.props.rightIcon != undefined) && */}
                <TouchableOpacity
                    style={styles.headerRightImageStyle}
                    onPress={()=>{
                        if(typeof this.props.rightAction == 'function')
                            this.props.rightAction();
                    }}>
                    <Image
                        style={styles.imageStyle}
                        source={this.props.rightIcon}
                    />
                </TouchableOpacity>
                {/* } */}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        height: 60,
        width: "100%",
        flexDirection: 'row',
        backgroundColor: color.redHead,
        alignItems: 'flex-end',
        // paddingBottom:15,
        // paddingHorizontal:15,
        borderBottomColor:color.redHead,
        borderBottomWidth:.7,
    },
    textContainer:{
        // flex:1,
        width:"70%",
        height: '100%',
        // width:"90%",
        alignItems: 'center',
        justifyContent:'flex-end',
        padding:15
    },
    headerLeftImageStyle:{
        width:"15%",
        height:'100%',
        justifyContent:'flex-end',
        padding:15,

        // backgroundColor:"pink"
    },
    headerRightImageStyle:{
        width:"15%",
        height:'100%',
        justifyContent:"flex-end",
        padding:15,
        // backgroundColor:"yellow"
    },
    imageStyle:{
        resizeMode: 'contain',
        width: 20,
        height: 20,
    },
    textStyle:{
        color: 'white',
    },
});
