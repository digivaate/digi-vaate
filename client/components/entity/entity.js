import React, {Component} from 'react';
import { List } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';

/**
 * Add to properties what entity type and id you want to load.
 * example: <Entity type={'product'} _id={'3ebc64'} />
 */
class Entity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }

    componentDidMount() {
        if (!this.props.type) return;
        axios.get('api/' + this.props.type + '/' + this.props.id)
            .then((res) => {
                this.setState({ data: res.data });
            })
            .catch(err => console.log(err));
    }

    render() {
        let dataList = [];
        const data = this.state.data;
        //Iterate trough all keys and values of the object. Also arrays
        for (let obj in data) {
            if (data.hasOwnProperty(obj)) {
                if(Array.isArray(data[obj])) {
                    let text = obj + ': ';
                    for (let arrayObj in data[obj]) {
                        if (data[obj][arrayObj].name) {
                            text += data[obj][arrayObj].name + ', ';
                        } else {
                            text += data[obj][arrayObj]._id + ', ';
                        }
                    }
                    dataList.push(text);
                } else if (obj !== 'name'){
                    dataList.push(obj + ': ' + data[obj]);
                }
            }
        }
        return(
            <React.Fragment>
                <h4>Type: {this.props.type}</h4>
                <h3>Name: {data.name}</h3>
                <List
                    size ='small'
                    dataSource={dataList}
                    renderItem={item => (<List.Item> {item} </List.Item>)}
                />
            </React.Fragment>
        );
    };
}

export default Entity;
