import React from 'react';
import { Form, Icon, Input, Button, Modal } from 'antd';

const FormItem = Form.Item;

class EditSeason extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false
        };
        this.close = this.close.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleOk = () => {
        this.close();
    };

    handleCancel = () => {
        this.close();
    };

    close = () => {
        if (this.props.hide) { this.props.hide() }
    };

    handleChange(e) {
        this.setState({value: e.target.value});
    };

    render() {
        if (!this.props.season()) return null;
        const season = this.props.season();
        //FORM
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        //MODAL
        const { loading } = this.state;
        return (
            <Modal
                visible={this.props.visible}
                title={'Edit season'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit"
                            type="primary"
                            loading={loading}
                            onClick={this.handleOk}
                    >Save</Button>
                ]}
            >
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <FormItem>
                        <Input placeholder={season.name} />
                    </FormItem>
                    <FormItem>
                        <Input placeholder={season.budget} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(EditSeason);