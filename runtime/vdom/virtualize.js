var HTMLElement = require('./HTMLElement');
var DocumentFragment = require('./DocumentFragment');
var Comment = require('./Comment');
var Text = require('./Text');

function virtualizeChildNodes(node, vdomParent) {
    var curChild = node.firstChild;
    while(curChild) {
        vdomParent.appendChild(virtualize(curChild));
        curChild = curChild.nextSibling;
    }
}

function virtualize(node) {
    if (node.nodeType === 1) { // HtmlElement node
        var attributes = node.attributes;
        var attrCount = attributes.length;

        var childNodes = node.childNodes;
        var childCount = childNodes.length;

        var attrs;

        if (attrCount) {
            attrs = {};

            for (var i=0; i<attrCount; i++) {
                var attr = attributes[i];
                var attrName;

                if (attr.namespaceURI === 'http://www.w3.org/1999/xlink' && attr.localName === 'href') {
                    attrName = 'xlink:href';
                } else {
                    attrName = attr.name;
                }

                attrs[attrName] = attr.value;
            }
        }

        var vdomEL = new HTMLElement(node.nodeName, attrs, childCount);

        if (vdomEL._isTextArea) {
            vdomEL.value = node.value;
        } else {
            virtualizeChildNodes(node, vdomEL);
        }

        return vdomEL;
    } else if (node.nodeType === 3) { // Text node
        return new Text(node.nodeValue);
    } else if (node.nodeType === 8) { // Text node
        return new Comment(node.nodeValue);
    } else if (node.nodeType === 11) { // DocumentFragment node
        var vdomDocFragment = new DocumentFragment();
        virtualizeChildNodes(node, vdomDocFragment);
    }
}

module.exports = virtualize;