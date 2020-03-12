$(document).ready(function(){
	bsCustomFileInput.init();
	if (isReady) {
    	loadData();
    }

    $("#cptToPojoBtn").click(function(){
    	var $this = this;
    	var cptIds = getCptIds();
        if (cptIds.length == 0) {
        	$("#messageBody").html("<p>请选择需要转换的凭证声明类型</p>");
    		$("#modal-message").modal();
    		return;
        }
        
        $.confirm("确定将["+cptIds+"]转成JAVA实体吗?",function(){
            var disabled = $($this).attr("class").indexOf("disabled");
            if(disabled > 0) return;
            $($this).addClass("disabled");
            var btnValue = $($this).html();
            $($this).html("转换中,  请稍等...");
        	$.get("cptToPojo",{cptIds:cptIds},function(data,status){
        		if (data == "success") {
        			$("#messageBody").html("<p>凭证声明类型转JAVA实体<span class='success-span'>成功</span>。</p>");
        		} else {
        			$("#messageBody").html("<p>凭证声明类型转JAVA实体<span class='fail-span'>失败</span>，请查看后台日志。</p>");
        		}
        		$("#modal-message").modal();
        		$($this).html(btnValue);
        		$($this).removeClass("disabled");
        	})
        })
    });
    
    var registerCptResult = false;
    
    $('#modal-message').on('hide.bs.modal', function () {
    	$("#modal-message .modal-dialog").removeClass("modal-lg");
	})
	
	$('#modal-cpt-message').on('hide.bs.modal', function () {
		if (registerCptResult) {
			editor.set(JSON.parse("{}"));
			$(".custom-file-label").html("选择文件...");
			$("#modal-register-cpt").modal("hide");
		}
    	
	})
    
	//json编辑器
    var options = {
		mode: 'code',
		modes: ['code', 'tree'], // allowed modes
		onError: function (err) {
			alert(err.toString());
		}
	};
    
    var editor = new JSONEditor(jQuery("#jsonContent").get(0), options);
    //注册CPT
    $("#registerCpt").click(function(){
    	var thisObj = this;
    	var disabled = $(thisObj).attr("class").indexOf("disabled");
        if(disabled > 0) return;
	    var file = $("#cptJsonFile")[0].files[0];
	    if (file == null || !vaildFileName(file.name)) {
	    	$("#messageBody").html("<p>请选择正确的Json格式文件</p>");
	    	$("#modal-message").modal();
	    	return;
	    }
	    var cptJson = null;
	    try {
	    	cptJson = JSON.stringify(editor.get());
	    } catch (e) {
	    	$("#messageBody").html("<pre>Error：" + e.message + "</pre>");
    		$("#modal-message").modal();
    		return;
	    }
	    if (cptJson == null) {
	    	$("#messageBody").html("<p>凭证申明类型不能为空</p>");
	    	$("#modal-message").modal();
	    	return;
	    }
	    var formData = new FormData();
	    formData.append("fileName", file.name);
	    formData.append("cptJson", cptJson);
	    formData.append("cptId", $("#nodeForm  #registerCptId").val());
	    var btnValue = $(thisObj).html();
	    $(thisObj).html("凭证的声明类型注册中，请稍后...");
	    $(thisObj).addClass("disabled");
	    $.ajax({
	        url:'registerCpt', /*接口域名地址*/
	        type:'post',
	        data: formData,
	        contentType: false,
	        processData: false,
	        success:function(res) {
	            console.log(res);
	            registerCptResult = false;
	            if (res=="success") {
	            	//检查节点是否正确
	            	$("#cptMessageBody").html("<p>凭证的声明类型注册<span class='success-span'>成功</span>。</p>");
	            	registerCptResult = true;
	            	loadData();
	            } else if (res=="fail") {
	            	$("#cptMessageBody").html("<p>凭证的声明类型注册<span class='fail-span'>失败</span>，请查看服务端日志。</p>");
	            } else {
	            	$("#cptMessageBody").html("<p>"+res+"</p>");
	            }
	            $("#modal-cpt-message").modal();
	            $(thisObj).html(btnValue);
	            $(thisObj).removeClass("disabled");
	        }
	    })
    })
    
    function vaildFileName(fileName) {
    	var v = fileName.substring(fileName.lastIndexOf("."));
    	if (v != ".json" && v != ".JSON") {
    		return false;
    	}
    	return true;
    }

	$("#cptJsonFile").change(function(){
    	var file = $("#cptJsonFile")[0].files[0];
    	let reader = new FileReader();
        reader.readAsText(file, 'utf-8');
        reader.onload = function(e, rs) {
          editor.set(JSON.parse(e.target.result));
        };
    })
    
    $("#openRegisterCpt").click(function(){
    	$("#modal-register-cpt").modal();
    });
});
var template = $("#data-tbody").html();
var  table;
function loadData() {
	 //加载部署数据
	$.get("getCptInfoList",function(data,status){
  		if(table != null) {
  			table.destroy();
  		}
  		cptIds = new Array();
  		$("#data-tbody").renderData(template,data);
  		table = $('#example2').DataTable({
  	      "paging": true,
  	      "lengthChange": false,
  	      "searching": true,
  	      "ordering": true,
  	      "info": false,
  	      "autoWidth": false,
  	      "oLanguage": {
	    	  "sZeroRecords": "对不起，查询不到任何相关数据",
  	    	  "oPaginate": {
	            "sFirst":    "第一页",
	            "sPrevious": " 上一页 ",
	            "sNext":     " 下一页 ",
	            "sLast":     " 最后一页 "
	          }
	      }
  	    });
	})
}

function queryCptSchema(cptId) {
	$.get("queryCptSchema/"+cptId,function(data,status){
		$("#messageBody").html("<textarea class='form-control' rows='25' readOnly='readOnly' >"+data+"</textarea>");
		$("#modal-message .modal-dialog").addClass("modal-lg");
		$("#modal-message").modal();
	})
}

function downCpt(cptId) {
	$.confirm("确定下载该CPT吗?",function(){
		window.location.href="downCpt/" + cptId;
    })
}
Array.prototype.indexOf = function(val) { 
	for (var i = 0; i < this.length; i++) { 
		if (this[i] == val) return i; 
	} 
	return -1; 
}
Array.prototype.remove = function(val) { 
	var index = this.indexOf(val); 
	if (index > -1) { 
		this.splice(index, 1); 
	} 
};
var cptIds = new Array();
function clickCptId(thisObj) {
	if(thisObj.checked){
    	cptIds.push(thisObj.value);
	} else {
		cptIds.remove(thisObj.value)
	}
}
function getCptIds() {
	return cptIds;
}
