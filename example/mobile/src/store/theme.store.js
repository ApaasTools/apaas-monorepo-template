import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'

export const SET_MODAL_OFFSET_TOP = 'SET_MODAL_OFFSET_TOP'
export const SET_CURRENT_THEME_COLOR = 'SET_CURRENT_THEME_COLOR'
export const SET_DEFAULT_THEME_COLOR = 'SET_DEFAULT_THEME_COLOR'
export const SET_ROLE_LIST = 'SET_ROLE_LIST'

// 动态切换主题色
function changeThemeColor(newColor) {
  const options = {
    newColors: [...forElementUI.getElementUISeries(newColor)],
    changeUrl(cssUrl) {
      return `/xdap-h5/${cssUrl}` // while router is not `hash` mode, it needs absolute path
    }
  }
  return client.changer.changeColor(options, Promise).then((t) => {
    console.log(t)
  })
}

export const themeStore = {
  namespaced: true,
  state: {
    theme: {
      appThemeColor: {
        org: '#027AFF'
      },
      defaultThemeColor: {
        app: 'org',
        color: '#027AFF'
      },
      currentThemeColor: {
        app: 'org',
        color: '#027AFF'
      }
    },
    roleList: []
  },
  mutations: {
    [SET_CURRENT_THEME_COLOR](state, appTheme) {
      if (
        state.theme.currentThemeColor.app === appTheme.app &&
        state.theme.currentThemeColor.color === appTheme.color &&
        !appTheme.forceUpdate
      ) {
        return
      }
      state.theme.currentThemeColor = appTheme
      state.theme.appThemeColor[appTheme.app] = appTheme.color
      changeThemeColor(appTheme.color)
    },

    [SET_DEFAULT_THEME_COLOR](state) {
      this.commit('themeModule/SET_CURRENT_THEME_COLOR', state.theme.defaultThemeColor)
    },

    [SET_ROLE_LIST](state, value) {
      state.roleList = value.roleList
    }
  },
  actions: {},
  getters: {}
}
