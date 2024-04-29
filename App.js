import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useContext, useState } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

//CONTEXT
const AppContext = createContext(
    {
        username: '',
        setUsername: (username) => { },
        password: '',
        setPassword: (password) => { },
        isLoggedIn: false,
        setIsLoggedIn: (isLoggedIn) => { }
    }
)

//APP
const App = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const value = { username, setUsername, password, setPassword, isLoggedIn, setIsLoggedIn }
    return (
        <AppContext.Provider value={value}>
            <AppNavigation />
        </AppContext.Provider>
    )
}

//NAVIGATION
const Stack = createNativeStackNavigator()
const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Dashboard" component={DashScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

//SCREENS
function HomeScreen({ navigation }) {
    const { width, height } = Dimensions.get("screen")
    const styles = StyleSheet.create(
        {
            contentContainer: {
                backgroundColor: "#EEFEEE",
                width: width,
                height: height,
                justifyContent: "center",
                alignItems: "center"
            }
        }
    )
    const { isLoggedIn } = useContext(AppContext)
    return (
        <SafeAreaView>
            <View style={styles.contentContainer}>
                {!isLoggedIn && (
                        <>
                            <AppButton btnText={"REGISTER"} onPress={() => navigation.navigate("Register")} />
                            <AppButton btnText={"LOGIN"} onPress={() => navigation.navigate("Login")} />
                        </>
                    )}
                {isLoggedIn && <DashScreen />}
            </View>
        </SafeAreaView>
    )
}
function RegisterScreen({ navigation }) {
    const { width, height } = Dimensions.get("screen")
    const styles = StyleSheet.create(
        {
            contentContainer: {
                backgroundColor: "#EEFEEE",
                width: width,
                height: height,
                justifyContent: "center",
                alignItems: "center"
            }
        }
    )
    const {username, password, setUsername, setPassword} = useContext(AppContext)
    const handleRegister = () => {
        setUsername('')
        setPassword('')
        navigation.navigate("Login")
        console.log(username)
        console.log(password)
    }
    return (
        <SafeAreaView>
            <View style={styles.contentContainer}>
                <BaseInput label={"New Username"} onValueChange={setUsername}/>
                <PwdInput label={"New Password"} onValueChange={setPassword}/>
                <AppButton btnText={"REGISTER"} onPress={handleRegister} />
            </View>
        </SafeAreaView>
    )
}
function LoginScreen({ navigation }) {
    const { width, height } = Dimensions.get("screen")
    const styles = StyleSheet.create(
        {
            contentContainer: {
                backgroundColor: "#EEFEEE",
                width: width,
                height: height,
                justifyContent: "center",
                alignItems: "center"
            }
        }
    )
    const {setUsername, setPassword, setIsLoggedIn} = useContext(AppContext)
    const handleLogin = () => {
        setIsLoggedIn(true)
        setUsername('')
        setPassword('')
        navigation.navigate("Dashboard")
    }
    return (
        <SafeAreaView>
            <View style={styles.contentContainer}>
                <BaseInput label={"Username"} onValueChange={setUsername}/>
                <PwdInput label={"Password"} onValueChange={setPassword}/>
                <AppButton btnText={"LOGIN"} onPress={handleLogin} />
            </View>
        </SafeAreaView>
    )
}
function DashScreen({ navigation }) {
    const { width, height } = Dimensions.get("screen")
    const styles = StyleSheet.create(
        {
            contentContainer: {
                backgroundColor: "#EEFEEE",
                width: width,
                height: height,
                alignItems: "center"
            },
            navBar: {
                width: width,
                height: 100,
                backgroundColor: "#233021",
                justifyContent: "center",
                alignItems: "flex-end",
                paddingEnd: 30
            }
        }
    )
    const {setIsLoggedIn} = useContext(AppContext)
    const handleLogout = () => {
        setIsLoggedIn(false)
        navigation.popToTop()
    }
    return (
        <SafeAreaView>
            <View style={styles.contentContainer}>
                <View style={styles.navBar}>
                    <Logout onPress={handleLogout} />
                </View>
            </View>
        </SafeAreaView>
    )
}

//COMPONENTS
const AppButton = ({ btnText, onPress }) => {
    const styles = StyleSheet.create(
        {
            button: {
                backgroundColor: "#233021",
                height: 46,
                width: 268,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                marginBottom: 20,
                marginTop: 20
            },
            btnText: {
                color: "#FFFFFF",
                fontSize: 15
            }
        }
    )
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.btnText}>{btnText}</Text>
        </TouchableOpacity>
    )
}
const BaseInput = ({ label, onValueChange }) => {
    const styles = StyleSheet.create(
        {
            container: {
                alignItems: "flex-start",
                marginBottom: 10
            },
            input: {
                height: 46,
                width: 268,
                borderRadius: 10,
                borderColor: "#233021",
                borderWidth: 1,
                backgroundColor: "#ffffff"
            },
            label: {
                fontSize: 14,
                color: "#233021",
                marginBottom: 5
            }
        }
    )
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} onChangeText={onValueChange}></TextInput>
        </View>
    )
}
const PwdInput = ({ label, onValueChange }) => {
    const styles = StyleSheet.create(
        {
            container: {
                alignItems: "flex-start",
                marginBottom: 10
            },
            input: {
                height: 46,
                width: 268,
                borderRadius: 10,
                borderColor: "#233021",
                borderWidth: 1,
                backgroundColor: "#ffffff"
            },
            label: {
                fontSize: 14,
                color: "#233021",
                marginBottom: 5
            }
        }
    )
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} onChangeText={onValueChange}></TextInput>
        </View>
    )
}
const Logout = ({ onPress }) => {
    const styles = StyleSheet.create(
        {
            button: {
                height: 30,
                width: 30
            }
        }
    )
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Image source={require("./assets/logout.png")}></Image>
        </TouchableOpacity>
    )
}

export default App;