import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {
                title: '自述文件'
            },
            children: [

                /********************************提单管理**************************************/
                {
                    path: "bill_lading_apply",
                    component: resolve => require(['../pages/bill_lading/apply/index.vue'], resolve),
                    meta: {
                        title: "提单申请"
                    }
                },
                {
                    path: "bill_lading_edit_order",
                    component: resolve => require(['../pages/bill_lading/apply/edit_order.vue'], resolve),
                    meta: {
                        title: "编辑订单"
                    }
                },
                {
                    path: "bill_lading_order",
                    component: resolve => require(['../pages/bill_lading/order/index.vue'], resolve),
                    meta: {
                        title: "订单查询"
                    }
                },
                {
                    path: "bill_lading_order_info",
                    component: resolve => require(['../pages/bill_lading/order/order_info.vue'], resolve),
                    meta: {
                        title: "订单详情"
                    }
                },

                /****************************** 系统管理 ***********************************/
                {
                    path: '/authority_mgr_institution',
                    component: resolve => require(['../pages/system_mgr/institute.vue'], resolve),
                    meta: {
                        title: '机构管理'
                    }
                },
                {
                    path: '/authority_mgr_user',
                    component: resolve => require(['../pages/system_mgr/user.vue'], resolve),
                    meta: {
                        title: '用户管理'
                    }
                },
                {
                    path: '/authority_mgr_role',
                    component: resolve => require(['../pages/system_mgr/role.vue'], resolve),
                    meta: {
                        title: '角色管理'
                    }
                },

                /*************************** 产品设置 ***********************************/
                {
                    path: '/product_setting',
                    component: resolve => require(['../pages/product_mgr/product_setting/index'], resolve),
                    meta: {
                        title: '产品设置'
                    }
                },
                {
                    path: '/product_fee_setting',
                    component: resolve => require(['../pages/product_mgr/fee_setting/index'], resolve),
                    meta: {
                        title: '费用项设置'
                    }
                },

                {
                    path: '/repay_advance',
                    component: resolve => require(['../pages/product_mgr/repay_rule/repay_advance/index'], resolve),
                    meta: {
                        title: '提前还款规则'
                    }
                },
                {
                    path: '/repay_penalty',
                    component: resolve => require(['../pages/product_mgr/repay_rule/repay_penalty/index'], resolve),
                    meta: {
                        title: '违约金规则'
                    }
                },
                {
                    path: '/repay_collection',
                    component: resolve => require(['../pages/product_mgr/repay_rule/repay_collection/index'], resolve),
                    meta: {
                        title: '催收工本费规则'
                    }
                },
                {
                    path: '/product_period_limit',
                    component: resolve => require(['../pages/product_mgr/period_limit/index'], resolve),
                    meta: {
                        title: '贷款期数设置'
                    }
                },
                {
                    path: '/product_cate',
                    component: resolve => require(['../pages/product_mgr/product_cate/index'], resolve),
                    meta: {
                        title: '产品大类'
                    }
                },

                /*************************** 审批管理 ***********************************/
                //  初审
                {
                    path: '/check_primary_pending',
                    component: resolve => require(['../pages/check_mgr/primary_check/pending/index.vue'], resolve),
                    meta: {
                        title: '审批初审—待处理'
                    }
                },
                {
                    path: '/check_primary_done',
                    component: resolve => require(['../pages/check_mgr/primary_check/done/index.vue'], resolve),
                    meta: {
                        title: '审批初审—已处理'
                    }
                },
                //  终
                {
                    path: '/check_final_pending',
                    component: resolve => require(['../pages/check_mgr/final_check/pending/index.vue'], resolve),
                    meta: {
                        title: '审批终审—待处理'
                    }
                },
                {
                    path: '/check_final_done',
                    component: resolve => require(['../pages/check_mgr/final_check/done/index.vue'], resolve),
                    meta: {
                        title: '审批终审—已处理'
                    }
                },


                //合同详情
                {
                    path: '/constract_detail',
                    component: resolve => require(['../components/public/constract_detail.vue'], resolve),
                    meta: {
                        title: '合同详情'
                    }
                },
                //查看文件
                {
                    path: '/see_file',
                    component: resolve => require(['../components/public/see_file.vue'], resolve),
                    meta: {
                        title: '查看文件'
                    }
                },
                {
                    path: '/reinsurance_policy_policyList',
                    component: resolve => require(['../pages/check_mgr/reinsurance_policy/policyList/index.vue'], resolve),
                    meta: {
                        title: '分单池分单'
                    }
                },
                {
                    path: '/order_sheet_policyList',
                    component: resolve => require(['../pages/check_mgr/order_sheet/policyList/index.vue'], resolve),
                    meta: {
                        title: '调单'
                    }
                },

                /*************************** 放款管理 ***********************************/
                //  初审
                {
                    path: '/loan_primary_pending',
                    component: resolve => require(['../pages/Loan_mgr/primary_check/pending/index.vue'], resolve),
                    meta: {
                        title: '放款初审—待处理'
                    }
                },
                {
                    path: '/loan_primary_done',
                    component: resolve => require(['../pages/Loan_mgr/primary_check/done/index.vue'], resolve),
                    meta: {
                        title: '放款初审—已处理'
                    }
                },
                //  终
                {
                    path: '/loan_final_pending',
                    component: resolve => require(['../pages/Loan_mgr/final_check/pending/index.vue'], resolve),
                    meta: {
                        title: '放款终审—待处理'
                    }
                },
                {
                    path: '/loan_final_done',
                    component: resolve => require(['../pages/Loan_mgr/final_check/done/index.vue'], resolve),
                    meta: {
                        title: '放款终审—已处理'
                    }
                },


                //查看电子合同
                {
                    path: '/see_pdf',
                    component: resolve => require(['../components/public/see_pdf.vue'], resolve),
                    meta: {
                        title: '查看电子合同'
                    }
                },
                {
                    path: '/loan_policy_policyList',
                    component: resolve => require(['../pages/Loan_mgr/reinsurance_policy/policyList/index.vue'], resolve),
                    meta: {
                        title: '分单池分单'
                    }
                },
                {
                    path: '/loan_sheet_policyList',
                    component: resolve => require(['../pages/Loan_mgr/order_sheet/policyList/index.vue'], resolve),
                    meta: {
                        title: '调单'
                    }
                },

                /*********************首页 dashboard************************/
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: {
                        title: '系统首页'
                    }
                },

                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: {
                        title: '自定义图标'
                    }
                },
                /***********************************合同管理*****************************************/

                {
                    path: '/contract_search',
                    component: resolve => require(['../pages/contract/contract_search/index.vue'], resolve),
                    meta: {
                        title: '查看合同'
                    }
                },
                //合同详情
                {
                    path: '/contract_detail',
                    component: resolve => require(['../pages/contract/contract_details/index.vue'], resolve),
                    meta: {
                        title: '合同详情'
                    }
                },
                //提前还款记录
                {
                    path: '/prepayment_record',
                    component: resolve => require(['../pages/contract/contract_mgr/done/prepayment_record/index.vue'], resolve),
                    meta: {
                        title: '提前还款记录'
                    }
                },
                //提前还款
                {
                    path: '/early_repayment',
                    component: resolve => require(['../pages/contract/contract_mgr/pending/early_repayment/index.vue'], resolve),
                    meta: {
                        title: '提前还款'
                    }
                },


                {
                    path: '/contract_mgr_pending',
                    component: resolve => require(['../pages/contract/contract_mgr/pending/index.vue'], resolve),
                    meta: {
                        title: '未结清合同'
                    }
                },
                {
                    path: '/contract_mgr_done',
                    component: resolve => require(['../pages/contract/contract_mgr/done/index.vue'], resolve),
                    meta: {
                        title: '已结清合同'
                    }
                },
                /*******************************客户信息****************************************/
                {
                    path: '/customer_info',
                    component: resolve => require(['../pages/customer_info/index.vue'], resolve),
                    meta: {
                        title: '客户信息'
                    }
                },

                //客户信息详情
                {
                    path: '/customer_info_detail',
                    component: resolve => require(['../pages/customer_info/detail/index.vue'], resolve),
                    meta: {
                        title: '客户信息详情'
                    }
                },
                /*******************************报表管理****************************************/
                {
                    path: '/send_back_report',
                    component: resolve => require(['../pages/report/service_report/send_back_report/index.vue'], resolve),
                    meta: {
                        title: '送回盘报表'
                    }
                },

                //客户信息详情

                // {
                //     path: '/table',
                //     component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                //     meta: { title: '基础表格' }
                // },
                // {
                //     path: '/tabs',
                //     component: resolve => require(['../components/page/Tabs.vue'], resolve),
                //     meta: { title: 'tab选项卡' }
                // },
                // {
                //     path: '/form',
                //     component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                //     meta: { title: '基本表单' }
                // },
                // {
                //     // 富文本编辑器组件
                //     path: '/editor',
                //     component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                //     meta: { title: '富文本编辑器' }
                // },
                // {
                //     // markdown组件
                //     path: '/markdown',
                //     component: resolve => require(['../components/page/Markdown.vue'], resolve),
                //     meta: { title: 'markdown编辑器' }    
                // },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: resolve => require(['../components/page/Upload.vue'], resolve),
                //     meta: { title: '文件上传' }   
                // },
                // {
                //     // vue-schart组件
                //     path: '/charts',
                //     component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                //     meta: { title: 'schart图表' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: resolve => require(['../components/page/DragList.vue'], resolve),
                //     meta: { title: '拖拽列表' }
                // },
                // {
                //     // 拖拽Dialog组件
                //     path: '/dialog',
                //     component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                //     meta: { title: '拖拽弹框' }
                // },
                // {
                //     // 权限页面
                //     path: '/permission',
                //     component: resolve => require(['../components/page/Permission.vue'], resolve),
                //     meta: { title: '权限测试', permission: true }
                // },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: {
                        title: '404'
                    }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: {
                        title: '403'
                    }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/register',
            component: resolve => require(['../components/page/Register.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})