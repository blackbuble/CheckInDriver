import React, {Component} from 'react'
import { BackHandler } from 'react-native';
import SplashScreen from 'react-native-splash-screen'
//import RNMockLocationDetector from 'react-native-mock-location-detector'
import { Root } from "native-base";
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
/* import Signup from './src/components/signup'
import Signin from './src/components/signin' */
import SwitchNavigator from './src/navigation/SwitchNavigator'
import reducer from './src/reducers'

const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer, middleware)


export default class App extends Component {
	constructor(props) {
    super(props);
    console.disableYellowBox = true;
	console.ignoredYellowBox = ['100000'];
  }
  
  componentDidMount() {
	console.log('Loading')
	/* RNMockLocationDetector.checkMockLocationProvider(
    "Fake Location Detected",
    "Please remove any mock location app first to continue using this app.",
    "I Understand"
  );  */
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