import React,{Component} from 'react';
import ColorPage from './create-color'
import ColorCollection from './colors-collection'


class ColorIndexPage extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <ColorPage/>
                <br/>
                <ColorCollection />
            </div>
        )
    }
}

export default ColorIndexPage;