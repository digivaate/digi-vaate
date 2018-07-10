import React,{Component} from 'react';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import { Col,Row,Icon,Upload, Modal } from 'antd';
import './themes.css'
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

    componentDidMount(){
        axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
            .then(response => {
                this.theme = response.data[0].theme;
            })
            .then(() => this.setState({
                themeImg: this.theme.imagePaths,
                themeName:this.theme.name,
                themeId: this.theme.id
            }))
    }

    onFileChange(e){
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/theme/${this.state.themeId}/image`, data)
            .then(() => {
                axios.get(`${API_ROOT}/theme?name=${this.state.themeName}`)
                    .then(response => {
                        this.setState({
                            themeImg: response.data[0].imagePaths
                        });
                    });
            })
    }

    handleDelete(theme){
        axios.delete(`${API_ROOT}/theme/${this.state.themeId}/image/${theme}`)
        axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
            .then(response => {
                this.theme = response.data[0].theme;
            })
            .then(() => this.setState({
                themeImg: this.theme.imagePaths,
                themeName:this.theme.name,
                themeId: this.theme.id
            }))
    }


    render(){
        let renderTheme = "No Theme";
        let renderThemeImg = null;
        if(this.theme && this.state.themeImg) {
            renderThemeImg = this.state.themeImg.map(theme =>
            <Col key={theme} span={6}>
                <div className="show-image">
                    <img height="220" width="285" src={`${API_ROOT}/${theme}`}/>
                    <button className="btn"
                            onClick={() => this.handleDelete(theme)}
                    >
                        <Icon type="delete"/>
                    </button>
                </div>
            </Col>
            );
            renderTheme = (
                <div>
                    <Row gutter={32}>
                    {renderThemeImg}
                    </Row>
                </div>
            )
        }
        return(
            <div>
                <h1>Themes</h1>
                <h2>{this.state.themeName}</h2>
                <div className="upload-btn-wrapper">
                    <input type="file" name="file" onChange={this.onFileChange}/>
                    <button className="btn-upload"><Icon type="plus"/></button>
                </div>
                {renderTheme}
            </div>
        )
    }
}

export default ThemeList;