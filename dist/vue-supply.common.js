module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = {
  data: function data() {
    return {
      consumers: 0,
      loading: 0
    };
  },


  computed: {
    active: function active() {
      return this.consumers > 0;
    },
    ready: function ready() {
      return this.loading === 0;
    }
  },

  watch: {
    consumers: function consumers(val, oldVal) {
      if (val !== oldVal) {
        this._handleConsumersChange(val, oldVal);
      }
    },
    ready: function ready(val, oldVal) {
      if (val !== oldVal) {
        this._handleReadyChange(val);
      }
    },
    activate: function activate(val, oldVal) {
      if (val !== oldVal) {
        this._handleActiveChange(val);
      }
    }
  },

  methods: {
    _activate: function _activate() {
      this.activate();
      this.$emit('is-active');
    },
    _deactivate: function _deactivate() {
      this.deactivate();
      this.$emit('is-not-active');
    },
    _handleReadyChange: function _handleReadyChange(val) {
      this.handleReadyChange(val);
      this.$emit('ready', val);
      if (val) {
        this.$emit('is-ready');
      } else {
        this.$emit('is-not-ready');
      }
    },
    _handleActiveChange: function _handleActiveChange(val) {
      this.handleActiveChange(val);
      this.$emit('active', val);
    },
    _handleConsumersChange: function _handleConsumersChange(val, oldVal) {
      this.handleConsumersChange(val, oldVal);
      this.$emit('consumers', val, oldVal);
    },
    grasp: function grasp() {
      this.consumers++;
      if (this.consumers === 1) {
        this._activate();
      }
    },
    release: function release() {
      this.consumers--;
      if (this.consumers === 0) {
        this._deactivate();
      }
    },
    ensureActive: function ensureActive() {
      var _this = this;

      return new Promise(function (resolve) {
        if (_this.active) {
          resolve();
        } else {
          _this.$once('is-active', resolve);
        }
      });
    },
    ensureReady: function ensureReady() {
      var _this2 = this;

      return new Promise(function (resolve) {
        if (_this2.ready) {
          resolve();
        } else {
          _this2.$once('is-ready', resolve);
        }
      });
    },
    activate: function activate() {
      // To Override
    },
    deactivate: function deactivate() {
      // To Override
    },
    handleReadyChange: function handleReadyChange(val) {
      // To Override
    },
    handleActiveChange: function handleActiveChange(val) {
      // To Override
    },
    handleConsumersChange: function handleConsumersChange(val, oldval) {
      // To Override
    }
  }
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resource_supply__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ResourceSupply", function() { return __WEBPACK_IMPORTED_MODULE_0__resource_supply__["a"]; });
/* harmony export (immutable) */ __webpack_exports__["consume"] = consume;
/* harmony export (immutable) */ __webpack_exports__["use"] = use;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supply", function() { return supply; });
/* harmony export (immutable) */ __webpack_exports__["install"] = install;
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



function consume(resource) {
  resource.grasp();
  return resource.ensureReady().then(function () {
    return resource.release;
  });
}

function use(resource) {
  return {
    created: function created() {
      resource.grasp();
    },
    beforeDestroy: function beforeDestroy() {
      resource.release();
    }
  };
}

function _supply(Vue, options) {
  return new Vue(_extends({
    extends: __WEBPACK_IMPORTED_MODULE_0__resource_supply__["a" /* default */]
  }, options));
}

var supply = function supply() {
  return null;
};

function install(Vue) {
  supply = function supply(options) {
    return _supply(Vue, options);
  };
}



/* -- Plugin definition & Auto-install -- */
/* You shouldn't have to modify the code below */

// Plugin
var plugin = {
  /* eslint-disable no-undef */
  version: "0.0.2",
  install: install
};

/* harmony default export */ __webpack_exports__["default"] = plugin;

// Auto-install
var GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

/***/ })
/******/ ]);
//# sourceMappingURL=vue-supply.common.js.map