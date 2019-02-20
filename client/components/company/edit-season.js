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
        if(this.props.season){
            return (
                <Form layout="inline">
                    <FormItem label={'Name'}>
                        {getFieldDecorator('name',
                            {initialValue: this.props.season.name})(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label={'Budget'}>
                        {getFieldDecorator('budget',
                            {initialValue: this.props.season.budget})(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            );
        }
    }
});

class EditSeason extends React.Component {
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
            this.props.editSeason(values);
            this.close();
            this.setState({ loading: false });
            this.formRef.props.form.resetFields();
        });
    };

    confirmDelete = () => {
        const seasonId = this.props.season.id;
        const self = this;
        const close = this.close;
        confirm({
            title: 'Delete this season?',
            onOk() {
                return axios.delete(API_ROOT + '/season/?id=' + seasonId)
                    .then(res => {
                        self.props.deleteSeason(self.props.season)
                        console.log(res);
                        close();
                    })
                    .catch(err => console.error(err));
            },
            onCancel() {
                return false;
            }
        });
    };

    render() {
        if (!this.props.season) return null;
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
                <EditForm season={this.props.season}
                          wrappedComponentRef={(f) => this.formRef = f }
                />
                <Button type={'danger'}
                        onClick={this.confirmDelete}
                        htmlType={'button'}>Delete</Button>
            </Modal>
        );
    }
}

export default EditSeason;