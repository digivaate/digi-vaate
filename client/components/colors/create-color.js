import React from 'react';
import ColorPicker from './color_picker'
import { Button, Modal, Form, Input, message } from 'antd';
const FormItem = Form.Item;
import './colors.css'

const ColorCreateForm = Form.create()(
    class extends React.Component {
        hexCodeValues = "";
        sendHexCode(hexCode){
            this.hexCodeValues = hexCode;
            this.props.getHexCode(this.hexCodeValues);
        }

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Create a new color"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                    width={800}
                    bodyStyle={{height:350}}
                >
                    <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please input the name of color!' }],
                            })(
                                <Input className="color-input"/>
                            )}
                        </FormItem>
                        <FormItem label="Color code">
                            {getFieldDecorator('colorCode', {
                                rules: [{ required: true, message: 'Please input the code of color!' }],
                            })(
                                <Input className="color-input"/>
                            )}
                        </FormItem>
                        <FormItem className="collection-create-form_last-form-item" style={{marginLeft: 210,top:-200}}>
                            {getFieldDecorator('hexCodeFromPicker')(
                                <ColorPicker sendHexCode={hexCode => this.sendHexCode(hexCode)}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

class ColorPage extends React.Component {
    state = {
        visible: false,
    };
    colorsCollection = {};
    hexCodeValues = "";

    getHexCode = (hexCodeValues) => {
        this.hexCodeValues = hexCodeValues;
    };
    showModal = () => {
        this.setState({ visible: true });
    };
    handleCancel = () => {
        this.setState({ visible: false });
        this.formRef.props.form.resetFields();
    };
    handleCreate = () => {
        const form = this.formRef.props.form;
        if(this.hexCodeValues === ""){
            message.error('Click OK to select color',2)
        }
        if(this.hexCodeValues !== ""){
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                values.hexCode = "";
                this.colorsCollection = values;
                this.colorsCollection.hexCode = this.hexCodeValues;

                const newColor = {
                    name: this.colorsCollection.name,
                    value: this.colorsCollection.hexCode,
                    code: this.colorsCollection.colorCode
                };
                for(let i = 0; i < this.props.allColors.length; i++){
                    if(newColor.name === this.props.allColors[i].name){
                         message.error("Color name is already used ! Please use another name");
                        return null;
                    } else if(newColor.code === this.props.allColors[i].code){
                        message.error("Color code is already used ! Please use another code");
                        return null;
                    }
                }
                this.props.createColor(newColor);
                message.success('Successfully created',1);
                this.setState({ visible: false });
                form.resetFields();
            });
            this.hexCodeValues = "";
        }
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };
    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>New Color</Button>
                <ColorCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    getHexCode={hexCodeValues => this.getHexCode(hexCodeValues)}
                />
            </div>
        );
    }
}

export default ColorPage;