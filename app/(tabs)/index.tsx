import React, {useEffect, useState} from "react";
import { StyleSheet, Text, TextInput, View, FlatList, ImageBackground, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Card } from "react-native-elements";
import MapView from 'react-native-maps'
import { enableScreens } from "react-native-screens";
import { List } from "react-native-paper";
import { fetchWeatherApi } from "openmeteo";
import { Hook } from "expo/config";


const Tab = createBottomTabNavigator();

export let locationAdder:Function;

enableScreens();


// Dummy tides data - real data will be fetched from a surf data API
export const tidesData = [
  { id: "1", location: "Santa Cruz", level: "5 ft", icon: "🌊" },
  // { id: "2", location: "San Francisco", level: "-0.3 ft", icon: "🌊" },
  // { id: "3", location: "Cupertino", level: "4.9 ft", icon: "🌊" },
  // { id: "4", location: "Fremont", level: "2.5 ft", icon: "🌊" },
];

//Data has the values, setData is the function to set the data

//Test case for Santa Cruz
const apiCallParams = {
  latitude: 36.958496166,
  longitude: -122.017333264,
  current: "wave_height",
  timezone: "auto",
  length_unit: "imperial",
  wind_speed_unit: "mph" 
} //Default lat/long for now: Santa Cruz, CA

/**
 * Updates the list of cities whenever the user adds a new location.
 * Should be called from Search Screen when the user adds a new location.
 */
export function updateCitiesList() {
  //For now, use the hardcoded cities until search bar works
  //Cities will be stored along with their coordinates 
}

/**
 * Goes through each city in the list and fetches the wave data for that city
 * using each city's coordinates. Updates the UI correspondingly.
 * 
 * 
 * @returns the wave data for each city
 */
async function fetchWaveHeight(lat: number, long: number){
  try {
    const data = await fetchWeatherApi("https://marine-api.open-meteo.com/v1/marine", {latitude:lat, longitude:long, current: "wave_height"});
    const firstWaveData = data[0];
    const latitude = firstWaveData.latitude()!;
    const longitude = firstWaveData.longitude()!;
    const currData = firstWaveData.current()!;

    const m_to_ft = 3.280839895;
    const waveHeight = (m_to_ft * currData.variables(0)!.value()).toFixed(1); // Get the wave height value
    const waveHeightUnit = currData.variables(0)!.unit(); // Get the wave height unit
    console.log("Wave height unit: " + waveHeightUnit); // Log the wave height unit
    console.log("Wave height " + waveHeight + " ft"); // Log the wave height for Santa Cruz
    return waveHeight + " ft";
  } catch (error) {
      console.error(error);
      return "--"; // Return a default value in case of an error
  }
}

export async function addLocation(cityName: string, lat: number, long: number) {
  // const newWaveHeight = await fetchWaveHeight(lat, long); // Fetch the wave height
  locationAdder((prevState:any) => [
    ...prevState,
    { id: (prevState.length + 1) + "", icon: "🌊", cityName: cityName, lat: lat, long: long, waveHeight: "--" },
  ]);
}

function TidesScreen() {

  const [waveData, setWaveData] = useState([{id: "1", icon: "🌊", cityName: "Santa Cruz", lat: apiCallParams.latitude,
    long: apiCallParams.longitude, waveHeight: "--"}]); // Holds city name, its coordinates, and updated wave height  

  locationAdder = setWaveData;

  //For testing only
  useEffect(() => {
    addLocation("San Francisco", 37.7749, -122.4194); // Example of adding a new location
    addLocation("Big Sur", 36.2749, -121.8058); // Example of adding a new location
    addLocation("Half Moon Bay", 37.4634, -122.4284); // Example of adding a new location
  }, []); // Call addLocation when the component mounts
  
  useEffect(() => {
    addLocation("Santa Barbara", 34.4208, -119.682) // Example of adding a new location
  }, []);
    

  useEffect(() => {
    async function updateWaveHeights() {
      for (let i = 0; i < waveData.length; i++){
        console.log("Wave data: " + waveData[i].waveHeight);
        if (waveData[i].waveHeight == "--") {
          const newWaveHeight = await fetchWaveHeight(waveData[i].lat, waveData[i].long); // Fetch the wave height
          setWaveData((prevState) => 
            prevState.map((item) =>
              (item.waveHeight === "--" && item.id === (i + 1) + "") ? {...item, waveHeight: newWaveHeight} : item
            )
          );
        }
      }
    }
    updateWaveHeights();
  }, [waveData.length]) //updates wave data when the size of waveData changes
  

  return (
    <ImageBackground source={require('../../assets/images/shoresyncBackground.png')} 
    style={styles.background}
    resizeMode="cover">
      <Text style={styles.title}>SHORESYNC</Text>
      <Card containerStyle={styles.card}>
        <FlatList
          data={waveData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.location}>{item.cityName}</Text>
              <Text style={styles.level}>{item.waveHeight}</Text>
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
    <ImageBackground source={require('../../assets/images/shoresyncBackground.png')} 
    style={styles.background}
    resizeMode="cover">
      <View style={styles.search_bar}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search by location..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        </View>
        {/* Display Filtered Results */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.text}>{item.location} - {item.level}</Text>
            </View>
          )}
        />
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
      <Tab.Screen name="Tides" component={TidesScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%" },
  title: { fontSize: 50, fontWeight: "bold", color: "white", marginTop: "-15%", marginLeft: "5%", padding: 15 },
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
    flex: 1,
    width: "90%",
    paddingVertical: 40,
    borderRadius: 10
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
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
  map: {width: "90%", justifyContent: "center", height: "40%", padding: 15},
});


