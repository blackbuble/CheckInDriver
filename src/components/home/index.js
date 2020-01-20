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
  ListItem,
 
} from 'native-base';

import { StyleSheet, View, TouchableOpacity,TouchableHighlight, Platform, StatusBar, AsyncStorage, Image, ImageBackground, ScrollView,Alert,List, ActivityIndicator } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { w, h, totalSize } from '../../api/Dimensions';
import { connect } from 'react-redux'
import Firebase from '../../../config/Firebase'
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';

/* const numberFormat = (value) =>
  new Intl.NumberFormat('en-ID', {
    //style: 'currency',
    //currency: 'IDR'
  }).format(value);
 */
function convertToRupiah(angka)
{
	var rupiah = '';		
	var angkarev = angka.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}

class HomePage extends Component {
   constructor(props) {
    super(props);		
	//this.ref = Firebase.firestore().collection('orders').where('status','==','Open').where('start_date', '==', new Date().getTime());
	//this.ref = Firebase.firestore().collection('orders').where('status','==','Open').where('area', '==',this.props.user.working_area);
	this.unsubscribe = null;
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
	orders: [],
	
	};
  }
  
  onCollectionUpdate = (querySnapshot) => {
  const orders = [];
  querySnapshot.forEach((doc) => {
    const { pick_up_location, route, start_date, end_date,fullname,driverPaid } = doc.data();
    orders.push({
      key: doc.id,
      doc, // DocumentSnapshot
      pick_up_location,
      route,
      start_date,
	  end_date,
	  fullname,
	  driverPaid
    });
  });
  this.setState({
    orders,
    isLoading: false,
 });
 console.log(this.state)
}
   
  componentDidMount() {
	  if(this.props.user.isActive == true){
	 this.ref = Firebase.firestore().collection('orders').where('status','==','Open');
	 this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
	 let userID = Firebase.auth().currentUser.uid; 
	 this.setState({userID: userID})
	 console.log(this.props.user.uid)
	 console.log("Here user id from home", userID)
	  }
  }	
  
  orderTaken = uid => {
	  console.log(uid)
	  Firebase.firestore().collection('orders').doc(uid)
	  .update({driver:this.props.user.fullname,driverID: this.state.userID,status:'Assign'})
	  .then( (data)=> {
		  alert('Selamat anda telah mengambil Order ')
	  })
	  .catch(function(error) {
        console.log("Error update document: ", error);
    });
  }
  
  onToggle(isOn) {
    console.log('Changed to ' + isOn);
    if (isOn == true) {
      this.setState({ status: 'Online', badgeStatus: 'green', radius: 200, });
    } else {
      this.setState({ status: 'Offline', badgeStatus: 'red', radius: 0, });
    }
  }
  
 
  
  render() {
	
	const { statusBarHeight } = this.state 
    if(this.state.isLoading){
    return(
		  <View style={styles.activity}>
			<ActivityIndicator size="large" color="#0000ff"/>
		  </View>
		)
	}
	  
	return (
	<Container style={styles.container}>
	
	  <Header transparent >
		 <GeneralStatusBarColor backgroundColor="white"
      barStyle="dark-content"/>
          <Left>
				<Text style={{ color: 'green', fontWeight:'bold', width:w(40), fontSize:22}} >CheckIn</Text>
		  </Left>	
		  <Body />
		  <Right>
			<Button transparent>
				<Icon type="Ionicons" name='ios-notifications-outline' style={{ color: 'green', fontWeight:'bold', fontSize:30}} />
			</Button>
		  </Right>
		 
        </Header>
     
       <Content>
		 
		 <View style={{ backgroundColor:'#f9f9f9',height:h(10)}}>	
			
			<Grid >
				<Col style={{width:w(20)}}>
					<Thumbnail medium source={{uri: this.props.user.photoURI}} style={styles.avatar}/>
					
				</Col>	
				<Col style={{alignSelf:'flex-start', marginLeft:1, top:h(1), width:w(62)}}>
					<Text style={styles.text}>Hai, {this.props.user.fullname}</Text>
					<Text style={styles.textTitle}>{this.props.user.mobile_phone}</Text>
					
				</Col>
				<Col style={{alignSelf:'flex-start', marginLeft:1, top:h(2)}}>
					<ToggleSwitch
					  onColor="green"
					  offColor="grey"
					  isOn={this.state.isOnDefaultToggleSwitch}
					  onToggle={isOnDefaultToggleSwitch => {
						this.setState({ isOnDefaultToggleSwitch });
						this.onToggle(isOnDefaultToggleSwitch);
					  }}
					/>
					 <Text style={{ fontSize:12,marginLeft:w(1)}}>{this.state.status}</Text>
				</Col>
			</Grid>
		  </View>	
		  
		  <View style={{ backgroundColor:'#f0f0f0',height:h(6)}}>	
			<Text style={{ alignSelf:'flex-start', marginLeft:w(4), top:h(1.5),fontWeight:'bold',fontSize:14 }}>Ringkasan Akun Anda</Text>
		  </View>	
		  
		  <View style={{marginBottom:h(2)}}>	
			<Grid >
				<Col style={{top:h(1),width:w(50), justifyContent:'center',alignItems:'center'}}>
					<Text style={styles.textTitle}>Trip</Text>
					<Text style={styles.text}> {this.props.user.balance}</Text>
					
				</Col>	
				<Col style={{top:h(1),width:w(50), justifyContent:'center',alignItems:'center'}}>
					<Text style={styles.textTitle}>Income</Text>
					<Text style={styles.text}>Rp {this.props.user.balance}</Text>
					
				</Col>
				
			</Grid>
		  </View>	
		
		  <View style={{ backgroundColor:'#2f86e5', height:h(5)}}>
			<Text style={{ textAlign:'center', top:h(1),fontWeight:'bold',fontSize:14, color:'white' }}>Utamakan keselamatan dalam berkendara</Text>
		  </View>
		  
		  <View style={{ backgroundColor:'#f0f0f0',height:h(6)}}>	
			<Text style={{ alignSelf:'flex-start', marginLeft:w(4), top:h(1.5),fontWeight:'bold',fontSize:16 }}>Order Penumpang</Text>
		  </View>	
	
		  <ScrollView>
			
			
		 
		  
			{
			  this.state.orders.map((item,index) => (
			  <>
				<Card style={{marginLeft:w(3), marginRight:w(3)}} key={index}>
					<CardItem bordered>
				  <Body>
					<Grid>
						<Col style={{justifyContent:'flex-start',alignItems:'flex-start'}}>
							<Text style={{fontSize:14}}> {item.pick_up_location}</Text>
								<ListItem icon>
									  <Left>
										 <Icon type="Feather" name="calendar" style={{fontSize:18}}/>
										  <Text style={{fontSize:14}}>{new Date(item.start_date.toDate()).toLocaleString('en-US',{hour12:false})}</Text>
									  </Left>
									  <Body />
								</ListItem>
								
							
						</Col>
						<Col style={{width:w(5),justifyContent:'flex-start',alignItems:'center'}}>
							<Icon type="Feather" name="arrow-right" style={{color:'red', fontSize: 16}}></Icon>
						</Col>
						<Col style={{justifyContent:'flex-start',alignItems:'flex-start'}}>
							<Text style={{fontSize:14}}>{item.route}</Text>
							<ListItem icon>
									  <Left>
										 <Icon type="Feather" name="calendar" style={{fontSize:18}}/>
										  <Text style={{fontSize:14}}>{new Date(item.end_date.toDate()).toLocaleString('en-US',{hour12:false})}</Text>
									  </Left>
									  <Body />
							</ListItem>
								
						</Col>
					</Grid>
					
					<ListItem icon>
									  <Left style={{marginLeft:w(-2)}}>
										 <Text style={styles.title}>{item.fullname}</Text>
									  </Left>
									  <Body />
									  <Right>
										
										<Text>{convertToRupiah(item.driverPaid)}</Text>
									  </Right>
					</ListItem>	
				  	
					
					<Button bordered success style={{ marginLeft:'auto',marginRight:'auto', width:w(80), alignItems:'center', justifyContent:'center'}} onPress={ () => this.orderTaken(item.key)}><Text>Ambil</Text></Button>	
						
				  </Body>
				</CardItem>
				
				</Card>
			  </>	
				
			  ))
			}
				  
		  </ScrollView>	
          
        </Content>
   	  <Button onPress={() => { }}
          style={{ alignSelf: 'center', position: 'absolute', elevation: 4, height: 70, width: 70, bottom: 0, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 35, backgroundColor: '#37A000', justifyContent: 'center' }} active>
          <Icon type="MaterialCommunityIcons" active name="home" style={{ color: 'white', fontSize:36 }} />
        </Button>
    <Footer>
          <FooterTab style={{ backgroundColor:'white', }}>
            <Button onPress={() =>  this.props.navigation.navigate('Order')}>
              <Icon type="MaterialCommunityIcons" name="script-text-outline" style={{ color: 'darkgrey' }}/>
			  <Text style={{ color:'darkgrey', textTransform:'capitalize', fontSize:10 }}>Aktivitas</Text>
            </Button>
            <Button onPress={() =>  this.props.navigation.navigate('Inbox')}>
              <Icon type="MaterialCommunityIcons" name="email-outline" style={{ color: 'darkgrey' }}/>
			  <Text style={{ color:'darkgrey', textTransform:'capitalize',fontSize:10 }}>Inbox</Text>
            </Button>
            <Button style={{ flex: 0, width: 70 }}>
              <Icon active name="navigate" />
            </Button>
            <Button onPress={() => this.props.navigation.navigate('Wallet') }>
              <Icon type="MaterialCommunityIcons" name="wallet-outline" style={{ color: 'darkgrey' }}/>
			  <Text style={{ color:'darkgrey', textTransform:'capitalize',fontSize:10 }}>Dompet</Text>
            </Button>
            <Button onPress={() =>  this.props.navigation.navigate('Profile')}>
             <Icon type="MaterialCommunityIcons" name="account-circle" style={{ color: 'darkgrey' }}/>
			 <Text style={{ color: 'darkgrey', textTransform:'capitalize',fontSize:10 }}>Akun</Text>
            </Button>
          </FooterTab>
    </Footer>      
		
		
	</Container>
	 
    );
  }
}

var styles = StyleSheet.create({
   container: {
        flex: 1,
		fontFamily:'Gotham-Medium',
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
		fontSize: 20,
		fontWeight: 'bold',
		
	},
	textTitle: {
		fontSize: 14,
	
	},
	avatar: {
		 alignSelf: 'flex-start',  
		 marginLeft: 10,
		 top:h(1),
		 
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
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

const mapStateToProps = state => {
	console.log('This is data from home', state)
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(HomePage)

//export default connect(mapStateToProps)(HomePage);