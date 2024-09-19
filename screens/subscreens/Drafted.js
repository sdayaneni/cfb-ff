import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker, TouchableHighlight } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {auth, db} from '../../firebase.js';
import React,{useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from "@react-navigation/native";

let user;

export default function Drafted(league){
    const isFocused = useIsFocused(); 
    const navigation = useNavigation();

    const [qb, setQb] = useState("");
    const [rb, setRb] = useState("");
    const [wr1, setWr1] = useState("");
    const [wr2, setWr2] = useState("");
    const [te, setTe] = useState("");
    const [b1, setB1] = useState("");
    const [b2, setB2] = useState("");
    const [b3, setB3] = useState("");

    useEffect(() => {
        // console.log('pulling data')
        startFind();
        if(isFocused){ 
            user = auth.currentUser;
        }
    }, [isFocused])


    async function startFind() {
        const q2 = query(collection(db, "leagues", "" + league.league, "members"));
        const querySnapshot2 = await getDocs(q2);
      
        let userDocId = "";
        querySnapshot2.forEach((doc2) => {
            if(doc2.data().memberId == user.uid) {
              userDocId = doc2.id
              getRoster(doc2);
            }
        })
    }

    async function getRoster(doc2) {
        setQb(doc2.data().qb);
        setRb(doc2.data().rb);
        setWr1(doc2.data().wr1);
        setWr2(doc2.data().wr2);
        setTe(doc2.data().te);
        setB1(doc2.data().bench1);
        setB2(doc2.data().bench2);
        setB3(doc2.data().bench3);
    }


    return (
        <ScrollView style = {styles.container}>
            <Text style={styles.sectionTitle}>Your Roster</Text>

            <PlayerCell position = "QB" name = {qb} navigation = {navigation}></PlayerCell>
            <PlayerCell position = "RB" name = {rb} navigation = {navigation}></PlayerCell>
            <PlayerCell position = "WR" name = {wr1} navigation = {navigation}></PlayerCell>
            <PlayerCell position = "WR" name = {wr2} navigation = {navigation}></PlayerCell>
            <PlayerCell position = "TE" name = {te} navigation = {navigation}></PlayerCell>
            <PlayerCell position = "B1" name = {b1} navigation = {navigation}></PlayerCell>
            <PlayerCell position = "B2" name = {b2} navigation = {navigation}></PlayerCell>
            <PlayerCell position = "B3" name = {b3} navigation = {navigation}></PlayerCell>

      </ScrollView>
    );
}

const PlayerCell = ({position, name, navigation}) => {
    return  (
        <TouchableOpacity style={styles.item} onPress={() => showPlayerInfo(name, navigation)}>
            <View style={styles.itemLeft}>
                <View style={styles.square}>
                    <Text style = {styles.positionText}>{position}</Text>
                </View>
                <Text style={styles.itemText}>{name}</Text>
            </View>
            <View style={styles.circular}></View>
        </TouchableOpacity>
    )
  }

  function showPlayerInfo(name, navigation){
    console.log('showing player info on: ' + name);
    navigation.navigate("PlayerInfo", {
      playerName: name
  });
  }

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        padding: 20,
        backgroundColor: 'black',
        width: 400,
        height: 1000
    },
    item: {
        backgroundColor: '#211f1f',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    square: {
      width: 33,
      height: 33,
      backgroundColor: '#9f86fc',
      opacity: 0.9,
      borderRadius: 5,
      marginRight: 15,
      justifyContent: "center"
    },
    itemText: {
      maxWidth: '80%',
      color: "white"
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
        color: "white"
    }
  });