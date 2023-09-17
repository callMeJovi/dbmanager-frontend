import React, { useState, useEffect } from "react";
import { Panel } from "../../../components";
import {
  Card,
  Select,
  Form,
  Input,
  Button,
  List,
  Space,
  Avatar,
  Modal,
  message,
} from "antd";
import { connect } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import ModalForm from "./ModalForm";

function Product(props) {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});

  useEffect(() => {
    onGetList();
  }, []);

  const onGetList = (params = {}) => {
    global.service.get("/api/product/list", params).then((data) => {
      setDataSource(data.records);
      setPagination(data.pagination);
    });
  };
  const onSearch = (values) => {
    console.log(values);
    setFilters(values);
    onGetList(values);
  };
  const onAdd = () => {
    props.dispatch({
      type: "showModalForm",
      data: {
        title: "Add new",
        data: {},
        refreshList: onGetList,
      },
    });
  };
  const onView = (record) => {
    return () => {
      props.dispatch({
        type: "showModalForm",
        data: {
          title: "Details",
          data: { ...record, attrs: JSON.parse(record.attrs) },
        },
      });
    };
  };
  const onEdit = (record) => {
    return () => {
      props.dispatch({
        type: "showModalForm",
        data: {
          title: "Edit",
          data: { ...record, attrs: JSON.parse(record.attrs) },
          refreshList: onGetList,
        },
      });
    };
  };
  const onRemove = (record) => {
    return () => {
      Modal.confirm({
        title: "Delete",
        content: "Are you sure you want to delete this item ?",
        onOk: () => {
          global.service
            .post("/api/product/delete", { id: record.id })
            .then((data) => {
              message.success("Operation Successful !");
              onGetList();
            });
        },
      });
    };
  };

  const { modalForm } = props.productState;
  return (
    <Panel title="Product manangement">
      <Card className="m-filter">
        <Form layout="inline" onFinish={onSearch}>
          <Form.Item label="Product label" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Product type" name="type">
            <Select style={{ width: 200 }} allowClear>
              <Select.Option value="0">Book</Select.Option>
              <Select.Option value="1">Cloth</Select.Option>
              <Select.Option value="2">Electrical appliance</Select.Option>
              <Select.Option value="3">Furniture</Select.Option>
              <Select.Option value="4">Digital</Select.Option>
              <Select.Option value="5">Grocery</Select.Option>
            </Select>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Add new
          </Button>
        </div>
        {/* List列表组件 */}
        <List
          dataSource={dataSource}
          pagination={{
            ...pagination,
            showTotal: (total) => `${total} products in total`,
            onChange: (current) => onGetList({ ...filters, current }),
          }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a onClick={onView(item)}>View</a>,
                <a onClick={onEdit(item)}>Edit</a>,
                <a onClick={onRemove(item)}>Delete</a>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.mainPic} />}
                title={item.name}
                description={
                  [
                    "book",
                    "cloth",
                    "Electrical appliance",
                    "Furniture",
                    "Digital",
                    "Grocery",
                  ][item.type]
                }
              />
              <Space>
                {item.price ? (
                  <span style={{ color: "red" }}>{`¥${item.price}`}</span>
                ) : null}
                <span>
                  {JSON.parse(item.attrs).map(
                    (attr) => attr.key + ":" + attr.value + ";"
                  )}
                </span>
              </Space>
            </List.Item>
          )}
        ></List>
      </Card>
      {modalForm && <ModalForm {...modalForm} {...props} />}
    </Panel>
  );
}

const mapStateToProps = (store) => ({ productState: store.product });
const mapDispatchToProps = (dispatch) => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(Product);
