import { View, Text, ActivityIndicator, Image, ScrollView, TouchableOpacity } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { memo } from 'react';
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, List, Searchbar } from "react-native-paper";
import Item from "../utils/Item";
import { isCloseToBottom } from "../utils/Utils";

const Course = ({ navigation }) => {
    const [categories, setCategories] = React.useState(null);
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [q, setQ] = React.useState("");
    const [cateId, setCateId] = React.useState("");
    const [page, setPage] = React.useState(1);

    const loadCates = async () => {
        try {
            let res = await APIs.get(endpoints['categories']);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    const loadCourses = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endpoints['courses']}?q=${q}&category_id=${cateId}&page=${page}`;
                let res = await APIs.get(url);

                if (res.data.next === null)
                    setPage(0);

                if (page === 1)
                    setCourses(res.data.results);
                else
                    setCourses(current => {
                        return [...current, ...res.data.results];
                    });
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    React.useEffect(() => {
        loadCates();
    }, []);

    React.useEffect(() => {
        loadCourses();
    }, [q, cateId, page]);

    const loadMore = ({ nativeEvent }) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    }


    const search = (value, callback) => {
        setPage(1);
        callback(value);
    }

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <View style={[MyStyles.row, MyStyles.wrap]}>
                <Chip mode={!cateId ? "outlined" : "flat"} onPress={() => search("", setCateId)} style={MyStyles.margin} icon="shape-plus">Tất cả</Chip>
                {categories === null ? <ActivityIndicator /> : <>
                    {categories.map(c => <Chip mode={c.id === cateId ? "outlined" : "flat"} key={c.id} onPress={() => search(c.id, setCateId)} style={MyStyles.margin} icon="shape-plus">{c.name}</Chip>)}
                </>}
            </View>
            <View>
                <Searchbar placeholder="Nhập từ khóa..." onChangeText={(t) => search(t, setQ)} value={q} />
            </View>
            <ScrollView onScroll={loadMore}>
                {loading && <ActivityIndicator />}
                {courses.map(c => <TouchableOpacity key={c.id} onPress={() => navigation.navigate('Lesson', { 'courseId': c.id })}>
                    <Item instance={c} />
                </TouchableOpacity>)}
            </ScrollView>
        </View>
    );


};

export default memo(Course);