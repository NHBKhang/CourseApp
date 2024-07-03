import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { memo, useContext, useState } from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Button, TextInput } from "react-native-paper";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { MyDispatchContext } from "../../configs/Context";
import MyStyles from "../../styles/MyStyles";

const Login = () => {
    const fields = [{
        label: "Tên đăng nhập",
        icon: "text",
        field: "username"
    }, {
        label: "Mật khẩu",
        icon: "eye",
        field: "password",
        secureTextEntry: true
    }];
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();

    const change = (field, value) => {
        setUser(current => {
            return { ...current, [field]: value }
        })
    }

    const login = async () => {
        setLoading(true);
        try {
            let res = await APIs.post(endpoints['login'], {
                ...user,
                'client_id': 'Vbe8euZZQJoWJ2UzW9wDThg4hJEZHHbhFmnfj7UR',
                'client_secret': 'cVm4w4hSdy4MtwbP4KuNgXkGPeQJ9yrQdBvXHGR6b3e97F2bYqQ81XJ49FEufzjcw4SKwpuOZQiCLsNelHY1MkuYTGBRcSqtWmSlebSUk27WfyDskCB2VeCQihnEKdZ2',
                'grant_type': 'password'
            });
            console.info(res.data);
            AsyncStorage.setItem('token', res.data.access_token);

            setTimeout(async () => {
                let user = await authApi(res.data.access_token).get(endpoints['current-user']);
                console.info(user.data);

                dispatch({
                    "type": "login",
                    "payload": user.data
                });

                nav.navigate("Home");
            }, 100);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={MyStyles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView style={{ width: '100%' }}>
                    <Text style={MyStyles.subject}>ĐĂNG NHẬP NGƯỜI DÙNG</Text>

                    {fields.map(f => <TextInput value={user[f.field]} onChangeText={t => change(f.field, t)} key={f.field} style={MyStyles.margin} label={f.label} secureTextEntry={f.secureTextEntry} right={<TextInput.Icon icon={f.icon} />} />)}

                    <Button loading={loading} onPress={login} style={MyStyles.margin} mode="contained" icon="account">ĐĂNG NHẬP</Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

export default memo(Login);