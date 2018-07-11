import React,{ Component } from "react";
import { Card, Row, Col,Icon,Avatar } from 'antd';
import {Redirect} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';

const { Meta } = Card;


class MaterialList extends Component{
    constructor(props){
        super(props);
        this.state ={
            isFetched: false,
            isSelected:false,
            materialName:null
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        axios.get(`${API_ROOT}/material`)
            .then(response => this.materials = response.data)
            .then(() => this.setState({isFetched: true}))
            .catch(err => console.log(err));
    }

    handleSelect(materialName){
        this.setState({
            isSelected:true,
            materialName: materialName
        })
    }

    render() {
        let renderMaterialList = null;
        let singleMaterial= null;
        let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
        if (this.state.isSelected) {
            singleMaterial = <Redirect to={{
                pathname: this.props.match.url + "/" + this.state.materialName
            }}/>
        }
        if (this.materials) {
            renderMaterialList = this.materials.map(material =>{
                if(material.imagePath !== null){
                    imgUrl = `${API_ROOT}/${material.imagePath}`
                }
                    return(
                        <Col span={6} key={material.id}>
                            <div className="material-card-wrapper">
                                <Card
                                    hoverable
                                    bodyStyle={{height:90}}
                                    className="material-card-display"
                                    cover={<img alt="example" className="material-img" src={`${imgUrl}`} />}
                                    actions={[
                                        <div onClick = {() => this.handleSelect(material.name)}>
                                            <Icon type="edit" />
                                        </div>,
                                        <Icon type="delete" />
                                    ]}>
                                    <Meta title={material.name} />
                                </Card>
                            </div>
                        </Col>
                    )
                }

            );
        }
        if(renderMaterialList){
            if(renderMaterialList.length === 0){
                return (
                    <div>
                        <h1>Materials</h1>
                        <p>No materials yet...</p>
                    </div>
                )
            }
        }
        return (
            <div>
                {singleMaterial}
                <h1>Materials</h1>
                <Row gutter={5}>
                    {renderMaterialList}
                </Row>
            </div>
        )
    }
}

export default MaterialList;

