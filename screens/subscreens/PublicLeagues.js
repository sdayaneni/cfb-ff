import React from 'react';
import LeagueCard from '../../components/LeagueCard';
import background from "../../assets/background.png";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import {db} from "../../firebase.js"
import { useIsFocused } from "@react-navigation/native";
import { auth } from "../../firebase";
import { useNavigation } from '@react-navigation/core'

export default function PublicLeagues () {

    let user;
    let itemList;
    let userLeagues = [];
    const [leagueData, setLeagueData] = useState([]);
    const isFocused = useIsFocused(); 
    let leagueIds = [];
    const navigation = useNavigation();

    useEffect(() => {
        if(isFocused){ 
            user = auth.currentUser;
            getLeagues();
     }}, [isFocused])

     async function getLeagues(){
        const q = query(collection(db, "leagues"));
        const querySnapshot = await getDocs(q);
        userLeagues = [];

        querySnapshot.forEach((doc) => {
            checkIfMember(doc);
        });
    }

       async function checkIfMember(doc) {
            const q2 = query(collection(db, "leagues", "" + doc.id, "members"));
            const querySnapshot2 = await getDocs(q2);

            var toAdd = true;

            querySnapshot2.forEach((doc2) => {
                if((doc2.data().memberId == user.uid) || (querySnapshot2.size == doc.data().turn)) {
                    toAdd = false;
                }
            });

            if(toAdd){
                userLeagues.push(doc.data());
                leagueIds.push(doc.id);
                finishCheckingLeagues(querySnapshot2.size);
            }
       }

       function finishCheckingLeagues(num){
            itemList=userLeagues.map((item,index)=>{
                return (
                    <View key = {index} style = {styles.leagueSection}>
                        <LeagueCard key = {index} item = {background} title = {item.name} size = {item.size} numJoined = {num} width = {325} newMargin = {5}></LeagueCard>
                        <TouchableOpacity style={styles.submitContainer} onPress = {() => handleJoin(index, num)}>
                            <Text style={[styles.text, {fontWeight: "600", fontSize: 40, marginLeft: 20, color: "#9f86fc"}]}>+</Text>
                        </TouchableOpacity>
                    </View>
                );
            });
        
            setLeagueData(itemList);
       }

       async function handleJoin(index, num){
            console.log(leagueIds[index]);
            let toAddTo = collection(db, "leagues", "" + leagueIds[index], "members");

            await addDoc(toAddTo, {
                memberId: user.uid,
                wins: 0,
                qb: "",
                rb: "",
                wr1: "",
                wr2: "",
                te: "",
                bench1: "",
                bench2: "",
                bench3: "",
                userTurn: num,
            });

            navigation.navigate("Your Leagues");
       }


    return(
        <ScrollView style = {styles.container}>
            <Text style = {[styles.text, {marginBottom: 20}]}>Public Leagues</Text>
            {leagueData}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 65,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        // marginBottom: 20,
        color: "white",
    },
    submitContainer: {
        backgroundColor: '#0f0f0f',
        padding: 15,
        paddingRight: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        marginLeft: -60
    },
    leagueSection: {
        flexDirection:'row'    }
});