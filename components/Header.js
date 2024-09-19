import {StyleSheet, Button, View, SafeAreaView, Text, Alert, FlatList, Image, TouchableHighlight, ScrollView} from 'react-native';

import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {db} from '../firebase.js';
import React,{useEffect, useState} from 'react';

import {LinearGradient} from 'expo-linear-gradient';
import { Ionicons, Entypo } from '@expo/vector-icons'; 

import placeholder from "../assets/placeholder.jpeg";

const cfb = require('cfb.js');
const defaultClient = cfb.ApiClient.instance;


export default function Header({playerName, league}){
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        // console.log('pulling data')
        setImage(placeholder);
        getPlayerImages();
        setName(playerName);
        getPosition(playerName);
    }, [])

    const getPlayerImages = async () => {
        let toAddTo = collection(db, "leagues", "" + league, "drafted");
        const q = query(toAddTo);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(playerName + " " + doc.data().name)
          if(playerName == doc.data().name) {
            console.log('working')
            setImage(doc.data().imageURL);
          }
        });

        console.log(image)
      };

    async function getPosition(name) {
        const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
        ApiKeyAuth.apiKey = "Bearer iEgwLD0Q2/fKfE2JrnvQXS2kb4Yim4jMK4PxkPQGiaQ7EJX54+W8ZrTwuVgB6vJ6";
    
        var api = new cfb.PlayersApi();
        var player = await api.playerSearch(name);
        // console.log(player[0].position);
        if(player[0].position == "QB") {
            setPosition("Quarterback");
        }
        if(player[0].position == "RB") {
            setPosition("Running Back");
        }
        if(player[0].position == "WR") {
            setPosition("Wide Receiver");
        }
        if(player[0].position == "TE") {
            setPosition("Tight End");
        }
      }

    return (
        <LinearGradient colors= {['#9f86fc', '#5228ed']} start = {[0,0]} end = {[1,1]}>
            <View style = {{marginHorizontal: 32, paddingVertical: 64}}>

                <View style = {styles.imageContainer}>
                {(image == placeholder || image == "")?
                    <Image
                        source={placeholder}
                        style = {{width: 125, height: 125, borderRadius: 32}}
                    />
                : 
                <Image
                    source={ {uri: image}}
                    style = {{width: 125, height: 125, borderRadius: 32}}
                />}
                </View>

                <View style = {{marginVertical: 12, alignItems: "center", justifyContent: "center"}}>
                    <Text style = {{color: "white", fontSize: 30}}>{name}</Text>
                    <Text style = {{fontWeight: "600", textTransform: "uppercase", color: "#9f86fc", fontSize: 15, letterSpacing: 1}}>{position}</Text>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        shadowColor: "black",
        shadowOffset: {height: 3, width: 1},
        shadowOpacity: 0.5
    },

});