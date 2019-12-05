import {
  fetch
} from "./fetch"; //引用fetch.js


//获取左树列表
export function getMenu(data) {
  return fetch({
    url: `/menuController/queryByUserId`,
    method: 'get', //请求方法
    params: data
    // isLoading:false
  })
}

//登录
export function login(data) {
  return fetch({
    url: `/login/login`,
    method: 'get', //请求方法
    params: data,
    isToken: false //是否添加token
  })
}

//用户退出
export function loginOut() {
  return fetch({
    url: `/login/loginOut`,
    method: 'get' //请求方法
  })
}

//用户注册
export function userRegister(data) {
  return fetch({
    url: `/login/userRegister`,
    method: 'post', //请求方法
    data
  })
}

//修改密码
export function changePwd(data) {
  return fetch({
    url: `/sysUserInfo/changePwd`,
    method: 'post', //请求方法
    data
  })
}

// 上传excel
export function sendMessage(data) {
  return fetch({
    url: `/contractListInfo/sendMessage`,
    method: 'post', //请求方法
    data,
  })
}

//获取验证码
export function getVerifyCode() {
  return fetch({
    url: `/login/validateCode`,
    method: 'post', //请求方法
    isLoading: false
  })
}



export function getRoleData(url, params) {
  return fetch({
    url: `${url}`,
    method: 'get', //请求方法
    params
  })
}

//获取各种下拉框
export function getCodeLibray(code = "", itemNo = "") {
  return fetch({
    url: `/codeLibrary/queryCodeLibrary?codeNo=${code}&itemNo=${itemNo}`,
    method: 'get'
  })
}

//********************** 部门管理************************************ *//

//新增记录
export function addDepartment(formData) {
  return fetch({
    url: `/departmentInfo/save`,
    method: 'post', //请求方法
    data: formData
  })
}

//编辑
export function editDepartment(data) {
  return fetch({
    url: `/departmentInfo/update`,
    method: 'post', //请求方法
    data
    // data: {
    //   departmentInfoEntity: formData
    // }
  })
}
//根据用户id查询部门信息
export function getDepartmentInfo(data = {}) {
  return fetch({
    url: `/departmentInfo/queryByParams`,
    method: 'get', //请求方法
    params: data
  })
}

//根据用户id 查询部门信息
export function queryUnRoleListByUserId(data = {}) {
  return fetch({
    url: `/roleInfo/queryUnRoleListByUserId`,
    method: 'post', //请求方法
    data
  })
}



//用户管理
export function getUserInfo(data = {}) {
  return fetch({
    url: `/sysUserInfo/queryByParams`,
    method: 'post', //请求方法
    data
  })
}



//删除记录
export function deleteDepartment(departmentIds) {
  return fetch({
    url: `/departmentInfo/deleteByIds`,
    method: 'post', //请求方法
    data: departmentIds

  })
}

//********************** 用户管理************************************ *//

//记录 
export function addUser(submitData) {
  return fetch({
    url: `/sysUserInfo/addUser`,
    method: 'post', //请求方法
    data: submitData
  })
}

//编辑用户信息 
export function editUser(submitData) {
  return fetch({
    url: `/sysUserInfo/update`,
    method: 'post', //请求方法
    data: submitData
  })
}

// 获取角色信息列表
export function getRoleInfo(data = {}) {
  return fetch({
    url: `/roleInfo/queryByParams`,
    method: "post",
    data,
  })
}
// 获取分配资源列表
export function queryMenuAndButtonByRule(data = {}) {
  return fetch({
    url: `/menuController/queryMenuAndButtonByRule`,
    method: "get",
    params: data,
  })
}
// 新增菜单
export function saveMenu(data = {}) {
  return fetch({
    url: `/menuController/save`,
    method: "post",
    data,
  })
}
// 新增按钮
export function saveButton(data = {}) {
  return fetch({
    url: `/menuButtonController/save`,
    method: "post",
    data,
  })
}
// 删除菜单
export function deleteMenu(data = {}) {
  return fetch({
    url: `/menuController/delete`,
    method: "post",
    data,
  })
}
//  删除按钮
export function deleteButton(data = {}) {
  return fetch({
    url: `/menuButtonController/delete`,
    method: "post",
    data,
  })
}
//  设置角色按钮
export function selectMenubuttonList(data = {}) {
  return fetch({
    url: `/roleResourceManageController/selectMenubuttonList`,
    method: "post",
    data,
  })
}

//  设置角色按钮
export function findResourceIdListByRoleId(data = {}) {
  return fetch({
    url: `/menuController/findResourceIdListByRoleId`,
    method: "get",
    params: data,
  })
}


export function deleteUser(userId) {
  return fetch({
    url: `/sysUserInfo/deleteByIds`,
    method: 'post', //请求方法
    data: userId
  })
}

export function resetPwd(data) {
  return fetch({
    url: `/sysUserInfo/resetPwd`,
    method: 'post', //请求方法
    data
  })
}
// 变更上级
export function changeLeaderAsk(data) {
  return fetch({
    url: `/sysUserInfo/changeLeader`,
    method: 'post', //请求方法
    data
  })
}
// 角色维护 添加
export function saveByIds(data) {
  return fetch({
    url: `/userRoleRelationInfo/saveByIds`,
    method: 'post', //请求方法
    data
  })
}
// 查询已维护的角色列表
export function queryRoleListByUserId(data) {
  return fetch({
    url: `/roleInfo/queryRoleListByUserId`,
    method: 'get', //请求方法
    params: data
  })
}

// 批量移除角色
export function userRoledelete(data) {
  return fetch({
    url: `/userRoleRelationInfo/delete`,
    method: 'post', //请求方法
    data
  })
}




//********************** 角色管理************************************ *//

//删除角色
export function deleteRole(rolsIds) {
  return fetch({
    url: `/roleInfo/deleteByIds`,
    method: 'post', //请求方法
    data: rolsIds

  })
}

//新增角色
export function addRole(submitData) {
  return fetch({
    url: `/roleInfo/addRole`,
    method: 'post', //请求方法
    data: submitData

  })
}

//编辑角色
export function editRole(submitData) {
  return fetch({
    url: `/roleInfo/update`,
    method: 'post', //请求方法
    data: submitData
  })
}

/**************************产品设置**************************************/

//查询产品设置
export function getProductSetting(data = {}) {
  return fetch({
    url: `/product/productInfo/queryByPage`,
    method: "post",
    data
  })
}

//产品启用停用
export function setProductStatus(data = {}, type) {
  return fetch({
    url: `/product/productInfo/productStopOrUse?type=${type}`,
    method: "post",
    data: {
      productId: data
    }
  })
}

//产品重载/product/productInfo/reload
export function productReload(ids) {
  return fetch({
    url: `/product/productInfo/reload?ids=${ids}`,
    method: "post"
  })
}

//产品导出
export function productExport(data) {
  return fetch({
    url: `/product/productInfo/export`,
    method: "post",
    responseType: 'blob',
    data,
    skipValidate: true,
  })
}

//查询产品设置详情
export function getProductDetail(productId) {
  return fetch({
    url: `/product/productInfo/queryById`,
    method: "get",
    params: {
      productId
    }
  })
}

//新增产品设置
export function addProductSetting(data = {}) {
  return fetch({
    url: `/product/productInfo/save`,
    method: "post",
    data
  })
}

//编辑产品设置
export function updateProductSetting(data = {}) {
  return fetch({
    url: `/product/productInfo/update`,
    method: "post",
    data
  })
}

//查询产品大类选项
export function getProductTypeList(businessType = "") {
  return fetch({
    url: `/product/productSuperType/queryByPara`,
    method: "get",
    params: {
      businessType
    }
  })
}

//产品档位配置
export function getProductConfig(data = {}) {
  return fetch({
    url: `/product/grade/queryByPage`,
    method: "post",
    data
  })
}

//产品档位下拉
export function queryGradeDropDown(data = {}) {
  return fetch({
    url: `/product/grade/queryGradeDropDown`,
    method: "get",
    params: data
  })
}

//产品档位配置新增
export function prodConfigAdd(data = {}) {
  return fetch({
    url: `/product/grade/save`,
    method: "post",
    data
  })
}

//产品档位启用
export function prodGradeUpate(data = {}) {
  return fetch({
    url: `/product/grade/update`,
    method: "post",
    data
  })
}

//进入产品档位
export function prodGradet2Edit(gradeId) {
  return fetch({
    url: `/product/grade/queryById?gradeId=${gradeId}`,
    method: "get"
  })
}

//产品费用项设置列表
export function getProductTermList(data) {
  return fetch({
    url: `/product/productTermLibrary/queryByPage`,
    method: "post",
    data
  })
}
//产品费用项状态设置
export function setProductFeeStatus(data) {
  return fetch({
    url: `/product/productTermLibrary/stopOrUse`,
    method: "post",
    data
  })
}
//费用下拉框
export function getFeeSelectList(data) {
  return fetch({
    url: `/product/feeLibrary/queryByPara?objectType=Term`,
    method: "get",
    params: data
  })
}

//获取新增基本费用项结构
export function getAddStruct() {
  return fetch({
    url: `/product/productTermLibrary/toAdd`,
    method: "get"
  })
}

//新增产品基本费用项
export function addProductFee(data) {
  return fetch({
    url: `/product/productTermLibrary/save`,
    method: "post",
    data
  })
}

//更新基本费用项
export function updateBaisicFee(data) {
  return fetch({
    url: `/product/productTermLibrary/update`,
    method: "post",
    data
  })
}

//期数新增页面查询分期收取费用项
export function productTermToAdd(data) {
  return fetch({
    url: `/product/productTerm/toAdd`,
    method: "get",
    params: data
  })
}

//产品期次资方配置编辑
export function employeUpdate(data) {
  return fetch({
    url: `/product/employer/update`,
    method: "post",
    data
  })
}

//产品期次下拉框
export function queryTermDropDow(data) {
  return fetch({
    url: `/product/productTerm/queryTermDropDown`,
    method: "get",
    params: data
  })
}

//分期查询
export function getProductTermTableList(data) {
  return fetch({
    url: `/product/productTerm/queryByPage`,
    method: "post",
    data
  })
}
//分期设置新增
export function productTermSave(data) {
  return fetch({
    url: `/product/productTerm/save`,
    method: "post",
    data
  })
}

//期次编辑保存
export function updateProductTerm(data) {
  return fetch({
    url: `/product/productTerm/update`,
    method: "post",
    data
  })
}

//资方新增页面查询管理费

export function employerToAdd(data) {
  return fetch({
    url: `/product/employer/toAdd`,
    method: "get",
    params: data
  })
}
//资方新增
export function saveEmployer(data) {
  return fetch({
    url: `/product/employer/save`,
    method: "post",
    data
  })
}



/**************************费用项设置************************************/

//新增费用项
export function addBasicFee(data = {}) {
  return fetch({
    url: `/product/feeLibrary/save`,
    method: "post",
    data
  })
}

//编辑费用项
export function editBasicFee(data = {}) {
  return fetch({
    url: `/product/feeLibrary/update`,
    method: "post",
    data
  })
}



//查询基本费用项

export function getBasicFeeById(params = {}) {
  return fetch({
    url: `/product/feeLibrary/queryById`,
    method: "get",
    params
  })
}


//根据参数查询基本费用项
export function getBasicFee(data = {}) {
  return fetch({
    url: `/product/feeLibrary/queryByPage`,
    method: "post",
    data
  })
}

//查询产品期次
export function getProductTerm(data) {
  return fetch({
    url: `/product/productTerm/queryById`,
    method: "get",
    params: {
      termId: data
    }
  })
}

//查询资方列表
export function getEmployerList(data) {
  return fetch({
    url: `/product/employer/queryByPage`,
    method: "post",
    data
  })
}
//根据主键查询产品期次资方配置
export function getEmployerById(data) {
  return fetch({
    url: `/product/employer/queryById?employerId=${data}`,
    method: "get"
  })
}

/******************************还款规则配置******************************************/
export function getRepayList(ruleCode) {
  return fetch({
    url: `/product/ruleConfig/queryList`,
    method: 'get', //请求方法
    params: {
      ruleCode
    }
  })
}

//新增提前还款列表
export function saveAdvanceRepayList(data) {
  return fetch({
    url: `/product/ruleConfig/save`,
    method: 'post', //请求方法
    data
  })
}


/***************************贷款期数限制*****************************************/

export function getProductLimitList(data = {}) {
  return fetch({
    url: `/product/term/queryByPage`,
    method: "post",
    data
  })
}

//新增期次
export function addProductLimitList(data = {}) {
  return fetch({
    url: `/product/term/save`,
    method: "post",
    data
  })
}

//编辑期次 
export function editProductLimitList(data = {}) {
  return fetch({
    url: `/product/term/update`,
    method: "post",
    data
  })
}

//违约金规则删除规则
export function ruleConfigDelete(data = {}) {
  return fetch({
    url: `/product/ruleConfig/delete`,
    method: "post",
    data
  })
}
//资方下拉框选项查询
export function queryCapitalList() {
  return fetch({
    url: "/capitalInfo/queryCapitalList",
    method: "get",
  })
}
/***************************** 产品大类 ****************************************/

//查询产品大类
export function getProductCate(data = {}) {
  return fetch({
    url: `/product/productSuperType/queryByPage`,
    method: "post",
    data
  })
}

//新增
export function addProductCate(data = {}) {
  return fetch({
    url: `/product/productSuperType/save`,
    method: "post",
    data
  })
}

//编辑
export function editProductCate(data = {}) {
  return fetch({
    url: `/product/productSuperType/update`,
    method: "post",
    data
  })
}


/********************审批管理***************************/
// 审批初审列表 待处理
export function queryCheckFirst(data = {}) {
  return fetch({
    url: `/loanExecute/queryCheckFirst`,
    method: "post",
    data
  })
}
// 审批初审列表 已处理合同
export function queryCheckFirstFinished(data = {}) {
  return fetch({
    url: `/loanExecute/queryCheckFirstFinished`,
    method: "post",
    data
  })
}
// 获取产品大类
// 获取产品大类and 产品名称
export function querylistProduct(data = {}) {
  return fetch({
    // url: `/loanExecute/listProduct`,
    url: `/product/productSuperType/querySuperTypeAndProduct`,
    method: "get",
    isLoading: false,
    // data
  })
}
// 审批终审列表 待处理
export function queryCheckLast(data = {}) {
  return fetch({
    url: `/loanExecute/queryCheckLast`,
    method: "post",
    data
  })
}
// 审批终审列表 已处理
export function queryCheckLastFinished(data = {}) {
  return fetch({
    url: `/loanExecute/queryCheckLastFinished`,
    method: "post",
    data
  })
}
// 终审人员名单
export function listChecker(data = {}) {
  return fetch({
    url: `/loanExecute/listChecker`,
    method: "post",
    data
  })
}



// 保存签署意见
export function opinionSign(data = {}) {
  return fetch({
    url: `/loanExecute/opinionSign`,
    method: "post",
    data
  })
}
// 查看意见
export function listOpinion(data = {}) {
  return fetch({
    url: `/loanExecute/listOpinion`,
    method: "post",
    data
  })
}

// 初审保存审核
export function checkFirst(data = {}) {
  return fetch({
    url: `/loanExecute/checkFirst`,
    method: "post",
    data
  })
}
// 终审保存审核
export function checkLast(data = {}) {
  return fetch({
    url: `/loanExecute/checkLast`,
    method: "post",
    data
  })
}
// 获取个人状态
export function queryUserStatus(data = {}) {
  return fetch({
    url: `/loanExecute/queryUserStatus`,
    method: "post",
    data
  })
}

// 保存个人状态
export function modifyUserStatus(data = {}) {
  return fetch({
    url: `/loanExecute/modifyUserStatus`,
    method: "post",
    data
  })
}



// 初审合同详情
export function queryCreditInfo(data = {}) {
  return fetch({
    url: `/creditInfo/queryCreditInfo`,
    method: "get",
    params: data
  })
}
// 查询调单记录
export function listTransferOrder(data = {}) {
  return fetch({
    url: `/loanExecute/listTransferOrder`,
    method: "post",
    data
  })
}
// 获取分单池列表
export function queryOrderListByPage(data = {}) {
  return fetch({
    url: `/manualOrder/distribute/queryOrderListByPage`,
    method: "post",
    data
  })
}
// 获取分单池列表 根据流程获取审批人员(分页)

export function getSysUserListByPage(data = {}) {
  return fetch({
    url: `/manualOrder/distribute/getSysUserListByPage`,
    method: "post",
    data
  })
}
// 获取分单池列表 根据流程获取审批人员（不分页）

export function getSysUserList(data = {}) {
  return fetch({
    url: `/manualOrder/distribute/getSysUserList`,
    method: "get",
    params: data
  })
}

// 获取分单池列表 提交分单
export function distributeOrde(data = {}) {
  return fetch({
    url: `/manualOrder/distribute/distributeOrder`,
    method: "post",
    data
  })
}

// 获取跳调单池列表 
export function getOrderList(data = {}) {
  return fetch({
    url: `/manualOrder/transfer/getOrderList`,
    method: "get",
    params: data
  })
}
// 获取跳调单池列表 分页
export function getOrderListByPage(data = {}) {
  return fetch({
    url: `/manualOrder/transfer/getOrderListByPage`,
    method: "post",
    data
  })
}

// 获取调单 根据流程获取审批人员（不分页）
export function getSheetUserList(data = {}) {
  return fetch({
    url: `/manualOrder/transfer/getSysUserList`,
    method: "get",
    params: data
  })
}


// 获取调单池  提交调单
export function transferOrder(data = {}) {
  return fetch({
    url: `/manualOrder/transfer/transferOrder`,
    method: "post",
    data
  })
}



/********************放款管理***************************/
// 审批初审列表 待处理
export function queryLoanCheckFirst(data = {}) {
  return fetch({
    url: `/loanExecute/queryLoanCheckFirst`,
    method: "post",
    data
  })
}
// 审批初审列表 已处理
export function queryLoanCheckFirstFinished(data = {}) {
  return fetch({
    url: `/loanExecute/queryLoanCheckFirstFinished`,
    method: "post",
    data
  })
}
// 审批终审列表 待处理
export function queryLoanCheckLast(data = {}) {
  return fetch({
    url: `/loanExecute/queryLoanCheckLast`,
    method: "post",
    data
  })
}
// 审批终审列表 已处理
export function queryLoanCheckLastFinished(data = {}) {
  return fetch({
    url: `/loanExecute/queryLoanCheckLastFinished`,
    method: "post",
    data
  })
}

// 放款初审保存审核
export function loanCheckFirst(data = {}) {
  return fetch({
    url: `/loanExecute/loanCheckFirst`,
    method: "post",
    data
  })
}
// 终审保存审核
export function loanCheckLast(data = {}) {
  return fetch({
    url: `/loanExecute/loanCheckLast`,
    method: "post",
    data
  })
}



/********************提单管理***************************/
// 提单详情
export function queryOrderInfo(data = {}) {
  return fetch({
    url: `/orderPage/queryOrderPageInfo`,
    method: "post",
    data,
    isMobileService: true,
  })
}
// 订单查询列表
export function queryOrderPage(data = {}) {
  return fetch({
    url: `/orderPage/queryOrderPage`,
    method: "post",
    data,
    isMobileService: true,
  })
}
// 获取下拉数据
export function queryCodeLibrary(data = {}) {
  return fetch({
    url: `/codeLibrary/queryCodeLibrary`,
    method: "get",
    params: data,
    isLoading: false
  })
}
// 合同附件信息
export function contractEnquiry(data = {}) {
  return fetch({
    url: `/docAttachmentCtr/queryByContractNo`,
    method: "get",
    params: data,
    isMobileService: true,
  })
}
// 删除合同附件信息
export function deleteByDocId(data = {}) {
  return fetch({
    url: `/docAttachmentCtr/deleteByDocId`,
    method: "get",
    params: data,
    isMobileService: true,
  })
}
//根据合同号查询银行卡修改记录
export function queryBankByContractNo(data = {}) {
  return fetch({
    url: `/bankCardChange/queryByContractNo`,
    method: "get",
    params: data,
    isMobileService: true,
  })
}


// 获取可选产品及额度
export function queryProductList(data = {}) {
  return fetch({
    url: `/productInfoController/queryProductList`,
    method: "post",
    data,
    isMobileService: true,
  })
}
// 获取风控验证
export function queryWhiteList(data = {}) {
  return fetch({
    url: `/queryInfo/queryWhiteList`,
    method: "post",
    data,
    isMobileService: true,
  })
}
// 获取城市列表
export function getProvince(data = {}) {
  return fetch({
    url: `/region/getProvince`,
    method: "get",
    params: data,
    isMobileService: true,
  })
}
// 获取支行信息
export function getAllBankInfo(data = {}) {
  return fetch({
    url: `/queryInfo/getAllBankInfo`,
    method: "post",
    data,
    isMobileService: true,
  })
}
// 上传文件
export function uploadImg(data = {}) {
  return fetch({
    url: `/docAttachmentCtr/uploadImg`,
    method: "post",
    data,
    isMobileService: true,
  })
}
//pc 上传文件 支持多张
export function PcUploadImg(data = {}) {
  return fetch({
    url: `/docAttachment/PcUploadImg`,
    method: "post",
    data,
    // isMobileService: true,
  })
}
// 提交申请  列表获取
export function queryByBquserId(data = {}) {
  return fetch({
    url: `/orderPage/queryByBquserId`,
    method: "post",
    data,
    isMobileService: true,
  })
}
// 获取贷款详细信息
export function queryCostInfo(data = {}) {
  return fetch({
    url: `/queryInfo/queryCostInfo`,
    method: "post",
    data,
    isMobileService: true,
  })
}
//保存提单信息
export function updateSerialNoInfo(data = {}) {
  return fetch({
    url: `/businessContractInfoCtr/updateSerialNoInfo`,
    method: "post",
    data,
    isMobileService: true,
  })
}
//保存提单信息（暂存）
export function temporarySave(data = {}) {
  return fetch({
    url: `/businessContractInfoCtr/temporarySave`,
    method: "post",
    data,
    isMobileService: true,
  })
}

// 生成暂时合同号
export function saveFormData(data = {}) {
  return fetch({
    url: `/businessContractInfoCtr/save`,
    method: "post",
    data,
    isMobileService: true,
  })
}
// 提交 取消订单
export function updateOrderPageState(data = {}) {
  return fetch({
    url: `/orderPage/updateOrderPageState`,
    method: "post",
    data,
    isMobileService: true,
  })
}




/****************合同管理************************/



// 获取合同列表
export function queryContractListInfo(data = {}) {
  return fetch({
    url: `/contractListInfo/queryByPage`,
    method: "post",
    data
  })
}
// 变更银行卡
export function addBankCardBackLog(data = {}) {
  return fetch({
    url: `/bankCardBackLogCtr/addBankCardBackLog`,
    method: "post",
    data
  })
}
// 根据合同号查询还款计划
export function queryRepaymentPlan(data = {}) {
  return fetch({
    url: `/repayment/queryRepaymentPlan`,
    method: "get",
    params: data,
    isMobileService: true,
  })
}

// 根据合同号查询欠费信息
export function queryArrearsInfo(data = {}) {
  return fetch({
    url: `/repayment/queryArrearsInfo`,
    method: "get",
    params: data,
    isMobileService: true,
  })
}

//根据合同号查询还款金额GET：
export function queryReimbursementAmountRecord(data = {}) {
  return fetch({
    url: `/repayment/queryReimbursementAmountRecord`,
    method: "get",
    params: data,
    isMobileService: true,
  })
}

// 导出放款报表
export function exportLoanExcel(data = {}) {
  return fetch({
    url: `/contractListInfo/exportLoanExcel`,
    method: "post",
    responseType: 'blob',
    data,
    skipValidate: true,
  })
}

// 导出应收账款转让清单报表
export function exportTransferListExcel(data = {}) {
  return fetch({
    url: `/contractListInfo/exportTransferListExcel`,
    method: "post",
    responseType: 'blob',
    data,
    skipValidate: true,
  })
}

// 查询提前还款单据
export function advanceRepayment(data = {}) {
  return fetch({
    url: `/contractListInfo/advanceRepayment`,
    method: "get",
    params: data
  })
}

// 提前还款计算接口 

export function calculateRepayment(data = {}) {
  return fetch({
    url: `/contractListInfo/calculateRepayment`,
    method: "post",
    data
  })
}

// 提前还款申请取消 
export function cancelRepayment(data = {}) {
  return fetch({
    url: `/contractListInfo/cancelRepayment`,
    method: "get",
    params: data
  })
}

// 提前还款申请提交 
export function commitRepayment(data = {}) {
  return fetch({
    url: `/contractListInfo/commitRepayment`,
    method: "post",
    data
  })
}
// 提前还款申请详情查询  
export function queryRepaymentInfo(data = {}) {
  return fetch({
    url: `/contractListInfo/queryRepayment`,
    method: "get",
    params: data
  })
}



/****************客户管理************************/

// 获取客户信息列表
export function getCustomerListByPage(data = {}) {
  return fetch({
    url: `/customerInfo/getCustomerListByPage`,
    method: "post",
    data
  })
}
// 根据id  获取详情
export function getCustomerInfoById(data = {}) {
  return fetch({
    url: `/customerInfo/getCustomerInfoById`,
    method: "post",
    data
  })
}
//查询客户联系人列表
export function getContactListByCustomer(data = {}) {
  return fetch({
    url: `/customerInfo/getContactListByCustomer`,
    method: "post",
    data
  })
}
//查询客户变更记录
export function queryCustomerData(data = {}) {
  return fetch({
    url: `/customerInfo/queryCustomerData`,
    method: "get",
    params: data
  })
}
//客户数据变更保存
export function updateCustomerData(data = {}) {
  return fetch({
    url: `/customerInfo/updateCustomerData`,
    method: "post",
    data
  })
}



/****************附件查询控制器************************/
//附件查询控制器
export function getDocAttachment(data = {}) {
  return fetch({
    url: `/docAttachment/getDocAttachment`,
    method: "get",
    params: data
  })
}


/****************送回盘报表************************/
//送回盘报表
export function querySendBackTrayInfo(data = {}) {
  return fetch({
    url: `/sendBackTrayController/querySendBackTrayInfo`,
    method: "post",
    data
  })
}

//送回盘报表 导出
export function sendBackExport(data = {}) {
  return fetch({
    url: `/sendBackTrayController/sendBackExport`,
    method: "post",
    responseType: 'blob',
    data,
    skipValidate: true,
  })
}