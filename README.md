# vue-supply

[![npm](https://img.shields.io/npm/v/vue-supply.svg) ![npm](https://img.shields.io/npm/dm/vue-supply.svg)](https://www.npmjs.com/package/vue-supply)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

Create resources that can automatically be activated and deactivated when used (like subscriptions)

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)

# Installation

```
npm install --save vue-supply
```

## Default import

```javascript
import Vue from 'vue'
import VueSupply from 'vue-supply'

Vue.use(VueSupply)
```

## Distribution import

```javascript
import VueSupply from 'vue-supply/dist/vue-supply.common'

Vue.use(VueSupply)
```

## Browser

```html
<script src="vue.js"></script>
<script src="vue-supply/dist/vue-supply.browser.js"></script>
```

The plugin should be auto-installed. If not, you can install it manually with the instructions below.

```javascript
Vue.use(VueSupply)
```

## Source import

```javascript
import Vue from 'vue'
import VueSupply from 'vue-supply/src'

Vue.use(VueSupply)
```

# Usage

A resource supply is a Vue instance which is responsible for managing a piece of dynamic data (for example, a Meteor, GraphQL or Firebase subscription with data that may change and update from the server). It has an deactivated state (default), and an activated state when the data should be updated (for example, a subscription running).

It is created with the `supply` function:

```javascript
import { supply } from 'vue-supply'

export default supply({
  // Vue options here
})
```

The two methods when using the resource are:

 - `resource.grasp()` wich increment `resource.consumers` by `1`
 - `resource.release()` wich decrement `resource.consumers` by `1`

The resource supply will emit a `consumers` event with the count when it changes.

The resource is active if it has one or more `consumers`. When it becomes active, it calls the `activate` method, which you should override in the definition:

```javascript
export default supply({
  methods: {
    activate () {
      // Subscribe
    },
  },
})
```

Also, the `active` event is emitted on the resource, with a `true` boolean argument, and the `is-active` event.

```javascript
import TestResource from 'supply/test-resource'

TestResource.$on('active', (isActive) => {
  // Do something
})
```

And when there are no more consumer for the resource, the `deactivate` method is called:

```javascript
export default supply({
  methods: {
    activate () {
      // Subscribe
    },
    deactivate () {
      // Unsubscribe
    },
  },
})
```

Add a mixin with `use(resource)` to automatically `grasp` and `release` the supply when the component is created and destroyed.

Also, the `active` event is emitted on the resource, with a `false` boolean argument, and the `is-not-active` event.

Now to activate or deactivate the resource supply, use the `grasp` and `release` methods where you need to access the resource:

```javascript
TestResource.grasp()
console.log(TestResource.someData)
TestResource.release()
```

There is a `active` computed boolean available that changes when the resource supply is activated or deactivated:

```javascript
export default {
  computed: {
    isResourceUsed () {
      return TestResource.active
    }
  },
}
```

You can also use the `resource.ensureActive()` method which return a promise that resolves as soon as the resource supply is activated (or immediatly if it is already):

```javascript
TestResource.ensureActive().then(() => {
  // The resource supply is active
})
```

Inside a component, add a mixin with the `use` function:

```javascript
import { use } from 'vue-supply'
import TestResource from 'supply/test-supply'

export default {
  // This component now uses TestResource
  mixins: [use(TestResource)],

  // Use the values in computed properties
  computed: {
    answer () {
      return TestResource.someData
    }
  },

  // ...
}
```

Then you can use the resource data inside computed properties or inside methods:

```javascript
// Use the values in computed properties
computed: {
  answer () {
    return TestResource.someData
  }
},
```

Inside a vuex store, you can use the resource data inside getters:

```javascript
import TestResource from 'test-supply'

export default {
  getters: {
    // Use the resource data in getters
    'my-getter': state => TestResource.someData + state.something,
  },
}
```

Then to activate/deactivate the supply, you can either call the `grasp` and `release` methods inside actions:

```javascript
actions: {
  'subscribe-action' () {
    // Request usage in the store
    // Ex: subscribing to a Meteor publication
    TestResource.grasp()
  },

  'unsubscribe-action' () {
    // No longer used in the store
    // Ex: unsubscribing from a Meteor publication
    TestResource.release()
  },
}
```

Or with the mixins and the `use` function inside components using the getter (see above).

## Asynchronous data

A loading system is included in the resource supplies. Change the `loading` integer property:

 - `0` means the resource is ready to be consumed (for example, data is loaded). This is the default value.
 - `1` or more means there is loading in progress

You should change the `loading` property inside the `activate` and `deactive` methods:

```javascript
export default supply({
  methods: {
    activate () {
      console.log('subscribing...')
      // Use the integer `loading` property
      // 0 mean ready
      this.loading ++
      // Faking a server request here :p
      setTimeout(() => {
        console.log('data is loaded')
        this.loading --
      }, 1000)
    },
  },
})
```

You can get the loading state with the `ready` computed property, a boolean which is `true` when there are no loading in progress. It can directly used inside computed properties:

```javascript
// Use the values in computed properties
computed: {
  isDataReady () {
    return TestResource.ready
  }
},
```

There are the `ready` (with a boolean argument), `is-ready` and `is-not-ready` events.

You can also use the `resource.ensureReady()` method which return a promise that resolves as soon as the resource supply is ready (or immediatly if it is already):

```javascript
TestResource.ensureReady().then(() => {
 // The resource supply is ready
})
```

There is a useful function, `consume`, which comes in handy when you only need to use the resource periodically. It both graspes and wait for ready and return a `release` function:

```javascript
import { consume } from 'vue-supply'
// This will grasp and wait for the resource to be 'ready'
const release = await consume(TestResource)
// Count of active resource consumers
console.log('consumers', TestResource.consumers)
// When you are done with the resource, release it
release()
```

# Example

Create a resource supply:

```javascript
import { supply } from 'vue-supply'

export default supply({
  data () {
    return {
      someData: null,
    }
  },
  methods: {
    activate () {
      console.log('subscribing...')
      // Use the integer `loading` property
      // 0 mean ready
      this.loading ++
      // Faking a server request here :p
      setTimeout(() => {
        this.someData = 42
        this.loading --
      }, 1000)
    },
    deactivate () {
      console.log('unsubscribing...')
    },
  },
})
```

Use the resource supply in components:

```javascript
import { use } from 'vue-supply'
import TestResource from 'test-supply'

export default {
  // This component now uses TestResource
  mixins: [use(TestResource)],

  // Use the values in computed properties
  computed: {
    answer () {
      return TestResource.someData
    }
  },

  // ...
}
```

Or in the vuex store:

```javascript
import { consume } from 'vue-supply'
import TestResource from 'test-supply'

export default {
  getters: {
    // Use the resource data in getters
    'my-getter': () => TestResource.someData,
  },
  actions: {
    'subscribe-action' () {
      // Request usage in the store
      // Ex: subscribing to a Meteor publication
      TestResource.grasp()
    },

    'unsubscribe-action' () {
      // No longer used in the store
      // Ex: unsubscribing from a Meteor publication
      TestResource.release()
    },

    async 'consume-action' ({ commit }) {
      // This will wait for the resource to be 'ready'
      const release = await consume(TestResource)
      // Count of active resource consumers
      console.log('consumers', TestResource.consumers)
      commit('my-commit', TestResource.someData)
      // When you are done with the resource, release it
      release()
    },
  },
}
```

---

## License

[MIT](http://opensource.org/licenses/MIT)
