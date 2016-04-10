exports.config = {
  files: {
    javascripts: {
      joinTo: {
        "typing.js": "src/typing.js",
      }
    },
  },

  paths: {
    watched: ["src"],
    public: "dist"
  },

  conventions: {
    ignored: [/^bower_components/],
    vendor: /^(bower_components|node_modules|vendor|src)/
  },

  modules: {
    definition: false
  },

  overrides: {
    production: {
      files: {
        javascripts: {
          joinTo: {
            "typing.min.js": "src/typing.js"
          }
        }
      }
    }
  }

};
