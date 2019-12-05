<template>
  <div>
    <el-dialog title="分配资源" :close-on-click-modal='false' :visible.sync="isShowResource" :before-close="modalClose"
      width="720px">
      <div class="modal-inner">
        <div class="left">
          <!-- <el-tree :data="treeData" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
            @check-change="handleCheckChange" :props="defaultProps"></el-tree> -->
          <el-tree :data="treeData" ref="tree"  show-checkbox node-key="id" default-expand-all
            :default-checked-keys='defaultList' :props="defaultProps" :check-strictly='istrue'
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <i v-if='data.buttonId' class="t-icon m-resource"></i>
                <i v-else class="t-icon m-file"></i>
                {{ node.label }}</span>
              <span class="btn">
                <el-button type="text" v-show='!data.buttonId' size="mini" @click="() => append(data)">
                  <i class="t-icon m-add"></i>
                </el-button>
                <el-button type="text" size="mini" @click="() => remove(node, data)">
                  <i class="t-icon m-delete"></i>
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
        <div class="right">
          <el-button @click="checkedAll">全选</el-button>
          <el-button @click="resetChecked">清空</el-button>
          <el-button @click='resetHanld'>重置</el-button>
          <el-button @click='addONE' size="mini">新增一级菜单</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">

        <el-button type="primary" @click="submitRoleResource">确 定</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </span>
    </el-dialog>


    <el-dialog title="新增" :close-on-click-modal='false' :visible.sync="dialogVisible" width="400"
      :before-close="handleClose" append-to-body>
      <el-form ref="form" style="padding: 0 20px;" :model="addForm" label-width="80px" :rules="rules"
        label-position='left'>
        <el-form-item label="当前菜单" prop='menuname'>
          <el-input v-model.trim="addForm.menuname" readonly></el-input>
        </el-form-item>
        <el-form-item label="类型" prop='resource'>
          <el-radio-group v-model="addForm.resource">
            <el-radio label="菜单"></el-radio>
            <el-radio label="按钮"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop='name'>
          <el-input v-model.trim="addForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="addForm.resource=='菜单'" label="菜单路由" prop='menuPath'>
          <el-input v-model.trim="addForm.menuPath"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addHanld">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="新增一级菜单" :visible.sync="dialogVisibleONE" style="padding: 20px;" width="400"
      :before-close="handleCloseONE">
      <el-form :model="formInline" class="demo-form-inline" label-position='left' ref='formONE' :rules="rulesONE"
        label-width="86px">
        <el-form-item label="菜单名称" prop='menuName'>
          <el-input v-model="formInline.menuName" placeholder="输入名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单ICON" prop='icon'>
          <el-input v-model.trim="formInline.icon" placeholder="输入菜单ICON"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由" prop='menuPath'>
          <el-input v-model.trim="formInline.menuPath" placeholder="输入菜单路由"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleONE = false">取 消</el-button>
        <el-button type="primary" @click="submitONE">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus from "../bus";

  import {
    queryMenuAndButtonByRule,
    saveMenu,
    saveButton,
    deleteMenu,
    deleteButton,
    selectMenubuttonList,
    findResourceIdListByRoleId
  } from "@/axios/api";

  export default {
    props: {
      isShowResource: {
        type: Boolean,
        default: false
      },
      roleId: {
        type: String,
      },
    },
    data() {
      return {
        temp: {},
        formInline: {},
        dialogVisible: false,
        dialogVisibleONE: false,
        addForm: {
          resource: null,
          name: null,
          menuPath: null,
        },
        istrue: false,
        defaultList: [],
        rulesONE: {
          menuName: [{
              required: true,
              message: '请输入新增菜单的名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 8,
              message: '长度在 1 到 8 个字符',
              trigger: 'blur'
            }
          ],
          menuPath: [{
            required: true,
            message: '请输入新增菜单的路由',
            trigger: 'blur'
          }, ],
          icon: [{
            required: true,
            message: '请输入新增菜单ICON',
            trigger: 'blur'
          }, ]
        },
        rules: {
          name: [{
              required: true,
              message: '请输入新增项的名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 8,
              message: '长度在 1 到 8 个字符',
              trigger: 'blur'
            }
          ],
          resource: [{
            required: true,
            message: '请选择新增项的类型',
            trigger: 'change'
          }],
          menuPath: [{
            required: true,
            message: '请输入新增菜单的路由',
            trigger: 'blur'
          }, ]
        },
        defaultProps: {
          children: "subs",
          label: "name"
        },
        treeData: [],
      };
    },
    created() {
      // this.getmenuList()
    },
    watch: {
      isShowResource: function (newValue, bb) {
        // 显示弹框
        if (newValue) {
          this.getmenuList()
          this.getResourceIdList()
        }
      }
    },
    methods: {
      getmenuList() {
        queryMenuAndButtonByRule({
          roleId: this.roleId
        }).then(res => {
          let items = JSON.stringify(res.data).replace(/menuButtonDtos/g, 'subs');
          this.treeData = JSON.parse(items) || [];
        }).catch(error => {
          console.log(error)
        }).finally(() => {
      
        });
      },
      getResourceIdList() {
        this.istrue = false;
        findResourceIdListByRoleId({
          roleId: this.roleId
        }).then(res => {
          // this.defaultList = res.data || [];
          this.$nextTick(() => {
            this.istrue = false;
            this.$refs.tree.setCheckedKeys(res.data)
          })
        }).catch(error => {
          console.log(error)
        }).finally(() => {

        });
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      checkedAll() {
        //全选
        this.$refs.tree.setCheckedNodes(this.treeData);
      },
      async append(data) {
        console.log(data, 11)
        this.dialogVisible = true;
        this.addForm.menuname = data.name;
        this.temp.promise = new Promise((resolve, reject) => {
          this.temp.resolve = resolve;
          this.temp.reject = reject;
        });

        let form = await this.temp.promise;

        if (form.resource == '菜单') {
          saveMenu(Object.assign({}, {
            menuLevel: Number(data.menuLevel) + 1,
            higherLevelMenuId: data.menuId,
            menuName: form.name,
            menuPath: form.menuPath,
          })).then(res => {
            if (res.code == '200') {
              this.$message({
                type: 'success',
                message: '菜单新增成功!'
              });
            }
            this.handleClose()
            this.getmenuList()
          }).catch(error => {
            console.log(error)
          })
        } else {
          saveButton(Object.assign({}, {
            buttonName: form.name,
            menuId: data.menuId
          })).then(res => {
            if (res.code == '200') {
              this.$message({
                type: 'success',
                message: '按钮新增成功!'
              });
            }
            this.handleClose()
            this.getmenuList()
          }).catch(error => {
            console.log(error)
          })
        }

      },
      remove(node, data) {
        console.log(node, data)
        let title = data.buttonId ? '按钮' : '菜单';
        this.$confirm(`此操作将永久删除${title}  ${data.name} , 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (title == '按钮') {
            deleteButton({
              buttonId: data.buttonId
            }).then(res => {
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
              this.getmenuList()
            })
          } else {
            deleteMenu({
              menuId: data.menuId
            }).then(res => {
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
              this.getmenuList()
            })
          }
        }).catch(() => {

        });

      },
      submitRoleResource() {
        console.log(this.$refs.tree.getCheckedNodes());
        console.log(this.$refs.tree.getCheckedKeys());
        console.log(this.$refs.tree.getHalfCheckedKeys());

        let roleIdList = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
        selectMenubuttonList({
          menuIdList: roleIdList,
          selectMenuIdList: this.$refs.tree.getCheckedKeys(),
          roleId: this.roleId,
        }).then(res => {
          if (res.code == '200') {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
          }
          this.getResourceIdList()
        }).catch(error => {
          console.log(error)
        })

      },
      // 
      resetHanld() {
        this.getmenuList()
        this.getResourceIdList()
      },
      addONE() {
        this.dialogVisibleONE = true;
      },
      // 一级菜单新增
      submitONE() {
        this.$refs.formONE.validate((valid) => {
          if (valid) {
            saveMenu(Object.assign({}, {
              menuLevel: 1,
              higherLevelMenuId: 0,
              menuName: this.formInline.menuName,
              menuPath: this.formInline.menuPath,
              icon: this.formInline.icon
            })).then(res => {
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '菜单新增成功!'
                });
              }
              this.$refs.formONE.resetFields();
              this.dialogVisibleONE = false;
              this.getmenuList()
            }).catch(error => {

              console.log(error)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleClose() {
        this.dialogVisible = !this.dialogVisible;
        this.$refs.form.resetFields();
      },
      handleCloseONE() {
        this.dialogVisibleONE = false;
      },
      addHanld() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.temp.resolve(this.addForm);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      modalClose() {
        this.$parent.showResource()
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
    }
  };
</script>


<style scoped lang="scss">
  .modal-inner {
    width: 100%;
    height: 100%;
    display: flex;

    .el-button+.el-button {
      margin-left: 0;
    }
  }

  .btn {
    display: inline-block;
    width: 60px;
    display: flex;
    justify-content: flex-end;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .modal-inner .left {
    width: 480px !important;
    padding: 0 12px;
    border-right: solid #ddd 1px;
    height: 360px;
    overflow-y: auto;
  }

  .modal-inner .right {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .t-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: 100% 100% !important;
    vertical-align: middle;
    margin: -3px 4px 0 0;


    &.m-file {
      background: url(../../../assets/img/file@2x.png) no-repeat;
    }

    &.m-resource {
      background: url(../../../assets/img/icon_resource@2x.png) no-repeat;
    }

    &.m-add {
      background: url(../../../assets/img/add@2x.png) no-repeat;
    }

    &.m-delete {
      background: url(../../../assets/img/icon_delete@2x.png) no-repeat;
    }
  }
</style>