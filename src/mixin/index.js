const CREDIT_TYPE_MAP = {
    "01": "循环授信",
    "02": "一次性授信"
};
const STATUS_MAP = {
    "1": "启用",
    "2": "停用"
};
const BUSINESS_TYPE_MAP = {
    "01": "现金贷",
    "02": "消费贷"
};
const COLLECT_WAY_MAP = {
    "01": "分期收取",
    "02": "期初一次性收取"
};
const CLEAR_METHOD_MAP = {
    "01": "还款时结算",
    "02": "放款时结算"
};
const CALCU_METHOD_MAP = {
    "01": "贷款金额*费率",
    "02": "固定金额",
    "03": "月息费-月利息"
};

const contractStatusMinor_MAP = {
    '070020': '审批初审阶段',
    '070030': '审批终审阶段',
    '180020': '放款初审阶段',
    '180030': '放款终审阶段',
}
import store from "@/store";
import bus from "@/components/common/bus.js"
import {
    getCodeLibray
} from "@/axios/api";
import {
    resetObj
} from "@/lib/util";

export default {
    data() {
        return {
            currentPageS: 0,
            statusMap: STATUS_MAP,
            queryParams: {}, //=> 主要用来存放列表接口的查询条件的参数
            RoutingPath: '',
            isActivated: false,
            pagingInfo: {
                pageSize: 10,
                currentPage: 1,
                // total: 0
            }, //= 》是element - ui中分页组件（ el - pagination） 的初始化参数
            tableHeight: 300,
            creditTypeArr: [{
                name: "循环授信",
                value: "01"
            }, {
                name: "一次授信",
                value: "02"
            }] //授信方式列表
        }
    },

    created() {

    },
    mounted() {
        this.getTable();

        bus.$on('refresh', (res, resTagsList) => {
            if (this.isActivated || resTagsList.length === 1) {
                if (this.reset) {
                    this.reset()
                } else if (this.getCreditInfo) {
                    // 合同详情
                    this.getCreditInfo()

                } else if (this.getCustomerInfo) {
                    // 客户详情
                    this.getCustomerInfo()
                    this.getContactsList()
                    this.getChangeRecord()
                } else if (this.getOrderInfo) {
                    // 订单详情
                    this.getOrderInfo()
                } else if (this.getPDFList) {
                    // 电子合同
                    this.getPDFList()
                } else if (this.getFileList) {
                    // 附件
                    this.getFileList()
                } else if (this.getRepaymentPlan) {
                    // 还款计划
                    this.getRepaymentPlan()
                } else if (this.getArrearsList) {
                    // 欠费信息
                    this.getArrearsList()
                } else if (this.getPaymentHistory) {
                    // 还款记录
                    this.getPaymentHistory()
                }
                this.getTable();
               
            }
        })
    },

    watch: {
        "$route": {
            handler: "routeWatch",
            immediate: true
        },
    },
    activated() {
        this.isActivated = true;
    },
    deactivated() {
        this.isActivated = false;
    },
    // return this.$store.state.productCategoryList;
    filters: {
        //授信方式
        creditTypeFilter(val) {
            return CREDIT_TYPE_MAP[val];
        },
        //状态
        statusFilter(val) {
            return STATUS_MAP[val];
        },
        //业务类型
        businessTypeFilter(val) {
            return BUSINESS_TYPE_MAP[val];
        },

        //收取方式
        collectWayFilter(val) {
            return COLLECT_WAY_MAP[val];
        },
        //结算方式
        ClearMethodFilter(val) {
            return CLEAR_METHOD_MAP[val];
        },
        //计算方式
        calcuMethodFilter(val) {
            return CALCU_METHOD_MAP[val];
        },
        //阶段名称
        StatusMinorFilter(val) {
            return contractStatusMinor_MAP[val];
        },
        /*********************过滤器*************************/
        //产品大类
        productTypeFilter(val) {
            if (!val) return null;
            let obj = {};
            let arr = store.state.productCategoryList;
            arr.forEach(item => {
                obj[item.typeNo] = item.typeName;
            })
            return obj[val]
        },
        //关系列表
        relationTypeFilter(val) {
            if (!val) return null;
            let obj = {};
            let arr = store.state.relationTypeList;
            arr.forEach(item => {
                obj[item.itemNo] = item.itemName;
            })
            return obj[val]
        },
        //性别列表
        sexFilter(val) {
            if (!val) return null;
            let obj = {};
            let arr = store.state.sexList;
            arr.forEach(item => {
                obj[item.itemNo] = item.itemName;
            })
            return obj[val]
        },
        //民族
        nationalityFilter(val) {
            let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
            if (reg.test(val)) {
                return val
            }
            if (!val) return null;
            let obj = {};
            let arr = store.state.nationalityList;
            arr.forEach(item => {
                obj[item.itemNo] = item.itemName;
            })
            return obj[val]
        },
        //学历
        educationExperienceFilter(val) {
            if (!val) return null;
            let obj = {};
            let arr = store.state.educationExperienceList;
            arr.forEach(item => {
                obj[item.itemNo] = item.itemName;
            })
            return obj[val]
        },
        //婚姻关系
        marriageFilter(val) {
            if (!val) return null;
            let obj = {};
            let arr = store.state.marriageList;
            arr.forEach(item => {
                obj[item.itemNo] = item.itemName;
            })
            return obj[val]
        },

        //职务
        PositionFilter(val) {
            if (!val) return null;
            let obj = {};
            let arr = store.state.positionList;
            arr.forEach(item => {
                obj[item.itemNo] = item.itemName;
            })
            return obj[val]
        },
        //变更银行状态
        bankCardBackStatusFilter(val) {
            if (!val) return null;
            let obj = {};
            let arr = store.state.bankCardBackStatusList;
            arr.forEach(item => {
                obj[item.itemNo] = item.itemName;
            })
            return obj[val]
        },
    },
    methods: {
        routeWatch(newrouter, oldrouter) {
            // if (this.RoutingPath == newrouter.path) return;
            // this.RoutingPath = newrouter.path

            // const menuList = this.$store.state.menuList;

            // console.log(newrouter.path, 1)
            // menuList.forEach(res => {
            //     let aa = res.subs && res.subs.find(item => {
            //         return item.index == newrouter.path;
            //     })
            //     console.log(aa, 77777)
            // })

        },
        //置空按钮
        check() {

            this.pagingInfo = {
                ...this.pagingInfo,
                currentPage: 1
            }
            // 重置为第一页
            this.currentPageS = 1;

            this.queryParams = Object.assign({}, {
                paramObj: {}
            }, this.pagingInfo);

            this.getDataList();
        },
        //获取下拉框选项
        getSelect(type, itemNo) {
            let promise = new Promise((resolve, reject) => {
                getCodeLibray(type, itemNo).then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
            return promise;
        },
        //获取codeLibrary value与值得映射
        // getCodeLibrayMap(arr) {
        //     arr.forEach(item=>{

        //     })
        // },
        // 查询
        queryHandles() {
            this.queryParams = Object.assign({}, {
                paramObj: this.getParams() || {}
            }, this.pagingInfo, {
                currentPage: 1
            });
            this.currentPageS = 1;
            this.getDataList();
        },

        getTable() {

            this.$nextTick(() => {
                if (!this.$refs.multipleTable) return;
                const tableTop = this.$refs.multipleTable.$el.offsetTop;
                const clientHeight =
                    document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (clientHeight - tableTop - 132) || 300;
            });
        },
        // 分页长度改变
        handleSizeChange(pageSize) {
            this.pagingInfo = {
                ...this.pagingInfo,
                pageSize
            }
            this.queryParams = {
                ...this.queryParams,
                pageSize: this.pagingInfo.pageSize
            }
            this.getDataList()
        },

        //分页页码改变
        handleCurrentChange(currentPage) {

            this.pagingInfo = {
                ...this.pagingInfo,
                currentPage
            }
            this.queryParams = {
                ...this.queryParams,
                currentPage: this.pagingInfo.currentPage
            }
            this.getDataList()
        },

        //清空对象的值
        resetObj(obj) {
            resetObj(obj)
        }
    }
}