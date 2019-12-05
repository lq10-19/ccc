<template>
    <div class="container">
        <div style="margin-bottom: 6px">订单详情 - {{$route.query.contractNo}}</div>
        <div class="info">
            <div class="info-title">客户信息</div>
            <div class="info-form-content">
                <div class="content-label">个人信息</div>
                <el-row class="content-detail">
                    <el-form size="mini" :inline="true" label-width="100px" label-position="left">
                        <el-col :span="8">
                            <el-form-item label="姓名" label-width="80px">
                                <el-input v-model.trim="customerInfo.customername" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="身份证号码">
                                <el-input v-model.trim="customerInfo.certid" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="身份证有效期">
                                <el-input disabled v-model.trim="customerInfo.limitTime"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="性别" label-width="80px">
                                <el-input :value="customerInfo.sex|sexFilter" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出生日期">
                                <el-input v-model.trim="customerInfo.birthday" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="年龄">
                                <el-input v-model.trim="customerInfo.age" disabled>
                                </el-input>
                            </el-form-item><span style="font-size: 12px;color: #606266;line-height: 28px;">岁</span>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="民族" label-width="80px">
                                <el-input :value="customerInfo.nationality|nationalityFilter" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="婚姻状况">
                                <el-input :value="customerInfo.marriage|marriageFilter" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="身份证地址">
                                <el-input v-model.trim="customerInfo.nativeplace" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="学历" label-width="80px">
                                <!-- <el-input v-model.trim='customerInfo.eduExperience' disabled> -->
                                <el-input :value="customerInfo.eduexperience|educationExperienceFilter" disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="手机号码">
                                <el-input v-model.trim="customerInfo.mobiletelephone" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电子邮箱">
                                <el-input v-model.trim="customerInfo.email" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>

            <div class="info-form-content company-info">
                <div class="content-label">单位信息</div>
                <el-row class="content-detail">
                    <el-form :inline="true" size="mini" label-position="left" label-width="90px">
                        <el-col :span="8">
                            <el-form-item label="公司名称">
                                <el-input v-model.trim="customerInfo.workcorp" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="职务">
                                <el-input :value="customerInfo.position|PositionFilter" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="公司电话">
                                <el-input v-model.trim="customerInfo.worktel" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="公司地址">
                                <el-input v-model.trim="customerInfo.workadd" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>

            <div class="info-form-content">
                <div class="content-label">配偶信息</div>
                <el-row class="content-detail">
                    <el-form :inline="true" size="mini" label-position="left" label-width="90px">
                        <el-col :span="8">
                            <el-form-item label="姓名">
                                <el-input v-model.trim="customerInfo.spousename" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="身份证号码">
                                <el-input v-model.trim="customerInfo.spousecertid" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="手机号码">
                                <el-input v-model.trim="customerInfo.spousetel" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="公司名称">
                                <el-input v-model.trim="customerInfo.spouseworkcorp" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="公司地址">
                                <el-input v-model.trim="customerInfo.spouseWorkAddDetail" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>


            <div class="info-form-content">
                <div class="content-label">联系人信息</div>
                <div class="content-detail">
                    <el-row v-for="(item,index) in contactsListInfo " :key='index'
                        :class="{underline: index==0,marginTop20:index==1}">
                        <el-form :model='item' :inline="true" ref='oneForm' label-width='90px' label-position="left"
                            size='mini'>
                            <el-col :span="8">
                                <el-form-item label="姓名" prop='contactName'>
                                    <el-input v-model.trim='item.contactName' suffix-icon="empty" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="关系" prop='contactRelationship'>
                                    <el-select placeholder="请选择关系" disabled v-model.trim='item.contactRelationship'>
                                        <el-option v-for='item in relationTypeList' :key='item.itemNo'
                                            :label="item.itemName" :value="item.itemNo"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="手机号码" prop='contactPhone'>
                                    <el-input v-model.trim='item.contactPhone' disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所在地区">
                                    <el-cascader :props='props' disabled v-model.trim="item.region" :options="cityList"
                                        @change="handleRegion(item,$event)">
                                    </el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="详细地址" prop='workAddDetail'>
                                    <el-input style="width: 150%;" v-model.trim='item.workAddDetail' disabled>
                                    </el-input>
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
                    <el-form :inline="true" label-position="left" label-width='100px'>
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
                    <el-form :inline="true" :model='loanListInfo' ref='ToLoanFrom' label-position="left"
                        label-width='100px'>
                        <el-col :span="10">
                            <el-form-item label="贷款金额" prop='applyAmount'>
                                <el-input v-model.trim="loanListInfo.applyAmount" suffix-icon="el-icon-rmb" disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="贷款期限" prop='term'>
                                <el-input v-model.trim="loanListInfo.term" suffix-icon="el-icon-stage" disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="月基本还款额" label-width='100px'>
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
            <div class="info-form-content" v-if='loanListInfo.costInfo&&loanListInfo.costInfo.length>0'>
                <div class="content-label">费用信息</div>
                <el-form class="content-detail" :inline="true" label-position="left" label-width='95px'>
                    <!-- <el-row v-for='item in loanListInfo.costInfo'> -->
                    <el-row v-for='item in loanListInfo.costInfo' :key='item.termid'>
                        <el-col :span="24" v-if="item.isDisplay=='01'||item.isDisplay=='02'">
                            <el-checkbox style="line-height: 32px;min-width:100px ;" disabled
                                @change='changeRadio($event,item)' v-model.trim="item.selection"
                                :label="item.selection">
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
                    <el-form :inline="true" label-position="left" :model='tieOnCardDto' ref='bankFrom'
                        label-width='95px'>
                        <el-col :span="10">
                            <el-form-item label="所属银行" prop='payacctbankcode'>
                                <el-select v-model.trim='tieOnCardDto.payacctbankcode' disabled
                                    @change="handleChangeBank" placeholder="请选择银行">
                                    <el-option v-for="(item,index) in bankList" :label="item.name" :key='index'
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="开户城市" prop='customerBankCityId'>
                                <el-cascader v-model.trim="tieOnCardDto.customerBankCityId" disabled
                                    :options="cityClassList" @change="handleChangeCity">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="开户支行" prop='customerBranchId'>
                                <el-select v-model.trim='tieOnCardDto.customerBranchId' disabled
                                    @change="handleChangeSubBank" placeholder="请选择开户支行">
                                    <el-option v-for="(item,index) in subbranchList" :label="item.name" :key='index'
                                        :value="item.bankCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="银行卡号" prop='payacctno'>
                                <el-input v-model.trim='tieOnCardDto.payacctno' suffix-icon="empty" disabled
                                    placeholder="请输入银行卡号">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="预留手机号" prop='mobile'>
                                <el-input v-model.trim='tieOnCardDto.mobile' suffix-icon="empty" disabled
                                    placeholder="请输入预留手机号"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import bus from "../bus"
    import {
        queryCodeLibrary,
        queryOrderInfo,
        getProvince,
        getAllBankInfo,
        queryCostInfo,
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
            const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
            console.log(reg.test(value));
            if (reg.test(value)) {
                callback();
            } else {
                return callback(new Error('请输入正确的手机号'));
            }
        }
    }
    export default {
        name: 'bill_lading_order_info',
        data() {
            return {
                isShowUpload: false,
                loanListInfo: {},
                item: {},
                customerInfo: {},
                tieOnCardDto: {
                    customerBranchId: null,
                    payacctbankcode: null,
                    customerBankCityId: null,
                    payacctno: null,
                    mobile: null,
                },

                loanListInfo: {},
                contactsListInfo: [{}, {}],
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
                contractNo: null,
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
                    workAddDetail: [{
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
        // filters: {
        //     componentFilter: function (value) {
        //         switch (value) {
        //             case 'A0019':
        //                 return '身份证正面'
        //                 break;
        //             case 'A0020':
        //                 return '身份证反面'
        //                 break;
        //             case 'CCS001':
        //                 return '银行卡正面'
        //                 break;
        //             case 'CCS002':
        //                 return '银行卡反面'
        //                 break;
        //             case 'CCS003':
        //                 return '申请人照片'
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        // },
        methods: {
            upload() {
                // this.$confirm('请先确保填已写的数据进行保存, 是否继续?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                //     this.isShowUpload = true;
                // }).catch(() => {

                // });
                this.isShowUpload = true;
            },
            // 
            handleChange(value) {
                console.log(value, 1);
                // 请求
                this.changeLoanInfo()
            },
            handleChangeTerm(value) {
                console.log(value, 2);
                // 请求
                this.changeLoanInfo()
            },
            changeLoanInfo() {

                let params = {
                    amount: this.loanListInfo.applyAmount, //申请金额
                    term: this.loanListInfo.term, //期数
                    product: this.loanListInfo.productId, //产品id
                    version: this.loanListInfo.versionId, //版本
                    grade: this.loanListInfo.productgrade, //档位
                    gradeId: this.loanListInfo.gradeId //档位id
                    // termid: this.pageData.stageid, //期数id
                }
                queryCostInfo(params).then(res => {
                    console.log(res, 9527)
                    this.loanListInfo.loanAmount = res.data.loanAmount;
                    this.loanListInfo.moyMent = res.data.moyMent;
                    this.loanListInfo.moyMentCont = res.data.moyMentCont;
                })
            },
            getOrderInfo() {
                queryOrderInfo({
                    ...this.$route.query
                }).then(res => {
                    if (res.code == '200') {
                        console.log(res, 7)
                        this.contactsListInfo = res.data && res.data.contactsListInfo.length > 0 ? res.data
                            .contactsListInfo : [{}, {}];
                        this.contactsListInfo.map(value => {
                            value.region = [value.province, value.city, value.district]
                        })
                        this.tieOnCardDto = res.data.tieOnCardDto || {};
                        this.loanListInfo = res.data.loanListInfo || {};
                        this.loanListInfo.costInfo = this.loanListInfo.costInfo.filter(item => {
                            return item.isDisplay != '03';
                        })

                        this.customerInfo = res.data.customerInfo || {};
                        if (
                            this.customerInfo.certeffectivestarttime &&
                            this.customerInfo.certeffectiveendtime
                        ) {
                            this.customerInfo.limitTime =
                                `${this.customerInfo.certeffectivestarttime} - ${this.customerInfo.certeffectiveendtime}`;
                        }
                        this.docLIst = res.data.docLIst || [];
                        console.log(this.tieOnCardDto, 7777)
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
                console.log(resItem)
                console.log(reslist);
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

    /deep/ .el-input.is-disabled .el-input__inner {
        color: rgb(96, 98, 102);
        background-color: rgb(255, 255, 255);
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