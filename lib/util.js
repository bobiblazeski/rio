var Util = module.exports = {};

var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

Util.validateEmail = function validateEmail(email) {
    return re.test(email);
};

Util.validatePassword = function validatePassword(password) {
  return R.is(String,password) && password.length > 3;
};

