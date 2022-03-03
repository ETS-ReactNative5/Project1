import React, {Component, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function LanguagePicker({setLang, setIsEditingLang}) {

  return (
    <ScrollView>
      {
        availableLanguages.map((lang, index) => (
          <TouchableOpacity key={index} style={styles.item} onPress={()=> {setLang(lang); setIsEditingLang(false);}}>
            <Text style={styles.itemText}>{lang.title}</Text>
          </TouchableOpacity>
        ))
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 35
  },
  itemText: {
    fontSize: 20,
  }
});

const availableLanguages = [
        { title: "Afrikaans", code: "af" },
        { title: "Albanian", code: "sq" },
        { title: "Arabic - Algeria", code: "ar" },
        { title: "Armenian", code: "hy" },
        { title: "Azeri - Cyrillic", code: "az" },
        { title: "Basque", code: "eu" },
        { title: "Belarusian", code: "be" },
        { title: "Bengali - Bangladesh", code: "bn" },
        { title: "Bosnian", code: "bs" },
        { title: "Bulgarian", code: "bg" },
        { title: "Burmese", code: "my" },
        { title: "Catalan", code: "ca" },
        { title: "Croatian", code: "hr" },
        { title: "Czech", code: "cs" },
        { title: "Danish", code: "da" },
        { title: "Dutch - Belgium", code: "en" },
        { title: "English", code: "nl" },
        { title: "Estonian", code: "et" },
        { title: "FYRO Macedonia", code: "mk" },
        { title: "Farsi - Persian", code: "fa" },
        { title: "Finnish", code: "fi" },
        { title: "French - Canada", code: "fr" },
        { title: "Gaelic - Ireland", code: "gd" },
        { title: "Galician", code: "gl" },
        { title: "Georgian", code: "ka" },
        { title: "German - Austria", code: "de" },
        { title: "Greek", code: "el" },
        { title: "Gujarati", code: "gu" },
        { title: "Hindi", code: "hi" },
        { title: "Hungarian", code: "hu" },
        { title: "Icelandic", code: "is" },
        { title: "Indonesian", code: "id" },
        { title: "Italian - Italy", code: "it" },
        { title: "Japanese", code: "ja" },
        { title: "Kannada", code: "kn" },
        { title: "Kazakh", code: "kk" },
        { title: "Khmer", code: "km" },
        { title: "Korean", code: "ko" },
        { title: "Lao", code: "lo" },
        { title: "Latin", code: "la" },
        { title: "Latvian", code: "lv" },
        { title: "Lithuanian", code: "lt" },
        { title: "Malay - Brunei", code: "ms" },
        { title: "Malayalam", code: "ml" },
        { title: "Maltese", code: "mt" },
        { title: "Maori", code: "mi" },
        { title: "Marathi", code: "mr" },
        { title: "Mongolian", code: "mn" },
        { title: "Nepali", code: "ne" },
        { title: "Polish", code: "pl" },
        { title: "Portuguese - Brazil", code: "pt" },
        { title: "Romanian - Moldova", code: "ro" },
        { title: "Russian", code: "ru" },
        { title: "Serbian - Cyrillic", code: "sr" },
        { title: "Sindhi", code: "sd" },
        { title: "Slovak", code: "sk" },
        { title: "Slovenian", code: "sl" },
        { title: "Somali", code: "so" },
        { title: "Spanish - Argentina", code: "es" },
        { title: "Swahili", code: "sw" },
        { title: "Swedish - Finland", code: "sv" },
        { title: "Tajik", code: "tg" },
        { title: "Tamil", code: "ta" },
        { title: "Telugu", code: "te" },
        { title: "Thai", code: "th" },
        { title: "Turkish", code: "tr" },
        { title: "Ukrainian", code: "uk" },
        { title: "Urdu", code: "ur" },
        { title: "Uzbek - Cyrillic", code: "uz" },
        { title: "Vietnamese", code: "vi" },
        { title: "Welsh", code: "cy" },
        { title: "Xhosa", code: "xh" },
        { title: "Yiddish", code: "yi" },
        { title: "Zulu", code: "zu" }
    ];
