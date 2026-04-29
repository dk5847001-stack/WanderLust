(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    }, false);
  });

  window.setTimeout(() => {
    document.querySelectorAll(".alert").forEach((alert) => {
      alert.classList.remove("show");
      window.setTimeout(() => alert.remove(), 350);
    });
  }, 3200);

  document.querySelectorAll('[data-bs-toggle="popover"]').forEach((element) => {
    if (window.bootstrap) {
      new bootstrap.Popover(element);
    }
  });

  const imageInput = document.getElementById("imageInput");
  const previewImage = document.getElementById("previewImage");

  if (imageInput && previewImage) {
    imageInput.addEventListener("change", function onImageChange() {
      const file = this.files && this.files[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        previewImage.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
})();
