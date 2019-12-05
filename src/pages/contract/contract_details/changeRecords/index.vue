<template>
    <div>
        <el-dialog :title="m_title" :visible.sync="isShowModal" :before-close="modalClose" width="860px"
            :close-on-click-modal='false'>
            <div class="rule-list">
                <div v-if="isShow" style="height: 100px;font-size:20px">暂无数据</div>
                <div class="table-a">
                    <table class="table" border="1" width="820" align="center" cellspacing="0" cellpadding="6"
                        v-for='(item,index) in tableData' :key='index'>
                        <tr>
                            <th width="20"> </th>
                            <th width="90">字段名称</th>
                            <th width="240">变更前</th>
                            <th width="240">变更后</th>
                            <th width="120">变更原因</th>
                            <th>变更时间</th>
                        </tr>
                        <tr>
                            <td rowspan="5">{{index+1}}</td>
                            <td>所属银行</td>
                            <td>{{item.customerBankOld}}</td>
                            <td>{{item.customerBank}}</td>
                            <td rowspan="5">{{item|typeFilter}}</td>
                            <td rowspan="5">{{item.createTime}}</td>
                        </tr>
                        <tr>
                            <td>开户城市</td>
                            <td>{{item.customerBankCityOld}}</td>
                            <td>{{item.customerBankCity}}</td>
                        </tr>
                        <tr>
                            <td>开户支行</td>
                            <td>{{item.customerBranchOld}}</td>
                            <td>{{item.customerBranch}}</td>
                        </tr>
                        <tr>
                            <td>银行卡号</td>
                            <td>{{item.customerBankNoOld}}</td>
                            <td>{{item.customerBankNo}}</td>
                        </tr>
                        <tr>
                            <td>预留手机号</td>
                            <td>{{item.bankPhoneOld}}</td>
                            <td>{{item.bankPhone}}</td>
                        </tr>
                    </table>

                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        queryBankByContractNo
    } from "@/axios/api";

    const RULE_MAP = {
        "01": "卡遗失",
        "02": "户名不符",
        "03": "填写错误",
        "04": "卡号不存在",
        "05": "卡被锁/关闭",
        "06": "卡消磁",
        "07": "芯片升级",
        "08": "账户不动帐",
        "09": "信用卡/附属卡",
        "99": "其他",
    };

    export default {

        props: {
            isShowModal: {
                type: Boolean,
                default: false,
            },
            m_title: {
                type: String,
            },
            serialNo: {
                type: String,
            },
            // columnInfo: {
            //     type: Object,
            //     required: true
            // },
        },
        data() {
            return {
                isShow: false,
                tableData: [],
            }
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
                    this.getChangeBankList()
                    console.log(this.serialNo)
                }
            }
        },

        methods: {
            //  关闭
            modalClose() {
                // 调用父组件方法关闭
                this.$parent.viewChangeRecords()
            },
            getChangeBankList() {
                queryBankByContractNo({
                    contractNo: this.serialNo
                }).then(res => {
                    if (res.code == '200') {
                        this.tableData = res.data;
                        this.isShow = res.data && res.data.length > 0 ? false : true;
                    }
                }).catch(error => {
                    console.log(error);
                });

            }
        },
        filters: {
            typeFilter(val) {
                if(val.bankCardChangeType=='99'){
                    return val.bankCardChangeDetailed
                }else{
                    return RULE_MAP[val.bankCardChangeType]
                }
            }
        }
    };
</script>
<style scoped lang="scss">
    .table-a {
        .table {
            margin: 6px 0;
            border: 2px solid #EBEEF5;
        }

        td {
            padding: 1px 6px;
        }

    }

    .rule-list {
        padding-bottom: 20px;

    }
</style>