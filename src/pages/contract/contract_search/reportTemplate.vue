<template>
    <div>
        <el-dialog :title="m_title" :visible.sync="isShowModal" :before-close="modalClose" width="680px"
            :close-on-click-modal='false'>
            <div style="padding: 10px 40px;min-height: 120px;">
                <el-form ref="form" :model="submitData" :rules="rules" label-width="120px" label-position='left'>
                    <el-form-item label="报表模板名称" prop="exportType">
                        <el-select v-model.trim="submitData.exportType" filterable placeholder="请选择">
                            <el-option v-for="item in  exportTypeArr" :key="item.name" :label="item.name"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="download">导出文件</el-button>
                <el-button @click="modalClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        exportLoanExcel
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
            },
        },
        data() {
            return {
                // 导出类型 01：放款报表_宝付模板， 02：放款报表_放款明细"
                exportTypeArr: [{
                        name: "放款报表_宝付模板",
                        value: "01"
                    },
                    {
                        name: "放款报表_放款明细",
                        value: "02"
                    }
                ],

                submitData: {},
                rules: {
                    exportType: [{
                        required: true,
                        message: '请选择报表模板',
                        trigger: 'blur'
                    }]
                }
            }
        },

        mounted() {

        },

        watch: {
            isShowModal: function (newValue, bb) {
                // 显示弹框
                if (newValue) {
                    console.log(this.columnInfo, 11)
                }
            }
        },

        methods: {
            //编辑保存
            download() {
                const _this = this
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let params = Object.assign({}, this.submitData, this.columnInfo)
                        exportLoanExcel(params).then(res => {
                            const request = res.request;
                            const blob = res.data;
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onload = e => {
                                const a = document.createElement("a");
                                let name = _this.submitData.exportType == '01' ? '放款报表_宝付模板' :
                                    '放款报表_放款明细'
                                a.download =
                                    `${name}${new Date().Format("yyyyMMdd")}.xls`; //fileName;
                                // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
                                a.href = e.target.result;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            };
                        });
                    }
                })


            },
            modalClose() {

                this.$refs.form.resetFields();

                // 调用父组件方法关闭
                this.$parent.getLoanExcel()
            }
        },

    };
</script>