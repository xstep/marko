var template = require("marko/html").c(__filename);

module.exports = template;

var marko_helpers = require("marko/runtime/html/helpers"),
    marko_classAttr = marko_helpers.ca,
    marko_attr = marko_helpers.a,
    marko_escapeXmlAttr = marko_helpers.xa,
    marko_str = marko_helpers.s;

function render(data, out) {
  out.w("<div" +
    marko_classAttr(data.className) +
    marko_attr("class2", data.className, false) +
    " foo=\"a" +
    marko_escapeXmlAttr(data.foo) +
    "b\" bar=\"a " +
    marko_escapeXmlAttr(data.foo) +
    " b\" baz=\"a " +
    marko_str(data.foo) +
    " b\" nested=\"a " +
    marko_str(data.foo + ("nested " + data.bar)) +
    " b\"></div>");
}

template._ = render;
