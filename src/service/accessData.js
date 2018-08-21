const access = Bmob.Query('Access');
export const addTrack = (data,succesCb,errorCb) => {
	access.set("phone",data.phone);
	access.set("action",data.action);
	access.save();
}