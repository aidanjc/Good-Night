import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PersonalScreen = ({ navigation }) => {
  return (
    <View style={styles.scratch}>
      <StatusBar style="auto" />
      <Text style={styles.header}>
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
  }
});

export { PersonalScreen };
