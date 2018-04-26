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
      })
      .on('autocomplete:cursorchanged', function (event, suggestion, dataset) {
        $(`.${inputClass}`).val(suggestion.query);
        renderParams.refine(suggestion.query);
      });

    // This controls the updating of the results behind the autocomplete
    $container.find(`.${inputClass}`).on('input', function (event) {

      // Hide the autocomplete if enter is pressed
      $(document).keypress(function (e) {
        if (e.which == 13) {
          $container.find('.aa-dropdown-menu').hide();
        }
      });

      let debounceTimer = null;
      let lastQueryUpdatedAt = 0;
      const now = Date.now();

      // If the time elapsed since the last keystroke is less than the ordained delay time, reset the timer
      if ((now - lastQueryUpdatedAt) < delayTime) {
        clearTimeout(debounceTimer);
      }

      // Set the time the last query was update to the current time
      lastQueryUpdatedAt = now;

      // Make the results in the background update for the given delay time
      debounceTimer = setTimeout(function () {
        renderParams.refine(event.target.value);
      }, delayTime);
      return false;
    });
  }
}
