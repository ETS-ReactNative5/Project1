import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function LanguageButton({buttonColor, placeHolder, lang, isEditing, setIsEditingLang}) {
    return (
      <TouchableOpacity
        style={{ ...styles.langButton, backgroundColor: buttonColor}}
        onPress={() => {
          setIsEditingLang(isEditing == true ? false : true);
        }}
      >
        <Text style={styles.langButtonText}>
          {lang == null ? placeHolder : lang.title}
        </Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  langButton: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 40,
    justifyContent: "center",
  },
  langButtonText: {
    color: 'white',
    fontSize: 25,
    textAlign: "center",
  },
});
