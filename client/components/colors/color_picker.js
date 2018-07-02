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
        const styles = reactCSS({
            'default': {
                color: {
                    width: '72px',
                    height: '28px',
                    borderRadius: '2px',
                    background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'relative',
                },
                cover: {
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <div>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                        <div style={ styles.cover } onClick={ this.handleClose }/>
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