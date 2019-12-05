<template>
    <div>
        <div v-if="contactsList.length==0" style="height: 100px;font-size:20px">暂无数据</div>
        <div class="info" v-for='(item,index) in contactsList'>
            <div class="info-title">联系人{{index+1}}</div>
            <div class="info-form-content company-info">
                <div class="content-label">个人信息</div>
                <el-row>
                    <el-form :inline="true" label-position="left" class="content-detail">
                        <el-col :span="8">
                            <el-form-item label="姓名">
                                <el-input v-model.trim='item.contactName' readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="关系">
                                <el-input :value='item.contactRelationship|relationTypeFilter' readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="手机号码">
                                <el-input v-model.trim='item.contactPhone' readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="地址">
                                <el-input style="width:160%" v-model.trim='item.contactAdd' readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getContactListByCustomer
    } from "@/axios/api";

    export default {
        props: {
            customerId: {
                type: String,
            }
        },
        data() {
            return {
                contactsList: []
            };
        },
        created() {
            this.getContactsList()
        },
        methods: {
            handleClick(row) {
                console.log(row);
            },
            getContactsList() {
                getContactListByCustomer({
                    customerId: this.customerId
                }).then(res => {
                    this.contactsList = res.data;
                }).catch(error => {
                    console.log(error)
                })
            }

        },
    };
</script>



<style lang="scss" scoped>
    .info {
        padding: 20px;
        position: relative;
        margin-top: 20px;
        border: solid #DDD 1px;
        display: flex;
        flex-wrap: wrap;

        .info-title {
            padding: 0 10px;
            text-align: center;
            background: white;
            color: black;
            position: absolute;
            left: 40px;
            top: -15px;
            // transform: translateY(-50%);
        }

        .info-form-content {
            display: flex;
            margin-top: 20px;
            border-bottom: solid rgb(245, 245, 245) 4px;
            padding-bottom: 20px;

            .content-label {
                position: relative;
                width: 32px;
                padding-top: 6px;
                padding-left: 10px;
                margin-right: 20px;
                /* writing-mode: vertical-lr; */
                text-align: center;
                letter-spacing: 10px;
                box-shadow: 0 0 2px #bbb;

                .label-hint {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 4px;
                    height: 100%;
                    background-color: rgb(108, 172, 244);
                }
            }

            .content-detail {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
            }
        }
    }

    .content-label::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background-color: rgb(108, 172, 244);
    }
</style>