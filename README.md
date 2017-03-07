<p align="center"><img src="logo.png"/></p>

<h1 align="center">vue-supply</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/vue-supply"><img src="https://img.shields.io/npm/v/vue-supply.svg"/> <img src="https://img.shields.io/npm/dm/vue-supply.svg"/></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/vue-2.x-brightgreen.svg"/></a>
</p>

Create resources that can automatically be activated and deactivated when used (like subscriptions)

# Table of contents

- [Why do I need this?](#why-do-i-need-this)
- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)

# Why do I need this?

Efficiently managing reactive and living data from an external source can become difficult in a large app or when using [vuex](https://github.com/vuejs/vuex/). With `vue-supply`, you can easily consume data and automatically activate or deactivate subscriptions.

## What kind of data?

`vue-supply` is suitable for any kind of reactive and realtime data. For example:

- [meteor](https://www.meteor.com/) reactive data (tracker, minimongo...) and realtime subscriptions/publications
- [apollo](http://www.apollodata.com/) GraphQL subscriptions (using websockets)
- [firebase](https://firebase.google.com/) realtime subscriptions
- ...

## How does it work?

With `vue-supply`, you create Vue instances extending the `Supply` definition. You then define two methods: `activate` and `deactivate`. For example, you can subscribe to a realtime publication in the `activate` method and destroy this subscription in the `deactivate` method. When you will use this `Supply` in your components (called 'consumers'), it will automatically activate itself when it is first used (with the `grasp` method) or deactivate itself when no component use it anymore (with the `release` method). You can also easily store the realtime data inside the `Supply` and access it in the consumer components or in vuex getters. Anywhere in your code, you can wait for a `Supply` to be activated with the `ensureActive` method.

`Supply` also understands the notion of loading the data: when your subscription is being processed, just increment the `loading` property. When it's ready, decrement `loading`. If all the operations are done (which means that `loading` value is `0`), the `Supply` will emit the `is-ready` event you can listen to. You can also use the `ready` property directly in your templates (or somewhere else). There is also a `ensureReady` method that waits for the `Supply` to be ready.

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

## Browser

```html
<script src="vue.js"></script>
<script src="vue-supply/dist/vue-supply.browser.js"></script>
```

The plugin should be auto-installed. If not, you can install it manually with the instructions below.

```javascript
Vue.use(VueSupply)
```

# Usage

A supply is a Vue instance which is responsible for managing a piece of dynamic data (for example, a Meteor, GraphQL or Firebase subscription with data that may change and update from the server). It has an deactivated state (default), and an activated state when the data should be updated (for example, when a subscription is running).

To create a supply, create a new Vue instance extending the `Supply` definition:

```javascript
import { Supply } from 'vue-supply'

export default new Vue({
  extends: Supply,
  // Vue options here
})
```

The two methods when using the supply are:

 - `supply.grasp()` wich increment `supply.consumers` by `1`
 - `supply.release()` wich decrement `supply.consumers` by `1`

To activate or deactivate the supply, use the `grasp` and `release` methods where you need to access the supply:

```javascript
import TestResource from 'supply/test-resource'

console.log(TestResource.consumers) // 0
TestResource.grasp()
console.log(TestResource.consumers) // 1
console.log(TestResource.someData) // Access the data
TestResource.release()
console.log(TestResource.consumers) // 0
```

The supply will emit a `consumers` event with the count when it changes.

The supply is active if it has one or more `consumers`. When it becomes active, it calls the `activate` method, which you should override in the definition:

```javascript
export default new Vue({
  extends: Supply,
  methods: {
    activate () {
      // Subscribe
    },
  },
})
```

Also, the `active` event is emitted on the supply, with a `true` boolean argument, and the `is-active` event.

```javascript
TestResource.$on('active', (isActive) => {
  // Do something
})
```

And when there are no more consumer for the supply, the `deactivate` method is called:

```javascript
export default new Vue({
  extends: Supply,
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

Also, the `active` event is emitted on the supply, with a `false` boolean argument, and the `is-not-active` event.

There is a `active` computed boolean available that changes when the supply is activated or deactivated:

```javascript
import TestResource from 'supply/test-resource'

export default {
  computed: {
    isResourceUsed () {
      return TestResource.active
    },
  },
}
```

You can also use the `supply.ensureActive()` method which return a promise that resolves as soon as the supply is activated (or immediatly if it is already):

```javascript
TestResource.ensureActive().then(() => {
  // The supply is active
})
```

Inside a component, add a mixin with `use(supply)` to automatically `grasp` and `release` the supply when the component is created and destroyed:

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
    },
  },

  // ...
}
```

Then you can use the supply data inside computed properties or inside methods:

```javascript
// Use the values in computed properties
computed: {
  answer () {
    return TestResource.someData
  },
},
```

Inside a vuex store, you can use the supply data inside getters:

```javascript
import TestResource from 'test-supply'

export default {
  getters: {
    // Use the supply data in getters
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

A loading system is included in the supply supplies. Change the `loading` integer property:

 - `0` means the supply is ready to be consumed (for example, data is loaded). This is the default value.
 - `1` or more means there is loading in progress

You should change the `loading` property inside the `activate` and `deactive` methods:

```javascript
import { Supply } from 'vue-supply'

export default new Vue({
  extends: Supply,
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
import TestResource from 'supply/test-resource'

export default {
  // Use the values in computed properties
  computed: {
    isDataReady () {
      return TestResource.ready
    },
  },
}
```

There are the `ready` (with a boolean argument), `is-ready` and `is-not-ready` events.

You can also use the `supply.ensureReady()` method which return a promise that resolves as soon as the supply is ready (or immediatly if it is already):

```javascript
TestResource.ensureReady().then(() => {
 // The supply is ready
})
```

There is a useful function, `consume`, which comes in handy when you only need to use the supply periodically. It both graspes and wait for ready and return a `release` function:

```javascript
import { consume } from 'vue-supply'
import TestResource from 'supply/test-resource'
// This will grasp and wait for the supply to be 'ready'
const release = await consume(TestResource)
// Count of active supply consumers
console.log('consumers', TestResource.consumers)
// When you are done with the supply, release it
release()
```

# Example

Create a supply:

```javascript
import { Supply } from 'vue-supply'

export default new Vue({
  extends: Supply,
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

Use the supply in components:

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
    // Use the supply data in getters
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
      // This will wait for the supply to be 'ready'
      const release = await consume(TestResource)
      // Count of active supply consumers
      console.log('consumers', TestResource.consumers)
      commit('my-commit', TestResource.someData)
      // When you are done with the supply, release it
      release()
    },
  },
}
```

---

## License

[MIT](http://opensource.org/licenses/MIT)
