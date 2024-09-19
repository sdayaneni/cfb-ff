import {StyleSheet, Button, View, SafeAreaView, Text, Alert, FlatList, Image, TouchableHighlight, ScrollView} from 'react-native';

import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {db} from '../firebase.js';
import React,{useState} from 'react';
import Header from '../components/Header';
import Stats from '../components/Stats';

export default function PlayerInfo({route}){
    console.log(route.params.playerName);
    return (
        <View style = {{backgroundColor: "#211f1f",}}>
            <Header playerName = {route.params.playerName}  league = {route.params.league}></Header>
            <Stats playerName = {route.params.playerName}></Stats>
        </View>
    );
}

const styles = StyleSheet.create({
});