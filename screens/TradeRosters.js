import { Pressable, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker, TouchableHighlight } from "react-native";
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {auth, db} from '../firebase.js';
import React,{useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from "@react-navigation/native";
import Modal from "react-native-modal";


let requestedPlayers = [];
let requestedNames = [];

let offeredPlayers = [];
let offeredNames = [];

export default function TradeRosters ({route}) {
    const isFocused = useIsFocused(); 
    const navigation = useNavigation();

    const [qb, setQb] = useState("");
    const [rb, setRb] = useState("");
    const [wr1, setWr1] = useState("");
    const [wr2, setWr2] = useState("");
    const [te, setTe] = useState("");

    const [xqb, setxQb] = useState("");
    const [xrb, setxRb] = useState("");
    const [xwr1, setxWr1] = useState("");
    const [xwr2, setxWr2] = useState("");
    const [xte, setxTe] = useState("");

    const [disabled,setDisabled]=useState([false, false, false, false, false]);
    const [opacities,setOpacities]=useState([1, 1, 1, 1, 1]);

    const [xdisabled,setxDisabled]=useState([false, false, false, false, false]);
    const [xopacities,setxOpacities]=useState([1, 1, 1, 1, 1]);

    const [modalVisible, setModalVisible] = useState(false);

    const [allReceived, setAllReceived] = useState([]);
    const [allOffered, setAllOffered] = useState([]);

    const [showError, setShowError] = useState(false);

    const [, updateState] = useState();
    const forceUpdate = React.useCallback(() => updateState({}, []));


    let team2 = route.params.teamId;


    useEffect(() => {
        if(isFocused){ 
          console.log(opacities)
          if(opacities[0] == 1 && opacities[1] == 1 && opacities[2] == 1 && opacities[3] == 1 && opacities[4] == 1) {
            console.log('true')
            requestedPlayers = [];
            requestedNames = [];
            offeredPlayers = [];
            offeredNames = [];
          }
          console.log('focused')
            getRosters();
            user = auth.currentUser;
        }
    }, [isFocused]);

    async function getRosters() {
        const q2 = query(collection(db, "leagues", "" + route.params.league, "members"));
        const querySnapshot2 = await getDocs(q2);
      
        querySnapshot2.forEach((doc2) => {
            if(doc2.data().memberId == route.params.teamId) {
              userDocId = doc2.id
              getRoster(doc2);
            }
        })

        const q = query(collection(db, "leagues", "" + route.params.league, "members"));
        const querySnapshot = await getDocs(q);
      
        querySnapshot.forEach((doc2) => {
            if(doc2.data().memberId == user.uid) {
              userDocId = doc2.id
              setxQb(doc2.data().qb);
              setxRb(doc2.data().rb);
              setxWr1(doc2.data().wr1);
              setxWr2(doc2.data().wr2);
              setxTe(doc2.data().te);
            }
        })
    }

    async function getRoster(doc2) {
        setQb(doc2.data().qb);
        setRb(doc2.data().rb);
        setWr1(doc2.data().wr1);
        setWr2(doc2.data().wr2);
        setTe(doc2.data().te);
    }

    function selectPlayer(name, position, index, playerArray, nameArray, disabledArray, opacityArray) {
        handleChangeDisable(index, playerArray, disabledArray, opacityArray);
        playerArray.push(position.toLowerCase());
        nameArray.push(name);
      }

      function handleChangeDisable(index, playerArray, disabledArray, opacityArray) {
        const nextDisable = disabledArray.map((c, i) => {
            if (i === index ) {
              // Increment the clicked counter
              return true;
            } else {
              // The rest haven't changed
              return c;
            }
          });

          const nextOpacities = opacityArray.map((c, i) => {
            if (i === index ) {
              // Increment the clicked counter
              return 0.3;
            } else {
              // The rest haven't changed
              return c;
            }
          });

          if(playerArray == requestedPlayers) {
            setDisabled(nextDisable);
            setOpacities(nextOpacities);
          }
          else {
            setxDisabled(nextDisable);
            setxOpacities(nextOpacities);
          }

      }

    const PlayerCell = ({index, position, name, navigation, playerArray, nameArray, disabledArray, opacityArray}) => {
        return  (
            <TouchableOpacity style={[styles.item, {opacity: opacityArray[index]}]} onPress={() => showPlayerInfo(name, navigation)}>
                <View style={styles.itemLeft}>
                    <View style={styles.square}>
                        <Text style = {styles.positionText}>{position}</Text>
                    </View>
                    <Text style={styles.itemText}>{name}</Text>
                </View>
                <TouchableOpacity disabled = {disabledArray[index]}  style = {{backgroundColor: '#9f86fc', opacity: 0.9, borderRadius: 5, justifyContent: "center", width: 75, height: 40}} onPress={() => selectPlayer(name, position, index, playerArray, nameArray, disabledArray, opacityArray)}>
                    <View>
                        <Text style = {[styles.sectionTitle, {fontSize: 16, textAlign: "center", marginBottom: 0}]}>Select</Text>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        )
      }
    
    
    
      function showPlayerInfo(name, navigation){
        console.log('showing player info on: ' + name);
        navigation.navigate("PlayerInfo", {
          playerName: name,
          league: route.params.league
      });
      }

      function moveToNextStage() {
        setModalVisible(true);
        setShowError(false);
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

      async function finalizeTrade() {
        const q2 = query(collection(db, "leagues", "" + route.params.league, "members"));
        const querySnapshot2 = await getDocs(q2);
      
        let doc = "";
        querySnapshot2.forEach((doc2) => {
            if(doc2.data().memberId == user.uid) {
              doc = doc2
            }
        })

        if(checkIfPossible(doc)) {
            let team1 = user.uid;
            console.log('possible')
            //make firebase entry
            let toAddTo = collection(db, "leagues", "" + route.params.league, "trades");

            const newTrade = await addDoc(toAddTo, {
                team1: team1,
                team2: team2,
            });

            let toAddTo2 = collection(db, "leagues", "" + route.params.league, "trades", newTrade.id, "team1Players");
            for(var i = 0; i < offeredPlayers.length; i++) {
                const new1Player = await addDoc(toAddTo2, {
                    name: offeredNames[i],
                    position: offeredPlayers[i]
                });
            }

            let toAddTo3 = collection(db, "leagues", "" + route.params.league, "trades", newTrade.id, "team2Players");
            for(var i = 0; i < requestedPlayers.length; i++) {
                const new2Player = await addDoc(toAddTo3, {
                    name: requestedNames[i],
                    position: requestedPlayers[i]
                });
            }
            setModalVisible(!modalVisible);
            requestedPlayers = [];
            requestedNames = [];
            offeredPlayers = [];
            offeredNames = [];
            navigation.navigate("Trade")
        }
        else {
            setShowError(true);
            console.log('impossible');
        }
      }

      function checkIfPossible(doc2) {
        let toReturn = true;
        let wrTaken = false;
        let b1Taken = false;
        let b2Taken = false;
        let b3Taken = false;
        for(var i = 0; i < requestedPlayers.length; i++) {
            let currentRun = true;
            if((doc2.data().qb != "") && requestedPlayers[i] == "qb") {
                if(offeredPlayers.includes("qb")) {
  
                }
                else{
                  currentRun =  false;
                }
              }
              else if((doc2.data().rb != "") && requestedPlayers[i] == "rb") {
                if(offeredPlayers.includes("rb")) {
  
                }
                else{
                  currentRun =  false;
                }
              }
              else if((doc2.data().te != "") && requestedPlayers[i] == "te") {
                if(offeredPlayers.includes("te")) {
  
                }
                else{
                  currentRun =  false;
                }
              }
              else if(requestedPlayers[i] == "wr1" || requestedPlayers[i] == "wr2") {
                if(doc2.data().wr1 != "" && doc2.data().wr2 != ""){
                    if(offeredPlayers.includes("wr1") || offeredPlayers.includes("wr2")) {
  
                    }
                    else{
                      currentRun =  false;
                    }
                }
                else if(wrTaken == false){
                    wrTaken = true;
                }
                else {
                    if(offeredPlayers.includes("wr1") || offeredPlayers.includes("wr2")) {
  
                    }
                    else{
                        currentRun =  false;
                    }
                }
              }
              if(!currentRun) {
                if(doc2.data().b1 == "" && !b1Taken){
                  b1Taken = true
                  currentRun = true;
                }
                else if(doc2.data().b2 == "" && !b2Taken) {
                    b2Taken = true;
                    currentRun = true;
                }
                else if(doc2.data().b3 == "" && !b3Taken) {
                  b3Taken = true;
                  currentRun = true;
                }
              }
              if(!currentRun) {
                toReturn = false;
              }
        }
        return toReturn;
      }


    return(
        <View style = {{backgroundColor: 'black'}}>
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
                        {(showError == true)?
                          <Text style = {{color: "red", marginTop: 20, textAlign: "center", fontWeight: "bold", fontSize: 10}}>This trade is not possible, rearrange your roster and try again</Text>
                        : null }
                        <TouchableOpacity style={[styles.button, styles.buttonClose, {marginTop: 20}]} onPress={() => finalizeTrade()}>
                            <Text style={styles.textStyle}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.buttonClose, {marginTop: 20}]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity> 
                    </View>
                    </View>
                </Modal>
            </View>
            <View>
                <Text style={[styles.sectionTitle, {paddingTop: 60}]}>You Receive</Text>
                <ScrollView  style = {[styles.container, {height: "36.25%"}]}>

                    <PlayerCell index = {0} position = "QB" name = {qb} navigation = {navigation} playerArray = {requestedPlayers} nameArray = {requestedNames} disabledArray = {disabled} opacityArray = {opacities}></PlayerCell>
                    <PlayerCell index = {1} position = "RB" name = {rb} navigation = {navigation} playerArray = {requestedPlayers} nameArray = {requestedNames} disabledArray = {disabled} opacityArray = {opacities}></PlayerCell>
                    <PlayerCell  index = {2} position = "WR1" name = {wr1} navigation = {navigation} playerArray = {requestedPlayers} nameArray = {requestedNames} disabledArray = {disabled} opacityArray = {opacities}></PlayerCell>
                    <PlayerCell index = {3} position = "WR2" name = {wr2} navigation = {navigation} playerArray = {requestedPlayers} nameArray = {requestedNames} disabledArray = {disabled} opacityArray = {opacities}> </PlayerCell>
                    <PlayerCell index = {4} position = "TE" name = {te} navigation = {navigation} playerArray = {requestedPlayers} nameArray = {requestedNames} disabledArray = {disabled} opacityArray = {opacities}></PlayerCell>
                </ScrollView>

                <Text style={[styles.sectionTitle, {paddingTop: 10}]}>You Offer</Text>
                <ScrollView  style = {[styles.container, {height: "36.25%"}]}>

                    <PlayerCell index = {0} position = "QB" name = {xqb} navigation = {navigation} playerArray = {offeredPlayers} nameArray = {offeredNames} disabledArray = {xdisabled} opacityArray = {xopacities}></PlayerCell>
                    <PlayerCell index = {1} position = "RB" name = {xrb} navigation = {navigation} playerArray = {offeredPlayers} nameArray = {offeredNames} disabledArray = {xdisabled} opacityArray = {xopacities}></PlayerCell>
                    <PlayerCell  index = {2} position = "WR1" name = {xwr1} navigation = {navigation} playerArray = {offeredPlayers} nameArray = {offeredNames} disabledArray = {xdisabled} opacityArray = {xopacities}></PlayerCell>
                    <PlayerCell index = {3} position = "WR2" name = {xwr2} navigation = {navigation} playerArray = {offeredPlayers} nameArray = {offeredNames} disabledArray = {xdisabled} opacityArray = {xopacities}></PlayerCell>
                    <PlayerCell index = {4} position = "TE" name = {xte} navigation = {navigation} playerArray = {offeredPlayers} nameArray = {offeredNames} disabledArray = {xdisabled} opacityArray = {xopacities}></PlayerCell>
                </ScrollView>

                <TouchableOpacity style = {{backgroundColor: '#9f86fc', opacity: 0.9, borderRadius: 5, justifyContent: "center", width: "100%", height: 45}} onPress={() => moveToNextStage()}>
                        <View>
                            <Text style = {[styles.sectionTitle, {fontSize: 24, textAlign: "center", marginBottom: 0}]}>Next</Text>
                        </View>
                </TouchableOpacity>
            </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // paddingTop: 60,
        padding: 20,
        backgroundColor: 'black',
        width: 400,
        // height: 900
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
      width: 42,
      height: 42,
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
        color: "white",
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