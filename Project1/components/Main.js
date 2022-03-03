import React, {Component, useEffect, useState} from 'react';
import TextRecognition from 'react-native-text-recognition';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LanguagePicker from './LanguagePicker';
import LanguageButton from './LanguageButton';
import translate from 'translate-google-api';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const windowHeight = Dimensions.get('window').height;

export default function Main(){

    const [fromText, setFromText] = useState();
    const [isEditingFrom, setIsEditingFrom] = useState(false);
    const [fromLang, setFromLang] = useState();

    const [toText, setToText] = useState();
    const [isFocusedTo, setIsFocusedTo] = useState(false);
    const [isEditingTo, setIsEditingTo] = useState(false);
    const [toLang, setToLang] = useState();

    const [image, setImage] = useState(null);

    const noLanguageSelected = () => {
      Alert.alert(
        "No Language",
        "Please select the language in the bottom box.",
        [
          { style: "cancel", text: "dismiss", onPress: () => {}}
        ],
        { cancelable: true },
      );
    }

    useEffect(() => {
      async function fetchText() {
          var result = await TextRecognition.recognize(image.assets[0].uri);
          setFromText(result[0])
      }
      if(image){
        fetchText();
      }
      },
      [image]
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
        ) : (
          <View style={styles.inputView}>
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
                      onPress: async() => image = await launchImageLibrary({}, setImage)
                    },
                    {
                      text: "Use Camera",
                      onPress: async() => image = await launchCamera({}, setImage)
                    },
                    { style: "cancel", text: "cancel", onPress: () => console.log("cancel") }
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
            <TextInput
              style={styles.textBox}
              value={fromText}
              multiline={true}
              returnKeyType="go"
              placeholder="type here..."
              onChangeText={setFromText}
              blurOnSubmit={true}
              onSubmitEditing={async () => {
                if (toLang == null){
                  noLanguageSelected();
                  return;
                }

                await translate(fromText, {
                  tld: fromLang == null ? '' : fromLang.code,
                  to: toLang.code,
                })
                  .then((value) => {
                    setToText(value[0]);
                  })
                  .catch((e) => {
                    setToText('sorry, error');
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
        ) : (
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
              if (toLang == null){
                noLanguageSelected();
                return;
              }

              await translate(fromText, {
                tld: fromLang == null ? '' : fromLang.code,
                to: toLang.code,
              })
                .then((value) => {
                  setToText(value[0]);
                })
                .catch((e) => {
                  setToText('sorry, error');
                });
            }}
          />
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
    flex: 1,
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
