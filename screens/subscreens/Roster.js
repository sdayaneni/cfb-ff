import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker, TouchableHighlight } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, updateDoc} from 'firebase/firestore';
import {auth, db} from '../../firebase.js';
import React,{useState, useEffect, useRef} from 'react';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from "@react-navigation/native";

const fetch = require("node-fetch");
const cheerio = require("cheerio");

const cfb = require('cfb.js');
const defaultClient = cfb.ApiClient.instance;

let user;
let names = ["", "", "", "", "", "", "", ""];
let startIndex = 0;
let endIndex = 0;

const URL = "https://www.espn.com/college-football/teams";

let scraped2 = false;


export default function Roster({league, scraped}){
    const isFocused = useIsFocused(); 
    const navigation = useNavigation();

    const [qb, setQb] = useState("");
    const [rb, setRb] = useState("");
    const [wr1, setWr1] = useState("");
    const [wr2, setWr2] = useState("");
    const [te, setTe] = useState("");
    const [b1, setB1] = useState("");
    const [b2, setB2] = useState("");
    const [b3, setB3] = useState("");

    const [, updateState] = useState();
    const forceUpdate = React.useCallback(() => updateState({}, []));

    const [playerImages, setPlayerImages] = useState(['https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146', 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146', 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146', 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146', 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146', 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146', 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146', 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146']);

    const [disabled,setDisabled]=useState([false, false, false, false, false, false, false, false]);
    const [opacities,setOpacities]=useState([1, 1, 1, 1, 1, 1, 1,]);

    const [textToDisplay, setTextToDisplay] = useState("Move");

    // console.log('pulling data')
    if(scraped == false) {
      scraped2 = scraped;
    }

    useEffect(() => {

        console.log(scraped2);
        if(isFocused){ 
            user = auth.currentUser;
            startFind();
        }
    }, [isFocused])


    // start of the program
    const getPlayerImages = async (name, index) => {

      let toAddTo = collection(db, "leagues", "" + league, "drafted");
      const q = query(toAddTo);
      const querySnapshot = await getDocs(q);
      let arrOfPlayers = [];
      querySnapshot.forEach((doc) => {
        if(name == doc.data().name) {
          let currentPlayers = playerImages;
          currentPlayers[index] = doc.data().imageURL;
          setPlayerImages(currentPlayers);
          console.log(doc.data().imageURL)
          forceUpdate();
        }
      });
    };

    async function startFind() {
        startIndex = 0;
        endIndex = 0;
        setDisabled([false, false, false, false, false, false, false, false]);
        setOpacities([1, 1, 1, 1, 1, 1, 1,]);
        setTextToDisplay("Move");

        const q2 = query(collection(db, "leagues", "" + league, "members"));
        const querySnapshot2 = await getDocs(q2);
      
        let userDocId = "";
        querySnapshot2.forEach((doc2) => {
            if(doc2.data().memberId == user.uid) {
              userDocId = doc2.id
              getRoster(doc2);
            }
        })
    }

    async function getRoster(doc2) {
        setQb(doc2.data().qb);
        names[0] = doc2.data().qb;
        setRb(doc2.data().rb);
        names[1] = doc2.data().rb;
        setWr1(doc2.data().wr1);
        names[2] = doc2.data().wr1;
        setWr2(doc2.data().wr2);
        names[3] = doc2.data().wr2;
        setTe(doc2.data().te);
        names[4] = doc2.data().te;
        setB1(doc2.data().bench1);
        names[5] = doc2.data().bench1;
        setB2(doc2.data().bench2);
        names[6] = doc2.data().bench2;
        setB3(doc2.data().bench3);
        names[7] = doc2.data().bench3;

        // if(playerImages[0] == 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146') {
          getPlayerImages(names[0], 0);
          getPlayerImages(names[1], 1);
          getPlayerImages(names[2], 2);
          getPlayerImages(names[3], 3);
          getPlayerImages(names[4], 4);
          getPlayerImages(names[5], 5);
          getPlayerImages(names[6], 6);
          getPlayerImages(names[7], 7);
          // scraped2 = true;
        // }
    }

 
    //fix up bench
    function selectPlayer(position, name, index) {
      if(textToDisplay == "Move") {
        if(position == "QB") {
          setDisabled([false, true, true, true, true, false, false, false]);
          setOpacities([1, .3, .3, .3, .3, 1, 1, 1])
        }
        else if(position == "RB") {
          setDisabled([true, false, true, true, true, false, false, false]);
          setOpacities([.3, 1, .3, .3, .3, 1, 1, 1])
        }
        else if(position == "WR") {
          setDisabled([true, true, false, false, true, false, false, false]);
          setOpacities([.3, .3, 1, 1, .3, 1, 1, 1])
        }
        else if(position == "TE") {
          setDisabled([true, true, true, true, false, false, false, false]);
          setOpacities([.3, .3, .3, .3, 1, 1, 1, 1])
        }
        else if(position == "B") {
          getBenchPosition(name, index);
        }
        startIndex = index;
        setTextToDisplay("Here");
      }

      else if(textToDisplay == "Here") {
        rearrangePlayers(position, name, index);
      }
    }

    async function rearrangePlayers(position, name, index) {
      let endIndex = index;
      temp = names[startIndex];
      names[startIndex] = names[endIndex];
      names[endIndex] = temp;

      const q2 = query(collection(db, "leagues", "" + league, "members"));
      const querySnapshot2 = await getDocs(q2);

      let docId;
      querySnapshot2.forEach((doc2) => {
          if(doc2.data().memberId == user.uid) {
            docId = doc2.id;
          }
      })

      let toUpdate = doc(db, "leagues", "" + league, "members", "" + docId);

      await updateDoc(toUpdate, {
        qb: names[0],
        rb: names[1],
        wr1: names[2],
        wr2: names[3],
        te: names[4],
        bench1: names[5],
        bench2: names[6],
        bench3: names[7]
      });

      getPlayerImages(names[startIndex], startIndex);
      getPlayerImages(names[endIndex], endIndex);

      startFind();
    }

    async function getBenchPosition(name, index) {
      const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
      ApiKeyAuth.apiKey = "Bearer iEgwLD0Q2/fKfE2JrnvQXS2kb4Yim4jMK4PxkPQGiaQ7EJX54+W8ZrTwuVgB6vJ6";
  
      var api = new cfb.PlayersApi();
      var player = await api.playerSearch(name);
      // console.log(player[0].position);
      selectPlayer(player[0].position, name, index);
    }

    const PlayerCell = ({position, name, navigation, index}) => {
      return  (
          <TouchableOpacity disabled = {disabled[index]} style={[styles.item, {opacity: opacities[index]}]} onPress={() => showPlayerInfo(name, navigation)}>
              <View style={styles.itemLeft}>
                  <View style={styles.square}>
                      <Text style = {styles.positionText}>{position}</Text>
                  </View>
                  <View>
                   <Image source={{uri: playerImages[index]}} style = {{width: 40, height: 40}}></Image> 
                  </View>
                  <Text style={styles.itemText}>{name}</Text>
              </View>
              <TouchableOpacity  disabled = {disabled[index]} style = {{backgroundColor: '#9f86fc', opacity: 0.9, borderRadius: 5, justifyContent: "center", width: 75, height: 30}} onPress={() => selectPlayer(position, name, index)}>
                      <View>
                          <Text style = {[styles.sectionTitle, {fontSize: 16, textAlign: "center", marginBottom: 0}]}>{textToDisplay}</Text>
                      </View>
                  </TouchableOpacity>
          </TouchableOpacity>
      )
    }
  
    function showPlayerInfo(name, navigation){
      console.log('showing player info on: ' + name);
      navigation.navigate("PlayerInfo", {
        playerName: name,
        league: league
    });
    }

    async function dropPlayer () {
      let toUpdate2 = doc(db, "leagues", "" + league);
      let document = await getDoc(toUpdate2);
      currentDrafted = document.data().drafted;

      indexToFind = currentDrafted.indexOf(names[startIndex]);

      currentDrafted.splice(indexToFind, 1);

     await updateDoc(toUpdate2, {
        drafted: currentDrafted
      });

      let name = names[startIndex];

      names[startIndex] = "";

      const q2 = query(collection(db, "leagues", "" + league, "members"));
      const querySnapshot2 = await getDocs(q2);

      let docId;
      querySnapshot2.forEach((doc2) => {
          if(doc2.data().memberId == user.uid) {
            docId = doc2.id;
          }
      })

      let toUpdate = doc(db, "leagues", "" + league, "members", "" + docId);

      await updateDoc(toUpdate, {
        qb: names[0],
        rb: names[1],
        wr1: names[2],
        wr2: names[3],
        te: names[4],
        bench1: names[5],
        bench2: names[6],
        bench3: names[7]
      });

      let toAddTo = collection(db, "leagues", "" + league, "drafted");
      const q = query(toAddTo);
      const querySnapshot = await getDocs(q);
      let arrOfPlayers = [];
      querySnapshot.forEach((doc) => {
        if(name == doc.data().name) {
          console.log(doc.data().name);
          console.log(name);
          del(doc.id);
        }
      });

      let currentPlayers = playerImages;
      currentPlayers[startIndex] = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146';
      setPlayerImages(currentPlayers);
      forceUpdate();


      startFind();
    }

    async function del(document){
      await deleteDoc(doc(db, "leagues", "" + league, "drafted", document));
    }


    return (
      <View style = {styles.container}>
      <View style = {{flexDirection: "row", width: 600,}}>
        <Text style={styles.sectionTitle}>Your Squad</Text>
        {(textToDisplay == "Here")?
              <TouchableOpacity style = {{backgroundColor: 'red', opacity: 0.9, borderRadius: 5, justifyContent: "center", width: 75, height: 30, marginLeft: 100, marginTop: 5}} onPress={() => dropPlayer()}>
                  <View>
                      <Text style = {[styles.sectionTitle, { fontSize: 16, textAlign: "center", marginBottom: 0}]}>Drop</Text>
                  </View>
              </TouchableOpacity>
          : null }
        </View>
          <ScrollView>

            <View style = {{height: 750}}>
              <PlayerCell position = "QB" name = {qb} navigation = {navigation} index = {0}></PlayerCell>
              <PlayerCell position = "RB" name = {rb} navigation = {navigation} index = {1}></PlayerCell>
              <PlayerCell position = "WR" name = {wr1} navigation = {navigation} index = {2}></PlayerCell>
              <PlayerCell position = "WR" name = {wr2} navigation = {navigation} index = {3}></PlayerCell>
              <PlayerCell position = "TE" name = {te} navigation = {navigation} index = {4}></PlayerCell>
              <PlayerCell position = "B" name = {b1} navigation = {navigation} index = {5}></PlayerCell>
              <PlayerCell position = "B" name = {b2} navigation = {navigation} index = {6}></PlayerCell>
              <PlayerCell position = "B" name = {b3} navigation = {navigation} index = {7}></PlayerCell>
            </View>

      </ScrollView>
      </View>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        padding: 20,
        backgroundColor: 'black',
        width: 400,
        // height: 1500
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
      width: 33,
      height: 33,
      backgroundColor: '#9f86fc',
      opacity: 0.9,
      borderRadius: 5,
      marginRight: 15,
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
        color: "white"
    },
    positionText: {
        textAlign: "center",
        color: "white"
    }
  });