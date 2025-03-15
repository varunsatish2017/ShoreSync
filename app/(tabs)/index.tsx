import React, {useState} from "react";
import { StyleSheet, Text, TextInput, View, FlatList, ImageBackground, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Card } from "react-native-elements";
import MapView from 'react-native-maps'

const Tab = createBottomTabNavigator();

// Dummy tides data - real data will be fetched from a surf data API
const tidesData = [
  { id: "1", location: "Santa Clara", level: "1.7 ft", icon: "🌊",state:"CA" },
  { id: "2", location: "San Francisco", level: "-0.3 ft", icon: "🌊",state:"CA" },
  { id: "3", location: "Cupertino", level: "4.9 ft", icon: "🌊",state:"CA" },
  { id: "4", location: "Fremont", level: "2.5 ft", icon: "🌊",state:"CA" },
  { id: "5", location: "Miami", level: "2.7 ft", icon: "🌊",state:"FL" },
  { id: "6", location: "Seattle", level: "-0.9 ft", icon: "🌊",state:"WA" },
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
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = tidesData.filter(item =>
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground
      source={require('../../assets/images/shoresyncBackground.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Text style={styles.title}>SHORESYNC</Text>

      {/* Search Bar */}
      <View style={styles.search_bar}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by location..."
          placeholderTextColor="lightgray"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Grey Box around List */}
      <View style={[styles.listContainer, { flex: 1 }]}>
        {/* Conditionally render FlatList only if searchQuery has text */}
        {searchQuery.length > 0 && (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.location}>{item.location}, {item.state}</Text>
                <Text style={styles.level}>{item.level}</Text>
              </View>
            )}
            style={styles.list}
          />
        )}
      </View>
      {/* Recommendation Box */}
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




/**
 * Displays a map with pins on all of the beaches near the user's
 * selected location(s) and a popup showing the wave heights at each beach. 
 * @returns Page displaying the map
 */
function MapScreen() {
  return (
    <ImageBackground source={require('../../assets/images/shoresyncBackground.png')}
      style={styles.background}
      resizeMode="cover">
        <Text style={styles.title}>SHORESYNC</Text>
        
        <MapView 
          style={styles.map} 
          showsMyLocationButton={true} //only for android
        />

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

export default function App() {
  return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Tides" component={TidesScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%" },
  title: { fontSize: 50, fontWeight: "bold", color: "white", marginTop: "0%", padding: 15 },
  card: { width: "90%", padding: 15, borderRadius: 10, height:"40%"},
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  icon: { fontSize: 20 },
  location: { fontSize: 18, fontWeight: "bold" },
  level: { fontSize: 18, color: "blue" },
  recommendation: { backgroundColor: "#FFF", padding: 20, borderRadius: 10, margin: 10, alignItems: "center"},
  recommendationText: { fontSize: 16, textAlign: "center" },
  buttonRow: { flexDirection: "row", marginTop: 10 },
  button: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5, marginHorizontal: 10 },
  buttonText: { color: "white", fontSize: 16 },
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  //used for second screen
  search_bar: {
    width: "90%",
    paddingVertical: 10,
    borderRadius: 10
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 0,
    backgroundColor: "rgb(37, 37, 37)",
    color:"white",
  },
  // Grey box container
  listContainer: {
    width: "90%",
    minHeight: 300, 
    maxHeight: 300,  // Limits to ~6 items at a time
    borderColor: "grey",  
    borderWidth: 2,  
    borderRadius: 10,  
    backgroundColor: "rgba(200, 200, 200, 0.2)", 
    padding: 10, 
  },
  list: {
    maxHeight: 350, // should match or be greater than listContainer height
  },
  item: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
  },
  //third screen
  map: {width: "90%", justifyContent: "center", height: "40%", padding: 15},
});
