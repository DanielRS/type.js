module.exports = {
  files: {
    javascripts: {
      entryPoints: {
        "src/typing.js": "typing.js"
      }
    },
  },

  paths: {
    watched: ["src"],
    public: "dist"
  },

  conventions: {
    ignored: [/^bower_components/],
    vendor: /^(bower_components|node_modules|vendor)/
  },

  plugins: {
    babel: {
      presets: ["env"],
      ignore: [/node_modules/, /bower_components/]
    }
  },

  modules: {
    autoRequire: {
      "typing.js": ["src/typing"]
    }
  },

  overrides: {
    production: {
      files: {
        javascripts: {
          joinTo: {
            "typing.min.js": /^src/
          }
        }
      }
    }
  },

  bower: {
    enabled: false
  }
};
