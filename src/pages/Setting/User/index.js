import React from "react";
import { Panel } from "../../../components";
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  Avatar,
  Modal,
  message,
} from "antd";
import { connect } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import ModalForm from "./ModalForm";
import RelateModalForm from "./RelateModalForm";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: [], pagination: {}, filters: {} };
  }
  componentDidMount() {
    this.onGetList();
  }
  onGetList = (params = {}) => {
    global.service.get("/api/user/list", params).then((data) => {
      this.setState({ dataSource: data.records, pagination: data.pagination });
    });
  };
  onSearch = (values) => {
    console.log(values);
    this.setState({ filters: values });
    this.onGetList(values);
  };
  onAdd = () => {
    this.props.dispatch({
      type: "showModalForm",
      data: {
        title: "Add new",
        data: {},
        refreshList: this.onGetList,
      },
    });
  };
  onView = (record) => {
    return () => {
      this.props.dispatch({
        type: "showModalForm",
        data: {
          title: "Details",
          data: { ...record, area: record.area.split(",") },
        },
      });
    };
  };
  onEdit = (record) => {
    return () => {
      this.props.dispatch({
        type: "showModalForm",
        data: {
          title: "Edit",
          data: { ...record, area: record.area.split(",") },
          refreshList: this.onGetList,
        },
      });
    };
  };
  onRemove = (record) => {
    return () => {
      Modal.confirm({
        title: "Delete",
        content: "Are you sure you want to delete this item ?",
        onOk: () => {
          global.service
            .post("/api/user/delete", { id: record.id })
            .then((data) => {
              message.success("Operation successful !");
              this.onGetList();
            });
        },
      });
    };
  };
  onRelateMenu = (record) => {
    return () => {
      this.props.dispatch({
        type: "showRelateModalForm",
        data: {
          title: "Menu configuration", //configurate menu
          data: record,
          refreshList: this.onGetList,
        },
      });
    };
  };
  getTableProps = () => ({
    onChange: (pagination) => {
      // filter user
      this.onGetList({ ...pagination, ...this.state.filters });
    },
    // pagination
    pagination: {
      ...this.state.pagination,
      showTotal: (total) => `${total} users in total`,
    },
    columns: [
      {
        title: "Username",
        dataIndex: "name",
        render: (text, record) => {
          return (
            <Space>
              <Avatar src={record.picture} />
              {text}
            </Space>
          );
        },
      },
      {
        title: "Account",
        dataIndex: "account",
      },
      {
        title: "Contact",
        dataIndex: "tel",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Operation",
        render: (record) => {
          return (
            <Space>
              <a onClick={this.onView(record)}>View</a>
              <a onClick={this.onEdit(record)}>Edit</a>
              <a onClick={this.onRemove(record)}>Delete</a>
              <a onClick={this.onRelateMenu(record)}>Relevant menu</a>
            </Space>
          );
        },
      },
    ],
    dataSource: this.state.dataSource,
  });
  render() {
    const { modalForm, relateModalForm } = this.props.userState;
    return (
      <Panel title="User Management">
        <Card className="m-filter">
          <Form layout="inline" onFinish={this.onSearch}>
            <Form.Item label="username" name="name">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card>
          <div className="m-operate">
            <Button type="primary" icon={<PlusOutlined />} onClick={this.onAdd}>
              Add new
            </Button>
          </div>
          <Table {...this.getTableProps()} />
        </Card>
        {modalForm && <ModalForm {...modalForm} {...this.props} />}
        {relateModalForm && (
          <RelateModalForm {...relateModalForm} {...this.props} />
        )}
      </Panel>
    );
  }
}

const mapStateToProps = (store) => ({ userState: store.user });
const mapDispatchToProps = (dispatch) => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(User);
