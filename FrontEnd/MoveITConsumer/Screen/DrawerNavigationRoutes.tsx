import React from 'react';

// Import Navigators from React Navigation
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Import Screens
import HomeScreen from './DrawerScreens/HomeScreen';
import ShopScreen from './DrawerScreens/ShopScreen';
import MyProfileScreen from './DrawerScreens/MyProfileScreen';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreenStack = ({navigation}: {navigation: any}) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ShopScreenStack = ({navigation}: {navigation: any}) => {
  return (
    <Stack.Navigator
      initialRouteName="ShopScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="ShopScreen"
        component={ShopScreen}
        options={{
          title: 'Shop', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const MyProfileScreenStack = ({navigation}: {navigation: any}) => {
  return (
    <Stack.Navigator
      initialRouteName="MyProfile"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="MyProfileScreen"
        component={MyProfileScreen}
        options={{
          title: 'My Profile', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props: any) => {
  return (
    // @ts-nocheck
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="homeScreenStack"
        options={{
          drawerLabel: 'Home',
          drawerLabelStyle: {color: 'white'},
        }}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="profileScreenStack"
        options={{
          drawerLabel: 'My Profile',
          drawerLabelStyle: {color: 'white'},
        }}
        component={MyProfileScreenStack}
      />
      <Drawer.Screen
        name="shopScreenStack"
        options={{
          drawerLabel: 'Shop',
          drawerLabelStyle: {color: 'white'},
        }}
        component={ShopScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
