import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker, TouchableHighlight, ActivityIndicator } from "react-native";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase.js';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from "@react-navigation/native";
import placeholder from "../../assets/placeholder.jpeg"
import MatchupCard from "../../components/MatchupCard.js";

let user;

const cfb = require('cfb.js');
const defaultClient = cfb.ApiClient.instance;


export default function Matchup({ league }) {
  const tempPpg = useRef(0);

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true)

  const qb = useRef("");
  const rb = useRef("");
  const wr1 = useRef("");
  const wr2 = useRef("");
  const te = useRef("");

  const xqb = useRef("");
  const xrb = useRef("");
  const xwr1 = useRef("");
  const xwr2 = useRef("");
  const xte = useRef("");

  const qbs = useRef(0);
  const rbs = useRef(0);
  const wr1s = useRef(0);
  const wr2s = useRef(0);
  const tes = useRef(0);

  const xqbs = useRef(0);
  const xrbs = useRef(0);
  const xwr1s = useRef(0);
  const xwr2s = useRef(0);
  const xtes = useRef(0);

  const [ppg, setPpg] = useState(0);

  const [team1Total, setTeam1Total] = useState(0);
  const [team2Total, setTeam2Total] = useState(0);

  useEffect(() => {
    // console.log('pulling data')
    if (isFocused) {
      user = auth.currentUser;
      if(team1Total == 0 && team2Total == 0) {
        getRosters();
      }
    }
  }, [isFocused])


  async function getRosters() {
    const q2 = query(collection(db, "leagues", "" + league, "members"));
    const querySnapshot2 = await getDocs(q2);

    querySnapshot2.forEach((doc2) => {
      if (doc2.data().memberId == "C0eEzSPBpCRTESSPoSi9AQNaVca2") {
        userDocId = doc2.id
        getRoster(doc2);
      }
    })

    const q = query(collection(db, "leagues", "" + league, "members"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc2) => {
      if (doc2.data().memberId == user.uid) {
        userDocId = doc2.id
        xqb.current = doc2.data().qb;
        xrb.current = doc2.data().rb;
        xwr1.current = doc2.data().wr1;
        xwr2.current = doc2.data().wr2;
        xte.current = doc2.data().te;
        // console.log(xqb.current, xwr1.current)         
      }
    });
    getAllStats();

  }

  async function getAllStats() {

    setIsLoading(true)
    teams = ["a"]

     await Promise.all(
        xqbs.current = await getStats(xqb.current),
        xrbs.current = await getStats(xrb.current),
        xwr1s.current = await getStats(xwr1.current),
        xwr2s.current = await getStats(xwr2.current),
        xtes.current = await getStats(xte.current),
    
        //--------------------
        qbs.current = await getStats(qb.current),
        rbs.current = await getStats(rb.current),
        wr1s.current = await getStats(wr1.current),
        wr2s.current = await getStats(wr2.current),
        tes.current = await getStats(te.current));


    setTeam1Total((+xqbs.current + +xrbs.current + +xwr1s.current + +xwr2s.current + +xtes.current).toFixed(2));
    setTeam2Total((+qbs.current + +rbs.current + +wr1s.current + +wr2s.current + +tes.current).toFixed(2));

    setIsLoading(false)
  }

  async function getRoster(doc2) {
    qb.current = doc2.data().qb;
    rb.current = doc2.data().rb;
    wr1.current = doc2.data().wr1;
    wr2.current = doc2.data().wr2;
    te.current = doc2.data().te;
  }

  async function getStats(name) {
    const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
    ApiKeyAuth.apiKey = "Bearer iEgwLD0Q2/fKfE2JrnvQXS2kb4Yim4jMK4PxkPQGiaQ7EJX54+W8ZrTwuVgB6vJ6";

    var api = new cfb.PlayersApi();

    var player = await api.playerSearch(name);

    var teamToSearch = player[0].team;

    var opts = {
      'team': teamToSearch, // String | Team filter
      'player': player[0].name,
      // 'conference': "conference_example", // String | Conference abbreviation filter
      // 'category': "category_example", // String | Category filter (e.g defensive)
      // 'gameId': 56 // Number | Game id filter
    };

    tempPpg.current = 0;
    var stats = await api.getPlayerSeasonStats(2022, opts);
    // tempPpg, tempTds, tempYpg, tempRec, tempCar = 0;
    // tempPpg

    for (var i = 0; i < stats.length; i++) {
      if (stats[i].player == name) {
        console.log(stats[i]);
        if (stats[i].statType == "YDS") {
          if (stats[i].category == "rushing" || stats[i].category == "receiving") {
            tempPpg.current += stats[i].stat / 10;
          }
          else if (stats[i].category == "passing") {
            tempPpg.current += stats[i].stat / 25;
          }
        }
        if (stats[i].statType == "TD") {
          tempPpg.current += 6 * stats[i].stat;
        }
        if (stats[i].statType == "REC") {
          tempPpg.current += stats[i].stat;
        }
      }
    }
    // setPpg((tempPpg / 12).toFixed(2));
    return ((tempPpg.current / 12).toFixed(2));
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Matchup</Text>
      <View>
        {
          isLoading ?
          <View style = {{paddingTop: 200}}>
            <ActivityIndicator size="large" color="#9f86fc" />
            <Text style = {[styles.sectionTitle, {textAlign: "center", marginTop: 10, marginRight: 10, fontSize: 10}]}>Loading...</Text>
          </View>
                :
        <View style={{ flexDirection: "row" }}>



          <View style={{ height: 700, width: "50%", alignItems: "center" }}>
            <View>
              <Image
                source={placeholder}
                style={[
                  styles.avatarStyle,
                  { zIndex: 1 },
                ]}
              />
            </View>
            <Text style={[styles.sectionTitle, { fontSize: 14, paddingLeft: 0 }]}>Team 1</Text>
            <Text style={[styles.sectionTitle, { fontSize: 18, paddingLeft: 0 }]}>{team1Total}</Text>
            <View>
              <MatchupCard playerName={xqb.current} points={xqbs.current}></MatchupCard>
              <MatchupCard playerName={xrb.current} points={xrbs.current}></MatchupCard>
              <MatchupCard playerName={xwr1.current} points={xwr1s.current}></MatchupCard>
              <MatchupCard playerName={xwr2.current} points={xwr2s.current}></MatchupCard>
              <MatchupCard playerName={xte.current} points={xtes.current}></MatchupCard>
            </View>
          </View>

          <View style={{ height: 700, width: "50%", alignItems: "center" }}>
            <View>
              <Image
                source={placeholder}
                style={[
                  styles.avatarStyle,
                  { zIndex: 1 },
                ]}
              />
            </View>
            <Text style={[styles.sectionTitle, { fontSize: 14, paddingLeft: 0 }]}>Team 2</Text>
            <Text style={[styles.sectionTitle, { fontSize: 18, paddingLeft: 0 }]}>{team2Total}</Text>
            <View>
              <MatchupCard playerName={qb.current} points={qbs.current}></MatchupCard>
              <MatchupCard playerName={rb.current} points={rbs.current}></MatchupCard>
              <MatchupCard playerName={wr1.current} points={wr1s.current}></MatchupCard>
              <MatchupCard playerName={wr2.current} points={wr2s.current}></MatchupCard>
              <MatchupCard playerName={te.current} points={tes.current}></MatchupCard>
            </View>
          </View>
        </View>

              }

      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    backgroundColor: 'black',
    width: 400,
    height: 1000
  },
  item: {
    backgroundColor: '#211f1f',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    position: "absolute",
    right: 0,
    width: 33,
    height: 33,
    backgroundColor: '#9f86fc',
    opacity: 0.9,
    borderRadius: 5,
    // marginRight: 15,
    justifyContent: "center"
  },
  itemText: {
    maxWidth: '80%',
    color: "white"
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#9f86fc',
    borderWidth: 2,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "white",
    paddingLeft: 20
  },
  positionText: {
    textAlign: "center",
    color: "white"
  },
  avatarStyle: {
    resizeMode: 'cover',
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    borderWidth: 1,
    borderColor: "white",
  }
});