import React, {Component, Fragment} from 'react';
import {Input, Select, Col} from "antd";
import axios from "axios";
import {API_ROOT} from "../../../api-config";
import createAxiosConfig from "../../../createAxiosConfig";
const Option = Select.Option;

class ProdGroupPicker extends Component {
    state = {
        data: [],
        createNew: false,
        selectValue: null,
        inputValue: null,
        selectDisabled: false,
        inputDisabled: false
    };

    /*componentDidUpdate(prevProps){
        if(this.props.visible && this.props.visible !== prevProps.visible){
            this.loadProdGroups();
            this.setState({
                selectValue: null,
                inputValue: null,
                selectDisabled: false,
                inputDisabled: false
            });
        }
    }*/

    loadProdGroups = () => {
        axios.get(`${API_ROOT}/productgroup`, createAxiosConfig())
            .then(response => {
                this.setState({ data: response.data });
            })
            .catch(err => console.error(err))
    };

    //sends the changed value to parent (form) component
    handleSelectChange = (value) => {
        if(value === this.state.selectValue){
            this.setState({
                selectValue: null,
                inputDisabled: false,
            }, () => {
                const onChange = this.props.onChange;
                if (onChange) {
                    onChange(this.state.selectValue);
                }
            });
            return null;
        }
        if(value){
            this.setState({
                inputDisabled: true,
                selectValue: value
            }, () => {
                const onChange = this.props.onChange;
                if (onChange) {
                    onChange(this.state.selectValue);
                }
            })
        }

    };

    handleInputChange = (value) => {
        if(value){
            this.setState({
                inputValue: value.target.value
            })
        }
        if(value.target.value.length > 0){
            this.setState({
                selectDisabled: true,
            })
        } else {
            this.setState({
                selectDisabled: false
            })
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
                    onSelect={this.handleSelectChange}
                    placeholder="Select a person"
                    style={{ width: '100%'}}
                    disabled={this.state.selectDisabled}
                    value = {this.state.selectValue}
                >
                    {options}
                </Select>
                </Col>
                <Col span={createNew ? 15 : 9}>
                <Input
                    onFocus={this.enterInput}
                    onChange={this.handleInputChange}
                    placeholder={"New category"}
                    disabled={this.state.inputDisabled}
                    value = {this.state.inputValue}
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
