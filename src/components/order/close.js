import React, { Component } from 'react';
import { StatusBar, StyleSheet,  Image, Linking, TouchableOpacity,BackHandler } from 'react-native';
import { w, h, totalSize } from '../../api/Dimensions';
const car = require('../../assets/cars.png');
const url =  'https://via.placeholder.com/250x150.png?text=Upload+Photo';
import {
  Container,
  Header,
  Card,
  CardItem, 
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Right,
  Body,
  Text,
  List,
  ListItem,
  Left,
  Icon,
  Thumbnail,
  Badge,
  H2,
  Form,
  Input,
  Label,
  Item,
  Grid,
  Col,
  Row,
  Accordion,
  Separator,
} from 'native-base';
import {
  NativeRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-native';
import Firebase from '../../../config/Firebase'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUser } from '../../actions/user'
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';
import CountDown from 'react-native-countdown-component';
import { Countdown } from 'react-native-countdown-text';
import ImagePicker from 'react-native-image-picker';


function convertToRupiah(angka)
{
	var rupiah = '';		
	var angkarev = angka.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


class OrderClose extends Component {
  
   constructor(props) {
   super(props);	
   var uid = props.navigation.state.params.uid;
   var orderDate = props.navigation.state.params.orderDate;
   let userID = Firebase.auth().currentUser.uid; 
   this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
   //alert(orderDate)
   this.state ={ 
		user:'',
		order: {},
		isDisabled: null, 
		now: new Date().getTime(),
		orderDate: orderDate,
		count: orderDate.toDate().getTime(), 
		code2verify:'',
		uid:uid, 
		userID: userID,
		photo: null,
		photoCust: null,
		photoURI: '',
		photoURICust: '',
		buttonAction: true,
		actionBlock: false,
		endAction: false,
		photoAction: false,
		}
   }  
   
   _verifyCode = (e,code) => {
	   /* alert('This is id ' + e)
	   alert(code)
	   alert(this.state.code2verify)
	   alert(this.state.amount)
	   alert(e) */
	   let newAmount = parseInt(this.state.amount) + parseInt(this.state.order.driverPaid)
	   if(code !== this.state.code2verify){
		   alert('Dont Try To Cheat')
	   }
	   else {
		   
		   const trip  = {
			//photoTicket: this.state.photoURICust,
			//endExe: new Date(),
			status: 'Close'
			}
		   
		   const inbox = {
				title: 'Selamat ya telah menyelesaikan orderan',
				body: 'Terimakasih telah menyelesaikan order dengan kode ' + this.state.order.booking_id + '. Pendapatan anda dari perjalanan ini akan segera terakumulasi dalam dompet virtual CheckIn.',
				key: this.state.userID,
				readStatus: 'Unread',
				visible: true,
				createdAt: new Date(),
				
			}
			
			const payout = {
				orderID: e,
				orderCode:this.state.order.booking_id,
				code: 'Dbt',
				key: this.state.userID,
				amount: this.state.order.driverPaid,
				status: 'Success',
				createdAt: new Date(),
			}
			
			const balance = {
				balance: newAmount
			}
			
		   Firebase.firestore().collection('orders').doc(e).update(trip)
		   Firebase.firestore().collection('drivers').doc(this.state.order.driverID).update(balance)	
		   Firebase.firestore().collection('inbox').doc().set(inbox)
		   Firebase.firestore().collection('transaction').doc().set(payout)
		   alert('Hore....kode perjalanan nya benar. Selalu cek aplikasi CheckIn untuk terus dapat order')
		   this.props.navigation.navigate('Order')
	   }
   }
   
	_changeAction = (e) => {
		console.log("This is id from counter", e)
		this.setState({isDisabled:e})
	}
	
  componentDidMount() {
	const detail = Firebase.firestore().collection('orders').doc(this.state.uid);
	detail.get().then((doc) => {
    if (doc.exists) {
      this.setState({
        order: doc.data(),
        key: doc.id,
		
        isLoading: false
      });
	  console.log(this.state)
	  //alert(new Date(this.state.order.start_date.toDate()).toLocaleString('en-US',{hour12:false}))
    } else {
      console.log("No such document!");
    }
  });
  
   const amount = Firebase.firestore().collection('drivers').doc(this.state.userID)
	  amount.get().then((doc) => {
		if (doc.exists) {
		  this.setState({
			user: doc.data(),
			key: doc.id,
			amount: doc.data().balance,
			isLoading: false
		  });
		  console.log(this.state)
		  //console.log()
		  } else {
		  console.log("No such document!");
		}
	  });
	BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }	

	componentWillUnmount() {
	  // This is the Last method in the activity lifecycle
	  // Removing Event Listener for the BackPress 
		  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
		  console.log(this.state)
	}

	handleBackButtonClick() {
	  this.props.navigation.navigate('Order');
	  return true;
	}	
  
  
  render() {
	 
    return (
		<Container>
			<Header transparent>
				<GeneralStatusBarColor backgroundColor="white" barStyle="dark-content"/>
			  <Left>
					<Icon style={{ color: 'green'}} name="arrow-back" onPress={ () => this.props.navigation.navigate('Order')}></Icon>
			  </Left>	
			  <Body>
				<Text style={{ color:'#37A000',fontWeight:'bold', width:w(80), fontSize:22}} >Close Order</Text>
			  </Body>
			   <Right/>
				
			
			</Header>
			<Content>
				<Image source={car} style={styles.icon}/>
				<Grid>
					<Col>
						<Text style={{marginLeft:w(4),fontWeight:'bold',textTransform:'capitalize'}}>{this.state.order.orderType}</Text>
					</Col>
					<Col>
						<Text style={{fontWeight:'bold'}}>Rp {this.state.order.driverPaid}</Text>
					</Col>
				</Grid>
				<Card>
					<Separator bordered>
							<Text style={{fontSize:14}}>Informasi Penumpang</Text>
					</Separator>
					<Grid style={{paddingTop:h(2), paddingBottom:h(2)}}>
						<Col style={{width:w(50),marginLeft:w(2),flexDirection:'row',flexWrap:'wrap',}}>
							<Icon type="Feather" name="user" style={{fontSize:18}}/>
							<Text style={{fontWeight:'bold',marginLeft:w(2)}}>{this.state.order.fullname}</Text>
						</Col>
						<Col style={{width:w(50),marginLeft:w(2),flexDirection:'row',flexWrap:'wrap',}}>
							<Icon type="Feather" name="smartphone" style={{fontSize:18}}/>
								<TouchableOpacity onPress={()=>Linking.openURL(`tel:${this.state.order.mobile_phone}`)}>
									<Text>{this.state.order.mobile_phone}</Text>
								</TouchableOpacity>	
						</Col>
					</Grid>
					<Separator bordered>
							<Text style={{fontSize:14}}>Rute Penumpang</Text>
					</Separator>
					<Grid style={{paddingTop:h(2)}}>
							
							<Col style={{justifyContent:'flex-start',alignItems:'flex-start',width:w(48)}}>
								<Text style={{fontSize:14}}> {this.state.order.pick_up_location}</Text>
									<ListItem icon>
										  <Left>
											 <Icon type="Feather" name="calendar" style={{fontSize:18}}/>
											  <Text style={{fontSize:14, marginLeft:w(6),width:w(50)}}>{new Date(this.state.orderDate.toDate()).toLocaleString()}</Text>
										  </Left>
										
										  <Right>
												  <Text style={{fontSize:14}}>Durasi : {this.state.order.dayDif} hari</Text>
										  </Right>
									</ListItem>
									
								
							</Col>
							<Col style={{width:w(4),justifyContent:'flex-start',alignItems:'center'}}>
								<Icon type="Feather" name="arrow-right" style={{color:'red', fontSize: 16}}></Icon>
							</Col>
							<Col style={{justifyContent:'flex-start',alignItems:'flex-start',width:w(48), marginLeft:w(2)}}>
								<Text style={{fontSize:14, height:20}}>{this.state.order.route} {this.state.order.area}</Text>
																	
							</Col>
						</Grid>
						
						<Item regular style={{ flexDirection:'row' }} >
								<Input value={this.state.code2verify} onChangeText={code2verify=>this.setState({code2verify}) } placeholder='Kode Perjalanan' />
								<Button success data-oid={this.state.uid} data-oCode={this.state.order.tripCode} onPress={()=>this._verifyCode(this.state.uid,this.state.order.tripCode)}><Text>Kode Perjalanan</Text></Button>
						</Item>
							
							
					
				</Card>
				
			
			  
			</Content>	
			
			<Button onPress={() => { this.props.navigation.navigate('Home') }}
				  style={{ alignSelf: 'center', position: 'absolute', elevation: 4, height: 70, width: 70, bottom: 0, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 35, backgroundColor: '#37A000', justifyContent: 'center' }} active>
				   <Icon type="MaterialCommunityIcons" active name="home" style={{ color: 'white', fontSize:36 }} />
			</Button>
			
			<Footer>
				  <FooterTab style={{ backgroundColor:'white', }}>
					 <Button onPress={() =>  this.props.navigation.navigate('Order')}>
					  <Icon type="MaterialCommunityIcons" name="script-text-outline" style={{ color: '#37A000' }}/>
					  <Text style={{ color:'#37A000', textTransform:'capitalize', fontSize:10 }}>Aktivitas</Text>
					</Button>
					<Button onPress={() =>  this.props.navigation.navigate('Inbox')}>
					  <Icon type="MaterialCommunityIcons" name="email-outline" style={{ color: 'darkgrey' }}/>
					  <Text style={{ color:'darkgrey', textTransform:'capitalize',fontSize:10 }}>Inbox</Text>
					</Button>
					<Button style={{ flex: 0, width: 70 }} onPress={ () => this.props.navigation.navigate('Home') }>
					  <Icon active name="navigate" />
					</Button>
					<Button onPress={() => this.props.navigation.navigate('Wallet') }>
					  <Icon type="MaterialCommunityIcons" name="wallet-outline" style={{ color: 'darkgrey' }}/>
					  <Text style={{ color:'darkgrey', textTransform:'capitalize',fontSize:10 }}>Dompet</Text>
					</Button>
					<Button onPress={() =>  this.props.navigation.navigate('Profile')}>
					  <Icon type ="MaterialCommunityIcons" name="account-circle" style={{ color: 'darkgrey' }}/>
					  <Text style={{ color:'darkgrey', textTransform:'capitalize',fontSize:10 }}>Akun</Text>
					</Button>
				  </FooterTab>
			</Footer>    
		</Container>
	);
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  
  title: {
	marginLeft:w(5),  
  },
  
  account: {
	fontSize: 12,  
	marginTop: 40,
	marginBottom: 40,
	borderBottomWidth:0,
  },
  
  accountChild: {
	height:h(2)  
  },
  
  buttonContainer: {
    height: 45,
	justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
	marginLeft:10,
	marginRight: 10,
    textTransform: 'uppercase',
   
  },
  
  icon: {
    width: w(70),
    height: h(30),
    marginTop: h(0),
    marginBottom: h(0),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  capturebtntxt:{
	alignSelf:'center',
	fontSize:12,
	fontFamily:'Gotham-Medium',
	color:'#AAAAAA'
  },
  capturebtnicon:{
	flexDirection: 'column',
	color:'#E3E3E3',
	fontSize:20
  },
  capturebtn:{
		marginTop: 10,  
		marginBottom: 10,  
		marginLeft:'auto',
		marginRight: 'auto',
		elevation:0,
		borderColor:'#e5e5e5',
		borderWidth:1,
		borderRadius:7,
		justifyContent:'center',
		alignItems:'center',
		width:w(40)
	},
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ getUser }, dispatch)
}

const mapStateToProps = state => {
	return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderClose)