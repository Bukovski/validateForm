class AuthPresenter {
  constructor(model, view) {
    this._model = model;
    this._view = view;
  }
  
  nameInput() {
    return new Validator.init(this._view.name, {
      rules: {
        min: 2,
        max: 25,
        match: 'letters'
      },
      messages: {
        min: 'This field must contain a minimum of %rule% characters. The value of %data% not suitable',
        max: 'This field must contain a maximum of %rule% characters. The value of %data% not suitable',
        match: 'This field must contain only letters. The value of %data% not suitable'
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
        radioValidate: 'Specify your gender'
      },
      onError: this._view.onError(),
      onSuccess: this._view.onSuccess("Gender was selected")
    });
  }
  
  emailInput() {
    return new Validator.init(this._view.email, {
      rules: {
        min: 7,
        max: 35,
        match: 'email'
      },
      messages: {
        min: 'This field must contain a minimum of %rule% characters. The value of %data% not suitable',
        max: 'This field must contain a maximum of %rule% characters. The value of %data% not suitable',
        match: 'This field must contain a valid email address. The value of %data% not suitable'
      },
      onError: this._view.onError(),
      onSuccess: this._view.onSuccess()
    });
  }
  
  passwordInput() {
    return new Validator.init(this._view.password, {
      rules: {
        required: true,
        min: 6,
        max: 25,
        match: "password"
      },
      messages: {
        required: 'This field must be required!',
        min: 'this field must contain a minimum of %rule% characters',
        max: 'this field must contain a maximum of %rule% characters',
        match: 'password must consist of digits, letters (large and small) 123qweRTY'
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
        min: 6,
        max: 25,
        match: "password",
        repeatPassword: true
      },
      messages: {
        required: 'This field must be required!',
        min: 'this field must contain a minimum of %rule% characters',
        max: 'this field must contain a maximum of %rule% characters',
        match: 'password must consist of digits, letters (large and small) 123qweRTY',
        repeatPassword: 'Passwords must match'
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