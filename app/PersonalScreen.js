import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';

// TODO - replace 'localhost' by doing the following
// 1. cd to Good-Night/app/
// 2. run expo start
// 3. find the ip address directly below the QR code
// 4. replace 'localhost' with everything between
//    'exp://' and ':' from the ip below the QR code

const ip = "http://localhost:5000/"

const BtnGroup = ({ label, values, selectedValue, setSelectedValue }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>
        {label}
      </Text>
      <View style={styles.btnGroup}>
        {values.map(value => (
          <TouchableOpacity
            key={value}
            onPress={() => setSelectedValue(value)}
            style={[styles.btn, selectedValue === value && styles.selectedBtn]}
          >
            <Text style={[styles.btnText, selectedValue === value && styles.selectedBtnText]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const PersonalScreen = ({ navigation }) => {
  const [gender, setGender] = useState("Male");
  const [diet, setDiet] = useState("Non-Vegetarian");
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  
  useEffect(() => {
    const fetchPersonalData = async () => {
      const response = await fetch(ip + "/api/personal-data");
      const data = await response.json();
      setGender(data["gender"]);
      setDiet(data["diet"]);
      setHeight(data["height"]);
      setWeight(data["weight"]);
      setAge(data["age"]);
    }

    fetchPersonalData();
  }, []);

  const updatePersonalData = async () => {
    const response = await fetch(ip + "/api/personal-data-update", {
      method: "POST",
      body: JSON.stringify({
        gender: gender,
        diet: diet,
        height: height,
        weight: weight,
        age: age
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }) 
      .then((response) => response.json())
      .then((json) => console.log(json))
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      enabled={false}
    >
      <StatusBar style="auto" />
      <Text style={styles.date_container}>
        Personal
      </Text>
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Height (cm)</Text>
        <TextInput 
          style={styles.input} 
          onChangeText={setHeight} 
          value={height.toString()}
        />
        <Text style={styles.inputLabel}>Weight (kg)</Text>
        <TextInput 
          style={styles.input} 
          onChangeText={setWeight} 
          value={weight.toString()}
        />
        <Text style={styles.inputLabel}>Age</Text>
        <TextInput 
          style={styles.input} 
          onChangeText={setAge} 
          value={age.toString()}
        />
        <BtnGroup 
          label={"Gender"}
          values={[
            "Male", 
            "Female"
          ]}
          selectedValue={gender}
          setSelectedValue={setGender}
        />
        <BtnGroup 
          label={"Diet"}
          values={[
            "Non-Vegetarian",
            "Vegetarian"
          ]}
          selectedValue={diet}
          setSelectedValue={setDiet}
        />
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={updatePersonalData}
        >
          <Text>{"Update"}</Text>
        </TouchableOpacity>
      </View>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: "10%",
    fontWeight: "900",
    fontSize: 30,
  },
  formContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  btn: {
    margin: 2,
    width: "32%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: "#c4c4c4"
  },
  updateBtn: {
    margin: 2,
    width: "32%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: "limegreen"
  },
  selectedBtn: {
    backgroundColor: "deepskyblue"
  },
  btnText: {
    color: "black"
  },
  selectedBtnText: {
    color: "white"
  },
  inputLabel: {
    fontWeight: "600",
    fontSize: 18,
    margin: 5
  },
  btnGroup: {
    flex: 1,
    flexWrap: "wrap",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    padding: 10
  }
});

export { PersonalScreen };
