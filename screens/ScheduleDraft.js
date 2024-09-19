import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, updateDoc} from 'firebase/firestore';
import {useState, useEffect, useRef} from 'react';
import {db} from "../firebase.js"
import { auth } from "../firebase";
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { useNavigation } from '@react-navigation/core'


export default function ScheduleDraft ({route}) {
    let hours = 0;
    let minutes = 0;
    let days = 0;

    const navigation = useNavigation();


      async function scheduleDraft() {
            let toAddTo = doc(db, "leagues", "" + route.params.league);
            let timeToPush = (minutes * 60 * 1000) + (hours * 60 * 60 * 1000) + (days * 60 * 60 * 24 * 1000) + Date.now();

            await updateDoc(toAddTo, {
                timeOfScheduling : Date.now(),
                timeOfDraft : timeToPush,
                draftScheduled: true
            })

            navigation.replace("WaitForDraft", {
                league: route.params.league
            });
      }

      let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    return(
        <ScrollView style = {styles.container}>
            <Text style = {styles.header}>Schedule Draft</Text>
            <View style = {{ height: 350, borderRadius: 10, backgroundColor: "#141414", flexDirection: "row"}}>
            <View>
                <Text style = {[styles.time, {paddingTop: 20, marginBottom: -1, elevation: 10, zIndex: 10, color: '#b98dfc'}]}>Days</Text>
                        <View style = {{height: 210, width: 75, borderRadius: 100}}>
                            <ScrollPicker
                                dataSource={nums}
                                selectedIndex={0}
                                onValueChange={(data, selectedIndex) => {
                                    days = data;
                                }}

                                wrapperColor= "#141414"
                                itemHeight={50}
                                wrapperHeight={200}                                
                            />
                        </View>
                </View>
                <View style = {{marginLeft: 20}}>
                <Text style = {[styles.time, {paddingTop: 20, marginBottom: -1, elevation: 10, zIndex: 10, color: '#b98dfc'}]}>Hours</Text>
                        <View style = {{height: 210, width: 75, borderRadius: 100, marginLeft: 10}}>
                            <ScrollPicker
                                dataSource={nums}
                                selectedIndex={0}
                                onValueChange={(data, selectedIndex) => {
                                    hours = data;
                                }}

                                wrapperColor= "#141414"
                                itemHeight={50}
                                wrapperHeight={200}                                
                            />
                        </View>
                </View>
                <View>
                    <Text style = {[styles.time, {paddingTop: 20, marginLeft: 20, marginBottom: -1, elevation: 10, zIndex: 10, color: '#b98dfc'}]}>Min</Text>
                        <View style = {{height: 210, width: 75, borderRadius: 100, marginLeft: 28}}>
                            <ScrollPicker
                                dataSource={nums}
                                selectedIndex={0}
                                onValueChange={(data, selectedIndex) => {
                                    minutes = data;
                                }}

                                wrapperColor= "#141414"
                                itemHeight= {50} 
                                wrapperHeight={200}                                
              
                            />
                        </View>
                </View>
            </View>
            <TouchableOpacity style = {styles.submitContainer} onPress = {scheduleDraft}>
                <Text>
                    Confirm
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 50,
        paddingHorizontal: 30,
    },
    header: {
        fontFamily: "Avenir Next",
        color: "#b98dfc",
        fontSize: 35,
        textAlign: "center",
        marginBottom: 100
    },
    submitContainer: {
        backgroundColor: "#b98dfc",
        fontSize: 16,
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 32,
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        shadowColor: "#b98dfc",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
        marginTop: 150
    },
    dropdown1BtnStyle: {
        flex: 1,
        height: 50,
        backgroundColor: "#b98dfc",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#444",
        textColor: "white"
      },
      dropdown1BtnTxtStyle: { color: "white"},
      time: {
        fontSize: 30,
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
      },

});