import React, { Component } from 'react';
import { StatusBar, StyleSheet,  Image, AsyncStorage,Linking } from 'react-native';
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

const dataArray = [
  { title: "First Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
];

class Order extends Component {
  
   constructor(props) {
   super(props);	
   
   this.onward = Firebase.firestore().collection('orders').where('status','==','on process');
   this.done = Firebase.firestore().collection('orders').where('status','==','done');
   this.state ={ user:'',orders: [], }
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
   
   launchChat() {
	  // alert('Open Whatsapp');
	   Linking.openURL('whatsapp://send?phone=628111');
   }

  componentDidMount() {
	  this.uid = Firebase.auth().currentUser.uid; 
	   console.log("Here is uid", this.uid)
	   this.schedule = Firebase.firestore().collection('orders').where('status','==','Assign').where('driverID', '==', this.uid);
	   console.log(this.schedule)
	  this.unsubscribe = this.schedule.onSnapshot(this.onCollectionUpdate);
	  //console.log('Condition',this.props.user)
	  
  }	
	
  
  
	
  render() {
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
					<Icon type="Feather" name='trash-2' style={{ color: 'green', fontSize:28}} />
				</Button>
			  </Right>
			
			</Header>
			<Content>
			
				<Text style={{marginLeft:w(4), marginTop:h(2), marginBottom:h(2),fontWeight:'bold', fontSize:18}}>Dijadwalkan</Text>
					
					{
					this.state.orders.map((item,index) => (
					<ListItem icon style={{marginTop:h(2), marginBottom:h(2), alignItems:'center', justifyContent:'center'}}>
						<Left>
						  
						  <Button style={{ backgroundColor: "#37A000", height:35, width:35, borderRadius:35/2 }}>
							
							<Icon type="MaterialCommunityIcons" name="car-hatchback" style={{fontSize:30}}/>
						  </Button>
						</Left>
						<Body style={{}}>
							<Grid style={{marginBottom:h(12)}} >
								<Col>
									<Text style={{fontSize:15, fontWeight:'bold'}}>{item.pick_up_location}</Text>
									<Text style={{fontSize:14}}>{item.route}</Text>
									<CountDown
									    id={item.id}
										until={ (item.count - item.now)/1000}
										onFinish={() => alert('finished')}
										onPress={() => alert('hello')}
										size={8}
										style={{marginTop:h(2.5),marginLeft:w(-30)}}
									  />
									
									 
								</Col>
								
							</Grid>
									
						</Body>
						<Right>
							<Button warning onPress={this.launchChat}><Text style={{fontSize:10}}>Cancel</Text></Button>
						</Right>	
					</ListItem>
					))
					}
				
				<Text style={{marginLeft:w(4), marginTop:h(2), marginBottom:h(2),fontWeight:'bold', fontSize:18}}>Lagi Berjalan</Text>
			
				<Text style={{marginLeft:w(4), marginTop:h(2), marginBottom:h(2),fontWeight:'bold', fontSize:18}}>Yang Sudah Lewat</Text>
				<List noIndent>
				
					<ListItem icon style={{marginTop:h(2), marginBottom:h(2), alignItems:'center', justifyContent:'center'}}>
						<Left>
						  
						  <Button style={{ backgroundColor: "#37A000", height:35, width:35, borderRadius:35/2 }}>
							
							<Icon type="MaterialCommunityIcons" name="car-hatchback" style={{fontSize:30}}/>
						  </Button>
						</Left>
						<Body style={{height:h(8)}}>
							<Grid >
								<Col>
									<Text style={{fontSize:16, fontWeight:'bold'}}>Permintaan withdraw #WDSBY001</Text>
									<Text style={{fontSize:14}}>Tungguin transferan dari CheckIn</Text>
								</Col>
							</Grid>
							
						</Body>
					</ListItem>
					
					<ListItem icon style={{marginTop:h(2), marginBottom:h(2), alignItems:'center', justifyContent:'center'}}>
						<Left>
						  
						  <Button style={{ backgroundColor: "#37A000", borderRadius:50 }}>
							
							<Icon type="MaterialCommunityIcons" name="email-outline" style={{fontSize:18}}/>
						  </Button>
						</Left>
						<Body style={{height:h(8)}}>
							<Grid >
								<Col>
									<Text style={{fontSize:16, fontWeight:'bold'}}>Kode Perjalanan #PQ1234</Text>
									<Text style={{fontSize:14}}>Ini loh kode perjalanan kemarin</Text>
								</Col>
							</Grid>
							
						</Body>
					</ListItem>
					
					<ListItem icon style={{marginTop:h(2), marginBottom:h(2), alignItems:'center', justifyContent:'center'}}>
						<Left>
						  
						  <Button style={{ backgroundColor: "#37A000", borderRadius:50 }}>
							
							<Icon type="MaterialCommunityIcons" name="email-outline" style={{fontSize:18}}/>
						  </Button>
						</Left>
						<Body style={{height:h(8)}}>
							<Grid >
								<Col>
									<Text style={{fontSize:16, fontWeight:'bold'}}>Kode Perjalanan #PQ2233</Text>
									<Text style={{fontSize:14}}>Ini loh kode perjalanan kemarin</Text>
								</Col>
							</Grid>
							
						</Body>
					</ListItem>
					
					<ListItem icon style={{marginTop:h(2), marginBottom:h(2), alignItems:'center', justifyContent:'center'}}>
						<Left>
						  
						  <Button style={{ backgroundColor: "#37A000", borderRadius:50 }}>
							<Badge style={{height:h(1), width:w(1), right:0, position:'absolute',zIndex:1}}/>	
							<Icon type="MaterialCommunityIcons" name="email-outline" style={{fontSize:18}}/>
						  </Button>
						</Left>
						<Body style={{height:h(8)}}>
							<Grid >
								<Col>
									<Text style={{fontSize:16, fontWeight:'bold'}}>Pesan dari CheckIn</Text>
									<Text style={{fontSize:14}}>Ada yang baru loh di aplikasi</Text>
								</Col>
							</Grid>
							
						</Body>
					</ListItem>
					
					<ListItem icon style={{marginTop:h(2), marginBottom:h(2), alignItems:'center', justifyContent:'center'}}>
						<Left>
						  
						  <Button style={{ backgroundColor: "#37A000", borderRadius:50 }}>
							<Badge style={{height:h(1), width:w(1), right:0, position:'absolute',zIndex:1}}/>	
							<Icon type="MaterialCommunityIcons" name="email-outline" style={{fontSize:18}}/>
						  </Button>
						</Left>
						<Body style={{height:h(8)}}>
							<Grid >
								<Col>
									<Text style={{fontSize:16, fontWeight:'bold'}}>Selamat Datang</Text>
									<Text style={{fontSize:14}}>Baca dulu yuk sebelum pakai CheckIn</Text>
								</Col>
							</Grid>
							
						</Body>
					</ListItem>
					
					
				</List>
				
			
			  
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