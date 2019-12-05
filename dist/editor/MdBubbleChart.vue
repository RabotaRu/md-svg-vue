<script>
  export default {
    name: 'md-bubble-chart',

    serverCacheKey: props => {
      return `md-bubble-chart:${props.color || 'default'}:${props.width}:${props.height}:${props.className || 'icon'}`;
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
        staticClass: 'icon md-icon md-bubble-chart',
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
            cx: '7.2',
            cy: '14.4',
            r: '3.2'
          },
          style: {
            fill: this.color
          }
        }), h('circle', {
          attrs: {
            cx: '14.8',
            cy: '18',
            r: '2'
          },
          style: {
            fill: this.color
          }
        }), h('circle', {
          attrs: {
            cx: '15.2',
            cy: '8.8',
            r: '4.8'
          },
          style: {
            fill: this.color
          }
        })
      ]);
    }
  };
</script>

