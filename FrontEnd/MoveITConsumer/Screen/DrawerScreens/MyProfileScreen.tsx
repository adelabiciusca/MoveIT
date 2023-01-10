// Import React and Component
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import Loader from '../Components/Loader';

const MyProfileScreen = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState(null);

  useEffect(() => {
    setLoading(true);
    AsyncStorage.getItem('user_id').then((value: any) => setUserId(value));
    console.log(userId);
    axios
      .get(`http://10.0.2.2:5288/api/User/trips/${userId}`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Method': 'GET',
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        //Hide Loader
        setLoading(false);
        if (response.status === 200) {
          setTrips(response.data);
          console.log(trips);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });

    axios
      .get(`http://10.0.2.2:5288/api/User/${userId}`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Method': 'GET',
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        //Hide Loader
        setLoading(false);
        if (response.status === 200) {
          setUser(response.data);
          console.log(user);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  }, [userId]);

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <Text style={styles.welcomeTextStyle}>
        You have{' '}
        {user == null || user == undefined ? 0 : (user as any)?.storePoints}{' '}
        store points!
      </Text>
      <Text style={styles.tripsText}>Here are your trips:</Text>
      <View style={styles.container}>
        <ScrollView>
          {trips == null || trips == undefined ? (
            <Text style={styles.item}>You have no trips!</Text>
          ) : (
            <View>
              {(trips as any).map((trip: any) => {
                return (
                  <View key={trip.id}>
                    <Text>Trip:</Text>
                    <Text style={styles.item}>
                      Start date:{' '}
                      {new Date(trip.startTime).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.item}>
                      End date:{' '}
                      {new Date(trip.endTime).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.item}>
                      Points collected: {10 - trip.points.length}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
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
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'top',
  },
  tripsText: {
    color: 'black',
    padding: 10,
    marginTop: 10,
    fontSize: 20,
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  container: {
    padding: 50,
    flex: 1,
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
  },
});

export default MyProfileScreen;
