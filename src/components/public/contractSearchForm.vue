<template>
    <div class="body">
        <span class="searchArrow" @click="updown">
            <i v-show='isShow' class="el-icon-arrow-down">收起</i>
            <i v-show='!isShow' class="el-icon-arrow-up">展开</i>
        </span>
        <el-form :inline="true" size='small' ref="searchForm" :model="searchForm" label-position="left"
            label-width="100px">

            <el-row v-show='isShow'>
                <el-col :span="8">
                    <el-form-item label="合同号" prop='serialNo'>
                        <el-input v-model.trim="searchForm.serialNo" placeholder='请输入合同号' suffix-icon="empty">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="客户名称" prop='customerName'>
                        <el-input v-model.trim="searchForm.customerName" placeholder='请输入客户名称' suffix-icon="empty">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="证件号码" prop='customerCertId'>
                        <el-input v-model.trim="searchForm.customerCertId" placeholder='请输入证件号码' suffix-icon="empty">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label='产品大类' prop='productSuperType'>
                        <el-select v-model.trim="searchForm.productSuperType" filterable placeholder="请选择"
                            @change="changePC">
                            <el-option v-for="item in productCategoryList" :key="item.typeNo" :label="item.typeName"
                                :value="item.typeNo"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label='产品名称' prop='productId'>
                        <el-select v-model.trim="searchForm.productId" filterable placeholder="请选择">
                            <el-option v-for="item in productNameList" :key="item.productId" :label="item.productName"
                                :value="item.productId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="合同主状态" prop='contractStatusMain'>
                        <el-select v-model.trim="searchForm.contractStatusMain" filterable @change="changeCS"
                            placeholder="请选择">
                            <el-option v-for="item in contractStatusMainList" :key="item.itemNo" :label="item.itemName"
                                :value="item.itemNo"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同子状态" prop='contractStatusMinor'>
                        <el-select v-model.trim="searchForm.contractStatusMinor" filterable placeholder="请选择">
                            <el-option v-for="item in contractStatusMinorList" :key="item.itemNo" :label="item.itemName"
                                :value="item.itemNo"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="申请时间" prop='time'>
                        <el-date-picker style="width: 96%" v-model.trim="searchForm.time" type="datetimerange"
                            :picker-options="pickerOptions" value-format='yyyy/MM/dd HH:mm:ss' range-separator="至"
                            start-placeholder="开始" end-placeholder="结束" align="right">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-show='isShow'>
                <el-col :span="12">
                    <el-form-item label="放款时间" prop='putoutDate'>
                        <el-date-picker style="width: 96%" v-model.trim="searchForm.putoutDate" type="datetimerange"
                            :picker-options="pickerOptions" value-format='yyyy/MM/dd HH:mm:ss' range-separator="至"
                            start-placeholder="开始" end-placeholder="结束" align="right">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show='isContractSearch'>
                    <el-form-item label="合同生效日期" prop='effectiveTime'>
                        <el-date-picker style="width: 96%" v-model.trim="searchForm.effectiveTime" type="daterange"
                            :picker-options="pickerOptions" value-format='yyyy/MM/dd' range-separator="至"
                            start-placeholder="开始" end-placeholder="结束" align="right">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show='isContractSearch'>
                    <el-form-item label="合同到期日期" prop='maturityTime'>
                        <el-date-picker style="width: 96%" v-model.trim="searchForm.maturityTime" type="daterange"
                            :picker-options="pickerOptions" value-format='yyyy/MM/dd' range-separator="至"
                            start-placeholder="开始" end-placeholder="结束" align="right">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-button @click="queryHandle" type="primary" plain>查询</el-button>
                    <el-button style="margin-left:10px;" @click="reset" type="primary" plain>重置</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import {
        querylistProduct,
        queryCodeLibrary
    } from "@/axios/api"

    export default {

        props: {
            isContractSearch: {
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {
                searchForm: {
                    serialNo: null,
                    customerName: null,
                    customerCertId: null,
                    productSuperType: null,
                    productId: null,
                    contractStatusMain: null,
                    contractStatusMinor: null,
                    time: [],
                    putoutDate: [],
                    maturityTime: [],
                    effectiveTime: [],
                    applyDateEnd: null, // 申请时间-结束 ,
                    applyDateStart: null, // 申请时间-开始 ,
                    putoutDateStart: null, // 放款时间-开始 ,
                    putoutDateEnd: null, // 放款时间-结束 ,
                    effectiveTimeStart: null, // 合同生效时间-开始 ,
                    effectiveTimeEnd: null, // 合同生效时间-结束 ,
                    maturityTimeStart: null, // 合同到期时间-开始 ,
                    maturityTimeEnd: null, // 合同到期时间-结束 ,
                },
                // productCategoryList: [],
                contractStatusMinorList: [],
                contractStatusMainList: [],
                productNameList: [],
                isShow: true,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

            }
        },
        created() {
            this.getCodeLibrary()
        },
        computed: {
            productCategoryList() {
                return this.$store.state.productCategoryList;
            }
        },
        methods: {
            // 选择产品大类
            changePC(res) {

                this.productNameList = this.productCategoryList.find((elem) => {
                    return elem.typeNo == res;
                }).productInfos || [];
                console.log(this.productNameList)
                // 置空产品
                this.searchForm.productId = null;
            },
            queryHandle() {

                this.searchForm.applyDateStart = this.searchForm.time && this.searchForm.time[0]; // 申请时间-开始 , 
                this.searchForm.applyDateEnd = this.searchForm.time && this.searchForm.time[1]; // 申请时间-结束 ,
                // 放款时间
                this.searchForm.putoutDateStart = this.searchForm.putoutDate && this.searchForm.putoutDate[
                    0]; // 放款时间-开始 , 
                this.searchForm.putoutDateEnd = this.searchForm.putoutDate && this.searchForm.putoutDate[
                    1]; // 放款时间-结束 ,
                // 合同生效时间
                this.searchForm.effectiveTimeStart = this.searchForm.effectiveTime && this.searchForm.effectiveTime[
                    0]; // 合同生效时间-开始 , 
                this.searchForm.effectiveTimeEnd = this.searchForm.effectiveTime && this.searchForm.effectiveTime[
                    1]; // 合同生效时间-结束 ,

                // 合同到期时间
                this.searchForm.maturityTimeStart = this.searchForm.maturityTime && this.searchForm.maturityTime[
                    0]; // 合同到期时间-开始 , 
                this.searchForm.maturityTimeEnd = this.searchForm.maturityTime && this.searchForm.maturityTime[
                    1]; // 合同到期时间-结束 ,
                console.log(this.searchForm, 44)

                let params = Object.assign({}, this.searchForm)
                delete params.time;
                delete params.putoutDate;
                delete params.effectiveTime;
                delete params.maturityTime;
                // 传值
                this.$emit('setSearchInfo', params);
                // 调父组件方法
                this.$parent.queryHandles();
            },
            getCodeLibrary() {
                queryCodeLibrary({
                    codeNo: 'ContractStatusMain'
                }).then(res => {
                    this.contractStatusMainList = res.data
                })
            },
            changeCS(res) {
                this.searchForm.contractStatusMinor = null;
                this.contractStatusMinorList = [];
                queryCodeLibrary({
                    codeNo: 'ContractStatusMinor',
                    richNo: res
                }).then(res => {
                    this.contractStatusMinorList = res.data;
                })
            },
            reset() {
                // 置空
                this.$refs.searchForm.resetFields();

                // 调父组件方法
                this.$parent.check()
            },
            updown() {
                this.isShow = !this.isShow;
                this.$parent.getTable()
            },
        }
    };
</script>
<style scoped lang="scss">
    /deep/ .el-form-item__content {
        width: 60%;
    }

    .body {
        position: relative;
        left: 0;
        top: 0;

        .searchArrow {
            display: block;
            position: absolute;
            right: 6px;
            top: -10px;
            font-size: 14px;
            color: #606266;
            cursor: pointer;
            z-index: 999;
        }
    }
</style>