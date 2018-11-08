import React, {Component} from "react";
import axios from 'axios';
import {Icon} from 'antd';
import {API_ROOT} from '../../api-config';
import './materials.css'
import FormData from 'form-data';

class SingleMaterialImg extends Component{
    constructor(props){
        super(props);
        this.state = {
            singleMaterialImg: this.props.loadedMaterial.imageId,
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
        if (this.state.singleMaterialImg) {
            imgUrl = `${API_ROOT}/image?id=${this.state.singleMaterialImg}`
        }
        return (
            <div className="img-container">
                {changeImgBtn}
                {
                    imgUrl ?
                        <img className="single-material-big-ava-img" src={imgUrl} /> :
                        <div className="single-material-big-ava-no-img">
                            <div className="no-image-text">
                                NO IMAGE AVAILABLE
                            </div>
                        </div>
                }

            </div>
        )
    }
}

export default SingleMaterialImg;
