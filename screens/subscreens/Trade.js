import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker, TouchableHighlight } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, updateDoc} from 'firebase/firestore';
import {auth, db} from '../../firebase.js';
import React,{useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from "@react-navigation/native";
import Modal from "react-native-modal";

let user;
let currentTrade = "";

let otherTeams = [];
let currentProposals = [];
let currentOffers = [];

let requestedPlayers = [];
let requestedNames = [];

let offeredPlayers = [];
let offeredNames = [];

export default function Trade({league}){
  const isFocused = useIsFocused(); 
  const navigation = useNavigation();

  const [teamData, setTeamData] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [offers, setOffers] = useState([]);

  const [allReceived, setAllReceived] = useState([]);
  const [allOffered, setAllOffered] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  
  const [, updateState] = useState();
  const forceUpdate = React.useCallback(() => updateState({}, []));

    useEffect(() => {
        // console.log('pulling data')
        otherTeams = [];
        currentProposals = [];
        currentOffers = [];

        requestedPlayers = [];
        requestedNames = [];

        offeredPlayers = [];
        offeredNames = [];

        currentTrade = "";

        findAllTeams();
        findAllProposals();
        findAllOffers();

        if(isFocused){ 
            user = auth.currentUser;
        }
    }, [isFocused])

    async function getTradeInfo(num, tradeId) {
      currentTrade = tradeId;
      
      requestedNames = [];
      requestedPlayers = [];

      offeredNames = [];
      offeredPlayers = [];

      if(num == 1) {
        const q2 = query(collection(db, "leagues", "" + league, "trades", tradeId, "team1Players"));
        const querySnapshot2 = await getDocs(q2);
  
        querySnapshot2.forEach((doc2) => {
            offeredNames.push(doc2.data().name);
            offeredPlayers.push(doc2.data().position);
        });

        const q3 = query(collection(db, "leagues", "" + league, "trades", tradeId, "team2Players"));
        const querySnapshot3 = await getDocs(q3);
  
        querySnapshot3.forEach((doc2) => {
            requestedNames.push(doc2.data().name);
            requestedPlayers.push(doc2.data().position);
        })
        setModal2Visible(true);
      }
      else if(num == 2) {
        const q2 = query(collection(db, "leagues", "" + league, "trades", tradeId, "team2Players"));
        const querySnapshot2 = await getDocs(q2);
  
        querySnapshot2.forEach((doc2) => {
            offeredNames.push(doc2.data().name);
            offeredPlayers.push(doc2.data().position);
        });

        const q3 = query(collection(db, "leagues", "" + league, "trades", tradeId, "team1Players"));
        const querySnapshot3 = await getDocs(q3);
  
        querySnapshot3.forEach((doc2) => {
            requestedNames.push(doc2.data().name);
            requestedPlayers.push(doc2.data().position);
        })
        setModalVisible(true);
      }

      itemList=requestedNames.map((item,index)=>{
        return (
            <Text key = {index}>{requestedPlayers[index].toUpperCase()} | {item}</Text>
        );
      });
      setAllReceived(itemList);
      itemList=offeredNames.map((item,index)=>{
          return (
              <Text key = {index}>{offeredPlayers[index].toUpperCase()} | {item}</Text>
          );
      });
      setAllOffered(itemList);
    }

    async function findAllOffers() {
      const q2 = query(collection(db, "leagues", "" + league, "trades"));
      const querySnapshot2 = await getDocs(q2);

      querySnapshot2.forEach((doc2) => {
          if(doc2.data().team2 == user.uid) {
              currentOffers.push(doc2.data());
          }
          displayOffers(doc2.id);
      })
    }

    async function displayOffers(tradeId) {
      itemList=currentOffers.map((item,index)=>{
        return (
          <TouchableOpacity  key = {index} style={styles.item} onPress={() => getTradeInfo(2, tradeId)}>
            <View style={styles.itemLeft}>
                <View style={styles.square}>
                    <Text style = {styles.positionText}></Text>
                </View>
                <Text style={styles.itemText}>Offer {index + 1}</Text>
            </View>
            <View style={styles.circular}></View>
        </TouchableOpacity>
        );
     });
      setOffers(itemList);
      forceUpdate();
    }

    async function findAllProposals() {
      const q2 = query(collection(db, "leagues", "" + league, "trades"));
      const querySnapshot2 = await getDocs(q2);

      querySnapshot2.forEach((doc2) => {
          if(doc2.data().team1 == user.uid) {
              currentProposals.push(doc2.data());
          }
          displayProposals(doc2.id);
      })
    }

    async function displayProposals(tradeId) {
      itemList=currentProposals.map((item,index)=>{
        return (
          <TouchableOpacity  key = {index} style={styles.item} onPress={() => getTradeInfo(1, tradeId)}>
            <View style={styles.itemLeft}>
                <View style={styles.square}>
                    <Text style = {styles.positionText}></Text>
                </View>
                <Text style={styles.itemText}>Proposal {index + 1}</Text>
            </View>
            <View style={styles.circular}></View>
        </TouchableOpacity>
        );
     });
      setProposals(itemList);
    }

    async function findAllTeams() {
      const q2 = query(collection(db, "leagues", "" + league, "members"));
      const querySnapshot2 = await getDocs(q2);

      querySnapshot2.forEach((doc2) => {
          if(doc2.data().memberId != user.uid) {
              otherTeams.push(doc2.data());
          }
          displayTeams();
      })
    }

    async function displayTeams() {
      itemList=otherTeams.map((item,index)=>{
        return (
          <TouchableOpacity  key = {index} style={styles.item} onPress={() => showTeamInfo(item.memberId)}>
            <View style={styles.itemLeft}>
                <View style={styles.square}>
                    <Text style = {styles.positionText}></Text>
                </View>
                <Text style={styles.itemText}>Team {index + 1}</Text>
            </View>
            <View style={styles.circular}></View>
        </TouchableOpacity>
        );
    });
      setTeamData(itemList);
    }

    function showTeamInfo(id) {
      navigation.navigate("TradeRosters", {
        teamId: id,
        league: league
      });
    }

    let tempQb = "";
    let tempRb = "";
    let tempWr1 = "";
    let tempWr2 = "";
    let tempTe = "";
    let tempB1 = "";
    let tempB2 = "";
    let tempB3 = "";
    function checkIfPossible(doc2) {
      let toReturn = true;

      tempQb = doc2.data().qb;
      tempRb = doc2.data().rb;
      tempWr1 = doc2.data().wr1;
      tempWr2 = doc2.data().wr2;
      tempTe = doc2.data().te;
      tempB1 = doc2.data().bench1;
      tempB2 = doc2.data().bench2;
      tempB3 = doc2.data().bench3;

      for(var i = 0; i < requestedPlayers.length; i++) {
          let currentRun = true;
          if(requestedPlayers[i] == "qb"){
            if(doc2.data().qb != "") {
              if(offeredPlayers.includes("qb")) {
                tempQb = requestedNames[i];
              }
              else{
                currentRun =  false;
              }
            }
            else {
              tempQb = requestedNames[i];
            }
          }
          else if(requestedPlayers[i] == "rb") {
            if((doc2.data().rb != "")) {
              if(offeredPlayers.includes("rb")) {
                tempRb = requestedNames[i]
              }
              else{
                currentRun =  false;
              }
            }
            else {
              tempRb = requestedNames[i];
            }
          }
          else if(requestedPlayers[i] == "te") {
            if((doc2.data().te != "")) {
              if(offeredPlayers.includes("te")) {
                tempTe = requestedNames[i]
              }
              else{
                currentRun =  false;
              }
            }
            else {
              tempTe = requestedNames[i];
            }
          }
            else if(requestedPlayers[i] == "wr1" || requestedPlayers[i] == "wr2") {
              if(doc2.data().wr1 != "" && doc2.data().wr2 != ""){
                  if(offeredPlayers.includes("wr1") && tempWr1 == doc2.data().wr1){
                    tempWr1 = requestedNames[i];
                  } 
                  else if(offeredPlayers.includes("wr2") && tempWr2 == doc2.data().wr2) {
                    tempWr2 = requestedNames[i];
                  }
                  else{
                    currentRun =  false;
                  }
              }
              else if(doc2.data().wr1 == "" && tempWr1 == doc2.data().wr1) {
                tempWr1 = requestedNames[i];
              }
              else if(doc2.data().wr2 == "" && tempWr2 == doc2.data().wr2) {
                tempWr2 = requestedNames[i];
              }
              else {
                  if(offeredPlayers.includes("wr1")){
                    tempWr1 = requestedNames[i];
                  } 
                  else if (offeredPlayers.includes("wr2")) {
                    tempWr2 = requestedNames[i];
                  }
                  else{
                      currentRun =  false;
                  }
              }
            }
            if(!currentRun) {
              if(doc2.data().bench1 == "" && tempB1 == doc2.data().bench1){
                tempB1 = requestedNames[i];
                currentRun = true;
              }
              else if(doc2.data().bench2 == "" && tempB2 == doc2.data().bench2) {
                tempB2 = requestedNames[i];
                currentRun = true;
              }
              else if(doc2.data().bench3 == "" && tempB3 == doc2.data().bench3) {
                tempB3 = requestedNames[i];
                currentRun = true;
              }
            }
            if(!currentRun) {
              toReturn = false;
            }
      }
      return toReturn;
    }

    async function acceptTrade() {
      setModalVisible(false);
      const q2 = query(collection(db, "leagues", "" + league, "members"));
      const querySnapshot2 = await getDocs(q2);
    
      let document = "";
      let docId;
      querySnapshot2.forEach((doc2) => {
          if(doc2.data().memberId == user.uid) {
            document = doc2;
            docId = doc2.id;
          }
      })

      let userTrading = doc(db, "leagues", "" + league, "members", "" + docId);

      if(checkIfPossible(document)) {
        await updateDoc(userTrading, {
          qb: tempQb,
          rb: tempRb,
          wr1: tempWr1,
          wr2: tempWr2,
          te: tempTe,
          bench1: tempB1,
          bench2: tempB2,
          bench3: tempB3
        });
        let temp = requestedNames;
        let temp2 = requestedPlayers;

        requestedNames = offeredNames;
        requestedPlayers = offeredPlayers;

        offeredNames = temp;
        offeredPlayers = temp2;

        const q2 = query(collection(db, "leagues", league, "trades"));
        const querySnapshot2 = await getDocs(q2);

        let otherId;
        querySnapshot2.forEach((doc2) => {
          if(doc2.id == currentTrade) {
            otherId = doc2.data().team1;
          }
        })

        const q3 = query(collection(db, "leagues", league, "members"));
        const querySnapshot3 = await getDocs(q3);
      
        document = "";
        querySnapshot3.forEach((doc2) => {
            if(doc2.data().memberId == otherId) {
              document = doc2;
              docId = doc2.id;
            }
        })

        userTrading = doc(db, "leagues", "" + league, "members", "" + docId);

        checkIfPossible(document);

        await updateDoc(userTrading, {
          qb: tempQb,
          rb: tempRb,
          wr1: tempWr1,
          wr2: tempWr2,
          te: tempTe,
          bench1: tempB1,
          bench2: tempB2,
          bench3: tempB3
        });

        deleteTrade();
        navigation.navigate("Roster", {
          scraped: false
        });
      }
      
    }

    async function deleteTrade() {
      setModalVisible(false);
      await deleteDoc(doc(db, "leagues", "" + league, "trades", "" + currentTrade));

      currentProposals = [];
      currentOffers = [];

      requestedPlayers = [];
      requestedNames = [];

      offeredPlayers = [];
      offeredNames = [];
      findAllProposals();
      findAllOffers();
    }

    return (
      <View style = {{backgroundColor: "black"}}>
          <View>
            <Modal
                isVisible={modalVisible}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={[styles.sectionTitle, {color: "black", textAlign: "center"}]}>Trade Summary</Text>
                    <Text style = {[styles.modalText, {fontWeight: "bold"}]}>You Receive</Text>
                    {allReceived}
                    <Text style = {[styles.modalText, {marginTop: 20, fontWeight: "bold"}]}>You Offer</Text>
                    {allOffered}
                    <TouchableOpacity style={[styles.button, styles.buttonClose, {marginTop: 20}]} onPress={() => acceptTrade()}>
                        <Text style={styles.textStyle}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.buttonOpen, {marginTop: 20}]} onPress={() => deleteTrade()}>
                        <Text style={styles.textStyle}>Deny</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
          </View>
          <View>
            <Modal
                isVisible={modal2Visible}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={[styles.sectionTitle, {color: "black", textAlign: "center"}]}>Trade Summary</Text>
                    <Text style = {[styles.modalText, {fontWeight: "bold"}]}>You Receive</Text>
                    {allReceived}
                    <Text style = {[styles.modalText, {marginTop: 20, fontWeight: "bold"}]}>You Offer</Text>
                    {allOffered}
                    <TouchableOpacity style={[styles.button, styles.buttonOpen, {marginTop: 20}]} onPress={() => setModal2Visible(!modal2Visible)}>
                        <Text style={styles.textStyle}>Close</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
          </View>
          <Text style={[styles.sectionTitle, {paddingTop: 60}]}>Offer New</Text>
          <ScrollView style = {[styles.container, {height: "24%"}]}>
              {teamData}
        </ScrollView>
        <Text style={[styles.sectionTitle]}>Pending Offers</Text>
        <ScrollView style = {[styles.container, {height: "24%"}]}>
              {offers}
        </ScrollView>
        <Text style={[styles.sectionTitle]}>Sent Proposals</Text>
        <ScrollView style = {[styles.container, {height: "24%"}]}>
              {proposals}
        </ScrollView>
      </View>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
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