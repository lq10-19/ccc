<template>
    <div class="container">

        <!-- 搜索from -->
        <ReportSearchForm @setSearchInfo="getMsgFormSon" :isContractSearch='false'></ReportSearchForm>

        <el-row style="margin-bottom: 10px">
            <el-button type="primary" v-has plain @click="onDetail">合同详情</el-button>
            <el-button type="primary" v-has plain @click="getTransferListExcel">报表导出</el-button>
        </el-row>

        <el-table :data="tableData" border class="table" :height='tableHeight' ref="multipleTable" highlight-current-row
            @current-change="onCurrentChange">
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
            <el-table-column prop="contractSerialNo" label="合同号" min-width="115" align="center"></el-table-column>
            <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
            <el-table-column prop="certId" min-width='145' label="证件号码" align="center"></el-table-column>
            <el-table-column prop="withholdAmt" label="代扣金额" align="center"></el-table-column>
            <el-table-column prop="bankReturnRemark" min-width='110' label="代扣结果" align="center"></el-table-column>
            <el-table-column prop="openBankName" min-width='120' label="代扣银行" align="center"></el-table-column>
            <el-table-column prop="replaceAccount" min-width='150' label="代扣账号" align="center"></el-table-column>
            <el-table-column prop="paymentType" min-width='100' label="款项类型" align="center"></el-table-column>
            <el-table-column prop="payDate" label="应还日期" min-width='120' align="center"></el-table-column>
            <el-table-column prop="withholdDate" label="送盘日期" min-width='120' align="center"></el-table-column>
            <el-table-column prop="inputDate" label="回盘日期" min-width='120' align="center"></el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40,50]" :page-size="10"
                layout="total,sizes, prev, pager, next" :total="totalPage">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import {
        querySendBackTrayInfo,
        sendBackExport
    } from "@/axios/api";

    import ReportSearchForm from "@/components/public/reportSearchForm";

    // queryType 010  查询
    // queryType 020  未结清
    // queryType 030  已结清

    export default {
        name: 'send_back_report',
        components: {
            ReportSearchForm,
        },
        data() {
            return {
                searchForm: {},
                isShowModal: false,
                isShowModalR: false,
                totalPage: 0,
                formData: {}, //编辑弹框数据
                tableData: [],
                selection: {} //选中的行数据
            };
        },
        mounted() {

        },
        created() {
            this.check()
        },

        methods: {
            // 获取子组件数据
            getMsgFormSon(resInfo) {
                this.searchForm = resInfo;
            },
            //  修改mixin混入中的参数
            getParams() {
                return this.searchForm;
            },
            //合同详情
            onDetail() {
                if (Object.keys(this.selection).length === 0) {
                    this.$message.warning("请选择进行操作的合同");
                    return;
                }
                this.$router.push({
                    path: "/contract_detail",
                    query: {
                        serialNo: this.selection.contractSerialNo,
                        phaseName: '送回盘报表'
                    }
                });
            },

            //查看合同意见
            onSeeView() {
                if (Object.keys(this.selection).length === 0) {
                    this.$message.warning("请选择进行操作的合同");
                    return;
                }
                this.isShowModal = !this.isShowModal;
            },

            onCurrentChange(val) {
                this.selection = val || {};
            },
            // 导出放款报表
            getLoanExcel() {
                this.isShowModalR = !this.isShowModalR;
            },
            // 导出应收账款转让清单报表
            getTransferListExcel() {

                sendBackExport(this.queryParams.paramObj).then(res => {
                    const blob = res.data;
                    // 判断token失效
                    if (res.data.type.includes('json')) {
                        this.$router.push('/login');
                        this.$message.warning('超时请重新登录')
                        return;
                    }
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = e => {
                        const a = document.createElement("a");
                        a.download = `消费分期回盘报表${new Date().Format("yyyyMMdd")}.xls`; //fileName;
                        // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
                        a.href = e.target.result;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    };
                });
            },
            async getDataList() {
                try {
                    console.log(this.queryParams, 55)
                    let params = Object.assign({}, this.queryParams)
                    console.log(params, 11)
                    let res = await querySendBackTrayInfo(params)
                    console.log(res, 11)
                    this.tableData = res.data.rows;
                    this.totalPage = res.data.totalCount;
                } catch (error) {
                    console.log(error)
                }
            },
        }
    };
</script>