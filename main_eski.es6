/* jshint esversion:6*/
export var logo;
export var logoText;
export var a;
export var b;
export var scroll;

export var loading = {
    item:'#loading',
    show : function(){
        $(this.item).show(0);
        var offset =$(this.item).offset();
        b=$(this.item).pixel({ value: 'YUKLENIYOR...', pixelSize: 2, letterSpace: 1,valign:'middle',align:'center',color:'#ddd'});
    },
    hide:function(){
        b.pixel('destroy');
        $(this.item).html('');
        $(this.item).hide();
    }
};


export var fakeRoute = {
    Ajax:null,
    htmlDatas: [],//html, url, title
    bind: function () {
    },
    unbind: function () {
    },
    init: function () {
        $(window).bind("popstate", function () {
            fakeRoute.load(location.href, true, '#content', false);
        });
        $('body').on('click', 'a', function () {
            if($(this).is('.load')){
                if ($(this).attr('target')) target = $(this).attr('target');
                else target = '#content';
                fakeRoute.load($(this).attr('href'), true, target);
                return false;
            }
        });
    },
    load: function (url, animation, target, state) {
        if ($('#sidenav.sideActive').length > 0) naviconToggle();
        closeSub();
        if(!target) target = '#content';
        if(animation !== false) {hideContent(target);}
        if (this.Ajax !== null) this.Ajax.abort();
        for (var i = this.htmlDatas.length - 1; i >= 0; i--) {
            console.log(this.htmlDatas[i][1]);
            if (this.htmlDatas[i][1] === url) {
                openPage(i,target,state);
                return false;
            }else{

            }
        }
        this.Ajax = $.ajax({
            url: url,
            success: function (veri) {
                fakeRoute.htmlDatas.push([veri, url]);
                openPage(fakeRoute.htmlDatas.length - 1, target);
            },
            error: function (exc,a,error) {
                uyari('Error!', error,function(){showContent(target);});
                loading.hide();
            }
        });
    }
};

$(document).ready(function () {


    logoText = $('#logoarea').text();
    checkLogo();
    scroll= $('html').niceScroll({cursorborder :'0',cursorcolor :'#000',cursorborderradius :'0',cursoropacitymin :'0.6',cursoropacitymax :'0.8',smoothscroll:false,cursorwidth :'8px'});
    fakeRoute.init();
    $('#logoarea').click(function () {
        if ($(window).width() < 768){
            naviconToggle();
            logo.addClass('locked').pixel({ value: 'X', pixelSize: 5, focusTo: $('.sidenav button'), align: 'center', valign: 'middle' });
            return false;
        }
    });
    $('.sidenav button').click(function () {
        naviconToggle();
    });

    $(window).resize(function () {
        checkLogo();
        if (a) {
            if ($(window).width() < 768)
                a.pixel({ align: 'center', valign: 'bottom',marginBottom:50 });
            else
                a.pixel({ align: 'right', valign: 'middle', marginBottom:0 });
        }
    });
    $('.Hmenu-item:has(.Hmenu-sub)').click(function(){
        switchSub(this);
    });
});


export function hideContent(target) {
    var animates = [];
    animates.push([0, function () {$('.Hmenu--secili').removeClass('Hmenu--secili');loading.show();}]);
    $(target).find('.animateClose,.animateClosePer > *').each(function () {
        var nesne = $(this);
        animates.push([50, function () { $(nesne).animate({ opacity: 0 }, 50); }]);
    });
    animateList(animates);
}

export function switchSub(subTarget) {
    var item = $(subTarget).find('.Hmenu-sub');
    if (item.is('.active')) {//altmenü açıksa
        closeSub();
    } else {
        item.addClass('active');
        $('.wrapper').addClass('Hmenu--active')
    }
}

export function closeSub() {
    if ($('.wrapper').is('.Hmenu--active')) {
        $('.wrapper').removeClass('Hmenu--active')
        $('.Hmenu-sub.active').removeClass('active');
    }
}



export function hideContent2(target) {
    $(target).find('.animateClose,.animateClosePer > *').fadeTo(0,0);
}

export function showContent(target) {
    var animates = []
    animates.push([50,function(){scroll.resize();}])
    $(target).find('.animateClose,.animateClosePer > *').each(function () {
        var nesne = $(this);
        animates.push([30, function () { $(nesne).animate({ opacity: 1 }, 300); }])
    });
    animates.push([50,function(){loading.hide();}])
    animateList(animates);
}


export var openpage2 = function () {
    openPage(_htmlDataIndex,_target,_state);
}

export var _htmlDataIndex;
export var _target;
export var _state;
export function openPage(htmlDataIndex, target, state) {
    var routeDatas = ['header .navigate','.dynamicTitle'];
    var routeStyles = ['header', '.Hmenu-item'];

    if (animationPlaying) {
        _htmlDataIndex = htmlDataIndex;
        _target= target;
        _state= state;
        setTimeout(openpage2, 100);
        return false;
    }
    var data = fakeRoute.htmlDatas[htmlDataIndex];//data,url
    var html = $(data[0]).find(target).html();


    if ($(target).length ==0) {
        uyari('HATA', 'Hmm enteresan.');
        return false;
    }
    $(target).html(html);
    hideContent2(target);
    for (var i in routeStyles) {
        var t = $(routeStyles[i]);
        var i2 = 0;
        t.each(function () {
            $(this).attr('class', $(data[0]).find(routeStyles[i] + ':eq(' + i2++ + ')').attr('class'));
        })
    }


    for (var i in routeDatas) {
        $(routeDatas[i]).html($(data[0]).find(routeDatas[i]).html());
    }

    var title = data[0].match("<title>(.*?)</title>")[1];
    showContent(target);
    if(state != false){
        var stateObj = { foo: "bar" };
        history.pushState(stateObj, [title], data[1]);
    }
    document.title = title;
    fakeRoute.unbind();
    fakeRoute.bind();
}

export function checkLogo(force) {
    if (!logo){
        if ($(window).width() < 768)
            logo = $('#logoarea').pixel({ value: '- ' + logoText, pixelSize: 4, align: 'left', valign: 'middle', left: 'auto', top: 'auto', focusTo: null, animationSpeed: 800, letterSpace: 1,delay:400 });
        else
            logo = $('#logoarea').pixel({ value: logoText, pixelSize: 3, align: 'left', valign: 'middle', left: 'auto', top: 'auto', focusTo: null, animationSpeed: 800, letterSpace: 1,delay:400});
        return false;
    }
    if (force)
        logo.removeClass('locked');
    if (!$('#logoarea').is('.locked')) {//panel kapalıysa logoyu yerine yerleştiriyor
        if ($(window).width() < 768)
            logo.pixel({ value: '- ' + logoText, pixelSize: 4, align: 'left', valign: 'middle', left: 'auto', top: 'auto', focusTo: null, letterSpace: 1,fixed:false,delay:0});
        else
            logo.pixel({ value: logoText, pixelSize: 3, align: 'left', valign: 'middle', autoLeft: true, autoTop: true, focusTo: null, letterSpace: 1,fixed:false,delay:0});
    }else{//panel açıksa sadece yeniliyor
        logo.pixel('refresh');
    }
}

export var animationPlaying = false;
export var queanims = [];
export var animateListque = function() {
    animateList(queanims[0]); //üşengeçlik
    queanims.splice(0,1);
}
export var animateListCheck = function() {
    if (animationPlaying) {
        setTimeout(animateListCheck, 100);
        return false;
    }else{
        animateListque();
    }
}

export function animateList(anims) {
    if (animationPlaying) {
        queanims.push(anims);
        setTimeout(animateListCheck, 100);
        return false;
    }//eğer animasyon varsa sıraya ekleyip sürekli kontrol eden fonksiyonu çağırıyor.
    animationPlaying = true;
    anims.push([100, function () { animationPlaying = false }]);
    var delays = 0;
    for (var i in anims) {
        delays += anims[i][0]
        setTimeout(anims[i][1], delays);
    }
}

export function naviconToggle() {
    var bar = $('#sidenav');
    var barWidth = bar.width();
    var barHeight = bar.height();
    if (bar.length < 1) return false;
    if (!bar.is('.sideActive')) {
        var mLeft = parseInt($('body').css('margin-left').replace('px', ''));
        var mRight = parseInt($('body').css('margin-right').replace('px', ''));
        var mTop = parseInt($('body').css('margin-top').replace('px', ''));
        var mBot = parseInt($('body').css('margin-bottom').replace('px', ''));
        bar.attr('mLeft', mLeft);
        bar.attr('mRight', mRight);
        bar.attr('mTop', mTop);
        bar.attr('mBot', mBot);
        bar.addClass('sideActive');
        if (bar.is('.sidenav-left')) {
            bar.css('margin-left', barWidth * -1).css('display', 'block');
            $('body').animate({ marginLeft: mLeft + barWidth * 1, marginRight: mRight - barWidth * 1 })
            bar.animate({ marginLeft: 0 })
        } else if (bar.is('.sidenav-right')) {
            bar.css('margin-right', barWidth * -1).css('display', 'block');
            $('body').animate({ marginLeft: mLeft - barWidth * 1, marginRight: mRight + barWidth * 1 })
            bar.animate({ marginRight: 0 })
        } else if (bar.is('.sidenav-top')) {
            bar.css('margin-top', barHeight * -1).css('display', 'block');
            $('body').animate({ marginTop: mTop + barHeight * 1 })
            bar.animate({ marginTop: 0 })
        } else if (bar.is('.sidenav-full')) {
            bar.css('display', 'block').css('opacity', '0')
            bar.animate({ opacity: 1 })
        }
    } else {
        checkLogo(true);
        if (bar.is('.sidenav-left')) {
            $('body').stop().animate({ marginLeft: parseInt(bar.attr('mLeft')), marginRight: parseInt(bar.attr('mRight')) })
            bar.stop().animate({ marginLeft: barWidth * -1 }, function () {
                bar.removeClass('sideActive');
            })
        } else if (bar.is('.sidenav-right')) {
            $('body').stop().animate({ marginLeft: parseInt(bar.attr('mLeft')), marginRight: parseInt(bar.attr('mRight')) })
            bar.stop().animate({ marginRight: barWidth * -1 }, function () {
                bar.removeClass('sideActive');
            })
        } else if (bar.is('.sidenav-top')) {
            $('body').stop().animate({ marginTop: parseInt(bar.attr('mTop')) })
            bar.stop().animate({ marginTop: barHeight * -1 }, function () {
                bar.removeClass('sideActive');
            })
        } else if (bar.is('.sidenav-full')) {
            bar.stop().animate({ opacity: 0 }, function () {
                bar.removeClass('sideActive');
                $(this).css('display', 'none');
            })
        }
    }
}


export function uyari(baslik,text,callback) {
    var box = $('#alertbox');
    box.find('.alertbox-title').text(baslik);
    box.find('alertbox-text').text(text);
    box.find('input[type=button]').unbind();
    if(callback){
        box.find('input[type=button]').click(callback);
    }

    var anims = [
        [0, function () { box.fadeIn(); }],
        [0, function () { box.find('div:first').slideDown(200); }],
        [200, function () { logo.addClass('locked').pixel({ focusTo: box.find('h1'), value: baslik, pixelSize: 5, letterSpace: 5, valign:'top',align:'left' }); }]
    ]
    animateList(anims);
}

export function uyarikapat() {
    var box = $('#alertbox');
    var anims = [
        [0, function () { box.find('div:first').slideUp(); }],
        [100, function () { box.fadeOut(); }],
        [0, function () { checkLogo(true); }]
    ]
    animateList(anims);
}


export function toSef(value){
    value = value.replace("ç", "c")
    value = value.replace("Ç", "C")
    value = value.replace("ş", "s")
    value = value.replace("Ş", "S")
    value = value.replace("ğ", "g")
    value = value.replace("Ğ", "G")
    value = value.replace("ı", "i")
    value = value.replace("İ", "I")
    value = value.replace("ü", "u")
    value = value.replace("Ü", "U")
    value = value.replace("ö", "o")
    value = value.replace("Ö", "O")
    value = value.replace(/[ '\+-]/g, "_");
    value = value.replace(/[^a-zA-Z0-9_]/g, "");
    value = value.replace(/__+/g, "_");
    value = value.replace(/([ _]$)|(^[ _])/g, "");
    return value.toLowerCase();
    return "";
}
