import React,{Component,Fragment} from 'react';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import { Col,Row,Icon,Input,Button,Spin } from 'antd';
import './themes.css'
import createAxiosConfig from "../../createAxiosConfig";
import Image from "../Image";
class ThemeList extends Component{
    constructor(props){
        super(props);
        this.state = {
            themeImg: null,
            themeName:null,
            themeId:null,
        };
        this.onFileChange = this.onFileChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this)
    }
    theme = {};

    componentDidUpdate(prevProps,prevState){
        if(prevProps.match.url !== this.props.match.url){
            axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`, createAxiosConfig())
                .then(response => {
                    if(response.data[0].theme){
                        this.theme = response.data[0].theme;
                        this.setState({
                            collectionId: response.data[0].id,
                            themeImg: this.theme.imagePaths,
                            themeName:this.theme.name,
                            themeId: this.theme.id
                        })
                    }
                    else{
                        this.setState({
                            themeName: false,
                            collectionId: response.data[0].id
                        })
                    }
                })
        }
    }

    componentDidMount(){
        axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`, createAxiosConfig())
            .then(response => {
                if(response.data[0].theme){
                    this.theme = response.data[0].theme;
                    this.setState({
                        collectionId: response.data[0].id,
                        themeImg: this.theme.imagePaths,
                        themeName:this.theme.name,
                        themeId: this.theme.id
                    })
                } else {
                    this.setState({
                        collectionId: response.data[0].id,
                        themeName: false
                    })
                }
            })
    }

    onFileChange(e){
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/theme/${this.state.themeId}/image`, data, createAxiosConfig())
            .then(() => {
                axios.get(`${API_ROOT}/theme?name=${this.state.themeName}`, createAxiosConfig())
                    .then(response => {
                        this.setState({
                            themeImg: response.data[0].imagePaths
                        });
                    });
            })
    }

    handleDelete(theme){
        axios.delete(`${API_ROOT}/theme/${this.state.themeId}/image/${theme}`, createAxiosConfig())
        setTimeout(() => {
            axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`, createAxiosConfig())
                .then(response => {
                    this.theme = response.data[0].theme;
                })
                .then(() => this.setState({
                    themeImg: this.theme.imagePaths,
                    themeName:this.theme.name,
                    themeId: this.theme.id
                }))
        },100)
    }

    onCreateNewThemeName = (newName) => {
        axios.post(`${API_ROOT}/theme`,{name:newName,collectionId: this.state.collectionId}, createAxiosConfig())
            .then((res) => {
                this.theme = res.data;
                this.setState({
                    themeImg: this.theme.imagePaths,
                    themeName:this.theme.name,
                    themeId: this.theme.id
                })
            })

    };

    handleChange = (event) => {
        this.setState({
            value: event.target.value
        })
    };

    handleChangeNewName = (event) => {
        this.setState({
            themeName: event.target.value
        })
    };

    saveNewName = () => {
        axios.patch(`${API_ROOT}/theme?id=${this.state.themeId}`, {name:this.state.value}, createAxiosConfig())
            .then(response => {
                this.setState({
                    themeName: response.data[0].name,
                    editName:false,
                    value: "",
                })
            })
    };


    render(){
        let renderTheme = "No Theme";
        let renderThemeImg = null;
        let nameField = null;
        if(this.state.collectionId){
            if(this.state.themeName) {
                if(this.state.themeImg) {
                    renderThemeImg = this.state.themeImg.map(theme =>
                        <Col key={theme} span={6}>
                            <div className="show-image">
                                <Image className="img-theme" url={`${API_ROOT}/${theme}`}/>
                                <button className="btn"
                                        onClick={() => this.handleDelete(theme)}
                                >
                                    <Icon type="delete"/>
                                </button>
                            </div>
                        </Col>
                    );
                }
                renderTheme = (
                    <div>
                        <Row gutter={32}>
                            {renderThemeImg}
                        </Row>
                    </div>
                );
                if(this.state.editName){
                    nameField =
                        <div>
                            Edit name:
                            <Input
                                style={{width:120}}
                                value={this.state.value}
                                onChange={this.handleChange}
                            />
                            <Button
                                onClick = {this.saveNewName}
                            >
                                Save
                            </Button>
                            <Button
                                onClick = {() => this.setState({editName:false})}
                            >
                                Cancel
                            </Button>
                        </div>
                } else {
                    nameField =
                        <Fragment>
                            <Row type="flex">
                            <h2>{this.state.themeName}</h2>
                            <Button
                                type="primary"
                                onClick = {() => this.setState({editName: true,value:this.state.themeName})}
                            >
                                Edit
                            </Button>
                            </Row>
                            <div className="upload-btn-wrapper">
                                <input type="file" name="file" onChange={this.onFileChange}/>
                                <button className="btn-upload"><Icon type="plus"/></button>
                            </div>
                        </Fragment>
                }
                return (
                    <div>
                        <h1>Themes</h1>
                        {nameField}
                        {renderTheme}
                    </div>
                )
            } else {
                return (
                    <div>
                        <h1>Themes</h1>
                        New theme name:
                        <Input
                            style={{width:120}}
                            value={this.state.value}
                            onChange={this.handleChange}
                        />
                        <Button
                            onClick={() => this.onCreateNewThemeName(this.state.value)}
                            type="primary"
                        >
                            Create
                        </Button>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <h1>Themes</h1>
                    <Spin/>
                </div>
            )
        }

    }
}

export default ThemeList;