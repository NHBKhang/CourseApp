import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import 'moment/locale/vi';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "./configs/Context";
import { useContext, useReducer } from "react";
import { Course, Lesson, LessonDetails } from "./components/courses";
import { Login, Profile, Register } from "./components/users";
import MyUserReducer from "./configs/Reducer";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Course" component={Course} />
      <Stack.Screen name="Lesson" component={Lesson} />
      <Stack.Screen name="LessonDetails" component={LessonDetails} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MyStack} options={{ title: "Danh mục khóa học", tabBarIcon: () => <Icon source="home" size={30} color="blue" /> }} />

      {user === null ? <>
        <Tab.Screen name="Register" component={Register} options={{ title: "Đăng ký", tabBarIcon: () => <Icon source="account" size={30} color="blue" /> }} />
        <Tab.Screen name="Login" component={Login} options={{ title: "Đăng nhập", tabBarIcon: () => <Icon source="login" size={30} color="blue" /> }} />
      </> : <>
        <Tab.Screen name="Profile" component={Profile} options={{ title: user.username, tabBarIcon: () => <Icon source="login" size={30} color="blue" /> }} />
      </>}

    </Tab.Navigator>
  );
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyTab />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}

export default App;
