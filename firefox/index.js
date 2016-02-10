var self = require("sdk/self");

// // a dummy function, to show how tests work.
// // to see how to test this function, look at test/test-index.js
// function dummy(text, callback) {
//   callback(text);
// }
//
// exports.dummy = dummy;

var domainPartFrom = function (any_hostname) { // http://stackoverflow.com/a/16451961/2586790 ("pretty accurate") // v1.1 https://publicsuffix.org/list/effective_tld_names.dat for list of TLDs.
var parts = any_hostname.split('.').reverse();
var cnt = parts.length;
if (cnt >= 3) {
  // see if the second level domain is a common SLD.
  if (parts[1].match(/^(com|edu|gov|net|mil|org|nom|co|name|info|biz)$/i)) {
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }
}
return parts[1]+'.'+parts[0];
}

var ss = require("sdk/simple-storage");

var contextMenu = require("sdk/context-menu");
contextMenu.Item({
  label: "Edit",
  context: contextMenu.PageContext(),
  contentScriptFile: "./script.js",
  onMessage: function (message) {
    switch (message.type) {
      case "currentHTML":
        if (!ss.storage[message.nodeBaseURI]) {
          ss.storage[message.nodeBaseURI] = message.currentHTML;
        }
        break;
      case "email":
        var tabs = require("sdk/tabs");
        tabs.open(
          encodeURI(
          "mailto:Webmaster@" + domainPartFrom(message.pageURLHostname) +
          "?subject=" + message.nodeBaseURI +
          "&body="
           + message.nodeBaseURI // http://
           + "\n\n"
           + ss.storage[message.nodeBaseURI] // ? it
           + "\n\n"
           + message.editedHTML // ? It
          //  + "\n\n"
          //  + "Edit: http://mozilla.org/"
          )
        );
        break;
      default:
        console.error("no case for message.type");
    }
  }
});
