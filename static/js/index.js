$('#submitBtn').click(function(e){
	var messText = $('#messTextInput').val();
	$.get("mess", {m : messText});
});