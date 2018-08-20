 <template>
     <div>
        <div class="address_page">
            <!-- <head-top head-title="填写收货信息" go-back='true'></head-top> -->
            <section class="page_text_container">
                <h1 class="address_title">订单信息</h1>
                <section class="section_list">
                    <span class="section_left">总金额</span>
                    <section class="section_right">
                    <span class="c-price">¥{{totalPrice}}</span>
                    <span class="c-red" v-if='discount'>(已优惠{{discount}})</span>
                    </section>
                </section>
                 <section class="section_list">
                    <span class="section_left">名称</span>
                    <section class="section_right">
                        <input type="text" name="name" placeholder="你的名字" v-model="name" class="input_style">
                    </section>
                </section>
                <section class="section_list">
                    <span class="section_left">手机</span>
                    <section class="section_right">
                        <div class="phone_add">
                            <input type="text" name="phone" placeholder="你的手机号" v-model="phone" class="input_style">
                        </div>
                    </section>
                </section>
                <section class="section_list">
                    <span class="section_left">学校</span>
                    <section class="section_right">
                        <select v-model="myschool" class="input_style" placeholder='请选择学校'>
                            <option v-for='(item,index) in schoolList' :value="item.name">{{item.name}}</option>
                      </select>
                    </section>
                </section>
                <section class="section_list">
                    <span class="section_left">宿舍</span>
                    <section class="section_right">
                        <input type="text" name="address" placeholder="如 南三219" v-model="address" class="input_style">
                    </section>
                </section>
                <section class="section_list">
                    <span class="section_left">备注</span>
                    <section class="section_right">
                        <textarea name="remarks" placeholder="给卖家留言" v-model="remarks" class="input_style remarks"> </textarea>
                    </section>
                </section>
                <section class="section_list">
                    <span class="section_left">配送方式</span>
                    <section class="section_right">
                        货到付款
                    </section>
                </section>
            </section>
            <div class="determine" @click="addAddress">确认订单</div>
            <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        </div>
        <div class="screen_mask" @click='close'></div>
     </div>
    
</template>

<script>
    import headTop from './header/head'
    import {mapState, mapMutations} from 'vuex'
    import {
        getUserInfoById,
        login,
        register,
        updateUserInfo} from '../../service/userData.js'
    import alertTip from './alertTip'

    export default {
        props:['discount'],
      data(){
            return{
                name: null, //姓名
                phone: null, //电话
                myschool:null,
                address: null, //详细地址
                remarks: '', //备注
                showAlert:false,
            }
        },
        created(){
            let _this = this;
            this.name = this.userInfo.nickname;
            this.phone = this.userInfo.phone;
            this.myschool = this.userInfo.school;
            this.address = this.userInfo.place;
        },
        mounted:function(){
            console.log('userInfo',this.userInfo);
        },
        components: {
            headTop,
            alertTip,
        },
        computed: {
            ...mapState([
               'userInfo','schoolList','totalPrice','cartList'
            ]),
        },
        methods: {
            ...mapMutations([
                'CONFIRM_ADDRESS','RECORD_USERINFO']),
            //保存地址信息
            addAddress(){
                let _this = this;
                if(this.totalPrice <= 0){
                    this.showAlert = true;
                    this.alertText = '金额错误，下单失败';
                }else if(!this.name){
                    this.showAlert = true;
                    this.alertText = '请输入姓名'
                }else if(!this.rightPhoneNumber(this.phone)){
                    this.showAlert = true;
                    this.alertText = '请输入正确电话号码'
                }else if(!this.myschool){
                    this.showAlert = true;
                    this.alertText = '请选择学校'
                }else if(!this.address){
                    this.showAlert = true;
                    this.alertText = '请填写宿舍地址'
                }else{
                    this.alertText = '';
                }
                if(this.alertText) return;
                getUserInfoById(this.phone,res => {
                    //更新用户信息
                    console.log('getUserInfoById',res);
                    let _userinfo = {...res};
                    _userinfo.school = _this.myschool;
                    _userinfo.nickname = _this.name;
                    _userinfo.place = _this.address;
                    _this.RECORD_USERINFO(_userinfo);//保存用户信息
                    updateUserInfo(_this.userInfo,res =>{
                        console.log('更新用户信息成功');
                        _this.$emit('submit',{remarks:_this.remarks});
                    });
                },err => {
                    //注册用户
                     _this.registerUser();
                });
            },
            registerUser:function(){
                let _this = this;
                register({
                    username:_this.phone,
                    nickname:_this.name,
                    password:'123456',
                    uLevel:1,//普通用户
                    school:_this.myschool,
                    place:_this.address,//宿舍地址

                },res => {
                    console.log('新用户注册成功');
                    getUserInfoById(this.phone,res => {
                        //更新用户信息
                        _this.RECORD_USERINFO(res);//保存用户信息
                        _this.$emit('submit',{remarks:_this.remarks});
                    });
                });
            },
            updateUserInfo:function(){
                updateUserInfo(this.userInfo,res =>{
                    console.log('更新用户信息成功');
                })
            },
            doLogin:function(successFn,failFn){
                login(_this.phone,'123456',res=>{
                        let _userinfo = {...res};
                        _userinfo.school = _this.myschool;
                        _userinfo.nickname = _this.name;
                        _userinfo.place = _this.address;
                        //跟新用户信息
                        _this.RECORD_USERINFO(_userinfo);//保存用户信息
                        updateUserInfo(_this.userInfo,res =>{
                            console.log('更新用户信息成功');
                            successFn && successFn();
                        })

                    },err => {
                        successFn && successFn(err);
                    })
            },
            close:function(){
                this.$emit('close');
            },
            //判断手机号码
            rightPhoneNumber: function (phoneNumber){
                return /^1\d{10}$/gi.test(phoneNumber)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    
    .address_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        /*bottom: 0;*/
        background-color: #fff;
        z-index: 204;
        padding-top: 1.95rem;
        position: fixed;
        padding: 10px 0;
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .address_title{
        font-size:0.7rem;
    }
    .page_text_container{
        background-color: #fff;
        padding: 0 .7rem;
    }
    .section_list{
        display: flex;
        border-bottom: 0.025rem solid #f5f5f5;
         @include sc(.5rem, #333);
        .section_left{
           
            flex: 2;
            line-height: 1.5rem;
        }
        .section_right{
            flex: 5;
            text-align: left;
            line-height: 1.5rem;
            .input_style{
                width: 100%;
                @include sc(.5rem, #999);
                    height: 1.2rem;
                    line-height: 1.2rem;
                    background-color: #f8f8f8;
                    padding: 0px 5px;
                    border-radius: 5px;
            }
            .remarks{
                    height: 3rem;
            }
            .phone_bk{
                border-top: 0.025rem solid #f5f5f5;
            }
            .phone_add{
                @include fj;
                align-items: center;
            }
            .choose_sex{
                display: flex;
                line-height: 2.5rem;
                border-top: 0.025rem solid #f5f5f5;
                .choose_option{
                    @include sc(.7rem, #333);
                    display: flex;
                    align-items: center;
                    margin-right: .8rem;
                    svg{
                        margin-right: .3rem;
                        @include wh(.8rem, .8rem);
                        fill: #ccc;
                    }
                    .choosed{
                        fill: #4cd964;
                    }
                }
            }
            .choose_address{
                @include sc(.7rem, #999);
                line-height: 2.5rem;
                border-bottom: 0.025rem solid #f5f5f5;
            }
        }
    }
    .determine{
        background-color: $green;
        @include sc(.7rem, #fff);
        text-align: center;
        margin: 0 .7rem;
        line-height: 1.8rem;
        border-radius: 0.2rem;
        margin-top: .6rem;
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
    .screen_mask{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0,0,0,.3);
        z-index: 99;
    }
</style>
