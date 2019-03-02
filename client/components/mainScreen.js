import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Row} from 'antd';
import {Link} from "react-router-dom";
import './mainScreen.css'

class MainScreen extends Component {

    render() {
        return (
            <Fragment>
                <div className="mainScreen__welcome-title">Welcome to Digivaate</div>
                <div className="mainScreen__welcome-description">Digivaate is a tool for managing textile collection planning. You can start by creating products, seasons or collections.</div>
                <div className="mainScreen__cards-area">
                <Row type={'flex'} justify="start" gutter={30}>
                    <Col>
                        <Link to={'/products'}>
                            <Card
                                hoverable={true}
                                headStyle={{border: 'none'}}
                                className="mainScreen__card-container"
                            >   
                                <div className="mainScreen__card-title">Products</div>
                                <div className="mainScreen__card-description">Create and edit products and their features.</div>
                            </Card>
                        </Link>
                    </Col>
                    <Col>
                        <Link to={'/seasons'}>
                            <Card
                                hoverable={true}
                                headStyle={{border: 'none'}}
                                className="mainScreen__card-container"
                            >
                                <div className="mainScreen__card-title">Seasons</div>
                                <div className="mainScreen__card-description">Create and edit seasons and manage collections together with combined budgets.</div>
                            </Card>
                        </Link>
                    </Col>
                    <Col>
                        <Link to={'/'}>
                            <Card
                                hoverable={true}
                                headStyle={{border: 'none'}}
                                className="mainScreen__card-container"
                            >
                                <div className="mainScreen__card-title">Customers' collections</div>
                                <div className="mainScreen__card-description">Manage collections for specific customer or purpose.</div>
                            </Card>
                        </Link>
                    </Col>
                </Row>
                </div>
            </Fragment>
        )
    }
}

export default MainScreen;