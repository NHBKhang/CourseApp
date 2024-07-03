import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from 'react-native-paper';
import APIs, { endpoints } from '../../configs/APIs';
import MyStyles from "../../styles/MyStyles";
import Item from '../utils/Item';

const Lesson = ({ navigation, route }) => {
    const [lessons, setLessons] = React.useState(null);
    const courseId = route.params?.courseId;

    const loadLessons = async () => {
        try {
            let res = await APIs.get(endpoints['lessons'](courseId));
            setLessons(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(() => {
        loadLessons();
    }, [courseId]);


    return (
        <View style={MyStyles.container}>
            {lessons === null ? <ActivityIndicator /> : <>
                {lessons.map(l => <TouchableOpacity key={l.id} onPress={() => navigation.navigate('LessonDetails', { 'lessonId': l.id })}>
                    <Item instance={l} />
                </TouchableOpacity>)}
            </>}
        </View>
    );
}

export default memo(Lesson);