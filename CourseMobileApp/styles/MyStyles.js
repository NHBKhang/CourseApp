import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
    }, subject: {
        fontSize: 25,
        fontWeight: "bold",
        color: "blue",
        width: '100%',
        padding: 15
    }, row: {
        flexDirection: "row"
    }, wrap: {
        flexWrap: "wrap"
    }, margin: {
        margin: 5
    }, avatar: {
        width: 80,
        height: 80,
        borderRadius: 20
    }
});