<template>
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
        <el-table-column prop="fieldName" label="字段" min-width="80">
        </el-table-column>
        <el-table-column prop="oldField" label="变更前" min-width="100">
        </el-table-column>
        <el-table-column prop="newField" label="变更后" min-width="100">
        </el-table-column>
        <el-table-column prop="updateUserName" label="变更人员" min-width="100">
        </el-table-column>
        <el-table-column prop="updateTime" min-width="120" label="变更时间">
        </el-table-column>
    </el-table>
</template>

<script>
    import {
        queryCustomerData
    } from "@/axios/api";

    export default {
        props: {
            customerId: {
                type: String,
            }
        },
        data() {
            return {
                tableData: []
            }
        },
        created() {
            this.getChangeRecord()
        },
        methods: {
            getChangeRecord() {

                queryCustomerData({
                    customerId: this.customerId
                }).then(res => {
                    this.tableData = res.data;
                }).catch(error => {
                    console.log(error)
                })
            }
        },
    }
</script>

<style scoped lang="scss">


</style>