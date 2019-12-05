import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import {
    querylistProduct,
    queryCodeLibrary
} from "@/axios/api"

export default new Vuex.Store({
    state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
        // state: {
        productCategoryList: [], //产品大类
        selectedProductId: "", //当前选中项的产品id
        selectedGradeId: "", //当前选中产品的档位
        isLoading: false,
        menuList: [], //菜单列表
        relationTypeList: [], //关系列表
        sexList: [], //性别列表
        nationalityList: [], //民族
        educationExperienceList: [], //学历
        marriageList: [], //婚姻
        positionList: [], //职务
        bankCardBackStatusList: [], //变更银行状态
        transStatusList: [], //提前还款申请状态
        repaymentReasonList: [], //申请原因
        username: null, //登录用户名
    },

    mutations: { //修改数据仓库的事件
        changeFileList(state, value) {
            state.productCategoryList = value
        },
        setSelectedProductId(state, value) {
            state.selectedProductId = value;
        },
        setSelectedGradeId(state, value) {
            state.selectedGradeId = value;
        },
        setLoading(state, value) {
            state.isLoading = value;
        },
        setMenuList(state, value) {
            state.menuList = value;
        },
        setRelationTypeList(state, value) {
            state.relationTypeList = value;
        },
        setSexList(state, value) {
            state.sexList = value;
        },
        setNationalityList(state, value) {
            state.nationalityList = value;
        },
        setEducationExperienceList(state, value) {
            state.educationExperienceList = value;
        },
        setMarriageList(state, value) {
            state.marriageList = value;
        },
        setPositionList(state, value) {
            state.positionList = value;
        },
        setBankCardBackStatus(state, value) {
            state.bankCardBackStatusList = value;
        },
        setUsername(state, value) {
            state.username = value;
        },
        setTransStatusList(state, value) {
            state.transStatusList = value;
        },
        setRepaymentReasonList(state, value) {
            state.repaymentReasonList = value;
        },
    },


    actions: { //推荐使用的异步修改数据仓库
        setProjectList(context, value) {
            if (!value) {
                querylistProduct({}).then(res => {
                    context.commit('changeFileList', res.data)
                }).catch(value => {
                    console.log(value)
                })
            } else {
                context.commit('changeFileList', value)
            }

            // 关系
            queryCodeLibrary({
                codeNo: 'RelationType'
            }).then(res => {
                context.commit('setRelationTypeList', res.data)
            }).catch(value => {
                console.log(value)
            })
            // 性别
            queryCodeLibrary({
                codeNo: 'Sex'
            }).then(res => {
                context.commit('setSexList', res.data)
            }).catch(value => {
                console.log(value)
            })
            // 民族
            queryCodeLibrary({
                codeNo: 'Nationality'
            }).then(res => {
                context.commit('setNationalityList', res.data)
            }).catch(value => {
                console.log(value)
            })
            // 学历
            queryCodeLibrary({
                codeNo: 'EducationExperience'
            }).then(res => {
                context.commit('setEducationExperienceList', res.data)
            }).catch(value => {
                console.log(value)
            })
            // 提前还款申请状态
            queryCodeLibrary({
                codeNo: 'TransStatus'
            }).then(res => {
                context.commit('setTransStatusList', res.data)
            }).catch(value => {
                console.log(value)
            })
            // 提前还款 申请原因   
            queryCodeLibrary({
                codeNo: 'RepaymentReason'
            }).then(res => {
                context.commit('setRepaymentReasonList', res.data)
            }).catch(value => {
                console.log(value)
            })
            // 婚姻
            queryCodeLibrary({
                codeNo: 'Marriage'
            }).then(res => {
                context.commit('setMarriageList', res.data)
            }).catch(value => {
                console.log(value)
            })
            // 职务
            queryCodeLibrary({
                codeNo: 'Position'
            }).then(res => {
                context.commit('setPositionList', res.data)
            }).catch(value => {
                console.log(value)
            })
            //变更银行状态
            queryCodeLibrary({
                codeNo: 'BankCardBackStatus'
            }).then(res => {
                context.commit('setBankCardBackStatus', res.data)
            }).catch(value => {
                console.log(value)
            })
        },
        setChangeLoading(context, value) {
            context.commit('setLoading', value)
        }
    }
})