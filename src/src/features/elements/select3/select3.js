import {inject, customElement, bindable, bindingMode} from 'aurelia-framework';
import {Tokenizers} from './tokenizers'
import {Datum} from './datum'
import {KEYS} from './keys'

@customElement('select3')
@inject(Element)

// todo: close dropdown on click outside
// todo: max-height in dialog
export class Select3 {
  @bindable items = [];
  @bindable({defaultBindingMode: bindingMode.twoWay}) value = null;
  @bindable disabled = false;
  @bindable options = {};
  @bindable caption = 'Изберете';
  @bindable noResultsMessage = 'Няма намерени резултати';

  @bindable searchedItem = '';
  @bindable filteredData = [];
  isDropdownOpen = false;
  selectedItemName = '';
  hoveredDatum = null;

  opts = {
    id: 'id',
    name: 'name',
    modelValueBind: false,
    sort: false,
    sortField: '',
    disableClear: false
  };

  constructor(element) {
    this.element = element;
  }

  bind() {
    this.opts = Object.assign(this.opts, this.options);
    this.search(this.searchedItem);
  }

  valueChanged() {
    let selectedDatum = this.filteredData.find(datum => {
      let itemValue = this.opts.modelValueBind ? datum.item : datum.item[this.opts.id];
      return itemValue === this.value;
    });

    if (selectedDatum) {
      this.selectedItemName = selectedDatum.item[this.opts.name];
    } else {
      this.selectedItemName = null;
    }
  }

  itemsChanged() {
    this.search(this.searchedItem);
  }

  filteredDataChanged() {
    this.valueChanged();
  }

  searchedItemChanged() {
    this.search(this.searchedItem);
  }

  clearValue() {
    if (!this.opts.disableClear) {
      this.value = null;
    }
  }

  openDropdown() {
    this.isDropdownOpen = true;

    // todo: fix this!!!
    // focus on search box when opened
    setTimeout(()=> {
      this.reorientDropdownIfNeeded();

      let searchInput = this.element.getElementsByClassName('select3-search-box')[0];
      searchInput.focus();
    }, 0);

  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    if (!this.disabled) {
      if (this.isDropdownOpen) {
        this.closeDropdown()
      } else {
        this.openDropdown();
      }
    }
  }

  onValueInputFocus(e) {
    if (!this.value) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  selectItem(datum) {
    this.value = this.opts.modelValueBind ? datum.item : datum.item[this.opts.id];
    this.closeDropdown();
  }

  onValueInputKeyPressed(event) {
    event = window.event ? window.event : event;
    let keyCode = event.keyCode ? event.keyCode : event.which;
    switch (keyCode) {
      case KEYS.ENTER:
        this.openDropdown();
        break;
      default:
        // bubble up
        return true;
    }
  }

  onSearchInputKeyPressed(event) {
    event = window.event ? window.event : event;
    let keyCode = event.keyCode ? event.keyCode : event.which;
    switch (keyCode) {
      case KEYS.UP:
        this.moveSelectionUp();
        break;
      case KEYS.DOWN:
        this.moveSelectionDown();
        break;
      case KEYS.ENTER:
        this.selectHoveredItem();
        break;
      case KEYS.ESC:
        this.closeDropdown();
        break;
      default:
        // bubble up
        return true;
    }
  }

  moveSelectionUp() {
    if (this.filteredData.length === 0) {
      return;
    }

    let hoveredIndex = this.filteredData.indexOf(this.hoveredDatum);
    if (hoveredIndex === -1) {
      // nothing is hovered -> hover last
      this.hoveredDatum = this.filteredData[this.filteredData.length - 1];
    } else if (hoveredIndex === 0) {
      // first is hovered -> hover last
      this.hoveredDatum = this.filteredData[this.filteredData.length - 1];

      // todo: fix this!!!
      setTimeout(()=> {
        this.scrollHoveredLiIntoView(false);
      }, 0);
      return;
    } else {
      // hover previous
      this.hoveredDatum = this.filteredData[hoveredIndex - 1];
    }

    this.scrollHoveredLiIntoView(false);
  }

  moveSelectionDown() {
    if (this.filteredData.length === 0) {
      return;
    }

    let hoveredIndex = this.filteredData.indexOf(this.hoveredDatum);
    if (hoveredIndex === -1) {
      // nothing is hovered -> hover first
      this.hoveredDatum = this.filteredData[0];
    } else if (hoveredIndex === this.filteredData.length - 1) {
      // last is hovered -> hover first
      this.hoveredDatum = this.filteredData[0];

      // todo: fix this!!!
      setTimeout(()=> {
        this.scrollHoveredLiIntoView(true);
      }, 0);
      return;
    } else {
      // hover next
      this.hoveredDatum = this.filteredData[hoveredIndex + 1];
    }

    this.scrollHoveredLiIntoView(true);
  }

  scrollHoveredLiIntoView(scrollToTop) {
    let datumLis = this.element.getElementsByClassName('hovered');
    if (datumLis.length > 0) {
      datumLis[0].scrollIntoView(scrollToTop);
    }
  }

  selectHoveredItem() {
    this.selectItem(this.hoveredDatum);
  }

  setHover(datum) {
    this.hoveredDatum = datum;
  }

  reorientDropdownIfNeeded() {
    let dropdown = this.element.getElementsByClassName('select3-dropdown')[0];
    let currentBottomStyle = dropdown.style.bottom;
    let rect = dropdown.getBoundingClientRect();
    if (currentBottomStyle == 'auto' || !currentBottomStyle) {
      let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      let enoughRoomBelow = viewportHeight >= dropdown.clientHeight + rect.top;
      if (!enoughRoomBelow) {
        dropdown.style.bottom = '25px';
      }
    } else {
      let enoughRoomAbove = rect.bottom - dropdown.clientHeight >= 0;
      if (!enoughRoomAbove) {
        dropdown.style.bottom = 'auto';
      }
    }
  }

  search(query) {
    if(this.items === undefined) {
      this.filteredData = [];
      return;
    }

    // get only non-empty tokens
    let queryTokens = this._queryTokenizer(query).filter(qt => qt.value.length > 0);
    // group tokens by value -> to know how many matches of each token we need
    let queryTokensGroupedByValue = this._getTokensGroupedByValue(queryTokens);

    // map every item to Datum object
    let data = this.items.map(item => new Datum(item, this.opts, queryTokens));

    // filter only datums that match query
    let filteredData = data.filter(datum => {
      //get query tokens that match
      let matchingQueryTokens = datum.queryTokensMatches
        .filter(queryTokenIndex => queryTokenIndex > -1)
        .map(queryTokenIndex => queryTokens[queryTokenIndex]);
      // group query tokens (in case we have matched a token more than once)
      let matchingQueryTokensGroupedByValue = this._getTokensGroupedByValue(matchingQueryTokens);
      let isMatchingQuery = queryTokensGroupedByValue.every(queryTokenGroup => {
        // find token that corresponds to current query token
        let matchingQueryTokenGroup = matchingQueryTokensGroupedByValue.find(x => x.value === queryTokenGroup.value);
        // evaluate if we have more matches than needed for current query token
        return matchingQueryTokenGroup && (matchingQueryTokenGroup.indexes.length >= queryTokenGroup.indexes.length);
      });
      return isMatchingQuery;
    });

    // sort datums by matching query
    filteredData.sort(this._sortData.bind(this));

    this.filteredData = filteredData;
    // hover first datum
    this.hoveredDatum = this.filteredData.length > 0 ? this.filteredData[0] : null;

    // todo: fix this!!! 
    setTimeout(() => {
      this.scrollHoveredLiIntoView(true);
    }, 0);

  }

  _queryTokenizer(query) {
    return Tokenizers.nonword(query);
  }

  _getTokensGroupedByValue(tokensArray) {
    let uniqueTokens = this._arrayUniqueByField(tokensArray, 'value');
    let tokensGroupedByValue = uniqueTokens.map(uniqueToken => {
      let tokensWithSameValue = tokensArray.filter(token => token.value === uniqueToken.value);
      let indexesOfTokensWithSameValue = tokensWithSameValue.map(token => tokensArray.indexOf(token));
      return {
        indexes: indexesOfTokensWithSameValue,
        value: uniqueToken.value
      }
    });

    return tokensGroupedByValue;
  }

  _sortData(a, b) {
    //firstly compare by query matching
    let result = Datum.compare(a, b);
    if (result !== 0) {
      return result;
    }

    //secondly compare traditional if requested
    if (this.opts.sort) {
      let sortField = this.opts.sortField || this.opts.name;
      if (a.item[sortField] > b.item[sortField]) {
        return 1;
      }
      if (a.item[sortField] < b.item[sortField]) {
        return -1;
      }

      return 0;
    }

    return 0;
  }

  _arrayUniqueByField(a, field) {
    return a.reduce(function (p, c) {
      if (p.every(x => x[field] !== c[field])) p.push(c);
      return p;
    }, []);
  }
}
