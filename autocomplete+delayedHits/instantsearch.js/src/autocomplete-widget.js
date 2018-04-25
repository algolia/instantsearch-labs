function autocompleteRenderFn(renderParams, isFirstRendering) {
  let {
      container,
    placeholder,
    delayTime,
    nbSuggestions,
    suggestionTemplate,
    suggestionsIndex,
  } = renderParams.widgetParams;
  delayTime = delayTime ? delayTime : 500;
  nbSuggestions = nbSuggestions ? nbSuggestions : 5;

  if (isFirstRendering) {
    let $container = $(container);
    let inputClass = `autocomplete-input-${Date.now()}`;

    // If the autocomplete exists from a previous run of app(), remove it
    if ($container.find('.algolia-autocomplete')) {
      $container.find('.algolia-autocomplete').remove()
    }

    $container.append(
      `<input type="search" class="${inputClass}" id="aa-search-input" placeholder="${placeholder}"/>`
    );


    autocomplete(`.${inputClass}`, {
      hint: false
    }, [{
      source: autocomplete.sources.hits(suggestionsIndex, {
        hitsPerPage: nbSuggestions,
        restrictSearchableAttributes: ['query']
      }),
      displayKey: function (suggestion) {
        return suggestion.query;
      },
      templates: {
        suggestion: suggestionTemplate,
      }
    }])
      .on('autocomplete:selected', function (event, suggestion, dataset) {
        $(`.${inputClass}`).val(suggestion.query);
        renderParams.refine(suggestion.query);
        $("main").removeClass("grayout");
      })
      .on('autocomplete:cursorchanged', function (event, suggestion, dataset) {
        $(`.${inputClass}`).val(suggestion.query);
        renderParams.refine(suggestion.query);
      });

    let debounceTimer = null;
    let lastQueryUpdatedAt = 0;

    // This is the regular instantSearch update of results
    $container.find(`.${inputClass}`).on('input', function (event) {
      $(document).keypress(function (e) {
        if (e.which == 13) {
          $container.find('.aa-dropdown-menu').hide();
          $("main").removeClass("grayout");
        } else {
          if ($('.aa-suggestion').length) {
            $("main").addClass("grayout");
          }
        }
      });

      const now = Date.now();
      if ((now - lastQueryUpdatedAt) < delayTime) {
        clearTimeout(debounceTimer);
      }

      lastQueryUpdatedAt = now;
      debounceTimer = setTimeout(function () {
        renderParams.refine(event.target.value);
      }, delayTime);
      return false;
    });
  }
  // Gray out hits if suggestion dropdown exists
  if ($('.aa-dataset-1').find("span").length) {
    $("main").addClass("grayout");
  }
}
