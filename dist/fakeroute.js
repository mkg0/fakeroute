'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fakeRoute = function fakeRoute() {};
fakeRoute.options = {
    selector: 'a',
    target: 'body',
    equalStyle: [],
    equalContent: [],
    enableSrcScripts: true, //add "data-fakeroute-script" attr to script tag
    enableInlineScripts: true, //add "data-fakeroute-script" attr to script tag
    enableStyleSheets: true,
    enableInlineStyles: true
};

fakeRoute.onLoading = null;
fakeRoute.onLoad = null; //onload
fakeRoute.onUnload = null;
fakeRoute.onError = null;

fakeRoute.state = {
    _wait: false,
    _callback: null,
    _callbackParam: null,
    wait: function wait() {
        fakeRoute.state._wait = true;
    },
    resolve: function resolve() {
        var _fakeRoute$state$_cal;

        if (fakeRoute.state._callback) (_fakeRoute$state$_cal = fakeRoute.state._callback).call.apply(_fakeRoute$state$_cal, _toConsumableArray(fakeRoute.state._callbackParam));
        fakeRoute.state._wait = false;
        fakeRoute.state._callback = null;
        fakeRoute.state._callbackParam = null;
    },
    set: function set(callb, param) {
        fakeRoute.state._callback = callb;
        fakeRoute.state._callbackParam = param;
        if (!fakeRoute.state._wait) fakeRoute.state.resolve();
    }
};

fakeRoute.datas = {
    pages: [
        // {id:1,url:'',title:'',data:''}
    ],
    ajaxObject: null
};
fakeRoute.init = function () {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var selector = _ref.selector;
    var target = _ref.target;

    for (var item in arguments[0]) {
        fakeRoute.options[item] = arguments[0][item];
    }
    document.body.addEventListener('click', function (e) {
        var node = e.target;
        do {
            if ((node.matches || node.msMatchesSelector || node.webkitMatchesSelector).call(node, fakeRoute.options.selector)) {
                fakeRoute._detech(node, e);
                break;
            }
        } while (node = node.parentElement);
    });
    window.onpopstate = function (e) {
        var pageData = void 0;
        for (var i = 0; i < fakeRoute.datas.pages.length; i++) {
            var page = fakeRoute.datas.pages;
            if (fakeRoute.datas.pages[i].id == e.state) {
                pageData = fakeRoute.datas.pages[i];
            }
        }
        if (pageData) {
            fakeRoute.open(pageData.url, fakeRoute.options.target, false);
        } else {
            // FIXME: bulamadığı kayıt için yeniden sayfa
        }
    };
    fakeRoute._loadPage(window.location.pathname, null, false, false);
    window.history.replaceState(1, document.title, window.location.href);
    // if (fakeRoute.onLoading) fakeRoute.onLoading.call(document.querySelector(selector), fakeRoute.state,window.location.pathname);
    if (fakeRoute.onLoad) fakeRoute.onLoad.call(document.querySelector(selector), window.location.pathname);
};
fakeRoute._detech = function (elm, event) {
    event.preventDefault();
    var target = elm.getAttribute('data-fakeroute-target') || fakeRoute.options.target;
    var url = elm.getAttribute('data-fakeroute-url') || elm.getAttribute('href');
    var hash = elm.getAttribute('data-fakeroute-hash') === 'false' ? false : true;
    var force = elm.getAttribute('data-fakeroute-force') === 'true' ? true : false;
    if (url) {
        fakeRoute.open(url, target, hash, force);
    }
};

fakeRoute.open = function (url) {
    var target = arguments.length <= 1 || arguments[1] === undefined ? fakeRoute.options.target : arguments[1];
    var hash = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
    var force = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    if (fakeRoute.onLoading) fakeRoute.onLoading.call(document.querySelector(target), fakeRoute.state, url);
    fakeRoute._loadPage(url, function (pageData, hash, force) {
        if (hash) {
            fakeRoute.addHash(pageData);
        }

        fakeRoute._pageInsertData(pageData, target);
        fakeRoute._pageEqualStyle(pageData);
        fakeRoute._pageUpdateMeta(pageData);
    }, hash, force);
};

fakeRoute._pageInsertData = function (pageData, target) {
    var draft = document.createElement('div');
    draft.innerHTML = pageData.data;

    var wrap = document.createElement('div');
    wrap.className = "fakeroute-wrapper";
    var htmlContent = draft.querySelector(target).innerHTML;

    var scripts = draft.querySelectorAll('script[data-fakeroute-script]:not([src])');
    htmlContent = htmlContent.replace(/<script[^>]*>[^<]((.|\n)*?)<\/script>/g, '');

    var styles = draft.querySelectorAll('style');
    htmlContent = htmlContent.replace(/<style[^>]*>[^<]((.|\n)*?)<\/style>/g, '');

    wrap.innerHTML = htmlContent;
    if (fakeRoute.onUnload) fakeRoute.onUnload.call(document.querySelector(target));
    document.querySelector(target).innerHTML = "";
    document.querySelector(target).appendChild(wrap);
    if (fakeRoute.onLoad) fakeRoute.onLoad.call(document.querySelector(target), pageData.url);

    // exec inline script codes
    if (fakeRoute.options.enableInlineScripts) {
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i]) {
                eval(scripts[i].innerText);
            }
        }
    }

    // insert inline stylesheets
    if (fakeRoute.options.enableInlineStyles) {
        for (var _i = 0; _i < styles.length; _i++) {
            if (styles[_i]) {
                document.body.innerHTML += styles[_i].outerHTML;
            }
        }
    }
};

fakeRoute._pageUpdateMeta = function (pageData) {
    var draft = document.createElement('div');
    draft.innerHTML = pageData.data;
    if (fakeRoute.options.enableSrcScripts) {
        var scripts = draft.querySelectorAll('script[src][data-fakeroute-script]');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i]) {
                var script = document.createElement('script');
                script.setAttribute('src', scripts[i].getAttribute('src'));
                if (scripts[i].getAttribute('type')) script.setAttribute('type', scripts[i].getAttribute('type'));
                var oldScript = document.querySelector('script[src=\'' + script.getAttribute('src') + '\']');
                if (oldScript) oldScript.parentNode.removeChild(oldScript);
                document.head.appendChild(script);
            }
        }
    }

    document.title = pageData.title;
};

fakeRoute._pageEqualStyle = function (pageData) {
    var draft = document.createElement('div');
    draft.innerHTML = pageData.data;

    if (fakeRoute.options.enableStyleSheets) {
        var stylesheets = document.querySelectorAll('link[rel=\'stylesheet\']');
        for (var i = 0; i < stylesheets.length; i++) {
            stylesheets[i].parentNode.removeChild(stylesheets[i]);
        }

        var newStylesheets = draft.querySelectorAll('link[rel=\'stylesheet\']');
        for (var _i2 = 0; _i2 < newStylesheets.length; _i2++) {
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            if (newStylesheets[_i2].getAttribute('href')) link.setAttribute('href', newStylesheets[_i2].getAttribute('href'));
            if (newStylesheets[_i2].getAttribute('media')) link.setAttribute('media', newStylesheets[_i2].getAttribute('media'));
            if (newStylesheets[_i2].getAttribute('title')) link.setAttribute('title', newStylesheets[_i2].getAttribute('title'));
            if (newStylesheets[_i2].getAttribute('charset')) link.setAttribute('charset', newStylesheets[_i2].getAttribute('charset'));
            document.head.appendChild(link);
        }
    }

    fakeRoute.options.equalStyle.forEach(function (sel) {
        var effectingDiv = document.querySelector(sel);
        var effectorDiv = draft.querySelector(sel);
        if (effectingDiv && effectorDiv) {
            effectingDiv.className = effectorDiv.className;
            effectingDiv.setAttribute('style', effectorDiv.getAttribute('style'));
        }
    });

    fakeRoute.options.equalContent.forEach(function (sel) {
        var effectingDiv = document.querySelector(sel);
        var effectorDiv = draft.querySelector(sel);
        if (effectingDiv && effectorDiv) {
            effectingDiv.innerHTML = effectorDiv.innerHTML;
        }
    });
};

fakeRoute._loadPage = function (url, callback) {
    var hash = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
    var force = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    for (var i = 0; i < fakeRoute.datas.pages.length; i++) {
        var page = fakeRoute.datas.pages[i];
        if (page.url === url) {
            if (!force) {
                if (callback) fakeRoute.state.set(callback, [this, page, hash, force]);
                return;
            } else {
                fakeRoute.datas.pages.splice(i, 1);
                break;
            }
        }
    }
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.addEventListener("load", function (e) {
        var draft = document.createElement('div');
        draft.innerHTML = this.responseText;
        var pageTitle = draft.querySelector('title') ? draft.querySelector('title').innerText : 'Untitled';
        var newId = fakeRoute.datas.pages.reduce(function (a, b) {
            return b.id > a ? b.id : a;
        }, 0) + 1;
        fakeRoute.datas.pages.push({ id: newId, url: url, title: pageTitle, data: this.responseText });
        if (callback) fakeRoute.state.set(callback, [this, fakeRoute.datas.pages[fakeRoute.datas.pages.length - 1], hash, force]);
        return;
    });
    req.addEventListener("error", function (e) {
        if (fakeRoute.onError) fakeRoute.onError.call(e);
    });
    req.send();
};

fakeRoute.addHash = function (_ref2) {
    var id = _ref2.id;
    var url = _ref2.url;
    var title = _ref2.title;

    window.history.pushState(id, title, url);
};

// module.exports = fakeRoute;
if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    module.exports = fakeRoute;
}
//# sourceMappingURL=fakeroute.js.map
