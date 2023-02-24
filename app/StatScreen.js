import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ip = "http://localhost:5000/"

const ShowStats = () => {
  const [timeInBed, setTimeInBed] = useState(null)

  useEffect(() => {
    const fetchTimeInBed = async () => {
      const response = await fetch(ip + "/api/avg-time-in-bed");
      const data = await response.json();
      setTimeInBed(data["avgTimeInBed"]);
    }

  fetchTimeInBed();
  }, [])

  return (
    <View style={styles.stats_container}>
      <View style="flex=1">
        <Text>
          Average Time in Bed: {timeInBed}
        </Text>
      </View>
    </View>
  )
}

const StatScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      <StatusBar style="auto" />
      <Text style={styles.date_container}>
        Statistics
      </Text>

      <ShowStats/>
      
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
  stats_container: {
    backgroundColor: "skyblue", //used this to see the view
    flex: 1,
    flexDirection: "column",
    flexWrap: "wrap"
  }

});
export { StatScreen };
