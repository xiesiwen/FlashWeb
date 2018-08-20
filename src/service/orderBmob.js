// const products = Bmob.Object.extend("Products");
const order = Bmob.Query('Orders');
/**
 * 新增订单
 */
export const addOrder = (data,succesCb,errorCb) => {
      console.log('data',data);
      order.set("studentId", data.phone);
      order.set("school", data.school);
      order.set("place", data.place);
      order.set("products", JSON.stringify(data.goods));
      order.set("price", data.price);
      order.set("income", +data.income);
      order.set("comments", data.comments);
      order.set('username',data.nickname);
      order.set('preference',data.preference);
      order.set("done", false);
	order.save().then(res=>{
    console.log(res);
    succesCb && succesCb(res);
  },err=>{
      console.log(err);
      errorCb && errorCb();
  });
};

/**
 * 手机号查询订单
 */
export const queryOrderById = (id, offset, pagesize, succesCb,errorCb) => {
      if(!id) errorCb && errorCb({errmsg:'参数错误'});
      // 如果要查询某个属性等于某个值，示例代码如下：
      order.equalTo("studentId", "==", id);
      // 返回最多10条数据
      order.limit(pagesize);
      order.skip(offset);
      // 对score字段降序排列
      order.order("-createdAt");
      order.find().then(res=>{
        console.log(res);
        succesCb && succesCb({data:res});
      },err=>{
          console.log(err);
          errorCb && errorCb(err);
      });
};


//配送员订单
export const queryDisOrder = (disId, offset, pagesize, succesCb,errorCb) => {
      // 如果要查询某个属性等于某个值，示例代码如下：
      order.equalTo("distributorId", "==", disId);
      order.equalTo("done", "!=", true);
      // 返回最多10条数据
      order.limit(pagesize);
      order.skip(offset);
      // 对score字段降序排列
      order.order("-createdAt");
      order.find().then(res=>{
        console.log(res);
        succesCb && succesCb({data:res});
      },err=>{
          console.log(err);
          errorCb && errorCb();
      });
};

export const queryAllOrder = (state,offset, pagesize, succesCb,errorCb) => {
      if(state == 3){//订单已完成
        order.equalTo("done", "==", true);
      }else if(state == 2){//派送中
        order.equalTo("done", "==", false);
        let q1 = order.equalTo("distributorId",'!=',null);
        let q2 = order.equalTo("distributorId",'!=','');
        order.or(q1, q2);
      }else if(state == 1){//等待接单
        order.equalTo("done", "==", false);
        let q1 = order.equalTo("distributorId",'==',null);
        let q2 = order.equalTo("distributorId",'==','');
        order.or(q1, q2);
      }
      // 返回最多10条数据
      order.limit(pagesize);
      order.skip(offset);
      // 对score字段降序排列
      order.order("-createdAt");
      order.find().then(res=>{
        console.log(res);
        succesCb && succesCb({data:res});
      },err=>{
          console.log(err);
          errorCb && errorCb();
      });
};

//订单号查订单详情
export const getOrderDetailById = (userInfo,orderId,succesCb,errorCb) => {
      // 如果要查询某个属性等于某个值，示例代码如下：
      if(userInfo){
        if(!~[2,3,5].indexOf(userInfo.uLevel)){//普通用户只能查自己的订单
          if(!userInfo.phone) errorCb && errorCb({errmsg:'参数错误'});
          order.equalTo("studentId", "==", userInfo.phone);//要两个一起查
        }
        order.equalTo("orderId", "==", orderId);
        order.find().then(res=>{
          console.log(res);
          succesCb && succesCb({data:res[0]});
        },err=>{
            console.log(err);
            errorCb && errorCb();
        });
      }
      
};

//设置订单完成
export const finishOrder = (objectkey,succesCb,errorCb) => {
        order.get(objectkey).then(res => {
          res.set('done',true);
          res.save();
          succesCb && succesCb({data:res[0]});
        }).catch(err => {
          console.log(err);
          errorCb && errorCb();
        })
};

//设置订单完成
export const setDistributor = (objectkey,disId,succesCb,errorCb) => {
        order.get(objectkey).then(res => {
          res.set('distributorId',disId);
          res.save();
          succesCb && succesCb({data:res[0]});
        }).catch(err => {
          console.log(err);
          errorCb && errorCb();
        })
};

