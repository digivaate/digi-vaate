import React from "react";
import { Modal,Form,Input } from 'antd';
const FormItem = Form.Item;
import "./company.css"



const SeasonCreateForm = Form.create()(
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
            callback("Name of season cannot contain special character")
        };

        checkBudget = (rule, value, callback) => {
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
                    title="Create a season"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: 'Please input the name of season' },
                                    { validator: this.checkName}
                                ],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="Budget">
                            {getFieldDecorator('budget', {
                                rules: [
                                    { required: true, message: 'Please input the budget of season' },
                                    { validator: this.checkBudget}
                                ],
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

export default SeasonCreateForm;