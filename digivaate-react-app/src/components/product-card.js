import React,{ Component } from "react";
import MaterialCost from './product-card-material-cost'
import SubcontractingCost from './product-card-subcontracting-cost'
import { Row, Col, Input, Button } from 'antd';


class ProductCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            coverPercentage: 0,
            materialCost: 0,
            subcontractingCost: 0,
            consumerPriceCommercial:0,
            styleName: '',
            coverAmount:0,
            purchasePrice:0,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    getMC(materialCost){
        this.setState({
            materialCost: materialCost
        });
    }

    getSC(subcontractingCost){
        this.setState({
            subcontractingCost: subcontractingCost
        });
    }

    loadProduct(){
        this.setState({
            coverAmount: parseFloat(((this.state.materialCost + this.state.subcontractingCost)*this.state.coverPercentage/(1-this.state.coverPercentage)).toFixed(2)),
            purchasePrice: parseFloat((this.state.materialCost + this.state.subcontractingCost).toFixed(2)),
        });
    }

    saveProduct(){
        const productData = {
            coverPercentage: this.state.coverPercentage,
            materialCost: this.state.materialCost,
            subcontractingCost: this.state.subcontractingCost,
            consumerPriceCommercial:this.state.consumerPriceCommercial,
            styleName: this.state.styleName,
            coverAmount:this.state.coverAmount,
            purchasePrice:this.state.purchasePrice,
            unitPriceWithoutTax: this.unitPriceWithoutTax,
            sellingPriceWithTax : this.sellingPriceWithTax,
            consumerPrice: this.consumerPrice
        };
        console.log(productData);
        this.props.onSaveProduct(productData);
    }

    render(){
        this.unitPriceWithoutTax = parseFloat((this.state.coverAmount + this.state.purchasePrice).toFixed(2));
        this.sellingPriceWithTax = parseFloat((this.unitPriceWithoutTax * 1.24).toFixed(2));
        this.consumerPrice = parseFloat((this.sellingPriceWithTax * 2).toFixed(2));

        return (
            <div>
                <label>
                    Name
                    <Input
                        style={{ width: '20%' }}
                        type="text"
                        name = "styleName"
                        value={this.state.styleName}
                        onChange={this.handleChange} />
                </label>
                <h4>{this.state.styleName}</h4>
                <Row gutter={8}>
                <Col span={12}>
                    <MaterialCost onGetMC = {materialCost => this.getMC(materialCost)} />
                </Col>
                <Col span={12}>
                    <SubcontractingCost onGetSC = {subcontractingCost => this.getSC(subcontractingCost)} />
                </Col>
                </Row>
                <label>
                    Cover Percentage
                    <Input
                        style={{ width: '20%' }}
                        type="text"
                        name = "coverPercentage"
                        value={this.state.coverPercentage}
                        onChange={this.handleChange} />
                </label>
                <p> Cover amount :{this.state.coverAmount}</p>
                <p> Purchase price: {this.state.purchasePrice} </p>
                <p> Selling price without sales taxes: {this.unitPriceWithoutTax} </p>
                <p> Selling price with 24% sales taxes: {this.sellingPriceWithTax} </p>
                <p> Consumer price: {this.consumerPrice} </p>
                <label>
                    Consumer price for commercial
                    <Input
                        style={{ width: '20%' }}
                        type="text"
                        name = "consumerPriceCommercial"
                        value={this.state.consumerPriceCommercial}
                        onChange={this.handleChange} />
                </label>
                <br />
                <Button onClick ={() => this.loadProduct()}> Calculate </Button>
                <Button onClick = {() => this.saveProduct()}> Create </Button>
            </div>
        )
    }
}


export default ProductCard;