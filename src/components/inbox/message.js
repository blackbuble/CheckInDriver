import React, { Component } from 'react';
import { StatusBar, StyleSheet,  Image, View, BackHandler } from 'react-native';
import { w, h, totalSize } from '../../api/Dimensions';
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
  H3,
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

class Message extends Component {
  
   constructor(props) {
   super(props);	
   
   this.state ={ user:'',message:[] }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
   }  

  componentDidMount() {
	
	const { navigation } = this.props;
	const ref = Firebase.firestore().collection('inbox').doc(JSON.parse(navigation.getParam('messagekey')));
	console.log(ref)
	ref.get().then((doc) => {
		if (doc.exists) {
		  this.setState({
			message: doc.data(),
			key: doc.id,
			isLoading: false
		  });
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
	  this.props.navigation.navigate('Inbox');
	  return true;
	}	
  
	
  render() {
    return (
		<Container>
			<Header style={{ backgroundColor:'#37A000',height:h(12.5)}}>
				 <GeneralStatusBarColor backgroundColor="#37A000"
			  barStyle="light-content"/>
			  <Left>
					<Button transparent style={{width:100}} onPress={() => this.props.navigation.navigate('Inbox')}>
									<Icon style={{ color:'white'}} name='arrow-back' />
						</Button>  
			  </Left>	
			  <Body />
			   <Right>
				<Button transparent>
					<Icon type="Feather" name='trash-2' style={{ color: 'white', fontSize:28}} />
				</Button>
			  </Right>
			
			</Header>
			<Content>
				<View style={{ backgroundColor:'#37A000',height:h(15)}}> 
				<View 
				  style={{ alignSelf: 'center', position: 'absolute', elevation: 4, height: 70, width: 70, bottom: 0, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 35, backgroundColor: '#ffffff', justifyContent: 'center', top:h(10) }} active>
					   <Icon type="FontAwesome5" active name="bullhorn" style={{ color: 'grey', fontSize:30, marginLeft:'auto', marginRight:'auto' }} />
					   
				</View>
					
				</View>	
				
				<Content padder>
				<View style={{marginTop:h(10)}}>
					<H3>{this.state.message.title}</H3>
				  </View>
				  <View style={{marginTop:h(6)}}>
					<Text style={{fontSize:16}}>{this.state.message.body}</Text>
				  </View>
				   <Button success onPress={() => this.props.navigation.navigate('Home')}  style={styles.buttonVisit}>
                    <Text style={styles.buttonText}>Kunjungi</Text>
                </Button>
				</Content>
			
			  
			</Content>	
			
			
			
			  
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
  buttonVisit: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        justifyContent: 'center',
		alignItems: 'center',
        borderRadius: 5,
        
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
)(Message)