import React, { Component } from "react";
import {View, Text, StyleSheet, Image } from "react-native";
import Firebase from '../../../config/Firebase'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUser } from '../../actions/user'

const companyLogo = require('../../assets/splash1.png');

export class Splash extends Component {

 componentDidMount() {
	 
	Firebase.auth().onAuthStateChanged(user => {
			if (user) {
				console.log(this.props)
				console.log(user.uid)
                this.props.getUser(user.uid)
                if (this.props.user != null) {
                    this.props.navigation.navigate('Home')
                }
			}
			else {
					 setTimeout(() => {
					   this.load();
						  }, 4000);
				}
        })  
   
    }

   load = () => {
        this.props.navigation.navigate("Signin");
    };

    render() {
        return (
			
				<Image source={companyLogo} style={styles.backgroundImage} />
  );
 } 
}

const styles = StyleSheet.create({
   text: {
        flex: 1,
		fontFamily:'Gotham-Medium',
		marginLeft: 'auto',
		marginRight: 'auto',
		
    },
	backgroundImage: {
    
    resizeMode: 'cover', // or 'stretch'
	width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
  }
 });	

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ getUser }, dispatch)
}

const mapStateToProps = state => {
	return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Splash)

 //export default Splash;