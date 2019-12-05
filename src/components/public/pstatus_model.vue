<template>
    <div>
        <el-dialog :title="m_title" :visible.sync="isShowModal" :before-close="modalClose" width="500px"
            :close-on-click-modal='false'>
            <div class="modal-inner">
                <el-form ref="form" :model="submitData" :rules="rules" label-width="90px" label-position='left'>
                    <el-form-item label="等待时长" prop="waitTime" v-show='isExamination'>
                        <el-input v-model.trim="submitData.waitTime" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="个人状态" prop="onlineFlag">
                        <el-radio-group v-model.trim="submitData.onlineFlag">
                            <el-radio label="1">在线</el-radio>
                            <el-radio label="0">离线</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">保 存</el-button>
                <el-button @click="modalClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        addBasicFee,
        editBasicFee,
        queryUserStatus,
        modifyUserStatus
    } from "@/axios/api";
    let statusList = {
        '审批初审': 'Approval',
        '放款初审': 'Loan'
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
            },
        },
        data() {
            return {
                statusArr: [{
                        name: "启用",
                        value: "1"
                    },
                    {
                        name: "停用",
                        value: "0"
                    }
                ],
                isExamination: false,
                submitData: {
                    onlineFlag: null,
                    waitTime: null,
                },
                timeout: null,
                rules: {
                    // region: [{
                    //     required: true,
                    //     message: '请选择审批结果',
                    //     trigger: 'blur'
                    // }],
                    onlineFlag: [{
                        required: true,
                        message: '请选个人状态',
                        trigger: 'blur'
                    }]
                }
            }
        },

        mounted() {

        },

        watch: {
            // formData: {
            //     handler(newV) {
            //         this.submitData = newV;
            //     },
            //     deep: true
            // },
            isShowModal: function (newValue, bb) {
                // 显示弹框
                if (newValue) {
                    this.getOpinionList()
                    this.isExamination = this.source.includes('初审');
                }
            }
        },

        methods: {
            //编辑保存
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        modifyUserStatus({
                            onlineFlag: this.submitData.onlineFlag
                        }).then(res => {
                            if (res.code == '200') {
                                this.$message.success('个人状态修改成功')
                                this.modalClose()
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                // editBasicFee(this.submitData).then(res => {
                //     this.modalClose()
                // })
            },
            getOpinionList() {
                queryUserStatus({
                    flowNo: statusList[this.source]
                }).then(res => {
                    this.submitData.onlineFlag = res.data.onlineFlag;
                    if (res.data.waitTime) {
                        this.submitData.waitTime = this.countTime(res.data.waitTime);
                        this.timeout = setInterval(() => {
                            this.submitData.waitTime = this.countTime(res.data.waitTime);
                        }, 1000);
                    } else {
                        this.submitData.waitTime = '00: 00: 00'
                    }
                })
            },
            countTime(date) {
                if (!date) return;
                const dates = new Date(date);
                //获取当前时间
                const endDate = new Date();
                //时间差
                const leftTime = endDate.getTime() - dates.getTime();
                //定义变量 d,h,m,s保存倒计时的时间
                let d, h, m, s;
                if (leftTime >= 0) {
                    h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                    m = Math.floor(leftTime / 1000 / 60 % 60);
                    s = Math.floor(leftTime / 1000 % 60);
                    return this.PrefixInteger(h, 2) + ":" + this.PrefixInteger(m, 2) + ":" + this.PrefixInteger(s, 2);
                } else {
                    
                }
            },
            PrefixInteger(num, n) {
                return (Array(n).join(0) + num).slice(-n);
            },
            modalClose() {

                this.$refs.form.resetFields();

                // 调用父组件方法关闭
                this.$parent.onSeeStatus()
            }
        },
        beforeDestroy() {
            clearInterval(this.timeout);
            this.timeout = null;
        }
    };
</script>