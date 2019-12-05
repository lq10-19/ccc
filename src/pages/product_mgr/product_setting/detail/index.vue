<template>
  <div>
    <el-dialog title="产品详情" :visible.sync="isShowModal" :before-close="modalClose" height="460px" width="1000px">
      <div class="modal-inner">
        <el-tabs type="card" tab-position="left" height="200px">
          <el-tab-pane label="产品基本信息">
            <div class="tab-item">
              <el-button type="primary" @click="save">保存</el-button>
              <div class="product-level">
                <el-form class="form" :inline="true" label-position="left" label-width='120px'>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="业务类型" required>
                        <el-select v-model.trim="submitData.businessType" placeholder="请选择业务类型" disabled>
                          <el-option v-for="(item,index) in businessTypeArr" :key="index" :label="item.name"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="产品大类" required>
                        <el-select v-model.trim="submitData.productSuperType" disabled>
                          <el-option v-for="(item,index) in productCategoryList" :key="index" :label="item.typeName"
                            :value="item.typeNo"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="授信方式" required>
                        <el-select v-model.trim="submitData.creditType" disabled>
                          <el-option v-for="(item,index) in creditTypeList" :key="index" :label="item.name"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="产品名称" required>
                        <el-input v-model.trim="submitData.productName" disabled></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="产品生效时间" required>
                        <el-date-picker v-model.trim="submitData.effectiveStartDate" type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="产品失效时间" required>
                        <el-date-picker v-model.trim="submitData.effectiveEndDate" type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>

            <div class="tab-item">
              <div class="product-level">
                <el-form class="form" ref="subForm" :rules="rules" :model="submitData">
                  <el-form-item label="还款方式" prop="repaymentType">
                    <el-select v-model.trim="submitData.repaymentType" placeholder="请选择">
                      <el-option v-for="(item,index) in PaymentMethodList" :key="index" :label="item.itemName"
                        :value="item.itemNo"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="计息方式" required>
                    <el-select v-model.trim="submitData.interestType" disabled placeholder="请选择">
                      <el-option v-for="(item,index) in interestTypeList" :key="index" :label="item.name"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <div class="tab-item">
              <div class="product-level">
                <el-form class="form" ref="thirdForm" :rules="rules" :model="submitData">
                  <el-form-item label="规则编号" prop="errId">
                    <el-select v-model.trim="submitData.errId" placeholder="请选择">
                      <el-option v-for="(item,index) in repayAdvanceList" :key="index" :label="item[0].ruleValue"
                        :value="item[0].ruleId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <div class="tab-item">
              <div class="product-level">
                <el-form class="form" ref="fourthForm" :model="submitData" :rules="rules">
                  <el-form-item label="规则编号" prop="ldrId">
                    <el-select v-model.trim="submitData.ldrId" placeholder="请选择">
                      <el-option v-for="(item,index) in penaltyList" :key="index" :label="item[0].ruleValue"
                        :value="item[0].ruleId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <div class="tab-item">
              <div class="product-level">
                <el-form class="form" ref="fourthForm" :model="submitData" :rules="rules">
                  <el-form-item label="规则编号" prop="ccrId">
                    <el-select v-model.trim="submitData.ccrId" placeholder="请选择">
                      <el-option v-for="(item,index) in collectionList" :key="index" :label="item[0].ruleValue"
                        :value="item[0].ruleId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="产品配置">
            <div style="margin-left:20px;">
              <el-form>
                <el-button type="primary" plain @click="add">新增</el-button>
                <el-button type="primary" plain @click="edit">编辑</el-button>
                <el-button type="primary" plain @click="setStatus('1')">启用</el-button>
                <el-button type="primary" plain @click="setStatus('2')">停用</el-button>
              </el-form>

              <el-table :data="tableData" border class="table" ref="multipleTable" style="margin-top:20px;"
                highlight-current-row @current-change="handleTableCurrentChange">
                <el-table-column prop="grade" label="产品档位" align="center">
                  <template slot-scope="scope">{{scope.row.grade}}档</template>
                </el-table-column>
                <el-table-column prop="termList" label="期数" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                  <template slot-scope="scope">{{scope.row.status|statusFilter}}</template>
                </el-table-column>
                <el-table-column prop="createUserName" label="创建人员" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" min-width="145"></el-table-column>
                <el-table-column prop="updateUserName" label="更新人员" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" min-width="145"></el-table-column>
              </el-table>

              <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next"
                  :total="totalCount" :page-size="paramObj.pageSize"></el-pagination>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <!------新增弹窗------------------->
    <el-dialog :visible.sync="showAdd" width="400px">
      <el-form>
        <el-form-item label="产品档位" required>
          <el-select v-model.trim="grade">
            <el-option v-for="(item,index) in prodGradArr" :key="index" :label="item.itemName" :value="item.itemNo">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">

        <el-button type="primary" @click="prodConfigAddSubmit">确 定</el-button>
        <el-button @click="showAdd=false">取 消</el-button>
      </span>
    </el-dialog>
    <!--------产品配置编辑弹窗----------------------->
    <edit-modal :isShowModal="showEdit" :gradeId="gradeId" :versionId="versionId"></edit-modal>
  </div>
</template>

<script>
  import bus from "../../bus";
  import {
    checkDateTime
  } from "@/lib/util";
  import {
    addProductCate,
    updateProductSetting,
    getProductConfig,
    getProductDetail,
    prodConfigAdd,
    prodGradeUpate,
    getRepayList,
    queryGradeDropDown
  } from "@/axios/api";
  import EditModal from "./edit/index";
  export default {
    props: {
      isShowModal: {
        type: Boolean,
        default: false
      },
      productId: {
        type: String,
        default: ""
      }
      // formData: {
      //   type: Object,
      //   default: function () {
      //     return {}
      // }
      // }
    },
    components: {
      EditModal
    },
    data() {
      return {
        totalCount: 1,
        paramObj: {
          pageSize: 10,
          currentPage: 1,
          paramObj: {
            typeName: "",
            businessType: ""
          }
        },
        showAdd: false, //是否显示新增弹框
        showEdit: false, //是否显示产品配置弹框
        rules: {
          repaymentType: [{
            required: true,
            message: "请选择还款方式",
            trigger: "blur"
          }],
          // interestType: [
          //   { required: true, message: "请选择计息方式", trigger: "blur" }
          // ],
          errId: [{
            required: true,
            message: "请选择提前还款规则编号",
            trigger: "blur"
          }],
          ldrId: [{
            required: true,
            message: "请选择违约金规则编号",
            trigger: "blur"
          }],
          ccrId: [{
            required: true,
            message: "请选择催收工本费规则编号",
            trigger: "blur"
          }]
        },
        submitData: {
          startTime: "",
          endTime: "",
          businessType: "", //产品类型
          productSuperType: "", //产品大类
          productName: "",
          creditType: "", //授信方式
          status: "", //状态
          repaymentType: "", //还款方式
          interestType: "1", //计息方式
          errId: "", //提前还款规则
          ldrId: "", //违约金规则
          ccrId: "" //催收工本费
        },
        paramObj: {
          pageSize: 10,
          currentPage: 1,
          paramObj: {
            productId: ""
          }
        },
        grade: "", //新增产品档位
        gradeId: "",
        versionId: "",
        tableData: [],
        rowSelect: {},
        prodGradArr: [], //产品档位列表
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
            name: "一次性授信",
            value: "02"
          }
        ],

        PaymentMethodList: [], //还款方式列表
        interestTypeList: [{
          name: "按期计息",
          value: "1"
        }], //计息方式列表
        repayAdvanceList: [], // 提前还款规则列表
        penaltyList: [], //违约金规则列表
        collectionList: [], //催收工本费规则
        statusArr: [{
          name: "启用",
          value: "1"
        }, {
          name: "停用",
          value: "0"
        }],
        creditTypeList: [{
            name: "循环授信",
            value: "01"
          },
          {
            name: "一次授信",
            value: "02"
          }
        ]
      };
    },
    computed: {
      productCategoryList() {
        return this.$store.state.productCategoryList;
      }
    },

    watch: {
      // productId: {
      //   handler(newV) {
      //     this.paramObj.paramObj.productId = newV;
      //     this.getDataList();
      //     this.init()
      //   },
      //   deep: true
      // }
    },
    created() {},
    mounted() {
      bus.$on("product_setting:configEdit", val => {
        this.showEdit = val;
      });
      this.init();
    },

    methods: {
      init() {
        this.getSelect("PaymentMethod").then(res => {
          this.PaymentMethodList = res.data;
        });
        // this.getSelect("InterestType").then(res => {
        //   this.interestTypeList = res.data;
        //   console.log(this.interestTypeList);
        // });
        getRepayList("ERR").then(res => {
          this.repayAdvanceList = res.data;
        });
        getRepayList("LDR").then(res => {
          this.penaltyList = res.data;
        });
        getRepayList("CCR").then(res => {
          this.collectionList = res.data;
        });

        this.paramObj.paramObj.productId = this.productId;
        this.getDataList();
      },

      //新增
      add() {
        this.showAdd = true;
        queryGradeDropDown({
          productId: this.productId,
          type: "1"
        }).then(res => {
          this.prodGradArr = res.data;
        });
      },
      //新增框提交
      showAddSubmit() {
        this.showAdd = false;
      },
      //分页
      handleCurrentChange(val) {
        this.paramObj.currentPage = val;
        this.getDataList();
      },
      getDataList() {
        getProductConfig(this.paramObj).then(res => {
          this.tableData = res.data.rows;
          this.totalCount = res.data.totalCount;
        });
        getProductDetail(this.productId).then(res => {
          if (res.data.interestType) {
            res.data.interestType = res.data.interestType.trim();
          }
          this.submitData = res.data;
          this.submitData.interestType = this.submitData.interestType ?
            this.submitData.interestType :
            "1";
        });
      },
      //产品配置新增提交
      prodConfigAddSubmit() {
        let obj = {};
        obj.productId = this.productId;
        obj.grade = this.grade;
        if (!this.grade) {
          return this.$message.warning("请选择一个档位");
        }
        prodConfigAdd(obj).then(res => {
          this.showAdd = false;
          this.grade = "";
          this.getDataList();
        });
      },
      handleTableCurrentChange(val) {
        this.rowSelect = val;
      },
      //改变状态
      setStatus(type) {
        if ((JSON.stringify(this.rowSelect) == "{}") | !this.rowSelect) {
          this.$message.warning("请选择");
          return;
        }
        let obj = {};
        obj.gradeId = this.rowSelect.gradeId;
        obj.status = type;
        obj.productId = this.rowSelect.productId;
        prodGradeUpate(obj, type).then(res => {
          this.getDataList();
          this.$message.success(`${this.statusMap[type]}成功`);
        });
      },
      //产品配置编辑
      edit() {
        if (JSON.stringify(this.rowSelect) == "{}") {
          this.$message.warning("至少选择一条");
          return;
        }
        this.gradeId = this.rowSelect.gradeId;
        this.versionId = this.rowSelect.versionId;
        this.showEdit = true;
        this.$store.commit("setSelectedProductId", this.productId);
        this.$store.commit("setSelectedGradeId", this.rowSelect.gradeId);
      },
      checkForm() {
        let startDate = this.submitData.effectiveStartDate;
        let endDate = this.submitData.effectiveEndDate;
        if (!checkDateTime(startDate, endDate)) {
          return false;
        }
        return true;
      },
      submit() {
        this.modalClose();
      },

      //表单验证
      checkForm() {
        if (!this.submitData.repaymentType) {
          this.$message.error("还款方式不能为空");
          return false;
        } else if (!this.submitData.errId) {
          this.$message.error("提前还款规则编号不能为空");
          return false;
        } else if (!this.submitData.ldrId) {
          this.$message.error("违约金规则编号不能为空");
          return false;
        } else if (!this.submitData.ccrId) {
          this.$message.error("催收工本费规则编号不能为空");
          return false;
        }
        return true;
      },
      save() {
        let vm = this;
        if (!this.checkForm()) {
          return;
        }

        updateProductSetting(this.submitData).then(res => {
          this.$message.success("保存成功");
        });
      },
      modalClose() {
        this.resetObj(this.submitData);
        //this.productId = "";
        bus.$emit("product_setting_detail:showDetailModal", false); // 直接修改父组件的属性
      }
    }
  };
</script>


<style scoped lang="scss">
  .el-tab-pane {
    max-height: 350px;
    overflow: auto;
  }

  .tab-item {
    margin-left: 20px;

    .product-level {
      position: relative;
      margin-top: 20px;
      border: solid #bbb 1px;

      &::before {
        position: absolute;
        left: 20px;
        transform: translateY(-50%);
        background: white;
        padding: 0 10px;
        color: #101010;
        font-weight: 700;
      }

      .form {
        margin: 20px;

        /deep/ .el-form-item__label {
          width: 100px;
        }
      }
    }

    &:nth-of-type(1) .product-level:before {
      content: "产品信息";
    }

    &:nth-of-type(2) .product-level:before {
      content: "月供计算方式";
    }

    &:nth-of-type(3) .product-level:before {
      content: "提前还款规则";
    }

    &:nth-of-type(4) .product-level:before {
      content: "违约金规则";
    }

    &:nth-of-type(5) .product-level:before {
      content: "催收工本费规则";
    }
  }

  .el-input {
    width: auto;
  }

  .modal-inner /deep/ .el-input__inner {
    width: 200px !important;
  }

  .modal-inner .left {
    width: 300px !important;
    border-right: solid #ddd 1px;
  }

  .modal-inner .form-item-label {
    display: inline-block;
    margin-right: 20px;
    width: 100px;

    .el-input--small {
      width: 200px !important;
    }
  }

  .modal-inner .right {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
</style>