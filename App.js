import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import firestore from "@react-native-firebase/firestore"
import { DataTable, PaperProvider } from 'react-native-paper';

//CONTEXT
const AppContext = createContext(
    {
        username: '',
        setUsername: (username) => { },
        password: '',
        setPassword: (password) => { },
        isLoggedIn: false,
        setIsLoggedIn: (isLoggedIn) => { },
        name: '',
        setName: (name) => { },
        place: '',
        setPlace: (place) => { },
        thing: '',
        setThing: (thing) => { }
    }
)

//APP
const App = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [place, setPlace] = useState('')
    const [thing, setThing] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const value = { username, setUsername, password, setPassword, isLoggedIn, setIsLoggedIn, name, setName, place, setPlace, thing, setThing }
    return (
        <AppContext.Provider value={value}>
            <AppNavigation />
        </AppContext.Provider>
    )
}
//FIREBASE
const db = firestore()

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
    const { username, password, setUsername, setPassword } = useContext(AppContext)
    const handleRegister = () => {
        setUsername('')
        setPassword('')
        const userData = {
            username: username,
            password: password
        }
        db.collection("Users").add(userData)
        navigation.navigate("Login")
        console.log(username)
        console.log(password)
    }
    return (
        <SafeAreaView>
            <View style={styles.contentContainer}>
                <BaseInput label={"New Username"} onValueChange={setUsername} />
                <PwdInput label={"New Password"} onValueChange={setPassword} />
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
    const { setUsername, setPassword, setIsLoggedIn, username: storedUsername, password: storedPassword } = useContext(AppContext)
    const handleLogin = async () => {
        setIsLoggedIn(true)
        setUsername('')
        setPassword('')
        const fetchdata = db.collection("Users").onSnapshot(snapshot => {
            let found = false
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.username === storedUsername && data.password === storedPassword) {
                    found = true
                    navigation.navigate("Dashboard");
                    return
                }
            });
            if (!found) {
                Alert.alert('Login Failed', 'Username or Password is incorrect');
            }
        }, error => {
            console.error('Error fetching users:', error);
        });
    }
    return (
        <SafeAreaView>
            <View style={styles.contentContainer}>
                <BaseInput label={"Username"} onValueChange={setUsername} />
                <PwdInput label={"Password"} onValueChange={setPassword} />
                <AppButton btnText={"LOGIN"} onPress={handleLogin} />
            </View>
        </SafeAreaView>
    )
}
function DashScreen() {
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
            },
            testInputs: {
                marginTop: 150
            },
            tableContainer: {
                width: "75%"
            },
            tableHeader: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: "#000000",
                padding: 6.9
            },
            headerText: {
                color: "#ffffff",
                fontSize: 16
            },
            row: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: "#ffffff",
                padding: 10,
                borderBlockColor: "#000000",
                borderWidth: 1
            },
            cell: {
                color: "#000000"
            }
        }
    )
    const navigation = useNavigation()
    const { setIsLoggedIn, setName, setPlace, setThing, name, place, thing } = useContext(AppContext)
    const handleLogout = () => {
        setIsLoggedIn(false)
        navigation.navigate("Home")
    }
    const handleFormSubmit = () => {
        setName('')
        setPlace('')
        setThing('')
        const testData = {
            name: name,
            place: place,
            thing: thing
        }
        db.collection("TestData").add(testData)
    }
    
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await firestore().collection('TestData').get();
                const fetchedData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log(fetchedData)
                setData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const unsubscribe = firestore().collection('TestData').onSnapshot((snapshot) => {
            const updatedData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(updatedData);
        });

        return () => unsubscribe();
    }, []);
    const renderItem = ({item}) => {
        return(
            <View style={styles.row}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.place}</Text>
                <Text style={styles.cell}>{item.thing}</Text>
            </View>
        )
    }
    return (
        <SafeAreaView>
            <View style={styles.contentContainer}>
                <View style={styles.navBar}>
                    <Logout onPress={handleLogout} />
                </View>
                    <View style={styles.testInputs}>
                        <BaseInput label={"Name"} onValueChange={setName} />
                        <BaseInput label={"Place"} onValueChange={setPlace} />
                        <BaseInput label={"Thing"} onValueChange={setThing} />
                        <AppButton btnText={"SUBMIT"} onPress={handleFormSubmit} />
                    </View>
                    <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerText}>Name</Text>
                                <Text style={styles.headerText}>Place</Text>
                                <Text style={styles.headerText}>Things</Text>
                            </View>
                            <FlatList 
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index)  => index.toString()}
                            />
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