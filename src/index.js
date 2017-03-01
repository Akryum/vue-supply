import Supply from './resource-supply'

export function consume (resource) {
  resource.grasp()
  return resource.ensureReady().then(() => resource.release)
}

export function use (resource) {
  return {
    created () {
      resource.grasp()
    },
    beforeDestroy () {
      resource.release()
    },
  }
}

export function install (Vue) {
  // Nothing yet
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
