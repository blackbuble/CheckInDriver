import React, {Component} from 'react'
import { BackHandler,Alert } from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import { Root } from "native-base";
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import SwitchNavigator from './src/navigation/SwitchNavigator'
import reducer from './src/reducers'
import firebase from 'react-native-firebase';

const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer, middleware)


export default class App extends Component {
	constructor(props) {
    super(props);
    console.disableYellowBox = true;
	console.ignoredYellowBox = ['100000'];
  }
  
 // useEffect(() => {
 //   this.checkPermission();
 //   this.messageListener();
 // }, []);

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getFcmToken();
    } else {
        this.requestPermission();
    }
  }

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      //this.showAlert('Your Firebase Token is:', fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
        // User has rejected permissions
    }
  }

  messageListener = async () => {
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
  
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
  
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
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

  componentDidMount() {
	console.log('Loading')
  this.checkPermission()
  this.messageListener()  
	SplashScreen.hide()  
  }
    render() {
        return (
			 <Provider store={store}>
				<Root>
					<SwitchNavigator />
				</Root>	
            </Provider>
		)
    }
}