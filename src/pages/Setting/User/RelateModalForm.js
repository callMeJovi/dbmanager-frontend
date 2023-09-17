import React from "react";
import { message, Modal, Table } from "antd";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: [], selectedKeys: [] };
  }
  componentDidMount() {
    // 获取所有权限为不限制的菜单
    global.service.get("/api/user/relateMenus").then((data) => {
      this.setState({ dataSource: data.records });
    });
  }
  onCancel = () => {
    this.props.dispatch({
      type: "hideRelateModalForm",
    });
  };
  onSave = () => {
    global.service
      .post("/api/user/updateRelatedMenus", {
        relatedMenus: this.state.selectedKeys.join(","),
        id: this.props.data.id,
      })
      .then((data) => {
        message.success("Operation successful!");
        this.onCancel();
        this.props.refreshList();
      });
  };
  getTableProps = () => ({
    rowKey: "id",
    columns: [
      {
        title: "Menu",
        dataIndex: "name",
      },
      {
        title: "Path",
        dataIndex: "linkUrl",
      },
    ],
    dataSource: this.state.dataSource,
    pagination: false,
    rowSelection: {
      defaultSelectedRowKeys: this.props.data.relatedMenus
        ? this.props.data.relatedMenus.split(",").map((item) => item - 0)
        : [],
      checkStrictly: false,
      onChange: (selectedRowKeys) => {
        console.log(selectedRowKeys);
        this.setState({ selectedKeys: selectedRowKeys });
      },
    },
  });
  render() {
    return (
      <Modal
        visible
        width={600}
        title={this.props.title}
        onCancel={this.onCancel}
        onOk={this.onSave}
      >
        <Table {...this.getTableProps()} />
      </Modal>
    );
  }
}
