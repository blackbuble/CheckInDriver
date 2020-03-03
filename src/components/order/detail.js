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


class OrderDetail extends Component {
  
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
		uid:uid, 
		userID: userID,
		amount:'',
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
   
   	_action = (e,id,order) => {
		//const id = e.currentTarget.id;
		
		
		if( (this.state.now-e) >= 0 ){
			/* alert("Start Action Now")
			alert(id)
			alert(e)
			alert(order) */
			if(order == 'shuttle') {
				//alert('Order Shuttle')
				this.setState({photoAction: true, buttonAction:false})
			}
			else{
				//alert('Order Rental')
				this.setState({actionBlock: true, buttonAction:false})
			}
		}
		else{
			alert("Its not your turn now. Please wait with patience.")
			/* alert(id)
			alert(e)
			alert(order) */
		}
	}
	
	_startTrip = (e,type) => {
		//alert(e)
		if(type == 'rental'){
			const trip  = {
			startExe: new Date(),
			status:'On process',
			}
			Firebase.firestore().collection('orders').doc(e).update(trip)
			this.setState({endAction:true,actionBlock: false})
		}
		else{
			
		const trip  = {
			photoTicket: this.state.photoURI,
			photoTicketLat: this.state.photo.latitude,
			photoTicketLong: this.state.photo.longitude,
			startExe: new Date(),
			status:'On process',
		}
		//alert(e)
		Firebase.firestore().collection('orders').doc(e).update(trip)
		this.setState({endAction:true,actionBlock: false})
		}
		
	}
	
	_endTrip = (e,type) => {
		//alert(e)
		//alert(this.state.amount)
		
		//alert(this.state.order.driverPaid)
		
		let newAmount = parseInt(this.state.amount) + parseInt(this.state.order.driverPaid)
		//alert(this.state.userID)
		//alert(balance)
		if(type == 'rental') {
			const trip  = {
			//photoTicket: this.state.photoURICust,
			endExe: new Date(),
			status: 'Close'
			}
			const payout = {
				orderID: e,
				orderCode:this.state.order.booking_id,
				key: this.state.userID,
				code: 'Dbt',
				amount: this.state.order.driverPaid,
				status: 'Success',
				createdAt: new Date(),
			}
			const inbox = {
				title: 'Selamat ya telah menyelesaikan orderan',
				body: 'Terimakasih telah menyelesaikan order dengan kode ' + this.state.order.booking_id + '. Pendapatan anda dari perjalanan ini akan segera terakumulasi dalam dompet virtual CheckIn.',
				key: this.state.userID,
				readStatus: 'Unread',
				visible: true,
				createdAt: new Date(),
				
			}
			const balance = {
				balance: newAmount,
			}
		//alert(e)
		Firebase.firestore().collection('orders').doc(this.state.uid).update(trip)
		Firebase.firestore().collection('drivers').doc(this.state.userID).update(balance)
		Firebase.firestore().collection('transaction').doc().set(payout)
		Firebase.firestore().collection('inbox').doc().set(inbox)
		this.setState({endAction:false,actionBlock: false})
		alert('Selamat....Anda telah menyelesaikan tugas yang telah diberikan. Jangan lupa ucapkan terimakasih kepada penumpang.')
		this.props.navigation.navigate('Order')
		}
		else {
		//var later = new Date((new Date()).valueOf() + 1000*3600*24);
		var code = makeid(5)
		const trip  = {
			photoCust: this.state.photoURICust,
			photoCustLat: this.state.photoCust.latitude,
			photoCustLong: this.state.photoCust.longitude,
			endExe: new Date(),
			tripCode: code,
			status: 'On process'
		}
		const inbox = {
				title: 'Hore orderan nya udah selesai',
				body: 'Terimakasih telah menyelesaikan order dengan kode ' + this.state.order.booking_id + '. Kode perjalanan akan dirilis besok hari ya...',
				key: this.state.order.driverID,
				readStatus: 'Unread',
				visible: true,
				createdAt: new Date(),
				
		}
		// No use code
		/* const codeinbox = {
				title: 'Ini loh kode perjalanan mu kemarin',
				body: 'Hei perjalanan ' + this.state.order.booking_id + 'kemarin, udah ada kode nya loh. Kode nya '+ code +' Jangan lupa masukin kode nya ya. Biar pendapatan kamu dari perjalanan ini bisa segera terakumulasi dalam dompet virtual CheckIn.',
				key: this.state.order.driverID,
				readStatus: 'Unread',
				visible: false,
				visibleAt: later,
				createdAt: new Date(),
				
		} */
		//alert(e)
		Firebase.firestore().collection('orders').doc(this.state.uid).update(trip)
		Firebase.firestore().collection('inbox').doc().set(inbox)
		//Firebase.firestore().collection('inbox').doc().set(codeinbox)
		this.setState({endAction:false,actionBlock: false})
		alert('Selamat....Anda telah menyelesaikan tugas yang telah diberikan. Jangan lupa ucapkan terimakasih kepada penumpang.')
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
  //alert(this.state.userID)
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
	
  handleChoosePhoto = viewId => {
    const options = {
      noData: false,
	  skipBackup: true,
	  quality: 0.1
    }
   
		 ImagePicker.launchCamera(options, (response) => {
			var temp 
			temp = 'data:image/jpeg;base64,' + response.data ;
			
	  console.log(temp)
	  console.log(viewId)
	  if (response.uri) {
		switch(viewId){
			case 'Tiket':
					this.setState({ photo: response, photoURI: temp, actionBlock:true })
					console.log(this.state.photo)
					console.log(this.state.photoURI)
			break;
			
			case 'Penumpang':
					this.setState({ photoCust: response,photoURICust: temp })
					console.log(this.state.photoCust)
					console.log(this.state.photoURICust)
			break;
		}  
        		
      }
	})
 }
  
  renderButtonAction(){
	  if(this.state.buttonAction){
		  return(
		   <>
			<Grid style={{paddingTop:h(2),paddingBottom:h(2)}}>
						<Col>

							<Button  success id={this.state.key} data-start={this.state.count} data-order={this.state.order.orderType}  onPress={()=>this._action(this.state.count,this.state.key,this.state.order.orderType)} style={{ marginLeft:'auto',marginRight:'auto', width:w(40), alignItems:'center', justifyContent:'center'}}><Text>Mulai</Text></Button>	
						</Col>
						<Col>	
							<Button danger style={{ marginLeft:'auto',marginRight:'auto', width:w(40),alignItems:'center', justifyContent:'center'}} onPress={this.launchChat}><Text>Cancel</Text></Button>	
						</Col>
			</Grid>	
		   </>
		  )
	  }
  }
  
  renderPhotoAction() {
	  if(this.state.photoAction) {
		  const {photo,photoCust} = this.state
		  return(
			<>
				<Grid>
					<Col>
						<Card style={{marginLeft:w(3),marginRight:w(3)}}>
							<Label style={{fontSize:12, fontWeight:'bold', marginBottom:h(2), marginTop:h(2),marginLeft:w(4), color:'grey'}}>Upload Tiket</Label>
							<Image style={{width:w(40),height:h(20),borderRadius: 20,marginLeft: 'auto', marginRight: 'auto'}} source={ this.state.photo == null? {uri:url} : { uri: photo.uri }} />
							<Button transparent style={styles.capturebtn} onPress={()=>this.handleChoosePhoto('Tiket')}>
								<Icon name="camera" type="MaterialCommunityIcons" style={styles.capturebtnicon}/>
								<Text style={styles.capturebtntxt} uppercase={false}>Open Camera</Text>
							</Button>  
						</Card>
					</Col>
					<Col>
						<Card style={{marginLeft:w(0),marginRight:w(3)}}>
							<Label style={{fontSize:12, fontWeight:'bold', marginBottom:h(2), marginTop:h(2),marginLeft:w(4), color:'grey'}}>Upload Foto Penumpang</Label>
							<Image style={{width:w(40),height:h(20),borderRadius: 20,marginLeft: 'auto', marginRight: 'auto'}} source={ this.state.photoCust == null? {uri:url} : { uri: photoCust.uri }} />
							<Button transparent style={styles.capturebtn} onPress={()=>this.handleChoosePhoto('Penumpang')}>
								<Icon name="camera" type="MaterialCommunityIcons" style={styles.capturebtnicon}/>
								<Text style={styles.capturebtntxt} uppercase={false}>Open Camera</Text>
							</Button>  
						</Card>
					</Col>
					
				</Grid>
			
			</>
		  )
	  }
  }
  
  renderActionBlock(){
	  if(this.state.actionBlock) {
		  return(
			<Button  data-oUID={this.state.key} data-oType={this.state.order.orderType} success onPress={()=>this._startTrip(this.state.key,this.state.order.orderType)} style={{ marginLeft:'auto',marginRight:'auto', marginBottom:h(2), width:w(90), alignItems:'center', justifyContent:'center'}}><Text>Mulai Perjalanan</Text></Button>
		  )
	  }
  }
  
  renderEndAction(){
	  if(this.state.endAction) {
		  return(
			<Button  data-oUID={this.state.key} data-oType={this.state.order.orderType} danger onPress={()=>this._endTrip(this.state.key,this.state.order.orderType)} style={{ marginLeft:'auto',marginRight:'auto', marginBottom:h(2), width:w(90), alignItems:'center', justifyContent:'center'}}><Text>Akhiri Perjalanan</Text></Button>
		  )
	  }
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
				<Text style={{ color:'#37A000',fontWeight:'bold', width:w(80), fontSize:22}} >Penjemputan Order</Text>
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
							
							{this.renderButtonAction()}
							{this.renderActionBlock()}
							{this.renderEndAction()}
					
				</Card>
				
				{this.renderPhotoAction()}
			  
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
)(OrderDetail)