// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// <!-- ================= AUTO HIDE ALERT ================= -->

    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 500);
        });
    }, 3000); // 3 sec


  document.addEventListener("DOMContentLoaded", function () {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    
    popoverTriggerList.forEach(el => {
      new bootstrap.Popover(el);
    });
  });

  // image preview

  const input = document.getElementById("imageInput");
  const preview = document.getElementById("previewImage");

  input.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => preview.src = reader.result;
      reader.readAsDataURL(file);
    }
  });


