import React, {Component, useEffect, useState} from 'react';
import TextRecognition from 'react-native-text-recognition';
import {
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
    const [isEditingTo, setIsEditingTo] = useState(false);
    const [toLang, setToLang] = useState();

    const [image, setImage] = useState(null);

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
                var image = await launchImageLibrary({}, setImage);
                //var image = await launchCamera({});
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
              clearButtonMode="while-editing"
              autoFocus={true}
              returnKeyType="go"
              placeholder="type here..."
              onChangeText={setFromText}
              onEndEditing={async () => {
                if (toLang == null) return;

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
            onEndEditing={async () => {
              if (fromLang == null) return;
              await translate(toText, {
                tld: toLang == null ? '' : toLang.code,
                to: fromLang.code,
              })
                .then((value) => {
                  setFromText(value[0]);
                })
                .catch((e) => {
                  setFromText('sorry, error');
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
    width: 40,
  },
  cameraIcon: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    opacity: 0.5,
  },
  textBox: {
    textAlignVertical: 'top',
    flex: 5,
    fontSize: 20,
  },
});
