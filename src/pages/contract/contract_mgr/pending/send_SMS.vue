<template>
    <div>
        <el-dialog title="短信发送" :visible.sync="isShowModal" :before-close="modalClose" width="680px">
            <el-form :model='ruleForm' style="padding: 0 20px" :rules="rules" ref="ruleForm" label-width="120px"
                label-position="left">

                <el-form-item label="短信模板名称" prop="tempType">
                    <el-select v-model.trim="ruleForm.tempType" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label-width="120px">
                    <input type="file" style="display: none;" ref="fileExcel" accept=".xlsx, .xls"
                        @change="uploadFile" />
                    <el-button type="primary" @click="handleClick">导入名单</el-button>

                    <el-button style="margin-left: 20px;" size="small" type="success" @click="exportTemplate">模板下载
                    </el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传文件，且不超过500kb</div> -->
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="modalClose">取 消</el-button> -->
                <el-button type="primary" @click="submit">提交并发送短信</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import bus from "./bus";
    import {
        addBankCardBackLog,
        sendMessage
    } from "@/axios/api";




    import {
        baseURL_X
    } from "@/axios/baseURL.js";

    let options = [{
        value: 'bqzltzCARrzzlkf30688',
        label: '债转通知短信_XHXD'
    }, ]

    export default {

        props: {
            isShowModal: {
                type: Boolean,
                default: false
            },
            selection: {
                type: Object,
                default: {}
            },
        },

        data() {
            return {
                options,
                isShow: false,
                importExcelUrl: null,
                fileList: [],
                ruleForm: {
                    tempType: null,
                    uploadExcel: null
                },
                rules: {
                    tempType: [{
                        required: true,
                        message: '请选择退回变卡原因',
                        trigger: 'blur'
                    }],
                }
            };
        },

        mounted() {},

        watch: {},

        methods: {
            //新增提交
            submit() {

                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        if (!this.ruleForm.uploadExcel) {
                            this.$message.warning('请导入短信模板')
                            return
                        }
                        let formData = new FormData();
                        // 向 formData 对象中添加文件
                        formData.append('tempType', this.ruleForm.tempType);
                        formData.append('uploadExcel', this.ruleForm.uploadExcel);

                        sendMessage(formData).then(res => {
                            this.$message.success('成功')
                            this.modalClose()
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            uploadFile(e) {
                const file = e.target.files[0]
                this.$refs.fileExcel.value = null
                this.ruleForm.uploadExcel = file
                let formData = new FormData();
                // 向 formData 对象中添加文件
                formData.append('file', this.file);
            },
            readData(file) {
                console.log(file)
            },
            handleClick() {
                this.$refs.fileExcel.click()
            },

            exportTemplate() {
                let url = `${baseURL_X}/CCS/tempFile/短信名单模板.xlsx`;
                window.location.href = url
            },

            modalClose() {
                this.$refs.ruleForm.resetFields();
                this.$parent.sendSMS()
            }
        }
    };
</script>