import React, { Component } from 'react';
import { StatusBar, StyleSheet,  Image, TouchableOpacity,BackHandler } from 'react-native';
import { w, h, totalSize } from '../../api/Dimensions';
const bank = require('../../assets/bg.jpg');
import {
  Container,
  Header,
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
  Card,
  CardItem,
  Grid,
  Col
} from 'native-base';
import {
  NativeRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-native';
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';
import { connect } from 'react-redux'
import Firebase from '../../../config/Firebase'

function convertToRupiah(angka)
{
	var rupiah = '';		
	var angkarev = angka.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}

class Wallet extends Component {
  
  constructor(props){
	  super(props)
	  let userID = Firebase.auth().currentUser.uid; 
	  this.ref = Firebase.firestore().collection('transaction').where('key','==', userID);
	  this.unsubscribe = null;
	  this.state = {user:{},trip:[], uid: userID}
	  this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  
  onCollectionUpdate = (querySnapshot) => {
	  const trip = [];
	  querySnapshot.forEach((doc) => {
		const { amount, key, code, orderCode } = doc.data();
		trip.push({
		  trpID: doc.id,
		  doc, // DocumentSnapshot
		  key,
		  code,
		  orderCode,
		  amount,
		});
	  });
	  this.setState({
		trip,
		isLoading: false,
	 });
	 console.log(this.state)
  }
  
	componentDidMount(){
	  
	  const amount = Firebase.firestore().collection('drivers').doc(this.state.uid)
	  amount.get().then((doc) => {
		if (doc.exists) {
		  this.setState({
			user: doc.data(),
			key: doc.id,
			amount: doc.data().balance,
			isLoading: false
		  });
		  //alert(convertToRupiah(this.state.amount))
		  //console.log()
		  } else {
		  console.log("No such document!");
		}
	  });
	 this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
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
    return (

		<Container>
        <Header transparent >
		 <GeneralStatusBarColor backgroundColor="white"
      barStyle="dark-content"/>
          <Left>
				<Text style={{ color: 'green', fontWeight:'bold', width:w(40), fontSize:22}} >Dompet</Text>
		  </Left>	
		  <Body />
		  <Right>
			<Button transparent>
				<Icon type="Ionicons" name='ios-notifications-outline' style={{ color: 'transparent', fontWeight:'bold', fontSize:30}} />
			</Button>
		  </Right>
		 
        </Header>
		<Content style={styles.container}>
			
			<Image  style={styles.icon}
            resizeMode="cover"
            source={bank} />
			<Text style={{ position:'absolute', top:h(4), marginLeft:w(2), fontSize:16, fontWeight:'bold'}}> Total Penghasilan</Text>
			<Text style={{ position:'absolute', top:h(8), marginLeft:w(2), fontSize:28, color:'grey',fontWeight:'bold'}}>{convertToRupiah(this.props.user.balance)}</Text>
			
			<Text style={{ alignSelf:'flex-start', marginLeft:w(4),fontWeight:'bold',fontSize:16 }}>Akun Bank</Text>
			<Card style={{backgroundColor:'#37A000', marginBottom:h(3)}}>
				<CardItem >
					<Left>
						<Grid >
							<Col >
								<Text style={{ alignSelf:'flex-start', marginLeft:w(4),fontWeight:'bold',fontSize:16 }}>{this.props.user.bank.bank_name}</Text>
								<Text style={{ alignSelf:'flex-start', marginLeft:w(4),fontSize:16 }}>{this.props.user.bank.account_number}</Text>
								<Text style={{ alignSelf:'flex-start', marginLeft:w(4),fontSize:16 }}>{this.props.user.bank.account_owner}</Text>
								
							</Col>
						</Grid>		
					</Left>
					<Right >
						<Button transparent onPress={() => { this.props.navigation.navigate('Withdraw') }}>
							<Text style={{alignSelf:'center', color:'grey', textTransform:'capitalize'}}>Withdraw</Text><Icon type="MaterialCommunityIcons" name="chevron-right"  style={{color:'grey'}}/>
						</Button>
					</Right>
				</CardItem>
			</Card>
			
			
			<Text style={{ alignSelf:'flex-start', marginLeft:w(4),fontWeight:'bold',fontSize:16 }}>Transaksi</Text>
			<Card style={{marginLeft:w(3), marginRight:w(3)}}>
				<CardItem bordered>
				  <Body>
					<List style={{width:w(99), marginLeft:w(-10)}}>
					{
					  this.state.trip.map((item,index) => {
					   if(item.code == 'Dbt')
						   return(
						<ListItem>
						  <Left>
							<Grid>
								<Col>
									<Text style={{ marginLeft:w(4), alignSelf:'flex-start', fontWeight:'bold',fontSize:16 }}>Perjalanan</Text>
									<Text style={{ marginLeft:w(4),alignSelf:'flex-start', fontSize:14}}>Trip Kode: {item.orderCode} </Text>
									<Text style={{ marginLeft:w(4),alignSelf:'flex-start', fontSize:14}}>12/12/2019 </Text>
								</Col>
							</Grid>
						  </Left>
						  <Right>
							<Text style={{width:w(28), color:'#37A000'}}>{convertToRupiah(item.amount)}</Text>
						  </Right>
					   </ListItem>
					   )
					   return (
						<ListItem>
						  <Left>
							<Grid>
								<Col>
									<Text style={{ marginLeft:w(4), alignSelf:'flex-start', fontWeight:'bold',fontSize:16 }}>Withdraw</Text>
									<Text style={{ marginLeft:w(4),alignSelf:'flex-start', fontSize:14}}>Trip Kode: {item.orderCode} </Text>
									<Text style={{ marginLeft:w(4),alignSelf:'flex-start', fontSize:14}}>12/12/2019 </Text>
								</Col>
							</Grid>
						  </Left>
						  <Right>
							<Text style={{width:w(28), color:'red'}}>{convertToRupiah(item.amount)}</Text>
						  </Right>
					   </ListItem>
					   )
					  }
					 
					  )
					}	
						
						
						
						
					</List>						
				  </Body>
				</CardItem>
          </Card>
			
		</Content>
		
			<Button onPress={() => { this.props.navigation.navigate('Home') }}
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
					<Button style={{ flex: 0, width: 70 }} onPress={ () => this.props.navigation.navigate('Home') }>
					  <Icon active name="navigate" />
					</Button>
					<Button onPress={() => this.props.navigation.navigate('Wallet') }>
					  <Icon type="MaterialCommunityIcons" name="wallet-outline" style={{ color: '#37A000' }}/>
					  <Text style={{ color:'#37A000', textTransform:'capitalize',fontSize:10 }}>Dompet</Text>
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
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  
  title: {
	marginLeft:w(5),  
  },
  textTitle: {
	fontSize: 14,
	marginLeft:w(4),
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
  cardBank: {
	  width:w(66),
	  height:h(20),
	  borderRadius:10,
	  marginLeft:'auto',
	  marginRight:'auto',
  },
  icon: {
    width: w(100),
    height: h(22.5),
    marginTop: h(0),
    marginBottom: h(2),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const mapStateToProps = state => {
	//console.log(state)
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Wallet)