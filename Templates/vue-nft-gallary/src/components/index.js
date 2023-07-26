import ElRow from './el-row.vue'
import ElCol from './el-col.vue'

export default {
  install(app) {
    app.component('el-row', ElRow)
    app.component('el-col', ElCol)
  }
}
