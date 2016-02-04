//TEXT RESPONSES
var t_name = 'Sie müssen Ihren Namen angeben',
	t_agb = 'Sie müssem die AGB akzeptieren',
	t_email = 'Ihre angegebene E-Mail ist nicht korrekt',
	t_error = 'Ein Fehler ist aufgetreten',
	t_button = 'Jetzt vormerken!',
	t_processing = 'Anfrage wird bearbeitet';

//SERIALIZE FORM
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

//EMAIL VALIDATION
function checkEmail(email) {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,7})$/;
	return reg.test(email);
}

$(function(){
	var $mailchimpForm = $('.mailchimp-form');
	$mailchimpForm.on('submit', function(e){

		var $button = $('button[type="submit"]',$mailchimpForm),
			email = $('input[name="email"]', $mailchimpForm).val(),
			agb = $('input[name="agb"]', $mailchimpForm).is(':checked'),
			name = $('input[name="name"]', $mailchimpForm).val(),
			redirectUrl = $('input[name="redirecturl"]').val();

		if(!name || !agb || (email=='' || !checkEmail(email))){
			if(!name){
				alert(t_name);
			}
			if(!agb){
				alert(t_agb);
			}
			if (email=='' || !checkEmail(email)) {
				alert(t_email);
			}
			return false;
		}

		$.ajax({
			type: 'POST',
			url: 'mailchimp/mailchimp-api.php',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify($mailchimpForm.serializeObject()),
			beforeSend: function(){
				$button.text(t_processing).prop('disabled', true);
			}
		}).success(function(a){
			//REDIRECT AFTER SUCCESS
			window.location.href = redirectUrl;
		}).error(function(){
			alert(t_error);
		}).always(function(){
			$button.text(t_button).prop('disabled', false);
		});

		e.preventDefault();
	});
});