import { useNavigation } from '@react-navigation/core'
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import {useState, useEffect} from 'react';
import { auth } from '../firebase';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export default function Login () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
            navigation.replace("Home")
          }
        })
    
        return unsubscribe
      }, [])


    const handleSignUp = () => {
        console.log(email + " " + password);
        
        createUserWithEmailAndPassword(auth, email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with:', user.email);
          })
          .catch(error => alert(error.message))
      }

      const handleLogin = () => {
        console.log('logging in');
        signInWithEmailAndPassword(auth, email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with:', user.email);
          })
          .catch(error => alert(error.message))
      }

    return (
        <ScrollView style={styles.container}>
            <View>
                <View style={{ marginTop: 60, alignItems: "center", justifyContent: "center" }}>
                    <Image style = {styles.logoImage} source={require("../assets/logo.png")} />
                </View>
                <View style={{ marginTop: 48, flexDirection: "row", justifyContent: "center" }}>
    
                </View>

                <View style={styles.inputTitle}>
                    <Text style={styles.inputTitle}>Email</Text>
                    <TextInput
                        onChangeText = {text => setEmail(text)}
                        style={styles.input}
                    />
                    <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
                </View>

                <View style={{marginTop: 16, marginBottom: 8}}>
                    <Text style={styles.inputTitle}>Password</Text>
                    <TextInput
                        secureTextEntry={true}
                        onChangeText = {text => setPassword(text)}
                        style={styles.input}
                    />
                    <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
                </View>

                <Text style={[styles.text, styles.link, { textAlign: "right" }]}>Forgot Password?</Text>

                <TouchableOpacity style={styles.submitContainer}  onPress = {handleLogin}>
                    <Text style={[styles.text, {color: "#FFF", fontWeight: "600", fontSize: 16}]}>Login</Text>
                </TouchableOpacity>

                <Text style={[styles.text, {fontSize: 14, color: "#ABB4BD", textAlign: "center", marginTop: 24}]}>
                    Don't have an account? <Text style={[styles.text, styles.link]}>Register Now</Text>
                </Text>

                <TouchableOpacity style={styles.submitContainer} onPress = {handleSignUp}>
                    <Text style={[styles.text, {color: "#FFF", fontWeight: "600", fontSize: 16}]}>Register</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        paddingHorizontal: 30
    },
    text: {
        fontFamily: "Avenir Next",
        color: "#1D2029"
    },
    link: {
        color: "#9f86fc",
        fontSize: 14,
        fontWeight: "500"
    },
    submitContainer: {
        backgroundColor: "#9f86fc",
        fontSize: 16,
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 32,
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        shadowColor: "#9f86fc",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5
    },
    inputTitle: {
        color: "#ABB4BD",
        fontSize: 14
    },
    input: {
        paddingVertical: 12,
        color: "#fff",
        fontSize: 14,
        fontFamily: "Avenir Next"
    },
    logoImage: {
        width: 250,
        height: 250
    }
});