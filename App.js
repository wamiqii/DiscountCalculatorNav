import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput, Button, Alert, SafeAreaView} from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { DataTable } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

const HomeScreen = ({navigation, route}) => {
  const [price, setprice] = useState("");
  const [discount, setdiscount] = useState("");
  const [btndisable, setbtndisable] = useState(true);
  const [savelist, setsavelist] = useState([]);

  const checkdis = (discount) => {
    if (discount >= 0 && discount < 100){
      setdiscount(discount);
    }
  };

  const checkprice = (price) => {
    if(price >= 0){
      setprice(price);
    }
  };

  const discountprice = () => {
    var discountedprice = price - (price  * (discount / 100));
    return discountedprice;
  };
       
  const saveprice = () => {
    var save = price - discountprice();
    return save;
  };

  useEffect(() => {
    setsavelist(
      route.params !== undefined ? Object.values(route.params) : []
      );
  }, [route.params]);

  useEffect(() => {
    if (price !== ""){
      setbtndisable(false);
    }
    else{
      setbtndisable(btndisable);
    }
  }, [price]); 

  const clear = () => {
    setprice("");
    setdiscount("");
  };

  const SavingCal = () => {
    setsavelist(
      [...savelist,
        {
          id: Math.random().toString(),
          Price: price,
          DiscountNo: discount,
          DiscountedPrice: discountprice(),
        },
    ]);
    alert('Data Saved!');
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{paddingRight: 10}}>
          <Button 
            title="History"
            color="gray" 
            onPress={() => navigation.navigate('History', savelist)}
          />
        </View>
      ),
    });
  });
  

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, marginTop: 10, borderBottomWidth: 3}}>Wamiq Waheed - SP18-BCS-171</Text>
      <Text style={{fontSize:20, fontWeight: "bold", marginTop: 50}}>Enter Original Price</Text>
      <TextInput keyboardType={"number-pad"} style={{borderBottomWidth: 3, width: 200, borderRadius: 5, fontSize: 20}} value={price} onChangeText={checkprice}/>
      <Text style={{fontSize:20, fontWeight: "bold", marginTop: 30}}>Enter Discount (%)</Text>
      <TextInput keyboardType={"number-pad"} style={{borderBottomWidth: 3, width: 200, borderRadius: 5, fontSize: 20}} value={discount} onChangeText={checkdis}/>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View style={{width: "40%", paddingTop: 30}}>
          <Button title="Clear Fields" color="black" disabled={btndisable} onPress={() => clear()}/>
        </View>
      </View>
      <View style={{alignItems: "center"}}>
        <Text style={{fontSize:20, fontWeight: "bold", color: "gray", marginTop: 20}}>Original Price: {price}</Text>
        <Text style={{fontSize:20, fontWeight: "bold", color: "gray"}}>Discounted Price: {discountprice()}</Text>
        <Text style={{fontSize:20, fontWeight: "bold", color: "gray"}}>You Saved: {saveprice()}</Text>
      </View>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View style={{width: "50%", paddingTop: 20}}>
          <Button title="Save Calculation" color="black" disabled={btndisable} onPress={() => SavingCal()}/>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const HistoryScreen = ({navigation, route}) => {
  const [savelistB, setsavelistB] = useState(route.params);

  const removeItem = (key) => {
    var list = savelistB.filter(item => item.id != key);
    setsavelistB([...list]);
  };

  const ErasingData = () => {
    Alert.alert(
      "Erase Saved Calculations",
      "Do you really want to Erase saved calculations?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => setsavelistB([]),
        },
      ],
      {cancelable: false}
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
        onPress={() => navigation.navigate('Home', savelistB)}
        >
          <Icon name="arrow-back" size={35} style={{marginLeft: 15}} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
        onPress={ErasingData}
        >
          <Icon name="delete-forever" size={35} color="white" />
        </TouchableOpacity>
      )
    });
  });

    return (
      <View style={{ flex: 1, alignItems: 'center'}}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title numeric >Actual Price</DataTable.Title>
            <DataTable.Title numeric >Discount (%)</DataTable.Title>
            <DataTable.Title numeric >Discount Price</DataTable.Title>
            <DataTable.Title numeric >Delete</DataTable.Title>
          </DataTable.Header>

          <SafeAreaView>
            <ScrollView>
              {savelistB.map((item) => (
                  <DataTable.Row key={item.id}>

                    <DataTable.Cell numeric>{"Rs. " + item.Price}</DataTable.Cell>

                    <DataTable.Cell numeric>{item.DiscountNo + "%"}</DataTable.Cell>

                    <DataTable.Cell numeric>{"Rs. " + item.DiscountedPrice}</DataTable.Cell>

                    <DataTable.Cell numeric>
                      <TouchableOpacity
                        onPress={() => removeItem(item.id)}
                      >
                        <Icon name="highlight-remove" size={30} color="red" />
                      </TouchableOpacity>
                    </DataTable.Cell>

                  </DataTable.Row>
                )
              )}
            </ScrollView>
          </SafeAreaView>
        </DataTable>
      </View>
    );
};

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Discount Calculator', headerStyle: {backgroundColor: "black"},
            headerTitleStyle: {color: "white"}}} />
        <Stack.Screen name="History" component={HistoryScreen} options={{headerTitleAlign: "center", headerStyle: { backgroundColor: "black" },
            headerTitleStyle: { color: "white" }}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default App;
