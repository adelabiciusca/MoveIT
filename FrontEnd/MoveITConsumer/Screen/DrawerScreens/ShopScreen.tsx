// Import React and Component
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import React, {createRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import {Button, Card} from 'react-native-paper';
import Dialog, {
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from 'react-native-popup-dialog';

import Loader from '../Components/Loader';

const ShopScreen = () => {
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productName, setProductName] = useState('');
  const [isAdmin, setIsAdmin] = useState('');
  const [addProduct, setAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    name: null,
    price: null,
  });
  const [products, setProducts] = useState([
    {
      id: null,
      name: null,
      price: null,
    },
  ]);
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [handleClaim, setHandleClaim] = useState(false);

  useEffect(() => {
    getProducts();
    getUser();
  }, [isAdmin, userId]);

  const getUser = () => {
    setLoading(true);
    AsyncStorage.getItem('user_id').then((value: any) => {
      setUserId(value);
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
  };

  const getProducts = () => {
    setLoading(true);
    AsyncStorage.getItem('isAdmin').then((value: any) => {
      setIsAdmin(value);
    });
    axios
      .get(`http://10.0.2.2:5288/api/Product`, {
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
          setProducts(response.data);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const handleClaimProduct = () => {
    setHandleClaim(true);
  };

  const claimProductHandler = () => {
    setHandleClaim(false);
    axios
      .delete(
        `http://10.0.2.2:5288/api/Product?productId=${selectedProduct.id}&userId=${userId}`,
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': 'DELETE',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        //Hide Loader
        setLoading(false);
        if (response.status === 200) {
          getProducts();
          getUser();
        }
      });
  };

  const handleAddProduct = () => {
    setAddProduct(true);
  };

  const addProductHandler = () => {
    setErrortext('');
    if (!productName) {
      setErrortext('Please fill product name');
    }
    if (!productPrice) {
      setErrortext('Please fill product price');
    }
    axios
      .post(
        `http://10.0.2.2:5288/api/Product?name=${productName}&price=${Number(
          productPrice,
        )}`,
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
          setAddProduct(false);
          getProducts();
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
        setErrortext('Username or password is not valid');
      });
  };

  const priceInputRef = createRef();

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <Text style={styles.welcomeTextStyle}>
        Welcome to the shop! Your points:{' '}
        {user == null ? 0 : (user as any).storePoints}
      </Text>
      <View style={{alignItems: 'center'}}></View>
      {isAdmin == 'true' && (
        <TouchableOpacity
          onPress={handleAddProduct}
          style={styles.buttonStyle}
          activeOpacity={0.5}>
          <Text style={styles.buttonTextStyle}>Add product</Text>
        </TouchableOpacity>
      )}
      <View>
        <ScrollView>
          {products == null ? (
            <Text style={styles.welcomeTextStyle}>
              There are no items in the shop!
            </Text>
          ) : (
            <View>
              {(products as any).map((product: any) => {
                return (
                  <View key={product.id}>
                    <Card>
                      <Card.Title
                        title={product.name}
                        subtitle={product.price + ' points'}
                      />
                      <Card.Actions>
                        <Button
                          mode="contained"
                          buttonColor="#7DE24E"
                          onPress={() => {
                            handleClaimProduct();
                            setSelectedProduct({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                            });
                          }}>
                          Claim
                        </Button>
                      </Card.Actions>
                    </Card>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
      <Dialog
        visible={addProduct}
        onTouchOutside={() => setAddProduct(false)}
        dialogTitle={
          <DialogTitle
            title="Add a product!"
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
              text="Add product!"
              bordered
              onPress={addProductHandler}
              key="button-2"
            />
          </DialogFooter>
        }>
        <DialogContent
          style={{
            backgroundColor: '#F7F7F8',
          }}>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={productName => setProductName(productName)}
              placeholder="Enter product name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onSubmitEditing={() =>
                priceInputRef.current && (priceInputRef.current as any).focus()
              }
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={productPrice => setProductPrice(productPrice)}
              placeholder="Enter product price" //12345
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
              ref={priceInputRef as any}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}>{errortext}</Text>
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog
        visible={handleClaim}
        onTouchOutside={() => setHandleClaim(false)}
        dialogTitle={
          <DialogTitle
            title={selectedProduct.name as any}
            style={{
              backgroundColor: '#F7F7F8',
            }}
            hasTitleBar={false}
            align="left"
          />
        }
        footer={
          <DialogFooter>
            {user != null &&
            (user as any).storePoints < (selectedProduct as any).price ? (
              <DialogButton
                text="Close"
                bordered
                onPress={() => setHandleClaim(false)}
                key="button-2"
              />
            ) : (
              <DialogButton
                text="Claim product!"
                bordered
                onPress={claimProductHandler}
                key="button-2"
              />
            )}
          </DialogFooter>
        }>
        <DialogContent
          style={{
            backgroundColor: '#F7F7F8',
          }}>
          {user != null &&
          (user as any).storePoints < (selectedProduct as any).price ? (
            <Text>You do not have enough points to claim this item!</Text>
          ) : (
            <Text>
              You can claim the item! You will have{' '}
              {user != null
                ? (user as any).storePoints - (selectedProduct as any).price
                : null}{' '}
              points left!{' '}
            </Text>
          )}
        </DialogContent>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignContent: 'center',
  },
  inputStyle: {
    width: 200,
    color: 'black',
    paddingLeft: 10,
    paddingRight: 0,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  welcomeTextStyle: {
    color: 'black',
    padding: 10,
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'top',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
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
    marginTop: 10,
    marginBottom: 10,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
});

export default ShopScreen;
