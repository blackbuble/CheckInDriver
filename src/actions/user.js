import Firebase, {db} from '../../config/Firebase.js'
import {Toast} from 'native-base'
import {NavigationActions, StackActions} from 'react-navigation'
// define types

export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const SIGNIN = 'SIGNIN'
export const SIGNUP = 'SIGNUP'

// actions

export const updateEmail = email => {
    return {
        type: UPDATE_EMAIL,
        payload: email
    }
}

export const updatePassword = password => {
    return {
        type: UPDATE_PASSWORD,
        payload: password
    }
}

export const signin = (navigation) => {
    return async (dispatch, getState) => {
        try {
            const { email, password } = getState().user
			const response = await Firebase.auth().signInWithEmailAndPassword(email, password)
            dispatch(getUser(response.user.uid))
			navigation.navigate('Home')	
        } catch (e) {
		 Toast.show({
				text: ""+ e ,
                duration: 10000,
                position: "top",
				type: "warning",
              })
        }
    }
}

export const getUser = uid => {
	return async (dispatch, getState) => {
        try {
			const user = await db
                .collection('drivers')
                .doc(uid)
                .get()
			console.log('This is data from db', user.data())
            dispatch({ type: SIGNIN, payload: user.data() })
			
        } catch (e) {
            alert(e)
        }
    }
}

export const getOrders = () => {
	return async (dispatch, getState) => {
		try {
			const orders = await db
				.collection(orders)
				.doc()
				.get()
			console.log(orders.data())
			dispatch({ type:SIGNIN, payload: orders.data()})	
		} catch (e) {
			alert(e)
		}
	}
}

export const signup = () => {
      return async (dispatch, getState) => {
        try {
            const { email, password } = getState().user
            const response = await Firebase.auth().createUserWithEmailAndPassword(email, password)
            if (response.user.uid) {
                const user = {
                    uid: response.user.uid,
                    email: email
                }

                db.collection('users')
                    .doc(response.user.uid)
                    .set(user)

                dispatch({ type: SIGNUP, payload: user })
            }
        } catch (e) {
            alert(e)
        }
    }
}
