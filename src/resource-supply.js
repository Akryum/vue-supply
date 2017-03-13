export default {
  // Help third-party integration know it's a Supply
  // to provide automatic activation and helpers if needed
  isSupply: true,

  data () {
    return {
      // Number of components or others that declared using this supply
      consumers: 0,
      // Asynchronous data loading management
      // 0 = loaded
      // 1+ = currently loading
      loading: 0,
    }
  },

  computed: {
    // Has one or more active consumers
    active () {
      return this.consumers > 0
    },

    // Is not loading data
    ready () {
      return this.loading === 0
    },
  },

  watch: {
    consumers (val, oldVal) {
      if (val !== oldVal) {
        this._handleConsumersChange(val, oldVal)
      }
    },

    ready (val, oldVal) {
      if (val !== oldVal) {
        this._handleReadyChange(val)
      }
    },

    activate (val, oldVal) {
      if (val !== oldVal) {
        this._handleActiveChange(val)
      }
    },
  },

  methods: {
    _activate () {
      this.activate()
      this.$emit('is-active')
    },
    _deactivate () {
      this.deactivate()
      this.$emit('is-not-active')
    },
    _handleReadyChange (val) {
      this.handleReadyChange(val)
      this.$emit('ready', val)
      if (val) {
        this.$emit('is-ready')
      } else {
        this.$emit('is-not-ready')
      }
    },
    _handleActiveChange (val) {
      this.handleActiveChange(val)
      this.$emit('active', val)
    },
    _handleConsumersChange (val, oldVal) {
      this.handleConsumersChange(val, oldVal)
      this.$emit('consumers', val, oldVal)
    },

    // Declare using this Supply
    // so that it can start subscriptions
    grasp () {
      this.consumers ++
      if (this.consumers === 1) {
        this._activate()
      }
    },
    // Declare no longer using this Supply
    // so that it can potentially free subscriptions
    release () {
      this.consumers --
      if (this.consumers === 0) {
        this._deactivate()
      }
    },

    // Waits for the Supply to be used by something
    // Resolves immediatly if already active
    ensureActive () {
      return new Promise((resolve) => {
        if (this.active) {
          resolve()
        } else {
          this.$once('is-active', resolve)
        }
      })
    },
    // Waits for the Supply to be ready (no loading in progress)
    // Resolves immediatly if already ready
    ensureReady () {
      return new Promise((resolve) => {
        if (this.ready) {
          resolve()
        } else {
          this.$once('is-ready', resolve)
        }
      })
    },

    activate () {
      // To Override with subscriptions
    },
    deactivate () {
      // To Override with unsubscriptions
    },
    handleReadyChange (val) {
      // To Override
    },
    handleActiveChange (val) {
      // To Override
    },
    handleConsumersChange (val, oldval) {
      // To Override
    },
  },
}
