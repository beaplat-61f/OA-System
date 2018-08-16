<template>
  <div>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="openCreateDialog" type="primary" icon="el-icon-plus">添加</el-button>
      <el-button class="filter-item" type="danger" :loading="downloadLoading" v-waves icon="el-icon-delete" @click="handleDownload">删除</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData3"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        prop="email"
        width="180"
        label="邮箱">
      </el-table-column>

      <el-table-column
        label="状态"
        width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status">正常</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="openUpdateDialog"></el-button>
            <el-button type="primary" icon="el-icon-share"></el-button>
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-button-group>
          <!-- <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- Form dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <!-- <el-form :model="form" style="width: 400px; margin-left: 50px;" :label-width="formLabelWidth">
        <el-form-item label="姓名" prop="">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="活动区域" prop="">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        
        <el-button type="primary" @click="submitCreateForm('ruleForm')" v-if="dialogStatus === 'create'">添 加</el-button>
        <el-button type="primary" @click="dialogFormVisible = false" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'userList',
  data() {
    return {
      message: 'world',
      listQuery: {
        title: '',
        page: 1,
        pageSize: 10
      },
      total: 23,
      // dialogTitle: '',
      dialogStatus: 'create',
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      tableData3: [
        {
          id: 1208,
          date: '2016-05-03',
          name: '王小虎',
          email: '1029373737@qq.com',
          status: true,
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 1208,
          date: '2016-05-03',
          name: '王小虎',
          email: '1029373737@qq.com',
          status: false,
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 1208,
          date: '2016-05-03',
          name: '王小虎',
          email: '1029373737@qq.com',
          status: false,
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      multipleSelection: []
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogStatus === 'create' ? '添加' : '编辑'
    }
  },
  methods: {
    handleFilter() {
      // todo
    },
    submitCreateForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields()
      this.ruleForm = {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    },
    openCreateDialog() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    openUpdateDialog() {
      // Get form value
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
