import moment from 'moment';
import React, { memo } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { Button, Card, Chip, List, TextInput } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import APIs, { endpoints } from '../../configs/APIs';
import MyStyles from "../../styles/MyStyles";
import { isCloseToBottom } from '../utils/Utils';

const LessonDetails = ({ route }) => {
    const [lesson, setLesson] = React.useState(null);
    const [comments, setComments] = React.useState(null);
    const lessonId = route.params?.lessonId;
    const [content, setContent] = React.useState("");
    const { width } = useWindowDimensions();

    const loadLesson = async () => {
        try {
            let res = await APIs.get(endpoints['lesson-detail'](lessonId));
            setLesson(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    const loadComments = async () => {
        try {
            let res = await APIs.get(endpoints['comments'](lessonId));
            setComments(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(() => {
        loadLesson();
    }, [lessonId]);

    const loadMoreInfo = ({ nativeEvent }) => {
        if (!comments && isCloseToBottom(nativeEvent)) {
            loadComments();
        }
    }

    return (
        <View style={MyStyles}>
            <ScrollView onScroll={loadMoreInfo}>
                {lesson === null ? <ActivityIndicator /> : <>
                    <Card>
                        <Card.Title title={lesson.subject} titleStyle={MyStyles.subject} />
                        <Card.Cover source={{ uri: lesson.image }} />
                        <Card.Content>
                            <View style={MyStyles.row}>
                                {lesson.tags.map(t => <Chip icon='tag' style={MyStyles.margin} key={t.id}>{t.name}</Chip>)}
                            </View>
                            {/* <Text variant="titleLarge">{lesson.subject}</Text> */}
                            <Text variant="bodyMedium">
                                <RenderHTML contentWidth={width} source={{ html: lesson.content }} />
                            </Text>
                        </Card.Content>

                    </Card>
                </>}
                <View>
                    <TextInput style={MyStyles.margin} multiline={true} label="Nội dung bình luận..." value={content} onChangeText={setContent} />
                    <View style={[MyStyles.row, { justifyContent: "flex-end" }]}>
                        <Button style={MyStyles.margin} textColor="white" buttonColor='blue' icon="comment">Thêm bình luận</Button>
                    </View>
                </View>
                <View>
                    {comments && <>
                        {comments.map(c => <List.Item key={c.id}
                            title={c.content}
                            description={moment(c.created_date).fromNow()}
                            left={() => <Image source={{ uri: c.user.image }} style={MyStyles.avatar} />}
                        />)}
                    </>}
                </View>
            </ScrollView>
        </View>
    );
}

export default memo(LessonDetails);