import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, updateDoc} from 'firebase/firestore';
import {useState, useEffect, useRef} from 'react';
import {db} from "../../firebase.js"
import { auth } from "../../firebase.js";
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

    const descheduleDraft = async () => {
        let toAddTo = doc(db, "leagues", "" + route.params.league);
        await updateDoc(toAddTo, {
            draftScheduled: false
        })
        navigation.goBack();
    };

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

        if(document.data().draftStarted == false && document.data().draftScheduled == true) {
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
            <Text style = {styles.header}>Countdown</Text>
            <View style={{height: "70%", alignItems: "center", paddingTop: "50%"}}>
                <Text style={styles.time}>{handleTime()}</Text>
            </View>
            <View style = {{marginBottom: 125}}>
                <TouchableOpacity style = {styles.submitContainer} onPress = {descheduleDraft}>
                    <Text style = {{color: "#FFF", fontWeight: "600", fontSize: 16}}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
      )
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 65,
        paddingHorizontal: 30,

    },
    header: {
        fontSize: 38,
        fontWeight: 'bold',
        color: "white",
        // paddingLeft: 20,
    },
      time: {
        fontSize: 50,
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
        fontWeight: "bold"
      },
      submitContainer: {
        position: 'relative',
        backgroundColor: "#9f86fc",
        fontSize: 16,
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 32,
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        elevation: 5,
        marginTop: 100,
        zIndex: 100000
    },

});
