<template>
    <div class="container see_file_box">
        <div style="margin-bottom: 8px">查看文件 - {{serialNo}}</div>
        <div v-if='isShow' style="height: 100px;font-size:20px">暂无相关文件</div>
        <el-tabs v-else tab-position="left" type='card' v-model.trim="editableTabsValue" @tab-click="chenckTab">
            <el-tab-pane v-for="item in fileList" :label="item.docType|componentFilter" :key="item.docId">
                <div class="img_box" v-viewer :images="item.docAttachments">
                    <img class="img" :class="['box', theme]" v-contextmenu:contextmenu
                        v-for="(src,index) in item.docAttachments" @contextmenu.prevent="rightShow(src)" title='点击可预览'
                        :src="src.docHttpUrl" :key="index" v-on:error="moveErrorImg($event)">
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="example">
            <v-contextmenu ref="contextmenu" :theme="theme">
                <v-contextmenu-item @click="handleDownload">下载</v-contextmenu-item>
            </v-contextmenu>
        </div>
    </div>
</template>


<script>
    import {
        getDocAttachment
    } from "@/axios/api"

    export default {

        props: {
            theme: {
                type: String,
            }
        },
        data() {
            return {
                errorImg: require("@/assets/img/fail_pic.png"),
                editableTabsValue: null,
                fileList: [],
                isShow: false,
                downloadImgInfo: null,
            };
        },
        created() {
            // 
            this.serialNo = this.$route.query.serialNo;
            // 
            this.getFileList()
        },
        mounted() {

        },

        methods: {
            chenckTab(tab, event) {
                console.log(tab, event);
                console.log(this.editableTabsValue);
            },
            handleClick(vm, event) {
                console.log(vm)
                console.log(event)
                alert(`「${vm.$slots.default[0].text}」被点击啦！`)
            },
            rightShow(resv) {
                console.log(resv, 44)
                this.downloadImgInfo = resv;
            },
            handleDownload() {
                console.log(this.downloadImgInfo, 11)
                this.downloadIamge(this.downloadImgInfo.docHttpUrl, this.downloadImgInfo.docName);
            },
            downloadIamge(imgsrc, name) { //下载图片地址和图片名
                var image = new Image();
                // 解决跨域 Canvas 污染问题
                image.setAttribute("crossOrigin", "anonymous");

                image.onload = function () {
                    console.log('进图了e')
                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0, image.width, image.height);
                    var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

                    var a = document.createElement("a"); // 生成一个a元素
                    var event = new MouseEvent("click"); // 创建一个单击事件
                    a.download = name || "photo"; // 设置图片名称

                    a.href = url; // 将生成的URL设置为a.href属性
                    a.dispatchEvent(event); // 触发a的单击事件
                };
                image.src = imgsrc;
            },
            // 获取数据
            getFileList() {
                getDocAttachment({
                    serialNo: this.serialNo,
                    fileType: 'file',
                    deleteFlag: '0'
                }).then(res => {
                    this.fileList = res.data;
                    this.isShow = this.fileList && this.fileList.length == 0 ? true : false;
                    console.log(res, 120)
                })
            },
            // 
            moveErrorImg: function (event) {
                event.currentTarget.src = this.errorImg;
            }
        },
        filters: {
            componentFilter: function (value) {
                switch (value) {
                    case 'A0019':
                        return '身份证正面'
                        break;
                    case 'A0020':
                        return '身份证反面'
                        break;
                    case 'CCS001':
                        return '银行卡正面'
                        break;
                    case 'CCS002':
                        return '银行卡反面'
                        break;
                    case 'CCS003':
                        return '申请人照片'
                        break;
                    default:
                        break;
                }
            }
        },
    };
</script>


<style scoped lang="scss">
    /deep/ .el-tabs__content {
        height: 100%;
    }

    /deep/ .el-tabs__header {
        min-width: 240px;
        max-width: 320px;
    }

    .see_file_box {

        /* display: flex; */
        height: 90%;
        width: 94%;
        min-height: 360px;

        .img_box {
            width: 96%;
            height: 100%;
            min-width: 500px;
            min-height: 360px;
            display: flex;
            justify-content: center;
            /* justify-content: space-around; */
            align-items: center;
            padding: 10px;
            border: 1px solid rgba(232, 236, 241, 1);
            overflow: auto;

            .img {
                display: inline-block;
                width: 50%;
                height: 100%;
                min-width: 260px;
                min-height: 220px;
                max-height: 350px;
                margin: 0 4px;
                box-shadow: rgb(153, 192, 231) 0px 0px 6px 2px;
            }
        }
    }
</style>