import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Dropdown,
  Space,
  Pagination,
  message,
} from "antd";
import { icons } from "../../../components";
import _ from "lodash";

class ModalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { allIcons: icons, currentIcons: icons.slice(0, 10) };
  }
  formRef = React.createRef();
  onCancel = () => {
    // close window
    this.props.dispatch({
      type: "hideModalForm",
    });
  };
  onSave = (values) => {
    console.log(values);
    if (this.props.title == "Add new") {
      global.service
        .post("/api/menu/add", { ...values, pid: this.props.data.pid })
        .then((data) => {
          console.log(data);
          message.success("Operation successful");
          this.onCancel(); //关闭弹窗
          this.props.refreshList();
          window.dispatchEvent(new Event("refreshMenus"));
        });
      return;
    }
    global.service
      .post("/api/menu/update", {
        ...values,
        pid: this.props.data.pid,
        id: this.props.data.id,
      })
      .then((data) => {
        console.log(data);
        message.success("Operation successful");
        this.onCancel(); //关闭弹窗
        this.props.refreshList();
        window.dispatchEvent(new Event("refreshMenus"));
      });
  };
  onIconFilter = (e) => {
    // 获取输入框内容
    let { value } = e.target;
    value = _.trim(value);
    const newIcons = []; //存放过滤后的数据
    if (value) {
      //    对所有的图标进行遍历，判断图标的组件名称是否输入的关键字
      icons.map((item) => {
        // 将组件名称与输入的关键字字符串都转为小写
        if (_.lowerCase(item.name).indexOf(_.lowerCase(value)) !== -1) {
          newIcons.push(item);
        }
      });
      this.setState({
        icon: value,
        allIcons: newIcons,
        currentIcons: newIcons.slice(0, 10),
      });
      return;
    }
    this.setState({
      icon: value,
      allIcons: icons,
      currentIcons: icons.slice(0, 10),
    });
  };
  onIconChange = (e) => {
    // 获取到被选中的图标的value值
    const { value } = e.target;
    this.setState({ icon: value });
    // 手动设置icon
    this.formRef.current.setFieldsValue({ icon: value });
  };
  componentDidMount() {
    // 设置form表单数据
    const { data = {} } = this.props;
    this.formRef.current.setFieldsValue(data);
    this.setState({ icon: data.icon });
    // 根据pid获取父级菜单名称
    data.pid &&
      data.pid != -1 &&
      global.service
        .get("/api/menu/getMenuName", { id: data.pid })
        .then((data) => {
          this.setState({ pName: data.record.name });
        });
  }

  layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  render() {
    const readonly = this.props.title == "Details" ? true : false;
    return (
      <Modal
        visible
        width={600}
        title={this.props.title}
        onCancel={this.onCancel}
        onOk={() => this.formRef.current.submit()}
        className={readonly ? "m-readonly-modal" : ""}
      >
        <Form {...this.layout} ref={this.formRef} onFinish={this.onSave}>
          <Form.Item label="Primary Menu">
            {this.state.pName || "None"}
          </Form.Item>
          <Form.Item
            label="Menu label"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Access address"
            name="linkUrl"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Open with"
            name="openType"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="1">current tag</Select.Option>
              <Select.Option value="2">a new tag</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Symbol" name="icon" rules={[{ required: true }]}>
            <Dropdown
              trigger={["click"]}
              overlayStyle={{ background: "#fff", padding: 10 }}
              overlay={
                <>
                  <Radio.Group onChange={this.onIconChange}>
                    <Space direction="vertical">
                      {this.state.currentIcons.map((item) => {
                        return (
                          <Radio value={item.name}>
                            {React.createElement(item.renderFn)}
                            <span style={{ margin: 5 }}>{item.name}</span>
                          </Radio>
                        );
                      })}
                    </Space>
                  </Radio.Group>
                  <div style={{ textAlign: "right", padding: 10 }}>
                    <Pagination
                      showSizeChanger={false}
                      size="small"
                      total={this.state.allIcons.length}
                      onChange={(page, pageSize) =>
                        this.setState({
                          currentIcons: this.state.allIcons.slice(
                            pageSize * (page - 1),
                            pageSize * page
                          ),
                        })
                      }
                    />
                  </div>
                </>
              }
            >
              <Input
                prefix={React.createElement(
                  (
                    _.find(
                      this.state.allIcons,
                      (item) => item.name == this.state.icon
                    ) || {}
                  ).renderFn || "span"
                )}
                onChange={this.onIconFilter}
                value={this.state.icon}
              />
            </Dropdown>
          </Form.Item>

          <Form.Item label="Access" name="isOfAdmin" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="1">Only Admin</Radio>
              <Radio value="2">everyone</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default ModalForm;
