<template>
    <div class="container see_file_box">
        <!-- <div style="margin-bottom: 6px">查看电子合同 - {{serialNo}}</div> -->
        <div v-if='isShow' style="height: 100px;font-size:20px">暂无相关文件</div>
        <el-tabs v-else tab-position="left" type='card' v-model.trim="editableTabsValue" @tab-click="chenckTab">
            <el-tab-pane v-for="(item,index) in fileList" :label="item.docName" :key="index">
                <!-- <iframe v-if='item.isHtml' id="show-iframe" frameborder=0 name="showHere" scrolling=auto
                    :src="item.docHttpUrl" width="100%" :height="tableHeight+100"></iframe> -->

                <p class="arrow" v-if='item.ispdf'>
                    <!-- // 上一页 -->
                    <el-button plain @click="changePdfPage(0,index,item)" class="turn"
                        :class="{grey: item.currentPage==1}">上一页</el-button>
                    {{item.currentPage}} / {{item.pageCount}}
                    <!-- // 下一页 -->
                    <el-button plain @click="changePdfPage(1,index,item)" class="turn"
                        :class="{grey: item.currentPage==item.pageCount}">下一页</el-button>
                    <el-button style="margin-left: 40px" @click="preview(item.docHttpUrl)">
                        预览
                    </el-button>

                </p>
                <!-- // 自己引入就可以使用,这里我的需求是做了分页功能,如果不需要分页功能,只要src就可以了 -->
                <!-- <pdf :src="src" // src需要展示的PDF地址
                 :page="currentPage" // 当前展示的PDF页码 
                 @num-pages="pageCount=$event" //  PDF文件总页码
                 @page-loaded="currentPage=$event" // 一开始加载的页面
                 @loaded="loadPdfHandler"> // 加载事件
                </pdf> -->
                <div class="img_box">
                    <pdf class="img" v-if='item.ispdf' :key='index' :src="item.url" :page="item.currentPage"
                        @num-pages="item.pageCount=$event" @page-loaded="item.currentPage=$event"
                        @loaded="loadPdfHandler(index,item)">
                    </pdf>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>


<script>
    import pdf from 'vue-pdf'
    import {
        getDocAttachment
    } from "@/axios/api"

    export default {

        components: {
            pdf
        },
        data() {
            return {
                editableTabsValue: null,
                // docHttpUrl: "http://file.dakawengu.com/file/2018-05-29/20180527-tianfeng.pdf",
                // url: "http://file.dakawengu.com/file/2018-05-29/20180527-tianfeng.pdf",
                currentPage: 0, // pdf文件页码
                pageCount: 0, // pdf文件总页数
                fileList: [],
                isShow: false,
                serialNo: null,
                // docHttpUrl: null
            };
        },
        created() {

            this.serialNo = this.$route.query.serialNo;

            this.getPDFList()
        },

        mounted() {
            // this.docHttpUrl = pdf.createLoadingTask(this.url);

        },

        methods: {
            chenckTab(tab, event) {},
            preview(resUrl) {
                window.open(resUrl)
            },
            // 获取数据
            getPDFList() {
                this.fileList = [];
                getDocAttachment({
                    serialNo: this.serialNo,
                    fileType: 'CONTRACT',
                    deleteFlag: '0',
                }).then(res => {
                    let newA = []
                    res.data && res.data.forEach(element => {
                        newA.push(...element.docAttachments)
                    });
                    newA.map(item => {
                        item.url = pdf.createLoadingTask(item.docHttpUrl)
                        item.isHtml = item.docHttpUrl.includes('html')
                        item.ispdf = item.docHttpUrl.includes('pdf')
                        item.currentPage = 1;
                        item.pageCount = 1;
                        if (item.ispdf) {
                            this.fileList.push(item)
                        }
                    })

                    this.isShow = res.data && res.data.length == 0 ? true : false;
                })
                getDocAttachment({
                    serialNo: this.serialNo,
                    fileType: 'CREDIT',
                }).then(res => {
                    let newA = []
                    res.data && res.data.forEach(element => {
                        newA.push(...element.docAttachments)
                    });
                    newA.map(item => {
                        item.url = pdf.createLoadingTask(item.docHttpUrl)
                        item.isHtml = item.docHttpUrl.includes('html')
                        item.ispdf = item.docHttpUrl.includes('pdf')
                        item.currentPage = 1;
                        item.pageCount = 1;
                        if (item.ispdf) {
                            this.fileList.push(item)
                        }
                    })
                })
            },
            // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
            changePdfPage(val, resIndex, resItem) {
                console.log(val)
                if (val === 0 && resItem.currentPage > 1) {
                    this.fileList[resIndex].currentPage--
                }
                if (val === 1 && resItem.currentPage < resItem.pageCount) {
                    this.fileList[resIndex].currentPage++
                }
            },

            // pdf加载时
            loadPdfHandler(resIndex, resItem) {
                // console.log(e, 98877)
                this.fileList[resIndex].currentPage = 1 // 加载的时候先加载第一页
            },
        }
    };
</script>


<style scoped lang="scss">
    .see_file_box {
        height: 86%;
        width: 94%;
        min-height: 360px;

        .img_box {
            width: 98%;
            min-width: 500px;
            min-height: 460px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow-y: auto;
            overflow-x: hidden;

            .img {
                display: inline-block;
                width: 100%;
                height: 80%;
                min-width: 780px;
                min-height: 380px;
            }

        }

        .arrow {
            display: block;
            text-align: center;
        }

        .grey {
            color: grey
        }
    }
</style>