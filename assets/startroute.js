
fakeRoute.onLoad=function () {
   console.log('loaded!');
};
fakeRoute.onUnload=function () {
   console.log('close page');
};
fakeRoute.onLoading=function (state,url) {
   state.wait();
   console.log('started: ' + url);
   setTimeout(function () {
      console.log('resolve');
      state.resolve();
   },1500)
};
fakeRoute.init({target:'#wrapper',equalStyle:['#target1','#target2','#target3'],ignoreScriptId:['mainScript','__bs_script__']});
