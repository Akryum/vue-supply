module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/* harmony default export */ __webpack_exports__["a"] = ({
  // Help third-party integration know it's a Supply
  // to provide automatic activation and helpers if needed
  isSupply: true,

  data: function data() {
    return {
      // Number of components or others that declared using this supply
      consumers: 0,
      // Asynchronous data loading management
      // 0 = loaded
      // 1+ = currently loading
      loading: 0
    };
  },


  computed: {
    // Has one or more active consumers
    active: function active() {
      return this.consumers > 0;
    },


    // Is not loading data
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


    // Declare using this Supply
    // so that it can start subscriptions
    grasp: function grasp() {
      this.consumers++;
      if (this.consumers === 1) {
        this._activate();
      }
    },

    // Declare no longer using this Supply
    // so that it can potentially free subscriptions
    release: function release() {
      this.consumers--;
      if (this.consumers === 0) {
        this._deactivate();
      }
    },


    // Waits for the Supply to be used by something
    // Resolves immediatly if already active
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

    // Waits for the Supply to be ready (no loading in progress)
    // Resolves immediatly if already ready
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
      // To Override with subscriptions
    },
    deactivate: function deactivate() {
      // To Override with unsubscriptions
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
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["consume"] = consume;
/* harmony export (immutable) */ __webpack_exports__["use"] = use;
/* harmony export (immutable) */ __webpack_exports__["getResource"] = getResource;
/* harmony export (immutable) */ __webpack_exports__["register"] = register;
/* harmony export (immutable) */ __webpack_exports__["injectSupply"] = injectSupply;
/* harmony export (immutable) */ __webpack_exports__["install"] = install;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resource_supply__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Supply", function() { return __WEBPACK_IMPORTED_MODULE_0__resource_supply__["a"]; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };


var Vue = void 0;

// For periodically using a Supply
// Grasp the Supply and waits for it to be ready
function consume(resource) {
  resource.grasp();
  return resource.ensureReady().then(function () {
    return resource.release;
  });
}

// Declare using a Supply
// Automatically activateing & deactivating it when no longer used
function use(arg) {
  var name = void 0;
  return {
    created: function created() {
      var resource = void 0;
      var def = arg;

      if (typeof def === 'string') {
        var _name = def;
        def = defs[_name];
        if (!def) {
          throw Error('Supply \'' + _name + '\' not found. Did you register it?');
        }
      }

      if (!def._isVue) {
        var cache = this.$root._supplyCache = this.$root._supplyCache || {};
        resource = getResource(def, cache);
        name = def.name;
      } else {
        name = arg._uid;
        resource = arg;
      }

      this.$supply = this.$supply || {};
      this.$supply[name] = resource;

      resource.grasp();
    },
    beforeDestroy: function beforeDestroy() {
      var resource = arg._isVue ? arg : this.$supply[name];
      if (resource) {
        resource.release();
      }
    }
  };
}

var uid = 0;

function getResource(def, cache) {
  var name = def.name || '_' + uid++;
  var resource = cache[name];
  if (!resource) {
    resource = cache[name] = new Vue(def);
  }
  return resource;
}

var defs = {};

function register(name, def) {
  def.name = name;
  defs[name] = def;
}

function injectSupply(storeOptions, cache) {
  var result = storeOptions;
  if (_typeof(storeOptions.supply) === 'object') {
    var supplies = storeOptions.supply.use.reduce(function (dic, name) {
      dic[name] = getResource(defs[name], cache);
      return dic;
    }, {});
    var newOptions = storeOptions.supply.inject(supplies);
    result = {};
    for (var key in storeOptions) {
      result[key] = Object.assign({}, storeOptions[key], newOptions[key]);
    }
    delete result.supply;
  }

  if (_typeof(storeOptions.modules) === 'object') {
    for (var _key in storeOptions.modules) {
      var module = storeOptions.modules[_key];
      result.modules[_key] = injectSupply(module, cache);
    }
  }

  return result;
}

function install(pVue) {
  Vue = pVue;

  Vue.mixin({
    init: function init() {
      if (this.$options.supplyCache) {
        this._supplyCache = this.$options.supplyCache;
      }
    }
  });
}



/* -- Plugin definition & Auto-install -- */
/* You shouldn't have to modify the code below */

// Plugin
var plugin = {
  /* eslint-disable no-undef */
  version: "0.2.0",
  install: install
};

/* harmony default export */ __webpack_exports__["default"] = (plugin);

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