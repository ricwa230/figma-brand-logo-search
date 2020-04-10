var appTag = {
  'css': null,

  'exports': {
    users: [
      { name: 'Gian', id: 0 },
      { name: 'Dan', id: 1 },
      { name: 'Teo', id: 2 }
    ],

    onMounted() {
      this.update({
        result: []
      });
    },

    search(e) {
      let val = e.target.value;
      if (val !== '') {
        let req = new XMLHttpRequest();
        req.open("GET", `https://autocomplete.clearbit.com/v1/companies/suggest?query=${val}`, true);
        // req.responseType = "text";

        req.onload = (ev) => {
          let text = req.responseText; // Note: not req.responseText
          let json = JSON.parse(text);
          this.update({
            result: json
          });
        };

        req.send(null);
      } else {
        this.update({
          result: []
        });
      }
    },

    generate() {
      let domain = this.$('#domain').value;
      // debugger
      if (domain !== '') {
        let req = new XMLHttpRequest();
        req.open("GET", `https://logo.clearbit.com/${domain}`, true);
        req.responseType = "arraybuffer";

        req.onload = function (oEvent) {
          let arrayBuffer = req.response; // Note: not req.responseText
          if (arrayBuffer) {
            let imageArray = new Uint8Array(arrayBuffer);
            parent.postMessage({ pluginMessage: { type: 'create-logo', imageArray } }, '*');
          }
        };

        req.send(null);
      }
    },

    cancel() {
      parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<h2>Logo Creator</h2><p>Enter domain 11: <input expr0="expr0" id="domain" placeholder="example.com"/></p><ul><li expr1="expr1"></li></ul><button expr2="expr2" class="small primary" id="generate">Generate</button><button class="small" id="cancel">Cancel</button>',
      [{
        'redundantAttribute': 'expr0',
        'selector': '[expr0]',

        'expressions': [{
          'type': expressionTypes.EVENT,
          'name': 'onkeyup',

          'evaluate': function(scope) {
            return scope.search;
          }
        }]
      }, {
        'type': bindingTypes.EACH,

        'getKey': function(scope) {
          return scope.r.domain;
        },

        'condition': null,

        'template': template(' ', [{
          'expressions': [{
            'type': expressionTypes.TEXT,
            'childNodeIndex': 0,

            'evaluate': function(scope) {
              return scope.r.name;
            }
          }]
        }]),

        'redundantAttribute': 'expr1',
        'selector': '[expr1]',
        'itemName': 'r',
        'indexName': null,

        'evaluate': function(scope) {
          return scope.state.result;
        }
      }, {
        'redundantAttribute': 'expr2',
        'selector': '[expr2]',

        'expressions': [{
          'type': expressionTypes.EVENT,
          'name': 'onclick',

          'evaluate': function(scope) {
            return scope.generate;
          }
        }]
      }]
    );
  },

  'name': 'app-tag'
};

export default appTag;
