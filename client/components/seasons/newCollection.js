import React,{ Component } from "react";
import { Modal,Form,Input} from 'antd';
const FormItem = Form.Item;
import "./seasons.css"



const CollectionCreateForm = Form.create()(
    class extends React.Component {
        constructor(props){
            super(props);
        }

        checkName = (rule, value, callback) => {
            if(/^[0-9A-Za-z\s\-_]+$/.test(value) || value === ""){
                if(callback){
                    callback();
                    return;
                }
                return;
            }
            callback("Name of product cannot contain special character")
        };

        checkCoverPercent = (rule, value, callback) => {
            if(/^[0-9.]+$/.test(value) || !value ){
                if(callback){
                    callback();
                    return;
                }
                return;
            }
            callback("You can input only number")
        };
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Create a collection"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: 'Please input the name of collection' },
                                    { validator: this.checkName}
                                ],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="Cover Percentage">
                            {getFieldDecorator('coverPercent',{
                                rules: [
                                    { validator: this.checkCoverPercent}
                                ]
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

export default CollectionCreateForm;