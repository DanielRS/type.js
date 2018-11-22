module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'typing.js': 'src/*.js',
      },
    },
  },

  paths: {
    watched: ['src'],
    public: 'dist'
  },

  conventions: {
    ignored: [/^bower_components/],
    vendor: /^(bower_components|node_modules|vendor)/
  },

  plugins: {
    babel: {
      presets: ['@babel/preset-env'],
      ignore: [/node_modules/, /bower_components/]
    }
  },

  modules: {
    wrapper: false,
    definition: false,
  },

  overrides: {
    production: {
      files: {
        javascripts: {
          joinTo: {
            'typing.min.js': /^src/
          }
        }
      }
    }
  },

  bower: {
    enabled: false
  },

  npm: {
    enabled: false
  },
};
