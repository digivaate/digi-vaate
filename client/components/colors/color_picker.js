import React from 'react';
import reactCSS from 'reactcss';
import {message} from 'antd';
import {PhotoshopPicker } from 'react-color';
import './colors.css'

class ColorPicker extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            displayColorPicker: true,
            color: {
                r: 0,
                g: 0,
                b: 0,
                a: 1,
            },
        };
        this.rgbToHex = this.rgbToHex.bind(this);
        this.handleAccept = this.handleAccept.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleAccept(){
        message.success('Color picked !',0.5);
        this.props.sendHexCode(this.rgbToHex(this.state.color.r,this.state.color.g,this.state.color.b))
    }

    handleChange(color){
        this.setState({ color: color.rgb })
    };

    rgbToHex(r, g, b){
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    render() {
        return (
            <div>
                { this.state.displayColorPicker ? <div className={'popover'}>
                        <div onClick={ this.handleClose }/>
                        <PhotoshopPicker
                            color={ this.state.color }
                            onChange={ this.handleChange }
                            onAccept={this.handleAccept}
                        />
                    </div> : null }
            </div>
        )
    }
}

export default ColorPicker;