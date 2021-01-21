<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="Project Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
            <el-table-column label="Project Name" prop="name"  align="center" width="120" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
            <el-table-column label="Specifications For Aggregation" min-width="150px">
        <template slot-scope="{row}">
          <div v-for="(v,k,i) in row.aggs" :key="i" style="display:inline-block; margin-left:20px">
          <span>{{k+':'}}</span><el-tag v-for="(o,h) in v" :key="h">{{o}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status?'success':'danger'">
            {{row.status?'displayed':'hidden'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status===1" size="mini" type="success" @click="handleModifyStatus(row,0)">
            Hide
          </el-button>
          <el-button v-if="row.status===0" size="mini" @click="handleModifyStatus(row,1)">
            Display
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :page-sizes="[3,6,9,12,15]" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
        <el-form-item label="* Video" prop="video">
         <Uploader :path="videoPath" @update="updateVideoPath"></Uploader>
        </el-form-item>
        <el-form-item label="Name" label-width="150px" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Status" label-width="150px">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="(v,k,i) in statusChoose" :key="i" :label="k" :value="v" />
          </el-select>
        </el-form-item>
        <el-form-item label="Description" label-width="150px">
          <el-input v-model="temp.description" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" placeholder="Please specify the features that make this project different from others, use \ to split the features " />
        </el-form-item>
       <el-form-item label="Specifications For Aggregation:" props="aggs" label-width="150px">
          <el-input v-model="temp.salepoint" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" placeholder="Please specify the three key elements of a project, use json" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { fetchProjectList,createProject,deleteProject,changeStatus,updateProject } from '@/api/project'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Uploader from '@/components/VideoUploader' // video uploader for uploading videos

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const statusChoose={
  'Display':1,
  'Hidden':0
}

export default {
  name: 'ComplexTable',
  components: { Pagination,Uploader },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 3,
        name:''
      },
      calendarTypeOptions,
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      statusChoose,
      temp: {
        id: undefined,
        description: '',
        aggs:'',
        name:'',
        status: 1,
        video:'',
        imageUrl:'',
        salepoint:''
      },
      videoPath:'',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: 'project name is required', trigger: 'blur' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchProjectList(this.listQuery).then(response => {
        response.items.forEach(item=>{
          item['aggs']=JSON.parse(item['salepoint']);
        })
        this.list = response.items
        this.total = response.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      changeStatus(row.id,status).then(()=>{
              this.$message({
        message: status?'Displayed Successfully':'Hidden Successfully',
        type: 'success'
      })
       row.status = status
      }).catch(()=>{
      this.$message({
        message: status?'Displayed Error':'Hidden Error',
        type: 'error'
      })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp ={
        id: undefined,
        description: '',
        aggs:'',
        name:'',
        status: 1,
        video:'',
        aggs:'',
        imageUrl:'',
        salepoint:''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.videoPath=''
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateVideoPath(path){
    this.videoPath=path;
    this.temp.video=this.videoPath;
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createProject(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList();
          }).catch(()=>{
            this.$notify({
              title: 'Error',
              message: 'Create Error',
              type: 'error',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp['imageUrl']=row.imageUrl;
      this.videoPath=row.video;
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateProject(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Updated Successfully',
              type: 'success',
              duration: 2000
            })
          }).catch(()=>{
             this.$notify({
              title: 'Error',
              message: 'Update Error',
              type: 'error',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteProject(row.id).then(()=>{
     this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
       this.list.splice(index, 1)
      }).catch(()=>{
            this.$notify({
        title: 'Error',
        message: 'Delete Error',
        type: 'error',
        duration: 2000
      })
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
