<template>
    <div>
        <i-table :content="options.self" :data="options.tableData" :columns="options.tableColumns" stripe
                 border @on-select="rowSelect"></i-table>
        <div style="margin: 10px;overflow: hidden" v-if="options.pageable !== false">
            <div style="float: right;">
                <Page :total="total" :current="pageNumber" @on-change="onChange"
                      @on-page-size-change="onPageSizeChange" show-sizer :page-size="pageSize"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    /**
     *
     * @options
     *    tableData 表格数据
     *    tableColumns 表格meata
     *    pageable 是否有分页
     *    url 请求数据url
     *
     *
     * @events
     *    on-created vue created生命周期事件
     *    on-after-ajax 当配置有url时  ajax返回后的事件
     *    on-page-change 有分页时 切换分页时的事件
     *    on-page-size-change 有分页时  切换每页展示条数时的事件
     *    on-select 当配置有selection或singleSelection时 选中行的事件
     *
     */
    import fragmentMixin from 'iview-biz/mixins/fragmentMixin'
    export default {
        mixins: [fragmentMixin],
        mock: mockData(),

        props: {params: Object},

        data: function () {
            return {
                total: 0,
                pageSize: 10,
                pageNumber: 1
            }
        },

        created(){
            this.$emit('on-created')
            if (this.options.url) {
                this._reload()
            }
        },

        methods: {
            _reload(){
                Utils.post(this.options.url, Object.assign({
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber
                }, this.options.params)).then((res) => {
                    this.total = res.datas.totalSize
                    this.options.tableData = res.datas.rows
                    this.$emit('on-after-ajax', res.datas)
                })
            },

            reload(){
                this._reload()
            },

            onChange(pageNumber){
                this.pageNumber = pageNumber
                this.$emit('on-page-change')
                if (this.options.url) {
                    this._reload()
                }
            },

            onPageSizeChange(pageSize){
                this.$emit('on-page-size-change')
                this.pageSize = pageSize
                if (this.options.url) {
                    this._reload()
                }
            },

            rowSelect(data){
                this.$emit('on-select', data)
            }
        }
    }

    function mockData() {
        return {
            options: {
                tableColumns: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    }
                ],
                tableData: [
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    }
                ]
            }
        }
    }
</script>
