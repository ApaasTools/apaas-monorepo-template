import XEventOutsideDirective from './x-event-outside'

XEventOutsideDirective.install = function(Vue) {
  Vue.directive('click-outside', XEventOutsideDirective)
}

export default XEventOutsideDirective
