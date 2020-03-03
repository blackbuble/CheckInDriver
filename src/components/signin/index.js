import React, {Component} from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Container, Content, Header, Text, Label, Input, Item, Icon, Button, Toast} from 'native-base'
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';
import { w, h, totalSize } from '../../api/Dimensions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail, updatePassword, signin, getUser, getOrders } from '../../actions/user'
import Firebase from '../../../config/Firebase'
import Spinner from 'react-native-loading-spinner-overlay';



const companyLogo = require('../../assets/logo.png');

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  loading: false,
  
};

class Signin extends Component {
	constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
	}
    
	
	componentDidMount = () => {
		/* Firebase.auth().onAuthStateChanged(user => {
			if (user) {
				console.log(user.uid)
                this.props.getUser(user.uid)
                if (this.props.user != null) {
                    this.props.navigation.navigate('Home')
                }
            }
        }) */
    }
		
	handleSignIn = () => {
		console.log(this.state)
		//this.renderButtonOrLoading()
		this.props.signin(this.props.navigation)
		console.log('This is user data', this.props.user)
		//this.props.navigation.navigate('Home')
		this.setState({ ...INITIAL_STATE });
		//console.log(this.state)
        
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
		const { email, password, error, loading } = this.state;
		const isInvalid = password === '' || email === '';  
        return (
           <Container>
				
				<GeneralStatusBarColor backgroundColor="white"
				barStyle="dark-content"/>
				<Content style={{marginLeft:w(8), marginRight:w(8)}}>
					<Image
						style={styles.icon}
						resizeMode="contain"
						source={companyLogo}
					  />
					<Item>
						<Icon type='MaterialCommunityIcons' name='email-outline' style={{color:'grey'}}/>
						<Input 
						placeholder='Email'
						placeholderTextColor="grey" 
						value={this.props.user.email}
						onChangeText={email => this.props.updateEmail(email)}
						autoCapitalize='none'style={styles.inputText}/>
					</Item>
					<Item>
						<Icon type='MaterialCommunityIcons' name='key' style={{color:'grey'}}/>
						<Input placeholder='Password'
						placeholderTextColor="grey" 
						value={this.props.user.password}
						onChangeText={password => this.props.updatePassword(password)}
						placeholder='Password'
						secureTextEntry={true}/>
					</Item>
              
                
                <Button success onPress={this.handleSignIn}  style={styles.buttonLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Button>
                <Button transparent
                    onPress={() => this.props.navigation.navigate('Signup')}
					style={styles.buttonRegister}
                >
				<Text style={styles.textRegister}>Daftar Akun</Text>
				</Button>
				
				 {this.renderButtonOrLoading()}
				
				</Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    
	inputText: {
		color:'grey'			
	},
    buttonLogin: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        justifyContent: 'center',
		alignItems: 'center',
        borderRadius: 5,
        
    },
    buttonText: {
		textTransform: 'uppercase',
        color: '#fff'
    },
    buttonSignup: {
        fontSize: 12
    },
	icon: {
		width: w(70),
		height: h(40),
		marginTop: h(2),
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	buttonRegister: {
		justifyContent: 'center',
		alignSelf: 'center',
		textAlign:'center'
	},
	textRegister: {
		color:'grey',
		fontSize:16,
		marginTop:h(2)
	},
	spinnerStyle: {
		flex: 1,
		alignSelf:'center',
		position: 'absolute'
	}
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateEmail, updatePassword, signin, getUser, getOrders }, dispatch)
}

const mapStateToProps = state => {
	return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Signin)