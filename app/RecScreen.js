import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  FlatList,
  StyleSheet,
} from 'react-native';

const ip = "http://192.168.1.143:5000/"
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

const ExampleCategoryList = () => {
  const [exampleSleepRecs, setExampleSleepRecs] = useState(null)

  useEffect(() => {
    const fetchExampleSleepRecs = async () => {
      const response = await fetch(ip + "/api/sleep-rec-list");
      const data = await response.json();
      setExampleSleepRecs(data["sleepRecList"])
    }
    
    fetchExampleSleepRecs();
  }, []);
  
  return (
    <CategoryList title="Example Category" recList={exampleSleepRecs}/>
  );
}

const RecScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>
        Recommendations
      </Text>
      <ExampleCategoryList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  header: {
    fontWeight: "900",
    fontSize: 30,
    marginTop: 50
  },
  categoryList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  categoryHeader: {
    fontWeight: "900",
    fontSize: 20
  },
  recItemContainer: {
    width: "100%",
    backgroundColor: "#c4c4c4",
    borderRadius: 10,
    margin: 5,
    padding: 5
  }
});

export { RecScreen };
