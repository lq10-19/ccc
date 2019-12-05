<template>
    <div class="container">
        <div style="margin-bottom: 6px">编辑订单 - {{$route.query.contractNo}}</div>
        <div class="info">
            <div class="info-title">客户信息</div>
            <div class="info-form-content">
                <div class="content-label">个人信息</div>
                <el-row class="content-detail">
                    <el-form :inline="true" label-width='100px' label-position="left" size='mini'>
                        <el-col :span="24">
                            <el-form-item label="姓名">
                                <el-input v-model.trim='loanListInfo.customername' disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="身份证号">
                                <el-input v-model.trim='loanListInfo.certid' disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>

            <div class="info-form-content">
                <div class="content-label">联系人信息</div>
                <div class="content-detail">
                    <el-row class="underline">
                        <el-form :model='oneContactsInfo' :inline="true" :rules="rules" ref='oneForm' label-width='95px'
                            label-position="left" size='mini'>
                            <el-col :span="8">
                                <el-form-item label="姓名" prop='contactName'>
                                    <el-input v-model.trim='oneContactsInfo.contactName' suffix-icon="empty"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="关系" prop='contactRelationship'>
                                    <el-select placeholder="请选择关系" v-model.trim='oneContactsInfo.contactRelationship'>
                                        <el-option v-for='item in relationTypeList' :key='item.itemNo'
                                            :label="item.itemName" :value="item.itemNo"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="手机号码" prop='contactPhone'>
                                    <el-input v-model.trim='oneContactsInfo.contactPhone'></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所在地区" prop='contactAdd'>
                                    <el-cascader :props='props' v-model.trim="oneContactsInfo.region"
                                        :options="cityList" @change="handleRegion(oneContactsInfo,$event)">
                                    </el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="详细地址" prop='contactAdd'>
                                    <el-input style="width: 150%;" v-model.trim='oneContactsInfo.contactAdd'></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>

                    <el-row class="marginTop20">
                        <el-form :model='twoContactsInfo' :inline="true" :rules="rules" ref='twoForm' label-width='95px'
                            label-position="left" size='mini'>
                            <el-col :span="8">
                                <el-form-item label="姓名" prop='contactName'>
                                    <el-input v-model.trim='twoContactsInfo.contactName' suffix-icon="empty"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="关系" prop='contactRelationship'>
                                    <el-select placeholder="请选择关系" v-model.trim='twoContactsInfo.contactRelationship'>
                                        <el-option v-for='item in relationTypeList' :key='item.itemNo'
                                            :label="item.itemName" :value="item.itemNo"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="手机号码" prop='contactPhone'>
                                    <el-input v-model.trim='twoContactsInfo.contactPhone'></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所在地区" prop='contactAdd'>
                                    <el-cascader :props='props' v-model.trim="twoContactsInfo.region"
                                        :options="cityList" @change="handleRegion(twoContactsInfo,$event)">
                                    </el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="详细地址" prop='contactAdd'>
                                    <el-input style="width: 150%;" v-model.trim='twoContactsInfo.contactAdd'></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>

                </div>
            </div>
        </div>

        <div class="info">
            <div class="info-title">贷款信息</div>
            <div class="info-form-content">
                <div class="content-label">产品信息</div>
                <el-row class="content-detail">
                    <el-form :inline="true" label-position="left" label-width='95px'>
                        <el-col :span="10">
                            <el-form-item label="业务类型">
                                <el-select v-model.trim='loanListInfo.businessType' disabled>
                                    <el-option v-for='item in businessTypeArr' :key='item.value' :label="item.name"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="产品大类">
                                <el-select v-model.trim="loanListInfo.productSuperType" disabled>
                                    <el-option v-for="item in productCategoryList" :key="item.typeNo"
                                        :label="item.typeName" :value="item.typeNo"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="产品名称">
                                <el-input v-model.trim='loanListInfo.productName' suffix-icon="empty" disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="授信方式">
                                <el-select v-model.trim='loanListInfo.creditType' disabled>
                                    <el-option v-for='item in creditTypeArr' :key='item.value' :label="item.name"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="产品档位">
                                <el-input v-model.trim="loanListInfo.productgrade" suffix-icon="empty" disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>

            <div class="info-form-content">
                <div class="content-label">借款信息</div>
                <el-row class="content-detail">
                    <el-form :inline="true" :model='loanListInfo' :rules="toLoanRules" ref='ToLoanFrom'
                        label-position="left" label-width='100px'>
                        <el-col :span="10">
                            <el-form-item label="贷款金额" prop='applyAmount'>
                                <el-input-number v-model.trim="loanListInfo.applyAmount" @change="handleChange"
                                    :min="+loanListInfo.lowprincipal" :max="+loanListInfo.surplusquota" :step="100"
                                    step-strictly :controls='false'>
                                </el-input-number>
                            </el-form-item>
                            <span class="sign">元</span>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="贷款期限" prop='term'>
                                <el-select v-model.trim='loanListInfo.term' placeholder="请选择贷款期限"
                                    @change="handleChangeTerm">
                                    <el-option v-for='(item,index) in loanListInfo.termList' :key='item.termId'
                                        :label="item.term" :value="item.term"></el-option>
                                </el-select>
                            </el-form-item>
                            <span class="sign">期</span>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="月基本还款额">
                                <el-input v-model.trim='loanListInfo.moyMent' suffix-icon="el-icon-rmb" disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="月还款金额">
                                <el-input v-model.trim='loanListInfo.moyMentCont' suffix-icon="el-icon-rmb" disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="放款金额">
                                <el-input v-model.trim='loanListInfo.loanAmount' suffix-icon="el-icon-rmb" disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
            <!-- 01 显示且必填
            02 显示且非必填
            03 不显示 -->
            <div class="info-form-content" v-if='!isShowloan'>
                <div class="content-label">费用信息</div>
                <el-form class="content-detail" :inline="true" label-position="left" label-width='100px'>
                    <el-row v-for='item in loanListInfo.costInfo' :key='item.termid'>
                        <el-col :span="24" v-if="item.isDisplay=='01'||item.isDisplay=='02'">
                            <el-checkbox style="line-height: 32px;min-width:100px ;" @change='changeRadio($event,item)'
                                v-model.trim="item.selection" :label="item.selection">
                                {{item.termname}}</el-checkbox>
                            <el-form-item>
                                <el-input :value='item.money' suffix-icon="el-icon-rmb" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="info">
            <div class="info-title">银行卡信息</div>
            <div class="info-form-content">
                <div class="content-label">银行卡信息</div>

                <el-row class="content-detail">
                    <el-form :inline="true" label-position="left" :model='tieOnCardDto' :rules="bankRules"
                        ref='bankFrom' label-width='95px'>
                        <el-col :span="10">
                            <el-form-item label="所属银行" prop='payacctbankcode'>
                                <el-select v-model.trim='tieOnCardDto.payacctbankcode' @change="handleChangeBank"
                                    placeholder="请选择银行">
                                    <el-option v-for="(item,index) in bankList" :label="item.name" :key='index'
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="开户城市" prop='customerBankCityId'>
                                <el-cascader v-model.trim="tieOnCardDto.customerBankCityId" :options="cityClassList"
                                    @change="handleChangeCity">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="开户支行" prop='customerBranchId'>
                                <el-select v-model.trim='tieOnCardDto.customerBranchId' @change="handleChangeSubBank"
                                    placeholder="请选择开户支行">
                                    <el-option v-for="(item,index) in subbranchList" :label="item.name" :key='index'
                                        :value="item.bankCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="银行卡号" prop='payacctno'>
                                <el-input v-model.trim='tieOnCardDto.payacctno' suffix-icon="empty"
                                    placeholder="请输入银行卡号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="预留手机号" prop='mobile'>
                                <el-input v-model.trim='tieOnCardDto.mobile' suffix-icon="empty" placeholder="请输入预留手机号">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
        </div>

        <div class="info">
            <div class="info-title">附件信息</div>
            <div class="info-form-content">

                <div class="content-label">附件信息</div>
                <el-form label-position="left" class="upload-form">
                    <el-form-item>
                        <el-button type="primary" @click="upload">上传</el-button>
                    </el-form-item>

                    <el-form-item v-for="(item,index) in docLIst" :key="index" required>
                        <i class="zl-input__required"></i>
                        <el-checkbox v-model.trim='item.isChecked' :checked='item.isChecked' :label="item.name"
                            disabled>
                        </el-checkbox>
                    </el-form-item>
                </el-form>
            </div>

        </div>

        <!-- 上传附件 -->
        <upload-modal :isShowModal="isShowUpload" :serialNo='loanListInfo.contractNo'>
        </upload-modal>

        <div class="btn_box">
            <el-button type="primary" @click="temporary">暂存</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </div>
</template>

<script>
    import UploadModal from "./upload_modal";
    import bus from "../bus"
    import {
        queryCodeLibrary,
        queryOrderInfo,
        contractEnquiry,
        getProvince,
        getAllBankInfo,
        queryCostInfo,
        updateSerialNoInfo,
        getDocAttachment,
        temporarySave
    } from "@/axios/api"
    let fileList = [{
            name: '银行卡正面',
            id: '3',
            docHttpUrl: '',
            docType: 'CCS001',
            isChecked: false
        },
        {
            name: '银行卡反面',
            id: '4',
            docHttpUrl: '',
            docType: 'CCS002',
            isChecked: false
        },
        {
            name: '申请人照片',
            id: '5',
            docHttpUrl: '',
            docType: 'CCS003',
            isChecked: false
        }
    ]
    let bankList = [{
            name: '中国工商银行',
            code: '102'
        },
        {
            name: '中国农业银行',
            code: '103'
        },
        {
            name: '中国银行',
            code: '104'
        },
        {
            name: '中国建设银行',
            code: '105'
        },
        {
            name: '招商银行',
            code: '308'
        },
        {
            name: '邮政储汇',
            code: '403'
        },
    ]

    // <!--   <array name="bank_name_type">
    //     <item>中国工商银行</item>2014081400000002
    //     <item>中国农业银行</item>2014081400000003
    //     <item>中国银行</item>2014081400000001
    //     <item>中国建设银行</item>2014081400000004
    //     <item>招商银行</item>2014081400000005
    //     <item>邮政储汇</item>2014081400000006
    // </array> -->
    const checkPhone = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('请输入手机号'));
        } else {
            const reg = /^[1][3,4,5,6,7,8,9]/;
            if (reg.test(value)) {
                callback();
            } else {
                return callback(new Error('请输入正确的手机号'));
            }
        }
    }
    export default {
        name: 'bill_lading_edit_order',
        components: {
            UploadModal
        },
        data() {
            return {
                isShowUpload: false,
                isShowloan: false,
                rowData: {},
                item: {},
                tieOnCardDto: {
                    customerBranchId: null,
                    payacctbankcode: null,
                    customerBankCityId: null,
                    payacctno: null,
                    mobile: null,
                },

                loanListInfo: {},
                contactsListInfo: [],
                oneContactsInfo: {},
                twoContactsInfo: {},
                bankList,
                fileList,
                cityList: [],
                cityClassList: [],
                resCodeList: [],
                subbranchList: [],
                docLIst: [],
                props: {
                    'value': 'label',
                },
                businessTypeArr: [{
                        name: "现金贷",
                        value: "01"
                    },
                    {
                        name: "消费贷",
                        value: "02"
                    }
                ],
                creditTypeArr: [{
                        name: "循环授信",
                        value: "01"
                    },
                    {
                        name: "一次授信",
                        value: "02"
                    }
                ],
                bankRules: {
                    customerBranchId: [{
                        required: true,
                        message: '请选择银行',
                        trigger: 'blur'
                    }],
                    payacctbankcode: [{
                        required: true,
                        message: '请选择开户支行',
                        trigger: 'blur'
                    }],
                    customerBankCityId: [{
                        required: true,
                        message: '请选择开户城市',
                        trigger: 'blur'
                    }],
                    payacctno: [{
                        required: true,
                        message: '请输入银行卡号',
                        trigger: 'blur'
                    }],
                    mobile: [{
                        validator: checkPhone,
                        required: true,
                        trigger: 'blur'
                    }],
                },
                toLoanRules: {
                    applyAmount: [{
                        required: true,
                        message: '请输入贷款金额',
                        trigger: 'blur'
                    }],
                    term: [{
                        required: true,
                        message: '请选择贷款期限',
                        trigger: 'blur'
                    }],
                },
                rules: {
                    contactName: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    contactRelationship: [{
                        required: true,
                        message: '请选择关系',
                        trigger: 'blur'
                    }],
                    contactPhone: [{
                        validator: checkPhone,
                        required: true,
                        trigger: 'blur'
                    }],
                    contactAdd: [{
                        required: true,
                        message: '请输入详细地址',
                        trigger: 'blur'
                    }],
                },
            }
        },
        created() {

            // 获取详情
            this.getOrderInfo()
        },
        computed: {
            productCategoryList() {
                return this.$store.state.productCategoryList;
            },
            relationTypeList() {
                return this.$store.state.relationTypeList;
            }
        },
        mounted() {
            bus.$on('apply:upload', (val) => {
                this.isShowUpload = val;
            })
        },

        methods: {
            upload() {
                this.isShowUpload = true;
            },
            // 修改贷款金额
            handleChange(value) {
                console.log(value, 1);
                // 请求
                this.changeLoanInfo()
            },
            // 选择贷款期限
            handleChangeTerm(value) {
                // 请求
                this.changeLoanInfo()
            },

            // 修改费用
            changeLoanInfo() {
                let params = {
                    amount: this.loanListInfo.applyAmount, //申请金额
                    term: this.loanListInfo.term, //期数
                    product: this.loanListInfo.productId, //产品id
                    version: this.loanListInfo.versionId, //版本
                    grade: this.loanListInfo.productgrade, //档位
                    gradeId: this.loanListInfo.gradeId, //档位id
                    serialNo: this.loanListInfo.contractNo,
                    costInfo: this.loanListInfo.costInfo,
                }
                queryCostInfo(params).then(res => {
                    console.log(res, 9527)
                    this.loanListInfo.loanAmount = res.data.loanAmount;
                    this.loanListInfo.moyMent = res.data.moyMent;
                    this.loanListInfo.moyMentCont = res.data.moyMentCont;
                    this.loanListInfo.costInfo = res.data.costList || [];
                    this.isShowloan = this.loanListInfo.costInfo.every(function (value, index, array) {
                        return value.isDisplay == '03';
                    })
                })
            },
            getOrderInfo() {

                queryOrderInfo({
                    ...this.$route.query
                }).then(res => {
                    if (res.code == '200') {

                        this.contactsListInfo = res.data.contactsListInfo;

                        this.contactsListInfo.forEach(value => {
                            value.region = [value.province, value.city, value.district]
                        })

                        this.oneContactsInfo = this.contactsListInfo[0] || {};
                        this.twoContactsInfo = this.contactsListInfo[1] || {};

                        this.tieOnCardDto = res.data.tieOnCardDto || {};
                        this.loanListInfo = res.data.loanListInfo || {};
                        this.isShowloan = this.loanListInfo.costInfo.every(function (value, index, array) {
                            return value.isDisplay == '03';
                        })

                        this.processingImgData(res.data.docList);
                        // 获取分行信息
                        if (this.tieOnCardDto.customerBankCityId && this.tieOnCardDto.payacctbankcode) {
                            this.getQueryInfo({
                                city: this.tieOnCardDto.customerBankCityId,
                                bankCode: this.tieOnCardDto.payacctbankcode
                            })
                        }

                    }
                }).catch(error => {
                    console.log(error)
                })

                getProvince().then(res => {
                    if (res.code == '200') {
                        this.cityList = res.data;
                        this.cityClassList = JSON.parse(JSON.stringify(res.data));
                    }
                    this.cityList.forEach(item => {
                        item.label = item.provinceName;
                        item.value = item.provinceCode;
                        item.children = item.cityMapList[item.provinceCode];
                        item.children.length > 0 && item.children.forEach(value => {
                            value.label = value.cityName;
                            value.value = value.cityCode;
                            value.children = value.districtMap[value.cityCode];
                            value.children.length > 0 && value.children.forEach(res => {
                                res.label = res.areaName;
                                res.value = res.areaCode;
                            })
                        })
                    })

                    this.cityClassList.forEach(item => {
                        item.label = item.provinceName;
                        item.value = item.provinceCode;
                        item.children = item.cityMapList[item.provinceCode];
                        item.children.length > 0 && item.children.forEach(value => {
                            value.label = value.cityName;
                            value.value = value.cityCode;
                        })
                    })
                }).catch(error => {
                    console.log(error)
                })
            },
            // 选择城市
            handleChangeCity(resCodeList) {
                console.log(resCodeList, 1)

                this.resCodeList = resCodeList;
                this.getQueryInfo();

                if (resCodeList.length != 2) return;

                let BankCity = this.cityClassList.find(res => {
                    return res.value == resCodeList[0]
                })
                this.tieOnCardDto.customerBankProvince = BankCity.label; //开户省份
                this.tieOnCardDto.customerBankProvinceId = BankCity.value; //开户省份编号
                let subBankCity = BankCity.children.find(value => {
                    return value.value == resCodeList[1]
                })
                this.tieOnCardDto.customerBankCity = subBankCity.label; //开户城市
            },
            // 地区
            handleRegion(resItem, reslist) {
                // 数组结构赋值
                [resItem.province, resItem.city, resItem.district] = [...reslist]
            },

            // 选择六点总银行
            handleChangeBank(res) {
                this.tieOnCardDto.customerBranchId = '';
                this.tieOnCardDto.payacctbankname = this.bankList.find(value => {
                    return value.code = res;
                }).name || '';

                this.getQueryInfo();
            },

            // 选择支行
            handleChangeSubBank(res) {
                this.tieOnCardDto.customerBranch = this.subbranchList.find(value => {
                    return value.bankCode = res;
                }).name || '';
            },
            // 获取分行
            getQueryInfo(res) {


                let params;
                if (res) {
                    params = res;
                } else {
                    if (!this.tieOnCardDto.payacctbankcode || this.resCodeList.length <= 0) return;
                    params = {
                        bankCode: this.tieOnCardDto.payacctbankcode,
                        city: this.resCodeList[this.resCodeList.length - 1]
                    }
                }

                this.subbranchList = [];
                getAllBankInfo(params).then(res => {
                    this.subbranchList = res.data;
                })
            },

            // 修改配置项
            changeRadio(event, resItem) {
                this.changeLoanInfo()
            },
            // 暂存
            temporary() {
                let params = Object.assign({}, this.processingData(), {
                    temporarySave: 1, //暂存 
                })
                temporarySave(params).then(res => {
                    if (res.code == '200') {
                        this.$message.success('订单暂存成功')
                        setTimeout(() => {
                            this.$router.push({
                                path: 'bill_lading_apply',
                            })
                        }, 500);
                    }
                })
            },
            // 获取附件
            getImgList() {
                // contractEnquiry({
                getDocAttachment({
                    serialNo: this.$route.query.contractNo,
                    fileType: 'file',
                    deleteFlag: '0'
                }).then(res => {
                    console.log(res, 1)
                    // this.docLIst = res.data || [];
                    this.processingImgData(res.data)
                })
            },
            // 保存
            save() {
                // temporarySave;//Pc端,1暂存，2保存
                let ToLoanFrom = false,
                    bankFrom = false,
                    oneForm = false,
                    twoForm = false;

                this.$refs.oneForm.validate((valid) => {
                    if (valid) {
                        oneForm = true
                    } else {
                        this.$message.warning("联系人信息有必填项为空!")
                        return false;
                    }
                });
                this.$refs.twoForm.validate((valid) => {
                    if (valid) {
                        twoForm = true
                    } else {
                        this.$message.warning("联系人信息有必填项为空!")
                        return false;
                    }
                });
                this.$refs.ToLoanFrom.validate((valid) => {
                    if (valid) {
                        ToLoanFrom = true
                    } else {
                        this.$message.warning("借款信息有必填项为空!")
                        return false;
                    }
                });
                this.$refs.bankFrom.validate((valid) => {
                    if (valid) {
                        bankFrom = true;
                    } else {
                        this.$message.warning("银行卡信息有必填项为空!")
                        return false;
                    }
                });
                console.log(this.docLIst)
                let isChecked = this.docLIst.find(item => {
                    return item.isChecked == false;
                })
                if (isChecked) {
                    this.$message.warning("请保证附件信息已上传!")
                    return
                }
                if (ToLoanFrom && bankFrom && oneForm && twoForm) {
                    let params = Object.assign({}, this.processingData(), {
                        temporarySave: 2, //保存
                    })
                    updateSerialNoInfo(params).then(res => {
                        if (res.code == '200') {
                            this.$message.success('订单保存成功')
                            setTimeout(() => {
                                this.$router.push({
                                    path: 'bill_lading_apply',
                                })
                            }, 500);
                        }
                    })
                }
            },
            // 过滤 处理数据
            processingData() {
                let params = Object.assign({}, this.loanListInfo, this.tieOnCardDto, {
                    docLIst: this.docLIst,
                    contactInfos: [this.oneContactsInfo, this.twoContactsInfo],
                    isAgent: 1,
                    customerCertId: this.loanListInfo.certid,
                    customerId: this.loanListInfo.customerid,
                    period: this.loanListInfo.term,
                    monthRepaymentAmountBasic: this.loanListInfo.moyMent,
                    monthRepaymentAmount: this.loanListInfo.moyMentCont,
                    customerName: this.loanListInfo.customername,
                    // 银行卡
                    customerBankNo: this.tieOnCardDto.payacctno,
                    customerBank: this.tieOnCardDto.payacctbankname,
                    customerBankId: this.tieOnCardDto.payacctbankcode,
                    bankPhone: this.tieOnCardDto.mobile,
                    serialNo: this.loanListInfo.contractNo,
                })
                params.customerBankCityId = Array.isArray(params.customerBankCityId) ? params.customerBankCityId.pop() :
                    params.customerBankCityId;

                params.periodId = this.loanListInfo.termList.find(item => {
                    return item.term = this.loanListInfo.term
                }).termId || '';

                return params;
            },

            processingImgData(resDocList = []) {
                let imgList = JSON.parse(JSON.stringify(this.fileList))
                if (resDocList && resDocList.length > 0) {
                    imgList.map(item => {
                        resDocList.forEach(value => {
                            if (item.docType == value.docType) {
                                item.isChecked = value.docAttachments.length > 0 ? true : false;
                            }
                        })
                    })
                };
                console.log(imgList, 11)
                this.docLIst = imgList;
            },
        }
    }
</script>

<style scoped lang="scss">
    /deep/ .el-input-number .el-input__inner {
        text-align: left !important;
    }

    /deep/ .el-checkbox__input.is-disabled+span.el-checkbox__label {
        color: #606266;
    }

    /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
        background-color: #409EFF;
    }

    .sign {
        display: inline-block;
        line-height: 32px;
    }

    .underline {
        border-bottom: solid rgb(108, 172, 244) 2px;
    }

    .marginTop20 {
        margin-top: 20px;
    }

    .btn_box {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 20px;
    }

    .info {
        padding: 20px;

        position: relative;
        margin-top: 20px;
        border: solid #DDD 1px;
        min-height: 200px;
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
            width: 100%;
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
                writing-mode: vertical-lr;
                text-align: center;
                letter-spacing: 10px;
                box-shadow: 0 0 2px #bbb;
            }

            .content-detail {
                flex: 1;
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

    .upload-form {
        .form-item-name {}
    }
</style>