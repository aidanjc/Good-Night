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
import { baseurl } from './baseurl'

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

const SignInScreen = ({ navigation }) => {
  const [gender, setGender] = useState("Male");
  const [breakfastCalories, setBreakfastCalories] = useState("")
  const [lunchCalories, setLunchCalories] = useState("")
  const [diet, setDiet] = useState("Non-Vegetarian");
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  
  const clearInput = () => {
    setGender("Male");
    setBreakfastCalories("");
    setLunchCalories("");
    setDiet("Non-Vegetarian");
    setHeight("");
    setWeight("");
    setAge("");
  }

  const submitInput = async () => {
    const response = await fetch(baseurl + "/api/signup", {
      method: "POST",
      body: JSON.stringify({
        gender: gender,
        breakfastCalories: breakfastCalories,
        lunchCalories: lunchCalories,
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
      .then(navigation.navigate('Home'));
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      enabled={false}
    >
      <StatusBar style="auto" />
      <Text style={styles.header}>
        Sign In
      </Text>
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Height (cm)</Text>
        <TextInput 
          style={styles.input} 
          onChangeText={setHeight} 
          value={height}
          placeholder={"Height (cm)"}
        />
        <Text style={styles.inputLabel}>Weight (kg)</Text>
        <TextInput 
          style={styles.input} 
          onChangeText={setWeight} 
          value={weight}
          placeholder={"Weight (kg)"}
        />
        <Text style={styles.inputLabel}>Age</Text>
        <TextInput 
          style={styles.input} 
          onChangeText={setAge} 
          value={age}
          placeholder={"Age"}
        />
        <Text style={styles.inputLabel}>Breakfast Calories (kcals)</Text>
        <TextInput 
          style={styles.input} 
          onChangeText={setBreakfastCalories} 
          value={breakfastCalories}
          placeholder={"Breakfast Calories (kcals)"}
        />
        <Text style={styles.inputLabel}>Lunch Calories (kcals)</Text>
        <TextInput 
          style={styles.input} 
          onChangeText={setLunchCalories} 
          value={lunchCalories}
          placeholder={"Lunch Calories (kcals)"}
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
  container: {
    flex: 1,
    alignItems: "center"
  },
  header: {
    fontWeight: "900",
    fontSize: 20,
    marginTop: 50,
    marginBottom: 10
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

export { SignInScreen };
