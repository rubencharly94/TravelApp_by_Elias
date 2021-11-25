
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {  StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import axios from "axios";
import JWT from 'expo-jwt';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text,Input, Button, Overlay} from 'react-native-elements';

const Stack = createNativeStackNavigator();
const key = "travelapp2021";
const headerStyle = {
  title: 'TravelApp by Elias',
  justifyContent: 'center',
  headerStyle: {
    backgroundColor: '#00c7b6',
    
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    
    
  },
}
const buttonStyle = {backgroundColor:'#00c7b6' ,margin:10 };
const inputStyle = {width:'70%',textAlign:'center'};
const tableStyle = {borderCollapse: 'collapse',
fontSize: '1em',
fontFamily: 'sans-serif',
boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)'};
const tableHeaderStyle = {backgroundColor:'#81f7ed',fontSize:'1.2em',flexDirection: "row"};

const compIP = "192.168.0.10:8080"; //IP of the computer working as server and port



export default function App() { //Navigation components

  return (<SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options = {headerStyle}
        />
        <Stack.Screen
          name="homescreen"
          component={Homescreen}
          options = {headerStyle}
        />
        <Stack.Screen
          name="postExpense"
          component={PostExpense}
          options = {headerStyle}
        />
        <Stack.Screen
          name="seeExpenses"
          component={SeeExpenses}
          options = {headerStyle}
        />
        <Stack.Screen
          name="report"
          component={Report}
          options = {headerStyle}
        /> 
      

      </Stack.Navigator>
    </NavigationContainer>

  </SafeAreaProvider>);
}

const Login = ({navigation}) => { //Login screen
  const [visible, setVisible] = useState(false);  //sets visibility of the Overlay to show if wrong password/user
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const [username, onChangeUsername] = React.useState("username1");
  const [password, onChangePassword] = React.useState("password1");
  var token = "";
  

  const grantAccess = async () => { //GET request to see if user and password exist in SQL database
    const url = 'http://192.168.0.10:8080/api/v1/users/' + token;
    const accessGranted = (await axios.get(`${url}`)).data;
    
    return(
      accessGranted
    )
  }

  return ( //Login screen
  <View style={styles.container}>
    <Text h3> Login </Text>
    <Input
      placeholder = "username"
      containerStyle = {inputStyle}
      onChangeText = {onChangeUsername}
      leftIcon={
        <Icon
          name='user'
          size={24}
          color='gray'
        />
      }
      
    />
    <Input
      placeholder = "password"
      secureTextEntry={true}
      containerStyle = {inputStyle}
      onChangeText = {onChangePassword}
      leftIcon={
        <Icon
          name='key'
          size={24}
          color='gray'
        />
      }
    />
     <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text style={{color:'red'}}>Incorrect Username / Password</Text>
      </Overlay>
    <Button
      title = "Log In"
      buttonStyle={buttonStyle}
      onPress = {async () => {
        token= JWT.encode({user: username, password: password},key).toString(); //generates token for the specific user
        if((await grantAccess())==true){ //checks if the GET request was true for user password and navigates to next screen
          navigation.navigate('homescreen',{paramToken: token});
        } else {
          toggleOverlay();
        }
        
      }
      }
    />
  </View>
  )
}

const Homescreen = ({route, navigation}) => {  //Main Screen
  const token = route.params.paramToken;  //receives the token from previous screen for the specific user
  const [tripId, onChangeTripId] = React.useState("tripId");
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const postTrip = () => { //Sends post request to the server to disable trip when user chooses "close trip"
    axios.post('http://'+compIP+'/api/v1/trips/posttrip', {tripID:tripId,enabled:false}, config)
  }

  return ( //main screen
  <View style={styles.container}>
    <Text h4> Insert the trip ID:
    </Text>
    <Input
      placeholder = "tripId"
      containerStyle = {inputStyle}
      onChangeText = {onChangeTripId}
      leftIcon={
        <Icon
          name='car'
          size={24}
          color='gray'
        />
      }
    />
    <Button
      title = "Post Expense"
      buttonStyle={buttonStyle}
      onPress = {() => navigation.navigate('postExpense',{paramTripId: tripId, paramToken:token})}
    />
    <Button
      title = "See All Expenses"
      buttonStyle={buttonStyle}
      onPress = {() => navigation.navigate('seeExpenses',{paramTripId: tripId})}
    />
    <Button
      title = "Close Trip"
      buttonStyle={buttonStyle}
      onPress = {() => {
        postTrip(); //disables the trip if the user closes the trip
        navigation.navigate('report',{paramTripId: tripId});

      }}
    />
  </View>
  )
}

const SeeExpenses = ({route, navigation}) => { //See all Expenses screen
  const paramTripId = route.params.paramTripId;  //receives the trip ID from previous screen
  const[expenses, getExpenses] = useState([{"id":null,"travelID":null,"userID":null,"amount":null,"description":null}]);
  const url = 'http://'+compIP+'/api/v1/expenses/allexpensesbytrip/' + paramTripId;

  useEffect(() => {  //renders all the expenses after charging
    getAllExpenses();
  },[]);

  const getAllExpenses = () => { //GET request for all expenses in the expenses table with the tripID provided
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



  return (  //See all expenses screen basically displaying a table
  <View style={styles.container}>
    <View style={tableStyle}>
      <View style={tableHeaderStyle}>
          <View><Text style={{fontWeight:'bold'}}>Travel ID     </Text></View>
          <View><Text style={{fontWeight:'bold'}}>User ID     </Text></View>
          <View><Text style={{fontWeight:'bold'}}>Amount     </Text></View>
          <View><Text style={{fontWeight:'bold'}}>Description     </Text></View>
      </View>
        {
          expenses.map(
            (expense) => (

              <View key={expense.id} style={{flexDirection:'row',justifyContent: 'space-between'}}>
                <View style={{ flex: 1}}><Text>  {expense.travelID}  </Text></View>
                <View style={{ flex: 1}}><Text>{expense.userID}  </Text></View>
                <View style={{ flex: 1}}><Text>{expense.amount}  </Text></View>
                <View style={{ flex: 1}}><Text>  {expense.description}  </Text></View>
              </View>
            )
          )
        }

    </View>
  </View>
  )
}

const PostExpense = ({route, navigation}) => {  //Post expense screen
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => { //Overlay to show if the trip is disabled(closed) or if the expense is posted successfully
    setVisible(!visible);
  };
  const token = route.params.paramToken;  //receives the token, which will be used to identify the user posing the expense
  const paramTripId = route.params.paramTripId;
  const [amount, onChangeAmount] = React.useState(0.0);
  const [description, onChangeDescription] = React.useState("description");
  const [message, onChangeMessage] = React.useState("");
  const expenseJson = { travelID: paramTripId, userID: JWT.decode(token, key).user, amount: amount, description: description};
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const postExpense = async() => {//POST request to the table in database containing expenses
    var response = false;
    await axios.post('http://'+compIP+'/api/v1/expenses/postexpense', expenseJson, config)
    .then(res => {
      response = res.data;
    })
    if(response===true){
      onChangeMessage("Expense posted successfully!");
    } else {
      onChangeMessage("Sorry! This trip has already been closed");
    }

  }

  return ( //Post expense screen
  <View style={styles.container}>
    <Input
      placeholder = "Amount"
      containerStyle = {inputStyle}
      onChangeText = {onChangeAmount}
      leftIcon={
        <Icon
          name='euro'
          size={24}
          color='gray'
        />
      }
    />
    <Input
      placeholder = "Describe the expense"
      containerStyle = {inputStyle}
      onChangeText = {onChangeDescription}
      leftIcon={
        <Icon
          name='question'
          size={24}
          color='gray'
        />
      }
    />
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text>{message}</Text>
      </Overlay>
    <Button
      buttonStyle={buttonStyle}
      title = "Post"
      onPress = {() => {
        postExpense();
        toggleOverlay();
      }}
    />
  </View>
  )
}

const Report = ({route, navigation}) => { //Report screen, gets all expenses of a trip, adds up the amount each user paid, divides the total of the trip between users, and prints the balance for each user
  const token = route.params.paramToken;
  const paramTripId = route.params.paramTripId;
  const[expenses, getExpenses] = useState([{"id":null,"travelID":null,"userID":null,"amount":null,"description":null}]);
  const[message, changeMessage] = useState("");
  const url = 'http://'+compIP+'/api/v1/expenses/report/' + paramTripId;
  
  useEffect(() => {
    getReport();
  },[]);

  const getReport = () => { //GET request for the expenses of a trip
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

  const getTotal = () => { //gets total spent on the trip
    var total = 0.0;
    for(const expense of expenses){
      total+=expense.amount;
    }
    return total;
  }

  var whoGetsWhat = "";

  return ( //display the table with the aforementioned info
  <View style={styles.container}>

    <View style={tableStyle}>
        <View style={tableHeaderStyle}>
          <View><Text style={{fontWeight: 'bold'}}> REPORT </Text></View>
        </View>
        {
          expenses.map(
            (expense) => (

              <View key={expense.id} style={{flexDirection:'row',justifyContent: 'space-between'}}>
                <View><Text> {expense.userID} </Text></View>
                <View><Text> paid </Text></View>
                <View style={{alignSelf: 'flex-end'}}><Text> {expense.amount} </Text></View>
              </View>
            )
          )
        }
        <View style={{fontWeight: 'bold',flexDirection:'row',justifyContent: 'space-between'}}>
          <View><Text> Grand Total: </Text></View>
          <View style={{alignSelf: 'flex-end'}}><Text> {getTotal()} </Text></View>
        </View>
        <View style={tableHeaderStyle}>
          <View><Text style={{fontWeight: 'bold'}}> Balance: </Text></View>
        </View>
        {
          expenses.map(
            (expense) => (
              
              <View key={expense.id} style={{flexDirection:'row',justifyContent: 'space-between'}}>
                <View><Text> {expense.userID} </Text></View>
                <View style={{alignSelf: 'flex-end'}}><Text> {(getTotal()/expenses.length-expense.amount).toFixed(2)} </Text></View>
              </View>
            )
          )
        }

    </View>

  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'arial',
    fontSize: 12,
  },
  cont:{
    marginBottom:'10px',
  }
});
