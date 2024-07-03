import { Image } from "react-native";
import { List } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import moment from 'moment';
import { memo } from "react";

const Item = ({instance}) => {
    return (
        <List.Item title={instance.subject} description={instance.created_date?moment(instance.created_date).fromNow():""} 
                   left={() => <Image style={MyStyles.avatar} source={{uri: instance.image}} />} />
    );
}

export default memo(Item);