import React, {Component} from 'react'
import { View,StyleSheet, Image, BackHandler } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Right, Left, Body, Title, Thumbnail, Badge, Grid, Col, ListItem, List, Separator } from 'native-base';
import { w, h, totalSize } from '../../api/Dimensions';
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';
import { connect } from 'react-redux'
import Firebase from '../../../config/Firebase'

class Profile extends Component {
	
	constructor() {
		super()
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}

	
	componentDidMount(){
		console.log(this.props)
		
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
	
	handleSignout = () => {
        Firebase.auth().signOut()
           this.props.navigation.navigate('Signin')
    }

    render() {
        return (
			<Container>
		  
				<Header style={{ backgroundColor:'#37A000',height:h(12.5)}}>
				 <GeneralStatusBarColor backgroundColor="#37A000"
			  barStyle="light-content"/>
				  <Left>
						<Text style={{ color:'white',fontWeight:'bold', width:w(40), fontSize:22, top:h(2)}} >Akun</Text>
				  </Left>	
				  <Body />
				  <Right />
				
				</Header>
				<Content style={{marginBottom:h(-4)}}>
					 <View style={{ backgroundColor:'#37A000',height:h(14.5)}}>	
						<Grid >
							<Col style={{width:w(30), marginLeft:w(5)}}>
								<Image medium source={{uri: this.props.user.photoURI}} style={styles.avatar}/>
								
							</Col>	
							<Col style={{alignSelf:'flex-start', marginLeft:w(1), top:h(1), width:w(120),top:h(2)}}>
								<Text style={styles.text}>{this.props.user.fullname}</Text>
								<ListItem style={{borderBottomWidth:0}}>
								  <Left style={{marginLeft:w(-4.5),top:h(-1.5), width:w(40)}}>
									 <Text style={styles.textTitle}>Bergabung sejak {new Date(this.props.user.createdAt.toDate()).toLocaleString()}</Text>
									   <Icon type="MaterialCommunityIcons" name="chevron-right"  style={{fontSize:18,color:'white'}}/>
								  </Left>
								  <Body/>
								  <Right />
								</ListItem>
								
														
							</Col>
							
						</Grid>
						
					 </View>
				 
					<List>
						<Separator bordered>
							<Text style={{fontSize:14}}>Umum</Text>
						</Separator>
						<ListItem>
						  <Left>
							  <Text style={{fontSize:16}}>Pusat Bantuan</Text>
						  </Left>
						  <Body />
						  <Right>
							<Icon type="MaterialCommunityIcons" name="chevron-right" />
						  </Right>
						</ListItem>
						<ListItem>
						  <Left>
							  <Text style={{fontSize:16}}>Ketentuan Layanan</Text>
						  </Left>
						  <Body />
						  <Right>
							<Icon type="MaterialCommunityIcons" name="chevron-right" />
						  </Right>
						</ListItem>
						<ListItem>
						  <Left>
							  <Text style={{fontSize:16, width:w(100)}}>Perangkat Terhubung</Text>
						  </Left>
						  <Body />
						  <Right>
							<Icon type="MaterialCommunityIcons" name="chevron-right" />
						  </Right>
						</ListItem>
						<ListItem>
						  <Left>
							  <Text style={{fontSize:16}}>Kebijakan Privasi</Text>
						  </Left>
						  <Body />
						  <Right>
							<Icon type="MaterialCommunityIcons" name="chevron-right" />
						  </Right>
						</ListItem>
						<Separator bordered>
							<Text style={{fontSize:14}}>Dokumen</Text>
						</Separator>
						<ListItem>
						  <Left>
							  <Text style={{fontSize:16}}>Kendaraan</Text>
						  </Left>
						  <Body />
						  <Right>
							<Icon type="MaterialCommunityIcons" name="chevron-right" />
						  </Right>
						</ListItem>
						<ListItem>
						  <Left>
							  <Text style={{fontSize:16}}>Driver</Text>
						  </Left>
						  <Body />
						  <Right>
							<Icon type="MaterialCommunityIcons" name="chevron-right" />
						  </Right>
						</ListItem>
						<Separator bordered>
							<Text style={{fontSize:14}}>Lainnya</Text>
						</Separator>
						<ListItem>
						  <Left />
						  <Body>
							<Button transparent  onPress={ () => this.handleSignout() }>
								<Text style={{fontSize:16,alignItems:'center',justifyContent:'center',marginLeft:w(-7),top:h(-2),textTransform:'uppercase', fontWeight:'bold', color:'grey'}}>Keluar</Text> 
							</Button>
						  </Body>
						  <Right/>
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
							  <Icon type="MaterialCommunityIcons" name="wallet-outline" style={{ color: 'darkgrey' }}/>
							  <Text style={{ color:'darkgrey', textTransform:'capitalize',fontSize:10 }}>Dompet</Text>
							</Button>
							<Button onPress={() =>  this.props.navigation.navigate('Profile')}>
							  <Icon type ="MaterialCommunityIcons" name="account-circle" style={{ color: '#37A000' }}/>
							  <Text style={{ color:'#37A000', textTransform:'capitalize',fontSize:10 }}>Akun</Text>
							</Button>
						  </FooterTab>
					</Footer>      
				
					
				
				
			</Container>
			
            
        )
    }
}

// styles are as before
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
	text: {
		fontSize: 20,
		fontWeight: 'bold',
		color:'white'
	},
	textTitle: {
		fontSize: 12,
		color:'white'
	},
	avatar: {
		height:90,
		width:90,
		borderRadius:45
	},
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Profile)