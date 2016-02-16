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

function addError(i){
	i.addClass('input-error');
}

function removeError(i){
	i.removeClass('input-error');
}

function handleError(input){
	var $input = $(input);

	if(($input.is(':checkbox') && !$input.prop('checked')) || ($input.is(':radio') && $('input[name='+$input.attr('name')+']:checked').size() == 0) || $input.val() === ''){
		addError($input);
	}else{
		removeError($input);
	}

	//HANDLE EMAIL VALIDATION
	if($input.attr('type')==='email' && ($input.val() === '' || !checkEmail($input.val()))){
		addError($input);
	}else if($input.attr('type')==='email'){
		removeError($input);
	}
}

$(function(){
	var $mailchimpForm = $('.mailchimp-form');

	$mailchimpForm.on('submit', function(e){
		var $requitedFields = $('input, select', $mailchimpForm).filter('[required]');
		$requitedFields.each(function(index, input){
			handleError(input);
		});

		if($mailchimpForm.find('.input-error').length !== 0){
			return false;
		}

		var $button = $('button[type="submit"]',$mailchimpForm),
			t_error = $mailchimpForm.data('error'),
			t_processing = $button.data('processing'),
			t_button = $button.data('text'),
			redirectUrl = $('input[name="redirecturl"]',$mailchimpForm).val();

		$.ajax({
			type: 'POST',
			url: 'mailchimp/mailchimp-api.php',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify($mailchimpForm.serializeObject()),
			beforeSend: function(){
				$button.text(t_processing).prop('disabled', true);
			}
		}).success(function(){
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