import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createConnector } from 'react-instantsearch-dom';
import Api from '../services/api';
import ImageSearchBox from '../components/image-search-box';

var connectImageSearchBox = createConnector({
  displayName: 'ImageSearchBox',

  propTypes: {
    filter: PropTypes.string
  },

  getProvidedProps: function getProvidedProps(props, searchState) {
    var _ref = searchState.imageSearch || [null, []],
        _ref2 = _slicedToArray(_ref, 2),
        detectedText = _ref2[0],
        detectedLabels = _ref2[1];

    return {
      detectedText: detectedText,
      detectedLabels: detectedLabels
    };
  },
  refine: function refine(props, searchState) {
    var detectedText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var detectedLabels = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    return Object.assign({}, searchState, {
      query: detectedText,
      imageSearch: [detectedText, detectedLabels]
    });
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    var _ref3 = searchState.imageSearch || [null, []],
        _ref4 = _slicedToArray(_ref3, 2),
        detectedText = _ref4[0],
        detectedLabels = _ref4[1];

    return searchParameters.setQuery(detectedText).setQueryParameter('facetFilters', [detectedLabels.map(function (label) {
      return [props.filter, label].join(':');
    })]);
  }
});

var ImageSearchBoxContainer = function (_Component) {
  _inherits(ImageSearchBoxContainer, _Component);

  function ImageSearchBoxContainer() {
    var _ref5,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, ImageSearchBoxContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref5 = ImageSearchBoxContainer.__proto__ || Object.getPrototypeOf(ImageSearchBoxContainer)).call.apply(_ref5, [this].concat(args))), _this), _this.state = { error: null, loading: false, editing: false }, _this.handleImageUploaded = function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(imageBase64) {
        var file, data;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                file = imageBase64.replace(/data:image\/(.+);base64,/, '');


                _this.setState({
                  error: null,
                  imageBase64: null,
                  detectedLabels: null,
                  detectedText: null
                });

                _this.props.refine();

                _context.prev = 3;

                _this.setState({ loading: true, editing: false });

                _context.next = 7;
                return Api.amazon.processFile(file);

              case 7:
                data = _context.sent;


                _this.props.refine(data.text, data.tags);

                _this.setState({
                  imageBase64: imageBase64,
                  detectedLabels: data.details.responses['rekognition.detectLabels'],
                  detectedText: data.details.responses['rekognition.detectText']
                });
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](3);

                _this.setState({ error: _context.t0.message });

              case 15:

                _this.setState({ loading: false });

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[3, 12]]);
      }));

      return function (_x3) {
        return _ref6.apply(this, arguments);
      };
    }(), _this.handleEditClick = function () {
      return _this.setState({ editing: true });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ImageSearchBoxContainer, [{
    key: 'render',
    value: function render() {
      return React.createElement(ImageSearchBox, Object.assign({}, this.props, {
        onUpload: this.handleImageUploaded,
        onEditClick: this.handleEditClick,
        loading: this.state.loading,
        error: this.state.error,
        editing: this.state.editing
        // Refinement data provided by the connector
        , currentRefinement: this.props.detectedText,
        currentLabels: this.props.detectedLabels
        // For debug purpose
        , detectedText: this.state.detectedText,
        detectedLabels: this.state.detectedLabels,
        imageBase64: this.state.imageBase64
      }));
    }
  }]);

  return ImageSearchBoxContainer;
}(Component);

export default connectImageSearchBox(ImageSearchBoxContainer);