import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  FlatList,
  StyleSheet,
} from 'react-native';

//const ip = "http://192.168.1.143:5000/"
const ip = "http://169.234.25.4:5000/"
/*
  const [sleepRecs, setSleepRecs] = useState(null)

  useEffect(() => {
    const fetchSleepRecs = async () => {
      const response = await fetch(ip + "/api/sleep-rec-list");
      const data = await response.json();
      setSleepRecs(data["sleepRecList"])
    }
    
    fetchSleepRecs();
  }, []);
*/

const RecItem = ({ content }) => {
  return (
    <View style={styles.recItemContainer}>
      <Text>{ content }</Text>
    </View>
  );
}

const CategoryList = ({ title, recList }) => {
  return (
    <FlatList 
      data={recList}
      renderItem={({ item }) => <RecItem content={item} />}
      contentContainerStyle={styles.categoryList}
      style={{ width: "100%" }}
      ListHeaderComponent={() => (
        <Text style={styles.categoryHeader}>
          {title}
        </Text>
      )}
    />
  );  
}

const SleepRecList = () => {
  const [sleepRecs, setSleepRecs] = useState(null)

  useEffect(() => {
    const fetchSleepRecs = async () => {
      const response = await fetch(ip + "/api/sleep-rec-list");
      const data = await response.json();
      setSleepRecs(data["sleepRecList"])
    }
    
    fetchSleepRecs();
  }, []);
  
  return (
    <CategoryList title="Sleep" recList={sleepRecs}/>
  );
}

const DietRecList = () => {
  const [dietRecs, setDietRecs] = useState(null)

  useEffect(() => {
    const fetchDietRecs = async () => {
      const response = await fetch(ip + "/api/diet-rec-list");
      const data = await response.json();
      setDietRecs(data["dietRecList"])
    }
    
    fetchDietRecs();
  }, []);
  
  return (
    <CategoryList title="Diet" recList={dietRecs}/>
  );
}

const ExerciseRecList = () => {
  const [exerciseRecs, setExerciseRecs] = useState(null)

  useEffect(() => {
    const fetchExerciseRecs = async () => {
      const response = await fetch(ip + "/api/exercise-rec-list");
      const data = await response.json();
      setExerciseRecs(data["exerciseRecList"])
    }
    
    fetchExerciseRecs();
  }, []);
  
  return (
    <CategoryList title="Exercise" recList={exerciseRecs}/>
  );
}

const RecScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>
        Recommendations
      </Text>
      <SleepRecList />
      <DietRecList />
      <ExerciseRecList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    fontWeight: "900",
    fontSize: 30,
    marginTop: 50
  },
  categoryList: {
    flexGrow: 1,
    marginTop: 10
  },
  categoryHeader: {
    alignSelf: "center",
    fontWeight: "900",
    fontSize: 20
  },
  recItemContainer: {
    alignSelf: "stretch",
    backgroundColor: "#c4c4c4",
    borderRadius: 10,
    margin: 5,
    padding: 5
  }
});

export { RecScreen };
