import { types, getParent, onSnapshot } from "mobx-state-tree"
import { addClass, removeClass } from '../web/misc/util.js'
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../utils/notification';

const MenuItem = types.model("MenuItem", {
  get topMenuData() {
    return getParent(getParent(getParent(getParent(this))));
  },
  get topMenuIndex() {
    return getParent(this.topMenuData).indexOf(this.topMenuData);
  },
  type: types.string,
  link: types.optional(types.string, ''),
  index: types.string,
  name: types.string,
  expanded: types.optional(types.boolean, false),
  children: types.optional(types.union(types.array(types.late(() => MenuItem)), types.literal(null)), []),
  level: types.maybe(types.number)
}, {
  afterCreate() {
    if (this.level === 3) {
      const siderStore = getParent(getParent(this.topMenuData));
      if (!siderStore.mapLevel3) {
        siderStore.mapLevel3 = {}; //创建三级菜单map以便于查找
      }
      siderStore.mapLevel3[this.link.toLowerCase()] = this;
    }
  },
  setExpanded(isExpanded) {
    this.expanded = isExpanded
  }
})

const SiderStore = types.model("SiderStore", {
  get root() {
    return getParent(this);
  },
  get currentMenuData() {
    return this.menuData.length ? this.menuData[this.root.header.current].children : [];
  },
  get splitAccountMenus() {
    if(!this.menuData.length) {
      return null;
    }

    const ret = { others: [] };
    this.menuData.forEach((menu, i) => {
      if(menu.name === '账号管理') {
        ret.account = { 
          menu,
          index: i
        };
      }
      else {
        ret.others.push({ 
          menu,
          index: i
        });
      }
    });

    return ret;
  },
  isOpen: types.boolean,
  current: types.string,
  menuData: types.optional(types.array(MenuItem), [])
}, {
  setMenu(isOpen) {
    this.isOpen = isOpen
  },
  setCurrent(index) {
    this.current = index
  },
  setMenuData(menuData) {
    this.menuData = menuData
  },
  setMenuDataByIndex(isExpanded, index) {
    this.currentMenuData.forEach(function(item) {
      item.setExpanded(false);
    })
    this.currentMenuData.find((item) => item.index == index).setExpanded(isExpanded);
  },

  getMenuTreeData(authList, level = 1, node) {
    if(level == 4) {
      return null;
    }

    return authList
      .filter(n => n.level == level && (!node ? true : n.pid == node.id + ''))
      .map(n => {
        return {
          type: n.level <= 2 ? 'group' : 'item',
          level: n.level,
          link: n.url,
          index: n.level <= 2 ? n.name : n.url.substr(1),
          name: n.name,
          expanded: false,
          children: this.getMenuTreeData(authList, level + 1, n)
        };
      });
  },

  getCurrentUserMenuTree() {
    return fetchData(`${__HOST}/privilegeManagement/getCurrentUserMenuTree`,
      this.setCurrentUserMenuTree,
      null, { method: 'get' }).catch((ex) => {
      Notification.error({
        description: '获取菜单权限数据异常:' + ex,
        duration: null
      });
    });
  },
  setCurrentUserMenuTree(result) {
    if (result.success) {
      this.menuData = this.getMenuTreeData(result.data);
    } else {
      Notification.error({
        description: '获取菜单权限数据错误:' + result.message,
        duration: null
      });
    }
  },
})

// onSnapshot(siderStore, (snapshot) => {
//   if (snapshot.isOpen) {
//     addClass(document.querySelector('#page-wrap'), 'isMenuOpen')
//     addClass(document.querySelector('.site-header'), 'isMenuOpen')
//   } else {
//     removeClass(document.querySelector('#page-wrap'), 'isMenuOpen')
//     removeClass(document.querySelector('.site-header'), 'isMenuOpen')
//   }
// })

export default SiderStore;