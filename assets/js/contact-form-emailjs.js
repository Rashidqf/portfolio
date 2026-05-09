(function () {
  'use strict';

  var lastEmailjsError = null;

  if (typeof emailjs !== 'undefined') {
    emailjs.init('qI_KZykJwHmNwH7SJ');
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.js-contact-error-details')) {
      e.preventDefault();
      console.log('Full error:', lastEmailjsError);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var contactForm = document.getElementById('contact-form');
    if (!contactForm || typeof emailjs === 'undefined') return;

    var formMessage = document.querySelector('.form-messege');
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var formOverlay = document.getElementById('formOverlay');
    if (!submitBtn || !formOverlay) return;

    var originalBtnText = submitBtn.innerHTML;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      submitBtn.innerHTML = '<i class="icofont-spinner-alt-2"></i> Sending...';
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      formOverlay.classList.add('active');

      formMessage.innerHTML = '';
      formMessage.className = 'form-messege';

      var formInputs = contactForm.querySelectorAll('input, textarea, button');
      formInputs.forEach(function (input) {
        input.disabled = true;
      });

      var formData = new FormData(contactForm);
      var templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        to_name: 'Rashid Yousufzai'
      };

      console.log('Sending email with parameters:', templateParams);

      emailjs.send('service_ebvzcw8', 'template_ye1a2rk', templateParams)
        .then(function (response) {
          console.log('✅ EMAIL SENT SUCCESSFULLY!', response);
          console.log('Response status:', response.status);
          console.log('Response text:', response.text);

          formOverlay.classList.remove('active');

          formMessage.innerHTML = '<div class="alert alert-success"><i class="icofont-check-circled"></i> Thank you! Your message has been sent successfully. I\'ll get back to you soon.</div>';
          formMessage.className = 'form-messege success';

          contactForm.reset();

          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');

          formInputs = contactForm.querySelectorAll('input, textarea, button');
          formInputs.forEach(function (input) {
            input.disabled = false;
          });
        })
        .catch(function (error) {
          lastEmailjsError = error;

          console.error('❌ EMAIL SENDING FAILED!');
          console.error('Error details:', error);
          console.error('Error status:', error.status);
          console.error('Error text:', error.text);
          console.error('Full error object:', JSON.stringify(error, null, 2));

          var errorMessage = 'Sorry! There was an error sending your message. ';

          if (error.status === 400) {
            errorMessage += 'Invalid request - please check your input and try again.';
          } else if (error.status === 401) {
            errorMessage += 'Authentication failed - service configuration issue.';
          } else if (error.status === 403) {
            errorMessage += 'Access denied - please contact support.';
          } else if (error.status === 404) {
            errorMessage += 'Service not found - configuration issue.';
          } else if (error.status >= 500) {
            errorMessage += 'Server error - please try again later.';
          } else {
            errorMessage += 'Please try again or contact me directly.';
          }

          formMessage.innerHTML =
            '<div class="alert alert-danger">' +
            '<i class="icofont-close-circled"></i> ' +
            errorMessage +
            '<br><small style="margin-top: 10px; display: block;">' +
            'Error Code: ' + (error.status || 'Unknown') + ' | ' +
            '<button type="button" class="btn btn-link btn-sm p-0 align-baseline js-contact-error-details">Check browser console for details</button>' +
            '</small>' +
            '</div>';
          formMessage.className = 'form-messege error';

          formOverlay.classList.remove('active');

          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');

          formInputs = contactForm.querySelectorAll('input, textarea, button');
          formInputs.forEach(function (input) {
            input.disabled = false;
          });
        });
    });

    var inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(function (input) {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearFieldError);
    });

    function validateField(e) {
      var field = e.target;
      var value = field.value.trim();

      field.classList.remove('error');

      if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
      }

      if (field.type === 'email' && value) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showFieldError(field, 'Please enter a valid email address');
          return false;
        }
      }

      if (field.type === 'tel' && value) {
        var phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
          showFieldError(field, 'Please enter a valid phone number');
          return false;
        }
      }

      return true;
    }

    function showFieldError(field, message) {
      field.classList.add('error');

      var existingError = field.parentNode.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }

      var errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.innerHTML = '<small class="text-danger">' + message + '</small>';
      field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(e) {
      var field = e.target;
      field.classList.remove('error');
      var errorDiv = field.parentNode.querySelector('.field-error');
      if (errorDiv) {
        errorDiv.remove();
      }
    }
  });
})();
