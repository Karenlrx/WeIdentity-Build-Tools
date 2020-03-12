$(document).ready(function(){
	
    if (isReady) {
    	loadData();
    }
    
    $("#registerBtn").click(function(){
        var $this = this;
        var disabled = $($this).attr("class").indexOf("disabled");
        if(disabled > 0) return;
        var type = $.trim($("#addIssuerType").val());
        if (type.length == 0) {
        	 $("#messageBody").html("<p>请输入issuer type。</p>");
        	 $("#modal-message").modal();
    		return;
    	}
        $($this).addClass("disabled");
        $($this).html("注册中,  请稍等...");
        $.get("registerIssuerType/"+type ,function(value,status){
        	if (value == "success") {
                $("#messageBody").html("<p>注册<span class='success-span'>成功</span>。</p>");
                loadData();
            }  else if (value == "fail") {
            	 $("#messageBody").html("<p>注册<span class='fail-span'>失败</span>，请联系管理员。</p>");
            } else {
            	 $("#messageBody").html("<p>"+value+"</p>");
            }
            $($this).html("注册");
            $($this).removeClass("disabled");
            $("#modal-message").modal();
        })
    });
    
    $("#registerIssuerTypeBtn").click(function(){
    	$("#addIssuerType").val("");
    	$("#modal-register-issue-type").modal();
    });
    
    $("#addToIssuerType").click(function(){
        var $this = this;
        var disabled = $($this).attr("class").indexOf("disabled");
        if(disabled > 0) return;
        var weId = $.trim($("#addIssuerWeId").val());
        if (weId.length == 0) {
       	    $("#messageBody").html("<p>请输入weId。</p>");
       	    $("#modal-message").modal();
            return;
        }
        var type= $("#issuerType").val();
        $($this).addClass("disabled");
        $($this).html("添加中,  请稍等...");
        $.get("addIssuerIntoIssuerType/"+type+"/"+weId ,function(value,status){
            if (value == "success") {
                $("#messageBody").html("<p>添加<span class='success-span'>成功</span>。</p>");
                loadData();
            }  else if (value == "fail") {
            	 $("#messageBody").html("<p>添加<span class='fail-span'>失败</span>，请联系管理员。</p>");
            } else {
            	 $("#messageBody").html("<p>"+value+"</p>");
            }
            $($this).html("添加");
            $($this).removeClass("disabled");
            $("#modal-message").modal();
        })
    });
});

var template = $("#data-div").html();
function loadData() {
	 //加载部署数据
   $.get("getIssuerTypeList",function(data,status){
   	if (data.length > 0) {
   		$("#data-div").renderData(template,data);
   		collapse($("#btn1")[0],$("#btn1").val(),"div1");
   		$('.collapsed-card').collapse()
   		$("#div1").show();
   		$("#btn1").find("i").removeClass("fa-plus");
   		$("#btn1").find("i").addClass("fa-minus");
   		$("#card1").removeClass("collapsed-card");
   	}
   })
   
}

function collapse(thisObj, type, contain) {
	var plus = $(thisObj).find("i").attr("class").indexOf("fa-plus");
	if(plus > 0) {
		$.get("getAllIssuerInType/"+type ,function(data,status){
			var html = "<table id='table" + contain + "' class='table table-bordered table-hover' style='line-height: 40px;'>";
			html +="<thead><tr><th title='WeIdentity DID'>weId</th><th width='250px'>操作</th></tr></thead><tbody>";
			for(var i = 0; i < data.length; i++) {
				html +="<tr><td>" + data[i] + "</td>";
				html +="<td><button type='button' onclick='removeIssuerFromIssuerType(this,"+'"'+type+'"'+"," +'"'+ data[i] +'"'+ ")' class='btn btn-inline btn-primary btn-flat'>删除</button></td></tr>";
			}
			html += "</tbody></table>";
			$("#" + contain).html(html);
			$('#table' + contain).DataTable({
	  	      "paging": true,
	  	      "lengthChange": false,
	  	      "searching": true,
	  	      "ordering": false,
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
	  	      },
	  	      
	  	    });
        })
	}
}

function  removeIssuerFromIssuerType(thisObj, type, weId) {
	$.confirm("是否确定删除该数据?",function(){
		var $this = thisObj;
	    var disabled = $($this).attr("class").indexOf("disabled");
	    if(disabled > 0) return;
	    $($this).addClass("disabled");
	    $($this).html("删除中,  请稍等...");
	    $.get("removeIssuerFromIssuerType/"+type+"/"+weId ,function(value,status){
	        if (value == "success") {
	            $("#messageBody").html("<p>删除<span class='success-span'>成功</span>。</p>");
	            loadData();
	        }  else if (value == "fail") {
	        	 $("#messageBody").html("<p>删除<span class='fail-span'>失败</span>，请联系管理员。</p>");
	        } else {
	        	 $("#messageBody").html("<p>"+value+"</p>");
	        }
	        $($this).html("删除");
	        $($this).removeClass("disabled");
	        $("#modal-message").modal();
	    });
	});
}

function addIssuerTypeBtn(type) {
	$("#issuerType").val(type);
	$("#modal-add-to-issueType").modal();
}


