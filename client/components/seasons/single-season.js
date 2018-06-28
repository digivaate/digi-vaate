import React,{Component} from 'react';
import { List } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';


class SingleSeason extends Component{
    constructor(props){
        super(props);
        this.state={
            isFetched:false
        }
    }
    products=[];
    componentDidMount(){
        axios.get(`${API_ROOT}/season/products?name=${this.props.match.params.id}`)
            .then(response => {
                this.products = response.data;
                console.log(this.products);
            })
            .then(()=>this.setState({isFetched:true}))
    }

    render(){
        let renderProductsOfSeason = [];
        if(this.state.isFetched){
            for(let i=0; i<this.products.length; i++){
                renderProductsOfSeason[i] = this.products[i].name
            }
        }
        if(renderProductsOfSeason.length === 0){
            return (
                <div>
                    <h1>Products of season</h1>
                    <p>This season does not have any products yet.</p>
                </div>
            )
        }
        return (
            <div>
                <h1>Products of season</h1>
                <List
                    size="small"
                    bordered
                    dataSource={renderProductsOfSeason}
                    renderItem={item => (<List.Item>{item}</List.Item>)}
                />
            </div>
        )
    }
}

export default SingleSeason;