import React, { Component } from 'react';
import { StatusBar, StyleSheet,  Image,Linking, TouchableOpacity, View,BackHandler } from 'react-native';
import { w, h, totalSize } from '../../api/Dimensions';
const bank = require('../../assets/money.png');
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

function convertToRupiah(angka)
{
	var rupiah = '';		
	var angkarev = angka.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}

class Order extends Component {
  
   constructor(props) {
   super(props);	
	   this.uid = Firebase.auth().currentUser.uid; 
	   console.log("Here is uid", this.uid)
	   this.schedule = Firebase.firestore().collection('orders').where('status','==','Assign').where('driverID', '==', this.uid);
	   this.close = Firebase.firestore().collection('orders').where('status','==','Close').where('driverID', '==', this.uid);
	   this.hold = Firebase.firestore().collection('orders').where('status','==','On process').where('driverID', '==', this.uid);
   this.state ={ user:'',orders: [],close: [], hold: [], isDisabled: null, now: new Date().getTime(),code2verify:'' }
   this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
   }  
   
   onCollectionUpdate = (querySnapshot) => {
	const orders = [];
	querySnapshot.forEach((doc) => {
	const { pick_up_location, route, start_date, end_date,fullname,driverPaid, category,mobile_phone } = doc.data();
	orders.push({
		  key: doc.id,
		  doc, // DocumentSnapshot
		  pick_up_location,
		  route,
		  category,
		  start_date,
		  end_date,
		  fullname,
		  mobile_phone,
		  count: start_date.toDate().getTime(),	
		  now: new Date().getTime(),
		});
	  });
	  this.setState({
		orders,
		isLoading: false,
	 });
	 console.log(this.state)
	}
	
	
	
	
	onUpdate = (querySnapshot) => {
	const hold = [];
	querySnapshot.forEach((doc) => {
	const { pick_up_location, route, start_date, end_date,fullname,driverPaid, category,mobile_phone,status,tripCode } = doc.data();
	hold.push({
		  key: doc.id,
		  doc, // DocumentSnapshot
		  pick_up_location,
		  route,
		  category,
		  start_date,
		  end_date,
		  fullname,
		  mobile_phone,
		  status,
		  tripCode,
		  count: start_date.toDate().getTime(),	
		  now: new Date().getTime(),
		});
	  });
	  this.setState({
		hold,
		isLoading: false,
	 });
	 console.log(this.state)
	}
   
   onColUpdate = (querySnapshot) => {
	const close = [];
	querySnapshot.forEach((doc) => {
	const { pick_up_location, route, start_date, end_date,fullname,driverPaid, category,mobile_phone,status,tripCode } = doc.data();
	close.push({
		  key: doc.id,
		  doc, // DocumentSnapshot
		  pick_up_location,
		  route,
		  category,
		  start_date,
		  end_date,
		  fullname,
		  mobile_phone,
		  status,
		  tripCode,
		  count: start_date.toDate().getTime(),	
		  now: new Date().getTime(),
		});
	  });
	  this.setState({
		close,
		isLoading: false,
	 });
	 console.log(this.state)
	}
   
   launchChat() {
	  // alert('Open Whatsapp');
	   Linking.openURL('whatsapp://send?phone=6281333319428');
   }

	_action = (e,id,date) => {
		console.log('This shoul be fine', this.state.start_date)
		//alert(date)
		this.props.navigation.navigate('OrderDetail',{uid: id,orderDate: date})
	}
	
	_changeAction = (e) => {
		console.log("This is id from counter", e)
		this.setState({isDisabled:e})
	}
	
	_verifyCode = (e,code,date) => {
		this.props.navigation.navigate('OrderClose',{uid: code,orderDate: date})
		/* alert('this is id' + code)
		alert(date)
		alert('This is' + e) */
		
	}
	
	
	
	componentDidMount() {
	
	  
	  this.unsubscribe = this.schedule.onSnapshot(this.onCollectionUpdate);
	  this.unsub = this.close.onSnapshot(this.onColUpdate);
	  this.unsubHold = this.hold.onSnapshot(this.onUpdate);
	  //console.log('Condition',this.props.user)
	  BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }	

	componentWillUnmount() {
	  // This is the Last method in the activity lifecycle
	  // Removing Event Listener for the BackPress 
		  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
		  console.log(this.state)
	}

	handleBackButtonClick() {
	  this.props.navigation.navigate('Home');
	  return true;
	}	
 
  render() {
	   const {code2verify} = this.state
    return (
		<Container>
			<Header transparent>
				<GeneralStatusBarColor backgroundColor="white" barStyle="dark-content"/>
			  <Left>
					<Text style={{ color:'#37A000',fontWeight:'bold', width:w(40), fontSize:22}} >Aktivitas</Text>
			  </Left>	
			  <Body />
			   <Right>
				<Button transparent>
					<Icon type="Feather" name='trash-2' style={{ color: 'transparent', fontSize:28}} />
				</Button>
			  </Right>
			
			</Header>
			<Content>
			
				<Text style={{marginLeft:w(4), marginTop:h(2), marginBottom:h(2),fontWeight:'bold', fontSize:18}}>Dijadwalkan</Text>
					
					{
					this.state.orders.map((item,index) => (
					<>
					<Card style={{marginLeft:w(3), marginRight:w(3), borderRadius:h(2)}} key={index}>
						<CardItem bordered>
					  <Body>
						<Grid>
					    <Col>
							<Text style={{marginLeft:w(2),fontWeight:'bold'}}>{item.category}</Text>
						</Col>
						<Col>
							<Text style={{fontWeight:'bold'}}>{item.fullname}</Text>
						</Col> 
						</Grid>
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
								<Text style={{fontSize:14, height:20}}>{item.route}</Text>
								<ListItem icon>
										  <Left>
											 
											 
											  <CountDown
												id={item.key}
												until={ (item.count - item.now)/1000}
												onFinish={()=>this._changeAction(item.key)}
												onPress={() => alert('Selalu Perhatikan Waktu Penjemputan')}
												size={12}
												style={{marginTop:h(2.5)}}
											  />
									
										  </Left>
										  <Body />
								</ListItem>
									
							</Col>
						</Grid>
						
						<ListItem icon>
										  <Left style={{marginLeft:w(-4)}}>
												<Icon type="Feather" name="smartphone" style={{fontSize:18}}/>
											
												<TouchableOpacity onPress={()=>Linking.openURL(`tel:${item.mobile_phone}`)}>
													<Text>{item.mobile_phone}</Text>
												</TouchableOpacity>	
										  </Left>
										  <Body />
										 
						</ListItem>	
						
						
						<Grid>
						<Col>

							<Button  success id={item.key} data-start={item.count} data-date={item.start_date} onPress={()=>this._action(item.count,item.key,item.start_date)} style={{ marginLeft:'auto',marginRight:'auto', width:w(40), alignItems:'center', justifyContent:'center'}}><Text>Mulai</Text></Button>	
						</Col>
						<Col>	
							<Button danger style={{ marginLeft:'auto',marginRight:'auto', width:w(40),alignItems:'center', justifyContent:'center'}} onPress={this.launchChat}><Text>Cancel</Text></Button>	
						</Col>
					</Grid>		
							
					  </Body>
					</CardItem>
					
					</Card>
					
					
					</>
					))
					}
				
				<Text style={{marginLeft:w(4), marginTop:h(2), marginBottom:h(2),fontWeight:'bold', fontSize:18}}>Yang Belum Selesai</Text>
				{
					this.state.hold.map((item,index) => (
					<>
					<Card style={{marginLeft:w(3), marginRight:w(3), borderRadius:h(2)}} key={index}>
						<CardItem bordered>
					  <Body>
						<Grid>
					    <Col>
							<Text style={{marginLeft:w(2),fontWeight:'bold'}}>{item.category}</Text>
						</Col>
						<Col>
							<Text style={{fontWeight:'bold'}}>{item.fullname}</Text>
						</Col> 
						</Grid>
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
								<Text style={{fontSize:14, height:20}}>{item.route}</Text>
								<ListItem icon>
										  <Left>
										  <Text>{item.category}</Text>
										  </Left>
										  <Body />
								</ListItem>
									
							</Col>
						</Grid>
					<Button  success id={item.key} data-start={item.count} data-date={item.start_date} onPress={()=>this._verifyCode(item.count,item.key,item.start_date)} style={{ marginLeft:'auto',marginRight:'auto', width:w(80), alignItems:'center', justifyContent:'center'}}><Text>Mulai</Text></Button>	
							
					  </Body>
					</CardItem>
					
					</Card>
					
					
					</>
					))
					}
				
			
				<Text style={{marginLeft:w(4), marginTop:h(2), marginBottom:h(2),fontWeight:'bold', fontSize:18}}>Yang Sudah Lewat</Text>
				
				{
					this.state.close.map((item,index) => (
					<>
					<Card style={{marginLeft:w(3), marginRight:w(3), borderRadius:h(2)}} key={index}>
						<CardItem bordered>
					  <Body>
						<Grid>
					    <Col>
							<Text style={{marginLeft:w(2),fontWeight:'bold'}}>{item.category}</Text>
						</Col>
						<Col>
							<Text style={{fontWeight:'bold'}}>{item.fullname}</Text>
						</Col> 
						</Grid>
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
								<Text style={{fontSize:14, height:20}}>{item.route}</Text>
								<ListItem icon>
										  <Left>
										  <Text>{item.category}</Text>
										  </Left>
										  <Body />
								</ListItem>
									
							</Col>
						</Grid>
					
							
					  </Body>
					</CardItem>
					
					</Card>
					
					
					</>
					))
					}
				
			
			  
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
    marginBottom: h(2),
    marginLeft: 'auto',
    marginRight: 'auto',
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
)(Order)