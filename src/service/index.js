import { message } from "antd";
import axios from "axios";

const doAxios = (url, method = 'get', params) => {
    return axios({
        headers: { Authorization: sessionStorage.getItem('token') },
        method,
        url,
        params: method == 'get' ? params : undefined,
        data: method == 'post' ? params : undefined,
    }).then((res) => {
        if (res.status == 200) {
            const { data } = res;
            if (data.code != '00000') {
                return Promise.reject(data)
            }
            return data
        }
    })
}

export default {
    get: (url, params) => {
        return doAxios(url, 'get', params)
    },
    post: (url, params) => {
        return doAxios(url, 'post', params)
    }
}