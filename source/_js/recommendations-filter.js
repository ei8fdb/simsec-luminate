const RecommendationsFilter = {
  recommendationList: undefined,
  searchQueries: undefined,
  options: {
    valueNames: [
      'title',
      'theme',
      'insight'
    ]
  },
  createList: () => {
    RecommendationsFilter.recommendationList = new List('recommendations-list', RecommendationsFilter.options);
    RecommendationsFilter.recommendationList.sort('title', { order: 'asc' });
    RecommendationsFilter.setSearchQueryDefaults();
  },
  setSearchQueryDefaults: () => {
    RecommendationsFilter.searchQueries = {
      theme: 'all',
      insight: 'all',
    };
  },
  filterList: searchQueries => {
    const { theme, insight } = searchQueries;

    RecommendationsFilter.recommendationList.filter(item => {
      if (
        item.values().theme.indexOf(theme) !== -1 &&
        item.values().insight.indexOf(insight) !== -1
      ) {
        return true;
      }
    });
  },
  filterByDropdowns: () => {
    const dropdownFilters = document.querySelectorAll('.dropdown');

    Array.prototype.slice.call(dropdownFilters).forEach(filter => {
      filter.addEventListener('change', e => {
        const filterSelection = e.currentTarget.id;
        let selectedOption;

        Array.prototype.slice.call(e.currentTarget.childNodes).forEach(item => {
          if (item.selected === true) {
            selectedOption = item.getAttribute('data-select');
            RecommendationsFilter.searchQueries[filterSelection] = selectedOption;
            console.log(selectedOption)

            selectedOption !== 'all'
              ? document.querySelector('.no-results').style.display = 'block'
              : document.querySelector('.no-results').style.display = 'none';
          }
        });
        RecommendationsFilter.filterList(RecommendationsFilter.searchQueries);
        // RecommendationsFilter.noResultsDiv();
      });
    });
  },
  filterByUrlParams: () => {
    const searchQuery = window.location.search.split('=')[0].slice(1);
    const searchParam = window.location.search.split('=')[1];

    if (searchQuery) {
      const selectOptions = document.querySelector(`#${searchQuery}`).childNodes;

      selectOptions.forEach(option => {
        if (option.getAttribute('data-select') === searchParam) {
          option.selected = true;
        }
      });
    }
    RecommendationsFilter.searchQueries[searchQuery] = searchParam;
    RecommendationsFilter.filterList(RecommendationsFilter.searchQueries);
    RecommendationsFilter.matchSearchQueriesToUI();
    // RecommendationsFilter.noResultsDiv();
  },
  toggleSwitch: () => {
    const switchControl = document.querySelector('.mdc-switch');
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-switch'));

    switchControl.addEventListener('click', () => {
      document.querySelector('.no-results').style.display = 'none';
      switchControl.classList.toggle('mdc-switch--checked');

      if (switchControl.classList.contains('mdc-switch--checked')) {
        document.querySelector('.insight-dropdown').style.display = 'block';
        document.querySelector('.theme-dropdown').style.display = 'none';
      } else {
        document.querySelector('.insight-dropdown').style.display = 'none';
        document.querySelector('.theme-dropdown').style.display = 'block';
      }

      RecommendationsFilter.setSearchQueryDefaults();
      RecommendationsFilter.recommendationList.filter();
      RecommendationsFilter.recommendationList.sort('title', { order: 'asc' });
      document.querySelector('.dropdown').selectedIndex = 0;
    });
  },
  matchSearchQueriesToUI() {
    const dropdown = document.querySelector('.dropdown');
    const selectedIndex = dropdown.options[dropdown.selectedIndex];

    RecommendationsFilter.searchQueries[dropdown.id] = dropdown.options[dropdown.selectedIndex].getAttribute('data-select');

    if (selectedIndex !== -1) {
      dropdown.selectedIndex = selectedIndex;
    }

    RecommendationsFilter.filterList(RecommendationsFilter.searchQueries);
  },
  // noResultsDiv: () => {
  //   const recommendationsCount = document.querySelectorAll('.list__item').length;
  //
  //   recommendationsCount > 0
  //   ? document.querySelector('.no-results').style.display = 'none'
  //   : document.querySelector('.no-results').style.display = 'block';
  // },
  clearAllDropdowns: () => {
    document.querySelector('.clear-all').addEventListener('click', e => {
      e.preventDefault();
      RecommendationsFilter.setSearchQueryDefaults();
      RecommendationsFilter.recommendationList.filter();
      RecommendationsFilter.recommendationList.sort('title', { order: 'asc' });
      // RecommendationsFilter.noResultsDiv();
      document.querySelectorAll('.dropdown').forEach(dropdown => dropdown.selectedIndex = 0);
      document.querySelector('.no-results').style.display = 'none';
    });
  },
  init() {
    const recommendationsPage = document.querySelector('#recommendations');

    if (recommendationsPage) {
      this.createList();
      this.filterByDropdowns();
      this.filterByUrlParams();
      this.clearAllDropdowns();
      this.toggleSwitch();
    }
  }
}

module.exports = RecommendationsFilter;