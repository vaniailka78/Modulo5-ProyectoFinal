const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on: any, _config: any) {
      // implement node event listeners here
    },
  },
});
