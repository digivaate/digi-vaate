import React,{Component} from 'react';
import axios from 'axios';

class SingleCollection extends Component{
    constructor(props){
        super(props);
        this.state={
            isFetched:false
        }
    }

    componentDidMount(){
        axios.get('http://localhost:3000/api/collection')
            .then(response => {
                console.log(response.data);
                this.setState({
                    isFetched:true
                })
            })
    }

    render(){
        return (
            <div>
                <p>Collection 1</p>
            </div>
        )
    }
}

export default SingleCollection;
