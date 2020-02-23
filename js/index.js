var vm,loading;
var page = 0,next = false;
$(function(){
    FastClick.attach(document.body);
	vm = new Vue({
	    el: "#main",
	    data:{
			keyword:'',
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
			},
			search:function(){
				this.getList('下拉');
			},
			getList:function(refreshType){
				var _this = this;
				var url = '';
				if(refreshType=='下拉'){
					page = 1;
					next = false;
					this.list = [];
					url = 'https://qxs.la/s_'+_this.keyword+'/1/';
				}else{
					if(next){
						url = 'https://qxs.la/s_'+_this.keyword+'/'+(++page)+'/';
					}else{
						if(refreshType=='下拉'){
							mui('#scrollWrapper').pullRefresh().endPulldownToRefresh();
							mui('#scrollWrapper').pullRefresh().scrollTo(0,0,0);
						}else if(refreshType=='上拉'){
							mui('#scrollWrapper').pullRefresh().endPullupToRefresh();
						}
						return;
					}
				}
				$.ajax({
					url:url,
					type:'GET',
					timeout:8000,
					success:function(data){
						
						var _list = [];
						var uls = data.split(/<ul class="list_content">([\s\S]*?)<\/ul>/);
						for(var n=1;n<uls.length;n++){
							var lis = uls[n].split(/<li class=([\s\S]*?)<\/li>/);
							if(lis.length==9){
								var as1 = lis[1].match(/<a href="([\s\S]*?)">([\s\S]*?)<\/a>/);
								var url = as1[1];
								var name = as1[2];
								
								var as2 = lis[3].match(/<a href="([\s\S]*?)">([\s\S]*?)<\/a>/);
								var last_url = as2[1];
								var last_title = as2[2];
								
								var as3 = lis[5].match(/<a href="([\s\S]*?)">([\s\S]*?)<\/a>/);
								var author = as3[2];
								
								var as4 = lis[7].split(/"cc5">/);
								var last_time = as4[1];
								
								var obj = {
									name:name,
									url:url,
									last_title:last_title,
									last_url:last_url,
									author:author,
									last_time:last_time
								};
								_list.push(obj);
							}
						}
						_this.list = _this.list.concat(_list);
						
						var pagenavArr = data.match(/<div id="pagenav">([\s\S]*?)<\/div>/);
						console.log(pagenav);
						if(pagenavArr.length==2){
							var pagenav = pagenavArr[1];
							next = pagenav.indexOf('<a href="/s_'+_this.keyword+'/'+(page+1)+'/">')>=0?true:false;
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
			selectItem:function(item){
				if(item&&item.func){
					item.func();
				}
			},
			toShelf:function(){
				window.location.href = 'shelf.html';
			},
			toSearch:function(){
				window.location.href = 'search.html';
			}
	    }
	});
});
