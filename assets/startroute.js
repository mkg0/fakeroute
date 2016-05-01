
fakeRoute.init({target:'#wrapper',equalStyle:['#target1','#target2','#target3'],ignoreScriptId:['mainScript','__bs_script__']});
fakeRoute.onLoad=function () {
};
fakeRoute.onUnload=function () {
};
fakeRoute.onLoading=function (state) {
   state.wait();
   state.resolve();
};
