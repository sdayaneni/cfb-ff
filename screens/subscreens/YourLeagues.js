import React from 'react';
import LeagueCard from '../../components/LeagueCard';
import background from "../../assets/background.png";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import {useState, useEffect} from 'react';
import { useIsFocused } from "@react-navigation/native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {db} from "../../firebase.js"
import { auth } from "../../firebase";
import { useNavigation } from '@react-navigation/core'

export default function YourLeagues () {

    let user;
    let itemList;
    let userLeagues = [];
    let leagueIds = [];
    let sizes = [];
    
    const [leagueData, setLeagueData] = useState([]);
    const isFocused = useIsFocused(); 
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
            checkIfMember(doc)
        });
    }

       async function checkIfMember(doc) {
            const q2 = query(collection(db, "leagues", "" + doc.id, "members"));
            const querySnapshot2 = await getDocs(q2);

            querySnapshot2.forEach((doc2) => {
                if(doc2.data().memberId == user.uid) {
                    userLeagues.push(doc.data());
                    leagueIds.push(doc.id)
                    sizes.push(querySnapshot2.size);
                }
                finishCheckingLeagues(sizes);
            })
       }

       function finishCheckingLeagues(sizes){
            itemList=userLeagues.map((item,index)=>{
                return (
                    <LeagueCard key = {index} item = {background} title = {item.name} size = {item.size} numJoined = {sizes[index]} width = {400} newMargin = {16} user = {user.uid} leagueId = {leagueIds[index]}></LeagueCard>
                );
            });
        
            setLeagueData(itemList);
       }

       const handleSignOut = () => {
        auth
          .signOut()
          .then(() => {
            navigation.replace("Login")
          })
          .catch(error => alert(error.message))
      }
    

       return(
           <ScrollView style = {styles.container}>
                <TouchableOpacity style={styles.submitContainer}  onPress = {handleSignOut}>
                        <Text style={[styles.signOutText, {color: "#FFF",fontWeight: "600",fontSize: 10,}]}>Sign Out</Text>
                </TouchableOpacity>
               <Text style = {styles.text}>Your Leagues</Text>
               {leagueData}
           </ScrollView>
       );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 50
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "white",
    },
    submitContainer: {
        backgroundColor: "#9f86fc",
        fontSize: 16,
        borderRadius: 4,
        // paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 280,
        color: "#FFF",
        shadowColor: "#b98dfc",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
        marginBottom: 20,
        width: 80
    },
});