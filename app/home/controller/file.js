'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _user = require('./user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../../../www/config.json');
var dirTree = require("directory-tree");
var uuidv1 = require('uuid/v1');
var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');

var _require = require('child_process'),
    exec = _require.exec;

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, _class);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Base.call.apply(_Base, [this].concat(args))), _this), _this.toCode = function (code) {
      //加密字符串
      var newCCode = '';
      for (var i = 0; i < code.length; i++) {
        newCCode += String.fromCharCode(code[i].charCodeAt() - 1);
      }
      return newCCode;
    }, _this.fromCode = function (code) {
      //解密字符串
      var newCCode = '';
      for (var i = 0; i < code.length; i++) {
        newCCode += String.fromCharCode(code[i].charCodeAt() + 1);
      }
      return newCCode;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  /**
   * @return {Promise} []
   */
  _class.prototype.__before = function __before() {
    // this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    // this.header('Access-Control-Allow-Headers', 'x-requested-with');
    // this.header('Access-Control-Request-Method', 'GET,POST,PUT,DELETE');
    // this.header('Access-Control-Allow-Credentials', 'true');
    var token = this.header('Csrf-Token') || this.get('token');
    if (_user.User.token !== token && this.http.url !== '/file/login') {
      this.json({
        code: 403,
        isError: true,
        message: _user.User.token === this.cookie('token') ? '不支持外部请求' : '需要登录',
        data: []
      });
    }
  };

  _class.prototype.isloginAction = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var _cookie, token;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _cookie = this.cookie(), token = _cookie.token;

              this.json({
                code: _user.User.token !== token ? 403 : 200
              });

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function isloginAction() {
      return _ref.apply(this, arguments);
    }

    return isloginAction;
  }();

  _class.prototype.loginAction = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var _post, username, password;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _post = this.post(), username = _post.username, password = _post.password;

              if (username === config.username && password === config.password) {
                _user.User.token = uuidv1(); // 生成用户的token
                this.cookie('token', _user.User.token, {
                  // domain: this.header('origin'),
                  // httponly: true // 只能通过http请求
                });
                this.json({
                  isError: false,
                  message: '登录成功'
                });
              } else {
                this.json({
                  code: 403,
                  isError: true,
                  message: '需要登录'
                });
              }

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function loginAction() {
      return _ref2.apply(this, arguments);
    }

    return loginAction;
  }();

  _class.prototype.queryContent = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(data) {
      var res, i, _data;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              res = [];

              for (i = 0; i < data.length; i++) {
                _data = data[i];

                if (_data.type === 'directory') {
                  res.push(_data);
                  res.concat(this.queryContent(_data.children));
                } else {
                  _data.content = fse.readFileSync(_data.path, 'utf8');
                  res.push(_data);
                }
              }
              return _context3.abrupt('return', res);

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function queryContent(_x) {
      return _ref3.apply(this, arguments);
    }

    return queryContent;
  }();

  _class.prototype.getdirsAction = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var _this2 = this;

      var queryDir, data;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;

              queryDir = function () {
                var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(dir) {
                  return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          return _context4.abrupt('return', new _promise2.default(function (resolve) {
                            var data = [];
                            fs.readdir(dir, function (err, files) {
                              files.forEach(function (file) {
                                if (file.startsWith('.')) return;
                                var filepath = path.join(dir, file);
                                var stats = fs.statSync(filepath);
                                if (stats.isDirectory()) {
                                  data.push({
                                    type: 'directory',
                                    name: file,
                                    path: filepath
                                  });
                                }
                              });
                              resolve(data);
                            });
                          }));

                        case 1:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, _this2);
                }));

                return function queryDir(_x2) {
                  return _ref5.apply(this, arguments);
                };
              }();

              _context5.next = 4;
              return queryDir(this.get('dir'));

            case 4:
              data = _context5.sent;

              this.json({
                data: data,
                isError: false
              });
              _context5.next = 11;
              break;

            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5['catch'](0);

              this.json({
                error: _context5.t0,
                isError: true
              });

            case 11:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this, [[0, 8]]);
    }));

    function getdirsAction() {
      return _ref4.apply(this, arguments);
    }

    return getdirsAction;
  }();

  _class.prototype.filelistAction = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var param, data;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              param = this.get('createModel') ? {
                extensions: /\.js|.jsx|.ts|.tsx/,
                exclude: /node_modules|.DS_Store|.git/
              } : {
                exclude: /node_modules|.DS_Store/
              };
              _context6.prev = 1;
              data = dirTree(this.get('path'), param);

              if (!this.get('createModel')) {
                _context6.next = 7;
                break;
              }

              _context6.next = 6;
              return this.queryContent(data.children);

            case 6:
              data.children = _context6.sent;

            case 7:
              this.json({
                data: data,
                isError: false
              });
              _context6.next = 14;
              break;

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6['catch'](1);

              console.log(_context6.t0);
              this.json({
                error: _context6.t0,
                isError: false
              });

            case 14:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this, [[1, 10]]);
    }));

    function filelistAction() {
      return _ref6.apply(this, arguments);
    }

    return filelistAction;
  }();

  _class.prototype.getfileAction = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var data;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return fse.readFile(this.get('path'), 'utf8');

            case 3:
              data = _context7.sent;

              this.json({
                data: this.toCode(data),
                isError: false
              });
              _context7.next = 11;
              break;

            case 7:
              _context7.prev = 7;
              _context7.t0 = _context7['catch'](0);

              console.log(_context7.t0);
              this.json({
                error: _context7.t0,
                isError: true
              });

            case 11:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this, [[0, 7]]);
    }));

    function getfileAction() {
      return _ref7.apply(this, arguments);
    }

    return getfileAction;
  }();

  _class.prototype.savefileAction = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
      var exist;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return fs.existsSync(this.post('path'));

            case 3:
              exist = _context8.sent;

              if (!exist) {
                _context8.next = 9;
                break;
              }

              fse.outputFile(this.post('path'), this.toCode(this.post('content')).toString());
              this.json({
                isError: false
              });
              _context8.next = 10;
              break;

            case 9:
              throw 'file is not exist';

            case 10:
              _context8.next = 16;
              break;

            case 12:
              _context8.prev = 12;
              _context8.t0 = _context8['catch'](0);

              console.log(_context8.t0);
              this.json({
                error: _context8.t0,
                isError: true
              });

            case 16:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this, [[0, 12]]);
    }));

    function savefileAction() {
      return _ref8.apply(this, arguments);
    }

    return savefileAction;
  }();

  _class.prototype.newAction = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
      var _ref10, data, isError;

      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              _context9.next = 3;
              return this.fileCommand('cd ' + this.post('path') + ';touch ' + this.post('filename'));

            case 3:
              _ref10 = _context9.sent;
              data = _ref10.data;
              isError = _ref10.isError;

              this.json({
                data: data,
                isError: isError
              });
              _context9.next = 13;
              break;

            case 9:
              _context9.prev = 9;
              _context9.t0 = _context9['catch'](0);

              console.log(_context9.t0);
              this.json({
                error: _context9.t0,
                isError: true
              });

            case 13:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this, [[0, 9]]);
    }));

    function newAction() {
      return _ref9.apply(this, arguments);
    }

    return newAction;
  }();

  _class.prototype.deleteAction = function () {
    var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
      var _ref12, data, isError;

      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              _context10.next = 3;
              return this.fileCommand('cd ' + this.post('path') + ';rm -rf ' + this.post('filename'));

            case 3:
              _ref12 = _context10.sent;
              data = _ref12.data;
              isError = _ref12.isError;

              this.json({
                data: data,
                isError: isError
              });
              _context10.next = 13;
              break;

            case 9:
              _context10.prev = 9;
              _context10.t0 = _context10['catch'](0);

              console.log(_context10.t0);
              this.json({
                error: _context10.t0,
                isError: true
              });

            case 13:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this, [[0, 9]]);
    }));

    function deleteAction() {
      return _ref11.apply(this, arguments);
    }

    return deleteAction;
  }();

  _class.prototype.newfolderAction = function () {
    var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
      var _ref14, data, isError;

      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              _context11.next = 3;
              return this.fileCommand('cd ' + this.post('path') + ';mkdir ' + this.post('foldername'));

            case 3:
              _ref14 = _context11.sent;
              data = _ref14.data;
              isError = _ref14.isError;

              this.json({
                data: data,
                isError: isError
              });
              _context11.next = 13;
              break;

            case 9:
              _context11.prev = 9;
              _context11.t0 = _context11['catch'](0);

              console.log(_context11.t0);
              this.json({
                error: _context11.t0,
                isError: true
              });

            case 13:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, this, [[0, 9]]);
    }));

    function newfolderAction() {
      return _ref13.apply(this, arguments);
    }

    return newfolderAction;
  }();

  _class.prototype.renameAction = function () {
    var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
      var exist, _ref16, data, isError;

      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              _context12.next = 3;
              return fs.existsSync(this.post('path') + '/' + this.post('newName'));

            case 3:
              exist = _context12.sent;

              console.log(this.post('path') + '/' + this.post('newName'));

              if (exist) {
                _context12.next = 14;
                break;
              }

              _context12.next = 8;
              return this.fileCommand('cd ' + this.post('path') + ';mv ' + this.post('oldName') + ' ' + this.post('newName'));

            case 8:
              _ref16 = _context12.sent;
              data = _ref16.data;
              isError = _ref16.isError;

              this.json({
                data: data,
                isError: isError
              });
              _context12.next = 15;
              break;

            case 14:
              throw this.post('newName') + ' file already exists!';

            case 15:
              _context12.next = 21;
              break;

            case 17:
              _context12.prev = 17;
              _context12.t0 = _context12['catch'](0);

              console.log(_context12.t0);
              this.json({
                error: _context12.t0,
                isError: true
              });

            case 21:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, this, [[0, 17]]);
    }));

    function renameAction() {
      return _ref15.apply(this, arguments);
    }

    return renameAction;
  }();

  _class.prototype.fileCommand = function () {
    var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(cmd) {
      var data;
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.prev = 0;
              _context13.next = 3;
              return new _promise2.default(function (resolve) {
                exec(cmd, function (err, stdout, stderr) {
                  console.log('err==>', err);
                  if (err === null) {
                    if (stderr !== "") {
                      stdout = stderr + stdout;
                    }
                    resolve({
                      isError: false,
                      message: null,
                      data: stdout && stdout.split('\n').filter(function (_stdout) {
                        return _stdout !== '';
                      }),
                      stderr: stderr
                    });
                  } else {
                    resolve({
                      isError: true,
                      message: stderr
                    });
                  }
                });
              });

            case 3:
              data = _context13.sent;
              return _context13.abrupt('return', data);

            case 7:
              _context13.prev = 7;
              _context13.t0 = _context13['catch'](0);

              console.log(_context13.t0);
              return _context13.abrupt('return', {
                isError: true,
                error: _context13.t0
              });

            case 11:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, this, [[0, 7]]);
    }));

    function fileCommand(_x3) {
      return _ref17.apply(this, arguments);
    }

    return fileCommand;
  }();

  _class.prototype.downloadAction = function () {
    var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
      var _get, path, type, name;

      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _get = this.get(), path = _get.path, type = _get.type;
              name = path.split('/').slice(-1)[0];

              if (!(type === 'dir')) {
                _context14.next = 9;
                break;
              }

              _context14.next = 5;
              return this.fileCommand('cd ' + path + '; zip -r ' + name + '.zip ./*');

            case 5:
              path += '/' + name + '.zip'; // 生成压缩文件
              this.download(path, name + '.zip');
              _context14.next = 10;
              break;

            case 9:
              this.download(path, name);

            case 10:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee14, this);
    }));

    function downloadAction() {
      return _ref18.apply(this, arguments);
    }

    return downloadAction;
  }();

  return _class;
}(_base2.default);

exports.default = _class;