import React,{Component} from 'react';
import axios from 'axios';

class SingleSeason extends Component{
    constructor(props){
        super(props);
        this.state={
            isFetched:false
        }
    }

    componentDidMount(){
        axios.get('http://localhost:3000/api/season')
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