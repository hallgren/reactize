/**
 * Reactize v0.4.2
 */
(function(exports) {
  var Reactize = {};

  var CLASS_NAME_REGEX = /\sclass=/g;
  var INPUT_TAG_WITH_VALUE_REGEX = /\s<input([^>]*)(.*value.*)(>)/g;
  var CLOSING_INPUT_TAG_REGEX = /\s(<input[^>]*)(>)/g;

  Reactize.reactize = function(element) {
    var code = JSXTransformer.transform(
      "/** @jsx React.DOM */" +
      this.htmlToJsx(element.innerHTML)).code;

    return eval(code);
  };

  Reactize.applyDiffOnHTMLString = function(targetElement, htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString
    Reactize.applyDiff(targetElement, div)
  };

  Reactize.applyDiff = function(targetElement, replacementElement) {
    var bod = Reactize.reactize(replacementElement);
    React.render(bod, targetElement);
  };

  Reactize.applyBodyDiff = function() {
    Reactize.applyDiff(document.body, document.body)
  };

  // Converts an HTML string into a JSX-compliant string.
  Reactize.htmlToJsx = function(html) {
    html = html.replace(CLASS_NAME_REGEX, " className=");
    html = html.replace(INPUT_TAG_WITH_VALUE_REGEX, "<ReactInput $1 $2 /$3")
    return html = html.replace(CLOSING_INPUT_TAG_REGEX, "$1 /$2")
  };

  var ReactInput = React.createClass({
    getInitialState: function() {
      this.props.onChange = this.handleChange
      return this.props;
    },

    handleChange: function(event) {
      this.setState({value: event.currentTarget.value});
    },

    render: function() {
      return React.createElement("input", this.state);
    }
  });

  Reactize.version = "0.4.2";

  exports.Reactize = Reactize;
})(window);
