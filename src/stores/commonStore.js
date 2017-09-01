import { types } from "mobx-state-tree"

export const Userinfo = types.model('Userinfo', {
  username: types.string
}, {
  setUsername(username) {
    this.username = username
  }
})

export const CommonStore = types.model("CommonStore", {
  userinfo: Userinfo
});

export const Category = types.model("Category", {
  value: '0',
  label: ''
});

export const Brand = types.model("Category", {
  value: '0',
  label: ''
});