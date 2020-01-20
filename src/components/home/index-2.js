import React, { Component } from 'react';
import {
  Container,
  Header,
  Drawer,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Right,
  Left,
  Body,
  Title,
  H3,
  Card,
  CardItem,
  Thumbnail,
  Badge,
  Grid,
  Col,
 
} from 'native-base';

import {
  NativeRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-native';
import * as ROUTES from '../../constants/routes';

import { StyleSheet, View, TouchableOpacity,TouchableHighlight, Platform, StatusBar, AsyncStorage, Image, ImageBackground } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import { w, h, totalSize } from '../../api/Dimensions';
import SideBar from '../../components/navigation/sidebar';
import Geolocation from '@react-native-community/geolocation';
import { connect } from 'react-redux';
import * as firebase from 'firebase'
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';

const ASPECT_RATIO = w/h;
const LATITUDE =  -6.175392;
const LONGITUDE = 106.827153;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;
const uri = "https://i.pravatar.cc/150?img=52";
const top = require('../../assets/top-alt.jpg');



export default class HomePage extends Component {
   constructor(props) {
    super(props);		
	this.state = {
	flex: 0,
    isOnDefaultToggleSwitch: true,
    status: 'Online',
	badgeStatus: 'green',
	statusBarHeight: 28,
    error: null,
	loading: true,
	user:'',
	key:'',
	};
  }
   
  componentDidMount() {

	this.getToken();
	
  }	
  
  async getToken(user) {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
      console.log(data);
	  console.log(data.uid);
	  this.userData(data.uid);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  
  async userData(data) {
	  const ref = firebase.firestore().collection('drivers').doc(data);
  ref.get().then((doc) => {
    if (doc.exists) {
      this.setState({
        user: doc.data(),
        key: doc.id,
        loading: false
      });
	  this.storeToken(doc.data());
	  console.log(this.state);
    } else {
      console.log("No such document!");
    }
  });
  }
  
  async storeToken(user) {
    try {
       await AsyncStorage.setItem("driver", JSON.stringify(user));
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  
  onToggle(isOn) {
    console.log('Changed to ' + isOn);
    if (isOn == true) {
      this.setState({ status: 'Online', badgeStatus: 'green', radius: 200, });
    } else {
      this.setState({ status: 'Offline', badgeStatus: 'red', radius: 0, });
    }
  }
  
 renderstatusBar() {
	 console.log(StatusBar.currentHeight)
	 if(StatusBar.currentHeight <= 29) {
		 <StatusBar translucent backgroundColor="transparent" />	 
	 }
	else{
		<StatusBar translucent/>	  
	}	 
 }
  
  render() {
	
	const { statusBarHeight } = this.state 
    
	return (
	<Container>
	<Content>
	 <StatusBar translucent backgroundColor="transparent" />	 
     
        <Image source={top} style={styles.backgroundImage} />
		  <View style={{position: 'absolute'}}>	
			<Grid style={ styles.loginForm }>
				<Col>
					<Text style={styles.text}>Hai, {this.state.user.fullname}</Text>
					<Text style={styles.textTitle}>{this.state.user.mobile_phone}</Text>
					<Badge style={{ backgroundColor: this.state.badgeStatus }}><Text>{this.state.user.isActive}</Text></Badge>
				</Col>	
				<Col>
					 <Thumbnail large source={{uri: this.state.user.photoURI}} style={styles.avatar} />
				</Col>
			</Grid>
		  </View>	
		<Card style={styles.cardRounded}>
			<Card style={styles.cardInside}>
				<Grid style={styles.gridInside}>
					<Col style={styles.textInsideGrid}>
						<Text style={styles.subTitle}>Balance</Text>
						<Text style={styles.title}>Rp {this.state.user.balance}</Text>
					</Col>
					<Col style={styles.separator}>
					</Col>
					<Col style={styles.textInsideGrid}>
						<Text style={styles.subTitle}>Trip</Text>
						<Text style={styles.title}>{this.state.user.balance} Km</Text>
					</Col>
				</Grid>
			</Card>
		</Card>	
		
		<Grid style={styles.gridPosition}>
			<Col>
				<Card style={ styles.cardGrid}>
					<View style={styles.cardIcon}>
					<Icon type="MaterialCommunityIcons" active name="car-hatchback" style={{ fontSize:24, color:'white', marginLeft:w(2),top:h(1)}}/>
					</View>
					<Text style={styles.subTitle}>My Trip</Text>
				</Card>
			</Col>
			<Col>
				<Card style={ styles.cardGrid}>
					<View style={styles.cardIcon}>
					<Icon type="MaterialCommunityIcons" active name="wallet-outline" style={{ fontSize:24, color:'white', marginRight:w(2),top:h(1)}}/>
					</View>
					<Text style={styles.subTitle}>My Wallet</Text>
				</Card>
			</Col>
		</Grid>
		<Grid style={styles.nextgridPosition}>
			<Col>
				<Card style={ styles.cardGrid}>
					<View style={styles.cardIcon}>
					<Icon type="MaterialCommunityIcons" active name="car-hatchback" style={{ fontSize:24, color:'white', marginLeft:w(2),top:h(1)}}/>
					</View>
					<Text style={styles.subTitle}>Call Center</Text>
				</Card>
			</Col>
			<Col>
				<Card style={ styles.cardGrid}>
					<View style={styles.cardIcon}>
					<Icon type="MaterialCommunityIcons" active name="wallet-outline" style={{ fontSize:24, color:'white', marginRight:w(2),top:h(1)}}/>
					</View>
					<Text style={styles.subTitle}>Support</Text>
				</Card>
			</Col>
		</Grid>
		
		
		
		
	
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu lobortis elementum nibh tellus. Purus in mollis nunc sed id semper risus. Odio ut enim blandit volutpat maecenas volutpat blandit. Ac ut consequat semper viverra. Eu lobortis elementum nibh tellus molestie nunc non. Duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam. Mauris a diam maecenas sed enim ut sem viverra. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Consequat id porta nibh venenatis cras sed felis eget velit. Orci nulla pellentesque dignissim enim sit amet. Aliquam ut porttitor leo a diam sollicitudin tempor id. Curabitur vitae nunc sed velit dignissim sodales ut eu. Quis risus sed vulputate odio ut enim blandit. Tempor commodo ullamcorper a lacus. At urna condimentum mattis pellentesque id nibh tortor id aliquet.

Pellentesque habitant morbi tristique senectus. Tristique nulla aliquet enim tortor at. Ornare suspendisse sed nisi lacus sed. Diam donec adipiscing tristique risus nec feugiat. Porttitor lacus luctus accumsan tortor posuere. Mauris rhoncus aenean vel elit scelerisque. Nec ullamcorper sit amet risus nullam eget felis eget. Congue eu consequat ac felis donec. Blandit turpis cursus in hac habitasse. Convallis a cras semper auctor neque. Fames ac turpis egestas maecenas pharetra convallis. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Venenatis lectus magna fringilla urna.

Enim eu turpis egestas pretium aenean. Arcu bibendum at varius vel pharetra vel. Orci a scelerisque purus semper eget. Scelerisque eleifend donec pretium vulputate sapien. Nulla facilisi etiam dignissim diam quis enim lobortis. Sapien pellentesque habitant morbi tristique senectus et netus et malesuada. Duis at tellus at urna condimentum mattis pellentesque id. Non pulvinar neque laoreet suspendisse interdum consectetur libero id. Sed pulvinar proin gravida hendrerit. Lacus laoreet non curabitur gravida arcu ac tortor dignissim. Amet risus nullam eget felis eget nunc lobortis mattis.

Massa sapien faucibus et molestie ac feugiat. Nunc sed blandit libero volutpat sed cras ornare. Purus gravida quis blandit turpis cursus in hac. Vestibulum mattis ullamcorper velit sed. Scelerisque purus semper eget duis at tellus. Sagittis purus sit amet volutpat consequat. Non tellus orci ac auctor augue mauris augue neque. Felis donec et odio pellentesque diam volutpat commodo sed. At urna condimentum mattis pellentesque id. Euismod lacinia at quis risus sed. Risus nec feugiat in fermentum posuere. Elit pellentesque habitant morbi tristique senectus et netus. Malesuada fames ac turpis egestas integer eget aliquet. Vel orci porta non pulvinar neque. Ipsum nunc aliquet bibendum enim. Aliquet nibh praesent tristique magna sit amet purus gravida. Etiam non quam lacus suspendisse faucibus. Euismod quis viverra nibh cras pulvinar mattis. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam. Auctor eu augue ut lectus arcu bibendum.

Nam aliquam sem et tortor. Quis risus sed vulputate odio ut enim. Amet facilisis magna etiam tempor orci. Nam libero justo laoreet sit amet cursus sit amet. Est ullamcorper eget nulla facilisi etiam dignissim diam. Sapien faucibus et molestie ac feugiat sed lectus vestibulum. Fermentum leo vel orci porta non pulvinar neque laoreet. Porttitor lacus luctus accumsan tortor posuere. Pharetra massa massa ultricies mi quis hendrerit. Blandit turpis cursus in hac habitasse platea. Sit amet justo donec enim. Tincidunt tortor aliquam nulla facilisi cras. Sodales neque sodales ut etiam sit. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Quis lectus nulla at volutpat diam.
          </Text>
        </Content>
   	
    <Footer>
          <FooterTab style={{ backgroundColor:'white', }}>
            <Button vertical>
              <Icon name="home" />
              <Text>Beranda</Text>
            </Button>
            <Button vertical>
              <Icon name="camera" />
              <Text>Camera</Text>
            </Button>
            <Button vertical>
              <Icon active name="navigate" />
              <Text>Navigate</Text>
            </Button>
           
			<Link to={ROUTES.SIGNIN}>
			 <Button vertical>
              <Icon name="person" />
              <Text>Akun</Text>
			</Button>
			</Link>
          </FooterTab>
    </Footer>        
		
		
	</Container>
	 
    );
  }
}

var styles = StyleSheet.create({
   container: {
        flex: 1,
    },
	
	content: {
		borderWidth:1,
		borderRadius: 30,
	},
    backgroundImage: {
        //flex: 1,
        //resizeMode: 'cover', // or 'stretch'
		height: '10%',
		width: '100%'
    },
    loginForm: {
		backgroundColor: 'transparent',
		alignItems: 'center',
		position: 'absolute',
		width:w(100),
		height: h(25),
		marginLeft: 20,
		marginRight: 20
	},
	text: {
		fontSize: 22,
		fontWeight: 'bold',
		color: 'white',
	},
	textTitle: {
		fontSize: 14,
		color: 'white',
	},
	avatar: {
		 alignSelf: 'flex-end',  
		 marginRight: 50,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
	},
	subTitle: {
		fontSize: 14,
		color: '#f4f3f2',
		textAlign: 'center',
	},
	
	cardRounded: {
		position: 'absolute',
		marginLeft:'auto',
		marginRight: 'auto',
		top: h(20),
		width: w(100),
		height:h(60),
		borderRadius: 20,
	},
	cardInside: {
		height:h(12),
		borderRadius: 20,
		top:h(1),
		marginLeft: 10,
		marginRight: 10,
	},
	gridInside: {
		backgroundColor: '#37A000',
		borderRadius: 20,
	},
	textInsideGrid: {
		marginLeft:15,
		marginRight: 15,
		top: 20,
		textAlign: 'center',
	},
	separator: {
		borderColor:'#f2f2f2',
		borderWidth: 1,
		borderStyle: 'dashed',
		borderRadius: 1,
		height: h(8),
		position: 'absolute',
		left: '50%',
		//marginLeft: -3,
		
		top: 15,
	},
	gridPosition: {
		top: h(30),
		marginLeft: 5,
		marginRight: 5,
		marginTop:0,
		marginBottom: 0,
		position:'absolute',
		
	},
	nextgridPosition: {
		top: h(48),
		marginLeft: 5,
		marginRight: 5,
		marginTop:0,
		marginBottom: 0,
		position:'absolute',
		
	},
	cardGrid: {
		height: h(14),
		paddingLeft:w(5),
		paddingTop:h(2),
		borderRadius: 20,
		backgroundColor: '#A9E14B',
		marginTop:h(0),
		marginBottom:0,
		marginRight:w(2),
		marginLeft:w(2),
	    top:h(6)
	},
	cardIcon: {
		borderRadius: 38/2,
		height:38,
		width:38,
		backgroundColor: '#37A000',
	}
	
});


//export default connect(mapStateToProps)(HomePage);