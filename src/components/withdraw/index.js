import React, { Component } from 'react';
import { StatusBar, StyleSheet,  Image, BackHandler } from 'react-native';
import { w, h, totalSize } from '../../api/Dimensions';
import Firebase from '../../../config/Firebase'
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
  Toast,
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


class Payout extends Component {
  
   constructor(props) {
   super(props);	
   this.state ={ payout:'' }
   this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
   }  

  _withdraw = () => {
	  const {payout} = this.state
	  const uid = Firebase.auth().currentUser.uid;
	  //alert(uid)
	  if(this.state.payout > this.props.user.balance || this.state.payout <= 0 ) {
		  alert("You don't have enough fund")
	  }
	  else {
		  const inbox = { title:'Permintaan Withdraw', body:'Hai..permintaan withdraw mu tengah kami proses. Tunggu kabar selanjutnya ya.', key: uid, createdAt: new Date()}
		  const transaction = { title:'Withdraw Request dari ' + this.props.user.fullname , amount:this.state.payout, key: uid, createdAt: new Date()}
		  const balance = {balance:this.props.user.balance - this.state.payout}
		  Firebase.firestore().collection('transaction').doc().set(transaction)
		  Firebase.firestore().collection('inbox').doc().set(inbox)
		  //Firebase.firestore().collection('drivers').doc(uid).update(balance)
		  Toast.show({
				text: "Permintaan Withdraw telah dikirim. Tunggu kabar selanjutnya dari kami",
                duration: 10000,
                position: "top",
				type: "success",
           })
	  }
	}
	
	componentDidMount() {
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
	 const {payout} = this.state
    return (
		   <Container>
        <Header transparent >
		 <GeneralStatusBarColor backgroundColor="white"
      barStyle="dark-content"/>
          <Left>
				<Icon style={{ color: 'green'}} name="arrow-back" onPress={ () => this.props.navigation.navigate('Wallet')}></Icon>
		  </Left>	
		  <Body>
				<Title style={{ color: 'green', textAlign: 'center', left: w(8) }}>Withdraw</Title>
		  </Body>
		 
        </Header>
		<Content padder>
			<Image  style={styles.icon}
            resizeMode="contain"
            source={bank} />
			
			<Card>
            <CardItem header>
              <Text>Available Balance: </Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <H2>
                  Rp {this.props.user.balance}
                </H2>
              </Body>
            </CardItem>
             <CardItem footer bordered>
              <Text>Withdraw Hanya Dilayani pada Hari Selasa(Shuttle) & Rabu(Rental)</Text>
            </CardItem>
          </Card>
				
			<Content >
			<Form>
            <Item floatingLabel>
              <Label>Jumlah Withdraw</Label>
              <Input value={this.state.payout} onChangeText={payout=>this.setState({payout}) } keyboardType={'numeric'} />
            </Item>
			<Button success style={styles.buttonContainer} onPress={()=>this._withdraw()}><Text>Withdraw</Text></Button>
			</Form>
			  
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
	marginTop:20,
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
	console.log(state)
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Payout)