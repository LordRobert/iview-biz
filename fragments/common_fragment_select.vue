<template>
    <div>
        <Row>
            <div class="label">{{options.label}}：</div>
            <div class="content">
                <i-select :model.sync="options.value" style="width:200px" @on-change="$emit('on-change')">
                    <i-option v-for="item in options.list" :value="item[options.valueMember || 'value']">{{
                        item[options.displayMember || 'name'] }}
                    </i-option>
                </i-select>
            </div>
        </Row>
    </div>
</template>
<script>
    /***
     *
     * @options
     *    label label名称
     *    value 选择后的值
     *    list select下拉列表
     *    displayMember 展示值属性名
     *    valueMember 值属性名
     *
     * @events
     *    on-change 下拉改变触发的事件
     */
    import fragmentMixin from 'iview-biz/mixins/fragmentMixin'
    export default {
        mixins: [fragmentMixin],
        mock: mockData(),
    }

    function mockData() {
        return {
            options: {
                label: '下拉选择label',
                displayMember: 'mockName',
                valueMember: 'mockId',
                list: [{mockName: 'name1', mockId: 'id1'}, {mockName: 'name2', mockId: 'id2'}],
                value: 'id1'
            }
        }
    }
</script>
<style scoped>
    .label, .content {
        display: inline-block;
    }
</style>
