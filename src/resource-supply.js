export default {
  data () {
    return {
      consumers: 0,
      loading: 0,
    }
  },

  computed: {
    active () {
      return this.consumers > 0
    },

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

    grasp () {
      this.consumers ++
      if (this.consumers === 1) {
        this._activate()
      }
    },
    release () {
      this.consumers --
      if (this.consumers === 0) {
        this._deactivate()
      }
    },

    ensureActive () {
      return new Promise((resolve) => {
        if (this.active) {
          resolve()
        } else {
          this.$once('is-active', resolve)
        }
      })
    },
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
      // To Override
    },
    deactivate () {
      // To Override
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
