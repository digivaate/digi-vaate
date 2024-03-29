import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import axios from 'axios';
import {API_ROOT} from "../../api-config";
import createAxiosConfig from "../../createAxiosConfig";

const FormItem = Form.Item;
const confirm = Modal.confirm;

const EditForm = Form.create()(
    class extends React.Component {
        render() {
            const { getFieldDecorator } = this.props.form;
            return(
                <Form layout="inline" onSubmit={this.submit}>
                    <FormItem label={'Name'}>
                        {getFieldDecorator('name',
                            {initialValue: this.props.collection.name} )(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            );
        }
    });

class EditCollection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            formRef: null
        };
    }

    close = () => {
        if (this.props.hide) {
            this.props.hide();
            this.formRef.props.form.resetFields();
        }
    };

    handleOk = () => {
        this.setState({ loading: true });
        this.formRef.props.form.validateFields((err, values) => {
            if (err) console.error(err);
            this.props.editCollection(values);
            this.close();
            this.setState({ loading: false });
            this.formRef.props.form.resetFields();
        });
    };

    confirmDelete = () => {
        const collectionId = this.props.collection.id;
        const self = this;
        confirm({
            title: 'Delete this collection?',
            onOk() {
                return axios.delete(API_ROOT + '/collection/?id=' + collectionId)
                    .then(res => {
                        self.props.deleteCollection(self.props.collection)
                        self.close();
                    })
                    .catch(err => console.error(err));
            },
            onCancel() {
                return false;
            }
        });
    };

    render() {
        if (!this.props.collection) return null;
        const { loading } = this.state;
        return (
            <Modal
                visible={this.props.visible}
                title={'Edit season'}
                onCancel={this.close}
                footer={[
                    <Button key="back" onClick={this.close}>Cancel</Button>,
                    <Button key="submit"
                            type="primary"
                            loading={loading}
                            onClick={this.handleOk}
                    >OK</Button>
                ]}
            >
                <EditForm collection={this.props.collection}
                          wrappedComponentRef={(f) => this.formRef = f }
                />
                <Button type={'danger'}
                        onClick={this.confirmDelete}
                        htmlType={'button'}>Delete</Button>
            </Modal>
        );
    }
}

export default EditCollection;