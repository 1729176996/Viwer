var vm,loading;
var start = 0,count = 20,next = false;
$(function(){
    FastClick.attach(document.body);
	vm = new Vue({
	    el: "#main",
	    data:{
			list:[]
	    },
	    mounted:function(){
			this.init();
	    },
	    methods:{
			init:function(){
				var _this = this;
				mui.init({
					pullRefresh : {
						container:"#scrollWrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
						down : {
							height:50,//可选,默认50.触发下拉刷新拖动距离,
							auto: false,//可选,默认false.首次加载自动下拉刷新一次
							contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
							contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
							contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
							callback :function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
								_this.getList('下拉');
							}
						},
						up : {
							height:50,//可选.默认50.触发上拉加载拖动距离
							auto:false,//可选,默认false.自动上拉加载一次
							contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
							contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
							callback :function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
								_this.getList('上拉');
							}
						}
					}
				});
				_this.getList('下拉');
			},
			getList:function(refreshType){
				var _this = this;
				if(refreshType=='下拉'){
					start = 0;
					_this.list = [];
				}else{
					start += count;
				}
				var sendObj = {
					start:start,
					count:count,
					apikey:apikey
				};
				$.ajax({
					url:'https://api.douban.com/v2/movie/coming_soon',
					type:'GET',
					data:sendObj,
					dataType:'json',
					timeout:8000,
					success:function(data){
						console.log(data);
						
						if(data&&data.subjects&&data.subjects.length>0){
							if(refreshType=='下拉'){
								_this.list = data.subjects;
							}else{
								_this.list = _this.list.concat(data.subjects);
							}
						}else{
							if(refreshType=='下拉'){
								_this.list = [];
								start = 0;
							}else{
								_this.list = _this.list.concat(data.subjects);
								start -= count;
							}
						}
						
						_this.$nextTick(function(){
							if(refreshType=='下拉'){
								mui('#scrollWrapper').pullRefresh().endPulldownToRefresh();
								mui('#scrollWrapper').pullRefresh().scrollTo(0,0,0);
							}else if(refreshType=='上拉'){
								mui('#scrollWrapper').pullRefresh().endPullupToRefresh();
							}
						})
					},
					error:function(xhr, errorType, error,msg){
						mui.alert(msg,'提示','确定',null,'div');
						if(refreshType=='下拉'){
							mui('#scrollWrapper').pullRefresh().endPulldownToRefresh();
							mui('#scrollWrapper').pullRefresh().scrollTo(0,0,0);
						}else if(refreshType=='上拉'){
							mui('#scrollWrapper').pullRefresh().endPullupToRefresh();
						}
					}
				})
			},
			toTop:function(){
				mui('#scrollWrapper').scroll({
					indicators:false,
					deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				}).scrollTo(0,0,100);
			},
			toMovieTop:function(item){
				window.location.href = 'index.html';
			},
			toComingSoon:function(item){
				window.location.href = 'comingSoon.html';
			}
	    }
	});
});
