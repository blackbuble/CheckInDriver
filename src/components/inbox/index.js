import React, { Component } from 'react';
import { StatusBar, StyleSheet,  Image,BackHandler } from 'react-native';
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

class Inbox extends Component {
  
   constructor(props) {
   super(props);	
   
   this.state ={ user:'',inbox:[] }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
   }  

  onCollectionUpdate = (querySnapshot) => {
	  const inbox = [];
	  querySnapshot.forEach((doc) => {
		const { key, body, title } = doc.data();
		inbox.push({
		  keyAccess: doc.id,
		  doc, // DocumentSnapshot
		  body, 
		  title,
		});
	  });
	  this.setState({
		inbox,
		isLoading: false,
	 });
	 console.log(this.state)
	}	
  componentDidMount() {
	 let userID = Firebase.auth().currentUser.uid; 
	 this.setState({userID: userID})
	 this.ref = Firebase.firestore().collection('inbox').where('key', '==',userID).where('visible', '==', true);
	 //console.log(this.ref)
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
			<Header transparent>
				<GeneralStatusBarColor backgroundColor="white" barStyle="dark-content"/>
			  <Left>
					<Text style={{ color:'#37A000',fontWeight:'bold', width:w(40), fontSize:22}} >Inbox</Text>
			  </Left>	
			  <Body />
			   <Right>
				<Button transparent>
					<Icon type="Feather" name='trash-2' style={{ color: 'green', fontSize:28}} />
				</Button>
			  </Right>
			
			</Header>
			<Content>
				<List noIndent>
				{
					  this.state.inbox.map((item,index) => (
					  <ListItem icon style={{marginTop:h(2), marginBottom:h(2), alignItems:'center', justifyContent:'center'}} onPress={() => {
							this.props.navigation.navigate('Message', {
							messagekey: `${JSON.stringify(item.keyAccess)}`,
							});
							}}>
						<Left>
						  
						  <Button style={{ backgroundColor: "#37A000", borderRadius:50 }}>
							<Badge style={{height:h(1), width:w(1), right:0, position:'absolute',zIndex:1}}/>	
							<Icon type="MaterialCommunityIcons" name="email-outline" style={{fontSize:18}}/>
						  </Button>
						</Left>
						<Body style={{height:h(8)}}>
							<Grid >
								<Col>
									<Text style={{fontSize:16, fontWeight:'bold'}}>{item.title}</Text>
									<Text style={{fontSize:14}}>{(item.body).slice(0,35)}</Text>
								</Col>
							</Grid>
							
						</Body>
					</ListItem>
					  ))
				}
					
					
				
					
					
				</List>
				
			
			  
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
					  <Icon type="MaterialCommunityIcons" name="email-outline" style={{ color: '#37A000' }}/>
					  <Text style={{ color:'#37A000', textTransform:'capitalize',fontSize:10 }}>Inbox</Text>
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



const mapStateToProps = state => {
	return {
        user: state.user
    }
}

export default connect(
    mapStateToProps
)(Inbox)