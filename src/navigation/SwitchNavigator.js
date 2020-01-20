import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import Splash from '../components/splash'
import Signin from '../components/signin'
import Signup from '../components/signup'
import NextPage from '../components/signup/idcard'
import Home from '../components/home'
import Inbox from '../components/inbox'
import Order from '../components/order'
import Profile from '../components/profile'
import Wallet from '../components/wallet'

const SwitchNavigator = createSwitchNavigator(
    {
        Splash: {
            screen: Splash
        }, 
		Signin: {
            screen: Signin
        },
        Signup: {
            screen: Signup
        },
		NextPage: {
            screen: NextPage
        },
        Home: {
            screen: Home
        }, 
		Inbox: {
            screen: Inbox
        },
		Order: {
            screen: Order
        },
		Profile: {
            screen: Profile
        },
		Wallet: {
            screen: Wallet
        }
    },
    {
        initialRouteName: 'Splash'
    }
)

export default createAppContainer(SwitchNavigator)