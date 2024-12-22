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
  
    const handleWrite = async () => {
        saveNewEvent(
          getAuth().currentUser.uid,
          eventName,
          parseInt((eventStart.getTime() / 1000).toFixed(0)),  // Save start time
          parseInt((eventEnd.getTime() / 1000).toFixed(0)),        // Save end time
          eventType,
          eventSize,
          joinCode
        );
        navigation.goBack();
    };
  
    const onStartDateChange = (event, selectedDate) => {
      if (event.type == "set") {
        setEventStart(new Date(selectedDate));
      }
    };
  
    const onStartTimeChange = (event, selectedTime) => {
      if (event.type == "set") {
        let newStart = new Date(eventStart);
        newStart.setHours(selectedTime.getHours());
        newStart.setMinutes(selectedTime.getMinutes());
        setEventStart(newStart);
      }
    };

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

    return(
        <ScrollView style = {styles.container}>
            <Text style = {styles.header}>Schedule Draft</Text>
            <View style = {{ height: 400, borderRadius: 10, backgroundColor: "#141414", flexDirection: "row"}}>
                <View
                style={{
                display: "flex",
                flexDirection: "column",
                // marginLeft: 'auto',
                }}>
                <DateTimePicker mode="datetime" display="inline" value={eventStart} onChange={onStartDateChange} themeVariant={true ? "dark" : "light"} accentColor={themeColor.primary} />
                {/* <DateTimePicker mode="time" display="default" value={eventStart} onChange={onStartTimeChange} themeVariant={true ? "dark" : "light"} accentColor={themeColor.primary} /> */}
            </View>
            {/* <View>
                <Text style = {[styles.time, {paddingTop: 20, marginBottom: -1, elevation: 10, zIndex: 10, color: '#b98dfc'}]}>Days</Text>
                        <View style = {{height: 210, width: 75, borderRadius: 100}}>
                            <ScrollPicker
                                dataSource={nums}
                                selectedIndex={0}
                                onValueChange={(data) => {
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
                </View> */}
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
        paddingTop: 50,
        paddingHorizontal: 30,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: "white",
        // paddingLeft: 20,
        marginBottom: 100
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