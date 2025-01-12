import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated'
import Draft from './screens/Draft';
import Login from './screens/Login';
import Home from './screens/Home';
import PlayerInfo from './screens/PlayerInfo';
import ScheduleDraft from './screens/ScheduleDraft';
import {getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy} from 'firebase/firestore';
import {db} from '../firebase.js';
import { NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WaitForDraft from './screens/WaitForDraft';
import LeagueOverview from './screens/LeagueOverview';
import TradeRosters from './screens/TradeRosters';
import Settings from './screens/Settings';
import { GestureHandlerRootView, HandlerRootView } from 'react-native-gesture-handler';


import {LogBox, YellowBox, StyleSheet, Button, View, SafeAreaView, Text, Alert, useColorScheme, Switch} from "react-native";
LogBox.ignoreAllLogs();
console.disableYellowBox = true;
console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
console.warn = () => {};


const Stack = createNativeStackNavigator();

export default function App() {

  //  useEffect(() => {
  //   console.log('starting');
  //   initializeData()
  //   }, [])

  const theme = useColorScheme();

 return (
    <GestureHandlerRootView>
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
          <Stack.Screen  options={{ headerShown: false}} name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
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
