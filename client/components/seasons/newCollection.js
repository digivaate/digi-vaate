import React,{ Component } from "react";
import { Modal,Form,Input} from 'antd';
const FormItem = Form.Item;
import "./seasons.css"



const CollectionCreateForm = Form.create()(
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
                    title="Create a collection"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please input the name of collection' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="Cover Percentage">
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

export default CollectionCreateForm;