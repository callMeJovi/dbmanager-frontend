/* eslint-disable import/no-anonymous-default-export */
const initState = {
    modalForm: null
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