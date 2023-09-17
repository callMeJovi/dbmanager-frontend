import React from "react";
import { Cascader } from "antd";
import _ from "lodash";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options: [], defaultValue: props.defaultValue };
  }
  componentDidMount() {
    const { defaultValue } = this.state;
    global.service.get("/api/area/province").then(({ records = [] }) => {
      records.map((item) => (item.isLeaf = false));
      this.setState({ options: records });
      // 有默认值的时候自动获取市跟区
      if (defaultValue && defaultValue.length) {
        this.onInit(records);
      }
    });
  }
  /**
   * records:要被查找的对象
   * index:defaultValue的下标
   */
  onInit = (records, index = 0) => {
    const item =
      _.find(records, (item) => item.value == this.state.defaultValue[index]) ||
      {};
    if (index == 2) return;
    this.onRequestCityOrRegion(item).then((data) => {
      this.onInit(data, index + 1);
    });
  };
  // loading dynamically province and region
  onRequestCityOrRegion = (parent) => {
    const isLeaf = String(parent.id).length == 2 ? true : false;
    return global.service
      .get(`/api/area/${isLeaf ? "region" : "city"}`, { pid: parent.id })
      .then((data) => {
        data.records.map((item) => (item.isLeaf = isLeaf));
        parent.children = data.records;
        this.setState({ options: [...this.state.options] });
        return data.records;
      });
  };
  loadData = (selectedOptions = []) => {
    const selectedOption = selectedOptions[selectedOptions.length - 1];
    this.onRequestCityOrRegion(selectedOption);
  };
  render() {
    return (
      <Cascader
        placeholder="Province/city/district"
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.props.onChange}
        defaultValue={this.state.defaultValue}
      />
    );
  }
}
