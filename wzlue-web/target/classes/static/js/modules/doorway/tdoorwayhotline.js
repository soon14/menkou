$(function () {
    //列表
    $("#table").BT({
        url: baseURL + 'doorway/tdoorwayhotline/list',
        columns: [
            {checkbox: true, width: '60px'},
            {title: '平台热线', field: 'hotline'}
        ],
        //条件查询
        queryParams: {}
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
        showList: true,
        title: null,
        categoryList: [],
        tDoorwayHotline: {
        	image: ''
		},
        queryParams: {},
        //验证字段
        fields: {
            hotline: {
                validators: {
                    notEmpty: {
                        message: '不能为空'
                    },
                    stringLength: {
                        max: 30,
                        message: '长度不能超过30位'
                    },
                    regexp: {
                        regexp: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/ ,

                        message: '请输入正确的手机号或者电话号码'
                    }
                }
            }
        }
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.tDoorwayHotline = {
            	image: ''
			};
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
            var url = vm.tDoorwayHotline.id == null ? "doorway/tdoorwayhotline/save" : "doorway/tdoorwayhotline/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tDoorwayHotline),
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
                    url: baseURL + "doorway/tdoorwayhotline/delete",
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
            $.get(baseURL + "doorway/tdoorwayhotline/info/" + id, function (r) {
                vm.tDoorwayHotline = r.tDoorwayHotline;
            });
        },
        reload: function (event) {
            vm.showList = true;
            vm.title = "";
            //刷新 如需条件查询common.js
            $("#table").BTF5(vm.queryParams);
            $("form").RF();
        },
        getCategory: function () {
            // 加载菜单树
            $.get(baseURL + "wechat/wxapp/selectlist", function (r) {

                vm.categoryList = r.wxAppList;

            })
        }
    },
    created: function () {
        this.getCategory();

    }
});