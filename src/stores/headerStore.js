import { types } from "mobx-state-tree"

const HeaderStore = types.model("HeaderStore", {
  current: types.number,
  title: '' //在导航栏显示当前页标题，用于app
}, {
  setCurrent(index) {
    this.current = index
  },
  setPageTitle(title) { //设置标题
    this.title = title;
  }
})

export default HeaderStore