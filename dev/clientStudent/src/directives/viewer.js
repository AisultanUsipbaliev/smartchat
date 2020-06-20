import Viewer from 'viewerjs'

function throttle (delay, noTrailing, callback, debounceMode) {
  var timeoutID;
  var cancelled = false; 

  var lastExec = 0; 

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } 

  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  } 

  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback;
    callback = noTrailing;
    noTrailing = undefined;
  }

  function wrapper() {
    var self = this;
    var elapsed = Date.now() - lastExec;
    var args = arguments;

    if (cancelled) {
      return;
    } 

    function exec() {
      lastExec = Date.now();
      callback.apply(self, args);
    }

    function clear() {
      timeoutID = undefined;
    }

    if (debounceMode && !timeoutID) {
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      exec();
    } else if (noTrailing !== true) {
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; 

  return wrapper;
}

function debounce (delay, atBegin, callback) {
  return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
}

const install = (Vue, {name = 'viewer', debug = false}) => {
  function createViewer (el, options) {
    Vue.nextTick(() => {
      destroyViewer(el)
      options.filter = function(image) {
        if (image.hasAttribute('view')) {
          return image.complete;
        }
      }
      el[`$${name}`] = new Viewer(el, options)
      log('viewer created')
    })
  }

  function createObserver (el, options, debouncedCreateViewer) {
    destroyObserver(el)
    const MutationObserver = global.MutationObserver || global.WebKitMutationObserver || global.MozMutationObserver
    if (!MutationObserver) {
      log('observer not supported')
      return
    }
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        log('viewer mutation:' + mutation.type)
        debouncedCreateViewer(el, options)
      })
    })
    const config = { attributes: true, childList: true, characterData: true, subtree: true }
    observer.observe(el, config)
    el['$viewerMutationObserver'] = observer
    log('observer created')
  }

  function createWatcher (el, {expression}, vnode, debouncedCreateViewer) {
    const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/
    if (!expression || !simplePathRE.test(expression)) {
      log('only simple dot-delimited paths can create watcher')
      return
    }
    el['$viewerUnwatch'] = vnode.context.$watch(expression, function (newVal, oldVal) {
      log('change detected by watcher: ', expression)
      debouncedCreateViewer(el, newVal)
    }, {
      deep: true
    })
    log('watcher created, expression: ', expression)
  }

  function destroyViewer (el) {
    if (!el[`$${name}`]) {
      return
    }
    el[`$${name}`].destroy()
    delete el[`$${name}`]
    log('viewer destroyed')
  }

  function destroyObserver (el) {
    if (!el['$viewerMutationObserver']) {
      return
    }
    el['$viewerMutationObserver'].disconnect()
    delete el['$viewerMutationObserver']
    log('observer destroyed')
  }

  function destroyWatcher (el) {
    if (!el['$viewerUnwatch']) {
      return
    }
    el['$viewerUnwatch']()
    delete el['$viewerUnwatch']
    log('watcher destroyed')
  }

  function log () {
    debug && console.log(...arguments)
  }

  Vue.directive('viewer', {
    bind (el, binding, vnode) {
      log('viewer bind')
      const debouncedCreateViewer = debounce(50, createViewer)
      debouncedCreateViewer(el, binding.value)

      createWatcher(el, binding, vnode, debouncedCreateViewer)

      if (!binding.modifiers.static) {
        createObserver(el, binding.value, debouncedCreateViewer)
      }
    },
    unbind (el, binding) {
      log('viewer unbind')
      destroyObserver(el)
      destroyWatcher(el)
    }
  })
}

export default {
  install
}
