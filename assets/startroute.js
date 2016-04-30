
fakeRoute.init({target:'#wrapper',equalStyle:['#target1','#target2','#target3']});
fakeRoute.onLoad=function () {
};
fakeRoute.onUnload=function () {
};
fakeRoute.onLoading=function (state) {
   state.wait();
   state.resolve();
};
