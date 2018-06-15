import React,{ Component } from "react";
import axios from 'axios';
import { Card } from 'antd';


class SingleProduct extends Component{
    state = {
        loadedProduct: null
    };
    componentDidMount(){
        console.log(this.props);
        this.loadProduct();

    }
    componentDidUpdate(){
        console.log(this.props);
        this.loadProduct()
    }
    loadProduct(){
        if(this.props.match.params.id){
            if ( !this.state.loadedProduct || (this.state.loadedProduct._id !== this.props.match.params.id) ) {
                axios.get("/api/product/"+ this.props.match.params.id)
                    .then(response => {
                        this.setState({loadedProduct: response.data});
                        console.log(response.data)
                    })
            }
        }
    }

    render(){
        if(this.state.loadedProduct){
            return(
                <div>
                    <div>
                        <Card title={this.state.loadedProduct.name} style={{ width: 600,height:400 }}>
                            <p>Tax percentage:{this.state.loadedProduct.taxPercent}</p>
                            <p>Reseller Profit Percentage:{this.state.loadedProduct.resellerProfitPercent}</p>
                            <p>Cover percentage: {this.state.loadedProduct.coverPercent}</p>
                            <p>Commercial price:{this.state.loadedProduct.commercialPrice}</p>
                        </Card>
                    </div>
                </div>
            )
        }
        else{
            console.log(this.state.loadedProduct);
            return "Loading..."
        }

    }
}



export default SingleProduct;

