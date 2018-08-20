// const products = Bmob.Object.extend("Products");
const query = Bmob.Query('Products');
/**
 * 获取商品列表
 */
export const getProducts = (succesCb,errorCb) => {
	query.find({
      success: function(results) {
        // for (var i = 0; i < results.length; i++) {
        //   var object = results[i];
        //   that.products.push(object);
        // }
        succesCb && succesCb(results);
      },
      error: function(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      	errorCb && errorCb(error);
      }
    });
};
/**
 * 获取商品菜单
 */
export const getMenuList = (succesCb,errorCb) => {
	let menuList = [];
	// query.select("classify,class_id");
	query.statTo("groupby", "class_id,classify");//去重
	query.find().then((res)=>{
		console.log('getMenuList results',res);
        for (var i = 0; i < res.length; i++) {
          menuList.push(res[i]);
        }
        succesCb && succesCb({data:menuList});
	},err=>{
		console.log("查询失败: " + error.code + " " + error.message);
      	errorCb && errorCb(error);
	});
};



/**
 * 获取商品菜单
 */
export const getGoodsByClassId = (params,succesCb,errorCb) => {
	let data = [];
	query.equalTo("class_id", "==", params.class_id);
	query.find().then((res)=>{
		console.log('getMenuList results',res);
        for (var i = 0; i < res.length; i++) {
          data.push(res[i]);
        }
        succesCb && succesCb({data:data});
	},err=>{
		console.log("查询失败: " + error.code + " " + error.message);
      	errorCb && errorCb(error);
	});
};
