const initState = {
  modalForm: null, //控制弹窗的显示隐藏
  relateModalForm: null, //control the window of menu configuration 控制配置菜单弹窗的显示隐藏
};

export default (state = initState, action) => {
  const { type, data } = action;
  switch (type) {
    case "showModalForm":
      return { ...state, modalForm: data };
    case "hideModalForm":
      return { ...state, modalForm: null };
    case "showRelateModalForm":
      return { ...state, relateModalForm: data };
    case "hideRelateModalForm":
      return { ...state, relateModalForm: null };
    default:
      return initState;
  }
};
