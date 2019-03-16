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
    match: 'This field should contain a valid %rule%'
  };
  
  const _defaults = { //default settings
    regExps: _regExps,
    message: _messages
  };
  
  const Validate = function (element, options) {
    this.options = Object.assign({}, _defaults, options); //unite all objects into one
    this.element = element;
    this.regExps = _regExps;
    this.valueElement = "";
    this.lengthElenet = 0;
    this.isValid = false;
  };
  
  const fn = Validate.prototype;
  
  fn.validate = function () { //data validation and message generation
    let isValid = true;
    const valueElement = this.getValue();
    
    this.lengthElenet = valueElement.length;
    this.isValid = false;
    
    const optionRules = this.options.rules;
    
    for (let rule in optionRules) {
      if (optionRules.hasOwnProperty(rule)) {
        const param = optionRules[ rule ];
  
        if (!this[ rule ](param)) {
          isValid = false;
    
          this.message = _createMessage(this.options.messages[ rule ], { rule: param, data: valueElement }); //takes a template from settings and replaces it with error data
          this.options.onError.call(this); //pass the template to the error output
    
          break;
        }
  
        if (isValid) {
          this.options.onSuccess.call(this); //is all right. Call the success message
        }
      }
    }
    
    this.isValid = isValid;
  };
  
  fn.required = function () { return this.lengthElenet > 0 };
  fn.min = function (param) { return this.lengthElenet >= param };
  fn.max = function (param) { return this.lengthElenet <= param };
  fn.match = function (param) { return this.regExps[ param ].test(this.getValue()) };
  fn.getValid = function () { return this.isValid };
  fn.getValue = function () { return (this.element.value) ? this.element.value.trim() : "" };
  
  return {
    init: Validate,
    fn: fn
  }
})();