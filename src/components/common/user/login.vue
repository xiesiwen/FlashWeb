<template>
    <div class="loginContainer">
        <form class="loginForm">
            <section class="input_container">
                <input type="text" placeholder="手机号" v-model="userAccount">
            </section>
            <section class="input_container" v-if='shouldInputPwd'>
                <input type="text" placeholder="密码" v-model="password">
            </section>
            <div class="login_container" @click="mobileLogin">查询</div>
        </form>
         
         <p class="login_tips">
            温馨提示：输入手机号查询订单
        </p>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import {login,getCourierList} from '../../../service/userData.js'

    export default {
        props:['loginType'],
        data(){
            return {
                userInfo: null, //获取到的用户信息
                userAccount: null, //用户名
                password:null,//密码
            }
        },
        computed: {
            shouldInputPwd:function(){
                let special = [2,3,5];
                if(~special.indexOf(this.loginType)){//找到
                    return true;
                }else{
                    this.password = '123456';
                    return false;
                }
            }
            
        },
        methods: {
            ...mapMutations([
                'RECORD_USERINFO','OUT_LOGIN',
            ]),
            //发送登录信息
            mobileLogin(){
                let _this = this;
                if (!this.rightPhoneNumber(this.userAccount)) {
                    alert('请输入正确的手机号');
                    return
                }

                //用户名登录
                login(this.userAccount,this.password,res =>{
                    console.log('登录成功',res);
                    _this.userInfo = {...res};
                    // _this.userInfo['phone'] = _this.userInfo.username;
                    _this.RECORD_USERINFO(_this.userInfo);
                    _this.$emit('success');
                },err => {
                    console.log('用户不存在');
                });
            },
           
            //判断手机号码
            rightPhoneNumber: function (phoneNumber){
                return /^1\d{10}$/gi.test(phoneNumber)
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import '../../../style/mixin';

    .loginContainer{
        // padding-top: 1.95rem;
        background-color:#fff;
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .change_login{
        position: absolute;
        @include ct;
        right: 0.75rem;
        @include sc(.7rem, #fff);
    }

    .loginForm{
        background-color: #fff;
        margin-top: .6rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
                @include sc(.7rem, #666);
            }
            button{
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
        }
        .phone_number{
            padding: .3rem .8rem;
        }
        .captcha_code_container{
            height: 2.2rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .2rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2rem;
                    justify-content: center;
                    p{
                        @include sc(.55rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2rem;
                    }
                }
            }
        }
    }
    .login_tips{
        @include sc(.5rem, $red_2);
        padding: .4rem .6rem;
        line-height: .5rem;
        a{
            color: #3b95e9;
        }
    }
    .login_container{
        @include sc(.7rem, #fff);
        background-color: $green;
        border: 1px;
        border-radius: 0.15rem;
        margin: .5rem .5rem 1rem;
        background-color: #50AF61;
        padding: .3rem 2rem;
        text-align: center;
        display: inline-block;
    }
    .button_switch{
        background-color: #ccc;
        display: flex;
        justify-content: center;
        @include wh(2rem, .7rem);
        padding: 0 .2rem;
        border: 1px;
        border-radius: 0.5rem;
        position: relative;
        .circle_button{
            transition: all .3s;
            position: absolute;
            top: -0.2rem;
            z-index: 1;
            left: -0.3rem;
            @include wh(1.2rem, 1.2rem);
            box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0,0,0,.1);
            background-color: #f1f1f1;
            border-radius: 50%;
        }
        .trans_to_right{
            transform: translateX(1.3rem);
        }
        span{
            @include sc(.45rem, #fff);
            transform: translateY(.05rem);
            line-height: .6rem;
        }
        span:nth-of-type(2){
            transform: translateY(-.08rem);
        }
    }
    .change_to_text{
        background-color: #4cd964;
    }
    .to_forget{
        float: right;
        @include sc(.6rem, #3b95e9);
        margin-right: .3rem;
    }
</style>
