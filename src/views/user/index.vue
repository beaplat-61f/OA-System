<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>选择部门</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <el-tree :data="departments" :props="defaultProps" @node-click="handleNodeClick" node-key="id" default-expand-all highlight-current check-on-click-node></el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.name">
          </el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" @click="openCreateDialog" type="primary" icon="el-icon-plus">添加</el-button>
          <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="openMultipleDeleteConfirm">删除</el-button>
        </div>
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="users"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="ID"
            width="120">
            <template slot-scope="scope">{{ scope.row.userId }}</template>
          </el-table-column>

          <el-table-column
            prop="empNum"
            label="工号">
          </el-table-column>

          <el-table-column
            prop="name"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机"
            width="150"
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
              <el-tag type="success" v-if="scope.row.status == 1">正常</el-tag>
              <el-tag type="danger" v-else>禁用</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="openUpdateDialog(scope.row.userId)">编辑</el-button>
              <!-- <el-button type="success" size="mini" icon="el-icon-plus" @click="openCreateDialog(scope.row)">添加</el-button> -->
              <el-button type="danger" icon="el-icon-delete" @click="openDeleteConfirm(scope.row)">删除</el-button>
            </template>
            <!-- <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" icon="el-icon-edit" @click="openUpdateDialog"></el-button>
                <el-button type="primary" icon="el-icon-share"></el-button>
                <el-button type="primary" icon="el-icon-delete"></el-button>
              </el-button-group>
            </template> -->
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>

        <!-- Form dialog -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="form-container">
            <el-form-item label="工号" prop="empNum">
              <el-input v-model="ruleForm.empNum"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="ruleForm.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="部门" prop="department" required>
              <el-input v-model="departmentName" disabled=""></el-input>
              <el-popover
                placement="right"
                width="400"
                trigger="click">
                <el-tree :data="departments" :props="defaultProps" @node-click="handleTreeNodeClick" node-key="id" :default-expand-all="true"></el-tree>
                <el-button slot="reference">选择部门</el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="上级领导">
              <!-- <el-input v-model="superior" placeholder="请输入关键字搜索"></el-input> -->
              <el-autocomplete
                v-model="superior"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                value-key="name"
                value="name"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            
            <el-button type="primary" @click="submitCreateForm('ruleForm')" v-if="dialogStatus === 'create'">添 加</el-button>
            <el-button type="primary" @click="submitUpdateForm('ruleForm')" v-else>修 改</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as api from '@/api/user'

export default {
  name: 'user',
  data() {
    return {
      message: 'world',
      departments: [],
      departmentName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: true,
      listQuery: {
        name: '',
        deptId: '',
        page: 1,
        limit: 10
      },
      selectIds: [],
      selectNames: [],
      total: 0,
      dialogStatus: 'create',
      dialogFormVisible: false,
      ruleForm: {
        empNum: '',
        name: '',
        mobile: '',
        sex: '2',
        deptId: 1,
        superiorId: 0
      },
      users: [],
      timeout: null,
      superior: '', // 上级领导姓名
      rules: {
        empNum: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ]
        // departmentName: [
        //   { required: true, message: '请选择部门', trigger: 'blur' }
        // ]
        // superior: [
        //   { required: true, message: '请选择上级领导', trigger: 'blur' }
        // ]
      },
      formLabelWidth: '120px',
      multipleSelection: []
    }
  },
  methods: {
    openDeleteConfirm(row) {
      this.$confirm(`确认删除员工 ${row.name} 吗?`)
        .then(_ => {
          // const data = this.selectIds
          return api.deleteUser([row.userId])
        })
        .then(res => {
          this.getUserList()
        })
        .catch(_ => {})
    },
    openMultipleDeleteConfirm() {
      const names = this.selectNames.join()
      const length = this.selectNames.length
      if (length === 0) {
        this.$confirm('请选择删除的员工')
        return false
      }
      this.$confirm(`确认删除员工 ${names} 共 ${length} 位员工吗?`)
        .then(_ => {
          const data = this.selectIds
          // console.log(data, JSON.stringify(data))
          return api.deleteUser(data)
        })
        .then(res => {
          this.getUserList()
        })
        .catch(_ => {})
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getUserList()
    },
    handleNodeClick(data) {
      // console.log(data)
      this.listQuery.deptId = data.id
      this.getUserList()
    },
    handleTreeNodeClick(data) {
      console.log(data)
      this.departmentName = data.label
      this.ruleForm.deptId = data.id
    },
    show() {
      this.$router.push({ path: '/system/user/list' })
    },
    getDeptList() {
      api.selectDepartment()
        .then(res => {
          console.log(res)
          // code
          this.departments = res.data.deptList
        })
        .catch(err => {
          console.log(err)
        })
    },
    getUserList() {
      this.loading = true
      const params = Object.assign({}, this.listQuery)
      api.selectUser(params)
        .then(res => {
          this.users = res.data.page.list
          this.total = res.data.page.totalCount
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    handleFilter() {
      this.getUserList()
    },
    submitCreateForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          const data = Object.assign({}, this.ruleForm)
          api.createUser(data)
            .then(res => {
              console.log(res)
              // this.$message({
              //   message: '添加成功',
              //   type: 'success'
              // })
              this.dialogFormVisible = false
              this.getUserList()
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitUpdateForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          const data = Object.assign({}, this.ruleForm)
          api.updateUser(data)
            .then(res => {
              console.log(res)
              // this.$message({
              //   message: '添加成功',
              //   type: 'success'
              // })
              this.dialogFormVisible = false
              this.getUserList()
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.ruleForm = {
        empNum: '',
        name: '',
        mobile: '',
        sex: 2,
        deptId: 1,
        superiorId: 0
      }
      this.departmentName = ''
      this.superior = ''
    },
    openCreateDialog() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    openUpdateDialog(id) {
      api.singleUser(id)
        .then(res => {
          const row = res.data.user
          this.ruleForm = row
          this.departmentName = row.deptName
          this.superior = row.superiorName
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.selectIds = val.map(item => {
        return item.userId
      })
      this.selectNames = val.map(item => {
        return item.name
      })
    },
    querySearchAsync(queryString, cb) {
      const restaurants = this.users
      const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      // cb(results)
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 500)
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    handleSelect(item) {
      console.log(item)
      this.ruleForm.superiorId = item.userId
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogStatus === 'create' ? '添加' : '编辑'
    }
  },
  mounted() {
    this.getDeptList()
    this.getUserList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
