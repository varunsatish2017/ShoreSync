import React from "react";
import { StyleSheet, Text, View, FlatList, ImageBackground, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Card } from "react-native-elements";

const Tab = createBottomTabNavigator();

const tidesData = [
  { id: "1", location: "Santa Clara", level: "1.7 ft", icon: "🌊" },
  { id: "2", location: "San Francisco", level: "-0.3 ft", icon: "🌊" },
  { id: "3", location: "Cupertino", level: "4.9 ft", icon: "🌊" },
  { id: "4", location: "Fremont", level: "2.5 ft", icon: "🌊" },
];

function TidesScreen() {
  return (
    <ImageBackground source={require('../../assets/images/shoresyncBackground.png')} 
    style={styles.background}
    resizeMode="cover">
      <Text style={styles.title}>SHORESYNC</Text>
      <Card containerStyle={styles.card}>
        <FlatList
          data={tidesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.level}>{item.level}</Text>
            </View>
          )}
        />
      </Card>
      <View style={styles.recommendation}>
        <Text style={styles.recommendationText}>
          There will be a fishing event at 8:00 AM at your nearest beach. Do you want to sign up?
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

function SearchScreen() {
  return (
    <View style={styles.screen}>
      <Text>Search Screen</Text>
    </View>
  );
}

function MapScreen() {
  return (
    <View style={styles.screen}>
      <Text>Map Screen</Text>
    </View>
  );
}

export default function App() {
  return (

      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Tides" component={TidesScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
      </Tab.Navigator>
 
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%" },
  title: { fontSize: 50, fontWeight: "bold", color: "white", marginTop: "-15%", marginLeft: "5%" },
  card: { width: "90%", padding: 15, borderRadius: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  icon: { fontSize: 20 },
  location: { fontSize: 18, fontWeight: "bold" },
  level: { fontSize: 18, color: "blue" },
  recommendation: { backgroundColor: "#FFF", padding: 20, borderRadius: 10, margin: 10, alignItems: "center" },
  recommendationText: { fontSize: 16, textAlign: "center" },
  buttonRow: { flexDirection: "row", marginTop: 10 },
  button: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5, marginHorizontal: 10 },
  buttonText: { color: "white", fontSize: 16 },
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
});
