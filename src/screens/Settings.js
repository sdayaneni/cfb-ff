import React, { useRef, useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { View, ScrollView, Alert } from 'react-native';
import {
  Layout,
  Button,
  Text,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { auth } from "../../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getDisplayName, saveDisplayName } from '../provider/BaseProvider';

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
//   const auth = getAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // const displayName = await getDisplayName(auth.currentUser.uid);
        const emailPrefix = auth.currentUser.email.substring(0, auth.currentUser.email.indexOf("@"));
        setName(emailPrefix);
        setEmail(auth.currentUser.email);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    fetchData();
  
    return () => {};
  }, []);
  
  const promptName = () => {
    Alert.prompt(
      "Enter Display Name", 
      "This name can be changed later.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Confirm",
          onPress: value => {
            setName(value);
            saveDisplayName(auth.currentUser.uid, value);
          }
        }
      ]
    );    
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
      navigation.replace('Login');
      navigation.reset({index: 0, routes: [{name: 'Login'}]})
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Layout>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 15,
        }}>
        <Text
          size="h1"
          fontWeight="bold"
          style={{
            paddingBottom: 5,
          }}> Settings </Text>
      </View>
        
      <ScrollView
        style = {{}}
        bounces = {false}
        contentContainerStyle={{
          flexGrow: 1,
          alignContent: "center",
          paddingHorizontal: 15,
          marginBottom: 100,
          marginTop: 50,
        }}>

        <Text
          fontWeight="bold"
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          style={{
            alignSelf: "flex-start",
            fontSize: 75,
          }}> {name} </Text>

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          style={{
            color: themeColor.gray500,
            alignSelf: "flex-end",
            fontStyle: "italic",
            marginTop: 10,
            fontSize: 20,
          }}> {email} </Text>

        <Button
          text="Set Team Name"
          type="TouchableHighlight"
          underlayColor={themeColor.primary300}
          onPress={promptName}
          style={{
            marginTop: "auto",
          }}
        />

        <Button
          text={isDarkmode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          status={isDarkmode ? "black300" : "black300"}
          type="TouchableHighlight"
          underlayColor={isDarkmode ? themeColor.black200 : themeColor.black400}
          onPress={async () => {
            const newTheme = isDarkmode ? "light" : "dark";
            setTheme(newTheme);
            await AsyncStorage.setItem('theme', newTheme);
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          status="danger"
          text="Logout"
          type="TouchableHighlight"
          underlayColor={themeColor.danger600}
          onPress={handleLogout}
          style={{
            marginTop: 10,
          }}
        />
      </ScrollView>
    </Layout>
  );
}
