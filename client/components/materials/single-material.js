import React,{ Component } from "react";
import axios from 'axios';
import { Card, Col,Row,Divider,Input,Button,Icon,Modal,Select,message } from 'antd';
import { API_ROOT } from '../../api-config';
import './materials.css'
import FormData from 'form-data';
const Option = Select.Option;

class SingleMaterial extends Component{
    constructor(props){
        super(props);
        this.state ={
            key: 'tab1',
            loadedMaterial:null,
        }
    }

    material =[];
    componentDidMount(){
        axios.get(`${API_ROOT}/material?name=${this.props.match.params.materialId}`)
            .then(response => {
                this.setState({
                    loadedMaterial: response.data[0]
                })
            })
    }

    onFileChange = (e) =>{
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/material/${this.state.loadedMaterial.id}/image`, data)
            .then(() => {
                axios.get(`${API_ROOT}/material?name=${this.props.match.params.materialId}`)
                    .then(response => {
                        console.log(response.data[0].imagePath);
                        this.setState({
                            loadedMaterial: response.data[0]
                        });
                    });
            })
    };

    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
    };

    handleEdit = () => {
        console.log('Click');
    };

    render(){
        if(this.state.loadedMaterial){
            let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif"
            const tabList = [{
                key: 'tab1',
                tab: 'Price',
            }, {
                key: 'tab2',
                tab: 'Instruction',
            }, {
                key:'tab3',
                tab:'Composition'
            }];

            const contentList = {
                tab1: <div>
                    <p>consumption: {this.state.loadedMaterial.consumption}</p>
                    <p>freight: {this.state.loadedMaterial.freight}</p>
                    <p>manufacturer: {this.state.loadedMaterial.manufacturer}</p>
                    <p>minQuality: {this.state.loadedMaterial.minQuality}</p>
                    <p>unitPrice: {this.state.loadedMaterial.unitPrice}</p>
                </div>,
                tab2: <div>
                    <p>{this.state.loadedMaterial.instructions}</p>
                </div>,
                tab3: <div>
                    <p>{this.state.loadedMaterial.composition}</p>
                </div>
            };
            if(this.state.loadedMaterial.imagePath !== null){
                imgUrl = `${API_ROOT}/${this.state.loadedMaterial.imagePath}`;
            }
            console.log(this.state.loadedMaterial);
            return (
                <div>
                    <h1>{this.state.loadedMaterial.name}</h1>
                    <Row>
                        <Col span={8}>
                            <div className="img-container">
                                <div className="upload-btn-wrapper">
                                    <input type="file" name="file" onChange={this.onFileChange}/>
                                    <button className="btn-upload"><Icon type="upload"/></button>
                                </div>
                                <img alt="example" height="300" width="370" src={`${imgUrl}`} />
                            </div>
                        </Col>
                        <Col span={16}>
                            <Card
                                style={{ width: '100%',height:400 }}
                                title="Material information"
                                extra={<Button onClick={this.handleEdit}>Edit</Button>}
                                tabList={tabList}
                                defaultActiveTabKey = "tab1"
                                onTabChange={(key) => { this.onTabChange(key, 'key'); }}
                            >
                                {contentList[this.state.key]}
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
        else{
            return "Loading..."
        }
    }
}

export default SingleMaterial;