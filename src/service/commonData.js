const school = Bmob.Query('School');
/**
 * 获取商品列表
 */
export const getSchoolList = (succesCb,errorCb) => {  
  school.select("name,objectId");//去重  
	school.find().then(res=>{
    console.log('getSchoolList',res);
    var data = [];
    for (var i = 0; i < res.length; i++) {
          data.push(res[i]);
        }
    succesCb && succesCb(data);
  },err=>{
      console.log(err);
      errorCb && errorCb();
  });
};

export const login = (phone,successCb,errorCb) => {
   Bmob.User.login(phone,'123456').then(res => {
     console.log('login success',res);
     successCb && successCb(res);
   }).catch(err => {
    console.log(err);
    errorCb && errorCb(err);
  });
}

export const getUserInfo = (succesCb,errorCb) => {
    Bmob.User.users().then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  });
}