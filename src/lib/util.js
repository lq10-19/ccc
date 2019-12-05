import {
    random
} from "node-forge";
import {
    Message
} from "element-ui";

//判断是否为非负数
function isPosNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    if (regPos.test(val)) {
        return true;
    } else {
        return false;
    }
}

//判断是否为负数
function isNegNumber(val) {
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

//判断是否为正整数
function isInt(num) {
    let reg = /^\+?[1-9][0-9]*$/;
    if (reg.test(num)) {
        return true;
    } else {
        return false;
    }
}

//判断是否是基本类型
function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

//清空对象的属性值
function resetObj(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && isPrimitive(obj[key])) {
            obj[key] = "";
        } else {
            resetObj(obj[key])
        }
    }
}

//生成全局唯一id
function uuid(attr) {
    let timeStamp = new Date().getTime();
    return (attr || "rzzl-") + timeStamp + 10000 * Math.random();
}



//防抖功能函数
let timer = null;

function debounce(fn, interval) {

    return function () {

        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn.call(this, arguments);
        }, interval);
    }();
}




//还款规则
function repayRule(prefix, value) {
    let reg;
    if (prefix === "T") {
        reg = /^T[0-9]{3}$/
    } else if (prefix === "W") {
        reg = /^W[0-9]{3}$/
    } else if (prefix === "C") {
        reg = /^C[0-9]{3}$/
    }
    if (reg.test(value)) {
        return true;
    } else {
        return false
    }

}


//校验日期时间范围
function checkDateTime(start, end) {
    start = Date.parse(start);
    end = Date.parse(end);
    let now = Date.now();
    if (start >= end) {
        Message.error("请输入正确的日期范围");
        return false;
    } else if (end < now) {
        Message.error("日期结束时间不能小于当前时间")
        return false;
    }
    return true;
}

//费用项ID
function isFeeId(id) {
    let reg = /^[A-Z0-9]+$/;
    if (reg.test(id)) {
        return true;
    } else {
        Message.error("费用项ID格式错误");
        return false
    }
}

//特殊字符过滤
function stringFilter(str) {
    var reg = /[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？ %]/g;
    if (reg.test(str)) {
        return str.replace(reg, "")
    } else {
        return str;
    }
}

// 处理文件转图片图片
function imgPreview(file) {

    return new Promise((resolve, reject) => {
        let Orientation;

        //去获取拍照时的信息，解决拍出来的照片旋转问题  
        // Exif.getData(file, function () {
        //     Orientation = Exif.getTag(this, 'Orientation');
        // });
        // 看支持不支持FileReader  
        if (!file || !window.FileReader) {
            reject();
            return;
        }

        if (/^image/.test(file.type)) {
            // 创建一个reader  
            let reader = new FileReader();
            // 将图片2将转成 base64 格式  
            reader.readAsDataURL(file);
            // 读取成功后的回调  
            reader.onloadend = function () {
                let result = this.result;
                let img = new Image();
                img.src = result;
                //判断图片是否大于100K,是就直接上传，反之压缩图片  
                // if (this.result.length <= (100 * 1024)) {
                //     resolve(this.result);
                //     return;
                // } else {
                //     img.onload = () => {
                //         resolve(compress(img, Orientation));
                //         return;
                //     }
                // }
                // 直接压缩
                img.onload = () => {
                    resolve(compress(img, Orientation));
                    return;
                }
            }
        }
    });

}
const rotateImg = (img, direction, canvas) => {
    //最小与最大旋转方向，图片旋转4次后回到原方向      
    const min_step = 0;
    const max_step = 3;
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错      
    let height = img.height;
    let width = img.width;
    let step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值      
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //旋转角度以弧度值为参数      
    let degree = step * 90 * Math.PI / 180;
    let ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
};


const compress = (img, Orientation) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    //瓦片canvas  
    let tCanvas = document.createElement("canvas");
    let tctx = tCanvas.getContext("2d");
    let initSize = img.src.length;
    let width = img.width;
    let height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下  
    let ratio;
    if ((ratio = width * height / 4000000) > 1) {
        //大于400万像素
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    } else {
        ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    //        铺底色  
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制  
    let count;
    if ((count = width * height / 1000000) > 1) {
        //超过100W像素
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片  
        //            计算每块瓦片的宽和高  
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0,
                    nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }
    //修复ios上传图片的时候 被旋转的问题  
    if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
            case 6: //需要顺时针（向左）90度旋转  
                rotateImg(img, 'left', canvas);
                break;
            case 8: //需要逆时针（向右）90度旋转  
                rotateImg(img, 'right', canvas);
                break;
            case 3: //需要180度旋转  
                rotateImg(img, 'right', canvas); //转两次  
                rotateImg(img, 'right', canvas);
                break;
        }
    }
    //进行最小压缩  
    let ndata = canvas.toDataURL('image/jpeg', 0.4);
    // console.log('压缩前：' + initSize);
    // console.log('压缩前：' + initSize / 1024 / 1024);
    // console.log('压缩后：' + ndata.length);
    // console.log('压缩后：' + ndata.length / 1024 / 1024);
    // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
};

//小数点位数设置
function decimalFilter2(val) {
    let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
    if (!reg.test(val)) {
        return val.replace(reg, "")
    } else {
        return val;
    }
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


export {
    isPosNumber,
    isNegNumber,
    isInt,
    isPrimitive,
    resetObj,
    uuid,
    debounce,
    repayRule,
    imgPreview,
    checkDateTime,
    isFeeId,
    stringFilter,
    decimalFilter2
}