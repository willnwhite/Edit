self.on('click', function (node) {
  var currentNodeInnerHTML = node.innerHTML;
  self.postMessage({
    type: "currentHTML",
    currentHTML: currentNodeInnerHTML,
    nodeBaseURI: node.baseURI
  });
  var parentNode = node.parentNode;

  var textarea = document.createElement("textarea");
  textarea.value = node.innerHTML;
  textarea.onkeypress = function (event) {
    switch (event.keyCode) {
      case 13: // enter
        self.postMessage({
          type: "email",
          editedHTML: textarea.value,
          nodeBaseURI: node.baseURI,
          pageURLHostname: location.hostname
        });

        node.innerHTML = textarea.value;
        parentNode.replaceChild(node, textarea);
        break;
      case 27: // escape
        parentNode.replaceChild(node, textarea);
        break;
      // default?
    }
  };

  // make textarea look the same as the node
  ["height", "width", "background-color", "color", "line-height", "font-family"] // set by preferences
  .forEach(function (property) {
    textarea.style[property] = getComputedStyle(node).getPropertyValue(property);
  });

  textarea.style["border-style"] = "none";

  // change element into textarea element
  parentNode.replaceChild(textarea, node);
  textarea.focus();
});
