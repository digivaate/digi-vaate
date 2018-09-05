import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import axios from 'axios';
import {API_ROOT} from "../../api-config";

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
                        {initialValue: this.props.season.name} )(
                        <Input />
                    )}
                </FormItem>
                <FormItem label={'Budget'}>
                    {getFieldDecorator('budget',
                        {initialValue: this.props.season.budget} )(
                        <Input />
                    )}
                </FormItem>
                <FormItem label={'Cover percentage'}>
                    {getFieldDecorator('coverPercent',
                        {initialValue: this.props.season.coverPercent} )(
                        <Input />
                    )}
                </FormItem>
            </Form>
        );
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
        /*
        this.close = this.close.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        */
    }

    close = () => {
        if (this.props.hide) this.props.hide();
    };

    handleSave = () => {
        this.setState({ loading: true });
        this.formRef.props.form.validateFields((err, values) => {
            if (err) console.error(err);
            axios.patch(API_ROOT + '/season/?id=' + this.props.season.id, values )
                .then(res => {
                    this.props.editSeason(res.data[0]);
                    this.close();
                    this.setState({ loading: false });
                })
                .catch(err => {
                    console.error(err);
                    this.close();
                    this.setState({ loading: false });
                });
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
                            onClick={this.handleSave}
                    >Save</Button>
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