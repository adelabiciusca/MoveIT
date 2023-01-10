// Import React and Component
import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Button,
} from 'react-native';
import Dialog, {
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from 'react-native-popup-dialog';

import GetLocation from 'react-native-get-location';
import AsyncStorage from '@react-native-community/async-storage';

import Loader from './Components/Loader';
import axios from 'axios';
import {AnimationType, LatLng, LeafletView} from 'react-native-leaflet-view';
import {Float} from 'react-native/Libraries/Types/CodegenTypes';

const MapScreen = ({navigation}: {navigation: any}) => {
  const [loading, setLoading] = useState(false);
  const [partialEndTrip, setPartialEndTrip] = useState(false);
  const [endTrip, setEndTrip] = useState(false);
  const [trip, setTrip] = useState(null);
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState('');
  const [isPointClose, setIsPointClose] = useState(false);
  const [pointToBeClaimed, setPointToBeClaimed] = useState({
    id: null,
    position: {lat: null, lng: null},
  });
  const [ownPosition, setOwnPosition] = useState({
    lat: 45.74735,
    lng: 21.226294,
  });

  const [points, setPoints] = useState([
    {
      id: null,
      position: {lat: null, lng: null},
    },
  ]);

  useEffect(() => {
    setLoading(true);
    AsyncStorage.getItem('user_id').then((value: any) => {
      setUserId(value);
      setLoading(false);
    });
    AsyncStorage.getItem('isAdmin').then((value: any) => {
      setIsAdmin(value);
      setLoading(false);
    });
    axios
      .get(`http://10.0.2.2:5288/api/Trip/userTrip?userId=${userId}`, {
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
          setTrip(response.data);
          var locations: {id: string; position: {lat: Float; lng: Float}}[] =
            [];
          response.data.points.forEach((point: any) => {
            var location = {
              id: point.id,
              position: {lat: point.latitude, lng: point.longitude},
            };
            locations.push(location);
          });
          setPoints(locations as any);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  }, [userId]);

  // useEffect(() => {
  //   getLocationAsync();
  // });

  // const getLocationAsync = () =>
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 15000,
  //   })
  //     .then(location => {
  //       console.log(
  //         '                    ' +
  //           location.longitude +
  //           '                     ' +
  //           location.latitude,
  //       );
  //       setOwnPosition({
  //         lat: location.latitude as any,
  //         lng: location.longitude as any,
  //       });
  //     })
  //     .catch(error => {
  //       const {code, message} = error;
  //       console.warn(code, message);
  //     });

  const handleSubmitPress = () => {
    setPartialEndTrip(true);
  };

  const finishTrip = () => {
    axios
      .post(
        `http://10.0.2.2:5288/api/Trip/endtrip?tripId=${
          (trip as any).id
        }&userId=${userId}`,
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
        if (response.status === 200) {
          setPartialEndTrip(false);
          setEndTrip(false);
          setIsPointClose(false);
          AsyncStorage.setItem('activeTrip', 'false');
          navigation.replace('DrawerNavigationRoutes');
        }
      });
  };

  const goRight = () => {
    setOwnPosition({
      ...ownPosition,
      lng: ownPosition.lng + 0.0005,
      lat: ownPosition.lat,
    });
  };

  const goLeft = () => {
    setOwnPosition({
      ...ownPosition,
      lng: ownPosition.lng - 0.0005,
      lat: ownPosition.lat,
    });
  };

  const goDown = () => {
    setOwnPosition({
      ...ownPosition,
      lat: ownPosition.lat - 0.0005,
      lng: ownPosition.lng,
    });
  };

  const goUp = () => {
    setOwnPosition({
      ...ownPosition,
      lat: ownPosition.lat + 0.0005,
      lng: ownPosition.lng,
    });
  };

  useEffect(() => {
    handleClaim();
  }, [ownPosition, points]);

  const handleClaim = () => {
    points.forEach(p => {
      var distance = distanceInMeters(
        (p as any).position.lat,
        (p as any).position.lng,
        ownPosition.lat,
        ownPosition.lng,
      );
      if (distance < 10000) {
        setIsPointClose(true);
        setPointToBeClaimed(p);
      }
    });
  };

  const claimPoint = () => {
    setIsPointClose(false);
    setPoints(points.filter(p => p.id !== pointToBeClaimed.id));
    axios.delete(
      `http://10.0.2.2:5288/api/Point?pointId=${pointToBeClaimed.id}`,
      {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Method': 'DELETE',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(points.length);
    if (points.length - 1 == 0) setEndTrip(true);
  };

  function distanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c * 1000;
  }

  function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <View style={styles.container}>
        <LeafletView
          zoom={20}
          mapCenterPosition={ownPosition}
          mapMarkers={[
            ...points.map(point => {
              return {
                position: point.position,
                icon: '⭐',
              };
            }),
            {
              position: ownPosition,
              icon: '📍',
              size: [32, 32],
            },
          ]}
        />
      </View>
      {isAdmin == 'true' && (
        <View style={styles.buttonContainer}>
          <View style={styles.menuButton}>
            <Button title="UP" onPress={goUp} />
          </View>
          <View style={styles.menuButton}>
            <Button title="DOWN" onPress={goDown} />
          </View>
          <View style={styles.menuButton}>
            <Button title="LEFT" onPress={goLeft} />
          </View>
          <View style={styles.menuButton}>
            <Button title="RIGHT" onPress={goRight} />
          </View>
        </View>
      )}
      {isAdmin == 'true' ? (
        <View>
          <TouchableOpacity
            onPress={handleSubmitPress}
            style={styles.buttonStyle}
            activeOpacity={0.5}>
            <Text style={styles.buttonTextStyle}>End Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            onPress={handleSubmitPress}
            style={styles.buttonStyleNotAdmin}
            activeOpacity={0.5}>
            <Text style={styles.buttonTextStyle}>End Trip</Text>
          </TouchableOpacity>
        </View>
      )}

      <Dialog
        visible={isPointClose}
        dialogTitle={
          <DialogTitle
            title="You can now claim a star!"
            style={{
              backgroundColor: '#F7F7F8',
            }}
            hasTitleBar={false}
            align="left"
          />
        }
        footer={
          <DialogFooter>
            <DialogButton
              text="CLAIM!"
              bordered
              onPress={claimPoint}
              key="button-2"
            />
          </DialogFooter>
        }></Dialog>

      <Dialog
        visible={partialEndTrip}
        onTouchOutside={() => setPartialEndTrip(false)}
        dialogTitle={
          <DialogTitle
            title="You are about to end the trip!"
            style={{
              backgroundColor: '#F7F7F8',
            }}
            hasTitleBar={false}
            align="left"
          />
        }
        footer={
          <DialogFooter>
            <DialogButton
              text="Finish Trip!"
              bordered
              onPress={finishTrip}
              key="button-2"
            />
          </DialogFooter>
        }>
        <DialogContent
          style={{
            backgroundColor: '#F7F7F8',
          }}>
          <Text>
            You have colected a total of {10 - points.length} points! You can
            now claim them!
          </Text>
          <Text>Touch outside if you would like to continue!</Text>
        </DialogContent>
      </Dialog>

      <Dialog
        visible={endTrip}
        onTouchOutside={() => setEndTrip(false)}
        dialogTitle={
          <DialogTitle
            title="Congratulations! You have collected all the points!"
            style={{
              backgroundColor: '#F7F7F8',
            }}
            hasTitleBar={false}
            align="left"
          />
        }
        footer={
          <DialogFooter>
            <DialogButton
              text="Finish Trip!"
              bordered
              onPress={finishTrip}
              key="button-2"
            />
          </DialogFooter>
        }></Dialog>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 500,
  },
  mainBody: {
    backgroundColor: '#307ecc',
    flex: 1,
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
    marginTop: 0,
    marginBottom: 50,
  },

  buttonStyleNotAdmin: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 550,
    marginBottom: 50,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 450,
  },
  menuButton: {
    flex: 1,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
