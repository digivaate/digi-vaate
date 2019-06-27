import React from 'react';
import axios from "axios";
import {API_ROOT} from "../api-config";
import createAxiosConfig from "../createAxiosConfig";
import './materials/materials.css'
import './products/products.css'
class Image extends React.Component {
    state = {
        image: null
    };

    componentDidMount() {
        axios.get(
            this.props.id ? `${API_ROOT}/image?id=${this.props.id}` : this.props.url,
            {...createAxiosConfig(), responseType: 'arraybuffer'}
            )
            .then(res => {
                const imgBuffer = new Buffer(res.data, 'binary').toString('base64');
                this.setState({image: `data:image/jpeg;base64,${imgBuffer}`});
            })
            .catch(err => console.error(err));
    }

    render() {
        return (
            <img 
                className={ this.props.type === "product" ? "products-display-img" : "material-list-img" } 
                src={this.state.image}
            />
        )
    }
}

export default Image;
