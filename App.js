
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
        <Stack.Screen
          name="seeExpenses"
          component={SeeExpenses}
        />
        {/*<Stack.Screen
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
  /*const[expenses, getExpenses] = useState('');
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
  }*/
  
  return (
  <View style={styles.container}>
    <Text> Trip Id:
    </Text>
    <TextInput
      placeholder = "tripId"
      onChangeText = {onChangeTripId}
    />
    <Button
      title = "Post Expense"
      onPress = {() => navigation.navigate('postExpense',{paramTripId: tripId})}
    />
    <Button
      title = "See All Expenses"
      onPress = {() => navigation.navigate('seeExpenses',{paramTripId: tripId})}
    />
    <Button
      title = "Close Trip"
      //onPress = {() => navigation.navigate('homescreen')}
    />
  </View>
  )
}

const SeeExpenses = ({route, navigation}) => {
  const paramTripId = route.params.paramTripId;
  const[expenses, getExpenses] = useState([{"id":0,"travelID":"nn","userID":null,"amount":0,"description":"nn"}]);
  const url = 'http://localhost:8080/api/v1/expenses/allexpensesbytrip/' + paramTripId;

  useEffect(() => {
    getAllExpenses();
  },[]);

  const getAllExpenses = () => {
    axios.get(`${url}`)
    .then((response)=>{
      const allExpenses = response.data.map(function(expense){
        return expense;
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
    <table>
      <thead>
        <tr>
          <th>Travel ID</th>
          <th>User ID</th>
          <th>Amount</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {
          expenses.map(
            (expense) => (

              <tr key={expense.id}>
                <th>{expense.travelID}</th>
                <th>{expense.userID}</th>
                <th>{expense.amount}</th>
                <th>{expense.description}</th>
              </tr>
            )
          )
        }

        
      </tbody>

    </table>
  </View>
  )
}

const PostExpense = ({route, navigation}) => {
  const paramTripId = route.params.paramTripId;
  const [amount, onChangeAmount] = React.useState(0.0);
  const [description, onChangeDescription] = React.useState("description");
  const expenseJson = { travelID: paramTripId, userID: "testuser", amount: amount, description: description};
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  /*useEffect(() => {
    postExpense();
  },[]);*/

  const postExpense = () => {
    axios.post('http://localhost:8080/api/v1/expenses/postexpense', expenseJson, config)
    .then(res => {
      console.log(res);
      console.log(res.data);
    })
    //.then(response => this.setState({ articleId: response.data.id }))
    //.catch(error => console.error(`Error: ${error}`));

  }

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
      onPress = {() => {
        postExpense();
      }}
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
