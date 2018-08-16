<template>
  <div class="app-container">
    <!-- Hello, {{ message }} -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>选择部门</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <el-tree :data="departments" :props="defaultProps" @node-click="handleNodeClick" node-key="id"></el-tree>
        </el-card>
        <!-- <button @click="show">Show</button> -->
      </el-col>
      <el-col :span="18">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { selectDepartment } from '@/api/department'

export default {
  name: 'user',
  data() {
    return {
      message: 'world',
      departments: [],
      tree: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 2,
          label: '二级 1-1',
          children: [{
            id: 3,
            label: '三级 1-1-1'
          }]
        }]
      }, {
        id: 4,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1',
          children: [{
            id: 6,
            label: '三级 2-1-1'
          }]
        }, {
          id: 7,
          label: '二级 2-2',
          children: [{
            id: 8,
            label: '三级 2-2-1'
          }]
        }]
      }, {
        id: 9,
        label: '一级 3',
        children: [{
          id: 10,
          label: '二级 3-1',
          children: [{
            id: 11,
            label: '三级 3-1-1'
          }]
        }, {
          id: 12,
          label: '二级 3-2',
          children: [{
            id: 13,
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    show() {
      this.$router.push({ path: '/system/user/list' })
    },
    getList() {
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
  computed: {
  },
  mounted() {
    this.getList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
