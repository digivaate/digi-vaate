import React, {Component} from "react";
import axios from 'axios';
import {Icon} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import FormData from 'form-data';
import createAxiosConfig from "../../createAxiosConfig";
import Image from "../Image";

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
        axios.patch(`${API_ROOT}/product/image?id=${this.props.productId}`, data)
            .then(() => {
                axios.get(`${API_ROOT}/product?id=${this.props.productId}`)
                    .then(response => {
                        this.setState({
                            singleProductImg: response.data[0].imageId
                        });
                    });
            })
    };

    render(){
        let imgUrl = null;
        let changeImgBtn = <div style={{height:40}}></div>;
        if(this.props.editModeStatus === true) {
            changeImgBtn = <div className="upload-btn-wrapper">
                <input type="file" name="file" onChange={this.onFileChange}/>
                <button className="btn-upload"><Icon type="upload"/></button>
            </div>;
        }
        if (this.state.singleProductImg) {
            imgUrl = `${API_ROOT}/image?id=${this.state.singleProductImg}`
        }
        return (
            <React.Fragment>
            {changeImgBtn}
            <div className="single-product-img-container">
                
                { imgUrl ?
                    <Image alt="example" classNameCSS="product-big-ava-img" url={`${imgUrl}`}/> :
                    <div className="product-big-ava-no-img">
                        <div className="no-image-text">
                            NO IMAGE AVAILABLE
                        </div>
                    </div>
                }
            </div>
            </React.Fragment>
        )
    }
}

export default SingleProductImg;
