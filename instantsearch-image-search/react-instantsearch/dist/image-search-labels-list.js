var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { createConnector } from 'react-instantsearch-dom';
import ImageSearchLabelsList from '../components/image-search-labels-list';

var connectImageSearchLabels = createConnector({
  displayName: 'ImageSearchLabels',

  getProvidedProps: function getProvidedProps(props, searchState) {
    var detectedLabels = (searchState.imageSearch || [null, []])[1];

    return {
      detectedLabels: detectedLabels
    };
  },
  refine: function refine(props, searchState, items) {
    return Object.assign({}, searchState, {
      imageSearch: [searchState.imageSearch[0], items]
    });
  }
});

var ImageSearchLabelsListContainer = function (_Component) {
  _inherits(ImageSearchLabelsListContainer, _Component);

  function ImageSearchLabelsListContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ImageSearchLabelsListContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ImageSearchLabelsListContainer.__proto__ || Object.getPrototypeOf(ImageSearchLabelsListContainer)).call.apply(_ref, [this].concat(args))), _this), _this.handleToggle = function (itemName) {
      var index = _this.props.detectedLabels.findIndex(function (label) {
        return label === itemName;
      });

      if (index >= 0) {
        var items = [].concat(_toConsumableArray(_this.props.detectedLabels.slice(0, index)), _toConsumableArray(_this.props.detectedLabels.slice(index + 1)));

        _this.props.refine(items);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ImageSearchLabelsListContainer, [{
    key: 'render',
    value: function render() {
      return React.createElement(ImageSearchLabelsList, {
        labels: this.props.detectedLabels,
        onToggleClick: this.handleToggle
      });
    }
  }]);

  return ImageSearchLabelsListContainer;
}(Component);

export default connectImageSearchLabels(ImageSearchLabelsListContainer);