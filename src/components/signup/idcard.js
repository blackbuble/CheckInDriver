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
  Card,
  CardItem,
  Thumbnail,
  Badge,
  Label,
  Item,
  Input,
  Toast,
  List,
  ListItem,
  Separator,
  Form,
  Picker,
} from 'native-base';
import {
  NativeRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-native';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, StatusBar, AsyncStorage, KeyboardAvoidingView,TouchableHighlight, Image, Alert } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { w, h, totalSize } from '../../api/Dimensions';
import * as ROUTES from '../../constants/routes';
import * as firebase from 'firebase'
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';

const uri =  'https://via.placeholder.com/250x150.png?text=Upload+Photo';
const companyLogo = require('../../assets/logo.png');

/* const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs

window.Blob = Blob */

const INITIAL_STATE = {

  error: null,
  loading: false,
  showForm: true,
  photoID: null,
  photoDL: null,
  photoVD:null,
  photoIDCard: '',
  photoSIM: '',
  photoSTNK:'',
  car_type: '',
  car_number: '',
  working_area: '',
  category: '',
  bank: {
	  bank_name: '',
	  account_number: '',
	  account_owner: '',
  },  
  uid: '',
  isComplete: false,
  isActive: false,
};

const options = {
  title: 'Select Avatar',
 
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class NextPage extends Component {
 constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE};
  }
   
  componentDidMount() {
	//this.getToken();
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			this.setState({ uid: user.uid})
		}
	})
	console.log(this.props)
  }	
  
  async getToken(user) {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
	  let isLogin = await AsyncStorage.getItem("isLogin");
	  let isLoginData = JSON.parse(isLogin);
      console.log(data);
	  console.log(data.uid);
	  console.log("isLogin is:" + isLoginData);
	  this.setState({uid: data.uid});
	  console.log(this.state)
	  //this.userData(data.uid);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  
  async componentWillMount() {
	  let isComplete =  await AsyncStorage.setItem("isComplete", JSON.stringify(false));
	  
  }
  
  handleChange(e) {
    const names = e.target.name.split("_");
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState((state) => {
      state[names[0]][names[1]] = value;
      return {[names[0]]: state[names[0]]};
    });
  }
  
  handleClick = viewId => {
    Alert.alert('Alert', 'Button pressed ' + viewId);
  };
  
  handleChoosePhoto = viewId => {
    const options = {
      noData: false,
	  skipBackup: true,
	  quality: 0.1
    }
    //ImagePicker.launchImageLibrary(options, response => {
		 ImagePicker.launchCamera(options, (response) => {
			var temp 
			temp = 'data:image/jpeg;base64,' + response.data ;
			/* temp = response.data ; */
			//console.log(response)
			//console.log(temp)
			console.log(viewId)
			console.log(temp)
			
      if (response.uri) {
		switch(viewId){
			case 'KTP':
					this.setState({ photoID: response,photoIDCard: temp })
					console.log(this.state.photoID)
			break;
				
			case 'SIM':	
					this.setState({ photoDL: response,photoSIM: temp })
					console.log(this.state.photoDL)
			break;
			
			case 'STNK':
					this.setState({ photoVD: response,photoSTNK: temp })
					console.log(this.state.photoVD)
			break;
		}  
        //this.setState({ photo: response,photoURI: temp })
		console.log(this.state)
      }
	})
 }

   onValueChange(value: string) {
	if( value != 0) {   
		this.setState({
		  category: value
		});	
		console.log(value)	
	   }
   } 
   
   onValueChange2(value: string) {
	if( value != 0) {   
		this.setState({
		  working_area: value
		});	
		console.log(value)	
	   }
   }
   
   
  
  onSubmit = () => {
	  //this.setState({loading: true}); 
	  const { photoIDCard,photoSIM,photoSTNK,car_type,car_number,working_area,category,bank,uid } = this.state;
	  console.log(this.state)
	  let data = {photoIDCard,photoSIM,photoSTNK,car_type,car_number,working_area,category,bank, isComplete:true}
	  firebase.firestore().collection('drivers').doc(uid).set(data, {merge: true})
	  .then( (data) => {
			console.log("Document successfully written!");
			AsyncStorage.setItem("nerd", JSON.stringify(false));
			AsyncStorage.removeItem("isComplete");
			Toast.show({
				text: "Terimakasih telah melengkapi data pribadi Anda.",
                duration: 10000,
                position: "top",
				type: "success",
              })
			this.props.history.push(ROUTES.HOME);
		})
		.catch(function(error) {
			console.error("Error writing document: ", error);
		});
  }
  
 
 
 renderForm(){
	 if(this.state.showForm){
		 const { photoID, photoDL, photoVD, car_type, car_number, working_area, category,bank_name, account_owner,account_number, loading } = this.state
		 const isInvalid =  photoID === '' || photoDL === '' || photoVD === '';  	
	 return(
			<>
		  
			<Separator bordered>
					<Text style={{fontSize:14}}>Tanda Pengenal</Text>
			</Separator>
		  
			<Label style={{fontSize:15, fontWeight:'bold', marginBottom:h(2), marginTop:h(2),marginLeft:w(4), color:'grey'}}>Upload KTP</Label>
			<Image style={{width:250,height:150,borderRadius: 20,marginLeft: 'auto', marginRight: 'auto'}} source={ this.state.photoID == null? {uri:uri} : { uri: photoID.uri }} />
			<Button transparent style={styles.capturebtn} onPress={()=>this.handleChoosePhoto('KTP')}>
				<Icon name="camera" type="MaterialCommunityIcons" style={styles.capturebtnicon}/>
				<Text style={styles.capturebtntxt} uppercase={false}>Open Camera</Text>
			</Button>  
			
			<Label style={{fontSize:15, fontWeight:'bold', marginBottom:h(2), marginTop:h(2),marginLeft:w(4), color:'grey'}}>Upload SIM</Label>
			<Image style={{width:250,height:150,borderRadius: 20,marginLeft: 'auto', marginRight: 'auto'}} source={ this.state.photoDL == null? {uri:uri} : { uri: photoDL.uri }} />
			<Button transparent style={styles.capturebtn} onPress={()=>this.handleChoosePhoto('SIM')}>
				<Icon name="camera" type="MaterialCommunityIcons" style={styles.capturebtnicon}/>
				<Text style={styles.capturebtntxt} uppercase={false}>Open Camera</Text>
			</Button>  
			
			<Label style={{fontSize:15, fontWeight:'bold', marginBottom:h(2), marginTop:h(2),marginLeft:w(4), color:'grey'}}>Upload STNK</Label>
			<Image style={{width:250,height:150,borderRadius: 20,marginLeft: 'auto', marginRight: 'auto'}} source={ this.state.photoVD == null? {uri:uri} : { uri: photoVD.uri }} />
			<Button transparent style={styles.capturebtn} onPress={()=>this.handleChoosePhoto('STNK')}>
				<Icon name="camera" type="MaterialCommunityIcons" style={styles.capturebtnicon}/>
				<Text style={styles.capturebtntxt} uppercase={false}>Open Camera</Text>
			</Button>   
			
			<Separator bordered>
					<Text style={{fontSize:14}}>Kendaraan</Text>
			</Separator>
			
			<Content padder>
			<Label style={{fontSize:15, fontWeight:'bold', marginTop:h(2),marginLeft:w(1), color:'grey'}}>Jenis Kendaraan</Label>
			<Item>
              <Icon type="MaterialCommunityIcons" active name='car-sports' />
			  <Input placeholder="Ex: Toyota Avanza" style={{fontSize:15}} value={this.state.car_type} onChangeText={car_type=>this.setState({car_type})}/>
            </Item>	
			
			<Label style={{fontSize:15, fontWeight:'bold', marginTop:h(2),marginLeft:w(1), color:'grey'}}>Plat Nomor</Label>
			<Item>
			  <Icon type="MaterialCommunityIcons" active name='card-text-outline' />
              <Input placeholder="Ex: L 1234 AJ" style={{fontSize:15}} value={this.state.car_number} onChangeText={car_number=>this.setState({car_number})}/>
            </Item>	
			 
			<Label style={{fontSize:15, fontWeight:'bold',  marginTop:h(2),marginLeft:w(1), color:'grey'}}>Area Kerja</Label>
			<Item picker>
			  <Icon type="MaterialCommunityIcons" active name='radar' />
				  <Picker
					mode="dropdown"
					iosIcon={<Icon name="arrow-down" />}
					style={{ width: undefined }}
					placeholder="Area Kerja"
					placeholderStyle={{ color: "#bfc6ea" }}
					placeholderIconColor="#007aff"
					selectedValue={this.state.working_area}
					onValueChange={this.onValueChange2.bind(this)}
					itemStyle={{
								  color: "red",
								  fontFamily: "Georgia",
								  fontSize: 50,
								  backgroundColor: "green",
								  textAlign: 'left',
								}}
					textStyle={{color:'#37A000'}}			
				  >
					<Picker.Item label="Area Kerja" value="0" />
					<Picker.Item label="Bandung" value="Bandung" />
					<Picker.Item label="Jabodetabek" value="Jabodetabek" />
					<Picker.Item label="Jogjakarta" value="Jogjakarta" />
					<Picker.Item label="Lombok" value="Lombok" />
					<Picker.Item label="Makassar" value="Makassar" />
					<Picker.Item label="Surabaya" value="Surabaya" />
				  </Picker>
			</Item>
			
			<Label style={{fontSize:15, fontWeight:'bold', marginTop:h(2),marginLeft:w(1), color:'grey'}}>Kategori</Label>
			<Item picker>
			  <Icon type="MaterialCommunityIcons" active name='car-multiple' />
				  <Picker
					mode="dropdown"
					iosIcon={<Icon name="arrow-down" />}
					style={{ width: undefined }}
					placeholder="Kategori"
					placeholderStyle={{ color: "#bfc6ea" }}
					placeholderIconColor="#007aff"
					selectedValue={this.state.category}
					onValueChange={this.onValueChange.bind(this)}
					itemStyle={{
								  color: "red",
								  fontFamily: "Georgia",
								  fontSize: 50,
								  backgroundColor: "green",
								  textAlign: 'left',
								}}
					textStyle={{color:'#37A000'}}			
				  >
					<Picker.Item label="Kategori" value="0" />
					<Picker.Item label="Shuttle" value="Shuttle" />
					<Picker.Item label="Rental" value="Rental" />
					
				  </Picker>
			</Item>
			</Content>
			
			<Separator bordered>
					<Text style={{fontSize:14}}>Rekening</Text>
			</Separator>
			
			<Content padder>
			<Label style={{fontSize:15, fontWeight:'bold', marginTop:h(2),marginLeft:w(1), color:'grey'}}>Nama Bank</Label>
			<Item>
              <Icon type="MaterialCommunityIcons" active name='bank' />
			  <Input placeholder="Ex: BCA" style={{fontSize:15}} value={this.state.bank_name} onChangeText={bank_name=>this.setState(prevState => ({
			  bank: {                   // object that we want to update
					...prevState.bank,    // keep all other key-value pairs
					bank_name: bank_name       // update the value of specific key
				}
			}))
			  }/>
            </Item>	
			
			<Label style={{fontSize:15, fontWeight:'bold', marginTop:h(2),marginLeft:w(1), color:'grey'}}>Pemilik Rekening</Label>
			<Item>
			  <Icon type="MaterialCommunityIcons" active name='human' />
              <Input placeholder="Nama Pemilik Rekening" style={{fontSize:15}} value={this.state.account_owner} onChangeText={account_owner=>this.setState(prevState => ({
			  bank: {                   // object that we want to update
					...prevState.bank,    // keep all other key-value pairs
					account_owner: account_owner       // update the value of specific key
				}
			}))
			  }/>
            </Item>	
			
			<Label style={{fontSize:15, fontWeight:'bold', marginTop:h(2),marginLeft:w(1), color:'grey'}}>Nomer Rekening</Label>
			<Item>
			  <Icon type="MaterialCommunityIcons" active name='account-card-details-outline' />
              <Input keyboardType={'numeric'} placeholder="Nomer Rekening" style={{fontSize:15}} value={this.state.account_number} onChangeText={account_number=>this.setState(prevState => ({
				bank: {                   // object that we want to update
					...prevState.bank,    // keep all other key-value pairs
					account_number: account_number       // update the value of specific key
				}
			}))

			}/>
            </Item>	
			</Content>
		  
			<Button success style={{alignItems:"center", justifyContent:"center"}} onPress={this.onSubmit}><Text style={{ fontSize:18}}>Simpan</Text></Button>
		  {this.renderButtonOrLoading()}	
		 
		</>
	 );
	 }
 }
 
 renderButtton() {
	 if(this.state.showNext){
	 return(
	 <Button transparent onPress={this.onSubmit}>
		<Text style={{ color: 'green'}}>Lanjut</Text>
	 </Button>
	 )
	 }
 }

renderButtonOrLoading(){
	   if (this.state.loading) {
			 return   <Spinner
				  visible={this.state.loading}
				  color="green"
				  textContent={'Loading...Please Wait'}
				  textStyle={styles.spinnerTextStyle}
				/>
	   }
 }

  render() {
	  
    return (	
      <Container>
        <Header transparent noLeft>
		  <GeneralStatusBarColor backgroundColor="white"
      barStyle="dark-content"/>
	  
			<Left />
                    
          <Body>
            <Title style={{ color: 'green', textAlign: 'center', width:w(50), fontSize:18 }}>Pendaftaran Lanjut</Title>
          </Body>
          <Right>
		   { this.renderButtton() }
		  </Right>
        </Header>
       
			<Content>
	
	    { this.renderForm() }
		
		 
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
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    borderColor: '#37A000',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: w(90),
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderColor: '#37A000',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
	marginTop:20,
  
    width: w(90),
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#37A000',
  },
  loginText: {
    color: 'white',
    textTransform: 'uppercase',
  },
  icon: {
    width: w(70),
    height: h(20),
    marginTop: h(5),
    marginBottom: h(1),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  spinnerStyle: {
    flex: 1,
    alignSelf:'center',
	position: 'absolute'
},
 capturebtntxt:{
    alignSelf:'center',
    fontSize:15,
    fontFamily:'Gotham-Medium',
    color:'#AAAAAA',
	
  },
  capturebtnicon:{
    flexDirection: 'column',
    color:'#E3E3E3',
    fontSize:35
  },
  capturebtn:{
	marginTop: 10,  
	marginLeft:'auto',
	marginRight: 'auto',
    elevation:0,
    borderColor:'#e5e5e5',
    borderWidth:1,
    borderRadius:7,
    justifyContent:'center',
    alignItems:'center',
    width:w(50),
	marginBottom:h(2)
  },
});

export default NextPage;