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
      onError: this._view.onError(),
      onSuccess: this._view.onSuccess()
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
    
    Validator.fn.radioValue = function() {
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
      onError: this._view.onError(),
      onSuccess: this._view.onSuccess("Пол был выбран")
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
      onError: this._view.onError(),
      onSuccess: this._view.onSuccess()
    });
  }
  
  passwordInput() {
    return new Validator.init(this._view.password, {
      rules: {
        required: true,
        match: "password"
      },
      messages: {
        required: 'Это поле обязательно для заполнения!',
        match: 'Пароль должет состоять из цифр, латинских букв (больших и маленьких)'
      },
      onError: this._view.onError(),
      onSuccess: this._view.onSuccess()
    });
  }
  
  passwordRepeatInput(passwordValue) {
    Validator.fn.repeatPassword = function() {
      return this.getValue() === passwordValue();
    };
    
    return new Validator.init(this._view.passwordRepeat, {
      rules: {
        required: true,
        match: "password",
        repeatPassword: true
      },
      messages: {
        required: 'Это поле обязательно для заполнения!',
        match: 'Пароль должет состоять из цифр, латинских букв (больших и маленьких)',
        repeatPassword: 'Пароли должны совпадать'
      },
      onError: this._view.onError(),
      onSuccess: this._view.onSuccess()
    });
  }
  
  validateClick() {
    this._view.invokeValidate((event) => {
      event.preventDefault();
      
      const nameInput = this.nameInput();
      const radioGender = this.radioGender();
      const emailInput = this.emailInput();
      const passwordInput = this.passwordInput();
      const passwordRepeatInput = this.passwordRepeatInput(() => passwordInput.getValue());
      
      const listValidate = [ nameInput, radioGender, emailInput, passwordInput, passwordRepeatInput ];
      
      listValidate.forEach(elem => {
        elem.validate();
      });
      
      const checkValidate = listValidate.every(elem => elem.getValid());
      
      if (checkValidate) {
        const token = this._view.token;
        
        if (token.length) {
          const data = {
            name: nameInput.getValue(),
            gender: radioGender.radioValue(),
            email: emailInput.getValue(),
            password: passwordInput.getValue()
          };
          
          this._model.getRequest(data, token);
        }
      } else {
        const listFields = [
          this._view.name,
          this._view.radio.parentNode, //input radio wrapper
          this._view.email,
          this._view.password,
          this._view.passwordRepeat,
        ];
        
        listFields.forEach((elem, index) => {
          this._view.blurElement(elem, () => {
            listValidate[index].validate();
          });
        })
      }
    });
  }
}