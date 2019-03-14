class LoginPresenter {
  constructor(model, view) {
    this._model = model;
    this._view = view;
  }
  
  emailInput() {
    return new Validator.init(this._view.$email, {
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
    
    return new Validator.init(this._view.$password, {
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
  
  validateClick() {
    this._view.invokeValidate(() => {
      const email = this.emailInput();
      const password = this.passwordInput();
      
      email.validate();
      password.validate();
      
      if (email.getValid() && password.getValid()) {
        const data = {
          email: email.valueEelement,
          password: password.valueEelement
        };
        
        const token = this._view.$token;
        
        if (token.length) {
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