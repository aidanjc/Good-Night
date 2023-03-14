import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Platform,
  TextInput,
  Pressable,
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

const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

const BtnGroup = ({ label, values, selectedValue, setSelectedValue }) => {
  return (
    <KeyboardAvoidingView 
      behavior={behavior}
      style={styles.mainContainer}
    >
      <Text style={styles.btnGroupLabel}>
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
    </KeyboardAvoidingView>
  );
}

const SignInScreen = ({ navigation }) => {
  const [gender, setGender] = useState("Male");
  const [dinnerCalories, setDinnerCalories] = useState("Less Than 400");
  const [activityLevel, setActivityLevel] = useState("1 - Sedentary");
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  
  const clearInput = () => {
    setGender("Male");
    setDinnerCalories("Less Than 400");
    setActivityLevel("1 - Sedentary");
    setHeight("");
    setWeight("");
    setAge("");
  }

  const submitInput = async () => {
    const response = await fetch(ip + "/api/signup", {
      method: "POST",
      body: JSON.stringify({
        gender: gender,
        dinnerCalories: dinnerCalories,
        activityLevel: activityLevel,
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
      .then(navigation.navigate('Home'));
  }

  return (
    <KeyboardAvoidingView 
      behavior={behavior}
      style={styles.mainContainer}
    >
      <StatusBar style="auto" />
      <Text style={styles.header}>
        Sign In
      </Text>
      <View style={styles.formContainer}>
        <BtnGroup 
          label={"Gender"}
          values={[
            "Male", 
            "Female"
          ]}
          selectedValue={gender}
          setSelectedValue={setGender}
        />
        <TextInput 
          style={styles.input} 
          onChangeText={setHeight} 
          value={height}
          placeholder={"Height (Inches)"}
        />
        <TextInput 
          style={styles.input} 
          onChangeText={setWeight} 
          value={weight}
          placeholder={"Weight (lbs)"}
        />
        <TextInput 
          style={styles.input} 
          onChangeText={setAge} 
          value={age}
          placeholder={"Age"}
        />
        <BtnGroup
          label={"Dinner Calories"}
          values={[
            "Less Than 400", 
            "Between 400 And 700", 
            "Greater Than 700"
          ]}
          selectedValue={dinnerCalories}
          setSelectedValue={setDinnerCalories}
        />
        <BtnGroup 
          label={"Activity Level"}
          values={[
            "1 - Sedentary", 
            "2 - Lightly Active", 
            "3 - Moderately Active"
          ]}
          selectedValue={activityLevel}
          setSelectedValue={setActivityLevel}
        />
        <View style={styles.btnGroup}>
          <TouchableOpacity 
            style={styles.clearBtn} 
            onPress={clearInput}
          >
            <Text>{"Clear"}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={submitInput}
          >
            <Text>{"Submit"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center"
  },
  header: {
    fontWeight: "900",
    fontSize: 20,
    marginTop: 50
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
  clearBtn: {
    margin: 2,
    width: "32%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: "red"
  },
  submitBtn: {
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
  btnGroupContainer: {
    flex: 1,
    alignItems: "center"
  },
  btnGroupLabel: {
    fontWeight: "600",
    fontSize: 20,
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
    margin: 10,
    padding: 10
  }
});

export { SignInScreen };
