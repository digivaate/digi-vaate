import React, {Component} from "react";
import axios from 'axios';
import {Row,Button, Icon, Modal,Spin,Col,Select,Card} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import createAxiosConfig from "../../createAxiosConfig";


class SingleProductSize extends Component{
    constructor(props){
        super(props);
        this.state = {
            sizeVisible: false,
            sizes: this.props.sizes,
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
        let sizeOptionsValue = this.props.sizeOptions.map(size => size.value);
        let valueObj = [];
        let newValueObj = [];
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.props.sizeOptions.length; j++) {
                if (value[i] === this.props.sizeOptions[j].value) {
                    valueObj[i] = this.props.sizeOptions[j]
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
                    mergeSizes = this.updateSizes.concat(response.data);
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
        let {sizeOptions} = this.props;
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
            <Col key={size.id}>
            <div className="size-card" >
                <div className="size-value">
                    {size.value}
                </div>
            </div>
            </Col>
            );
            return (
                <div>
                    <Row type="flex">
                        <h2>Sizes&nbsp;&nbsp;</h2>
                        {editSizeInfo}
                    </Row>
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
                    <Row type="flex" gutter={8} style={{margin:0}}>
                        {sizesDisplay.length > 0 ? sizesDisplay : <div style={{height: 50}}>No sizes</div>}
                    </Row>
                </div>
            )
        } else {
            return <Spin/>
        }
    }
}

export default SingleProductSize;

