import {StyleSheet, Button, View, SafeAreaView, Text, Alert, FlatList, Image, TouchableHighlight, ScrollView, TouchableOpacity} from 'react-native';

import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {db} from '../firebase.js';
import React,{useState, useEffect} from 'react';
import Header from '../components/Header';


export default function MatchupCard({playerName, points}){

    const [playerPosition, setPlayerPosition] = useState("");


    useEffect(() => {
        // console.log('pulling data')
        console.log('hello')
        console.log(playerName)
    }, [])



    return (
        <TouchableOpacity  style={[styles.item]}>
            <View style={styles.itemLeft}>
                {/* <View style={styles.square}>
                    <Text style = {styles.positionText}>{playerPosition}</Text>
                </View> */}
                <Text style={styles.itemText}>{playerName}</Text>
            </View>
            <View style={styles.square}>
                    <Text style = {styles.positionText}>{points}</Text>
            </View>
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#211f1f',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        width: 180
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'no-wrap',
    },
    square: {
      width: 30,
      height: 30,
      backgroundColor: '#9f86fc',
      opacity: 0.9,
      borderRadius: 5,
      marginRight: 5,
      justifyContent: "center",
      left: "30%"
    },
    itemText: {
        // marginLeft: 15,
    //   maxWidth: '80%',
      fontSize: 9.5,
      color: "white",
    },
    circular: {
      width: 12,
      height: 12,
      borderColor: '#9f86fc',
      borderWidth: 2,
      borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "white"
    },
    positionText: {
        textAlign: "center",
        color: "white",
        fontSize: 7
    }

});