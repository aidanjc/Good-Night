import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PersonalScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
    <StatusBar style="auto" />
    <Text style={styles.date_container}>
      Personal
    </Text>
  </View>
  );
}

const styles = StyleSheet.create({
  scratch: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontWeight: "900",
    fontSize: 30,
    marginTop: 50
  },
  container: {
    flex: 1,
    backgroundColor: 'beige',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: "15%",
    flexDirection: "column"
  },
  date_container: {
    flex: 0,
    textAlign: "left",
    alignSelf: "stretch",
    paddingLeft: "7%",
    // backgroundColor: "skyblue", //used this to see the view
    paddingBottom: "10%",
    fontWeight: "900",
    fontSize: 30,
  },
});

export { PersonalScreen };
