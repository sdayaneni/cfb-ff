import React from 'react';
import LeagueCard from '../../components/LeagueCard';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, getCountFromServer} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import {db} from "../../firebase.js"
import { auth } from "../../firebase";
import { useNavigation } from '@react-navigation/core'

let leagueSize;
let leagueType;
export default function CreateLeague () {
    const user = auth.currentUser;
    const navigation = useNavigation();

    const [leagueName, setLeagueName] = useState('');


    async function handleCreateLeague(){
        console.log(user.uid);
        let toAddTo = collection(db, "leagues");
        
        const newLeague = await addDoc(toAddTo, {
            name : leagueName,
            size: leagueSize,
            type: leagueType,
            leagueManager: user.uid,
            timeOfScheduling : 0,
            timeOfDraft : 0,
            draftStarted: false,
            draftScheduled: false,
            draftEnded: false,
            turn: 0,
            drafted: [],
            round: 1
          });

          console.log(newLeague.id);
          toAddTo = collection(db, "leagues", "" + newLeague.id, "members");

          const snapshot = await getCountFromServer(toAddTo);
          let numCurrent = snapshot.data().count;

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
            userTurn : numCurrent
        });

        navigation.navigate("Your Leagues");
    }

    return(
        <View style = {styles.container}>
            <Text style = {styles.header}>Create League</Text>

            <ScrollView style = {{paddingHorizontal: 30,}}>

                <View style={styles.inputTitle}>
                    <Text style={styles.inputTitle}>League Name</Text>
                    <TextInput
                        onChangeText = {text => setLeagueName(text)}
                        style={styles.input}
                    />
                    <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
                </View>

                <Text style={styles.inputTitle2}>League Size</Text>
                <SelectDropdown
                    data={[2, 4, 6, 8, 10, 12]}
                    onSelect={(selectedItem, index) => {
                        leagueSize = selectedItem
                    }}
                    buttonStyle={styles.dropdown1BtnStyle}
                    defaultButtonText={"Select Size"}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}

                />

                <Text style={styles.inputTitle2}>League Type</Text>
                <SelectDropdown
                    data={["Public", "Private"]}
                    onSelect={(selectedItem, index) => {
                        leagueType = selectedItem
                    }}
                    buttonStyle={styles.dropdown1BtnStyle}
                    defaultButtonText={"Select Type"}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}

                />

                <TouchableOpacity style={styles.submitContainer} onPress = {handleCreateLeague}>
                    <Text style={[styles.text, {color: "#FFF", fontWeight: "600", fontSize: 16}]}>Create</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 65,
        height: 1000,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "white",
        paddingLeft: 20
    },
    inputTitle: {
        color: "#ABB4BD",
        fontSize: 14,
        marginTop: 25,
    },
    input: {
        paddingVertical: 12,
        color: "#fff",
        fontSize: 14,
        fontFamily: "Avenir Next",
    },
    inputTitle2: {
        color: "#ABB4BD",
        fontSize: 14,
        marginTop: 75,
        marginBottom: 25,
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
        elevation: 5,
        marginTop: 100
    },
    dropdown1BtnStyle: {
        flex: 1,
        height: 50,
        backgroundColor: "#9f86fc",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#444",
        textColor: "white"
      },
      dropdown1BtnTxtStyle: { color: "white"},

});