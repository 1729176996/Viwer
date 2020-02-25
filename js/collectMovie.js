var vm,loading;
var start = 0,count = 20;
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
				
				var userObj = window.localStorage.getItem('userObj')?JSON.parse(window.localStorage.getItem('userObj')):null;
				if(!userObj){
					mui.alert('用户消息失效，请重新登录','提示','确定',function(){
						window.localStorage.removeItem('userObj');
						window.location.href = 'login.html';
					},'div');
					return;
				}
				
				var sendObj = {
					user_id:userObj.id
				};
				$.ajax({
					url:url+'/getUserCollect',
					type:'GET',
					data:sendObj,
					dataType:'json',
					timeout:8000,
					success:function(data){
						console.log(data);
						
						if(data.code==200){
							var _list = [];
							for(var n=0;n<data.data.length;n++){
								var obj = data.data[n].movieObj?JSON.parse(data.data[n].movieObj):null;
								if(obj){
									_list.push(obj);
								}
							}
							_this.list = _list;
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
				mui('#scrollWrapper').pullRefresh().scrollTo(0,0,100);
			},
			toMovieTop:function(item){
				window.location.href = 'movieTop.html';
			},
			toComingSoon:function(item){
				window.location.href = 'comingSoon.html';
			},
			toCollectMovie:function(){
				window.location.href = 'collectMovie.html';
			},
			detail:function(item){
				window.localStorage.setItem('movie_id',item.id);
				window.localStorage.setItem('movieObj',JSON.stringify(item));
				window.location.href = 'movieDetail.html';
			}
	    }
	});
});
