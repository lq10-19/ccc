<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in itemList">
                <template v-if="item.subs">
                    <el-submenu :index="item.menuPath" :key="item.menuPath" unique-opened>
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.menuName }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs && subItem.subs.length" :index="subItem.menuPath"
                                :key="subItem.menuPath">
                                <template slot="title">{{ subItem.menuName }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.menuPath"
                                    @click="itemClick(threeItem)">
                                    {{ threeItem.menuName }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.menuPath" :key="subItem.menuPath">
                                {{ subItem.menuName }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.menuPath" :key="item.menuPath">
                        <i :class="item.icon"></i><span slot="title">{{ item.menuName }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import {
        getMenu
    } from "@/axios/api";
    import Bus from "@/bus";
    export default {
        data() {
            return {
                collapse: false,
                // items: [{
                //         icon: "el-icon-s-order",
                //         menuPath: "bill_lading",
                //         menuName: "提单管理",
                //         subs: [{
                //                 menuPath: "bill_lading_apply",
                //                 menuName: "提单申请"
                //             },
                //             {
                //                 menuPath: "bill_lading_order",
                //                 menuName: "订单查询"
                //             },
                //         ]
                //     },
                //     {
                //         icon: "el-icon-lx-goods",
                //         menuPath: 'product_mgr',
                //         menuName: '产品管理',
                //         subs: [{
                //                 menuPath: 'product_setting',
                //                 menuName: '产品设置'
                //             },
                //             {
                //                 menuPath: 'product_fee_setting',
                //                 menuName: '费用项设置'
                //             },
                //             {
                //                 menuPath: 'repay_rule_setting',
                //                 menuName: '还款规则配置',
                //                 subs: [{
                //                         menuPath: "repay_advance",
                //                         menuName: "提前还款规则"
                //                     },
                //                     {
                //                         menuPath: "repay_penalty",
                //                         menuName: "违约金规则"
                //                     },
                //                     {
                //                         menuPath: "repay_collection",
                //                         menuName: "催收工本费规则"
                //                     }
                //                 ]
                //             },
                //             {
                //                 menuPath: 'product_period_limit',
                //                 menuName: '贷款期数设置'
                //             },
                //             {
                //                 menuPath: 'product_cate',
                //                 menuName: '产品大类'
                //             }
                //         ]
                //     },
                //     {
                //         icon: "el-icon-s-check",
                //         menuPath: "check_mgr",
                //         menuName: "审批管理",
                //         subs: [{
                //                 menuPath: "check_primary",
                //                 menuName: "审批初审",
                //                 subs: [{
                //                         menuPath: "check_primary_pending",
                //                         menuName: "待处理",
                //                     },
                //                     {
                //                         menuPath: "check_primary_done",
                //                         menuName: "已处理",
                //                     }
                //                 ]
                //             },
                //             {
                //                 menuPath: "check_final",
                //                 menuName: "审批终审",
                //                 subs: [{
                //                         menuPath: "check_final_pending",
                //                         menuName: "待处理",
                //                     },
                //                     {
                //                         menuPath: "check_final_done",
                //                         menuName: "已处理",
                //                     }
                //                 ]
                //             },
                //             {
                //                 menuPath: "reinsurance_policy_policyList",
                //                 menuName: "分单池分单",
                //             },
                //             {
                //                 menuPath: "order_sheet_policyList",
                //                 menuName: "调单",
                //             },
                //         ]
                //     },
                //     {
                //         icon: "el-icon-money",
                //         menuPath: "Loan_mgr",
                //         menuName: "放款管理",
                //         subs: [{
                //                 menuPath: "check_primary",
                //                 menuName: "放款初审",
                //                 subs: [{
                //                         menuPath: "loan_primary_pending",
                //                         menuName: "待处理",
                //                     },
                //                     {
                //                         menuPath: "loan_primary_done",
                //                         menuName: "已处理",
                //                     }
                //                 ]
                //             },
                //             {
                //                 menuPath: "check_final",
                //                 menuName: "放款终审",
                //                 subs: [{
                //                         menuPath: "loan_final_pending",
                //                         menuName: "待处理",
                //                     },
                //                     {
                //                         menuPath: "loan_final_done",
                //                         menuName: "已处理",
                //                     }
                //                 ]
                //             },
                //             {
                //                 menuPath: "loan_policy_policyList",
                //                 menuName: "分单池分单",
                //             },
                //             {
                //                 menuPath: "loan_sheet_policyList",
                //                 menuName: "调单",
                //             },
                //         ]
                //     },
                //     {
                //         icon: "el-icon-document",
                //         menuPath: "contract",
                //         menuName: "合同管理",
                //         subs: [{
                //                 menuPath: "contract_search",
                //                 menuName: "合同查询"
                //             },
                //             {
                //                 menuPath: "contract_mgr",
                //                 menuName: "合同管理",
                //                 subs: [{
                //                         menuPath: "contract_mgr_pending",
                //                         menuName: "未结清合同"
                //                     },
                //                     {
                //                         menuPath: "contract_mgr_done",
                //                         menuName: "已结清合同"
                //                     }
                //                 ]
                //             }
                //         ]
                //     },
                //     {
                //         icon: "el-icon-s-custom",
                //         menuPath: "customer",
                //         menuName: "客户管理",
                //         subs: [{
                //             menuPath: "customer_info",
                //             menuName: "客户信息"
                //         }]
                //     }

                //     {
                //         icon: 'el-icon-lx-home',
                //        menuPath: 'system-mgr',
                //         menuName: '系统管理',
                //         subs:[
                //             {
                //                menuPath:'authority_mgr',
                //                 menuName:'权限管理',
                //                 subs:[
                //                     {
                //                        menuPath:"authority_mgr_institution",
                //                         menuName:'机构管理',
                //                     },
                //                     {
                //                        menuPath:"authority_mgr_user",
                //                         menuName:'用户管理'
                //                     },
                //                     {
                //                        menuPath:"authority_mgr_role",
                //                         menuName:'角色管理'
                //                     }
                //                 ]
                //             }
                //         ]
                //     }
                // ],
                curUrl: '' //当前点击菜单的请求的接口
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            },
            itemList() {
                let items = this.$store.state.menuList;
                // return [...this.items]
                // return [...items, ...this.items]
                return [...items]
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });

            // this.getMenuData();

            // 请求产品大类数据
            this.$store.dispatch('setProjectList');
        },
        // watch: {
        //     "$route": {
        //         handler: "routeWatch",
        //         immediate: true
        //     },
        // },

        methods: {
            //获取菜单数据
            // getMenuData() {
            // getMenu().then(res => {
            //     let items = JSON.stringify(res.data);
            //     items = items.replace(/menuName/g, 'title');
            //     items = items.replace(/menuPath/g, 'index');
            //     items = JSON.parse(items);
            //     this.items.unshift(...items);
            //     console.log(this.items, 777)
            // });
            // },
            // routeWatch(newV, oldV) {
            //     console.log(newV);
            //     if(this.items.length) {
            //         Bus.globalData.curUrl = this.getCurUrl(newV.fullPath,this.items);
            //     }

            // },
            // //获取当前路由的查询接口
            // getCurUrl(fullPath,items) {
            //     let vm = this;
            //     let curUrl;
            //     console.warn(items)
            //     items.some(item => {
            //         console.log(item)
            //         if(item.menuPath === fullPath) {
            //             curUrl = item.menuUrl;
            //             return true;
            //         } else {
            //             vm.getCurUrl(fullPath, item);
            //         }
            //     });
            //     return curUrl;
            // },

            //点击时获取接口数据
            itemClick(item) {
                // debugger
                // this.curUrl = item.menuUrl;
                // Bus.globalData.curUrl = this.curUrl;
            },
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar>ul {
        height: 100%;
    }
</style>