'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*jshint esversion:6*/
var fakeRoute = function fakeRoute() {};
fakeRoute.options = {
    selector: 'a',
    target: 'body',
    equalStyle: ''
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
        e.preventDefault();
        var node = e.target;
        do {
            if ((node.matches || node.msMatchesSelector || node.webkitMatchesSelector).call(node, fakeRoute.options.selector)) {
                fakeRoute._detech(node);
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
            console.log('bulamadı');
        }
    };
    fakeRoute._loadPage(window.location.pathname, null, false, false);
    window.history.replaceState(1, document.title, window.location.href);
};
fakeRoute._detech = function (elm) {
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

    if (fakeRoute.onLoading) fakeRoute.onLoading.call(document.querySelector(target), fakeRoute.state);
    fakeRoute._loadPage(url, function (pageData, hash, force) {
        if (hash) {
            fakeRoute.addHash(pageData);
        }
        var draft = document.createElement('div');
        draft.innerHTML = pageData.data;
        var wrap = document.createElement('div');
        wrap.className = "fakeroute-wrapper";
        wrap.innerHTML = draft.querySelector(target).innerHTML;
        document.title = pageData.title;
        document.querySelector(target).innerHTML = "";
        if (fakeRoute.onUnload) fakeRoute.onUnload.call(document.querySelector(target));
        document.querySelector(target).appendChild(wrap);
        fakeRoute.options.equalStyle.split(',').forEach(function (sel) {
            var effectingDiv = document.querySelector(sel);
            var effectorDiv = draft.querySelector(sel);
            if (effectingDiv && effectorDiv) {
                effectingDiv.className = effectorDiv.className;
                effectingDiv.setAttribute('style', effectorDiv.getAttribute('style'));
            }
        });

        if (fakeRoute.onLoad) fakeRoute.onLoad.call(document.querySelector(target));
    }, hash, force);
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
    setTimeout(function () {
        req.send();
    }, 300);
};

fakeRoute.addHash = function (_ref2) {
    var id = _ref2.id;
    var url = _ref2.url;
    var title = _ref2.title;

    window.history.pushState(id, title, url);
};
//# sourceMappingURL=fakeroute.js.map
