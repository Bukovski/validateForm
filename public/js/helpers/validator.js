const Validator = (function () {
  const _createMessage = function(message, settings) {
    for (let key in settings) {
      message = message.replace('%' + key + '%', settings[ key ]);
    }
    
    return message;
  };
  
  const _regExps = {
    email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    url: /^((https?):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    numbers: /^\d+(\.\d{1,2})?$/,
    digits: /[0-9]*$/,
    letters: /[a-z][A-Z]*$/
  };
  const _messages = {
    required: 'This field is required',
    min: 'This field should contain at least %rule% characters',
    max: 'This field should not contain more than %rule% characters',
    match: 'This field shold countain a valid %rule%'
  };
  const _defaults = {
    regExps: _regExps,
    message: _messages
  };
  
  const Validate = function (element, options) {
    this.options = Object.assign({}, _defaults, options);
    this.element = element;
    this.regExps = _regExps;
    this.valueEelement = "";
    this.lengthElenet = 0;
    this.isValid = false;
  };
  
  const fn = Validate.prototype;
  
  fn.validate = function () {
    let isValid = true;
    
    this.valueEelement = (this.element.value) ? this.element.value.trim() : "";
    this.lengthElenet = this.valueEelement.length;
    this.isValid = false;
    
    for (let rule in this.options.rules) {
      const param = this.options.rules[ rule ];
      
      if (!this[ rule ](param)) {
        isValid = false;
        
        this.message = _createMessage(this.options.messages[ rule ], { rule: param, data: this.valueEelement });
        this.options.onError.call(this);
        
        break;
      }
      if (isValid) {
        this.options.onSuccess.call(this);
      }
    }
    
    this.isValid = isValid;
  };
  fn.required = function () { return this.lengthElenet > 0 };
  fn.min = function (param) { return this.lengthElenet >= param };
  fn.max = function (param) { return this.lengthElenet <= param };
  fn.match = function (param) { return this.regExps[ param ].test(this.valueEelement) };
  fn.getValid = function () { return this.isValid };
  
  return {
    init: Validate,
    fn: fn
  }
})();