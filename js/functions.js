$(function() {

		var data = {'action': 'show'};
		
		    $.post("myindex2.php",
			    {'action': 'show'},
			    function(data, status){
			    	
			        if(status == "success"){
			        	var obj = JSON.parse(data);
			        	$("#counter").html(obj["num_rows"]);
			        	if ($("#counter").text() == 0){
							$(".sortable").css('display','none');
						}else{
							$(".sortable").css('display','block');
						}
			        	for(var i=0; i < obj["num_rows"]; i++){
			        		var idx = i + 1;
			        		var li_id = 'item_'+idx;
							var li = '<li class="item" data-flag="'+ obj["items"][i]["flag"] +'" draggable="true">' +
										'<input type="hidden" class="item__id" value="'+ obj["items"][i]["id"] +'">' +
										'<img class="item__img" src="'+ obj["items"][i]["img"] +'"/>' +
										'<p class="item__p">'+ obj["items"][i]["text"] +'</p>' +
										'<div class="item__buttons">' +
											'<input class="button__edit" type="button" value="Edit">' +
											'<input class="button__remove" type="button" value="Remove">' +
										'</div>' +
									  '</li>';
							$(".con").append(li);
						}
						$(".con").sortable({
							connectWith: ".con"
						});
			        }
				});

	$('.sortable').sortable().bind('sortupdate', function() {
		//Triggered when the user stopped sorting and the DOM position has changed.
		var idx = $("#counter").text();
		var data = '{"action": "sortupdate"';

		data = data + ', "items": [';
		$("li").each(function(index, value){
			var flag = $(this).data("flag");
			var id = $(this).children("input").val();
			var pos = index + 1;
    		if(pos == idx){
    			var item = '{"pos":'+ pos +', "flag":'+ flag +', "id":'+ id +'}]}';
    		}else{
    			var item = '{"pos":'+ pos +', "flag":'+ flag +', "id":'+ id +'},';
    		}
    		data = data + item;
		});
		
		var obj = jQuery.parseJSON(data);

		$.post("myindex2.php",
			obj,
			function(data,status) {
				if(status == "success"){
					var obj = JSON.parse(data);
				}

		});

	});

	$(".button__add--file").click(function(){
			$("#addContainer__fileToUpload").click();
			$('input[type="file"]').change(function(e){
				var newFileImgName = e.target.files[0].name;
				$("#addContainer__file").html(newFileImgName);
			});
		});

	$('body').on('click','.button__remove',function(){
		var item = $(this).parent().parent();
		var id = item.children('input').val();
		var data_value = parseInt($("#counter").text()) - 1;

		$.post("myindex2.php",
		    {'action': 'delete', 'id': id},
			function (data, status) {
			if(status == "success"){
				var obj = JSON.parse(data);
				$("#counter").html(data_value);
				item.remove();
				if($("#counter").text() == '0')
					$(".sortable").css('display','block');
			}
			
		});	
	});
	var item;
/***************************************/
		$(".button--file").click(function(){
			$("#modal__fileToUpload").click();
			$('input[type="file"]').change(function(e){
				var newFileImgName = e.target.files[0].name;
				$("#modalContent__file").html(newFileImgName);
			});
		});

				

		var closemodalbtn = $(".close");
		$(".close").click(function(){
			$("#modal").css('display','none');	
		});
		
		window.onclick = function(event) {
    		if (event.target == $("#modal")) {
        		$("#modal").css('display','none');
    		}
		} 

		window.click = function(event) {
		    if (event.target == $("#modal")) {
		        $("#modal").css('display','none');
		    }
		};

		$(".modal__btn--reset").click(function(){
			var text = item.children("p").text();
			$('#modal__text').val(text);
			$("#modal__fileToUpload").val(null);
		});
		
		//Save del modal de edicion:
		$("#edit__btn").click(function(){
			var fileName = $("#modal__fileToUpload").val();
			fileName = fileName.substr((fileName.lastIndexOf('\\') + 1));
			var newsrc = 'images/' + $("#modalContent__file").text();
			var newtext = $("#modal__text").val();
			var text = item.children("p").text();
			var src = item.children("img").attr('src');
			var id = item.children("input").val();
				
			var newtext_length = newtext.length;
			if(newtext_length == 0){
				alert("The image description is required");
				$("#modal .btn-file-reset").click();
				$(".close").click();
			}else
			if(newtext_length > 300){
				alert("The image description should be shorter");
			}else{
				$.post('myindex2.php',
				    {'action': 'edit', 'id': id, 'newsrc': newsrc, 'newtext': newtext},
				    function (data, status) {
						if(status == "success"){
							var obj = JSON.parse(data);
							if(!obj.hasOwnProperty("error")){
								item.children("img").attr('src', obj["items"][0]["img"]);
								item.children("p").text(obj["items"][0]["text"]);
								$("#modal .btn-file-reset").click();
								$(".close").click();
							}else{
								$("#modal .btn-file-reset").click();
								alert(obj["error"]);
								$(".close").click();
							}
						}
					
					});	
			}
			$(".close").click();		
		});		
/************************************************/

	
	$('body').on('click','.button__edit',function(){
		item = $(this).parent().parent();
		var text = item.children("p").text();

		var src = item.children("img").attr('src');	
		var fileImgName = src.substr((src.lastIndexOf('/') + 1));
		
		//Modal code:
		$("#modal").css('display','flex');

		$("#modal__text").text(text);
		$("#modalContent__file").html(fileImgName);
	});


	$(".btn-file-reset").click(function(){
		$(".fileToUpload").val(null);		
		$("#content__text").val(null);
	});


	$("#add__btn").click(function(){
		var fileName = $("#addContainer__file").text();
		fileName = fileName.substr((fileName.lastIndexOf('\\') + 1));
		var src = 'images/' + fileName;	
		var text = $("#content__text").val();
		var text_length =text.length;
		if(text_length == 0){
			alert("The image description is required");
		}else
		if(text_length > 300){
			alert("The image description should be shorter");
		}else{
			var data_value = parseInt($("#counter").text()) + 1;
			if($("#counter").text() == '0'){
				var flag = 1;
			}else{
				var flag = $("ul li:last-child").data("flag") + 1;
			}
			$.post('myindex2.php',
				{'action': 'add', 'src': src, 'text': text, 'counter': data_value, 'flag': flag},
				function(data, status){
					if(status == "success"){
						var obj = JSON.parse(data);
						if(!obj.hasOwnProperty("error")){
							$("#counter").html(obj["num_rows"]);
							var li = '<li class="item" data-flag="'+ obj["items"][0]["flag"] +'" draggable="true">' +
									'<input type="hidden" class="item__id" value="'+ obj["items"][0]["id"] +'">' +
									'<img class="item__img" src="'+ obj["items"][0]["img"] +'"/>' +
									'<p class="item__p">'+ obj["items"][0]["text"] +'</p>' +
									'<div class="item__buttons">' +
										'<input class="button__edit" type="button" value="Edit">' +
										'<input class="button__remove" type="button" value="Remove">' +
									'</div>' +
								  '</li>';

							$(".sortable").append(li);
							$(".con").sortable({
								connectWith: ".con"
							});
							$(".sortable").css('display','block');
						}else{
							alert(obj["error"]);
						}
					}
			});
		}
		
		$(".addContainer .btn-file-reset").click();
	});

});



		