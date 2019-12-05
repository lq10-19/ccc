<template>
    <div>
        <el-dialog :title="m_title" :visible.sync="isShowModal" :before-close="modalClose" width="680px"
            :close-on-click-modal='false'>
            <div>
                <el-form ref="form" :model="submitData" :inline="true" :rules="rules" label-width="80px">
                    <el-form-item label="审批结果"  prop="checkResult">
                        <el-select v-model.trim="submitData.checkResult" @change='changeCheck' placeholder="请选择">
                            <el-option :label="isLoan?'审批通过':'放款通过'" value="true"></el-option>
                            <el-option :label="isLoan?'审批拒绝':'放款拒绝'" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="title_box" v-show="!isLast&&isShow">
                选择终审人员
            </div>
            <el-table v-show="!isLast&&isShow" :data="tableData" border style="width: 100%;min-height: 260px"
                @current-change="handleCurrentChange" highlight-current-row>
                <el-table-column type="index" width="50" align='center'>
                </el-table-column>
                <el-table-column prop="roleName" label="角色">
                </el-table-column>
                <el-table-column prop="loginId" label="用户账号">
                </el-table-column>
                <el-table-column prop="userName" label="姓名">
                </el-table-column>
                <el-table-column prop="userStatus" label="状态">
                </el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">保 存</el-button>
                <el-button @click="modalClose">取 消</el-button>

            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        listChecker,
        checkFirst,
        checkLast,
        loanCheckFirst,
        loanCheckLast
    } from "@/axios/api";

    // 审批管理 - 查询审批人员
    // 审批初审: roleId = 4002,4003
    // 审批终审: roleId = 6002,6003,6004
    // 放款初审: roleId = 6002,6003
    // 放款终审: roleId = 
    let roleIdList = {
        '审批初审': {
            roleId: "4002,4003"
        },
        '审批终审': {
            roleId: "6002,6003,6004"
        },
        '放款初审': {
            roleId: "6002,6003"
        },
        '放款终审': {
            roleId: ""
        },
    }

    export default {

        props: {
            isShowModal: {
                type: Boolean,
                default: false,
            },
            m_title: {
                type: String,
            },
            source: {
                type: String,
                required: true
            },
            columnInfo: {
                type: Object,
                required: true
            },
            serialNoList: {
                type: Array,
            }
        },
        data() {
            return {
                submitData: {
                    checkResult: "",
                },
                tableData: [],
                currentRow: {},
                rules: {
                    checkResult: [{
                        required: true,
                        message: '请选择审批结果',
                        trigger: 'blur'
                    }],
                },
                isLast: false,
                isLoan: false,
                isShow: true,
            }
        },

        mounted() {

        },

        watch: {
            isShowModal: function (newValue, bb) {
                // 显示弹框
                if (newValue) {

                    this.isLast = this.source.includes('终审');
                    this.isLoan = this.source.includes('审批');

                    // 终审不需要选择终审人员
                    if (!this.isLast) {
                        this.getListChecker();
                    }
                }
            }
        },

        methods: {
            getListChecker() {
                listChecker({
                    roleId: roleIdList[this.source].roleId
                }).then(res => {
                    console.log(res, 11)
                    if (res.code == '200') {
                        this.tableData = res.data;
                    }
                })
            },
            // 选中
            handleCurrentChange(val) {
                console.log(val, 11)
                this.currentRow = val || {};
            },
            changeCheck(value) {
                this.isShow = value == 'true' ? true : false;
                console.log(value)
                console.log(this.isShow)
            },

            //编辑保存
            save() {
                const _this = this;
                this.$refs.form.validate((valid) => {
                    if (valid) {

                        if (!_this.isLast && _this.isShow && Object.keys(_this.currentRow).length == 0) {
                            _this.$message.warning("请选择终审人员")
                            return;
                        }

                        let params = Object.assign({}, {
                            serialNoList: _this.serialNoList,
                            checkResult: _this.submitData.checkResult,
                            checkAccId: _this.currentRow.userId || ''
                        })

                        let requestFun;


                        switch (this.source) {
                            case '审批初审':
                                requestFun = checkFirst
                                break;
                            case '审批终审':
                                requestFun = checkLast
                                break;
                            case '放款初审':
                                requestFun = loanCheckFirst
                                break;
                            case '放款终审':
                                requestFun = loanCheckLast
                                break;

                            default:
                                requestFun = null
                                break;
                        }


                        if (!requestFun) return;

                        requestFun(
                            params
                        ).then(res => {
                            console.log(params, 1)
                            if (res.code == '200') {
                                _this.$message.success('审核成功');
                                _this.modalClose()
                                // 调用父组件方法更新数据状态
                                _this.$parent.getDataList();
                            } else {
                                _this.$message.error(res.msg || '失败')
                            }
                        }).catch(error => {
                            console.log(error);
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            // 关闭
            modalClose() {

                this.$refs.form.resetFields();

                // 调用父组件方法关闭
                this.$parent.onExamine();
            }
        }
    };
</script>

<style scoped lang="scss">
    .title_box {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #57a0f2;
        color: #fff;
    }
</style>