class AuthPresenter {
  constructor(model, view) {
    this._model = model;
    this._view = view;
  }
  
  nameInput() {
    return new Validator.init(this._view.name, {
      rules: {
        min: 3,
        max: 25,
        match: 'letters'
      },
      messages: {
        min: 'Это поле должно содержать минимум %rule% символов. Значение %data% не подходит',
        max: 'Это поле должно содержать максимум %rule% символов. Значение %data% не подходит',
        match: 'Это поле должно содержать только буквы. Значение %data% не подходит'
      },
      onError: this._view.onError,
      onSuccess: this._view.onSuccess
    });
  }
  
  radioGender() {
    Validator.fn.radioChecked = function() {
      const parentNode = this.element.parentNode;
      
      return parentNode.querySelectorAll("input[type='radio']:checked");
    };
    
    Validator.fn.radioValidate = function() {
      return this.radioChecked().length;
    };
    
    Validator.fn.valueRadio = function() {
      const radioCheck = this.radioChecked()[0];
    
      return (radioCheck) ? radioCheck.value : "";
    };
  
    return new Validator.init(this._view.radio, {
      rules: {
        radioValidate: true
      },
      messages: {
        radioValidate: 'Укажите ваш пол'
      },
      onError: this._view.onError,
      onSuccess: this._view.onSuccess
    });
  }
  
  emailInput() {
    return new Validator.init(this._view.email, {
      rules: {
        min: 5,
        max: 20,
        match: 'email'
      },
      messages: {
        min: 'Это поле должно содержать минимум %rule% символов. Значение %data% не подходит',
        max: 'Это поле должно содержать максимум %rule% символов. Значение %data% не подходит',
        match: 'Это поле должно содержать адрес электронной почты. Значение %data% не подходит'
      },
      onError: this._view.onError,
      onSuccess: this._view.onSuccess
    });
  }
  
  passwordInput() {
    //расширение функционала валидатора
    Validator.fn.password = function() { //если есть даныне из БД, можем сравнить введенные данные
      return this.valueEelement === "123qweRTY";
    };
    
    return new Validator.init(this._view.password, {
      rules: {
        required: true,
        match: "password",
        // password: true
      },
      messages: {
        required: 'Это поле обязательно для заполнения!',
        match: 'Пароль должет состоять из цифр, латинских букв (больших и маленьких)',
        // password: 'Пароль должет быть 123qweRTY Значение "%data%" не подходит'
      },
      onError: this._view.onError,
      onSuccess: this._view.onSuccess
    });
  }
  
  passwordRepeatInput() {
    Validator.fn.repeatPassword = function() {
      return this.valueEelement === this._model.bind(this).authPasswordValue;
    };
  
    return new Validator.init(this._view.passwordRepeat, {
      rules: {
        required: true,
        repeatPassword: true
      },
      messages: {
        required: 'Это поле обязательно для заполнения!',
        repeatPassword: 'Пароли должны совпадать'
      },
      onError: this._view.onError,
      onSuccess: this._view.onSuccess
    });
  }
  
  validateClick() {
    this._view.invokeValidate((event) => {
      event.preventDefault();
  
      const nameInput = this.nameInput();
      const radioGender = this.radioGender();
      const emailInput = this.emailInput();
      const passwordInput = this.passwordInput();
      const passwordRepeatInput = this.passwordRepeatInput();
      
      this._model.authPasswordValue = passwordInput.valueEelement;
  
      nameInput.validate();
      radioGender.validate();
      emailInput.validate();
      passwordInput.validate();
      passwordRepeatInput.validate();
  
      console.log(
        nameInput.getValid(),
        radioGender.getValid(),
        emailInput.getValid(),
        passwordInput.getValid(),
        passwordRepeatInput.getValid()
      );
  
      console.log(
        nameInput.valueEelement,
        radioGender.valueRadio(),
        emailInput.valueEelement,
        passwordInput.valueEelement,
        passwordRepeatInput.valueEelement
      );
    });
  }
}