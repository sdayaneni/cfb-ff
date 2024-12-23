import React from 'react';
import LeagueCard from '../../components/LeagueCard';
import background from "../../assets/background.png";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl, TextInput } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import {db} from "../../firebase.js"
import { useIsFocused } from "@react-navigation/native";
import { auth } from "../../firebase";
import { useNavigation } from '@react-navigation/core'
import { Ionicons } from "@expo/vector-icons";

export default function PublicLeagues () {

    let itemList;
    let userLeagues = [];
    const [leagueData, setLeagueData] = useState([]);
    const isFocused = useIsFocused(); 
    let leagueIds = [];
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true); // State for initial loading and refreshing
    
    useEffect(() => {
        if(isFocused){ 
            loadData();
     }}, [isFocused])

     const loadData = async () => {
        setLoading(true);
        await getLeagues();
      };

     async function getLeagues(){
        const q = query(collection(db, "leagues"));
        const querySnapshot = await getDocs(q);
        userLeagues = [];
        setLeagueData([]);
        setLoading(true);

        querySnapshot.forEach((doc) => {
            checkIfMember(doc);
        });
    }

       async function checkIfMember(doc) {
            const q2 = query(collection(db, "leagues", "" + doc.id, "members"));
            const querySnapshot2 = await getDocs(q2);

            var toAdd = true;

            querySnapshot2.forEach((doc2) => {
                if((doc2.data().memberId == auth.currentUser.uid) || (querySnapshot2.size == doc.data().turn)) {
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
            setLoading(false);
       }

       async function handleJoin(index, num){
            console.log(leagueIds[index]);
            let toAddTo = collection(db, "leagues", "" + leagueIds[index], "members");

            await addDoc(toAddTo, {
                memberId: auth.currentUser.uid,
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
            
            getLeagues();
            navigation.navigate("Your Leagues");
       }


    return(
        <View style = {styles.container}>
            <View style = {{flexDirection: "row", marginBottom: 20, paddingHorizontal: 10}}>
                <Text style = {[styles.text]}>Public Leagues</Text>
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
            <ScrollView style = {{paddingHorizontal: 15, height: "100%"}} refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}>{leagueData}</ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 50,
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
        // marginBottom: 20,
        color: "white",
    },
    submitContainer: {
        // backgroundColor: '#0f0f0f',
        // padding: 15,
        // paddingRight: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        marginLeft: -70
    },
    leagueSection: {
        flexDirection:'row'    }
});