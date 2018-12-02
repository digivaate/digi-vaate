import React, {Component, Fragment} from 'react';
import {Input, Select, Col, message} from "antd";
import axios from "axios";
import {API_ROOT} from "../../../api-config";
const Option = Select.Option;

class ProdGroupPicker extends Component {
    state = {
        data: [],
        createNew: false,
        value: undefined
    };

    loadProdGroups = () => {
        axios.get(`${API_ROOT}/productgroup`)
            .then(response => {
                this.setState({ data: response.data });
            })
            .catch(err => console.error(err))
    };

    //sends the changed value to parent (form) component
    handleChange = (value) => {
        if (!('value' in this.props)) {
            this.setState({value});
        }
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
    };

    enterSelect = () => {
        this.setState({createNew: false})
    };

    enterInput = () => {
        this.setState({createNew: true})
    };

    render() {
        const createNew = this.state.createNew;
        const options = this.state.data.map(data =>
            <Option key={data.id} value={data.id}>{ data.name }</Option>
        );

        return(
            <Input.Group>
                <Col span={createNew ? 9 : 15}
                     style={{transition: 'smooth'}}
                >
                <Select
                    onFocus={this.enterSelect}
                    onChange={this.handleChange}
                    placeholder="Select product group"
                    style={{ width: '100%'}}
                >
                    {options}
                </Select>
                </Col>
                <Col span={createNew ? 15 : 9}>
                <Input
                    onFocus={this.enterInput}
                    onChange={this.handleChange}
                    placeholder={"New product group"}
                />
                </Col>
            </Input.Group>
        )
    }

    componentDidMount() {
        this.loadProdGroups();
    }
}

export default ProdGroupPicker;
