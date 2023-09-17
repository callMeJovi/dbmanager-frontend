/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Button, Card, Table, Space, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Panel } from "../../../components";
import { connect } from "react-redux";
import ModalForm from "./ModalForm";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }

  // 请求列表
  onGetList = () => {
    global.service.get("/api/menu/list").then((data) => {
      console.log(data);
      this.setState({ dataSource: data.records });
    });
  };
  componentDidMount() {
    this.onGetList();
  }

  onAdd = (record) => {
    // 打开弹窗
    return () => {
      this.props.dispatch({
        type: "showModalForm",
        data: {
          title: "Add new", //弹窗的标题
          data: record ? { pid: record.id } : {}, //表单数据
          refreshList: this.onGetList,
        },
      });
    };
  };
  onView = (record) => {
    return () => {
      this.props.dispatch({
        type: "showModalForm",
        data: {
          title: "Details", //弹窗的标题
          data: record, //表单数据
        },
      });
    };
  };
  onEdit = (record) => {
    return () => {
      this.props.dispatch({
        type: "showModalForm",
        data: {
          title: "Edit", //弹窗的标题
          data: record, //表单数据
          refreshList: this.onGetList,
        },
      });
    };
  };
  onRemove = (record) => {
    return () => {
      Modal.confirm({
        title: "Delete",
        content: "Are you sure you want to delete the item?",
        onOk: () => {
          global.service
            .post("/api/menu/delete", { id: record.id })
            .then((data) => {
              message.success("Operation successful");
              this.onGetList();
              window.dispatchEvent(new Event("refreshMenus"));
            });
        },
      });
    };
  };
  getTableProps = () => {
    return {
      columns: [
        {
          title: "Menu",
          dataIndex: "name",
        },
        {
          title: "Access address",
          dataIndex: "linkUrl",
        },
        {
          title: "Operation",
          render: (record) => (
            <Space>
              <a onClick={this.onView(record)}>View</a>
              <a onClick={this.onEdit(record)}>Edit</a>
              <a onClick={this.onRemove(record)}>Delete</a>
              <a onClick={this.onAdd(record)}>Add</a>
            </Space>
          ),
        },
      ],
      dataSource: this.state.dataSource || [],
      rowKey: "id",
      pagination: false,
    };
  };
  render() {
    const { modalForm } = this.props.menuState;
    return (
      <Panel title="Menu Management">
        <div className="m-operate">
          <Button type="primary" icon={<PlusOutlined />} onClick={this.onAdd()}>
            Add new
          </Button>
        </div>
        <Card>
          {/* 列表组件 */}
          <Table {...this.getTableProps()} />
        </Card>
        {modalForm && <ModalForm {...modalForm} {...this.props} />}
      </Panel>
    );
  }
}
const mapStateToProps = (store) => ({ menuState: store.menu });
const mapDispatchToProps = (dispatch) => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(Menu);
