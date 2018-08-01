import React,{Component} from 'react';
import axios from 'axios';
import {Col,Row,Anchor,Spin,List,Button,Divider,Icon} from 'antd'
import {Redirect} from 'react-router-dom'
import {API_ROOT} from '../../api-config'
import './orders.css'
const { Link } = Anchor;


class SingleOrder extends Component{
    constructor(props){
        super(props);
        this.state = {
            singleOrder: null,

        };
    }

    componentDidMount(){
        console.log(this.props)
        axios.get(`${API_ROOT}/order?id=${this.props.match.params.orderId}`)
            .then(response => {
                this.setState({
                    singleOrder: response.data[0]
                })
            })
    }

    render(){
        if(this.state.singleOrder){
            return(
                <div>
                    <p>Order ID: {this.state.singleOrder.id}</p>
                    <p>Order price total: {this.state.singleOrder.price}</p>
                </div>
            )
        } else {
            return <Spin/>
        }

    }
}

export default SingleOrder