const user = Bmob.Query('_User');


export const login = (phone,password,successCb,errorCb) => {
   Bmob.User.login(phone,password).then(res => {
     console.log('login success',res);
     successCb && successCb(res);
   }).catch(err => {
    console.log(err);
    errorCb && errorCb(err);
  });
}

export const register = (params,successCb,errorCb) => {
   // password = password ? password :'123456';
   Bmob.User.register(params).then(res => {
    successCb && successCb(res);
  }).catch(err => {
   console.log(err);
   errorCb && errorCb(err);
  });
}


export const getUserInfoById = (id,succesCb,errorCb) => {
    user.equalTo("username", "==", id);
    user.find().then(res => {
      succesCb && succesCb(res[0]);
    }).catch(err => {
      console.log(err);
      errorCb && errorCb(err);
    });
}

export const updateUserInfo = (userInfo,succesCb,errorCb) => {
    user.get(userInfo.objectId).then(res => {
      console.log(res)
      res.set('school',userInfo.school);
      res.set('place',userInfo.place)
      res.set('nickname',userInfo.nickname)
      res.save();
      succesCb && succesCb(res);
    }).catch(err => {
      console.log(err);
      errorCb && errorCb();
    })
}

//获取配送员列表
export const getCourierList = (succesCb,errorCb) => {
    user.equalTo("uLevel", "==", 2);
    user.find().then(res => {
      console.log('getCourierList',res);
      succesCb && succesCb({data:res});
    }).catch(err => {
      console.log(err);
      errorCb && errorCb(err);
    });
}