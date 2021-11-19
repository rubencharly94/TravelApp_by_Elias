
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ExpensesService from './services/ExpensesService';
import axios from "axios";

//const EXPENSES_API_BASE_URL = "http://localhost:8080/api/v1/expenses";

const Stack = createNativeStackNavigator();

export default function App() {

  

  /*componentDidMount(){
    ExpensesService.getExpenses().then();
  }*/

  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="homescreen"
          component={Homescreen}
        />
        <Stack.Screen
          name="postExpense"
          component={PostExpense}
        />
        {/*<Stack.Screen
          name="seeexpenses"
          component={seeexpenses}
        />
        <Stack.Screen
          name="finalreport"
          component={finalreport}
        /> */}
      

      </Stack.Navigator>
    </NavigationContainer>



    /*<View style={styles.container}>
      <Text>Open test</Text>
      <StatusBar style="auto" />
    </View>*/
  );
}

const Login = ({navigation}) => {

  return (
  <View style={styles.container}>
    <Text> Login </Text>
    <Text> Username: </Text>
    <TextInput
      placeholder = "username"
    />
    <Text> Password: </Text>
    <TextInput
      placeholder = "password"
    />
    <Button
      title = "Log In"
      onPress = {() => navigation.navigate('homescreen')}
    />
  </View>
  )
}

const Homescreen = ({navigation}) => {
  const [tripId, onChangeTripId] = React.useState("tripId");

  const[expenses, getExpenses] = useState('');
  const url = 'http://localhost:8080/api/v1/expenses';

  useEffect(() => {
    getAllExpenses();
  },[]);

  const getAllExpenses = () => {
    axios.get(`${url}`)
    .then((response)=>{
      const allExpenses = response.data.map(function(line){
        return line['travelID'];
      });
      getExpenses(allExpenses);
    })
    .catch(error => console.error(`Error: ${error}`));

    return(
      expenses
    )
  }
  
  return (
  <View style={styles.container}>
    <Text> Trip Id: {expenses}
    </Text>
    <TextInput
      placeholder = "tripId"
      onChangeText = {onChangeTripId}
    />
    <Button
      title = "Post Expense"
      onPress = {() => navigation.navigate('postExpense')}
    />
    <Button
      title = "See All Expenses"
      //onPress = {() => navigation.navigate('homescreen')}
    />
    <Button
      title = "Close Trip"
      //onPress = {() => navigation.navigate('homescreen')}
    />
  </View>
  )
}

const PostExpense = ({navigation}) => {
  const [amount, onChangeAmount] = React.useState("amount");
  const [description, onChangeDescription] = React.useState("description");

  return (
  <View style={styles.container}>
    <Text> Amount: </Text>
    <TextInput
      placeholder = "0"
      onChangeText = {onChangeAmount}
    />
    <Text> Description: </Text>
    <TextInput
      placeholder = "Describe the expense"
      onChangeText = {onChangeDescription}
    />
    <Button
      title = "Post"
      //onPress = {() => navigation.navigate('homescreen')}
    />
  </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
