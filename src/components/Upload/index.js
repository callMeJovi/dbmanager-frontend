import React from "react";
import { Upload, Space, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import _ from "lodash";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.fileUrlList = []; //store the path of uploading pic
    this.state = {
      defaultFileList:
        this.props.defaultFileList.map((item, index) => {
          this.fileUrlList.push(item);
          return { uid: index, url: item };
        }) || [],
    };
  }
  render() {
    const uploadProps = {
      headers: { Authorization: sessionStorage.token },
      action: "/api/upload",
      listType: "picture-card",
      maxCount: this.props.maxCount || 1,
      defaultFileList: this.state.defaultFileList,
      onChange: (info) => {
        const { file, fileList } = info;
        const { response } = file;
        if (file.status == "done") {
          // storage of the paths of all files（including the existing files by default）
          this.fileUrlList = [];
          fileList.map((item) => {
            this.fileUrlList.push(item.url || item.response.file.url);
          });
          this.props.onChange &&
            this.props.onChange(this.fileUrlList.join(","));
        } else if (file.status == "error") {
          message.error("upload failed !");
        }
      },
      onRemove: (file) => {
        // delete files
        _.remove(
          this.fileUrlList,
          (item) => (file.url || file.response.file.url) == item
        );
        this.props.onChange && this.props.onChange(this.fileUrlList.join(","));
      },
      onPreview: (file) => {
        this.setState({
          prevewModal: { url: file.url || file.response.file.url },
        });
      },
    };
    return (
      <>
        <Upload {...uploadProps}>
          <Space direction="vertical">
            <PlusOutlined />
            <div style={{ margin: 8 }}>Upload</div>
          </Space>
        </Upload>
        {this.state.prevewModal && (
          <Modal
            title="preview"
            footer={null}
            visible
            onCancel={() => this.setState({ prevewModal: null })}
          >
            <img
              src={this.state.prevewModal.url}
              style={{ width: "100%", height: 500 }}
            />
          </Modal>
        )}
      </>
    );
  }
}
