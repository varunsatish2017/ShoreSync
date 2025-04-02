import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
   FlatList, ImageBackground, TouchableOpacity, 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { generateClient } from 'aws-amplify/api';
import { createTodo } from '../../src/graphql/mutations';
import { listTodos } from '../../src/graphql/queries';
import {
  withAuthenticator,
  useAuthenticator
} from '@aws-amplify/ui-react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Card } from "react-native-elements";
import { Amplify } from 'aws-amplify';
import config from '../../src/amplifyconfiguration.json';
Amplify.configure(config);
const tidesData = [
  { id: "1", location: "Santa Clara", level: "1.7 ft", icon: "🌊" },
  { id: "2", location: "San Francisco", level: "-0.3 ft", icon: "🌊" },
  { id: "3", location: "Cupertino", level: "4.9 ft", icon: "🌊" },
  { id: "4", location: "Fremont", level: "2.5 ft", icon: "🌊" },
];

function SearchScreen() {
  return (
    <View style={styles.screen}>
      <Text>Search Screen</Text>
    </View>
  );
}
const Tab = createBottomTabNavigator();
// retrieves only the current value of 'user' from 'useAuthenticator'
const userSelector = (context) => [context.user];
function MapScreen() {
    return (
      <View style={styles.screen}>
        <Text>Map Screen</Text>
      </View>
    );
  }
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
const SignOutButton = () => {
  const { user, signOut } = useAuthenticator(userSelector);
  return (
    <Pressable onPress={signOut} style={styles.buttonContainer}>
      <Text style={styles.buttonText}>
        Hello, {user.username}! Click here to sign out!
      </Text>
    </Pressable>
  );
};

const initialFormState = { name: '', description: '' };
const client = generateClient();

const App = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({
        query: listTodos
      });
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialFormState);
      await client.graphql({
        query: createTodo,
        variables: { input: todo }
      });
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  return (
    <SafeAreaProvider>
      <Tab.Navigator screenOptions={{
        headerShown: false
      }}>
         <Tab.Screen name="Tides" component={TidesScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
      </Tab.Navigator>
      </SafeAreaProvider>
  );
};

export default withAuthenticator(App);

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
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { width: 400, flex: 1, padding: 20, alignSelf: 'center' },
  todo: { marginBottom: 15 },
  input: {
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 8
  },
  buttonText: { color: 'white', padding: 16, fontSize: 18 }
});
