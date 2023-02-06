import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

// TODO - replace 'localhost' by doing the following
// 1. cd to Good-Night/app/
// 2. run expo start
// 3. find the ip address directly below the QR code
// 4. replace 'localhost' with everything between
//    'exp://' and ':' from the ip below the QR code
const ip = "http://localhost:5000"

const SleepQualityIndicator = () => {
  const [sleepQuality, setSleepQuality] = useState(null);

  useEffect(() => {
    const fetchSleepQuality = async () => {
      const response = await fetch(ip + "/api/sleep-quality");
      const data = await response.json();
      setSleepQuality(data["sleepQuality"]);
    }

    fetchSleepQuality();
  }, []);

  return (
    <CircularProgress
      id="sleepQualityProgressBar"
      value={sleepQuality} 
      radius={120}
      progressValueColor={'black'}
      activeStrokeWidth={25}
      inActiveStrokeWidth={25}
      title={"Sleep Quality"}
      titleColor={"black"}
      titleFontSize={17}
      duration={2000}
      strokeColorConfig={[
        { color: '#cc7676', value: 0 },
        { color: '#ccc876', value: 50 },
        { color: '#76cc7b', value: 100 },
      ]}
      inActiveStrokeColor={'#c4c4c4'}
    />
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      {/* Status bar (we dont really need to do anything for this) */}
      <StatusBar style="auto" />
      
      {/* Shows the day of the week and current date */}
      <View style={styles.date_container}> 
        <Text style={styles.day_style}> Today </Text>
        <Text style={styles.date_style}> January 31, 2023 </Text>
      </View>

      <View style={styles.circle}>
        <SleepQualityIndicator />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'beige',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: "15%",
    flexDirection: "column"
  },
  day_style: {
    // flex: 1,
    fontWeight: "900",
    fontSize: 30,
    // textAlign: "left",
    // alignSelf: "flex-start",
    // paddingLeft: "7%",
    // paddingBottom: "0%"
  },
  date_style: {
    // flex: 20,
    // textAlign: "left",
    // alignSelf: "flex-start",
    // paddingLeft: "7%",
  },
  date_container: {
    flex: 0,
    textAlign: "left",
    alignSelf: "stretch",
    paddingLeft: "7%",
    // backgroundColor: "skyblue", //used this to see the view
    paddingBottom: "10%",
  },
  circle: {
    flex: 1,
    alignSelf: "",
    // backgroundColor: "tan", //used this to see the view
    alignSelf: "stretch",
    justifyContent: "center",
    flexDirection: "row"
  },
});
