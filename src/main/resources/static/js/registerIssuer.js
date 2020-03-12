$(document).ready(function(){
	
	if (isReady) {
    	loadData();
    }
	
    $("#registerIssuerBtn").click(function(){
        var $this = this;
        var disabled = $($this).attr("class").indexOf("disabled");
        if(disabled > 0) return;
        var weId = $.trim($("#registerIssuerWeId").val());
        if (weId.length == 0) {
            $("#messageBody").html("<p>请输入weId。</p>");
            $("#modal-message").modal();
            return;
        }
        var name = $.trim($("#registerIssuerName").val());
        if (name.length == 0) {
        	 $("#messageBody").html("<p>请输入issuer Name。</p>");
        	 $("#modal-message").modal();
    		return;
    	}
        $($this).addClass("disabled");
        $($this).html("注册中,  请稍等...");
        $.get("registerIssuer/"+weId+"/"+name ,function(value,status){
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
    
});
var template = $("#data-tbody").html();
var  table;
function loadData() {
	 //加载部署数据
  $.get("getIssuerList",function(data,status){
		if(table != null) {
			table.destroy();
		}
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
		$("button[name='removeAuthBtn']").each(function(){
			var index = $(this).attr("class").indexOf("true");
			if(index < 0) $(this).attr("disabled",true);
		})
  })
}

function registerIssuer(weId) {
	$("#registerIssuerWeId").val(weId);
    $("#modal-register-issue").modal();
}

function removeIssuer(obj, weId) {
	$.confirm("是否确定删除该数据?",function(){
	    var disabled = $(obj).attr("class").indexOf("disabled");
	    if(disabled > 0) return;
	    $(obj).addClass("disabled");
	    $(obj).html("删除中,  请稍等...");
		$.get("removeIssuer/"+weId ,function(value,status){
			if (value == "success") {
	            $("#messageBody").html("<p>删除<span class='success-span'>成功</span>。</p>");
	            loadData();
	        }  else if (value == "fail") {
	        	 $("#messageBody").html("<p>删除<span class='fail-span'>失败</span>，请联系管理员。</p>");
	        } else {
	        	 $("#messageBody").html("<p>"+value+"</p>");
	        }
	        $(obj).html("删除");
	        $(obj).removeClass("disabled");
	        $("#modal-message").modal();
	    });
	});
}