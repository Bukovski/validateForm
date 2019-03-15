class AuthView {
  constructor() {
    this.name = document.getElementById("inputName");
    this.email = document.getElementById("inputEmail");
    this.radio = document.getElementById("optionsRadios1");
    this.password = document.getElementById("inputPassword1");
    this.passwordRepeat = document.getElementById("inputPassword2");
    this.validate = document.getElementById("submitBtn");
    this.token = document.getElementsByName('_token')[0].value;
  }
  
  onError(message) {
    return function () {
      const customMessage = (message) ? message : 'Ошибка: ';
      
      const parentNode = this.element.parentNode;
  
      parentNode.classList.add('has-error');
      parentNode.classList.remove('has-success');
      parentNode.getElementsByClassName('control-label')[ 0 ].textContent = customMessage + this.message;
    }
  };
  
  onSuccess(message) {
    return function () {
      const parentNode = this.element.parentNode;
  
      parentNode.classList.add('has-success');
      parentNode.classList.remove('has-error');
      parentNode.getElementsByClassName('control-label')[ 0 ].textContent = (message) ? message : 'Ура! Всё прошло хорошо, ваши данные полность валидные.';
    }
  };
  
  invokeValidate(callback) {
    this.validate.addEventListener("click", callback)
  }
  
  blurElement(element, callback) {
    element.addEventListener("change", callback)
  }
}