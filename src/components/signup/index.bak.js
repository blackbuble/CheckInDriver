import React, {Component} from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, TouchableHighlight, Image, ScrollView, BackHandler,Alert} from 'react-native'
import { Container, Content, Text, Label, Input, Header, Left, Right, Body, Title, Button, Separator, Picker, Toast, Item, Icon} from 'native-base'
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';
import { w, h, totalSize } from '../../api/Dimensions'
import Firebase from '../../../config/Firebase'
import firebase from 'react-native-firebase';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail, updatePassword, signup } from '../../actions/user'
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const uri = "https://style.anu.edu.au/_anu/4/images/placeholders/person.png";
const url =  'https://via.placeholder.com/250x150.png?text=Upload+Photo';
const companyLogo = require('../../assets/logo.png');

const INITIAL_STATE = {
  fullname: '',
  email: '',
  password: '',
  passwordOne: '',
  reference: '',
  mobile_phone: '',
  error: null,
  loading: false,
  showNextForm: false,
  showForm: false,
  showSearch: true,
  showNext: false,
  showNextNav: false,
  avatar:false,
  photo: null,
  photoID: null,
  photoDL: null,
  photoVD:null,
  photoIDCard: '',
  photoSIM: '',
  photoSTNK:'',
   photoURI: '',
  car_type: '',
  car_number: '',
  working_area: '',
  category: '',
  bank: {
	  bank_name: '',
	  account_number: '',
	  account_owner: '',
  }, 
  avatar: '',
  folder: '',
  balance: 0,
  isComplete: false,
  isActive: false,
};

class Signup extends Component {
     
	constructor(props) {
    super(props)
	this.state = { ...INITIAL_STATE };
    //Binding handleBackButtonClick function with this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
	
	handleSignUp = () => {
        const { email, password } = this.state
        Firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => 
				Firebase.auth().signOut(),
				this.props.navigation.navigate('Signin')
				//alert('Register Success')
			)
            .catch(error => console.log(error))
			//this.props.signup()
			this.setState({ ...INITIAL_STATE });
    }
	
	componentDidMount() {
		  this.getFcmToken();
    // This is the first method in the activity lifecycle
    // Addding Event Listener for the BackPress 
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}
	componentWillUnmount() {
    // This is the Last method in the activity lifecycle
    // Removing Event Listener for the BackPress 
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}
	
	handleBackButtonClick() {
		this.props.navigation.navigate('Signin');
		return true;
	}
	
	getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
	  this.setState({fcmToken: fcmToken});
	  //console.log(this.state)
      //this.showAlert('Your Firebase Token is:', fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
  }
  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }
	
	// Search Page
	renderSearch() {
	 if(this.state.showSearch) {
		 return(
		 <>
		 
		   <Image
            style={styles.icon}
            resizeMode="contain"
            source={companyLogo}
          />	
		  <Label style={styles.capturebtntxt}>Masukkan Referensi Pendaftaran Anda </Label>
		  <Item>
            <Icon type='MaterialCommunityIcons' name='share-variant' style={{color:'grey'}}/>
            <Input placeholder='Referensi' placeholderTextColor='grey' value={this.state.reference} onChangeText={reference=>this.setState({reference})}/>
          </Item>
		  <Button success
            style={[styles.buttonContainer, styles.loginButton]}
			onPress={this.onSearch}
             >
            <Text style={styles.loginText}>Temukan</Text>
		  </Button>
		  {this.renderButtonOrLoading()}	
		 </>
		 )
	 }	
	}
	
	onSearch = () => {
	  this.setState({loading: true}); 
	  const { reference } = this.state;
	  Firebase.firestore().collection('referees')
	  .where("name", "==" , this.state.reference)
	  .get()
	  .then((querySnapshot) => {
	
		if(querySnapshot.size > 0){
			this.setState({ showForm: true, showSearch: false, showNext: true, loading: false });
			//console.log(this.state)
		}
		else{
			Toast.show({
				text: "Referensi Tidak Ada Dalam Database",
                duration: 3000,
                position: "top",
				type: "danger",
              })
			  this.setState({loading:false});
		}
	  })	
	  .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
	  
  }
    // End Search Page
	
	// Register Page
	
	renderForm(){
	 if(this.state.showForm){
		 const { photo,email,password,passwordOne,fullname,mobile_phone, loading } = this.state
		 const isInvalid = password !== passwordOne || 
						   email === '' || fullname === '' || mobile_phone === '' || fullname === '' || photo === '';  	
	 return(
	 <>
		  <ScrollView>
			<Image style={{width:150,height:150,borderRadius: 150/2,marginLeft: 'auto', marginRight: 'auto'}} source={ this.state.photo == null? {uri:uri} : { uri: photo.uri }} />
			
			
			<Button transparent style={styles.capturebtn} onPress={()=>this.handleChoosePhoto('Avatar')}>
				<Icon name="camera" type="MaterialCommunityIcons" style={styles.capturebtnicon}/>
				<Text style={styles.capturebtntxt} uppercase={false}>Open Camera</Text>
			</Button>   
			
		 
		  <Item>
            <Icon type='MaterialIcons' name='person-outline' />
            <Input placeholder='Fullname' value={this.state.fullname} onChangeText={fullname=>this.setState({fullname})}/>
          </Item>
		  
		  <Item>
            <Icon type='MaterialCommunityIcons' name='email-outline' />
            <Input placeholder='Email' value={this.state.email} onChangeText={email=>this.setState({email})}/>
          </Item>
		  
		   <Item>
            <Icon type="SimpleLineIcons" name='screen-smartphone' />
            <Input placeholder='Mobile Phone' keyboardType={'numeric'} value={this.state.mobile_phone} onChangeText={mobile_phone=>this.setState({mobile_phone})}/>
          </Item>
		  
		   <Item>
            <Icon type='MaterialCommunityIcons' name='key-outline' />
            <Input secureTextEntry={true} placeholder='Password' value={this.state.password} onChangeText={password=>this.setState({password})}/>
          </Item>
		  
		   <Item>
            <Icon type='MaterialCommunityIcons' name='key-outline' />
            <Input secureTextEntry={true} placeholder='Re-Password' value={this.state.passwordOne} onChangeText={passwordOne=>this.setState({passwordOne})}/>
          </Item>
		  {this.renderButtonOrLoading()}	
		 </ScrollView>  
	 </>
	 );
	 }
 }
 
 renderButtton() {
	 if(this.state.showNext){
	 return(
	 <Button transparent onPress={this.NextNav}>
		<Text style={{ color: 'green'}}>Lanjut</Text>
	 </Button>
	 )
	 }
	 if(this.state.showNextForm){
	 return(
	 <Button transparent onPress={this.onSubmit}>
		<Text style={{ color: 'green'}}>Simpan</Text>
	 </Button>
	 )
	 }
 }
	
	NextNav = () =>{
			this.setState({ showNextForm: true, showForm: false, showNext: false, showNextNav:true, loading: false });
	}
	
	
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
     /*  if (response.uri) {
        this.setState({ photo: response, photoURI: temp })
		//console.log(this.state)
      } */
	  //console.log(viewId)
	  console.log(temp)
	  console.log(viewId)
	  if (response.uri) {
		switch(viewId){
			case 'Avatar':
					this.setState({ photo: response, photoURI: temp })
					console.log(this.state.photo)
			break;
			
			case 'KTP':
					this.setState({ photoID: response,photoIDCard: temp })
					console.log(this.state.photoID)
					console.log(this.state.photoIDCard)
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
		console.log(viewId)
		console.log(this.state.photoIDCard)
      }
	})
 }
 
  onSubmit = () => {
	  this.setState({loading: true}); 
	  const { email, password, passwordOne,fullname,mobile_phone,photo,reference,photoURI,balance,photoIDCard,photoSIM,photoSTNK,car_type,car_number,working_area,category,bank,isActive, createdAt, fcmToken } = this.state;
	  //console.log(this.state)
	  if(password == passwordOne) {
	  Firebase.auth().createUserWithEmailAndPassword(email, password)
	  .then((authData) => {
				
		  //this.setState({ folder: authData.user.uid});
		  //this.uploadTask();	
		  
		  //this.userProfile();
		  const user = { email, fullname, mobile_phone, reference,photoURI, balance, photoIDCard,photoSIM,photoSTNK,car_type,car_number,working_area,category,bank, isActive, fcmToken, createdAt:new Date()}
		  console.log(user)
		  let userID = authData.user.uid
		  console.log(authData.user)
		  Firebase.firestore().collection('drivers').doc(userID).set(user)
		  .then( (data) => {
			  
			  const inbox = { title:'Selamat Bergabung', body:'Hai..selamat bergabung dengan CheckIn. Untuk mendapatkan order terbaru, selalu cek aplikasi CheckIn', key: userID, visible:true, status:'Unread', createdAt: new Date()}
			  Firebase.firestore().collection('inbox').doc().set(inbox)
			  this.setState({ loading: false})
			  //Setup Storage
			  //this.storeToken();
				Firebase.auth().signOut(),
				this.props.navigation.push('Signin')
			  Toast.show({
				text: "Pendaftaran sukses dilakukan.",
                duration: 10000,
                position: "top",
				type: "success",
              })
			  //this.props.history.push(ROUTES.SIGNIN);
			  //this.props.navigation.navigate('Signin');
		  })
		  
	  })
	  .catch(error => Toast.show({
				text: error.message,
                duration: 15000,
                position: "top"
              }))
	  }
	  else{
		  Toast.show({
				text: "Password tidak sama",
                duration: 3000,
                position: "top"
              })
	  }
  }
	// End 1st Form
	
	// Start 2nd Form
	
	renderNextForm() {
		if(this.state.showNextForm){
			 const { photoID, photoDL, photoVD, car_type, car_number, working_area, category,bank_name, account_owner,account_number, loading } = this.state
			return(
					<>
						<ScrollView >
							
							<Separator bordered>
									<Text style={{fontSize:14}}>Tanda Pengenal</Text>
							</Separator>
							<Label style={{fontSize:15, fontWeight:'bold', marginBottom:h(2), marginTop:h(2),marginLeft:w(4), color:'grey'}}>Upload KTP</Label>
							<Image style={{width:250,height:150,borderRadius: 20,marginLeft: 'auto', marginRight: 'auto'}} source={ this.state.photoID == null? {uri:url} : { uri: photoID.uri }} />
							<Button transparent style={styles.capturebtn} onPress={()=>this.handleChoosePhoto('KTP')}>
								<Icon name="camera" type="MaterialCommunityIcons" style={styles.capturebtnicon}/>
								<Text style={styles.capturebtntxt} uppercase={false}>Open Camera</Text>
							</Button>  
							
							<Label style={{fontSize:15, fontWeight:'bold', marginBottom:h(2), marginTop:h(2),marginLeft:w(4), color:'grey'}}>Upload SIM</Label>
							<Image style={{width:250,height:150,borderRadius: 20,marginLeft: 'auto', marginRight: 'auto'}} source={ this.state.photoDL == null? {uri:url} : { uri: photoDL.uri }} />
							<Button transparent style={styles.capturebtn} onPress={()=>this.handleChoosePhoto('SIM')}>
								<Icon name="camera" type="MaterialCommunityIcons" style={styles.capturebtnicon}/>
								<Text style={styles.capturebtntxt} uppercase={false}>Open Camera</Text>
							</Button>  
							
							<Label style={{fontSize:15, fontWeight:'bold', marginBottom:h(2), marginTop:h(2),marginLeft:w(4), color:'grey'}}>Upload STNK</Label>
							<Image style={{width:250,height:150,borderRadius: 20,marginLeft: 'auto', marginRight: 'auto'}} source={ this.state.photoVD == null? {uri:url} : { uri: photoVD.uri }} />
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
							
							{this.renderButtonOrLoading()}	
							
						</ScrollView>
					</>
			);		
		}
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
	
	renderButtonOrLoading(){
	   if (this.state.loading) {
			 return   <Spinner
				  visible={this.state.loading}
				  color="green"
				  overlayColor={'rgba(255,255,255,0.9)'}
				  textContent={'Loading...Please Wait'}
				  textStyle={styles.spinnerTextStyle}
				/>
	   }
	}
	
	render() {
        return (
            <Container>
				<Header transparent>
				  <GeneralStatusBarColor backgroundColor="white"
			  barStyle="dark-content"/>
			  
					<Left>
						<Button transparent style={{width:100}} onPress={() => this.props.navigation.navigate('Signin')}>
									<Text style={{ fontSize:16,color: 'green'}}>Batal</Text>
						</Button>   
					</Left>
				  <Body>
					<Title style={{ color: 'green', textAlign: 'center', left: w(22) }}>Daftar</Title>
				  </Body>
				  <Right>
					{ this.renderButtton() }
				  </Right>
				</Header>
			   
				<Container style={{marginLeft:w(2), marginRight:w(2)}}>
				 <KeyboardAwareScrollView
				 
				>
					
					{ this.renderSearch() }
					{ this.renderForm() }
					{ this.renderNextForm() }
					</KeyboardAwareScrollView>
					</Container>
			</Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
	icon: {
		width: w(70),
		height: h(20),
		marginTop: h(5),
		marginBottom: h(1),
		marginLeft: 'auto',
		marginRight: 'auto',
	},
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#FFA611',
        borderColor: '#FFA611',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    buttonSignup: {
        fontSize: 12
    },
	loginButton: {
		backgroundColor: '#37A000',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop:h(4)
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
		color:'#AAAAAA'
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
		width:w(50)
	},
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateEmail, updatePassword, signup }, dispatch)
}

const mapStateToProps = state => {
	console.log('This come from signup', state)
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Signup)