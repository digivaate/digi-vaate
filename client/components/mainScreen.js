import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Row} from 'antd';
import {Link} from "react-router-dom";

class MainScreen extends Component {

    render() {
        return (
            <Fragment>
                <Row type={'flex'} justify="start" gutter={30}>
                    <Col>
                        <Link to={'/products'}>
                            <Card
                                title={'Products'}
                                hoverable={true}
                                headStyle={{border: 'none'}}
                                style={{width: 300}}>

                            </Card>
                        </Link>
                    </Col>
                    <Col>
                        <Link to={'/seasons'}>
                            <Card
                                title={"Seasons"}
                                hoverable={true}
                                headStyle={{border: 'none'}}
                                style={{width: 300}}>

                            </Card>
                        </Link>
                    </Col>
                    <Col>
                        <Link to={'/'}>
                            <Card
                                title={'Collections'}
                                hoverable={true}
                                headStyle={{border: 'none'}}
                                style={{width: 300}}>

                            </Card>
                        </Link>
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

export default MainScreen;