import React, {Component} from "react";
import axios from 'axios';
import {Row,Col,Input, Button, Icon, Modal,Spin,Card,Select,Divider} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'


class SingleProductSize extends Component{
    constructor(props){
        super(props);
        this.state = {
            sizeVisible: false,
            sizes: this.props.sizes,
            sizeOptions: null,
            createNewSize: false,
            numberOfNewSize:0
        }
    }

    updateSizes = this.props.sizes;
    newSizesCreated = [];

    componentDidUpdate(prevProps){
        if(prevProps.sizes != this.props.sizes){
            this.setState({
                sizes: this.props.sizes
            })
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
        let sizeOptionsValue = this.state.sizeOptions.map(size => size.value);
        let valueObj = [];
        let newValueObj = [];
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.sizeOptions.length; j++) {
                if (value[i] === this.state.sizeOptions[j].value) {
                    valueObj[i] = this.state.sizeOptions[j]
                }
            }
            if(sizeOptionsValue.indexOf(value[i]) < 0){
                newValueObj.push({
                    value: value[i]
                })
            }
        }
        this.newSizesCreated = newValueObj;
        this.updateSizes = valueObj;
    };

    handleSizeOk = () => {
        let mergeSizes = [];
        if(this.newSizesCreated.length > 0) {
            axios.post(`${API_ROOT}/size`, this.newSizesCreated)
                .then((response) => {
                    mergeSizes = this.updateSizes.concat(response.data)
                    this.props.newSizes(mergeSizes);
                    this.setState({
                        sizeVisible: false,
                        sizes: mergeSizes,
                    })
                })
        } else {
            this.props.newSizes(this.updateSizes);
            this.setState({
                sizeVisible: false,
                sizes: this.updateSizes,
            })
        }
    };



    render(){
        let {sizeOptions} = this.state;
        let renderSizeOptions = [];
        let renderDefaultSizes = [];
        let editSizeInfo = <div style={{height:40,width:40}}></div>;
        let sizesDisplay = null;
        if(this.props.editModeStatus === true) {
            editSizeInfo =
                <Button className="edit-btn" onClick={this.showSizeModal}>
                    <Icon type="edit"/>
                </Button>;
        }
        if (sizeOptions) {
            renderSizeOptions = sizeOptions.map(size =>
                <Select.Option key={size.value} title={<span style={{color:'#E94E53'}}>{size.value}</span>}>
                    <span style={{color:'#E94E53'}}>{size.value}</span>
                </Select.Option>
            )
        }
        if(this.state.sizes){
            renderDefaultSizes = this.state.sizes.map(size => size.value);
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
                        bodyStyle={{maxHeight: 500, overflow: 'auto'}}
                    >
                        <Select
                            mode="tags"
                            size={'default'}
                            placeholder="Please select"
                            defaultValue={renderDefaultSizes}
                            onChange={this.handleSizeChange}
                            style={{width: '100%'}}
                            optionLabelProp="title"
                        >
                            {renderSizeOptions}
                        </Select>
                    </Modal>
                    <Row type="flex">
                    {sizesDisplay}
                    </Row>
                </div>
            )
        } else {
            return <Spin/>
        }
    }
}

export default SingleProductSize;

