function SmartCategoriesWidget(settings) {
  let activeHierarchicalCategories;
  let name;
  let helperInstance;
  let derivedHelper;
  let levelCount = 0;
  let latestResults = [];
  let currentFacets = { facets: [] };
  const instanceSettings = Object.assign(
    {},
    {
      entropyValue: 1.7,
      nbCategoriesToDisplay: 3,
      hasDebugControls: false,
    },
    settings
  );
  let currentFacetSpread;

  const categoryImages = {};

  // DEBUG

  function _buildConsoleHashes(count) {
    if (latestResults.exhaustiveNbHits && latestResults.exhaustiveFacetsCount) {
      const percentage = parseInt(count / latestResults.nbHits * 100, 10);
      let string = '';

      for (let i = 0; i < percentage; i++) {
        string = `${string}#`;
      }

      return `${string} ${percentage}%`;
    }
  }

  function _debugConsoleData() {
    console.group();
    console.log('%c Stats', 'color: #3498db');
    console.log(`Current Entropy Level = ${instanceSettings.entropyValue}`);
    console.log(
      `Current level displayed = ${
        currentFacetSpread[0] ? currentFacetSpread[0].currentFacetLevel : 'none'
      }`
    );
    console.groupEnd();

    console.group();
    console.log('%c Top 10 facet values', 'color: #3498db');
    currentFacetSpread.splice(0, 10).forEach(facet => {
      console.log(
        `%c ${_buildConsoleHashes(facet.count)}`,
        'color: #1abc9c',
        `- ${facet.name} (${facet.count})`
      );
    });
    console.groupEnd();
  }

  function _addDebugMode() {
    const debugPabelMarkup = `<div id="debug">
        <h1>Debug</h1>
        <div class="entropy-value">
            <label for="entropy-value-input">Entropy</label>
            <input type="range" min=0 max=4 step="0.1" id="entropy-value-input"/>
            <span id="entropy-value-number"></span>
        </div>
        <div class="categories-to-display">
            <label for="categories-to-display-input">Categories to Show</label>
            <input type="range" min=0 max=6 step="1" id="categories-to-display-input"/>
            <span id="categories-to-display-number"></span>
        </div>
        <div class="display-categories">
          <label>Show Categories</label>
          <label for="show-categories-true">Yes</label>
          <input id="show-categories-true" type="radio" value="true" name="show-categories" />
          <label for="show-categories-false">No</label>
          <input id="show-categories-false" type="radio" value="false" name="show-categories" />
        </div>
      </div>`;

    const debugContainer = document.createElement('div');
    debugContainer.innerHTML = debugPabelMarkup;
    document.getElementsByTagName('body')[0].appendChild(debugContainer);
    _addDebugEvents();
  }

  function _addDebugEvents() {
    const entropyInput = document.getElementById('entropy-value-input');
    const entropyNumber = document.getElementById('entropy-value-number');

    entropyInput.value = instanceSettings.entropyValue;
    entropyNumber.innerHTML = instanceSettings.entropyValue;

    entropyInput.addEventListener('change', event => {
      instanceSettings.entropyValue = event.target.value;
      entropyNumber.innerHTML = instanceSettings.entropyValue;
      _renderWidget();
    });

    const nbCategoryToDisplayInput = document.getElementById(
      'categories-to-display-input'
    );
    const nbCategoryToDisplayNumber = document.getElementById(
      'categories-to-display-number'
    );

    nbCategoryToDisplayInput.value = instanceSettings.nbCategoriesToDisplay;
    nbCategoryToDisplayNumber.innerHTML =
      instanceSettings.nbCategoriesToDisplay;

    nbCategoryToDisplayInput.addEventListener('change', event => {
      instanceSettings.nbCategoriesToDisplay = event.target.value;
      nbCategoryToDisplayNumber.innerHTML =
        instanceSettings.nbCategoriesToDisplay;

      _renderWidget();
    });

    const showCategoriesRadioTrue = document.getElementById(
      'show-categories-true'
    );

    showCategoriesRadioTrue.setAttribute('checked', instanceSettings.isInDebug);

    showCategoriesRadioTrue.addEventListener('change', () => {
      instanceSettings.isInDebug = true;
      _renderWidget();
    });

    const showCategoriesRadioFalse = document.getElementById(
      'show-categories-false'
    );

    showCategoriesRadioFalse.setAttribute(
      'checked',
      !instanceSettings.isInDebug
    );

    showCategoriesRadioFalse.addEventListener('change', () => {
      instanceSettings.isInDebug = false;
      _renderWidget();
    });
  }

  // WIDGET LOGIC

  /**
   * Calculate the entropy coefficent for a set of results.
   * Ranges from 0 to infinity, where 0 is no spread
   * (all categories have the values)
   * @private
   * @param {Array} facets array of facets
   * @param {Number} nbHits total hits returned
   * @return {Number} the entropy coefficient
   */
  function _calculateEntropy(facets, nbHits) {
    return -facets.reduce((acc, facet) => {
      const probabiltyValue = facet.count / nbHits;
      return acc + probabiltyValue * Math.log(probabiltyValue);
    }, 0);
  }

  /**
   * Helper to assert if the result spread of the results is
   * greater than the defined threshold
   * @private
   * @param {Array} facets array of facets
   * @param {Number} nbHits total hits returned
   * @return {Boolean} is the entropy greater than threshold
   */
  function _hasResultSpread(facets, nbHits) {
    return _calculateEntropy(facets, nbHits) > instanceSettings.entropyValue;
  }

  function _filterCategoryForParents(facets, parent) {
    return facets.filter(facet => facet.value.match(parent));
  }

  /**
   * Build an object inculding categories to display and display info
   * @param {Array} facets complete array of facets retrieved
   * @param {Number} nbHits total hits returned
   * @param {String} parent the parent facet level
   * @returns {Object} facet display information
   */
  function _buildTopCategories(facets, nbHits, parent = '') {
    let currentFacetLevel = facets.find(
      facet => facet.name === `${name}${levelCount}`
    );

    const facetValueArray = currentFacetLevel
      ? Object.keys(currentFacetLevel.data).map(key => ({
          name: key,
          count: currentFacetLevel.data[key],
          currentFacetLevel: `${name}${levelCount}`,
          topLevelFacet: `${name}0`,
        }))
      : [];

    if (parent) {
      currentFacetLevel = _filterCategoryForParents(facetValueArray, parent);
    }

    if (_hasResultSpread(facetValueArray, nbHits)) {
      levelCount = 0;

      currentFacetSpread = facetValueArray.slice(0);
      return {
        facets: facetValueArray,
        show: true,
        facetLevel: currentFacetLevel.name,
      };
    } else if (facetValueArray.length) {
      const hightestCountedFacet = facetValueArray.sort(
        (a, b) => b.count - a.count
      )[0];

      levelCount++;

      if (levelCount < 4) {
        return _buildTopCategories(
          facets,
          hightestCountedFacet.count,
          hightestCountedFacet.value
        );
      } else {
        levelCount = 0;

        currentFacetSpread = facetValueArray.slice(0);
        return {
          facets: facetValueArray,
          show: true,
        };
      }
    } else {
      levelCount = 0;

      currentFacetSpread = [];
      return {
        facets: [],
        show: false,
      };
    }
  }

  /**
   * Register events
   * @returns {void}
   */
  function _registerListeners() {
    Array.prototype.forEach.call(
      document.getElementsByClassName('smart-category-link'),
      link => {
        link.addEventListener('click', event => {
          event.preventDefault();
          helperInstance.toggleFacetRefinement(
            event.currentTarget.dataset.topLevelFacet,
            event.currentTarget.dataset.name
          );

          helperInstance.search();
        });
      }
    );
  }

  /**
   * Search algolia once with distinct enabled to get category images.
   * Store these in an object to be used later
   * @returns {void}
   */
  function _getCategoryImages() {
    helperInstance
      .searchOnce({
        facetFilters: '',
        hitsPerPage: 2000,
        distinct: true,
      })
      .then(response => {
        response.content.hits.forEach(hit => {
          hit.categories.forEach(category => {
            categoryImages[category] = hit[instanceSettings.imageAttributePath];
          });
        });

        _renderCategoryLinks(helperInstance);
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Helper function to parse 'category0 > category0.0' into 'category0.0'
   * @param {string} categoryName name including >
   * @returns {string} only the category added
   */
  function _parseCategoryName(categoryName) {
    return categoryName.split(' > ')[categoryName.split(' > ').length - 1];
  }

  /**
   * Add the categories to the dom
   * @returns {void}
   */
  function _renderCategoryLinks() {
    currentFacets.facets.length = instanceSettings.nbCategoriesToDisplay;
    if (currentFacets.show) {
      document.getElementById(
        instanceSettings.containerID
      ).innerHTML = currentFacets.facets
        .map(category => {
          const parsedCategoryName = _parseCategoryName(category.name);
          return `<a
                    href=""
                    data-name="${category.name}"
                    data-top-level-facet=${category.topLevelFacet}
                    class="smart-category-link"
                  >
                    <span class= "smart-category-image"
                          style="background-image: url(
                            '${categoryImages[parsedCategoryName]}'
                          )"
                    >
                    </span>
                    <span class="smart-category-text" />
                      ${parsedCategoryName}&nbsp;(${category.count})
                    </span>
                    ${
                      instanceSettings.isInDebug
                        ? `<span class="smart-category-debug">${
                            currentFacets.facetLevel
                          }</span>`
                        : ''
                    }
                  </a>`;
        })
        .join('');
      _registerListeners(helperInstance);
    } else {
      document.getElementById(instanceSettings.containerID).innerHTML = '';
    }
  }

  /**
   * Calculate entropy of the results and render the catergories that apply
   * @returns {void}
   */
  function _renderWidget() {
    const allHieracicalFacets = latestResults.facets.filter(facet =>
      facet.name.includes(name)
    );

    currentFacets = _buildTopCategories(
      allHieracicalFacets,
      latestResults.nbHits
    );

    _renderCategoryLinks(helperInstance);

    if (settings.hasDebugControls) {
      _debugConsoleData();
    }
  }

  /**
   * Create an instance of the derived helper for this widget to use
   * Need so as not to interfear with other IS widgets using hierarchical facets
   * @returns {void}
   */
  function _createDerivedHelper() {
    derivedHelper = helperInstance.derive(searchParameters => {
      const currentRefinment = searchParameters.getHierarchicalFacetBreadcrumb(
        activeHierarchicalCategories[0]
      );
      const depth = currentRefinment.length;

      let updatedSearchParams = searchParameters.removeHierarchicalFacet(
        activeHierarchicalCategories[0]
      );

      activeHierarchicalCategories.forEach(attribute => {
        updatedSearchParams = updatedSearchParams.addFacet(attribute);
      });

      if (depth > 0) {
        return updatedSearchParams.addFacetRefinement(
          `${name}${depth - 1}`,
          currentRefinment.join(' > ')
        );
      }

      return updatedSearchParams;
    });
  }

  /**
   * Renders the widget on response from the derived helper,
   * rather than on than result for the main helper.
   * @returns {void}
   */
  function _addResultListeners() {
    derivedHelper.on('result', results => {
      latestResults = results;
      _renderWidget();
    });
  }

  return {
    init: ({ helper }) => {
      helperInstance = helper;

      activeHierarchicalCategories = instanceSettings.hierarchicalCategories;
      name = activeHierarchicalCategories[0].substring(
        0,
        activeHierarchicalCategories[0].length - 1
      );
      _createDerivedHelper();
      _getCategoryImages();
      _addResultListeners();

      if (instanceSettings.hasDebugControls) {
        _addDebugMode();
      }
    },
  };
}
