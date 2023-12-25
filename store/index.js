import { Store as PullStateStore } from 'pullstate';

import { lists, homeItems, notifications } from '../mock';

const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  menuOpen: false,
  currentPage: null,
  homeItems,
  lists
});

export default Store;
