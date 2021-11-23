
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ExpensesService from './services/ExpensesService';
import axios from "axios";
import JWT from 'expo-jwt';

//const EXPENSES_API_BASE_URL = "http://localhost:8080/api/v1/expenses";

const Stack = createNativeStackNavigator();
const key = "travelapp2021";
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
        <Stack.Screen
          name="report"
          component={Report}
        /> 
      

      </Stack.Navigator>
    </NavigationContainer>



    /*<View style={styles.container}>
      <Text>Open test</Text>
      <StatusBar style="auto" />
    </View>*/
  );
}

const Login = ({navigation}) => {
  
  const [username, onChangeUsername] = React.useState("username1");
  const [password, onChangePassword] = React.useState("password1");
  var token = "";

  return (
  <View style={styles.container}>
    <Text> Login </Text>
    <Text> Username: </Text>
    <TextInput
      placeholder = "username"
      onChangeText = {onChangeUsername}
    />
    <Text> Password: </Text>
    <TextInput
      placeholder = "password"
      onChangeText = {onChangePassword}
    />
    <Button
      title = "Log In"
      onPress = {() => {
        token= JWT.encode({username: username, password: password},key).toString();
        navigation.navigate('homescreen',{paramToken: token});
      }
      }
    />
  </View>
  )
}

const Homescreen = ({route, navigation}) => {
  const token = route.params.paramToken;
  const [tripId, onChangeTripId] = React.useState("tripId");
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
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

  /*const validateUser = () => {

  }*/
  
  const postTrip = () => {
    axios.post('http://localhost:8080/api/v1/trips/posttrip', {tripID:tripId,enabled:false}, config)
    //.then(res => {
      //response = res.data;
    //})
    //.then(response => this.setState({ articleId: response.data.id }))
    //.catch(error => console.error(`Error: ${error}`));

  }

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
      onPress = {() => navigation.navigate('postExpense',{paramTripId: tripId, paramToken:token})}
    />
    <Button
      title = "See All Expenses"
      onPress = {() => navigation.navigate('seeExpenses',{paramTripId: tripId})}
    />
    <Button
      title = "Close Trip"
      onPress = {() => {
        postTrip();
        navigation.navigate('report',{paramTripId: tripId});

      }}
    />
  </View>
  )
}

const SeeExpenses = ({route, navigation}) => {
  const paramTripId = route.params.paramTripId;
  const[expenses, getExpenses] = useState([{"id":null,"travelID":null,"userID":null,"amount":null,"description":null}]);
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
  const token = route.params.paramToken;
  const paramTripId = route.params.paramTripId;
  const [amount, onChangeAmount] = React.useState(0.0);
  const [description, onChangeDescription] = React.useState("description");
  const [message, onChangeMessage] = React.useState("");
  const expenseJson = { travelID: paramTripId, userID: JWT.decode(token, key).username, amount: amount, description: description};
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  /*useEffect(() => {
    postExpense();
  },[]);*/

  const postExpense = async() => {
    var response = false;
    await axios.post('http://localhost:8080/api/v1/expenses/postexpense', expenseJson, config)
    .then(res => {
      response = res.data;
    })
    //.then(response => this.setState({ articleId: response.data.id }))
    //.catch(error => console.error(`Error: ${error}`));
    console.log(response);
    if(response===true){
      onChangeMessage("Expense Posted Successfully");
    } else {
      onChangeMessage("This trip is already closed");
    }

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
    <Text> {message} </Text>
    <Button
      title = "Post"
      onPress = {() => {
        postExpense();
      }}
    />
  </View>
  )
}

const Report = ({route, navigation}) => {
  const token = route.params.paramToken;
  const paramTripId = route.params.paramTripId;
  const[expenses, getExpenses] = useState([{"id":null,"travelID":null,"userID":null,"amount":null,"description":null}]);
  const url = 'http://localhost:8080/api/v1/expenses/report/' + paramTripId;
  
  useEffect(() => {
    getReport();
  },[]);

  const getReport = () => {
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

  const getTotal = () => {
    var total = 0.0;
    for(const expense of expenses){
      total+=expense.amount;
    }
    return total;
  }

  const whoGetsWhat = () => {
    for(const expense of expenses){
      
    }
  }

  return (
  <View style={styles.container}>
    <Text> Report:
    </Text>

    <table>
      <thead>
        <tr>
          <th>REPORT</th>
        </tr>
      </thead>
      <tbody>
        {
          expenses.map(
            (expense) => (

              <tr key={expense.id}>
                <th>{expense.userID}</th>
                <th> paid</th>
                <th>{expense.amount}</th>
              </tr>
            )
          )
        }
        <tr>
          <th> Grand Total: </th>
          <th> {getTotal()}</th>
        </tr>
        {
          expenses.map(
            (expense) => (

              <tr key={expense.id}>
                <th>{expense.userID}</th>
                <th> {()=>{
                  if(getTotal()/expenses.length-expense.amount<0){
                    return ("has to pay");
                  } else {
                    return ("has to get paid");
                  }
                }}
                </th>
                <th>{getTotal()/expenses.length-expense.amount}</th>
              </tr>
            )
          )
        }
      </tbody>

    </table>

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
