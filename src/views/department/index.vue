<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="openCreateDialog" type="primary" icon="el-icon-plus">添加</el-button>
    </div>
    <tree-table :data="departments" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border>
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
          <!-- <el-input v-model="ruleForm.name" disabled></el-input> -->
          <!-- <el-cascader
            expand-trigger="hover"
            :options="options"
            :props="props"
            :show-all-levels="false"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader> -->
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
        <!-- <el-form-item label="活动区域" prop="region">
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
        </el-form-item> -->
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
      expandAll: false,
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
      data:
        {
          id: 1,
          event: '事件1',
          timeLine: 100,
          comment: '无',
          children: [
            {
              id: 2,
              event: '事件2',
              timeLine: 10,
              comment: '无'
            },
            {
              id: 3,
              event: '事件3',
              timeLine: 90,
              comment: '无',
              children: [
                {
                  id: 4,
                  event: '事件4',
                  timeLine: 5,
                  comment: '无'
                },
                {
                  id: 5,
                  event: '事件5',
                  timeLine: 10,
                  comment: '无'
                },
                {
                  id: 6,
                  event: '事件6',
                  timeLine: 75,
                  comment: '无',
                  children: [
                    {
                      id: 7,
                      event: '事件7',
                      timeLine: 50,
                      comment: '无',
                      children: [
                        {
                          id: 71,
                          event: '事件71',
                          timeLine: 25,
                          comment: 'xx'
                        },
                        {
                          id: 72,
                          event: '事件72',
                          timeLine: 5,
                          comment: 'xx'
                        },
                        {
                          id: 73,
                          event: '事件73',
                          timeLine: 20,
                          comment: 'xx'
                        }
                      ]
                    },
                    {
                      id: 8,
                      event: '事件8',
                      timeLine: 25,
                      comment: '无'
                    }
                  ]
                }
              ]
            }
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
