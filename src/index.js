import Supply from './resource-supply'
let Vue

// For periodically using a Supply
// Grasp the Supply and waits for it to be ready
export function consume (resource) {
  resource.grasp()
  return resource.ensureReady().then(() => resource.release)
}

// Declare using a Supply
// Automatically activateing & deactivating it when no longer used
export function use (arg) {
  let name
  return {
    created () {
      let resource
      let def = arg

      if (typeof def === 'string') {
        const name = def
        def = defs[name]
        if (!def) {
          throw Error(`Supply '${name}' not found. Did you register it?`)
        }
      }

      if (!def._isVue) {
        const cache = this.$root._supplyCache = this.$root._supplyCache || {}
        resource = getResource(def, cache)
        name = def.name
      } else {
        name = arg._uid
        resource = arg
      }

      this.$supply = this.$supply || {}
      this.$supply[name] = resource

      resource.grasp()
    },
    beforeDestroy () {
      const resource = arg._isVue ? arg : this.$supply[name]
      if (resource) {
        resource.release()
      }
    },
  }
}

let uid = 0

export function getResource (def, cache) {
  const name = def.name || `_${uid++}`
  let resource = cache[name]
  if (!resource) {
    resource = cache[name] = new Vue(def)
  }
  return resource
}

const defs = {}

export function register (name, def) {
  def.name = name
  defs[name] = def
}

export function injectSupply (storeOptions, cache) {
  let result = storeOptions
  if (typeof storeOptions.supply === 'object') {
    const supplies = storeOptions.supply.use.reduce((dic, name) => {
      dic[name] = getResource(defs[name], cache)
      return dic
    }, {})
    const newOptions = storeOptions.supply.inject(supplies)
    result = {}
    for (const key in storeOptions) {
      result[key] = Object.assign({}, storeOptions[key], newOptions[key])
    }
    delete result.supply
  }

  if (typeof storeOptions.modules === 'object') {
    for (const key in storeOptions.modules) {
      const module = storeOptions.modules[key]
      result.modules[key] = injectSupply(module, cache)
    }
  }

  return result
}

export function install (pVue) {
  Vue = pVue

  Vue.mixin({
    beforeCreate () {
      if (this.$options.supplyCache) {
        this._supplyCache = this.$options.supplyCache
      }
    },
  })
}

export {
  Supply,
}

/* -- Plugin definition & Auto-install -- */
/* You shouldn't have to modify the code below */

// Plugin
const plugin = {
  /* eslint-disable no-undef */
  version: VERSION,
  install,
}

export default plugin

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}
