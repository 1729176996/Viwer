var vm,loading;
$(function(){
    FastClick.attach(document.body);
	vm = new Vue({
	    el: "#main",
	    data:{
			username:'',
			nick:'',
			password:'',
			repassword:''
	    },
	    mounted:function(){
			this.$nextTick(function(){
				mui('#scrollWrapper').scroll({
					indicators:false,
					deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				}).scrollTo(0,0,0);
			})
	    },
	    methods:{
			register:function(){
				var _this = this;
				var username = _this.username;
				var nick = _this.nick;
				var password = _this.password;
				var repassword = _this.repassword;
				
				if(isNull(username)){
					mui.alert('用户名不能为空','提示','确定',null,'div');
					return;
				}
				if(isNull(nick)){
					mui.alert('昵称不能为空','提示','确定',null,'div');
					return;
				}
				if(isNull(password)){
					mui.alert('密码不能为空','提示','确定',null,'div');
					return;
				}
				if(isNull(repassword)){
					mui.alert('确认密码不能为空','提示','确定',null,'div');
					return;
				}
				if(password!==repassword){
					mui.alert('两次密码不相同','提示','确定',null,'div');
					return;
				}
				
				var sendObj = {
					username:username,
					nick:nick,
					password:password
				};
				loading = weui.loading("加载中");
				$.ajax({
					url:url+'/register',
					type:'GET',
					data:sendObj,
					dataType:'json',
					timeout:8000,
					success:function(data){
						console.log(data);
						loading.hide();
						if(data.code==200){
							mui.alert('注册成功','提示','确定',function(){
								window.history.back(-1);
							},'div');
						}else{
							mui.alert(data.msg,'提示','确定',null,'div');
						}
					},
					error:function(xhr, errorType, error,msg){
						loading.hide();
						mui.alert(errMsg,'提示','确定',null,'div');
					}
				})
			}
	    }
	});
});
