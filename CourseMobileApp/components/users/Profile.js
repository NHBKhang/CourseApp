import { memo, useContext } from "react";
import { View, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";
import MyStyles from "../../styles/MyStyles";

const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.subject}>THÔNG TIN NGƯỜI DÙNG</Text>
            <Image source={{ uri: user.image }} style={[MyStyles.avatar, MyStyles.margin]} />
            <Text style={MyStyles.subject}>Chào {user.username}!</Text>
            <Button icon="logout" onPress={() => dispatch({ "type": "logout" })}>ĐĂNG XUẤT</Button>
        </View>
    );
}

export default memo(Profile);