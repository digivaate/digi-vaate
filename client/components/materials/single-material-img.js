import React, {Component} from "react";
import axios from 'axios';
import {Icon} from 'antd';
import {API_ROOT} from '../../api-config';
import './materials.css'
import FormData from 'form-data';
import createAxiosConfig from "../../createAxiosConfig";
import getImage from '../../utils/getImage';
import Image from "../Image";

class SingleMaterialImg extends Component{
    constructor(props){
        super(props);
        this.state = {
            imgId: this.props.loadedMaterial.imageId
        }
    }

    onFileChange = (e) => {
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/material/image?id=${this.state.imgId}`, data)
            .then(() => {
                axios.get(`${API_ROOT}/material?id=${this.state.imgId}`)
                    .then(response => {
                        this.setState({
                            imgId: response.data[0].imageId
                        });
                    })
            })
    };

    render(){
        const imageId = this.state.imgId;
        let changeImgBtn = <div style={{height:40}}></div>;
        if(this.props.editModeStatus === true) {
            changeImgBtn = <div className="upload-btn-wrapper">
                <input type="file" name="file" onChange={this.onFileChange}/>
                <button className="btn-upload"><Icon type="upload"/></button>
            </div>;
        }

        return (
            <React.Fragment>
                {changeImgBtn}
                <div className="img-container">
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
            </React.Fragment>
        )
    }
}

export default SingleMaterialImg;
