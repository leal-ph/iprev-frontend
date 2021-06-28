let is_safari = navigator.userAgent.indexOf('Safari') > -1
const is_chrome = navigator.userAgent.indexOf('Chrome') > -1
if (is_chrome && is_safari) {
  is_safari = false
}
if (is_safari) {
  if (!document.cookie.match(/^(.*;)?\s*fixed\s*=\s*[^;]+(.*)?$/)) {
    document.cookie = 'fixed=fixed; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/'
    let url = document.URL
    const str = window.location.search
    const param = str.replace('?', '')
    if (url.indexOf('?') > -1) {
      url = url.substr(0, url.indexOf('?'))
    }
    window.location.replace(
      'https://secure.d4sign.com.br/embed/safari_fix?r=' + url + '&param=' + param,
    )
  }
}
(function () {
  let HEIGHT
  let HOST
  let PROTOCOL
  let TIMEOUT
  let WIDTH
  let addEventListener
  let attach_element
  let configure
  let createElement
  let create_iframe
  let getElementById
  let host_for
  let origin
  let path_for
  let protocol_for
  let query_for
  let timeout_for
  let window
  PROTOCOL = 'https'

  HOST = 'secure.d4sign.com.br/embed/viewblob'

  WIDTH = {
    MIN: 600,
    DEFAULT: 800,
  }

  HEIGHT = {
    MIN: 500,
    DEFAULT: 600,
  }

  TIMEOUT = 120000

  window = this

  getElementById = function (name) {
    return document.getElementById(name)
  }

  createElement = function (element) {
    return document.createElement(element)
  }

  addEventListener = function (callback) {
    if (window.addEventListener) {
      return window.addEventListener('message', callback)
    } else {
      return window.attachEvent('onmessage', callback)
    }
  }

  origin = location.origin || location.protocol + '//' + location.host

  protocol_for = function (protocol) {
    return (protocol || PROTOCOL) + '://'
  }

  host_for = function (host) {
    return host || HOST
  }

  timeout_for = function (timeout) {
    return timeout || TIMEOUT
  }

  path_for = function (key) {
    return '/' + key
  }

  query_for = function (signer) {
    let k
    let options
    let v
    if (signer == null) {
      signer = {}
    }
    options = {
      origin: origin,
    }
    for (k in signer) {
      v = signer[k]
      options[k] = v
    }
    return (
      '?' +
      (function () {
        let results
        results = []
        for (k in options) {
          v = options[k]
          results.push(k + '=' + encodeURIComponent(v))
        }
        return results
      })().join('&')
    )
  }

  create_iframe = function (source, width, height) {
    let iframe
    let min
    let normalize
    let normalize_height
    let normalize_width
    min = function (m) {
      return function (v) {
        if (v < m) {
          return m
        } else {
          return v
        }
      }
    }
    normalize = function (m, d) {
      return function (v) {
        return min(m)(v || d)
      }
    }
    normalize_width = normalize(WIDTH.MIN, WIDTH.DEFAULT)
    normalize_height = normalize(HEIGHT.MIN, HEIGHT.DEFAULT)
    iframe = createElement('iframe')
    iframe.setAttribute('src', source)
    iframe.setAttribute('width', normalize_width(width))
    iframe.setAttribute('height', normalize_height(height))
    iframe.setAttribute('style', 'border: 0px;')
    iframe.setAttribute('allow', 'geolocation')
    return iframe
  }

  attach_element = function (container, element) {
    let target
    target = getElementById(container)
    return target.appendChild(element)
  }

  configure = function (options) {
    let cancel_timeout
    let check_timeout
    let host
    let iframe
    let path
    let protocol
    let query
    let source
    let timeout
    let trigger_timeout
    protocol = protocol_for(options.protocol)
    host = host_for(options.host)
    timeout = timeout_for(options.timeout)
    path = path_for(options.key)
    query = query_for(options.signer)
    source = protocol + host + path + query
    iframe = create_iframe(source, options.width, options.height)
    attach_element(options.container, iframe)
    addEventListener(options.callback || function () {})
    trigger_timeout = function () {
      return window.postMessage('timeout', origin)
    }
    check_timeout = setTimeout(trigger_timeout, timeout)
    cancel_timeout = function () {
      return clearTimeout(check_timeout)
    }
    return addEventListener(cancel_timeout)
  }

  this.d4sign ||
    (this.d4sign = {
      configure: configure,
      version: '1.0',
    })
}.call(this))
