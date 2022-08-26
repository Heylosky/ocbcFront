import axios from 'axios'

axios.defaults.withCredentials=true;

export function requestGet(url, config, success, failure) {
    const instance = axios.create({
        method: 'get',
        baseURL: 'http://127.0.0.1:8000',
        timeout: 5000,
        withCredentials: true,
    })
    instance(config).then(res => {
        // console.log(res);
        success(res)
    }).catch(err => {
        // console.log(err);
        failure(err)
    })
}

export function requestGet2(config, success, failure) {
    const instance10 = axios.create({
        baseURL: 'https://admin.orangemeeting.com:8010',
        // baseURL: 'https://henry.sdesk.vip:8010',
        timeout: 5000,
        withCredentials: true,
    })

    instance10(config).then(res => {
        success(res)
    }).catch(err => {
        failure(err)
    })
}

export function requestPost(url, data, config, success, failure) {
    const instancePost = axios.create({
        method: 'post',
        baseURL: 'https://admin.orangemeeting.com:8010',
        // baseURL: 'https://henry.sdesk.vip:8010',
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true,
    })
    instancePost.post(url, data, config).then(res => {
        success(res)
    }).catch(err => {
        failure(err)
    })
}