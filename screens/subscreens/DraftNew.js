import {StyleSheet, Button, View, SafeAreaView, Text, Alert, FlatList, Image, TouchableHighlight, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';

import { useNavigation } from '@react-navigation/core'
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, onSnapshot, updateDoc} from 'firebase/firestore';
import {auth, db} from '../../firebase.js';
import React,{useState, useEffect} from 'react';
import { useIsFocused } from "@react-navigation/native";

const fetch = require("node-fetch");
const cheerio = require("cheerio");

const cfb = require('cfb.js');
const defaultClient = cfb.ApiClient.instance;

const URL = "https://www.espn.com/college-football/teams";

let leagueId;
let currentTurn = 0;
let user;
let drafted = [];
let currentRound;
let awayFromDraftScreen = false;
let userTurn;
let leagueSize;

export default function DraftNew({league}) {
  const isFocused = useIsFocused(); 
  const [isLoading, setIsLoading] = useState(false)

  const [clockText, setClockText] = useState("");

    useEffect(() => {
      // console.log('pulling data')
      setInitialText();

      doNothing('qbs');
      if(isFocused){ 
          user = auth.currentUser;
  }}, [isFocused])

  const [playerData, setPlayerData] = useState([]);

  const navigation = useNavigation();


  leagueId = league;

  onSnapshot((doc(db, "leagues", leagueId + "")), doc => {
      if(doc.data().turn != currentTurn) {
        doNothing('qbs');
        currentTurn = doc.data().turn;
      }
       currentTurn = doc.data().turn;
       drafted = doc.data().drafted;
       currentRound = doc.data().round;

        if(userTurn == currentTurn) {
            setClockText("You Are On the Clock!")
        }
        else if(userTurn > currentTurn) {
          setClockText("Up In " + (userTurn-currentTurn ).toString() + " Moves")
        }
        else if(userTurn < currentTurn) {
          setClockText("Up In " + (leagueSize - (currentTurn-userTurn)).toString() + " Moves")
        }

       if(doc.data().draftEnded == true && !awayFromDraftScreen) {
        navigation.replace("LeagueOverview", {
          league: leagueId
        });
        awayFromDraftScreen = true;
      }
  });

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  async function setInitialText() {
    let toAddTo = doc(db, "leagues", "" + leagueId);
    let document = await getDoc(toAddTo);

    leagueSize = document.data().size;
    currentTurn = document.data().turn;

    const querySnapshot = await getDocs(collection(db, "leagues", leagueId, "members"));
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    if(doc.data().memberId == user.uid) {
      userTurn = doc.data().userTurn;
    }
  });

  console.log(userTurn)

  if(userTurn == currentTurn) {
      setClockText("You Are On the Clock!")
  }
  else if(userTurn > currentTurn) {
    setClockText("Up In " + userTurn-currentTurn + " Moves")
  }
  else if(userTurn < currentTurn) {
    setClockText("Up In " + leagueSize - (currentTurn-userTurn) + " Moves")
  }
}

  let itemList;
  async function doNothing(pos){
    console.log('doing')

   const q = query(collection(db, "" + pos));
   const querySnapshot = await getDocs(q);
   let arrOfPlayers = [];
   querySnapshot.forEach((doc) => {
     if(arrOfPlayers.length <= 20 ) {
       arrOfPlayers.push(doc.data());
     }
   });

   itemList=arrOfPlayers.map((item,index)=>{
      if(!(drafted.includes(item.firstName + " " + item.lastName))) {
        return (
          <PlayerCell key = {index} numRows = {2} position = {item.position} name = {item.firstName + " " + item.lastName} navigation = {navigation}></PlayerCell>
        );
      }
   });

   setPlayerData(itemList);
  }

  async function draftPlayer(name, navigation, position){
  
    const querySnapshot = await getDocs(collection(db, "leagues", leagueId, "members"));
      querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if(doc.data().memberId == user.uid) {
        userTurn = doc.data().userTurn;
      }
    });
  
    if(currentTurn == userTurn) {
        const q2 = query(collection(db, "leagues", "" + leagueId, "members"));
        const querySnapshot2 = await getDocs(q2);
      
        let userDocId = "";
        querySnapshot2.forEach((doc2) => {
            if(doc2.data().memberId == user.uid) {
              userDocId = doc2.id
              fillRoster(name, position, userDocId, doc2, navigation);
            }
        })
    }
  }
  
  async function fillRoster(name, position, userDocId, doc2, navigation) {
  
    let userDrafting = doc(db, "leagues", "" + leagueId, "members", "" + userDocId);
    if((doc2.data().qb == "") && position == "QB") {
      await updateDoc(userDrafting, {
        qb: name
      });
      updateVals(name, navigation);
    }
    else if((doc2.data().rb == "") && position == "RB") {
      await updateDoc(userDrafting, {
        rb: name
      });
      updateVals(name, navigation);
    }
    else if((doc2.data().te == "") && position == "TE") {
      await updateDoc(userDrafting, {
        te: name
      });
      updateVals(name, navigation);
    }
    else if(position == "WR") {
      if(doc2.data().wr1 == "") {
        await updateDoc(userDrafting, {
          wr1: name
        });
        updateVals(name, navigation);
      }
      else if (doc2.data().wr2 == "") {
        await updateDoc(userDrafting, {
          wr2: name
        });
        updateVals(name, navigation);
      }
    }
    else if(doc2.data().bench1 == "") {
      await updateDoc(userDrafting, {
        bench1: name
      });
      updateVals(name, navigation);
    }
    else if(doc2.data().bench2 == "") {
      await updateDoc(userDrafting, {
        bench2: name
      });
      updateVals(name, navigation);
    }
    else if(doc2.data().bench3 == "") {
      await updateDoc(userDrafting, {
        bench3: name
      });
      updateVals(name, navigation);
    }
    else {
      console.log("you have filled this position");
    }
  }
  
  async function updateVals(name, navigation) {
    let toAddTo = doc(db, "leagues", "" + leagueId);
    let document = await getDoc(toAddTo);
    let currentDrafted = document.data().drafted;
    leagueSize = document.data().size;

    // navigation.navigate("Drafted");
    currentDrafted.push(name);
  
    if(currentTurn + 1 == leagueSize) {
      currentTurn = -1;
      currentRound += 1;
  
      if(document.data().round == 8) {
        console.log("draft ended");
        if(!awayFromDraftScreen) {
          navigation.replace("LeagueOverview", {
            league: leagueId
          });
          awayFromDraftScreen = true;
        }
        await updateDoc(toAddTo, {
          draftEnded: true,
        });
      }
    }
    setIsLoading(true);
    navigation.navigate("Drafted");
    getImages(name, updateImages);
    
    await updateDoc(toAddTo, {
      turn: (currentTurn + 1),
      drafted: currentDrafted,
      round: currentRound
    });
  }
  
  
  const getRawData = (URL) => {
    return fetch(URL)
       .then((response) => response.text())
       .then((data) => {
          return data;
       });
  };
  
  async function getImages(name, callBack) {
    const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
    ApiKeyAuth.apiKey = "Bearer iEgwLD0Q2/fKfE2JrnvQXS2kb4Yim4jMK4PxkPQGiaQ7EJX54+W8ZrTwuVgB6vJ6";
    var api = new cfb.PlayersApi();
  
    var player = await api.playerSearch(name);
  
    var teamToSearch = player[0].team;
    // console.log(teamToSearch)
  
    const rawData = await getRawData(URL);
    const parsedData = cheerio.load(rawData);
  
    var allTeamLinks = parsedData('div.pl3').children('a');
    var teamLink = "";
    let finalLink;
  
    for(var i = 0; i < allTeamLinks.length; i++) {
      if(allTeamLinks.eq(i).attr('href').replace('-', '').toUpperCase().includes(teamToSearch.replace(' ', '-').toUpperCase())) {
        teamLink = allTeamLinks.eq(i).attr('href');
        linkIdNum = teamLink.substring(28);
        finalLink = "https://www.espn.com/college-football/team/roster/_/id/" + linkIdNum;
        // console.log(finalLink)
        break;
      }
    }
  
    var newRawData = await getRawData(finalLink, name);
    let imageLink;
    // console.log(newRawData)
    const newParsedData = cheerio.load(newRawData);
    for(var i = 0; i < newParsedData('img').length; i++) {
      if(newParsedData('img').eq(i).attr('title') == name) {
        imageLink = newParsedData('img').eq(i).attr('alt');
        await callBack(imageLink.toString(), name)
      }
    }
  }
  
  async function updateImages(url, name) {
    let toAddTo = collection(db, "leagues", "" + leagueId, "drafted");
    await addDoc(toAddTo, {
      name: name,
      imageURL: url
  });
  setIsLoading(false);
  }
  
  function showPlayerInfo(name, navigation){
    console.log('showing player info on: ' + name);
    navigation.navigate("PlayerInfo", {
      playerName: name,
      league: leagueId
  });
  }
  
    const PlayerCell = ({position, name, navigation}) => {
      return  (
          <TouchableOpacity style={[styles.item]} onPress={() => showPlayerInfo(name, navigation)}>
              <View style={styles.itemLeft}>
                  <View style={styles.square}>
                      <Text style = {[styles.positionText, {paddingTop: 0}]}>{position}</Text>
                  </View>
                  <Text style={styles.itemText}>{name}</Text>
              </View>
              <TouchableOpacity  style = {{backgroundColor: '#9f86fc', opacity: 0.9, borderRadius: 5, justifyContent: "center", width: 75, height: 30}} onPress={() => draftPlayer(name, navigation, position)}>
                      <View>
                          <Text style = {[styles.sectionTitle, {fontSize: 16, textAlign: "center", marginBottom: 0}]}>Draft</Text>
                      </View>
                  </TouchableOpacity>
          </TouchableOpacity>
      )
    }
    
  
  const Col = ({children }) => {
      return  (
        <View style={styles.playerInfo}>{children}</View>
      )
    }
    
    const Row = ({ children }) => (
      <View style={styles.row}>{children}</View>
    )
  
    return (
        <View style={styles.app}>
          {/* {
          isLoading ?
          <View style = {{paddingTop: 200}}>
            <ActivityIndicator size="large" color="#9f86fc" />
            <Text style = {[styles.sectionTitle, {textAlign: "center", marginTop: 10, marginRight: 10, fontSize: 10}]}>Loading...</Text>
          </View>
                : */}
        <View>
          <View  style = {{flexDirection: "row"}}>
            <Text style = {[styles.sectionTitle, {fontSize: 15}]}>{clockText}</Text>
            <TouchableOpacity style={styles.submitContainer}  onPress = {handleSignOut}>
                    <Text style={[styles.signOutText, {color: "#FFF",fontWeight: "600",fontSize: 10}]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
            <Row>
              <Col numRows={2}>
                  <TouchableHighlight onPress={() => doNothing('qbs')} underlayColor="white">
                  <View style={styles.positionFilterButton}>
                      <Text style = {styles.positionText}>QB</Text>
                  </View>
                  </TouchableHighlight>
              </Col>
              <Col numRows={2}>
                  <TouchableHighlight onPress={() => doNothing('rbs')} underlayColor="white">
                      <View style={styles.positionFilterButton}>
                          <Text style = {styles.positionText}>RB</Text>
                      </View>
                      </TouchableHighlight>
              </Col>
              <Col numRows={2}>
                  <TouchableHighlight onPress={() => doNothing('wrs')} underlayColor="white">
                      <View style={styles.positionFilterButton}>
                          <Text style = {styles.positionText}>WR</Text>
                      </View>
                      </TouchableHighlight>
              </Col>
              <Col numRows={2}>
                  <TouchableHighlight onPress={() => doNothing('tes')} underlayColor="white">
                      <View style={styles.positionFilterButton}>
                          <Text style = {styles.positionText}>TE</Text>
                      </View>
                      </TouchableHighlight>
              </Col>
            </Row>

            <ScrollView>
              {playerData}
            </ScrollView>
          </View>
          {/* } */}

        </View>
      )
}


const styles = StyleSheet.create({
    app: {
        paddingTop: 50,
        paddingRight: 20,
        paddingLeft: 20,
        flex: 4, // the number of columns you want to devide the screen into
        marginHorizontal: "auto",
        width: 400,
        backgroundColor: "black"
      },

      row: {
        flexDirection: "row"
      },

      textAtBottom: {
        paddingTop: 20
      },
      playerInfo: {
        backgroundColor:  "#1F1F1F",
        // borderColor:  "#fff",
        // borderWidth:  1,
        flex:  2,
        marginBottom: 10
      },
      positionFilterButton: {
        backgroundColor:'#b98dfc',
        borderRadius:10,
        borderWidth: 1,
        height: 45,
        borderColor: '#fff'
      },
      positionText: {
        textAlign: 'center',
        color: '#fff',
        paddingTop: 10
      },

      submitContainer: {
        backgroundColor: "#b98dfc",
        fontSize: 16,
        borderRadius: 4,
        // paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        // marginLeft: 50,
        position: "absolute",
        right: 0,
        color: "#FFF",
        shadowColor: "#b98dfc",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
        marginBottom: 20,
        width: 80
    },
    signOutText: {
      fontSize: 5
    },
    itemText: {
      maxWidth: '80%',
      color: "white"
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: "white"
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
   });