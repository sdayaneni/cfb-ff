import {StyleSheet, Button, View, SafeAreaView, Text, Alert, FlatList, Image, TouchableHighlight, ScrollView} from 'react-native';

import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {db} from '../firebase.js';
import React,{useState, useEffect} from 'react';
import Header from '../components/Header';

const cfb = require('cfb.js');
const defaultClient = cfb.ApiClient.instance;

let tempPpg = 0;
let tempTds = 0;
let tempYpg = 0;
let tempRec = 0;
let tempCar = 0;

export default function Stats({playerName}){

    const [tds, setTds] = useState(0);
    const [ppg, setPpg] = useState(0);
    const [ypg, setYpg] = useState(0);
    const [rec, setRec] = useState(0);
    const [car, setCar] = useState(0);


    useEffect(() => {
        // console.log('pulling data')
        console.log('hello')

        tempPpg = 0;
        tempTds = 0;
        tempYpg = 0;
        tempRec = 0;
        tempCar = 0;

        getStats(playerName);
    }, [])
    
    async function getStats(name) {
        const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
        ApiKeyAuth.apiKey = "Bearer iEgwLD0Q2/fKfE2JrnvQXS2kb4Yim4jMK4PxkPQGiaQ7EJX54+W8ZrTwuVgB6vJ6";
    
        var api = new cfb.PlayersApi();

          var player = await api.playerSearch(name);
          console.log(player);
          var teamToSearch = player[0].team;

          var opts = { 
            'team' : teamToSearch, // String | Team filter
            // 'conference': "conference_example", // String | Conference abbreviation filter
            // 'category': "category_example", // String | Category filter (e.g defensive)
            // 'gameId': 56 // Number | Game id filter
          };
            var stats = await api.getPlayerSeasonStats(2022, opts);
            // tempPpg, tempTds, tempYpg, tempRec, tempCar = 0;
            // tempPpg

            console.log(tempPpg)

            for(var i = 0; i < stats.length; i++) {
                if(stats[i].player == name) {
                    console.log(stats[i]);
                    if(stats[i].statType == "YDS") {
                        tempYpg += stats[i].stat;
                        if(stats[i].category == "rushing" || stats[i].category == "receiving") {
                            tempPpg += stats[i].stat / 10;
                        }
                        else if(stats[i].category == "passing") {
                            tempPpg += stats[i].stat/25;
                        }
                    }
                    if(stats[i].statType == "TD") {
                        tempTds += stats[i].stat;
                        tempPpg += 6 * stats[i].stat;
                    }
                    if(stats[i].statType == "REC") {
                        tempRec += stats[i].stat;
                        tempPpg += stats[i].stat;
                    }
                    if(stats[i].statType == "CAR") {
                        tempCar += stats[i].stat;
                    }
                }
            }
            console.log(tempPpg)
            setPpg((tempPpg / 12).toFixed(2));
            setTds(tempTds);
            setCar(tempCar);
            setRec(tempRec);
            setYpg(tempYpg);
      }


    return (
        <ScrollView>
            <View style = {styles.container}>
                <View style = {styles.statContainer}>
                    <Text style = {styles.statNumber}>{ppg}</Text>
                    <Text style = {styles.stat}>Fantasy PPG</Text>
                </View>

                <View style = {[styles.statContainer, {borderTopWidth: 1, borderColor: "#9f86fc"}]}>
                    <Text style = {styles.statNumber}>{tds}</Text>
                    <Text style = {styles.stat}>Touchdowns</Text>
                </View>

                <View style = {[styles.statContainer, {borderTopWidth: 1, borderColor: "#9f86fc"}]}>
                    <Text style = {styles.statNumber}>{ypg}</Text>
                    <Text style = {styles.stat}>Yards</Text>
                </View>

                <View style = {[styles.statContainer, {borderTopWidth: 1, borderColor: "#9f86fc"}]}>
                    <Text style = {styles.statNumber}>{rec}</Text>
                    <Text style = {styles.stat}>Receptions</Text>
                </View>

                <View style = {[styles.statContainer, {borderTopWidth: 1, borderColor: "#9f86fc"}]}>
                    <Text style = {styles.statNumber}>{car}</Text>
                    <Text style = {styles.stat}>Carries</Text>
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // marginTop: 30,
        marginHorizontal: 16,
        borderRadius: 16,
        // marginTop: -48,
        height: 1400
    },

    statContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 30
    },

    statNumber : {
        fontSize: 50,
        fontWeight: "600",
        color: "white",
        textAlign: "center"
    },

    stat: {
        fontSize: 30,
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "#46464a",
        marginTop: 6,
        textAlign: "center"

    }

});