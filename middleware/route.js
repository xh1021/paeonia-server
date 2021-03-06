var path = require('path')
var fs = require('fs')

module.exports = function *(next){
  var mSelf = this

  yield next

	function getPath(routePath){
		return path.join(mSelf.config.path.controller, (routePath || 'index')+'.js')
	}

	var url = this.url.split('?')[0]

	if(url == '/favicon.ico'){
		return;
	}

	if(url == '/'){
		url = path.join(url, this.config.site.homePage || 'index')
	}

	var arr = url.split('/')
	var args = arr.pop()
	var method = 'index'
	var controllerPath = getPath(arr.join('/'))

	if(!fs.existsSync(controllerPath)){
		method = arr.pop()
		controllerPath = getPath(arr.join('/'))
	}

	try{
		var controller = require(controllerPath)
		controller[method] && controller[method].call(this, args)

	}catch(e){
		console.log(e)
	}

}


