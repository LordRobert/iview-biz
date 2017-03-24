<template>
    <div>
        <Row>
            <Checkbox :checked.sync="options.value">{{options.label || ''}}</Checkbox>
        </Row>
    </div>
</template>
<script>
    /***
     *
     * @options
     *    label label名
     *    value 值
     */
    import fragmentMixin from 'iview-biz/mixins/fragmentMixin'

    export default {
        mixins: [fragmentMixin],
        mock: mockData(),
    }

    function mockData() {
        return {
            options: {
                label:'checkbox名称',
                value:false
            }
        }
    }
</script>
