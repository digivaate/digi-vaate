import React from "react";
import { Skeleton,Card,Col,Icon,List} from 'antd';
const { Meta } = Card;

const renderInitialCard = (props) => {
    const arrayOfInitialCard = [...new Array(props.numberOfCard)].map(ele => <Col span={6}>
        <div className={props.cardTypeWrapper}>
            <Card
                hoverable
                bodyStyle={props.bodyHeight}
                className={props.cardTypeDisplay}
                cover={<div style={props.coverStyle}></div>}
                actions={[
                    <div>
                        <Icon type="delete" />
                    </div>
                ]}
            >
                <Skeleton loading={true} paragraph={props.numberOfRow}>
                    <Meta
                    />
                </Skeleton>
            </Card>
        </div>
    </Col>);
    return (
        <List
            dataSource={arrayOfInitialCard}
            grid={{gutter: 35, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4}}
            renderItem={item => <List.Item>{item}</List.Item>}
        >
        </List>
    )
};

export default renderInitialCard;