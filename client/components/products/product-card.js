import React,{ Component } from "react";
import MaterialCost from './product-card-material-cost'
import SubcontractingCost from './product-card-subcontracting-cost'
import { Row, Col, Input, Button, Modal } from 'antd';
import axios from 'axios';


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
            merchantGrossFit:0,
            taxPercent: 0
        };
        this.products = [];
        this.handleChange = this.handleChange.bind(this);
        this.materialCosts = [];
        this.subcCosts = [];
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    getMC(materialCostData,totalMaterialCost){
        this.materialCosts = materialCostData;
        this.setState({
            materialCost: totalMaterialCost
        });
    }

    getSC(subcontractingCostData,totalSubcontractingCost){
        this.subcCosts = subcontractingCostData;
        this.setState({
            subcontractingCost: totalSubcontractingCost
        });
    }

    loadProduct(){
        this.setState({
            coverAmount: parseFloat(((this.state.materialCost + this.state.subcontractingCost)*(this.state.coverPercentage/100)/(1-(this.state.coverPercentage/100))).toFixed(2)),
            purchasePrice: parseFloat((this.state.materialCost + this.state.subcontractingCost).toFixed(2)),
        });
    }

    saveProduct(){
        const productData = {
            coverPercentage: this.state.coverPercentage,
            materialCost: this.state.materialCost,
            subcontractingCost: this.state.subcontractingCost,
            consumerPriceCommercial:this.state.consumerPriceCommercial,
            merchantGrossFit: this.state.merchantGrossFit,
            styleName: this.state.styleName,
            coverAmount:this.state.coverAmount,
            purchasePrice:this.state.purchasePrice,
            unitPriceWithoutTax: this.unitPriceWithoutTax,
            sellingPriceWithTax : this.sellingPriceWithTax,
            consumerPrice: this.consumerPrice
        };

        const newProduct = {
            name: this.state.styleName,
            taxPercent: parseFloat(this.state.taxPercent),
            resellerProfitPercent: parseFloat(this.state.merchantGrossFit),
            coverPercent: parseFloat(this.state.coverPercentage),
            commercialPrice: parseFloat(this.state.consumerPriceCommercial),
            subcCosts:this.subcCosts,
            materialCosts:this.materialCosts
        };

        axios.post('http://localhost:3000/api/product',newProduct)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
            });

        const modal = Modal.success({
            title: 'Successfully',
            content: 'Product created !',
        });
        setTimeout(() => modal.destroy(), 1200);
    }

    render(){
        this.unitPriceWithoutTax = parseFloat((this.state.coverAmount + this.state.purchasePrice).toFixed(2));
        this.sellingPriceWithTax = parseFloat((this.unitPriceWithoutTax * parseFloat((1 + (this.state.taxPercent/100)).toFixed(2))).toFixed(2));
        this.consumerPrice = parseFloat((this.sellingPriceWithTax / (this.state.merchantGrossFit/100)).toFixed(2));

        return (
            <div>
                <label>
                    Name
                    <Input
                        type="text"
                        name = "styleName"
                        value={this.state.styleName}
                        onChange={this.handleChange}
                    />
                </label>
                <h4>{this.state.styleName}</h4>
                <Row gutter={8}>
                    <Col span={12}>
                        <MaterialCost onGetMC = {(materialCostData,totalMaterialCost) => this.getMC(materialCostData,totalMaterialCost)} />
                    </Col>
                    <Col span={12}>
                        <SubcontractingCost onGetSC = {(subcontractingCostData,totalSubcontractingCost) => this.getSC(subcontractingCostData,totalSubcontractingCost)} />
                    </Col>
                </Row>
                <label>
                    Cover Percentage
                    <Input
                        style={{ width: '20%' }}
                        type="text"
                        name = "coverPercentage"
                        value={this.state.coverPercentage}
                        onChange={this.handleChange}
                    />
                </label>
                <br/>
                <br/>
                <label>
                    Tax Percentage
                    <Input
                        style={{ width: '20%' }}
                        type="text"
                        name = "taxPercent"
                        value={this.state.taxPercent}
                        onChange={this.handleChange}
                    />
                </label>
                <br/>
                <br/>
                <label>
                    Merchant's gross profit percentage
                    <Input
                        style={{ width: '20%' }}
                        type="text"
                        name = "merchantGrossFit"
                        value={this.state.merchantGrossFit}
                        onChange={this.handleChange} />
                </label>
                <br/>
                <p> Cover amount :{this.state.coverAmount}</p>
                <p> Purchase price: {this.state.purchasePrice} </p>
                <p> Selling price without sales taxes: {this.unitPriceWithoutTax} </p>
                <p> Selling price with sales taxes: {this.sellingPriceWithTax} </p>
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