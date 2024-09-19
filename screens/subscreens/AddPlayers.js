import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker, TouchableHighlight } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, onSnapshot, updateDoc} from 'firebase/firestore';
import {auth, db} from '../../firebase.js';
import React,{useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from "@react-navigation/native";
import Modal from "react-native-modal";

const fetch = require("node-fetch");
const cheerio = require("cheerio");

const cfb = require('cfb.js');
const defaultClient = cfb.ApiClient.instance;
const URL = "https://www.espn.com/college-football/teams";


let user;
let drafted = [];
let leagueId;
let positionAdding = "";

export default function AddPlayers({league}){
  const isFocused = useIsFocused(); 
  const navigation = useNavigation();

  const [playerData, setPlayerData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const[playerAdding, setPlayerAdding] = useState("");

  const [showError, setShowError] = useState(false);

    useEffect(() => {
        // console.log('pulling data')
        if(isFocused){ 
            doNothing('qbs');
            user = auth.currentUser;
        }
    }, [isFocused]);
    

    leagueId = league;

    onSnapshot((doc(db, "leagues", leagueId + "")), doc => {
      drafted = doc.data().drafted;
    });

    let itemList;
    async function doNothing(pos){
  
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

    const Col = ({children }) => {
      return  (
        <View style={styles.playerInfo}>{children}</View>
      )
    }
    
    const Row = ({ children }) => (
      <View style={styles.row}>{children}</View>
    )

    function showPlayerInfo(name, navigation){
      console.log('showing player info on: ' + name);
      navigation.navigate("PlayerInfo", {
        playerName: name,
        league: leagueId
    });
    }

    function showConfirmation(position, name) {
      setModalVisible(true);
      setShowError(false);
      setPlayerAdding(name);
      positionAdding = position;
    }

    async function add() {
      const q2 = query(collection(db, "leagues", "" + leagueId, "members"));
      const querySnapshot2 = await getDocs(q2);
    
      let userDocId = "";
      querySnapshot2.forEach((doc2) => {
          if(doc2.data().memberId == user.uid) {
            userDocId = doc2.id
            fillRoster(playerAdding, positionAdding, userDocId, doc2);
          }
      })
    }

    async function fillRoster(name, position, userDocId, doc2) {

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
        setShowError(true);
        console.log("you have filled this position");
      }
    }

    async function updateVals(name, navigation) {
      let toAddTo = doc(db, "leagues", "" + leagueId);
      let document = await getDoc(toAddTo);
      let currentDrafted = document.data().drafted;
    
      navigation.navigate("Roster");
      currentDrafted.push(name);

      setModalVisible(false);
      
      await updateDoc(toAddTo, {
        drafted: currentDrafted,
      });

      getImages(name, updateImages)
    
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
    }

    const PlayerCell = ({position, name, navigation}) => {
      return  (
          <TouchableOpacity  style = {styles.item} onPress={() => showPlayerInfo(name, navigation)}>
              <View style={styles.itemLeft}>
                  <View style={styles.square}>
                      <Text style = {styles.positionText2}>{position}</Text>
                  </View>
                  <Text style={styles.itemText}>{name}</Text>
              </View>
              <TouchableOpacity  style = {{backgroundColor: '#9f86fc', opacity: 0.9, borderRadius: 5, justifyContent: "center", width: 75, height: 30}} onPress={() => showConfirmation(position, name)}>
                      <View>
                          <Text style = {[styles.sectionTitle, {fontSize: 16, textAlign: "center", marginBottom: 0}]}>ADD</Text>
                      </View>
                  </TouchableOpacity>
          </TouchableOpacity>
      )
    }

    return (
        <View style = {{backgroundColor: "black"}}>
          <Text style={[styles.sectionTitle, {paddingTop: 60}]}>Add Players</Text>
          <View>
            <Modal
                isVisible={modalVisible}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={[styles.sectionTitle, {color: "black", textAlign: "center"}]}>Proceed?</Text>
                    <Text style = {[styles.modalText, {fontWeight: "bold"}]}>Adding:</Text>
                    <Text>{playerAdding}</Text>
                    {(showError == true)?
                          <Text style = {{color: "red", marginTop: 20, textAlign: "center", fontWeight: "bold", fontSize: 10}}>This trade is not possible, rearrange your roster and try again</Text>
                        : null }
                    <TouchableOpacity style={[styles.button, styles.buttonClose, {marginTop: 20}]} onPress={() => add()}>
                        <Text style={styles.textStyle}>Confirm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.buttonOpen, {marginTop: 20}]} onPress={() => setModalVisible(false)}>
                        <Text style={styles.textStyle}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
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
          <ScrollView style = {[styles.container]}>
              {playerData}
        </ScrollView>
      </View>
      
    );
}


const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: 'black',
      width: 400,
      height: 606
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
    positionText2: {
        textAlign: "center",
        color: "white"
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
    row: {
      flexDirection: "row"
    },
    playerInfo: {
      backgroundColor:  "#1F1F1F",
      // borderColor:  "#fff",
      // borderWidth:  1,
      flex:  2
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      paddingBottom:10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      textAlign: 'center',
    },
  });