<template>
    <div>
        <el-dialog :title="m_title" :visible.sync="isShowModal" :before-close="modalClose" width="800px"
            :close-on-click-modal='false'>
            <el-table :data="tableData" border style="width: 100%;min-height: 260px">
                <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
                <el-table-column prop="oldOperatorName" label="原审批人">
                </el-table-column>
                <el-table-column prop="newOperatorName" label="新审批人">
                </el-table-column>
                <el-table-column prop="phaseName" label="调单所在阶段" :formatter='formatter'>
                </el-table-column>
                <el-table-column prop="createTime" label="调单时间" width="180">
                </el-table-column>
                <el-table-column prop="createUserName" label="调单人员">
                </el-table-column>
            </el-table>

            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="modalClose">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>

<script>
    // phaseName      01                            070020               （审批初审）
    // phaseName      02                            070030               （审批终审）
    // phaseName      03                            180020               （放款初审）
    // phaseName      04                            180030               （放款初审）
    import {
        listTransferOrder
    } from "@/axios/api";
    export default {

        props: {
            isShowModal: {
                type: Boolean,
                default: false,
            },
            m_title: {
                type: String,
            },
            columnInfo: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                tableData: [],
            }
        },

        mounted() {

        },

        watch: {
            isShowModal: function (newValue, bb) {
                // 显示弹框
                if (newValue) {
                    this.getlistTransferOrder()
                    console.log(this.columnInfo)
                }
            }
        },
        methods: {
            //编辑保存
            // save() {
            //     this.$refs.form.validate((valid) => {
            //         if (valid) {

            //         } else {
            //             console.log('error submit!!');
            //             return false;
            //         }
            //     });
            // },
            // 获取列表
            getlistTransferOrder() {
                listTransferOrder({
                    serialNo: this.columnInfo.serialNo
                }).then(res => {
                    console.log(res)
                    if (res.code == '200') {
                        this.tableData = res.data;
                    }
                })
            },
            modalClose() {

                // 调用父组件方法关闭
                this.$parent.onSeeRecord()
                // bus.$emit("fee_setting:isShowModal_C", false); // 直接修改父组件的属性
            },
            //  过滤
            formatter: function (row, column, cellValue, index) {
                switch (cellValue) {
                    case '01':
                        return '审批初审'
                        break;
                    case '02':
                        return '审批终审'
                        break;
                    case '03':
                        return '放款初审'
                        break;
                    case '04':
                        return '放款初审'
                        break;

                    default:
                        break;
                }
            },
        }
    };
</script>