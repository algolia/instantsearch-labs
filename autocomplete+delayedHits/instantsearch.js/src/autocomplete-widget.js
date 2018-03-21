function autocompleteRenderFn(renderParams, isFirstRendering) {
  let {
      container,
    placeholder,
    delayTime,
    nbSuggestions,
    suggestionTemplate,
    suggestionsIndex,
    // searchInstance
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
      // source: function(query, callback) {
      //   suggestionsIndex.search(query, { hitsPerPage: nbSuggestions + 1 })
      //   .then(function(answer) {
      //     // removes the current query from the suggested list
      //     answer.hits = _.filter(answer.hits, function(hit){ return hit.query !== query.trim(); });
      //     callback(answer.hits.slice(0, nbSuggestions));
      //   }, function() {
      //     callback([]);
      //   });
      // },
      displayKey: function (suggestion) {
        return suggestion.query;
      },
      templates: {
        suggestion: suggestionTemplate,
        // empty: function({ query, isEmpty }, hits){
        //   console.log("query", query);
        //   console.log("isEmpty", isEmpty);
        //   console.log('EMPTY!', hits)
        // }
      }
    }])
      .on('autocomplete:selected', function (event, suggestion, dataset) {
        $(`.${inputClass}`).val(suggestion.query);
        renderParams.refine(suggestion.query);
        $("main").removeClass("grayout");
        // searchInstance.helper.setQuery(suggestion.query.trim()).search();
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

      // if ($('.aa-suggestion').length) {
      //   $("main").addClass("grayout");
      // } else {
      //   $("main").removeClass("grayout");
      // }

      const now = Date.now();

      if ((now - lastQueryUpdatedAt) < delayTime) {
        console.log("Clearing timeout");
        clearTimeout(debounceTimer);
      }

      lastQueryUpdatedAt = now;
      debounceTimer = setTimeout(function () {
        renderParams.refine(event.target.value);
      }, delayTime);
      console.log("Setting timeout", debounceTimer);
      return false;
    });
  }
  // Gray out hits if suggestion dropdown exists
  if ($('.aa-dataset-1').find("span").length) {
    $("main").addClass("grayout");
  }
}
