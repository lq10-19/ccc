<template>
    <div>
        <el-dialog title="选择角色" :visible.sync="isRoleDialog" append-to-body :before-close="modalClose" width="800px">
            <el-row>
                <el-form :model="searchForm" ref="searchForm" inline label-position='left' label-width="80px">
                    <el-col :span="12">
                        <el-form-item label='角色名称' prop='roleName'>
                            <el-input v-model.trim="searchForm.roleName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label='所属机构' prop='departmentIdList'>
                            <el-cascader v-model.trim="searchForm.departmentIdList" :show-all-levels="false"
                                @change="handleChange" :props='props' :options="departmentArr">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label='角色类型' prop='roleType'>
                            <el-select v-model.trim="searchForm.roleType">
                                <el-option v-for="(item,index) in roleTypeList" :key="index" :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary" plain @click="queryHandles">查询</el-button>
                        <el-button type="primary" plain @click="reset">重置</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" plain @click="Selection">确定</el-button>
                    </el-col>
                </el-form>
            </el-row>


            <el-table :data="tableData" border class="table" :height='tableHeight-40' ref="multipleTable"
                @selection-change="handleSelectionChange" @row-click="clickRow">
                <el-table-column width="55" align="center" type="selection"></el-table-column>
                <el-table-column prop="roleId" label="角色编号" align="center" min-width="80"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" min-width="100" align="center"></el-table-column>
                <el-table-column prop="departmentName" label="所属部门" min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="roleState" label="角色状态" min-width="80" align="center" :formatter='Typeformatter'>
                </el-table-column>
                <el-table-column prop="roleType" label="角色类型" min-width="80" align="center" :formatter='Stateformatter'>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"   :current-page.sync="currentPageS"
                    :page-sizes="[10, 20, 30, 40,50]" :page-size="10" layout="total,sizes, prev, pager, next"
                    :total="totalPage">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        deleteRole,
        addUser,
        getDepartmentInfo,
        queryUnRoleListByUserId,
        getRoleInfo
    } from "@/axios/api";
    import {
        resetObj
    } from "@/lib/util";
    export default {
        props: {
            isRoleDialog: {
                type: Boolean,
                default: false
            },
            userId: {
                type: String,
            },
        },
        data() {
            return {
                queryParams: {
                    pageNo: 1,
                    pageSize: 10,
                },
                totalPage: 0,
                searchForm: {
                    roleName: "",
                    departmentId: "",
                    departmentIdList: null,
                    roleType: ""
                },
                role: '',

                departmentArr: [], //所属机构列表
                isShowResource: false, //是否显示分配资源弹框
                tableData: [],
                cur_page: 1,
                multipleSelection: [],

                props: {
                    value: 'departmentId',
                    label: 'departmentName',
                    checkStrictly: true
                },

                //角色类型列表
                roleTypeList: [{
                        name: "普通",
                        value: "0"
                    },
                    {
                        name: "管理员",
                        value: "1"
                    },
                ],
            };
        },
        created() {
            // 获取机构数据
            this.getDepartmentInfo()
        },
        mounted() {

        },
        watch: {
            isRoleDialog: function (newValue, bb) {
                // 显示弹框
                if (newValue) {
                    this.check()
                }
            }
        },

        methods: {
            //  修改mixin混入中的参数
            getParams() {
                return this.searchForm;
            },
            getDepartmentInfo() {
                getDepartmentInfo({
                    'departmentId': '2019081409300528226'
                }).then(res => {
                    this.departmentArr = res.data;
                });
            },
            // 获取列表数据
            async getDataList() {
                try {
                    console.log(this.queryParams, 11)
                    let params = Object.assign({}, this.queryParams)
                    params.paramObj.userId = this.userId;
                    let res = await queryUnRoleListByUserId(params)
                    console.log(res, 111)
                    this.tableData = res.data.rows
                    this.totalPage = res.data.totalCount
                } catch (error) {
                    console.log(error)
                }
            },
            // 重置
            reset() {
                this.searchForm.departmentId = '';
                this.$refs.searchForm.resetFields();
                // 重置 刷新数据
                this.check()
            },

            // 确定
            Selection() {
                if (this.multipleSelection.length == 0) {
                    this.$message.warning('请选择角色')
                    return;
                }
                this.$emit('RoleList', this.multipleSelection);
                this.modalClose()
                this.$parent.setAddRole()
            },
            clickRow(row) {
                this.$refs.multipleTable.toggleRowSelection(row)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            handleChange(data) {
                console.log(data, 1)
                if (data && data.length > 0) {
                    this.searchForm.departmentId = data[data.length - 1]
                } else {
                    this.searchForm.departmentId = ''
                }
            },
            //分配资源
            showResource() {
                this.isShowResource = true;
            },
            // 过滤
            Stateformatter: function (row, column, cellValue, index) {
                //角色类型  0:普通;1:管理员;默认:0
                switch (cellValue) {
                    case '0':
                        return '普通'
                        break;
                    case '1':
                        return '管理员'
                        break;
                    default:
                        break;
                }
            },
            Typeformatter: function (row, column, cellValue, index) {
                // 角色状态(0:启用;1:停用;默认:0)
                switch (cellValue) {
                    case '0':
                        return '启用'
                        break;
                    case '1':
                        return '停用'
                        break;
                    default:
                        break;
                }
            },
            modalClose() {
                this.$refs.searchForm.resetFields();
                this.$parent.addRole()
            }
        }
    };
</script>

<style scoped lang="scss">
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    .el-input {
        width: auto;
    }

    .table {
        margin-top: 20px;
    }

    .fl-itm {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .content {
        display: flex;

        .left {
            //    width:100px;
            height: 100%;
        }

        .right {
            display: flex;
            flex: 1;
        }
    }
</style>