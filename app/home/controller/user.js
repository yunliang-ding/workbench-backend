'use strict';

exports.__esModule = true;
exports.User = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuidv1 = require('uuid/v1');

var User = function User() {
  (0, _classCallCheck3.default)(this, User);

  this.token = uuidv1();
};

var user = new User();
exports.User = user;