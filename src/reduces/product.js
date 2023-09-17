const initState = {
    modalForm: null,//控制弹窗的显示隐藏
}

export default (state = initState, action) => {
    const { type, data } = action;
    switch (type) {
        case 'showModalForm':
            return { ...state, modalForm: data }
        case 'hideModalForm':
            return { ...state, modalForm: null }
        default:
            return initState

    }
}