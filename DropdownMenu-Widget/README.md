## DropdownMenu Widget for [React InstantSearch](https://github.com/algolia/react-instantsearch)

### About
This is a Dropdown Menu for [Algolia's](https://www.algolia.com) React InstantSearch Library. It's meant to display facets horizontally for better responsive use-cases on mobile and allows more flexible UX patterns for your UI.

### Run locally
- clone repo
- ``` cd DropdownMenu-Widget && yarn ```
- ``` yarn start ```
### V.0 Spec
- Horizontal display of each desirable facet value
- click/hover menu that shows each facet value's title and number of results
- Display the number of active facet values per facet attribute
- Mobile responsive
- Horizontal scroll for mobile

### Props
Name | Type | |
--- | --- | --- 
**attributes*** | ```array of strings```
the name of the attribute in record |
**hoverable** | ```boolean``` | default: ```true```
when ```false```, dropdown menu requires a click to expand |
**limit** | ```number``` | default: ```20```
the max number of displayed items |

### Demo
![Wireframe](https://dha4w82d62smt.cloudfront.net/items/100j1l2H2u3O3W030n0m/Screen%20Recording%202018-04-09%20at%2010.18%20AM.gif?X-CloudApp-Visitor-Id=2990833&v=dfa6b6ff)

### Styling

`.dropdown-facet-container` is the wrapper for the each menu item. If you want to style or position the entire Dropdown Menu, use that. For styling each menu item, use `.ais-DropdownMenu-container` and `.ais-DropdownMenu-List` for the expanded list.