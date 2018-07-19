import React,{ Component } from "react";
import { Card, Row, Col,Icon,Modal,Divider,Button,Form,message,Spin } from 'antd';
import {Redirect,Link} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import FormData from 'form-data';
const { Meta } = Card;
const confirm = Modal.confirm;
const FormItem = Form.Item;
import "./products.css"
import ProductCreateForm from './product-card';


class ProductsDisplay extends Component{
    constructor(props){
        super(props);
        this.state ={
            isFetched: false,
            isSelected:false,
            productName:null,
            isColorFetched:true,
            visible: false,
            materialOptions: null,
            colorOptions:null,
            productLevel: null,
            productLevelId:null,
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    collections = [];
    products = [];
    uploadImage = null;
    componentDidMount() {
        const pathSnippetsLevel = this.props.requestPath.split('/').filter(i => i);
        const { location } = this.props;
        const pathSnippetsName = location.pathname.split('/').filter(i => i);
        if(pathSnippetsLevel[0] === "company"){
            axios.get(`${API_ROOT}/company?name=Lumi`)
                .then(response => {
                    this.setState({
                        productLevel: pathSnippetsLevel[0],
                        productLevelId: response.data[0].id
                    });
                })
        }
        if(pathSnippetsLevel[0] === "season"){
            axios.get(`${API_ROOT}/season?name=${pathSnippetsName[0]}`)
                .then(response => {
                    this.setState({
                        productLevel: pathSnippetsLevel[0],
                        productLevelId: response.data[0].id
                    });
                })

        }
        if(pathSnippetsLevel[0] === "collection"){
            axios.get(`${API_ROOT}/collection?name=${pathSnippetsName[1]}`)
                .then(response => {
                    this.setState({
                        productLevel: pathSnippetsLevel[0],
                        productLevelId: response.data[0].id
                    });
                })

        }

        /*
        axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
            .then(response => {
                console.log(response);
                this.collections = response.data;
                this.products = this.collections[0].products;
                for(let i=0 ; i < this.products.length; i++){
                    axios.get(`${API_ROOT}/product?name=${this.products[i].name}`)
                        .then(response => {
                            this.products[i].colors = response.data[0].colors;
                            this.products[i].materials = response.data[0].materials;
                            this.products[i].imgPath = response.data[0].imagePath;

                        })
                        .then(()=>this.setState({isColorFetched:true}));
                }
            })
            .then(() => this.setState({isFetched: true}))
            .catch(err => console.error(err));
        */

        axios.get(`${API_ROOT}/${this.props.requestPath}`)
            .then(res => {
                this.products = res.data;
                for(let i = 0;i < this.products.length; i++){
                    if(this.products[i].companyId){
                        this.products[i].seasonName = "None";
                        this.products[i].collectionName = "None";
                    }
                    else if(this.products[i].seasonId){
                        this.products[i].collectionName = "None";
                    }
                    this.setState(prevState => prevState)
                }
                /*if(pathSnippetsLevel[0] === "company"){
                    for(let i = 0;i < this.products.length; i++){
                        axios.get(`${API_ROOT}/product?name=${this.products[i].name}`)
                            .then(response => {
                                axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                                    .then(res => {
                                        this.products[i].collectionName = res.data[0].name;
                                        this.setState(prevState => prevState)
                                        axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                                            .then(re => {
                                                this.products[i].seasonName = re.data[0].name
                                                this.setState(prevState => prevState)
                                            })
                                    });
                            })
                    }
                }
                else if(pathSnippetsLevel[0] === "season"){
                    for(let i = 0;i < this.products.length; i++){
                        axios.get(`${API_ROOT}/product?name=${this.products[i].name}`)
                            .then(response => {
                                axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                                    .then(res => {
                                        this.products[i].seasonName = res.data[0].name;
                                        this.products[i].collectionName = "None";
                                        this.setState(prevState => prevState)
                                    });
                            })
                    }
                }
                else if(pathSnippetsLevel[0] === "collection"){
                    for(let i = 0;i < this.products.length; i++){
                        axios.get(`${API_ROOT}/product?name=${this.products[i].name}`)
                            .then(response => {
                                axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                                    .then(res => {
                                        this.products[i].collectionName = res.data[0].name;
                                        this.setState(prevState => prevState)
                                        axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                                            .then(re => {
                                                this.products[i].seasonName = re.data[0].name
                                                this.setState(prevState => prevState)
                                            })
                                    });
                            })
                    }
                }
                this.setState({isFetched: true});
                */
            });

        axios.get(`${API_ROOT}/color`)
            .then(res => {
                this.setState({
                    colorOptions: res.data
                })
            });

        axios.get(`${API_ROOT}/material`)
            .then(res => {
                this.setState({
                    materialOptions: res.data
                })
            });
    }

    handleSelect(productName){
        this.setState({
            isSelected:true,
            productName: productName
        })
    }

    handleDelete(productName){
        confirm({
            title: 'Are you sure remove this product from collection?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${API_ROOT}/product?name=${productName}`);
                window.location.reload();
            },
            onCancel() {
                console.log(productName);
            },
        });
    }

    createNewProduct = () => {
        this.setState({ visible: true })
    };


    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            for (let i = 0; i < values.colors.length; i++) {
                for (let j = 0; j < this.state.colorOptions.length; j++) {
                    if (values.colors[i] === this.state.colorOptions[j].name) {
                        values.colors[i] = this.state.colorOptions[j].id
                    }
                }
            }

            for (let i = 0; i < values.materials.length; i++) {
                for (let j = 0; j < this.state.materialOptions.length; j++) {
                    if (values.materials[i] === this.state.materialOptions[j].name) {
                        values.materials[i] = this.state.materialOptions[j].id
                    }
                }
            }

            if(this.state.productLevel === "company"){
                values.companyId = this.state.productLevelId
            }
            else if(this.state.productLevel === "season"){
                values.seasonId = this.state.productLevelId
            }
            else if(this.state.productLevel === "collection"){
                values.collectionId = this.state.productLevelId
            }
            values.imagePath = null;
            console.log('Received values of form: ', values);
            if(this.uploadImage) {
                axios.post(`${API_ROOT}/product`, values)
                    .then(response => {
                        axios.patch(`${API_ROOT}/product/image?name=${values.name}`, this.uploadImage)
                            .then(() => {
                                message.success("Product created",1);
                                axios.get(`${API_ROOT}/${this.props.requestPath}`)
                                    .then(res => {
                                        this.products = res.data;
                                        for(let i = 0;i < this.products.length; i++){
                                            if(this.products[i].companyId){
                                                this.products[i].seasonName = "None";
                                                this.products[i].collectionName = "None";
                                            }
                                            else if(this.products[i].seasonId){
                                                this.products[i].collectionName = "None";
                                            }
                                        }
                                        this.uploadImage = null;
                                        this.setState({visible: false});
                                    });
                            });
                    })
                    .then(() => this.setState(prevState => prevState));
                form.resetFields();
            }
            else if(!this.uploadImage){
                axios.post(`${API_ROOT}/product`, values)
                    .then(response => {
                        message.success("Product created",1);
                        axios.get(`${API_ROOT}/${this.props.requestPath}`)
                            .then(res => {
                                this.products = res.data;
                                for(let i = 0;i < this.products.length; i++){
                                    if(this.products[i].companyId){
                                        this.products[i].seasonName = "None";
                                        this.products[i].collectionName = "None";
                                    }
                                    else if(this.products[i].seasonId){
                                        this.products[i].collectionName = "None";
                                    }
                                }
                                this.uploadImage = null;
                                this.setState({visible: false});
                            });
                    })
                    .then(() => this.setState(prevState => prevState));
                form.resetFields();
            }
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {
        let renderProductList = null;
        let renderProductColors = null;
        let renderProductMaterials = null;
        let singleProduct = null;
        if (this.state.isSelected) {
            let url = (this.props.match.url === "/") ? this.props.match.url : (this.props.match.url + '/')
            singleProduct = <Redirect to={{
                pathname: url + this.state.productName
            }}/>;
            //return <SingleProduct productId={this.state.productName}/>
        }
        if (this.products) {
            renderProductList = this.products.map(product =>{
                let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
                if(product.imagePath !== null){
                    imgUrl = `${API_ROOT}/${product.imagePath}`
                }
                    if(product.colors) {
                        if(product.colors.length > 0){
                            renderProductColors = product.colors.map(color =>
                                <Col key={color.id} span={3}>
                                    <Card className="products-display-color" style={{
                                        backgroundColor: color.value,
                                    }}/>
                                </Col>
                            )
                        }
                        else {
                            renderProductColors = <p>No colors</p>;
                        }
                    }

                    if(product.materials){
                        if(product.materials.length > 0){
                            renderProductMaterials = product.materials.map(material =>
                                <Col key={material.id} span={6}>
                                    <div
                                    >
                                        <p>{material.name}</p>
                                    </div>
                                </Col>
                            )
                        }
                        else {
                            renderProductMaterials = <p>No materials</p>
                        }
                    }

                    if(this.state.productLevel === "collection"){
                        return (
                            <Col span={6} key={product.id}>
                                <div className="product-card-wrapper">
                                    <Card
                                        hoverable
                                        bodyStyle={{height:200}}
                                        className="product-card-display"
                                        cover={<img alt="example" className="product-img" src={`${imgUrl}`} />}
                                        actions={[
                                            <div onClick = {() => this.handleSelect(product.name)}>
                                                <Icon type="edit" />
                                            </div>,
                                            <div onClick = {() => this.handleDelete(product.name)}>
                                                <Icon type="delete" />
                                            </div>
                                        ]}
                                    >
                                        <Meta
                                            title={product.name}
                                            description={
                                                <div>
                                                    <br/>
                                                    <br/>
                                                    <Row gutter={8}>
                                                        { renderProductColors }
                                                    </Row>
                                                    <Row gutter={16}>
                                                        <hr />
                                                        {renderProductMaterials}
                                                    </Row>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </div>
                            </Col>
                        )
                    }

                return(
                    <Col span={6} key={product.id}>
                        <div className="product-card-wrapper">
                        <Card
                            hoverable
                            bodyStyle={{height:200}}
                            className="product-card-display"
                            cover={<img alt="example" className="product-img" src={`${imgUrl}`} />}
                            actions={[
                                <div onClick = {() => this.handleSelect(product.name)}>
                                    <Icon type="edit" />
                                </div>,
                                <div onClick = {() => this.handleDelete(product.name)}>
                                    <Icon type="delete" />
                                </div>
                            ]}
                        >
                            <Meta
                                title={product.name}
                                description={
                                    <div>
                                        <p>Season: {product.seasonName} </p>
                                        <p>Collection: {product.collectionName}</p>
                                    <Row gutter={8}>
                                        { renderProductColors }
                                    </Row>
                                    <Row gutter={16}>
                                        <hr />
                                        {renderProductMaterials}
                                    </Row>
                                    </div>
                                }
                            />
                        </Card>
                        </div>
                    </Col>
                )
            }

            );
        }
        if(renderProductList){
            if(renderProductList.length === 0){
                return (
                    <div>
                        <h1>Products</h1>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewProduct}
                        >
                            Create new product
                        </Button>
                        <Spin/>
                    </div>
                )
            }
        }
        return (
            <div>
                {singleProduct}
                <h1>Products</h1>
                <Button type="primary"
                        size="large"
                        onClick={this.createNewProduct}
                >
                    Create new product
                </Button>
                <ProductCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    uploadImage={(data) => this.uploadImage = data}
                />
                <br/>
                <br/>
                <Row gutter={40}>
                </Row>
            </div>
        )
    }
}

export default ProductsDisplay;
