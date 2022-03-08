import React, { Component, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';

export default function InputView({ initialPlaceHolder, text, setText, translateInput }) {

  const [image, setImage] = useState();

  const imageToText = async () => {
    setText({ ...text, isLoading: true });
    var recognitionResult = await TextRecognition.recognize(image.assets[0].uri);
    setText({ ...text, value: recognitionResult[0] });
  };

  useEffect(() => {
    if (image) imageToText();
  }, [image])

  return (
    <View style={styles.container}>
      {!text.isFocused && text.value != "" ? <View></View> :
        <View style={{ ...styles.actionView, flex: !text.isFocused ? 3 : 0.8 }}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setText({ ...text, value: '' });
            }}
          >
            <Image
              style={styles.actionIcon}
              source={require('../assets/icons/dropdown.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              Alert.alert(
                'Camera or Library',
                'Select Photos from Library or Take Photo with Camera?',
                [
                  { text: "select photo", onPress: () => { launchImageLibrary({}, setImage); } },
                  { text: "use camera", onPress: () => { launchCamera({}, setImage); } },
                  { style: "cancel", text: "dismiss", onPress: () => { { } } },
                ],
                { cancelable: true },
              );
            }}
          >
            <Image
              style={styles.actionIcon}
              source={require('../assets/icons/camera.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setText({ ...text, value: '' });
            }}
          >
            <Image
              style={styles.actionIcon}
              source={require('../assets/icons/undo.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
            }}
          >
            <Image
              style={styles.actionIcon}
              source={require('../assets/icons/delete.png')}
            />
          </TouchableOpacity>
        </View>
      }
      <TextInput
        style={styles.textBox}
        value={text.value}
        onChangeText={(newValue) => setText({ ...text, value: newValue })}
        placeholder={initialPlaceHolder}
        multiline={true}
        returnKeyType="go"
        blurOnSubmit={true}
        onFocus={() => { setText({ ...text, isFocused: true }); }}
        onBlur={() => { setText({ ...text, isFocused: false }); }}
        onSubmitEditing={() => { translateInput() }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionView: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 50,
    marginRight: 20,
  },
  actionIcon: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    aspectRatio: 1,
    opacity: 0.3,
  },
  textBox: {
    textAlignVertical: 'top',
    flex: 12,
    fontSize: 20,
  },
});