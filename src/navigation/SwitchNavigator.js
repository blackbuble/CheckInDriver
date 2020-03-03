import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import Splash from '../components/splash'
import Signin from '../components/signin'
import Signup from '../components/signup'
import NextPage from '../components/signup/idcard'
import Home from '../components/home'
import Inbox from '../components/inbox'
import Message from '../components/inbox/message'
import Order from '../components/order'
import OrderDetail from '../components/order/detail'
import OrderClose from '../components/order/close'
import Profile from '../components/profile'
import Wallet from '../components/wallet'
import Withdraw from '../components/withdraw'

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
		Message: {
            screen: Message
        },
		Order: {
            screen: Order
        },
		OrderDetail: {
            screen: OrderDetail
        },
		OrderClose: {
            screen: OrderClose
        },
		Profile: {
            screen: Profile
        },
		Wallet: {
            screen: Wallet
        },
		Withdraw: {
            screen: Withdraw
        }
    },
    {
        initialRouteName: 'Splash'
    }
)

export default createAppContainer(SwitchNavigator)