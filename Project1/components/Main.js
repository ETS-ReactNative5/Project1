import React, {Component, useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import LanguagePicker from './LanguagePicker';
import LanguageButton from './LanguageButton';

import translate from 'translate-google-api';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { InterstitialAdManager, AdSettings } from 'react-native-fbads';
//import NetInfo from "@react-native-community/netinfo";

const windowHeight = Dimensions.get('window').height;

export default function Main(){

    const [fromText, setFromText] = useState();
    const [isFocusedFrom, setIsFocusedFrom] = useState(false);
    const [isEditingFrom, setIsEditingFrom] = useState(false);
    const [fromLang, setFromLang] = useState();

    const [toText, setToText] = useState();
    const [isFocusedTo, setIsFocusedTo] = useState(false);
    const [isEditingTo, setIsEditingTo] = useState(false);
    const [toLang, setToLang] = useState();

    const [imageFrom, setImageFrom] = useState(null);
    const [imageTo, setImageTo] = useState(null);
    
    const isConnectedToNetwork = async () => {
      //const response = await NetInfo.fetch();
      //return response.isConnected;
      return true;
    }

    const noNetworkConnected = () => {
      Alert.alert(
        "Error",
        "Please connect to a network.",
        [
          { style: "cancel", text: "dismiss", onPress: () => {}}
        ],
        { cancelable: true },
      );
    }

    const noLanguageSelected = () => {
      Alert.alert(
        "No Language",
        "Please select a language to translate from and to.",
        [
          { style: "cancel", text: "dismiss", onPress: () => {}}
        ],
        { cancelable: true },
      );
    }
    const errorOnInput = () => {
      Alert.alert(
        "Error",
        "Are you sure that this request is valid?",
        [
          { style: "cancel", text: "dismiss", onPress: () => {}}
        ],
        { cancelable: true },
      );
    }
    const interstitialId = Platform.OS === 'ios' ? "662530228288377_662556258285774" : "662530228288377_662594761615257";
    const runAdTimer = () => {
      setTimeout(() => {
      InterstitialAdManager.showAd(interstitialId)
      .then(didClose => {runAdTimer();})
      .catch(error => {runAdTimer();});
      }, 120000); //2 minutes
    };
    runAdTimer();
    
    useEffect(() => {
      async function fetchText(image, text, setText) {
          setText("DisplayActivityIndicator");
          var result = await TextRecognition.recognize(image.assets[0].uri);
          setText(text + "" + result[0]);
      }
      if(imageTo) fetchText(imageTo, toText, setToText);
      if(imageFrom) fetchText(imageFrom, fromText, setFromText);
      },
      [imageTo, imageFrom]
    );

  return (
    <SafeAreaView style={styles.container}>
      <LanguageButton
        buttonColor={'blue'}
        placeHolder={'Detect Language'}
        lang={fromLang}
        isEditing={isEditingFrom}
        setIsEditingLang={setIsEditingFrom}
      />
       { isFocusedTo ? <View style={{marginBottom: 10}}></View> :
      <View style={{ ...styles.box, borderColor: 'blue' }}>
        {isEditingFrom == true ? (
          <LanguagePicker
            setLang={setFromLang}
            setIsEditingLang={setIsEditingFrom}
          />
        ) : fromText == "DisplayActivityIndicator" ? <ActivityIndicator size="large" color="gray" /> : (
          <View style={styles.inputView}>
            { !isFocusedFrom && fromText != null && fromText != "" ? <View></View> :
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={async () => {
                var image = null;
                Alert.alert(
                  "Camera or Library",
                  "Select Photos from Library or Take Photo with Camera?",
                  [
                    {
                      text: "Select Photo",
                      onPress: async() => image = await launchImageLibrary({}, setImageFrom)
                    },
                    {
                      text: "Use Camera",
                      onPress: async() => image = await launchCamera({}, setImageFrom)
                    },
                    { style: "cancel", text: "cancel", onPress: () => {} }
                  ],
                  { cancelable: true },
                );
              }}
            >
              <Image
                style={styles.cameraIcon}
                source={require('../assets/cameraIcon.jpeg')}
              />
            </TouchableOpacity>
            }
            <TextInput
              style={styles.textBox}
              value={fromText}
              multiline={true}
              returnKeyType="go"
              placeholder="type here..."
              onChangeText={setFromText}
              blurOnSubmit={true}
              onFocus={()=>{
                  setIsFocusedFrom(true);
              }}
              onBlur={()=>{
                setIsFocusedFrom(false);
              }}
              onSubmitEditing={async () => {
                var isConnected = await isConnectedToNetwork();
                if(!isConnected){
                  noNetworkConnected();
                  return;
                }
                if (toLang == null){
                  noLanguageSelected();
                  return;
                }
                
                setToText('DisplayActivityIndicator');
                await translate(fromText, {
                  tld: fromLang == null ? '' : fromLang.code,
                  to: toLang.code,
                })
                  .then((value) => {
                    setToText(value[0]);
                  })
                  .catch((e) => {
                    errorOnInput();
                    setToText('');
                  });
              }}
            />
          </View>
        )}
      </View>
    }
      <LanguageButton
        buttonColor={'green'}
        placeHolder={'select language'}
        lang={toLang}
        isEditing={isEditingTo}
        setIsEditingLang={setIsEditingTo}
      />
      <View style={{ ...styles.box, borderColor: 'green' }}>
        {isEditingTo == true ? (
          <LanguagePicker
            setLang={setToLang}
            setIsEditingLang={setIsEditingTo}
          />
        ) : toText == "DisplayActivityIndicator" ? <ActivityIndicator size="large" color="gray" /> : (
          <View style={styles.inputView}>
            { !isFocusedTo && toText != null && toText != "" ? <View></View> :
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={async () => {
                var image = null;
                Alert.alert(
                  "Camera or Library",
                  "Select Photos from Library or Take Photo with Camera?",
                  [
                    {
                      text: "Select Photo",
                      onPress: async() => image = await launchImageLibrary({}, setImageTo)
                    },
                    {
                      text: "Use Camera",
                      onPress: async() => image = await launchCamera({}, setImageTo)
                    },
                    { style: "cancel", text: "cancel", onPress: () => {} }
                  ],
                  { cancelable: false },
                );
              }}
            >
              <Image
                style={styles.cameraIcon}
                source={require('../assets/cameraIcon.jpeg')}
              />
            </TouchableOpacity>
            }
          <TextInput
            style={styles.textBox}
            value={toText}
            multiline={true}
            returnKeyType="go"
            placeholder="or type here...."
            onChangeText={setToText}
            returnKeyType="go"
            blurOnSubmit={true}
            onFocus={()=>{
                setIsFocusedTo(true);
            }}
            onBlur={()=>{
              setIsFocusedTo(false);
            }}
            onSubmitEditing={async () => {
              var isConnected = await isConnectedToNetwork();
                if(!isConnected){
                  noNetworkConnected();
                  return;
              }
              if (toLang == null || fromLang == null){
                noLanguageSelected();
                return;
              }
              setFromText('DisplayActivityIndicator');
              await translate(toText, {
                tld: toLang == null ? '' : toLang.code,
                to: fromLang.code,
              })
                .then((value) => {
                  setFromText(value[0]);
                })
                .catch((e) => {
                  errorOnInput();
                  setFromText('');
                });
            }}
          />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
    backgroundColor: '#fff',
  },
  box: {
    flex: 2,
    borderWidth: 3,
    borderTopWidth: 0,
    marginBottom: 20,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  inputView: {
    flex: 1,
  },
  cameraButton: {
    width: 35,
    height: 40,
  },
  cameraIcon: {
    alignSelf: 'center',
    height: 35,
    width: 35,
    opacity: 0.3,
  },
  textBox: {
    textAlignVertical: 'top',
    flex: 5,
    fontSize: 20,
  },
});
