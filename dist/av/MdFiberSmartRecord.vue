<script>
  export default {
    name: 'md-fiber-smart-record',

    serverCacheKey: props => {
      return `md-fiber-smart-record:${props.color || 'default'}:${props.width}:${props.height}:${props.className || 'icon'}`;
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
        staticClass: 'icon md-icon md-fiber-smart-record',
        'class': this.className,
        attrs: {
          width: this.width,
          height: this.height,
          viewBox: this.viewBox,
          xmlns: 'http://www.w3.org/2000/svg'
        }
      };

      return h('svg', data, [
        h('circle', {
          attrs: {
            cx: '9',
            cy: '12',
            r: '8'
          },
          style: {
            fill: this.color
          }
        }),
        h('path', {
          attrs: {
            d: 'M17 4.26v2.09c2.33.82 4 3.04 4 5.65s-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74s-2.55-6.85-6-7.74z'
          },
          style: {
            fill: this.color
          }
        })
      ]);
    }
  };
</script>

