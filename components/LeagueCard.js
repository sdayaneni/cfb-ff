import React, { useState, useEffect } from "react";
import {View, Text, ImageBackground, StyleSheet, Pressable, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import { useNavigation } from '@react-navigation/core'
import placeholder from "../assets/placeholder.jpeg"
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {db} from "../firebase.js";
import { Swipeable } from 'react-native-gesture-handler';
import {themeColor, useTheme } from "react-native-rapi-ui";
import { Ionicons } from '@expo/vector-icons';



// import theme from '../../assets/themes';
// import Avatars from './Avatars';

const LeagueCard = ({item, title, size, numJoined, width, newMargin, user, leagueId, onDelete}) => {

    const navigation = useNavigation()
    const [isPressed, setIsPressed] = useState(false); // State to track button press


    async function handleClick(){
        if(leagueId == undefined) {
            navigation.navigate("Draft");
        }
        
        else {
            const docRef = doc(db, "leagues", leagueId);

            let document = await getDoc(docRef);
            let lm = document.data().leagueManager;

            if(document.data().draftEnded == true) {
                navigation.navigate("LeagueOverview", {
                    league: leagueId
                });
            }

            else if(document.data().draftStarted == true) {
                navigation.navigate("Draft", {
                    league: leagueId
                });
            }
            else if(document.data().draftScheduled == true) {
                navigation.navigate("WaitForDraft", {
                    league: leagueId
                });
            }
            else if(lm == user) {
                navigation.navigate("ScheduleDraft", {
                    league: leagueId
                });
            }
        }
    }

    const renderRightActions = (progress, dragX) => {
        return (
          <TouchableHighlight
            onPress={() => {
                console.log("deleting")
                if (onDelete) {
                    onDelete(leagueId);
                  }
            //   if (props.onDelete) {
            //     props.onDelete(props.eventId);
            //   }
              setIsPressed(true); // Set button state to pressed
              setTimeout(() => setIsPressed(false), 200); // Reset button state after 200ms
            }}
            style={{
              backgroundColor: isPressed ? themeColor.danger600 : themeColor.danger,
              justifyContent: 'center',
              alignItems: 'flex-end',
              width: 100,
            //   marginRight: 20,
            //   marginLeft: -30,
            //   marginVertical: 10,
            marginBottom: 20,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              paddingRight: 35,
            }}
            underlayColor={themeColor.danger600} // Color when button is pressed
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Ionicons name="trash" size={35} color="white" />
            </View>
          </TouchableHighlight>
        );
      };
    
  return (
    <Swipeable
    renderRightActions={renderRightActions}
    overshootRight={false}
    friction={2}
    rightThreshold={40}
    >
        <TouchableHighlight style = {styles.container} onPress={handleClick}>
            <View style = {[styles.itemLeft, {width : width}]}>
                        <View style={styles.imageContentContainer}>
                        <View>
                            <Text style={styles.imageTitle}>{title}</Text>
                            <Text style={styles.imageSubtitle}>{"Joined: " + numJoined + "/" + size}</Text>
                        </View>

                            <View>
                                <Image
                                source={placeholder}
                                style={[
                                    styles.avatarStyle,
                                    { zIndex: 1, marginLeft: (-150) },
                                ]}
                                />          
                            </View>
                        </View>
            </View>
        </TouchableHighlight>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0f0f0f',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },

  imageContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageTitle: {
    // fontFamily: 'NunitoBold',
    fontSize: 24,
    color: "#9f86fc"
  },
  imageSubtitle: {
    // fontFamily: 'NunitoRegular',
    fontSize: 16,
    color: "#FAFAFA"
  },
  avatarStyle: {
    resizeMode: 'cover',
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    borderWidth: 1,
    borderColor: "white",
  }
})

export default LeagueCard;