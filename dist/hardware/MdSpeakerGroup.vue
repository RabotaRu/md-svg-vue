<script>
  export default {
    name: 'md-speaker-group',

    serverCacheKey: props => {
      return `md-speaker-group:${props.color || 'default'}:${props.width}:${props.height}:${props.className || 'icon'}`;
    },

    props: {
      className: [Object, Array, String],
      width: {
        type: Number,
        'default': 24
      },
      height: {
        type: Number,
        'default': 24
      },
      viewBox: {
        type: String,
        'default': '0 0 24 24',
      },
      color: String
    },

    render (h) {
      const data = {
        staticClass: 'icon md-icon md-speaker-group',
        'class': this.className,
        attrs: {
          width: this.width,
          height: this.height,
          viewBox: this.viewBox,
          xmlns: 'http://www.w3.org/2000/svg'
        }
      };

      return h('svg', data, [
        h('path', {
          attrs: {
            d: 'M18.2 1H9.8C8.81 1 8 1.81 8 2.8v14.4c0 .99.81 1.79 1.8 1.79l8.4.01c.99 0 1.8-.81 1.8-1.8V2.8c0-.99-.81-1.8-1.8-1.8zM14 3c1.1 0 2 .89 2 2s-.9 2-2 2-2-.89-2-2 .9-2 2-2zm0 13.5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z'
          },
          style: {
            fill: this.color
          }
        }),
        h('circle', {
          attrs: {
            cx: '14',
            cy: '12.5',
            r: '2.5'
          },
          style: {
            fill: this.color
          }
        }),
        h('path', {
          attrs: {
            d: 'M6 5H4v16c0 1.1.89 2 2 2h10v-2H6V5z'
          },
          style: {
            fill: this.color
          }
        })
      ]);
    }
  };
</script>

