import { View, Text, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, HelperText, TextInput, TouchableRipple } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import * as ImagePicker from 'expo-image-picker';
import { memo, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const fields = [{
        label: "Tên",
        icon: "text",
        field: "first_name"
    }, {
        label: "Họ và tên lót",
        icon: "text",
        field: "last_name"
    }, {
        label: "Tên đăng nhập",
        icon: "text",
        field: "username"
    }, {
        label: "Mật khẩu",
        icon: "eye",
        field: "password",
        secureTextEntry: true
    }, {
        label: "Xác nhận mật khẩu",
        icon: "eye",
        field: "confirm",
        secureTextEntry: true
    }];
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const nav = useNavigation();

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("iCourseApp", "Permissions Denied!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled)
                change('avatar', res.assets[0]);
        }
    }

    const change = (field, value) => {
        setUser(current => {
            return { ...current, [field]: value }
        })
    }

    const register = async () => {
        if (user.password !== user.confirm)
            setErr(true);
        else {
            setErr(false);
            setLoading(true);
            try {
                let form = new FormData();

                for (let f in user)
                    if (f !== 'confirm')
                        if (f === 'avatar')
                            form.append(f, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: user.avatar.type
                            });
                        else
                            form.append(f, user[f]);

                let res = await APIs.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201)
                    nav.navigate('Login');
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={MyStyles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView>
                    <Text style={MyStyles.subject}>ĐĂNG KÝ NGƯỜI DÙNG</Text>

                    {fields.map(f => <TextInput value={user[f.field]} onChangeText={t => change(f.field, t)} key={f.field} style={MyStyles.margin} label={f.label} secureTextEntry={f.secureTextEntry} right={<TextInput.Icon icon={f.icon} />} />)}

                    <TouchableRipple onPress={picker}>
                        <Text style={MyStyles.margin}>Chọn ảnh đại diện...</Text>
                    </TouchableRipple>

                    {user.avatar && <Image style={[MyStyles.avatar, MyStyles.margin]} source={{ uri: user.avatar.uri }} />}

                    <HelperText type="error" visible={err}>
                        Mật khẩu KHÔNG khớp!
                    </HelperText>

                    <Button loading={loading} onPress={register} style={MyStyles.margin} mode="contained" icon="account">ĐĂNG KÝ</Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

export default memo(Register);