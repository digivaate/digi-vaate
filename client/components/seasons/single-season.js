import React,{Component} from 'react';
import axios from 'axios';
import { API_ROOT } from '../../api-config';


class SingleSeason extends Component{
    constructor(props){
        super(props);
        this.state={
            isFetched:false
        }
    }

    componentDidMount(){
        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.setState({
                    isFetched:true
                })
            })
    }

    render(){
        return (
            <div>
                <p>Season view</p>
            </div>
        )
    }
}

export default SingleSeason;