<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="openCreateDialog" type="primary" icon="el-icon-plus">添加</el-button>
    </div>
    <tree-table :data="departments" :expandAll="expandAll" border>
      <!-- <el-table-column label="事件" width="200">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{scope.row.event}}</span>
          <el-tag>{{scope.row.timeLine+'ms'}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="ID" prop="deptId">
      </el-table-column>
      <el-table-column label="排序" prop="orderNum">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="openUpdateDialog(scope.row)">编辑</el-button>
          <!-- <el-button type="success" size="mini" icon="el-icon-plus" @click="openCreateDialog(scope.row)">添加</el-button> -->
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="openDeleteConfirm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <!-- Form dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="form-container">
        <el-form-item label="上级部门">
          <el-input v-model="parent" disabled></el-input>
          <el-popover
            placement="right"
            width="400"
            trigger="click">
            <el-tree :data="tree" :props="defaultProps" @node-click="handleNodeClick" node-key="id" :default-expand-all="true"></el-tree>
            <el-button slot="reference">选择部门</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="ruleForm.orderNum"></el-input>
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
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import * as api from '@/api/department'
import { selectDepartment } from '@/api/user'

export default {
  name: 'department',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: true,
      dialogStatus: 'create',
      dialogFormVisible: false,
      parent: '',
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      props: {
        value: 'deptId',
        label: 'name'
      },
      options: [],
      selectedOptions: [1, 2, 5],
      ruleForm: {
        parentId: 0,
        name: '',
        orderNum: 1
      },
      departments: [],
      rules: {
        name: [
          { required: true, message: '请填写部门名称', trigger: 'change' }
        ],
        orderNum: [
          { required: true, message: '请填写排序', trigger: 'change' }
        ]
      },
      args: [null, null, 'timeLine']
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogStatus === 'create' ? '添加' : '编辑'
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
      this.parent = data.label
      this.ruleForm.parentId = data.id
    },
    submitCreateForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          api.createDepartment(this.ruleForm)
            .then(res => {
              console.log(res)
              this.getList()
              // Close dialog
              this.dialogFormVisible = false
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
      // console.log(this.ruleForm)
      const {
        deptId,
        parentId,
        name,
        orderNum,
        delFlag
      } = this.ruleForm
      const data = {
        deptId,
        parentId,
        name,
        orderNum,
        delFlag
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.updateDepartment(data)
            .then(res => {
              console.log(res)
              this.getList()
              this.dialogFormVisible = false
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
    getList() {
      api.selectDepartment()
        .then(res => {
          console.log(res)
          this.departments = res.data.deptList
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDepList() {
      selectDepartment()
        .then(res => {
          console.log(res)
          this.tree = res.data.deptList
        })
        .catch(err => {
          console.log(err)
        })
    },
    resetForm() {
      this.ruleForm = {
        parentId: 0,
        name: '',
        orderNum: 1
      }
      // console.log(this.$refs[formName])
      // this.$refs[formName].resetFields()
    },
    message(row) {
      this.$message.info(row.event)
    },
    openCreateDialog() {
      // console.log(arguments[0].parentName || 'Hello world')
      this.dialogStatus = 'create'
      this.resetForm()
      this.dialogFormVisible = true
    },
    openUpdateDialog(row) {
      this.ruleForm = Object.assign({}, row)
      console.log(this.ruleForm)
      this.parent = row.parentName
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    openDeleteConfirm(row) {
      this.$confirm(`确认删除部门 ${row.name} 吗?`)
        .then(_ => {
          // console.log('You choose yes')
          return api.deleteDepartment({
            id: row.deptId
          })
        })
        .then(res => {
          this.getList()
        })
        .catch(_ => {})
    },
    handleChange(value) {
      console.log(value)
    }
  },
  mounted() {
    this.getList()
    this.getDepList()
  }
}
</script>
