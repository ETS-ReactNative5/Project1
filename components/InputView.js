import React, {Component} from 'react';
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
import alerts from './Alerts';

export default function InputView({initialPlaceHolder, text, setText, translateInput}) {

    return (
        <View style={styles.container}>
            { !text.isFocused && text.value != null && text.value != "" ? <View></View> :
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={async () => {
                const selection = await alerts.selectCameraOrLibrary();
                var selectedImage = null;
                switch (selection){
                  default: return;
                  case 'library':
                    selectedImage = await launchImageLibrary({}, console.log('library'));
                  case 'camera':
                    selectedImage = await launchCamera({}, console.log('camera'));
                }

                if(selectedImage == null){
                  alerts.errorWhileGettingImage();
                  return;
                }

                setText({...text, isLoading: true});

                var recognitionResult = await TextRecognition.recognize(selectedImage.assets[0].uri);
                setText({ ...text, value: recognitionResult });
              }}
            >
              <Image
                style={styles.cameraIcon}
                source={require('../assets/icons/camera.png')}
              />
            </TouchableOpacity>
            }
            <TextInput
              style={styles.textBox}
              value={text.value}
              onChangeText={(newValue)=> setText({...text, value: newValue})}
              placeholder={initialPlaceHolder}
              multiline={true}
              returnKeyType="go"
              blurOnSubmit={true}
              onFocus={() => {setText({...text, isFocused: true});}}
              onBlur={()=> {setText({ ...text, isFocused: false });}}
              onSubmitEditing={() => {translateInput()}}
            />
          </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraButton: {
    flex:1,
  },
  cameraIcon: {
    flex: 1,
    alignSelf: 'flex-start',
    resizeMode:'contain',
    aspectRatio: 1,
    opacity: 0.3,
  },
  textBox: {
    textAlignVertical: 'top',
    flex: 12,
    fontSize: 20,
  },
});