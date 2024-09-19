import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import Draft from './screens/Draft';
import Login from './screens/Login';
import Home from './screens/Home';
import PlayerInfo from './screens/PlayerInfo';
import ScheduleDraft from './screens/ScheduleDraft';
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {db} from './firebase.js';
import { NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WaitForDraft from './screens/WaitForDraft';
import LeagueOverview from './screens/LeagueOverview';
import TradeRosters from './screens/TradeRosters';

import {LogBox, YellowBox} from "react-native";
LogBox.ignoreAllLogs();
console.disableYellowBox = true;
console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
console.warn = () => {};

import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  useColorScheme,
  Switch
} from 'react-native';

const cfb = require('cfb.js');


const defaultClient = cfb.ApiClient.instance;


var qbs = [];
var rbs = [];
var wrs = [];
var tes = [];

const Stack = createNativeStackNavigator();

export default function App() {

  //  useEffect(() => {
  //   console.log('starting');
  //   initializeData()
  //   }, [])

  async function initializeData() {
    const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
    ApiKeyAuth.apiKey = "Bearer iEgwLD0Q2/fKfE2JrnvQXS2kb4Yim4jMK4PxkPQGiaQ7EJX54+W8ZrTwuVgB6vJ6";

    var api = new cfb.TeamsApi();

    var opts = {
      //'gameId': 56, // {Number} Game id filter
      // 'year': 2022, // {Number} Year/season filter for games
      //'week': 56, // {Number} Week filter
      //'seasonType': "regular", // {String} Season type filter (regular or postseason)
     //  'team': "Ohio State", // {String} Team
      //'home': "home_example", // {String} Home team filter
      //'away': "away_example", // {String} Away team filter
      'conference': "B12" // {String} Conference abbreviation filter
      // 'position' : 'qb'
    };
    
    var teams = await api.getTeams(opts);
    opts = {
     'conference': "ACC" // {String} Conference abbreviation filter
   };
    teams = teams.concat(await api.getTeams(opts));
    opts = {
     'conference': "B1G" // {String} Conference abbreviation filter
   };
   teams = teams.concat(await api.getTeams(opts));
   opts = {
     'conference': "SEC" // {String} Conference abbreviation filter
   };
   teams = teams.concat(await api.getTeams(opts));
   opts = {
     'conference': "PAC" // {String} Conference abbreviation filter
   };
   teams = teams.concat(await api.getTeams(opts));

   const requestAll = async () => {  
     return await Promise.all(teams.map(async team => {
       try {
         var teamName = team.school;
         opts = {'team': teamName};
         return await api.getRoster(opts);
       } catch (err) {
         console.log(err)
       }
     }));
   }

   const allPlayers = await requestAll();
   // console.log(allPlayers[0]);

   for(var i = 0; i < allPlayers.length; i++) {
     for(var j = 0; j < allPlayers[i].length; j++) {

       // console.log(searchRoster);
         var initializePlayerName = allPlayers[i][j].firstName + " " + allPlayers[i][j].lastName;
         // console.log(initializePlayerName)

         if(allPlayers[i][j].position == "QB") {
           qbs.push(allPlayers[i][j]);
         }
         else if(allPlayers[i][j].position == "RB") {
           rbs.push(allPlayers[i][j]);
         }
         else if(allPlayers[i][j].position == "WR") {
           wrs.push(allPlayers[i][j]);
         }
         else if(allPlayers[i][j].position == "TE") {
           tes.push(allPlayers[i][j]);
         }

     }   
   }

   console.log("QUARTERBACKS-------------------------")
   console.log(qbs);
   console.log("RUNNING BACKS-------------------------")
   console.log(rbs);
   console.log("WIDE RECEIVERS-------------------------")
   console.log(wrs);
   console.log("TIGHT ENDS-------------------------")
   console.log(tes);

   sendInitialToDB();

  }

  async function sendInitialToDB(){
    for(var i = 0; i < 20; i++) {
      await addDoc (collection(db, 'qbs'), {
        firstName : qbs[i].firstName,
        lastName: qbs[i].lastName,
        team: qbs[i].team,
        height: qbs[i].height,
        weight: qbs[i].weight,
        year: qbs[i].year,
        position: qbs[i].position,
        jersey: qbs[i].jersey
      });
    }
    for(var i = 0; i < 20; i++) {
      await addDoc (collection(db, 'rbs'), {
        firstName : rbs[i].firstName,
        lastName: rbs[i].lastName,
        team: rbs[i].team,
        height: rbs[i].height,
        weight: rbs[i].weight,
        year: rbs[i].year,
        position: rbs[i].position,
        jersey: rbs[i].jersey
      });
    }
    for(var i = 0; i < 20; i++) {
      await addDoc (collection(db, 'wrs'), {
        firstName : wrs[i].firstName,
        lastName: wrs[i].lastName,
        team: wrs[i].team,
        height: wrs[i].height,
        weight: wrs[i].weight,
        year: wrs[i].year,
        position: wrs[i].position,
        jersey: wrs[i].jersey
      });
    }
    for(var i = 0; i < 20; i++) {
      await addDoc (collection(db,'tes'), {
        firstName : tes[i].firstName,
        lastName: tes[i].lastName,
        team: tes[i].team,
        height: tes[i].height,
        weight: tes[i].weight,
        year: tes[i].year,
        position: tes[i].position,
        jersey: tes[i].jersey
      });
    }
  }


  const theme = useColorScheme();

 return (
      <NavigationContainer>
      {/* <Switch style = {{marginTop: 50}}></Switch> */}
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
          <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
          <Stack.Screen  options={{ headerShown: false}} name="Draft" component={Draft} />
          <Stack.Screen  options={{ headerShown: false}} name="ScheduleDraft" component={ScheduleDraft} />
          <Stack.Screen  options={{ headerShown: false}} name="WaitForDraft" component={WaitForDraft} />
          <Stack.Screen  options={{ headerShown: false}} name="PlayerInfo" component={PlayerInfo} />
          <Stack.Screen  options={{ headerShown: false}} name="LeagueOverview" component={LeagueOverview} />
          <Stack.Screen  options={{ headerShown: false}} name="TradeRosters" component={TradeRosters} />
        </Stack.Navigator>
      </NavigationContainer>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: 'black',
   alignItems: 'center',
   justifyContent: 'center',
 },
});
