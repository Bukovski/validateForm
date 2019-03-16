class LoginPresenter {
  constructor(model, view) {
    this._model = model;
    this._view = view;
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
      onError: this._view.onError,
      onSuccess: this._view.onSuccess
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
      onError: this._view.onError,
      onSuccess: this._view.onSuccess
    });
  }
  
  validateClick() {
    this._view.invokeValidate(() => {
      const email = this.emailInput();
      const password = this.passwordInput();
      
      email.validate();
      password.validate();
      
      if (email.getValid() && password.getValid()) {
        const token = this._view.token;
        
        if (token.length) {
          const data = {
            email: email.getValue(),
            password: password.getValue()
          };
          
          this._model.getRequest(data, token);
        }
      } else {
        this._view.blurEmail(() => {
          email.validate();
        });
        
        this._view.blurPassword(() => {
          password.validate();
        });
      }
    })
  }
}