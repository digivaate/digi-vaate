import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker,PhotoshopPicker } from 'react-color';
import './colors.css'

class ColorPicker extends React.Component {
    state = {
        displayColorPicker: false,
        color: {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        },
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
        this.props.sendHexCode(this.rgbToHex(this.state.color.r,this.state.color.g,this.state.color.b))
    };

    handleChange = (color) => {
        this.setState({ color: color.rgb })
    };

    rgbToHex = (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    acceptHandle = () => {
        console.log('Ok');
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
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <div>
                <div style={ styles.swatch } onClick={ this.handleClick }>
                    <div style={ styles.color } />
                </div>
                <p>Hex code: {this.rgbToHex(this.state.color.r,this.state.color.g,this.state.color.b)}</p>
                <p>RGB: r:{this.state.color.r},g:{this.state.color.g},b:{this.state.color.b}</p>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                        <div style={ styles.cover } onClick={ this.handleClose }/>
                        <PhotoshopPicker
                            color={ this.state.color }
                            onChange={ this.handleChange }
                        />
                    </div> : null }
            </div>
        )
    }
}

export default ColorPicker;