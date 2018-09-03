import React, {Component} from "react";
import axios from 'axios';
import {Card,Icon,  Select,} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import FormData from 'form-data';

class SingleProductImg extends Component{
    constructor(props){
        super(props);
        this.state = {
            singleProductImg: this.props.singleProductImg,
            productName: this.props.productName
        }
    }

    onFileChange = (e) => {
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/product/image?name=${this.state.productName}`, data)
            .then(() => {
                axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                    .then(response => {
                        this.setState({
                            singleProductImg: response.data[0].imagePath
                        });
                    });
            })
    };

    render(){
        let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
        let changeImgBtn = <div style={{height:40}}></div>;
        if(this.props.editModeStatus === true) {
            changeImgBtn = <div className="upload-btn-wrapper">
                <input type="file" name="file" onChange={this.onFileChange}/>
                <button className="btn-upload"><Icon type="upload"/></button>
            </div>;
        }
        if (this.state.singleProductImg !== null) {
            imgUrl = `${API_ROOT}/${this.state.singleProductImg}`
        }
        return (
            <div className="img-container">
                {changeImgBtn}
                <img alt="example" className="product-big-ava-img" src={`${imgUrl}`}/>
            </div>
        )
    }
}

export default SingleProductImg;
