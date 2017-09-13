$('#submitBtn').click(function(e){
	var messText = $('#messTextInput').val();
	$.get("mess", {m : messText});
});

var socket = io();
$('#submitSocketBtn').click(function(e){
	var messText = $('#messSocketTextInput').val();
	socket.emit("mess", {m:messText});
});