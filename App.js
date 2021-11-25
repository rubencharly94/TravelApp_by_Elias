
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {  StyleSheet, TextInput, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ExpensesService from './services/ExpensesService';
import axios from "axios";
import JWT from 'expo-jwt';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text,Input, Button, Overlay} from 'react-native-elements';
import Constants from "expo-constants";
/* const { manifest } = Constants;

const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
  ? manifest.debuggerHost.split(`:`).shift().concat(`:3000`)
  : `api.example.com`; */

//const EXPENSES_API_BASE_URL = "http://localhost:8080/api/v1/expenses";

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
const inputStyle = {width:'70%',/* margin:'10px', */ textAlign:'center'};
const tableStyle = {borderCollapse: 'collapse',
/* margin: '5px', */
fontSize: '1em',
fontFamily: 'sans-serif',
//minWidth: '200px',
boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)'};
const tableHeaderStyle = {backgroundColor:'gray',fontSize:'1.2em',flexDirection: "row",/*, minHeight:'100px' */};



export default function App() {



  /*componentDidMount(){
    ExpensesService.getExpenses().then();
  }*/

  

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

const Login = ({navigation}) => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const [username, onChangeUsername] = React.useState("username1");
  const [password, onChangePassword] = React.useState("password1");
  const [alerta, onChangeAlerta] = React.useState("");
  var token = "";
  

  const grantAccess = async () => {
    const url = 'http://192.168.0.10:8080/api/v1/users/' + token;
    const accessGranted = (await axios.get(`${url}`)).data;
    

    /*axios.get(`${url}`)
    .then((response)=>{
      accessGranted = response.data;
    })
    .catch(error => console.error(`Error: ${error}`));*/

    return(
      accessGranted
    )
  }

  return (
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
      buttonStyle={{backgroundColor:'#00c7b6'}}
      onPress = {async () => {
        token= JWT.encode({user: username, password: password},key).toString();
        if((await grantAccess())==true){
          navigation.navigate('homescreen',{paramToken: token});
        } else {
          toggleOverlay();
          //onChangeAlerta("Wrong Password/User");
        }
        
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
    axios.post('http://192.168.0.10:8080/api/v1/trips/posttrip', {tripID:tripId,enabled:false}, config)
    //.then(res => {
      //response = res.data;
    //})
    //.then(response => this.setState({ articleId: response.data.id }))
    //.catch(error => console.error(`Error: ${error}`));

  }

  return (
  <View style={styles.container}>
    <Text h4/*  style={{margin:'20px'}} */> Insert the trip ID:
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
  const url = 'http://192.168.0.10:8080/api/v1/expenses/allexpensesbytrip/' + paramTripId;

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
    <View style={tableStyle}>
      <View style={tableHeaderStyle}>
          <View><Text>Travel ID</Text></View>
          <View><Text>User ID</Text></View>
          <View><Text>Amounut</Text></View>
          <View><Text>Description</Text></View>
      </View>
        {
          expenses.map(
            (expense) => (

              <View key={expense.id} style={{flexDirection:'row'}}>
                <View><Text>  {expense.travelID}  </Text></View>
                <View><Text>  {expense.userID}  </Text></View>
                <View><Text>  {expense.amount}  </Text></View>
                <View><Text>  {expense.description}  </Text></View>
              </View>
            )
          )
        }

    </View>
  </View>
  )
}

const PostExpense = ({route, navigation}) => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const token = route.params.paramToken;
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

  /*useEffect(() => {
    postExpense();
  },[]);*/

  const postExpense = async() => {
    var response = false;
    await axios.post('http://192.168.0.10:8080/api/v1/expenses/postexpense', expenseJson, config)
    .then(res => {
      response = res.data;
    })
    //.then(response => this.setState({ articleId: response.data.id }))
    //.catch(error => console.error(`Error: ${error}`));
    console.log(response);
    if(response===true){
      onChangeMessage("Expense posted successfully!");
    } else {
      onChangeMessage("Sorry! This trip has already been closed");
    }

  }

  return (
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
      title = "Post"
      onPress = {() => {
        postExpense();
        toggleOverlay();
      }}
    />
  </View>
  )
}

const Report = ({route, navigation}) => {
  const token = route.params.paramToken;
  const paramTripId = route.params.paramTripId;
  const[expenses, getExpenses] = useState([{"id":null,"travelID":null,"userID":null,"amount":null,"description":null}]);
  const[message, changeMessage] = useState("");
  const url = 'http://192.168.0.10:8080/api/v1/expenses/report/' + paramTripId;
  
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

  var whoGetsWhat = "";

  return (
  <View style={styles.container}>

    <View style={tableStyle}>
        <View style={tableHeaderStyle}>
          <View><Text> REPORT </Text></View>
        </View>
        {
          expenses.map(
            (expense) => (

              <View key={expense.id} style={{flexDirection:'row'}}>
                <View><Text> {expense.userID} </Text></View>
                <View><Text> paid </Text></View>
                <View><Text> {expense.amount} </Text></View>
              </View>
            )
          )
        }
        <View style={tableHeaderStyle}>
          <View><Text> Grand Total: </Text></View>
          <View><Text> {getTotal()} </Text></View>
        </View>
        {
          expenses.map(
            (expense) => (
              
              <View key={expense.id} style={{flexDirection:'row'}}>
                <View><Text> {expense.userID} </Text></View>
                <View> <Text>{whoGetsWhat=((getTotal()/expenses.length-getTotal())<0) ? "has to get" : "has to pay"}{whoGetsWhat}</Text>
                </View>
                <View><Text> {(Math.abs(getTotal()/expenses.length-expense.amount)).toFixed(2)} </Text></View>
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
