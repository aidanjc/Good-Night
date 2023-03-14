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

const ip = "http://localhost:5000/"

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
    <View style={styles.circle}>
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
    </View>
  );
}

const SleepInfoHeader = () => {
  return (
    <View style={styles.sleep_info_header}>
      <Text style={styles.sleep_info_header_text}>
        Sleep Info
      </Text>
      <View style={styles.horizontal_rule}></View>
    </View>
  )
}

const SleepInfoItem = ({data, title}) => {
  return (
    <View style={styles.sleep_info_item}>
      <Text style={{fontWeight: "700"}}>{data}</Text>
      <Text style={{color: "#c4c4c4"}}>{title}</Text>
    </View>
  );
}


const SleepInfoContainer = () => {
  const [timeAsleep, setTimeAsleep] = useState(null);
  const [sleepStart, setSleepStart] = useState(null);
  const [sleepEnd, setSleepEnd] = useState(null);

  useEffect(() => {
    const fetchTimeAsleep = async () => {
      const response = await fetch(ip + "/api/time-asleep");
      const data = await response.json();
      setTimeAsleep(data["timeAsleep"]);
    }

    const fetchSleepStart = async () => {
      const response = await fetch(ip + "/api/sleep-start");
      const data = await response.json();
      setSleepStart(data["sleepStart"]);
    }

    const fetchSleepEnd = async () => {
      const response = await fetch(ip + "/api/sleep-end");
      const data = await response.json();
      setSleepEnd(data["sleepEnd"]);
    }

    fetchTimeAsleep();
    fetchSleepStart();
    fetchSleepEnd();
  }, []);


  return (
    <View style={styles.sleep_info_container}>
      <SleepInfoHeader />
      <View style={styles.sleep_info_item_container}>
        <SleepInfoItem 
          style={styles.sleep_info_item} 
          data={timeAsleep} 
          title={"Time Asleep"} 
        />
        <SleepInfoItem 
          style={styles.sleep_info_item} 
          data={sleepStart} 
          title={"Went to Bed"} 
        />
        <SleepInfoItem 
          style={styles.sleep_info_item} 
          data={sleepEnd} 
          title={"Woke Up"} 
        />
      </View>
    </View>
  );
}

const SleepRecContainer = () => {
  const [sleepRec, setSleepRec] = useState(null);

  useEffect(() => {
    const fetchSleepRec = async () => {
      const response = await fetch(ip + "/api/top-sleep-rec");
      const data = await response.json();
      setSleepRec(data["topSleepRec"])
    }
    
    fetchSleepRec();
  }, []);
  
  return (
    <View style={styles.sleep_rec_container}>
      <Text style={styles.sleep_rec_title}>
        Sleep Recommendation
      </Text>
      <Text>{sleepRec}</Text>
    </View>
  );
}
const SleepDateContainer = () => {
  const [dateRecorded, setdateRecorded] = useState(null);

  useEffect(() => {
    const fetchSleepDate = async () => {
      const response = await fetch(ip + "/api/date-recorded");
      const data = await response.json();
      setdateRecorded(data["dateRecorded"]);
    }

    fetchSleepDate();
  }, []);

  return (
  <View style={styles.date_container}> 
        <Text style={styles.day_style}> Today </Text>
        <Text style={styles.date_style}> {dateRecorded} </Text>
  </View>);
}

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Status bar (we dont really need to do anything for this) */}
      <StatusBar style="auto" />
      
      {/* Shows the day of the week and current date */}
      {/* <View style={styles.date_container}> 
        <Text style={styles.day_style}> Today </Text>
        <Text style={styles.date_style}> January 31, 2023 </Text>
      </View> */}
      <SleepDateContainer />
      <SleepQualityIndicator />
      <SleepInfoContainer />
      <SleepRecContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'beige',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: "15%",
    flexDirection: "column"
  },
  day_style: {
    fontWeight: "900",
    fontSize: 30,
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
    // backgroundColor: "tan", //used this to see the view
    alignSelf: "stretch",
    justifyContent: "center",
    flexDirection: "row"
  },
  sleep_info_container: {
    flex: 1,
    marginTop: "40%",
    marginBottom: 10,
    width: "80%",
    flexDirection: "column",
  },
  sleep_info_header: {
    marginTop: 12,
    marginBottom: 12,
  },
  sleep_info_header_text: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 6,
  },
  sleep_info_item_container: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  horizontal_rule: {
    borderColor: "#c4c4c4",
    borderWidth: 2,
    borderRadius: 60,
  },
  sleep_rec_container: {
    flex: 2,
    width: "100%",
    backgroundColor: "#c4c4c4",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20, 
    alignItems: "center",
  },
  sleep_rec_title: {
    fontWeight: "700",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  }
});

export { HomeScreen };
