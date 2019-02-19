window.customAlgolia = window.customAlgolia || {}

/**
 * Constructor:
 * container: can be a string or a dom node
 * attributes: facets names used to build the widget
 * optionalParameters: check out the docs
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget = function({
  container,
  attributes,
  ...optionalParameters
}) {
  const defaultOptions = {
    limit: 10,
    showMore: true,
    showMoreLimit: 10,
    separator: ' > ',
    rootPath: null,
    showParentLevel: true,
    templates: {},
    cssClasses: {
      returnButton: 'ihm-return-button',
      titleWrapper: 'ihm-title',
      rootTitleWrapper: 'ihm-title ihm-title--centered',
      list: 'ihm-category-list',
      item: 'ihm-category',
      itemActive: 'ihm-category--active',
      showMoreLink: 'ihm-show-all-trigger',
    },
    text: {
      showMore: 'Show more',
      previous: '&lt;',
    },
    transformItems: itemName => itemName,
    showLastLevel: true,
  }

  this.options = {
    ...defaultOptions,
    ...optionalParameters,
    container,
    attributes,
  }
}

/**
 * Returns the necessary subpart of the configuration, specific to this widget.
 * For this widget, it returns the given `attributes` as facets for the next requests.
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget.prototype.getConfiguration = function() {
  return {
    facets: this.options.attributes,
  }
}

/**
 * Attach the event when the "Previous" button is clicked.
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget.prototype.attachPreviousClickEvent = function({
  state,
  helper,
  button,
  currentLevel,
}) {
  button.addEventListener('click', e => {
    helper
      .removeFacetRefinement(this.options.attributes[currentLevel - 1])
      .search()
  })
}

/**
 * Sets up the widget. It is called before the first search.
 * It queries the DOM with the given container argument (if it's a string) and store it as a property of the widget.
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget.prototype.init = function({
  helper,
  state,
}) {
  this.container =
    typeof this.options.container === 'string'
      ? document.querySelector(this.options.container)
      : this.options.container
}

/**
 * Formats the selected facets values.
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget.prototype.getSelectedFacetsValues = function({
  level,
  facetsRefinements,
}) {
  const facetRefinementName = this.options.attributes[level]

  return facetsRefinements[facetRefinementName]
    .map(facetName => this.options.transformItems(facetName))
    .join(', ')
}

/**
 * Returns the "Show more" link.
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget.prototype.getShowAllLink = function() {
  const link = document.createElement('a')
  const container = this.container
  const cssClasses = this.options.cssClasses

  link.innerHTML = this.options.text.showMore
  link.setAttribute('class', this.options.cssClasses.showMoreLink)
  link.addEventListener('click', function(event) {
    container.querySelectorAll(`.${cssClasses.item}`).forEach(facetLink => {
      facetLink.setAttribute(
        'style',
        (facetLink.getAttribute('style') || '').replace('display: none;', '')
      )
    })
    link.setAttribute('style', 'display: none;')
  })

  return link
}

/**
 * Used to create the URL when a facet value is selected.
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget.prototype.getWidgetState = function(
  uiState,
  { searchParameters }
) {
  return {
    ...uiState,
    facetsRefinements: searchParameters.facetsRefinements,
  }
}

/**
 * Used to get the facets from the URL to the ui state of the widget.
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget.prototype.getWidgetSearchParameters = function(
  searchParameters,
  { uiState }
) {
  return {
    ...searchParameters,
    facetsRefinements: uiState.facetsRefinements,
  }
}

/**
 * Generates the breadcrumb from the selected facet values.
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget.prototype.getBreadcrumbTitle = function({
  facetsRefinements,
  level,
}) {
  if (this.options.showParentLevel) {
    return this.options.attributes
      .map(attribute => {
        return facetsRefinements[attribute]
      })
      .filter(facetRefinement => {
        return !!facetRefinement
      })
      .map(facetRefinement => {
        return facetRefinement
          .map(facetRefinement => this.options.transformItems(facetRefinement))
          .join(', ')
      })
      .join(this.options.separator)
  }

  return this.getSelectedFacetsValues({
    level: currentLevel - 1,
    facetsRefinements: state.facetsRefinements,
  })
}

/**
 * Automatically called by instantsearch. Renders the widget.
 */
window.customAlgolia.InteractiveHierarchicalMenuWidget.prototype.render = function({
  results,
  helper,
  state,
}) {
  const currentLevel = Object.keys(state.facetsRefinements).length
  this.container.innerHTML = ''

  if (currentLevel) {
    const prevButton = document.createElement('a')
    prevButton.setAttribute('class', this.options.cssClasses.returnButton)
    prevButton.innerHTML = this.options.text.previous

    this.attachPreviousClickEvent({
      helper,
      state,
      currentLevel,
      button: prevButton,
    })

    const title = document.createElement('span')
    title.innerHTML = this.getBreadcrumbTitle({
      facetsRefinements: state.facetsRefinements,
      level: currentLevel - 1,
    })

    const titleWrapper = document.createElement('div')
    titleWrapper.setAttribute('class', this.options.cssClasses.titleWrapper)

    titleWrapper.appendChild(prevButton)
    titleWrapper.appendChild(title)

    this.container.appendChild(titleWrapper)
  } else {
    const titleWrapper = document.createElement('div')
    titleWrapper.setAttribute('class', this.options.cssClasses.rootTitleWrapper)

    if (this.options.rootPath) {
      titleWrapper.innerHTML = this.options.rootPath
    }

    this.container.appendChild(titleWrapper)
  }

  const list = document.createElement('div')
  list.setAttribute('class', this.options.cssClasses.list)

  const facets = results.facets[currentLevel]

  if (facets) {
    Object.keys(facets.data).forEach((facetName, index) => {
      const link = document.createElement('a')
      const innerHTML = this.options.transformItems(facetName)

      link.setAttribute('class', this.options.cssClasses.item)

      if (index >= this.options.showMoreLimit) {
        link.setAttribute('style', 'display: none;')
      }

      link.innerHTML = `${innerHTML} (${facets.data[facetName]})`
      link.addEventListener('click', event => {
        const facetRefinementName = this.options.attributes[currentLevel]
        helper.addFacetRefinement(facetRefinementName, facetName).search()
      })

      list.appendChild(link)
    })

    this.container.appendChild(list)

    if (
      Object.keys(facets.data).length > this.options.showMoreLimit &&
      !this.facetsAllDisplayed
    ) {
      this.container.appendChild(this.getShowAllLink())
    }
  }
}
