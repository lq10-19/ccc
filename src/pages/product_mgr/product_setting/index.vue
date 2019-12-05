<template>
  <div class="container">
    <el-row>
      <el-form label-width="80px" label-position='left'>
        <el-col :span="8">
          <el-form-item label='产品ID'>
            <el-input v-model.trim="paramObj.paramObj.productId" placeholder="请输入产品ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label='产品名称'>
            <el-input v-model.trim="paramObj.paramObj.productName" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-form label-width="80px" label-position='left'>
      <el-row>
        <el-col :span="8">
          <el-form-item label='业务类型'>
            <el-select v-model.trim="paramObj.paramObj.businessType" placeholder="请选择" @change="businessChange">
              <el-option v-for="(item,index) in businessTypeArr" :key="index" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label='产品大类'>
            <el-select v-model.trim="paramObj.paramObj.productSuperType" placeholder="请选择"
              :disabled="!paramObj.paramObj.businessType?true:false" @change="productSuperTypeChange">
              <el-option v-for="(item,index) in productTypeList" :key="index" :label="item.typeName"
                :value="item.typeNo">
              </el-option>
            </el-select>
            <!-- <el-input v-model.trim="paramObj.paramObj.productSuperType"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="search" type="primary" plain>查询</el-button>
            <el-button @click="reset" type="primary" plain>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-bottom: 16px;">
      <el-button type="primary" v-has @click="add">新增</el-button>
      <el-button type="primary" v-has @click="onDetail">详情</el-button>
      <el-button type="primary" v-has @click="setStatus('1')">启用</el-button>
      <el-button type="primary" v-has @click="setStatus('2')">停用</el-button>
      <el-button type="primary" v-has @click="reloadCache">重载缓存</el-button>
      <el-button type="primary" v-has @click="exportProduct">导出</el-button>
    </div>
    <el-table :data="tableData" border class="table" @selection-change="handleSelectionChange" @row-click="clickRow"
      :height="tableHeight" ref="multipleTable">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="productId" label="产品ID" min-width="130" align="center"></el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="100" align="center"></el-table-column>

      <el-table-column prop="businessType" label="业务类型" align="center">
        <template slot-scope="scope">{{scope.row.businessType|businessTypeFilter}}</template>
      </el-table-column>

      <el-table-column prop="productSuperType" label="产品大类" min-width="95" align="center">
        <template slot-scope="scope">{{scope.row.productSuperType|productTypeFilter}}</template>
      </el-table-column>

      <el-table-column prop="creditType" label="授信方式" align="center" min-width="90">
        <template slot-scope="scope">{{scope.row.creditType|creditTypeFilter}}</template>
      </el-table-column>

      <el-table-column prop="isInUse" label="状态" align="center">
        <template slot-scope="scope">{{scope.row.isInUse|productStatus}}</template>
      </el-table-column>

      <el-table-column prop="createUserName" label="创建人员" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="135" align="center"></el-table-column>
      <el-table-column prop="updateUserName" label="更新人员" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="135" align="center"></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalCount"
        :page-size="paramObj.pageSize"></el-pagination>
    </div>

    <!---新增弹窗------->
    <add-modal :isShowModal="isShowModal" :isModalEdit="isModalEdit"></add-modal>

    <!-------详情弹窗------------>
    <detail-modal v-if="showDetailModal" :isShowModal="showDetailModal" :productId="productId"></detail-modal>
  </div>
</template>


<script>
  import AddModal from "./add_modal";
  import DetailModal from "./detail/index";
  import bus from "../bus";
  import {
    getProductSetting,
    getProductTypeList,
    setProductStatus,
    productReload,
    productExport
  } from "@/axios/api";
  import {
    downloadFile
  } from "@/lib/download.js";
  import {
    baseURL
  } from "@/axios/baseURL";
  import {
    resetObj
  } from "@/lib/util.js";
  const PROD_STATUS_MAP = {
    "0": "新增",
    "1": "启用",
    "2": "停用"
  }; //产品大类映射
  export default {
    name: 'product_setting',
    components: {
      AddModal,
      DetailModal
    },
    data() {
      return {
        totalCount: 1,
        paramObj: {
          pageSize: 10,
          currentPage: 1,
          paramObj: {
            productName: "",
            productId: "",
            typeName: "",
            businessType: ""
          }
        },
        productId: "",
        productTypeList: [],
        businessTypeArr: [{
            name: "现金贷",
            value: "01"
          },
          {
            name: "消费贷",
            value: "02"
          }
        ],

        tableData: [],
        multipleSelection: [], //选中的行数据
        isShowModal: false,
        isModalEdit: false, // 是新增还是编辑
        showDetailModal: false //展示详情弹窗
      };
    },
    mounted() {
      bus.$on("product_setting:isShowModal", val => {
        this.isShowModal = val;
        this.getDataList();
      });
      bus.$on("product_setting:isModalEdit", val => {
        this.isModalEdit = val;
      });
      bus.$on("product_setting_detail:showDetailModal", val => {
        this.showDetailModal = val;
      });

      this.check();
    },
    filters: {
      productStatus(val) {
        return PROD_STATUS_MAP[val];
      }
    },
    methods: {
      //新增
      add() {
        this.isShowModal = true;
      },
      //查看详情
      onDetail() {
        if (!this.multipleSelection.length) {
          this.$message({
            message: "请选择",
            type: "warning"
          });
          return;
        } else if (this.multipleSelection.length != 1) {
          this.$message({
            message: "只能选择一条",
            type: "warning"
          });
          return;
        }
        this.productId = this.multipleSelection[0].productId;
        this.showDetailModal = true;
      },

      //设置状态
      setStatus(type) {
        let prodArr = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].isInUse == type) {
            return this.$message.warning(`已是${this.statusMap[type]}状态`);
          }
        }
        this.multipleSelection.forEach(item => {
          prodArr.push(item.productId);
        });
        let id = prodArr.join(",");
        if (!id) {
          return this.$message.warning("请选择");
        }
        setProductStatus(id, type).then(res => {
          this.getDataList();
          this.$message.success(`${this.statusMap[type]}成功`);
        });
      },

      //获取产品大类选项
      getProductTypeList(type) {
        getProductTypeList(type).then(res => {
          this.productTypeList = res.data;
        });
      },
      //选择业务类型
      businessChange(type) {
        // this.paramObj.paramObj.productSuperType = "";
        this.getProductTypeList(type);
      },

      //选择产品大类
      productSuperTypeChange(type) {
        this.paramObj.paramObj.productSuperType = type;
        this.$forceUpdate();
      },

      //产品导出
      exportProduct() {
        let url = baseURL + "/product/productInfo/export";
        productExport(this.paramObj.paramObj).then(res => {
          console.log(res);
          const request = res.request;
          // const info = request.getResponseHeader("Content-Disposition");
          // const fileName = info.substr(info.indexOf("filename=") + 9);
          // fileName = decodeURIComponent(fileName);
          const blob = res.data;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = e => {
            const a = document.createElement("a");
            a.download = `产品详情报表.xls`; //fileName;
            // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
            a.href = e.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      },
      //重载缓存
      reloadCache() {
        if (!this.multipleSelection.length) {
          this.$message({
            message: "请选择",
            type: "warning"
          });
          return;
        }
        let ids = [];
        let isInUseArr = [];
        this.multipleSelection.forEach(item => {
          isInUseArr.push(item.isInUse);
          ids.push(item.productId);
        });
        if (isInUseArr.includes("0")) {
          return this.$message.error("所选产品为新增状态产品,不能重载缓存");
        }
        ids = ids.join(",");
        productReload(ids).then(res => {
          this.$message.success("重载成功");
        });
      },

      reset() {
        resetObj(this.paramObj);
        this.totalCount = 1;
        this.paramObj.pageSize = 10;
        this.paramObj.currentPage = 1;
        // 重置 刷新数据
        this.getDataList();
      },
      search() {
        this.paramObj.currentPage = 1;
        this.getDataList();
      },
      getDataList() {
        getProductSetting(this.paramObj).then(res => {
          this.tableData = res.data.rows;
          this.totalCount = res.data.totalCount;
        });
      },
      handleCurrentChange(val) {
        this.paramObj.currentPage = val;
        this.getDataList();
      },
      clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  };
</script>

<style scoped lang="scss">
  .container {
    /deep/ .el-input__inner {
      width: 200px !important;
      display: inline-block;
    }

    /deep/ .el-input--small {
      width: 200px;
    }
  }

  .form-item-label {
    display: inline-block;
    width: 80px;
  }
</style>