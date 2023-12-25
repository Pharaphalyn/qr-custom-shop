import { Store as PullStateStore } from 'pullstate';

import { lists, products, homeItems, notifications } from '../mock';

const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  menuOpen: false,
  currentPage: null,
  homeItems,
  lists,
  products
});

export default Store;
