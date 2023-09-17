import React from "react";
import { Modal, Form, Input, message } from "antd";
import { AreaCascader, Upload } from "../../../components";

class ModalForm extends React.Component {
  formRef = React.createRef();
  componentDidMount() {
    this.formRef.current.setFieldsValue(this.props.data);
  }
  onSave = (values) => {
    console.log(values);
    if (this.props.title == "Add new") {
      global.service
        .post("/api/user/add", { ...values, area: values.area.join(",") })
        .then((data) => {
          message.success("Operation successful");
          this.onCancel();
          // 刷新列表
          this.props.refreshList();
        });
      return;
    }
    global.service
      .post("/api/user/update", {
        ...values,
        area: values.area.join(","),
        id: this.props.data.id,
      })
      .then((data) => {
        message.success("Operation successful");
        this.onCancel();
        // 刷新列表
        this.props.refreshList();
      });
  };
  onCancel = () => {
    this.props.dispatch({
      type: "hideModalForm",
    });
  };
  onAreaChange = (value) => {
    this.formRef.current.setFieldsValue({ area: value });
  };
  onPictureChange = (value) => {
    console.log(value);
    this.formRef.current.setFieldsValue({ picture: value });
  };
  layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  render() {
    const { data = {} } = this.props;
    const readonly = this.props.title == "Details" ? true : false;
    return (
      <Modal
        visible
        width={600}
        title={this.props.title}
        onOk={() => this.formRef.current.submit()}
        onCancel={this.onCancel}
        className={readonly ? "m-readonly-modal" : ""}
      >
        <Form {...this.layout} onFinish={this.onSave} ref={this.formRef}>
          <Form.Item label="Username" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Account"
            name="account"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Location" name="area" rules={[{ required: true }]}>
            <AreaCascader
              onChange={this.onAreaChange}
              defaultValue={data.area}
            />
          </Form.Item>
          <Form.Item
            label="Contact"
            name="tel"
            rules={[
              { required: true },
              {
                pattern:
                  /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/,
                message: "start with 06 for example",
                //   /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Upload a pic" name="picture">
            <Upload
              onChange={this.onPictureChange}
              defaultFileList={data.picture ? data.picture.split(",") : []}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ModalForm;
