import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, updateDoc} from 'firebase/firestore';
import {useState, useEffect, useRef} from 'react';
import {db} from "../firebase.js"
import { auth } from "../firebase";
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { useNavigation } from '@react-navigation/core'
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    useTheme,
    themeColor,
  } from "react-native-rapi-ui";


export default function ScheduleDraft ({route}) {
    const [eventStart, setEventStart] = useState(new Date());

    const missingInformation = (field, message) => Alert.alert(field + " Invalid", message, [{ text: 'OK' }]);
    const navigation = useNavigation();

    const scheduleDraft = async () => {
        let toAddTo = doc(db, "leagues", "" + route.params.league);
        await updateDoc(toAddTo, {
            timeOfScheduling : Date.now(),
            timeOfDraft : parseInt((eventStart.getTime()).toFixed(0)),
            draftScheduled: true
        })
        navigation.goBack();
    };
  
    const onStartDateChange = (event, selectedDate) => {
      if (event.type == "set") {
        setEventStart(new Date(selectedDate));
      }
    };

    return(
        <ScrollView style = {styles.container}>
            <Text style = {styles.header}>Schedule Draft</Text>
            <View style = {{height: "63%"}}>
                <View
                style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                }}>
                <DateTimePicker mode="datetime" display="inline" value={eventStart} onChange={onStartDateChange} themeVariant={true ? "dark" : "light"} accentColor={themeColor.primary} />
            </View>
            </View>
            <TouchableOpacity style = {styles.submitContainer} onPress = {scheduleDraft}>
                <Text style = {{color: "#FFF", fontWeight: "bold", fontSize: 16}}>
                    Confirm
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
    
const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingTop: 65,
        paddingHorizontal: 30,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: "white",
        // paddingLeft: 20,
        marginBottom: 75,
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