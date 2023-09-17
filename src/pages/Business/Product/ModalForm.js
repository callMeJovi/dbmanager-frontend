import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Radio,
  InputNumber,
  Select,
  Space,
  Button,
} from "antd";
import { Upload, Editor } from "../../../components";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function ModalForm(props) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(props.data);
  }, []);

  const onSave = (values) => {
    console.log(values);
    if (props.title == "Add new") {
      global.service
        .post("/api/product/add", {
          ...values,
          attrs: JSON.stringify(values.attrs),
        })
        .then((data) => {
          message.success("Operation successful !");
          onCancel();
          // 刷新列表
          props.refreshList();
        });
      return;
    }
    global.service
      .post("/api/product/update", {
        ...values,
        attrs: JSON.stringify(values.attrs),
        id: props.data.id,
      })
      .then((data) => {
        message.success("Operation successful !");
        onCancel();
        // 刷新列表
        props.refreshList();
      });
  };
  const onCancel = () => {
    props.dispatch({
      type: "hideModalForm",
    });
  };

  const onMainPicChange = (value) => {
    console.log(value);
    form.setFieldsValue({ mainPic: value });
  };
  const onMorePicChange = (value) => {
    console.log(value);
    form.setFieldsValue({ morePic: value });
  };
  const onDescChange = (html) => {
    console.log(html);
    form.setFieldsValue({ descs: html });
  };
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const { data = {} } = props;
  const readonly = props.title == "Details" ? true : false;
  return (
    <Modal
      visible
      width={600}
      title={props.title}
      onOk={() => form.submit()}
      onCancel={onCancel}
      className={readonly ? "m-readonly-modal" : ""}
    >
      <Form {...layout} onFinish={onSave} form={form}>
        <Form.Item
          label="Product label"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Product type"
          name="type"
          rules={[{ required: true }]}
        >
          <Select style={{ width: 200 }}>
            <Select.Option value="0">Book</Select.Option>
            <Select.Option value="1">Cloth</Select.Option>
            <Select.Option value="2">Electrical appliance</Select.Option>
            <Select.Option value="3">Furniture</Select.Option>
            <Select.Option value="4">Digital</Select.Option>
            <Select.Option value="5">Grocery</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Attrs" required>
          <Form.List
            name="attrs"
            rules={[
              { required: true, message: "Please enter item characteristics" },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ name }) => (
                  <Space align="baseline">
                    <Form.Item
                      name={[name, "key"]}
                      rules={[{ required: true, message: "Can not be empty" }]}
                    >
                      <Input placeholder="color/size/spec/...." />
                    </Form.Item>
                    <Form.Item
                      name={[name, "value"]}
                      rules={[{ required: true, message: "Can not be empty" }]}
                    >
                      <Input placeholder="Attribute label" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                  >
                    {" "}
                    Add new attributes
                  </Button>
                </Form.Item>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item label="Product view" name="mainPic">
          <Upload
            onChange={onMainPicChange}
            defaultFileList={data.mainPic ? data.mainPic.split(",") : []}
          />
        </Form.Item>
        <Form.Item label="Detailed view" name="morePic">
          <Upload
            onChange={onMorePicChange}
            maxCount={5}
            defaultFileList={data.morePic ? data.morePic.split(",") : []}
          />
        </Form.Item>
        <Form.Item
          label="Available for sale"
          name="isOnShelf"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value="1">Yes</Radio>
            <Radio value="0">No</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              validator: (rule, value) => {
                if (form.getFieldValue("isOnShelf") == 1 && !value) {
                  return Promise.reject(new Error("Please enter the price"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item label="Details" name="descs" rules={[{ required: true }]}>
          {readonly ? (
            <div dangerouslySetInnerHTML={{ __html: data.descs }}></div>
          ) : (
            <Editor onChange={onDescChange} defaultValue={data.descs} />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalForm;
