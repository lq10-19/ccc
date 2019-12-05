<template>
    <div>
        <el-dialog :title="m_title" :visible.sync="isShowModal" :before-close="modalClose" width="860px"
            :close-on-click-modal='false'>
            <div class="rule-list">
                <div v-if="isShow" style="height: 100px;font-size:20px">暂无数据</div>
                <div class="rule-list-item" v-for="(item, index) in ruleList" :key="index">
                    <div class="rule-list-hint"></div>
                    <div class="rule-list-title">{{item.phaseName}}</div>
                    <el-form label-position="left" label-width="80px" class="form">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="阶段名称">
                                    <el-input v-model.trim="item.phaseName" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="签署人员">
                                    <el-input v-model.trim="item.userName" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="人员角色">
                                    <el-input v-model.trim="item.roleName" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="签署时间">
                                    <el-input v-model.trim="item.signTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-form-item label="意见内容">
                                <el-input style='width:86%' type="textarea" :autosize="{ minRows:3, maxRows: 6}"
                                    v-model.trim="item.signContent" readonly></el-input>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        listOpinion
    } from "@/axios/api";

    const RULE_MAP = {
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七",
        "8": "八",
    };
    export default {

        props: {
            isShowModal: {
                type: Boolean,
                default: false,
            },
            m_title: {
                type: String,
                default: false,
            },
            columnInfo: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                ruleMap: RULE_MAP,
                ruleList: [],
                isShow: false,
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
                    this.getOpinionList()
                    console.log(this.columnInfo)
                }
            }
        },

        methods: {
            //  关闭
            modalClose() {
                // 调用父组件方法关闭
                this.$parent.onSeeView()
            },
            getOpinionList() {
                let params = Object.assign({}, this.columnInfo)
                listOpinion({
                    ...params
                }).then(res => {
                    if (res.code == '200') {
                        this.ruleList = res.data || [];
                        this.isShow = this.ruleList.length == 0 ? true : false
                    }
                }).catch(error => {
                    console.log(error);
                });

            }
        }
    };
</script>
<style scoped lang="scss">
    .rule-list {

        .rule-list-item {
            width: 96%;
            border: solid #bbb 1px;
            border-left: none;
            position: relative;
            top: 0;
            left: 0;
            padding: 16px;
            margin-bottom: 26px;

            .rule-list-hint {
                position: absolute;
                left: 0;
                top: 0;
                width: 4px;
                height: 100%;
                background-color: rgb(108, 172, 244);

            }

            .rule-list-title {
                position: absolute;
                left: 20px;
                top: 0px;
                background: white;
                padding: 0 10px;
                transform: translateY(-50%);
            }
        }
    }
</style>