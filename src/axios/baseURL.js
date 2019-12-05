const NODE_ENV = process.env.NODE_ENV


let baseURL_M = ''; //移动端服务
let baseURL = ''; //pc后台服务
let baseURL_X = ''; //excel


if (NODE_ENV === 'development') {
    // 开发环境
    // baseURL = 'http://10.80.12.37:8004';
    // baseURL = 'http://10.81.2.211:8004';//沐泽

    // baseURL = 'http://10.81.2.148:8004'; //刘康
    // baseURL_M = 'http://10.81.2.148:8008'; //刘康

    // baseURL = 'http://10.80.12.39:8004';//碧远
    // baseURL = 'http://10.80.12.32:8004'; //贤达
    // baseURL = 'http://10.80.12.20:8004'; //贤达
    // baseURL = 'http://10.80.12.33:8004'; //洁亮
    // // baseURL_M = 'http://10.80.12.37:8008';
    // baseURL_M = 'http://10.80.12.32:8008'; //贤达

    // baseURL = 'http://10.83.36.174:8004';
    // baseURL_M = 'http://10.83.36.177:8008';
    // baseURL = 'http://10.81.2.204:8004'; //黄彦富

    baseURL = 'http://sitccsapi.bqzulin.com:94/loan/';
    baseURL_M = 'http://sitccsapi.bqzulin.com:94/wechat/';
    baseURL_X = 'http://sitccsupload.bqzulin.com/';

    // baseURL = 'http://10.10.1.168:8003/loan/';
    // baseURL_M = 'http://10.10.1.168:8003/wechat/';
    // baseURL_X = 'http://sitccsupload.bqzulin.com/';

} else if (NODE_ENV === 'sit') {
    // 测试环境 sit
    // baseURL = 'http://10.83.36.174:8004';
    // baseURL_M = 'http://10.83.36.172:8008';
    baseURL = 'http://sitccsapi.bqzulin.com:94/loan/';
    baseURL_M = 'http://sitccsapi.bqzulin.com:94/wechat/';
    baseURL_X = 'http://sitccsupload.bqzulin.com/';
} else if (NODE_ENV === 'uat') {
    // 测试环境 uat
    baseURL = 'http://uatccsapi.bqzulin.com:98/loan/';
    baseURL_M = 'http://uatccsapi.bqzulin.com:98/wechat/';
    baseURL_X = 'http://uatccsupload.bqzulin.com/';
    
} else if (NODE_ENV === 'production') {
    // 生产环境
    baseURL = 'https://ccsapi.bqrzzl.com/loan/';
    baseURL_M = 'https://ccsapi.bqrzzl.com/wechat/';
    baseURL_X = 'https://ccsapi.bqrzzl.com/';
}

export {
    baseURL_M,
    baseURL,
    baseURL_X
}