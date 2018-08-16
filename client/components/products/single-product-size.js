import React, {Component} from "react";
import axios from 'axios';
import {Row,Col,Input, Button, Icon, Modal,Spin,Card,Select} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'


class SingleProductSize extends Component{
    constructor(props){
        super(props);
        this.state = {
            sizeVisible: false,
            sizes: this.props.sizes,
            sizeOptions: null,
        }
    }

    updateSizes = [];

    componentDidUpdate(prevProps){
        if(prevProps.sizes != this.props.sizes){
            this.setState(prevState => prevState)
        }
    }

    componentDidMount(){
        this.loadSizes()
    }

    loadSizes = () => {
        axios.get(`${API_ROOT}/size`)
            .then(response => {
                this.setState({
                    sizeOptions: response.data
                })
            })
    };

    showSizeModal = () => {
        this.setState({
            sizeVisible: true,
        })
    };

    handleSizeCancel = (e) => {
        this.setState({
            sizeVisible: false,
        });
    };

    handleSizeChange = (value) => {
        this.setState(prevState => prevState);
        let valueObj = [];
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.sizeOptions.length; j++) {
                if (parseInt(value[i]) === this.state.sizeOptions[j].id) {
                    valueObj[i] = this.state.sizeOptions[j]
                }
            }
        }
        this.updateSizes = valueObj;
    };

    handleSizeOk = () => {
        this.props.newSizes(this.updateSizes);
        this.setState({
            sizeVisible:false,
            sizes: this.updateSizes
        })
    };

    render(){
        let {sizeOptions} = this.state;
        let renderSizeOptions = [];
        let renderDefaultSizes = [];
        let editSizeInfo = null;
        let sizesDisplay = null;
        if(this.props.editModeStatus === true) {
            editSizeInfo =
                <Button className="edit-btn" onClick={this.showSizeModal}>
                    <Icon type="edit"/>
                </Button>;
        }
        if (sizeOptions) {
            renderSizeOptions = sizeOptions.map(size =>
                <Select.Option key={size.id}>
                    {size.value}
                </Select.Option>
            )
        }
        if(this.state.sizes){
            sizesDisplay = this.state.sizes.map(size =>
                <Card key={size.id} style={{ width: 100,textAlign:'center' }} hoverable>
                    <p>{size.value}</p>
                </Card>
            );
            return (
                <div>
                    {editSizeInfo}
                    <Modal
                        title="Edit size"
                        visible={this.state.sizeVisible}
                        onOk={this.handleSizeOk}
                        onCancel={this.handleSizeCancel}
                        bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                    >
                        <Select
                            mode="tags"
                            size={'default'}
                            placeholder="Please select"
                            defaultValue={renderDefaultSizes}
                            onChange={this.handleSizeChange}
                            style={{width: '100%'}}
                        >
                            {renderSizeOptions}
                        </Select>
                    </Modal>
                    {sizesDisplay}
                </div>
            )
        } else {
            return <Spin/>
        }
    }
}

export default SingleProductSize;

