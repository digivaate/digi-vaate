import React,{ Component } from "react";
import { Modal,Form,Input } from 'antd';
const FormItem = Form.Item;
import "./company.css"



const SeasonCreateForm = Form.create()(
    class extends React.Component {
        constructor(props){
            super(props);
        }
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
                                rules: [{ required: true, message: 'Please input the name of season' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="Budget">
                            {getFieldDecorator('budget', {
                                rules: [{ required: true, message: 'Please input the budget of season' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="Cover percentage">
                            {getFieldDecorator('coverPercent')(
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