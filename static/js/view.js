$(window).on('load', function () {
	var socket = io();

	socket.on("mess", function(data){
		console.log(data);
		$('#test').append($('<li>').text(data.m));
	});
});
