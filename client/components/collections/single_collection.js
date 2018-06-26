import React,{Component} from 'react';
import { API_ROOT } from '../../api-config';
import axios from 'axios';

class SingleCollection extends Component{
    constructor(props){
        super(props);
        this.state={
            isFetched:false
        }
    }

    componentDidMount(){
        axios.get(`${API_ROOT}/collection`)
            .then(response => {
                this.setState({
                    isFetched:true
                })
            })
    }

    render(){
        return (
            <div>
                <p>Collection view</p>
            </div>
        )
    }
}

export default SingleCollection;
