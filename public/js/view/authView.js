class AuthView {
  constructor() {
    this.name = document.getElementById("inputName");
    this.email = document.getElementById("inputEmail");
    this.radio = document.getElementById("optionsRadios1");
    this.password = document.getElementById("inputPassword1");
    this.passwordRepeat = document.getElementById("inputPassword2");
    this.validate = document.getElementById("submitBtn");
    // this.token = document.querySelector('meta[name="csrf-token"]').attributes[1].textContent;
  }
  
  onError() {
    const parentNode = this.element.parentNode;
  
    parentNode.classList.add('has-error');
    parentNode.classList.remove('has-success');
    parentNode.getElementsByClassName('control-label')[0].textContent = 'Ошибка: ' + this.message;
  };
  
  onSuccess() {
    const parentNode = this.element.parentNode;
  
    parentNode.classList.add('has-success');
    parentNode.classList.remove('has-error');
    parentNode.getElementsByClassName('control-label')[0].textContent = 'Ура! Всё прошло хорошо, ваши данные полность валидные.';
  };
  
  invokeValidate(callback) {
    this.validate.addEventListener("click", callback)
  }
  
  blurEmail(callback) {
    this.email.addEventListener("blur", callback)
  }
  
  blurPassword(callback) {
    this.password.addEventListener("blur", callback)
  }
}