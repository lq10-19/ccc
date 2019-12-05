<template>
    <div>
        <el-dialog :title="m_title" :visible.sync="isShowModal" :before-close="modalClose" width="500px"
            :close-on-click-modal='false'>
            <div class="modal-inner">
                <el-form ref="form" :rules="rules" :model="submitData" label-width="80px">
                    <el-form-item label="意见" prop='signContent'>
                        <el-input style='width:95%' placeholder="数字在500以内" type="textarea"
                            :autosize="{ minRows: 4, maxRows: 6}" v-model.trim="submitData.signContent">
                        </el-input>
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
        opinionSign,
        listOpinion
    } from "@/axios/api";


    const verification = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('请输入签署意见'));
        } else if (value.toString().length > 500) {
            return callback(new Error('字数不超过500'));
        } else {
            callback();
        }
    }

    let phaseNmeList = {
        '审批初审': '01',
        '审批终审': '02',
        '放款初审': '03',
        '放款终审': '04'
    }

    export default {

        props: {
            isShowModal: {
                type: Boolean,
                default: false,
            },
            m_title: {
                type: String,
                required: true
            },
            columnInfo: {
                type: Object,
                required: true
            },
            source: {
                type: String,
                required: true
            },

        },
        data() {
            return {

                submitData: {
                    signContent: "",
                },
                rules: {
                    signContent: [{
                        validator: verification,
                        trigger: 'blur',
                        required: true,
                    }],
                }
            };
        },

        mounted() {

        },
        watch: {
            formData: {
                handler(newV) {
                    this.submitData = newV;

                },
                deep: true
            },
            isShowModal: function (newValue, bb) {
                // 显示弹框
                if (newValue) {
                    // this.getListChecker()
                    this.getOpinionList()
                    console.log(this.columnInfo)
                }
            }
        },

        methods: {
            //编辑保存
            getOpinionList() {

                let params = Object.assign({}, this.columnInfo, {
                    phase: phaseNmeList[this.source]
                })

                listOpinion({
                    ...params
                }).then(res => {
                    console.log(res, 789)
                    this.submitData.signContent = res.data[0] && res.data[0].signContent || ''
                }).catch(error => {
                    console.log(error);
                });
            },
            save() {
                const _this = this;
                this.$refs.form.validate((valid) => {
                    if (valid) {

                        let params = Object.assign({}, _this.columnInfo, {
                            signContent: _this.submitData.signContent
                        }, {
                            phase: phaseNmeList[this.source],
                            phaseName: this.source
                        })
                        //   /loanExecute/opinionSign
                        opinionSign({
                            ...params
                        }).then(res => {
                            if (res.code == '200') {
                                _this.$message.success('签署意见保存成功')
                                _this.modalClose()
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
                // this.modalClose()
            },
            modalClose() {

                this.$refs.form.resetFields();

                // 调用父组件方法关闭
                this.$parent.onSigning()
            }
        }
    };
</script>

<style scoped lang="scss"></style>