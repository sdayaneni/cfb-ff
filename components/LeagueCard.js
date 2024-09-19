import React from 'react';
import {View, Text, ImageBackground, StyleSheet, Pressable, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/core'
import placeholder from "../assets/placeholder.jpeg"
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {db} from "../firebase.js"

// import theme from '../../assets/themes';
// import Avatars from './Avatars';

const LeagueCard = ({item, title, size, numJoined, width, newMargin, user, leagueId}) => {

    const navigation = useNavigation()

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
    
  return (
    <TouchableOpacity style = {styles.container} onPress={handleClick}>
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
                                { zIndex: 1, marginLeft: (-125) },
                            ]}
                            />          
                        </View>
                    </View>
        </View>
    </TouchableOpacity>

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