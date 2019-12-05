<template>
    <el-form ref="searchForm" :model="searchForm" :inline="true" size='small' label-position="left"
        class="demo-ruleForm" label-width="80px">
        <el-row>
            <el-col :span="8" v-show='isShowSerialNo'>
                <el-form-item label='合同号' prop='serialNo'>
                    <el-input v-model.trim="searchForm.serialNo" placeholder='请输入合同号' suffix-icon="empty"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item label='客户名称' prop='customerName'>
                    <el-input v-model.trim="searchForm.customerName" placeholder='请输入客户名称' suffix-icon="empty">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label='证件号码' prop='customerCertId'>
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
                <el-form-item>
                    <el-button @click="queryHandle" type="primary" plain>查询</el-button>
                    <el-button style="margin-left:10px;" @click="reset" type="primary" plain>重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script>
    import {
        querylistProduct
    } from "@/axios/api"

    export default {
        props: {
            isShowSerialNo: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                searchForm: {
                    serialNo: null,
                    customerName: null,
                    customerCertId: null,
                    productSuperType: null,
                    productId: null
                },
                productNameList: []
            }
        },
        created() {},
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
                // 传值
                this.$emit('setSearchInfo', this.searchForm);
                // 调父组件方法
                this.$parent.queryHandles();
            },

            reset() {
                // 置空
                this.$refs.searchForm.resetFields();

                // 调父组件方法
                this.$parent.check()
            },

        }
    };
</script>