import Vue from 'vue';

// 使用 Event Bus
const bus = new Vue({
    data:{
        globalData:{
            curUrl:'',
            request:0 //正在请求的数量
        }
    },
    watch:{
        ['globalData.request'](newV) {
            console.log(newV)
        }
    }
});

export default bus;