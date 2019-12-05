<template>
    <div class="see_file_box">
        <el-dialog title="上传" :visible.sync="isShowModal" :before-close="modalClose" width="800px">
            <div class="tietle_box">
                <div class="title">附件资料</div>
                <div class="btn_box">
                    <!-- 上传 -->
                    <div class="upload">
                        <input class="hides" accept="image/jpg, image/png, image/pdf" ref="referenceUploadp" type="file"
                            @change="upload($event)">
                    </div>
                    <!-- 删除 -->
                    <!-- <div class="upload delete">
                        <div class="hides" @click="deleteHand"></div>
                    </div> -->
                    <!-- <el-button type="primary"> 删除<i class="el-icon-delete el-icon--right"></i></el-button> -->
                </div>
            </div>
            <el-tabs tab-position="left" type='card' v-model.trim="editableTabsValue" @tab-click="chenckTab">
                <el-tab-pane v-for="item in docLIst" :label="item.name" :key="item.id">
                    <div class="img_box" v-viewer :images="item.docAttachments">
                        <img class="img" v-for="(src,index) in item.docAttachments" :class="['box', theme]"
                            v-contextmenu:contextmenu @contextmenu.prevent="rightShow(src)" title='点击可预览'
                            :src="src.docHttpUrl" :key="index" v-on:error="moveErrorImg($event)">
                    </div>
                </el-tab-pane>
            </el-tabs>
            <v-contextmenu ref="contextmenu" :theme="theme">
                <v-contextmenu-item @click="handleDownload"> 下载 </v-contextmenu-item>
                <v-contextmenu-item divider></v-contextmenu-item>
                <v-contextmenu-item @click="deleteHand"> 删除 </v-contextmenu-item>
            </v-contextmenu>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="modalClose">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>


<script>
    import bus from "../bus"
    import {
        imgPreview
    } from "@/lib/util";

    import {
        uploadImg,
        deleteByDocId,
        contractEnquiry,
        PcUploadImg,
        getDocAttachment
    } from "@/axios/api";

    // CCS001 银行卡正面
    // CCS002 银行卡反面
    // CCS003 手持银行卡
    // A0019 身份证正面，
    // A0020 身份证反面
    let imgList = [{
            name: '银行卡正面',
            id: '3',
            docHttpUrl: '',
            docType: 'CCS001'
        },
        {
            name: '银行卡反面',
            id: '4',
            docHttpUrl: '',
            docType: 'CCS002'
        },
        {
            name: '申请人照片',
            id: '5',
            docHttpUrl: '',
            docType: 'CCS003'
        }
    ]
    export default {
        props: {
            isShowModal: {
                type: Boolean,
                default: false
            },
            serialNo: {
                type: String,
            },
            theme: {
                type: String,
            }
        },

        data() {
            return {
                editableTabsValue: null,
                errorImg: require("@/assets/img/fail_pic.png"),
                metadataImg: require("@/assets/img/no_pic.png"),
                imgList,
                docLIst: [],
                name: null,
                deleteImgInfo: {}
            };
        },

        mounted() {},

        created() {},
        watch: {
            isShowModal: function (newValue, bb) {
                // 显示弹框
                if (newValue) {
                    this.getImgList()
                }
            }
        },
        methods: {
            async upload(e, res) {
                this.type = res;
                let files = e.target.files || e.dataTransfer.files;
                this.name = files[0].name || ''
                const isLt2M = files[0].size / 1024 / 1024;

                if (isLt2M > 4) {
                    this.$message.warning('上传附件大小不能超过 4MB!');
                    this.$refs.referenceUploadp.value = null;
                    return
                } else if (isLt2M * 1024 < 50) {
                    this.$message.warning('上传附件清晰度不够,请更换高清附件上传');
                    this.$refs.referenceUploadp.value = null;
                    return
                }

                this.docLIst[this.editableTabsValue].docHttpUrl = await imgPreview(files[0])

                this.uploadImg()

            },
            deleteHand() {
                if (Object.keys(this.deleteImgInfo).length <= 0) {
                    this.$message.warning("点击选择需要删除的附件")
                    return;
                }

                deleteByDocId({
                    docId: this.deleteImgInfo.docId
                }).then(res => {
                    this.$message.success('删除附件成功')
                    this.deleteImgInfo = {};
                    this.getImgList()
                }).catch(error => {
                    console.log(error)
                })

            },
            // 过滤
            // clickHanld(event) {
            //     if (this.docLIst[this.editableTabsValue].docHttpUrl) {
            //         this.$message.warning(`已有 ${this.docLIst[this.editableTabsValue].name} 附件资料`)
            //         event.preventDefault();
            //     }
            // },
            uploadImg() {
                let param = {
                    serialNo: this.serialNo, //合同号
                    // docName: this.docLIst[this.editableTabsValue].name, //附件名称
                    docName: this.name, //附件名称
                    docType: this.docLIst[this.editableTabsValue].docType, //附件类型
                    imgStr: this.docLIst[this.editableTabsValue].docHttpUrl,
                    fileType: 'file'
                };

                PcUploadImg(param).then(res => {
                    // uploadImg(param).then(res => {
                    if (res.code == '200') {
                        this.$message.success('附件上传成功')
                        this.getImgList();
                    }
                }).catch(error => {

                }).finally(() => {
                    this.$refs.referenceUploadp.value = null;
                });
            },
            // 右击点击选中图片
            rightShow(res) {
                this.deleteImgInfo = res;
            },
            handleDownload() {
                console.log(this.deleteImgInfo, 11)
                this.downloadIamge(this.deleteImgInfo.docHttpUrl, this.deleteImgInfo.docName);
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
            // 
            getImgList() {
                // contractEnquiry({
                getDocAttachment({
                    serialNo: this.serialNo,
                    fileType: 'file',
                    deleteFlag: '0'
                }).then(res => {
                    console.log(res, 1)
                    this.docLIst = res.data || [];
                    this.processingData()
                })
            },
            processingData() {
                let imgList = JSON.parse(JSON.stringify(this.imgList))
                let docLIst = JSON.parse(JSON.stringify(this.docLIst))
                imgList.map(item => {
                    docLIst.forEach(value => {
                        if (item.docType == value.docType) {
                            item.docAttachments = value.docAttachments;
                        }
                    })
                })
                this.docLIst = imgList
            },
            chenckTab(tab, event) {
                console.log(this.editableTabsValue);
            },
            modalClose() {
                bus.$emit('apply:upload', false)
                // this.$parent.getOrderInfo()
                this.$parent.getImgList()
            },
            // 
            moveErrorImg: function (event, item) {
                console.log(item, 3)
                if (item.docId) {
                    event.currentTarget.src = this.errorImg;
                } else {
                    event.currentTarget.src = this.metadataImg;
                }
            }
        }
    };
</script>


<style scoped lang="scss">
    /deep/ .el-tabs__content {
        height: 100%;
    }

    .see_file_box {

        display: flex;
        height: 85%;
        width: 94%;

        .img_box {
            width: 98%;
            height: 100%;
            min-width: 500px;
            min-height: 360px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid rgba(232, 236, 241, 1);
            overflow: auto;

            .img {
                display: inline-block;
                width: 50%;
                height: 50%;
                min-width: 260px;
                min-height: 220px;
                max-height: 350px;
                margin: 0 4px;
                box-shadow: rgb(153, 192, 231) 0px 0px 6px 2px;
            }
        }

        .upload {

            width: 28px;
            height: 22px;
            /* border: solid blue 1px; */
            border-radius: 5px;
            position: relative;
            cursor: pointer;

            background: url('../../../assets/img/2.png') no-repeat;
            background-size: 100% 100%;

            i {
                position: absolute;
                top: 6px;
                left: 20px;
            }

            .hides {
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer
            }
        }

        .delete {

            background: url('../../../assets/img/1.png') no-repeat;
            background-size: 100% 100%;
            margin-left: 10px;
        }

        .tietle_box {
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: flex-start;

            .title {
                width: 24%;
                text-align: center;
                line-height: 40px;
                font-size: 16px;
                font-weight: 700;
            }

            .btn_box {
                width: 76%;
                display: flex;
            }
        }
    }
</style>