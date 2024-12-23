import React from 'react';
import LeagueCard from '../../components/LeagueCard';
import background from "../../assets/background.png";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl, TextInput } from "react-native";
import {useState, useEffect, useCallback} from 'react';
import { useIsFocused } from "@react-navigation/native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, loadBundle} from 'firebase/firestore';
import {db} from "../../firebase.js"
import { auth } from "../../firebase";
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

export default function YourLeagues () {

    let user = auth.currentUser;
    let itemList;
    let userLeagues = [];
    let leagueIds = [];
    let sizes = [];
    
    const [leagueData, setLeagueData] = useState([]);
    const isFocused = useIsFocused(); 
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true); // State for initial loading and refreshing
    

    useEffect(() => {
        if(isFocused){ 
            loadData();
     }}, [isFocused]);

    //  useFocusEffect(
    //     useCallback(() => {
    //         getLeagues(); // Reload data when screen comes into focus
    //     }, [])
    //   );

    const loadData = async () => {
        setLoading(true);
        await getLeagues();
      };


    async function getLeagues(){
        console.log("getting");
        const q = query(collection(db, "leagues"));
        const querySnapshot = await getDocs(q);
        userLeagues = [];
        setLeagueData([]);
        setLoading(true);

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
        })
        finishCheckingLeagues(sizes);
    }

       function finishCheckingLeagues(sizes){
            itemList=userLeagues.map((item,index)=>{
                return (
                    <LeagueCard key = {index} item = {background} title = {item.name} size = {item.size} 
                    numJoined = {sizes[index]} width = {400} newMargin = {16} user = {user.uid} 
                    leagueId = {leagueIds[index]} onDelete = {deleteLeague}></LeagueCard>
                );
            });
        
            setLeagueData(itemList);
            setLoading(false);
            console.log(loading);
        }

        const deleteLeague = async (leagueId) => {
            try {
              // Reference to the event document
              const leagueDocRef = doc(db, "leagues", leagueId);
          
              // Retrieve the event document to get the members and admin
              const leagueDoc = await getDoc(leagueDocRef);
          
              if (leagueDoc.exists()) {
                const leagueData = leagueDoc.data();
    
                // Now delete the event document
                await deleteDoc(leagueDocRef);
                loadData();
          
                console.log('Event deleted successfully');
              } else {
                console.log('Event does not exist');
              }
            } catch (error) {
              console.error('Error deleting event:', error);
              throw error;
            }
          };
    

       return(
           <View style = {styles.container}>
                {/* <TouchableOpacity style={styles.submitContainer}  onPress = {handleSignOut}>
                        <Text style={[styles.signOutText, {color: "#FFF",fontWeight: "600",fontSize: 10,}]}>Sign Out</Text>
                </TouchableOpacity> */}
                <View style = {{flexDirection: "row", marginBottom: 20, paddingHorizontal: 10}}>
                    <Text style = {styles.text}>Your Leagues</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Settings")}
                        style={{
                            marginVertical: 'auto',
                            marginLeft: 'auto',
                        }}
                        >
                        <Ionicons
                            name={"ellipsis-vertical"}
                            size={25}
                            color={"white"}
                        />
                    </TouchableOpacity>
               </View>
               <ScrollView style = {{paddingHorizontal: 15}} refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}>{leagueData}</ScrollView>
               
           </View>
       );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 50,
        height: "100%"
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
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