// Import React and Component
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Loader from '../Components/Loader';
const HomeScreen = ({navigation}: {navigation: any}) => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTrip, setActiveTrip] = useState('');
  const [ownPosition, setOwnPosition] = useState({
    lat: 45.74735,
    lng: 21.226294,
  });

  useEffect(() => {
    AsyncStorage.getItem('user_name').then((value: any) => setUserName(value));
    AsyncStorage.getItem('user_id').then((value: any) => setUserId(value));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('activeTrip').then((value: any) =>
      setActiveTrip(value),
    );
    if (activeTrip == 'true') navigation.replace('MapScreen');
  }, [activeTrip]);

  const handleSubmitPress = async () => {
    setLoading(true);
    await axios
      .post(
        `http://10.0.2.2:5288/api/Trip/starttrip?latitude=${ownPosition.lat}&longitude=${ownPosition.lng}&userId=${userId}`,
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': 'POST',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        //Hide Loader
        setLoading(false);
        if (response.status === 200) {
          AsyncStorage.setItem('activeTrip', 'true');
          navigation.replace('MapScreen');
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <Text style={styles.welcomeTextStyle}>Welcome, {userName}!</Text>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../Image/runningperson.png')}
          style={{
            width: '75%',
            height: 150,
            resizeMode: 'contain',
            margin: 30,
          }}
        />
      </View>
      <TouchableOpacity
        onPress={handleSubmitPress}
        style={styles.buttonStyle}
        activeOpacity={0.5}>
        <Text style={styles.buttonTextStyle}>Generate Points</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignContent: 'center',
  },
  welcomeTextStyle: {
    color: 'black',
    padding: 10,
    marginTop: 120,
    fontSize: 30,
    textAlign: 'center',
    textAlignVertical: 'top',
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
export default HomeScreen;
