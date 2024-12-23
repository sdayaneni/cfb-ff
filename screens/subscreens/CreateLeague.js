import React from 'react';
import LeagueCard from '../../components/LeagueCard';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, getCountFromServer} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import {db} from "../../firebase.js"
import { auth } from "../../firebase";
import { useNavigation } from '@react-navigation/core'
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

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
            <View style = {{flexDirection: "row", marginBottom: 20, paddingHorizontal: 10}}>
                <Text style = {styles.header}>Create League</Text>
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

            <ScrollView style = {{paddingHorizontal: 30,}}>

                <View style={styles.inputTitle}>
                    <Text style={styles.inputTitle}>League Name</Text>
                    <TextInput
                        onChangeText = {text => setLeagueName(text)}
                        style={styles.input}
                    />
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

                {/* <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 15
                }}>
                <Text style={{ marginVertical: "auto" }} fontWeight="bold">Game Mode</Text>
                <View style={{ marginLeft: "auto" }}>
                    <RNPickerSelect
                        placeholder={{ label: 'Select a game mode...', value: null }}
                        items={[
                            { label: 'Classic', value: "Classic" },
                            { label: 'Bingo', value: "Bingo" },
                        ]}
                        onValueChange={(value) => setEventType(value)}
                        style={pickerStyles(true)}
                        // disabled = {false}
                    />
                </View>
                </View> */}

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
                    <Text style={[styles.text, {color: "#FFF", fontWeight: "bold", fontSize: 16}]}>Create</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 50,
        height: 1000,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: "white",
        paddingLeft: 20
    },
    inputTitle: {
        color: "white",
        fontSize: 15,
        marginTop: 15,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        paddingHorizontal: 20, 
        paddingVertical: 10,
        marginTop: 10, 
        borderColor: "#adacac", 
        borderWidth: 2, 
        borderRadius: 8, 
        color: "#fff",
        fontSize: 14,
    },
    inputTitle2: {
        color: "white",
        fontSize: 15,
        marginTop: 75,
        marginBottom: 25,
        fontWeight: 'bold',
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
        // shadowColor: "#9f86fc",
        // shadowOffset: { width: 0, height: 9 },
        // shadowOpacity: 1,
        // shadowRadius: 20,
        elevation: 5,
        marginTop: 100,
        // fontWeight: 'bold',
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

const pickerStyles = (isDarkmode) => ({
    inputIOS: {
      fontSize: 14,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: 8,
      fontFamily: "Ubuntu_400Regular",
      backgroundColor: isDarkmode ? "#1f1f1f" : themeColor.white,
      borderColor: isDarkmode ? "#333333" : "#d8d8d8",
      color: isDarkmode ? "#dddddd" : "black",
    },
    inputAndroid: {
      fontSize: 14,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderRadius: 8,
      fontFamily: "Ubuntu_400Regular",
      backgroundColor: isDarkmode ? "#1f1f1f" : themeColor.white,
      borderColor: isDarkmode ? "#333333" : "#d8d8d8",
      color: isDarkmode ? "#dddddd" : "black",
    }
  });
  