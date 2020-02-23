//自己的服务器
var url = 'http://localhost:8081';
//豆瓣接口apikey
var apikey='0df993c66c0c636e29ecbb5344252a4a';

var errMsg = '网络连接失败,请稍后重试';

//replace方法的升级版,替换所有对应字符串
String.prototype.replaceAll=function(f,e){//吧f替换成e
    var reg=new RegExp(f,"g"); //创建正则RegExp对象   
    return this.replace(reg,e); 
}

//获取浏览器所在端
function getBrowser(){
	function IsPC(){
		var userAgentInfo = navigator.userAgent;
		var Agents = new Array("Android","iPhone","SymbianOS","Windows Phone","iPad", "iPod");  
		var flag = true;
		for(var v = 0;v<Agents.length; v++){
			if(userAgentInfo.indexOf(Agents[v]) > 0){
				flag = false; break;
			}
		}
		return flag;
	}
	var browser = '';
	if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
		//苹果端
		browser = '苹果端';
	}else if(/(Android)/i.test(navigator.userAgent)){
		//安卓端
		browser = '安卓端';
	}else{
		//PC端
		browser = '电脑端';
	};
	return browser;
}

/**
 * 复制内容到粘贴板
 * content : 需要复制的内容
 * message : 复制完后的提示，不传则默认提示"复制成功"
 */
function copyToClip(content, message) {
    var aux = document.createElement("input"); 
    aux.setAttribute("value", content); 
    document.body.appendChild(aux); 
    aux.select();
    document.execCommand("copy"); 
    document.body.removeChild(aux);
    if (message == null) {
        alert("复制成功");
    } else{
        alert(message);
    }
}

// 下载wgt方法
function downloadWgt(){
	// 更新文件 wgt 文件地址
	var wgtUrl = "https://1729176996.github.io/MyH5AppVersion/update.wgt";
    plus.nativeUI.showWaiting("正在更新...");
    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
     if ( status == 200 ) {
          console.log("下载wgt成功："+d.filename);
          installWgt(d.filename); // 安装wgt方法
      } else {
          console.log("下载wgt失败！");
          plus.nativeUI.alert("下载wgt失败！");
      }
      plus.nativeUI.closeWaiting();
  }).start();
}
// 安装wgt方法
function installWgt(path){
	  plus.nativeUI.showWaiting("安装wgt文件...");
	  plus.runtime.install(path,{},function(){
	      plus.nativeUI.closeWaiting();
	      console.log("安装wgt文件成功！");
	      plus.nativeUI.alert("应用资源更新完成！",function(){
	          plus.runtime.restart();
	      });
	  },function(e){ 
	      plus.nativeUI.closeWaiting();
	      console.log("安装wgt文件失败["+e.code+"]："+e.message);
	      plus.nativeUI.alert("安装wgt文件失败["+e.code+"]："+e.message);
	  });
}

function checkVersion(){
	$.ajax({
		url:'https://1729176996.github.io/MyH5AppVersion/version.json',
		type:'get',
		dataType: 'json',
		success:function(data){
			console.log(data);
			if(getBrowser()!='电脑端'){
				// H5 plus事件处理
				function plusReady(){
					// 检查当前版本，与从后台获取的版本作比较，以此判断是否更新     
					plus.runtime.getProperty(plus.runtime.appid,function(inf){
						// 当前版本
						var wgtVersion = inf.version;
						// 如果有新版本，则提示需要更新
						if( data.version > wgtVersion ){
							var updatedContent = '';
							if(data.updatedContent&&data.updatedContent.length>0){
								updatedContent += '<p style="text-align: left;margin-left: 1em;">更新内容:</p><p style="text-align: left;margin-left: 1em;">';
								for(key in data.updatedContent){
									updatedContent += '<p style="text-align: left;margin-left: 2em;">'+(key*1+1)+'.'+data.updatedContent[key]+'</p>';
								}
								updatedContent += '</p>';
							}else{
								updatedContent += '检查更新';
							}
							mui.confirm(updatedContent,'发现新版本，是否更新',['确定','取消'],function(e){
								if(e.index==0){
									downloadWgt(); // 下载wgt方法
								}else{
									return;
								}
							},'div');
						}else{
							return;
						}
					});
				}
				if(window.plus){
					plusReady();
				}else{
					document.addEventListener('plusready',plusReady,false);
				}
			}
		},
		error:function(xhr, errorType, error,msg){
			mui.alert(msg,'提示','确定',null,'div');
		}
	})
}

/**
 * 判定是否为空
 * @param {Object} obj
 */
function isNull(obj){
	if(obj===null||obj===undefined||obj===''){
		return true;
	}else{
		return false;
	}
}