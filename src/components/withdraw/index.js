import React, { Component } from 'react';
import { StatusBar, StyleSheet,  Image, AsyncStorage } from 'react-native';
import { w, h, totalSize } from '../../api/Dimensions';
import { withFirebase } from '../firebase';
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
} from 'native-base';
import {
  NativeRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-native';
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';
import * as ROUTES from '../../constants/routes';
//import * as firebase from 'firebase';

export default class Payout extends Component {
  
   constructor(props) {
   super(props);	
   this.state ={ user:'' }
   }  

  
	
  render() {
    return (
		   <Container>
        <Header transparent >
		 <GeneralStatusBarColor backgroundColor="white"
      barStyle="dark-content"/>
          <Left>
				<Link to='/wallet'><Icon style={{ color: 'green'}} name="arrow-back"></Icon></Link>
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
                  Rp {this.state.user.balance}
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
              <Input keyboardType={'numeric'} />
            </Item>
			<Button success style={styles.buttonContainer}><Text>Withdraw</Text></Button>
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