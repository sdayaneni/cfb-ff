import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, updateDoc} from 'firebase/firestore';
import {useState, useEffect, useRef} from 'react';
import {db} from "../firebase.js"
import { auth } from "../firebase";
import { useNavigation } from '@react-navigation/core'

export default function WaitForDraft({route}){
    const [timeRemaining, setTimeRemaining] = useState(null);
    const navigation = useNavigation();

    let id = useRef();

    useEffect(() => {
        handleTime();
        async function fun(){
            setTimeRemaining(parseInt(await getInitialTime()));
            if(timeRemaining <= -1) {
                startDraft();
              }
        }
        fun()   
    }, [])


    useEffect(() => {
        if(timeRemaining != null && timeRemaining != 0){
            setTimeout(() => {
                setTimeRemaining(timeRemaining - 1000);
                if(timeRemaining <= 2000) {
                    startDraft();
                  }
            }, 1000);
        }
      }, [timeRemaining]);

    async function getInitialTime(){
        let docRef = doc(db, "leagues", "" + route.params.league);
        let document = await getDoc(docRef);
        let time = parseInt(document.data().timeOfDraft) - (Date.now());

        return time;
    }
    
    
      async function startDraft(){
        clearTimeout(id.current);
        let toAddTo = doc(db, "leagues", "" + route.params.league);
        let document = await getDoc(toAddTo);

        if(document.data().draftStarted == false) {
            navigation.replace("Draft", {
                league: route.params.league,
            });
        }

        await updateDoc(toAddTo, {
            draftStarted: true
        });

      }

      function handleTime() {
          
            let total_seconds = parseInt(Math.floor(timeRemaining / 1000));
            let total_minutes = parseInt(Math.floor(total_seconds / 60));
            let total_hours = parseInt(Math.floor(total_minutes / 60));
            let total_days = parseInt(Math.floor(total_hours / 24));

            let seconds = parseInt(total_seconds % 60)
            let minutes = parseInt(total_minutes % 60)
            let hours = parseInt(total_hours % 60)
            let days = parseInt(total_days % 24)

            if(total_seconds < 0) {
                return `${0}: ${0}: ${0}`;
            }

            return `${days}: ${hours}: ${minutes}: ${seconds}`;
      }

      return (
        <ScrollView style = {styles.container}>
            <Text style = {styles.header}>Countdown to the Draft</Text>
            <Text style={styles.time}>{handleTime()}</Text>
            <TouchableOpacity style = {styles.submitContainer}>
                <Text style = {{color: "#FFF", fontWeight: "600", fontSize: 16}}>
                    Cancel
                </Text>
            </TouchableOpacity>
        </ScrollView>
      )
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 50,
        paddingHorizontal: 30,
    },
    header: {
        // fontFamily: "Avenir Next",
        color: "#b98dfc",
        fontSize: 45,
        textAlign: "center",
        marginBottom: 150
    },
      time: {
        fontSize: 54,
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
      },
      submitContainer: {
        backgroundColor: "#850000",
        fontSize: 16,
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 32,
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        elevation: 5,
        marginTop: 190
    },

});
