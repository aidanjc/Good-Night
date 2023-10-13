import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { baseurl } from './baseurl'

const StatContainer = ({icon, stat, label}) => {
  return (
    <LinearGradient 
    colors={["#D49EFF", "#F0DDFF"]}
    style={[styles.box]}>
    <View style={{flexDirection: "row", justifyContent: "center", width: "100%"}}> 
      <Ionicons name={icon} size={30}/>
      <Text style={{paddingTop: "5%"}}> {stat} </Text>
    </View>
    <View style={{flexDirection: "row", justifyContent: "center"}}>
      <Text style={{fontSize: 12}}> {label} </Text>
    </View>
  </LinearGradient>
  )
}

const ShowSleepStatsContainer = () => {
  const [timeInBed, setTimeInBed] = useState(null)
  const [timeBeforeBed, setTimeBeforeBed] = useState(null)
  const [timeBeforeBed30, setTimeBeforeBed30] = useState(null)
  const [timeInBed30, setTimeInBed30] = useState(null)
  useEffect(() => {
    const fetchTimeInBed = async () => {
      const response = await fetch(baseurl + "/api/avg-time-in-bed");
      const data = await response.json();
      setTimeInBed(data["avgTimeInBed"]);
    }
    const fetchTimeBeforeBed = async () => {
      const response = await fetch(baseurl + "/api/get-last-7-logs-before-sleep");
      const data = await response.json();
      setTimeBeforeBed(data["timeBeforeSleep"]);
    }

    const fetchTimeBeforeBed30 = async () => {
      const response = await fetch(baseurl + "/api/get-last-30-logs-time-before-sleep");
      const data = await response.json();
      setTimeBeforeBed30(data["timeBeforeSleep"]);
    }

    const fetchTimeInBed30 = async () => {
      const response = await fetch(baseurl + "/api/get-last-30-logs-time-in-bed")
      const data = await response.json();
      setTimeInBed30(data["timeInBed"])
    }

  fetchTimeInBed();
  fetchTimeBeforeBed();
  fetchTimeBeforeBed30();
  fetchTimeInBed30();
  }, [])

  return (
    <View> 
      <View style={[styles.row]}>
        <StatContainer
          icon="alarm"
          stat={timeInBed}
          label="Time in bed"
        />
        <StatContainer
          icon="alarm"
          stat={timeInBed30}
          label="Time in bed"
        />
      </View>

      <View style={[styles.row]}>
        <StatContainer
          icon="hourglass"
          stat={timeBeforeBed}
          label="Sleep onset latency"
        />
        <StatContainer
          icon="hourglass"
          stat={timeBeforeBed30}
          label="Sleep onset latency"
        />
      </View>
    </View>
  )
}

const ShowActivityStatsContainer = () => {
  const [steps, setSteps] = useState(null)
  const [logsSteps30, setLogsSteps30] = useState(null)
  useEffect(() => {
    const fetchSteps = async () => {
      const response = await fetch(baseurl + "/api/get-last-7-logs-steps");
      const data = await response.json();
      setSteps(data["steps"]);
    }

    const fetch30Steps = async () => {
      const response = await fetch(baseurl + "/api/get-last-30-logs-steps");
      const data = await response.json();
      setLogsSteps30(data["steps"]);
    }

  fetchSteps();
  fetch30Steps();
  }, [])

  return (
    <View style={[styles.row]}>
      <StatContainer
        icon="walk"
        stat={steps}
        label="Steps"
      />

      <StatContainer
        icon="walk"
        stat={logsSteps30}
        label="Steps"
      />
    </View>
  )
}

const ShowSleepQualityStatsContainer = () => {
  const [sleepQuality7, setSleepQuality7] = useState(null)
  const [sleepQuality30, setSleepQuality30] = useState(null)
  useEffect(() => {
    const fetchSleepQualities = async () => {
      const response = await fetch(baseurl + "/api/get-sleep-qualities");
      const data = await response.json();
      setSleepQuality7(data["sleep"][0]);
      setSleepQuality30(data["sleep"][1])
    }

  fetchSleepQualities();
  }, [])

  return (
    <View style={[styles.row]}>
      <StatContainer
        icon="moon"
        stat={sleepQuality7}
        label="Sleep Quality"
      />
      <StatContainer
        icon='moon'
        stat={sleepQuality30}
        label="Sleep Quality"
      />
    </View>
  )
}

const LineChartStats = ({label, data, legend, max}) => {

  return (
  <LineChart
  data={{
    labels: label ? label : ["?"],
    datasets: [
      {
        data: data ? data : [0]
      },
    ],
    legend: [legend]
  }}
  width={Dimensions.get("window").width}
  height={220}
  yLabelsOffset={10}
  chartConfig={{
    backgroundGradientFrom: "#C57DFF",
    backgroundGradientTo: "#8E00FF",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 0.0) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
  }}
  style={{
    marginVertical: 8,
    borderRadius: 16
  }}
  fromZero="true"
  fromNumber={max}
/>
  )
}

const TestStats = () => {

  const [timeInBedPast7Logs, setTimeInBedPast7Logs] = useState(null);
  const [past7Logs, setpast7Logs] = useState(null);
  const [last7LogsSteps, setLast7LogsSteps] = useState(null);
  const [last7LogsSleepQuality, setLast7LogsSleepQuality] = useState(null);

  useEffect(() => {
    const fetchPast7Logs = async () => {
      const response = await fetch(baseurl + "/api/get-dates-past-7-logs");
      const data = await response.json();
      setpast7Logs(data["past7Logs"]);
    }

    const fetchTimeInBedPast7Logs = async () => {
      const response = await fetch(baseurl + "/api/get-time-asleep-past-7-logs");
      const data = await response.json();
      setTimeInBedPast7Logs(data["sleepTime7Logs"]);
    }

    const fetchLast7LogsSteps = async () => {
      const response = await fetch(baseurl + "/api/get-steps-last-7-logs");
      const data = await response.json();
      setLast7LogsSteps(data["steps7Logs"]);
    }
    
    const fetchLast7LogsSleepQuality = async () => {
      const response = await fetch(baseurl + "/api/get-sleep-quality-last-7-logs");
      const data = await response.json();
      setLast7LogsSleepQuality(data["sleepQuality7Logs"]);
    }

  fetchPast7Logs();
  fetchTimeInBedPast7Logs();
  fetchLast7LogsSteps();
  fetchLast7LogsSleepQuality();
  }, [])


  return (
  <ScrollView style={{flex: 1,}}>
    <Text style={styles.stats_container}>Sleep Time</Text>
    <LineChartStats 
      label={past7Logs}
      data={timeInBedPast7Logs}
      legend={"Time (hours)"}
      max={8}
      />
        <Text style={styles.average_text_label}> Averages over 7 and 30 days </Text>
      <ShowSleepStatsContainer/>
    <Text style={styles.stats_container}>Steps</Text>
    <LineChartStats
      label={past7Logs}
      data={last7LogsSteps}
      legend={"Steps"}
      max={10000}
      />
      <Text style={styles.average_text_label}> Averages over 7 and 30 days </Text>
      <ShowActivityStatsContainer/>
    <Text style={styles.stats_container}> Sleep Quality </Text>
    <LineChartStats
      label={past7Logs}
      data={last7LogsSleepQuality}
      legend={"Sleep Quality"}
      max={100}
      />
        <Text style={styles.average_text_label}> Averages over 7 and 30 days </Text>

      <ShowSleepQualityStatsContainer/>
  </ScrollView>
  )
}

const StatScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      <StatusBar style="auto" />
      <Text style={styles.date_container}>
        Statistics
      </Text>

      <TestStats/>
      
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
    backgroundColor: 'white',
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
    paddingBottom: "1%",
    fontWeight: "900",
    fontSize: 30,
  },
  stats_container: {
    flex: 0,
    textAlign: "center",
    alignSelf: "stretch",
    paddingBottom: "1%",
    fontWeight: "900",
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',  
    justifyContent: "space-around",
    paddingBottom: "2%",
  },
  box: {
    flexDirection: 'column',
    flexWrap: "wrap",
    width: 125,
    height: 75,
    justifyContent: "center",
    borderRadius: 16,
  },
  inside_box:{
    flexDirection: "row",
    justifyContent: "center",
  },
  average_text_label:{
    textAlign: "center",
    fontSize: 15, 
    paddingBottom: "2%"
  }

});
export { StatScreen };
