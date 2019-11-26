$(function () {
    //列表
    $("#table").BT({
        url: baseURL + 'provideStaff/providestaff/list',
        columns: [
            {checkbox: true, width: '60px'},
            {title: '招聘单位', field: 'recruitmentFirm'},
            {title: '招聘标题', field: 'recruitmentTitle'},
            {title: '供人人数', field: 'number'},
            {
                title: '人员类型', field: 'type', formatter: function (value, row, index) {
                    if (value == 1) {
                        return "社会";
                    } else if (value == 2) {
                        return "学生";
                    }
                }
            },
            {title: '到岗时间', field: 'arrivalTime'},
            {
                title: '状态', field: 'state', formatter: function (value, row, index) {
                    if (value == 1) {
                        return '<span class="label label-warning">待审核</span>';
                    } else if (value == 2) {
                        return '<span class="label label-success">通过</span>';
                    } else if (value == 3) {
                        return '<span class="label label-danger">拒绝</span>';
                    }
                }
            },
            {title: '创建时间', field: 'createDate'},
            {
                title: '操作', field: 'id', formatter: function (value, row, index) {
                    return "<a id='showInfo'>" + "详情" + "</a>";
                }, events: vm.events
            }

        ],
        //条件查询
        queryParams: vm.params
    });
    //表单提交
    $("form").FM({
        fields: vm.fields,
        success: vm.saveOrUpdate

    })

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        user_Store : userStore,
        showList: true,
        detailList: false,
        title: null,
        provideStaff: {},
        params: {
            beginTime: '',
            endTime: '',
            title: '',
            state: '' ,
            appId: ''
        },
        events: {
            'click #showInfo': function (event, value, row, index) {
                vm.showList = false;
                vm.detailList = true;
                vm.title = '详情';
                vm.getInfo(value);
            }
        },
    },
    methods: {
        reset: function () {
            vm.params = {
                beginTime: '',
                endTime: '',
                title:'',
                state:'',
                appId:''
            }
        },
        query: function () {
            vm.params.beginTime = $('#beginTime').val();
            vm.params.endTime = $('#endTime').val();
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.provideStaff = {};
        },
        update: function (event) {
            var id = getSelectedRowId("id");
            if (id == null) {
                return;
            }
            vm.showList = false;
            vm.title = "修改";

            vm.getInfo(id)
        },
        //表单验证
        validate: function () {
            var bl = $('form').VF();//启用验证
            if (!bl) {
                return;
            }
        },
        saveOrUpdate: function (event) {
            var url = vm.provideStaff.id == null ? "provideStaff/providestaff/save" : "provideStaff/providestaff/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.provideStaff),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        del: function (event) {
            var ids = getSelectedRowsId("id");
            if (ids == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "provideStaff/providestaff/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        getInfo: function (id) {
            $.get(baseURL + "provideStaff/providestaff/info/" + id, function (r) {
                vm.provideStaff = r.provideStaff;
            });
        },
        reload: function (event) {
            vm.showList = true;
            vm.detailList = false;
            vm.title = "";
            //刷新 如需条件查询common.js
            $("#table").BTF5(vm.params);
        }
    }
});