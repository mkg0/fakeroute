/*jshint esversion:6*/
var fakeRoute= function(){};
fakeRoute.options={
    selector:'a',
    target:'body',
    equalStyle:[],
    enableInlineScripts:true,
    enableSrcScripts:true,
    enableStyleSheets:true,
    ignoreScriptId:['__bs_script__']
};

fakeRoute.onLoading=null;
fakeRoute.onLoad=null;//onload
fakeRoute.onUnload=null;
fakeRoute.onError=null;

fakeRoute.state = {
    _wait : false,
    _callback : null,
    _callbackParam : null,
    wait:function () {
        fakeRoute.state._wait=true;
    },
    resolve :  function() {
        if (fakeRoute.state._callback) fakeRoute.state._callback.call(...fakeRoute.state._callbackParam);
        fakeRoute.state._wait=false;
        fakeRoute.state._callback=null;
        fakeRoute.state._callbackParam=null;

    },
    set:function (callb,param) {
        fakeRoute.state._callback=callb;
        fakeRoute.state._callbackParam=param;
        if (!fakeRoute.state._wait) fakeRoute.state.resolve();
    }
};


fakeRoute.datas={
    pages:[
        // {id:1,url:'',title:'',data:''}
    ],
    ajaxObject:null
};
fakeRoute.init = function({selector,target}={}){
    for (var item in arguments[0]) {
        fakeRoute.options[item] = arguments[0][item];
    }
    document.body.addEventListener('click', function(e){
        e.preventDefault();
        let node = e.target;
        do {
            if( (node.matches || node.msMatchesSelector || node.webkitMatchesSelector).call(node, fakeRoute.options.selector)){
                fakeRoute._detech(node);
                break;
            }
        } while (node = node.parentElement);
    });
    window.onpopstate= function (e) {
        let pageData;
        for (var i = 0; i < fakeRoute.datas.pages.length; i++) {
            let page= fakeRoute.datas.pages;
            if (fakeRoute.datas.pages[i].id == e.state) {
                pageData =fakeRoute.datas.pages[i];
            }
        }
        if (pageData) {
            fakeRoute.open(pageData.url,fakeRoute.options.target,false);
        }else {
            console.log('bulamadı');
        }
    };
    fakeRoute._loadPage(window.location.pathname,null,false,false);
    window.history.replaceState(1,document.title,window.location.href);
};
fakeRoute._detech=function (elm) {
    let target = elm.getAttribute('data-fakeroute-target') || fakeRoute.options.target;
    let url = elm.getAttribute('data-fakeroute-url') || elm.getAttribute('href');
    let hash = elm.getAttribute('data-fakeroute-hash') === 'false' ? false : true;
    let force = elm.getAttribute('data-fakeroute-force') === 'true' ? true : false;
    if (url) {
        fakeRoute.open(url, target, hash, force);
    }
};

fakeRoute.open = function (url, target= fakeRoute.options.target, hash=true, force=false) {
    if(fakeRoute.onLoading) fakeRoute.onLoading.call(document.querySelector(target),fakeRoute.state);

    fakeRoute._loadPage(url,function (pageData,hash,force) {
        if (hash){
            fakeRoute.addHash(pageData);
        }

        fakeRoute._pageInsertData(pageData,target);
        fakeRoute._pageEqualStyle(pageData);
        fakeRoute._pageUpdateMeta(pageData);


    }, hash, force);
};


fakeRoute._pageInsertData=function (pageData, target){
    let draft=document.createElement('div');
    draft.innerHTML= pageData.data;

    let wrap= document.createElement('div');
    wrap.className="fakeroute-wrapper";
    let htmlContent= draft.querySelector(target).innerHTML;

    let scripts= draft.querySelectorAll('script:not([src])' + fakeRoute.options.ignoreScriptId.map( a => `:not(#${a})` ).join('') );
    htmlContent = htmlContent.replace(/<script[^>]*>[^<]((.|\n)*?)<\/script>/g,'');
    wrap.innerHTML=htmlContent;
    if(fakeRoute.onUnload) fakeRoute.onUnload.call(document.querySelector(target));
    document.querySelector(target).innerHTML="";
    document.querySelector(target).appendChild(wrap);
    if(fakeRoute.onLoad)fakeRoute.onLoad.call(document.querySelector(target));

    // exec script codes
    if (fakeRoute.options.enableInlineScripts) {
        for (var i = 0; i < scripts.length; i++) {
            if(scripts[i]){
                new Function(scripts[i].replace(/<script[^>]*>/).replace(/<\/script>/,''))();
            }
        }
    }

};

fakeRoute._pageUpdateMeta=function (pageData){
    let draft=document.createElement('div');
    draft.innerHTML= pageData.data;
    if (fakeRoute.options.enableSrcScripts) {

    let scripts= draft.querySelectorAll('script[src]' + fakeRoute.options.ignoreScriptId.map( a => `:not(#${a})` ).join('') );
    for (var i = 0; i < scripts.length; i++) {
        if(scripts[i]){
            let script = document.createElement('script');
            script.setAttribute('src',scripts[i].getAttribute('src'));
            if (scripts[i].getAttribute('type')) script.setAttribute('type',scripts[i].getAttribute('type'));
            let oldScript =document.querySelector(`script[src='${script.getAttribute('src')}']`);
            if (oldScript) oldScript.parentNode.removeChild(oldScript);
            document.head.appendChild(script);
        }
    }
}

    document.title=pageData.title;
};

fakeRoute._pageEqualStyle=function (pageData){
    let draft=document.createElement('div');
    draft.innerHTML= pageData.data;

    if (fakeRoute.options.enableStyleSheets) {
        let stylesheets= document.querySelectorAll(`link[rel='stylesheet']`);
        for (let i = 0; i < stylesheets.length; i++) {
            stylesheets[i].parentNode.removeChild(stylesheets[i]);
        }

        let newStylesheets= draft.querySelectorAll(`link[rel='stylesheet']`);
        for (let i = 0; i < newStylesheets.length; i++) {
            let link = document.createElement('link');
            link.setAttribute('rel','stylesheet');
            if(newStylesheets[i].getAttribute('href')) link.setAttribute('href',newStylesheets[i].getAttribute('href'));
            if(newStylesheets[i].getAttribute('media')) link.setAttribute('media',newStylesheets[i].getAttribute('media'));
            if(newStylesheets[i].getAttribute('title')) link.setAttribute('title',newStylesheets[i].getAttribute('title'));
            if(newStylesheets[i].getAttribute('charset')) link.setAttribute('charset',newStylesheets[i].getAttribute('charset'));
            document.head.appendChild(link);
        }
    }


    fakeRoute.options.equalStyle.forEach(function (sel) {
        let effectingDiv=document.querySelector(sel);
        let effectorDiv=draft.querySelector(sel);
        if (effectingDiv && effectorDiv){
            effectingDiv.className = effectorDiv.className;
            effectingDiv.setAttribute('style',effectorDiv.getAttribute('style'));
        }
    });
};



fakeRoute._loadPage=function(url,callback, hash=true, force=false) {
    for (var i = 0; i < fakeRoute.datas.pages.length; i++) {
        let page = fakeRoute.datas.pages[i];
        if (page.url === url){
            if (!force){
                if(callback) fakeRoute.state.set(callback,[this,page,hash,force]);
                return;
            }else {
                fakeRoute.datas.pages.splice(i,1);
                break;
            }
        }
    }
    var req = new XMLHttpRequest();
    req.open('GET',url);
    req.addEventListener("load", function (e) {
        let draft=document.createElement('div');
        draft.innerHTML= this.responseText;
        let pageTitle = draft.querySelector('title') ? draft.querySelector('title').innerText : 'Untitled';
        let newId =fakeRoute.datas.pages.reduce( (a,b)=> b.id >a ? b.id : a ,0) + 1;
        fakeRoute.datas.pages.push({id:newId,url:url,title:pageTitle,data:this.responseText});
        if(callback) fakeRoute.state.set(callback,[this,fakeRoute.datas.pages[fakeRoute.datas.pages.length-1], hash, force]);
        return ;
    });
    req.addEventListener("error", function (e) {
        if (fakeRoute.onError) fakeRoute.onError.call(e);
    });
    setTimeout(function () {
        req.send();
    },300);
};

fakeRoute.addHash=function ({id, url, title}) {
    window.history.pushState(id,title,url);
};
