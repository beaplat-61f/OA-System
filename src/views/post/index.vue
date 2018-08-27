<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="openCreateDialog" type="primary" icon="el-icon-plus">添加</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="openMultipleDeleteConfirm">删除</el-button>
    </div>

    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="ID" prop="posId"></el-table-column>
      <el-table-column label="部门名称" prop="deptName"></el-table-column>
      <el-table-column label="岗位名称" prop="name"></el-table-column>
      <el-table-column label="排序" prop="orderNum"></el-table-column>

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="openUpdateDialog(scope.row.posId)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="openDeleteConfirm(scope.row)">删除</el-button>
        </template>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="ruleForm.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <el-input v-model="ruleForm.deptName" disabled=""></el-input>
          <el-popover
            placement="right"
            width="400"
            trigger="click">
            <el-tree :data="departments" :props="defaultProps" @node-click="handleTreeNodeClick" node-key="id" :default-expand-all="true"></el-tree>
            <el-button slot="reference">选择部门</el-button>
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        
        <el-button type="primary" @click="submitCreateForm('ruleForm')" v-if="dialogStatus === 'create'">添 加</el-button>
        <el-button type="primary" @click="submitUpdateForm('ruleForm')" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/post'
import { selectDepartment } from '@/api/user'

export default {
  name: 'post',
  data() {
    return {
      multipleSelection: [],
      selectIds: [],
      selectNames: [],
      departments: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      list: null,
      listQuery: {
        name: '',
        page: 1,
        limit: 10
      },
      total: 0,
      listLoading: true,
      ruleForm: {
        deptId: 1,
        name: '',
        orderNum: '',
        deptName: ''
      },
      dialogStatus: 'create',
      dialogFormVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogStatus === 'create' ? '添加' : '编辑'
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  methods: {
    openDeleteConfirm(row) {
      this.$confirm(`确认删除岗位 ${row.name} 吗?`)
        .then(_ => {
          return api.deletePost([row.posId])
        })
        .then(res => {
          this.getList()
        })
        .catch(_ => {})
    },
    openMultipleDeleteConfirm() {
      const names = this.selectNames.join()
      const length = this.selectNames.length
      if (length === 0) {
        this.$confirm('请选择删除的岗位')
        return false
      }
      this.$confirm(`确认删除岗位 ${names} 共 ${length} 个岗位吗?`)
        .then(_ => {
          const data = this.selectIds
          // console.log(data, JSON.stringify(data))
          return api.deletePost(data)
        })
        .then(res => {
          this.getList()
        })
        .catch(_ => {})
    },

    // 多选框选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.selectIds = val.map(item => {
        return item.posId
      })
      this.selectNames = val.map(item => {
        return item.name
      })
    },
    // 部门选择事件
    handleTreeNodeClick(data) {
      this.ruleForm.deptName = data.label
      this.ruleForm.deptId = data.id
    },
    // 分页事件
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },

    // 查询事件
    handleFilter() {
      this.getList()
    },

    submitCreateForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          const data = Object.assign({}, this.ruleForm)
          api.createPost(data)
            .then(res => {
              console.log(res)
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
          api.updatePost(data)
            .then(res => {
              console.log(res)
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
        deptId: 1,
        name: '',
        orderNum: '',
        deptName: ''
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
      api.singlePost(id)
        .then(res => {
          // const row = res.data.sysPos
          // this.departmentName = row.deptName
          // this.superior = row.superiorName
          this.ruleForm = res.data.sysPos
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
        })
        .catch(err => {
          console.log(err)
        })
    },

    getList() {
      this.listLoading = true
      const params = Object.assign({}, this.listQuery)
      api.selectPost(params)
        .then(res => {
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
          this.listLoading = false
        })
        .catch(_ => {

        })
    },
    getDeptList() {
      selectDepartment()
        .then(res => {
          console.log(res)
          // code
          this.departments = res.data.deptList
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.getList()
    this.getDeptList()
  }
}
</script>
