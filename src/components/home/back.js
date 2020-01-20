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
  ListItem,
 
} from 'native-base';
import {
  NativeRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-native';
import { StyleSheet, View, TouchableOpacity, Platform, StatusBar, AsyncStorage } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import { w, h, totalSize } from '../../api/Dimensions';
import SideBar from '../../components/navigation/sidebar';
import Geolocation from '@react-native-community/geolocation';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import * as ROUTES from '../../constants/routes';
import GeneralStatusBarColor from '../../styles/GeneralStatusBarColor';

const ASPECT_RATIO = w/h;
const LATITUDE =  -6.175392;
const LONGITUDE = 106.827153;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;
const uri = "https://i.pravatar.cc/150?img=52";


export default class HomePage extends Component {
   constructor(props) {
    super(props);		
	this.state = {
	flex: 0,
    isOnDefaultToggleSwitch: true,
    status: 'Online',
	badgeStatus: 'green',
	radius: 200,
	latitude: LATITUDE,
      longitude: LONGITUDE,
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0
      }),
    error: null,
	loading: true,
	user:'',
	key:'',
	};
  }
  
  renderDrawer() {
	return (
     <Container style={{ backgroundColor: '#fff' }}>
        <Header
          style={styles.header}>
		   <GeneralStatusBarColor backgroundColor="white"
      barStyle="dark-content"/>
          
		
		 
        </Header>
        <Content>
		
		  <Container style={styles.headerBody}>
			<Content >
			<Thumbnail large source={{uri: this.state.user.photoURI}} />	
			<Text>{this.state.user.fullname}</Text>
				<Text style={{ fontSize: 14 }}>{this.state.user.mobile_phone}</Text>
				
			</Content>
		  </Container>
		
			
          <ListItem noIndent icon style={{ backgroundColor: "#cde1f9" }}>
			<Left>
				<Icon type="AntDesign" active name="home" />
             </Left>
            <Body><Link to='/profile'>
              <Text>Beranda</Text></Link>
            </Body>
            <Right />
		  </ListItem>
		   <ListItem icon>
            <Left>
				<Icon type="MaterialIcons" name="person-outline" /> 
            </Left>
            <Body><Link to='/profile'>
              <Text>Profile</Text></Link>
            </Body>
            <Right />
          </ListItem>
		  <ListItem icon>
            <Left>
                <Icon type="MaterialCommunityIcons" name="wallet-outline" />
            </Left>
            <Body><Link to='/withdraw'>
              <Text>Dompet</Text></Link>
            </Body>
            <Right />
          </ListItem>
		  <ListItem icon>
            <Left>
                <Icon type="MaterialCommunityIcons" name="map-marker-path" />
            </Left>
            <Body><Link to='/wallet'>
              <Text>Riwayat Order</Text></Link>
            </Body>
            <Right />
          </ListItem>
		  <ListItem icon>
            <Left>
                <Icon type="Ionicons" name="ios-notifications-outline" />
            </Left>
            <Body>
              <Text>Notifikasi</Text>
            </Body>
            <Right />
          </ListItem>
		   <ListItem icon>
            <Left>
                <Icon type="MaterialCommunityIcons" name="contacts" />
            </Left>
            <Body>
              <Text>Contact Support</Text>
            </Body>
            <Right />
          </ListItem>
		  
		  <ListItem itemDivider>
			<Text>Dokumen</Text>
          </ListItem>
		  <ListItem icon>
            <Left>
                <Icon type="MaterialCommunityIcons" name="file-document-outline" />
            </Left>
            <Body>
              <Text>Driver</Text>
            </Body>
            <Right />
          </ListItem>
		  <ListItem icon>
            <Left>
				<Icon tyep="AntDesign" name="car" />
           </Left>
            <Body>
              <Text>Kendaraan</Text>
            </Body>
            <Right />
          </ListItem>
		  
          <ListItem itemDivider>
           <Text>Lainnya</Text>
          </ListItem>
         
          <ListItem icon>
            <Left>
                <Icon type="MaterialIcons" name="exit-to-app" />
            </Left>
            <Body>
				<Link to='/logout'><Text>Logout</Text></Link>
            </Body>
            <Right />
          </ListItem>
		  <Footer>
			<Text>CheckIn Driver versi 2.0</Text>
		  </Footer>
        </Content>
      </Container>
    );
  }
   
  componentDidMount() {
	Geolocation.getCurrentPosition(info => console.log('Geolocation' + info));  
	this.watchLocation();
	 setTimeout(()=>this.setState({flex: 1}),500);
	 console.log(this.props)
	this.getToken();
  }	
  
  async getToken(user) {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
      console.log(data);
	  console.log(data.uid);
	  this.userData(data.uid);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  
  async userData(data) {
	  const ref = firebase.firestore().collection('drivers').doc(data);
	  ref.get().then((doc) => {
		if (doc.exists) {
		  this.setState({
			user: doc.data(),
			key: doc.id,
			loading: false
		  });
		  this.storeToken(doc.data());
		  console.log(this.state);
		  console.log(this.state.user.isComplete)
		  if(this.state.user.isComplete == false){
			 this.props.history.push(ROUTES.HOME);
		  }
		} else {
		  console.log("No such document!");
		}
	  });
  }
  
  async storeToken(user) {
    try {
       await AsyncStorage.setItem("driver", JSON.stringify(user));
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  
  onToggle(isOn) {
    console.log('Changed to ' + isOn);
    if (isOn == true) {
      this.setState({ status: 'Online', badgeStatus: 'green', radius: 200, });
    } else {
      this.setState({ status: 'Offline', badgeStatus: 'red', radius: 0, });
    }
  }
  
  componentWillUnmount() {
   Geolocation.clearWatch(this.watchID);
  }

  watchLocation = () => {
    const { coordinate } = this.state;
	
	this.watchID = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

		coordinate.timing(newCoordinate).start();
        this.setState({
          latitude,
          longitude
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 0
      }
    );
  };
  
  onMapReady = (e) => {
    if(!this.state.ready) {
      this.setState({ready: true});
    }
  };

  onRegionChange = (region) => {
    console.log('onRegionChange', region);
  };

  onRegionChangeComplete = (region) => {
    console.log('onRegionChangeComplete', region);
  };


  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
  
   closeDrawer() {
        this._drawer._root.close()
    };
    openDrawer() {
        this._drawer._root.open()
    };
  
  render() {
    return (
	
	 <Drawer
                ref={(ref) => { this._drawer = ref; }}
                content={this.renderDrawer()}
                onClose={() => this.closeDrawer()} >
	
      <Container>
        <Header transparent>
		  <GeneralStatusBarColor backgroundColor="white"
      barStyle="dark-content"/>
			<Left>
                        <Button transparent onPress={()=>this.openDrawer()}>
                            <Icon style={{ color: 'green'}}  name='menu' />
                        </Button>
                    </Left>
          <Body>
            <Title style={{ color: 'green', textAlign: 'center', left: w(12) }}>Check In</Title>
          </Body>
          
        </Header>
        
		<View style={{flex: this.state.flex}}>
			
			        <MapView  
						style={styles.map}
						zoomEnabled={true}
						loadingEnabled={true}
						showsUserLocation={true}
						loadingEnabled={true}
						zoomControlEnabled={true}
						region={this.getMapRegion()}
						onMapReady={this.onMapReady}
						onRegionChange={this.onRegionChange}
						onRegionChangeComplete={this.onRegionChangeComplete}
				  >
				   <MapView.Circle
        center={this.getMapRegion()}
        radius={this.state.radius}
        strokeWidth={2}
        strokeColor="#408000"
        fillColor="rgba(54,128,0,0.5)"
      />
            <Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              coordinate={this.state.coordinate}
			  image={require('../../assets/car.png')}
            />
          </MapView>
					<View  style={styles.overlayToggle}>
					 <ToggleSwitch
					  onColor="green"
					  offColor="grey"
					  isOn={this.state.isOnDefaultToggleSwitch}
					  onToggle={isOnDefaultToggleSwitch => {
						this.setState({ isOnDefaultToggleSwitch });
						this.onToggle(isOnDefaultToggleSwitch);
					  }}
					 
					/>
					</View>
					<Card style={styles.overlay}>
					<CardItem >
					  <Left>
						  <Thumbnail large source={{uri: this.state.user.photoURI}} />
					  </Left>	
					  <Body>
							<Text>{this.state.user.fullname}</Text>
							<Text style={{ fontSize: 14 }}>{this.state.user.car_type}</Text>
							<Text style={{ fontSize: 14 }}>{this.state.user.car_type}</Text>
							<Text style={{ fontFamily: 'cargoframedemo' }}>{this.state.user.car_number}</Text>
					  </Body>
					  <Right>
						 
						   <Badge style={{ backgroundColor: this.state.badgeStatus }}><Text>{this.state.status}</Text></Badge>
						
					  </Right>
					</CardItem>
				  </Card>
			 
		</View>
		
		
       
      </Container>
	  </Drawer>
    );
  }
}

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   height: 400,
   width: 400,
   justifyContent: 'flex-end',
   alignItems: 'center',
   flex: 1,
   top:h(10),
 },
 map: {
   ...StyleSheet.absoluteFillObject,
   
 },
 header: { marginTop: StatusBar.currentHeight,height: h(0), backgroundColor: '#ffff' },
	headerBody: {
		textAlign: 'center',
		marginLeft: w(25),
		marginRight: w(20),
		marginTop: h(6),
		height:h(20),
		
	},
 overlay: {
   
	top: h(70),
	width: w(95),
	marginLeft: 10,
	marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  }, 
  overlayToggle: {
	 marginLeft: 20,
	 position: 'absolute',
	 top: h(2),
	 
  },
 
});


//export default connect(mapStateToProps)(HomePage);