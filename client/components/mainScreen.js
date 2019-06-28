import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Row} from 'antd';
import {NavLink} from "react-router-dom";
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
                        <NavLink to={'/products'} activeStyle={{
                            textDecoration:'none'
                        }}>
                            <Card
                                hoverable={true}
                                headStyle={{border: 'none'}}
                                className="mainScreen__card-container"
                            >   
                                <div className="mainScreen__card-title">Products</div>
                                <div className="mainScreen__card-description">Create and edit products and their features.</div>
                            </Card>
                        </NavLink>
                    </Col>
                    <Col>
                        <NavLink to={'/seasons'} activeStyle={{
                            textDecoration:'none'
                        }}>
                            <Card
                                hoverable={true}
                                headStyle={{border: 'none'}}
                                className="mainScreen__card-container"
                            >
                                <div className="mainScreen__card-title">Seasons</div>
                                <div className="mainScreen__card-description">Create and edit seasons and manage collections together with combined budgets.</div>
                            </Card>
                        </NavLink>
                    </Col>
                    <Col>
                        <NavLink to={'/'} activeStyle={{
                            textDecoration:'none'
                        }}>
                            <Card
                                hoverable={true}
                                headStyle={{border: 'none'}}
                                className="mainScreen__card-container-disabled"
                            >
                                <div className="mainScreen__card-title">Customers' collections</div>
                                <div className="mainScreen__card-description">Manage collections for specific customer or purpose. Starting by creating collections - not in function in demo.</div>
                            </Card>
                        </NavLink>
                    </Col>
                </Row>
                </div>
            </Fragment>
        )
    }
}

export default MainScreen;