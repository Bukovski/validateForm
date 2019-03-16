class LoginView {
  constructor() {
    this.email = document.getElementById("email");
    this.password = document.getElementById("password");
    this.validate = document.getElementById("validate");
    this.token = document.querySelector('meta[name="csrf-token"]').attributes[1].textContent;
  }
  
  onError() {
    const parentNode = this.element.parentNode;
    
    parentNode.classList.add('has-error');
    parentNode.classList.remove('has-success');
    parentNode.querySelector('.help-block').textContent = 'Error: ' + this.message;
  };
  
  onSuccess() {
    const parentNode = this.element.parentNode;
    
    parentNode.classList.add('has-success');
    parentNode.classList.remove('has-error');
    parentNode.querySelector('.help-block').textContent = 'Data is valid';
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