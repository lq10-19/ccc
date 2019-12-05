<template>
    <div class="container">
        <el-form ref="searchForm" :model="searchForm" size='small' label-width='70px' label-position='left'>
            <el-row>
                <el-col :span="8">
                    <el-form-item label='客户ID' prop='customerId'>
                        <el-input v-model.trim="searchForm.customerId" placeholder='请输入客户ID'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label='客户名称' prop='customerName'>
                        <el-input v-model.trim="searchForm.customerName" placeholder='请输入客户名称'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label='证件号码' prop='certId'>
                        <el-input v-model.trim="searchForm.certId" placeholder='请输入证件号码'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label='手机号码' prop='mobileTelePhone'>
                        <el-input v-model.trim="searchForm.mobileTelePhone" placeholder='请输入手机号码'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <el-button @click="queryHandles" type="primary" plain>查询</el-button>
                        <el-button style="margin-left:10px;" @click="reset" type="primary" plain>重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row style="margin-bottom: 10px">
            <el-button type="primary" v-has plain @click="onDetail">客户详情</el-button>
            <el-button type="primary" v-has plain @click="handleChangeInfo">变更信息</el-button>
        </el-row>

        <el-table :data="tableData" border class="table" :height='tableHeight' ref="multipleTable" highlight-current-row
            @current-change="onCurrentChange">
            <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
            <el-table-column label="客户ID" prop="customerId" align="center"></el-table-column>
            <el-table-column label="客户名称" prop="customerName" align="center"></el-table-column>
            <el-table-column label="证件号码" prop="certId" align="center"></el-table-column>
            <el-table-column label="手机号码" prop="mobileTelePhone" align="center"></el-table-column>
            <el-table-column label="创建日期" prop="createTime" align="center"></el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                layout="total,sizes, prev, pager, next" :total="totalPage">
            </el-pagination>
        </div>

        <!----------变更信息弹框---------------->
        <change-info :isShowModal="isShowModal" :mobileTelePhone='mobileTelePhone' :customerId='customerId'>
        </change-info>
    </div>
</template>

<script>
    import bus from "./bus.js";
    import ChangeInfo from "./change_info";

    import {
        getCustomerListByPage
    } from "@/axios/api";

    export default {
        name: 'customer_info',
        data() {
            return {
                tableData: [],
                isShowModal: false,
                searchForm: {
                    customerId: null,
                    customerName: null,
                    certId: null,
                    mobileTelePhone: null,
                },
                totalPage: 0, //总页数
                selection: {},
                customerId: null,
                mobileTelePhone: null
            }
        },
        components: {
            ChangeInfo
        },
        created() {
            // 初始化调用

            this.check()
        },
        mounted() {
            bus.$on('showInfo', (val) => {
                this.isShowModal = val;
            })
        },
        methods: {
            //  修改mixin混入中的参数
            getParams() {
                return this.searchForm;
            },
            handleChangeInfo() {
                if (Object.keys(this.selection).length === 0) {
                    this.$message.warning("请选择客户")
                    return;
                }
                this.isShowModal = true;
                this.customerId = this.selection.customerId;
                this.mobileTelePhone = this.selection.mobileTelePhone;
            },
            onDetail() {

                if (Object.keys(this.selection).length === 0) {
                    this.$message.warning("请选择客户")
                    return;
                }
                this.$router.push({
                    path: "customer_info_detail",
                    query: {
                        customerId: this.selection.customerId
                    }
                })
            },
            onCurrentChange(resvalue) {
                this.selection = resvalue || {};
            },
            // 
            async getDataList() {
                try {
                    console.log(this.queryParams, 55)
                    let params = Object.assign({}, this.queryParams)
                    console.log(params, 11)
                    let res = await getCustomerListByPage(params)
                    console.log(res, 11)
                    this.tableData = res.data.rows;
                    this.totalPage = res.data.totalCount;
                } catch (error) {
                    console.log(error)
                }
            },
            // 置空
            reset() {
                // 置空
                this.$refs.searchForm.resetFields();

                // 调父组件方法
                this.check()
            },

        }
    }
</script>


<style scoped lang="scss">
    /deep/ .el-input--small {
        width: 200px;
    }

    .form-item-label {
        display: inline-block;
        width: 80px;

    }
</style>