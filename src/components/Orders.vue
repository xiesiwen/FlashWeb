 <template>
    <div class="order_page">
        <head-top :head-title="headTitle" go-back='true'></head-top>
        <userLogin @success='loginSuccess' v-if='! (userInfo && userInfo.phone)' :login-type='userType'></userLogin>
        <section class="state-wrap" v-if='userInfo && ~[3,5].indexOf(userInfo.uLevel)'>
             <span class="btn-state" :class='{cur:this.orderState == 1}' @click='setOrderState(1)'>待接单</span>
             <span class="btn-state" :class='{cur:this.orderState == 2}' @click='setOrderState(2)'>派送中</span>
             <span class="btn-state" :class='{cur:this.orderState == 3}' @click='setOrderState(3)'>已完成</span>
        </section>
        <ul class="order_list_ul" v-if='orderList && orderList.length'>
            <li class="order_list_li" v-for="item in orderList" :key="item.orderId">
                <section class="order_item_right">
                    <section @click="showDetail(item)">
                        <header class="order_item_right_header">
                            <section class="order_header">
                                <h4 >
                                    <span class="ellipsis">订单编号：{{item.orderId}} </span>
                                </h4>
                            </section>
                            <!-- 订单状态 -->
                            <p class="order_status">
                                {{item|getStatus}}
                            </p>
                        </header>
                        <section class="order_basket">
                            <p class="order_name ellipsis">{{item|getFirstProductName}}{{item|contProductsNum}}</p>
                            <p class="order_amount">¥{{item.price.toFixed(2)}}</p>
                        </section>
                    </section>

                    <div class="order_again">
                        <p class="order_time">{{item.createdAt}}</p>
                        <span class="buy_again" @click='showDetail(item)'>查看订单</span>
                    </div>
                </section>
            </li>
        </ul>
        <ul v-else class="order_list_ul"><li class="order_empty">暂无订单</li></ul>
        <!-- <foot-guide></foot-guide> -->
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import loading from './common/loading'
    import headTop from './common/header/head.vue'
    import {queryOrderById,
        queryDisOrder,
        queryAllOrder} from '../service/orderBmob.js'
        
    import {addTrack} from '../service/accessData.js'
    import {login,getCourierList} from '../service/userData.js'
    import {loadMore} from './common/mixin'
    import footGuide from './common/footer/footGuide.vue'
    import userLogin from './common/user/login.vue'

    export default {
      data(){
            return{
                orderList: null, //订单列表
                offset: 0, 
                preventRepeat: false,  //防止重复获取
                showLoading: true, //显示加载动画
                phone:null,
                pagesize:10,
                userType:null,
                headTitle:'订单列表',
                orderState:1,//默认等待接单
            }
        },
        created(){
            let _this = this;
            this.userType = +(this.$route.query.usertype?this.$route.query.usertype:1);
            // this.userType = +(this.$route.query.usertype?this.$route.query.usertype:1);
            if(this.$route.query.logout == 1){
                console.log('登录成功');
                this.OUT_LOGIN();
                this.showLoading = false;
            }
            this.INIT_USERINFO();//初始化用户信息
            addTrack({
                phone:_this.userInfo.phone,
                action:'orders',
               });

        },
        mounted(){
            if(this.login){
                this.initData();
            }else{
                this.showLoading = false;
            }
        },
        mixins: [loadMore],
        components: {
            headTop,
            footGuide,
            loading,
            userLogin,
        },
        computed: {
            ...mapState([
                'userInfo', 'login'
            ]),
        },
        methods: {
             ...mapMutations([
               'SAVE_ORDER','INIT_USERINFO','OUT_LOGIN'
            ]),
            //初始化获取信息
            initData(){
              let _this = this;
              if(this.userInfo){
                switch(this.userInfo.uLevel){
                    case 1:this.getOrderList();break;
                    case 2: this.getDistributorOrder();break;
                    case 3:;
                    case 5:this.getAllOrder();break;
                    default :this.getOrderList();
                }
              }
            },
            setOrderState:function(state){
                if(state != this.orderState){
                    this.orderState = state;
                    this.initData();
                }
               
            },
            //查询配送订单
            getDistributorOrder:function(){
                let _this = this;
                this.headTitle = '待配送订单'
                queryDisOrder(this.userInfo.phone, this.offset, this.pagesize, res =>{
                  console.log('queryDisOrder',res);
                  _this.orderList = [...res.data];
                   _this.hideLoading();
               });
            },
            //查询所有订单，管理员才有 ulevel3,5
            getAllOrder:function(){
                let _this = this;
                this.headTitle = '管理员订单'
                queryAllOrder(this.orderState,this.offset, this.pagesize, res =>{
                  console.log('getAllOrder',res);
                  _this.orderList = [...res.data];
                   _this.hideLoading();
               });
            },
            //普通用户查询订单
            getOrderList:function(){
              let _this = this;
              if(this.userInfo.phone){
                queryOrderById(this.userInfo.phone, this.offset, this.pagesize, res =>{
                  console.log('getOrderList',res);
                  _this.orderList = [...res.data];
                   _this.hideLoading();
               });
              }
            },
            //加载更多
            loaderMore(){
              console.log('do loaderMore');
                if (this.preventRepeat) {
                    return;
                }
                this.preventRepeat = true;
                this.showLoading = true;
                this.offset += this.pagesize;
                if(this.userInfo.phone){
                  queryOrderById(this.phone, this.offset, this.pagesize, res =>{
                    _this.orderList = [..._this.orderList,...res.data];
                    _this.hideLoading();
                 }, err =>{
                    _this.hideLoading();
                 });

                }else{
                  _this.hideLoading();
                }
                if (res.length < this.pagesize) {
                    return
                }
                this.preventRepeat = false;
            },
            loginSuccess:function(){
              this.initData();
              window.location.href = '/#/orders'
            },
             getCourierList:function(){
                getCourierList();
            },
            //显示详情页
            showDetail(item){
                this.SAVE_ORDER(item);//保存订单信息
                this.preventRepeat = false;
                this.$router.push({path:'/orderDetail',query:{orderId:item.orderId}});
            },
            //生产环境与发布环境隐藏loading方式不同
            hideLoading(){
                this.showLoading = false;
            },
        },
        watch: {
            userInfo: function (value) {
                if (value && value.phone) {
                    this.initData();
                }
            },
            // 如果路由有变化，会再次执行该方法
            "$route": "initData"
        },
        filters:{
          getStatus:function(order){
                if(order.done){
                    return '已完成';
                }else{
                    if(order.distributorId){
                        return '派送中';
                    }else{
                        return '待接单'
                    }
                }                
            },
          getFirstProductName:function(item){
            let products = JSON.parse(item.products);
            if(products.length){
                return products[0].name;
            }

            return '生活用品'
          },
          contProductsNum:function(item){
            let products = JSON.parse(item.products);
            if(products.length){
                return `等${products.length}件商品`
            }
            return ''
          },
        }
    }
</script>
  
<style lang="scss" scoped>
    @import '../style/mixin.scss';
    .order_page{
        background-color: #F5F5F5;
        margin-bottom: 3rem;
        padding-top: 1.95rem;
        overflow-y: auto;
        p, span, h4{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .state-wrap{
        padding:.3rem 0;
    }
    .btn-state{
        font-size: 0.55rem;
        color: $blue;
        border: 0.025rem solid $blue;
        padding: .2rem 1rem;
        border-radius: .15rem;
        &.cur{
           background-color:$blue;
           color:#fff; 

        }
    }
    .order_list_ul{
        
        .order_empty{
            font-size: 0.7rem;
            text-align: center;
            padding: 10px;
        }
        .order_list_li{
            background-color: #fff;
            display: flex;
            margin-bottom: 0.5rem;
            padding: .6rem .6rem 0;
            .restaurant_image{
                @include wh(2rem, 2rem);
                margin-right: 0.4rem;
            }
            .order_item_right{
                flex: 5;
                .order_item_right_header{
                    border-bottom: 0.025rem solid #f5f5f5;
                    padding-bottom: .3rem;
                    @include fj;
                    .order_header{
                        h4{
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            @include sc(.75rem, #333);
                            line-height: 1rem;
                            width: 9rem;

                            .arrow_right{
                                @include wh(.4rem, .4rem);
                                fill: #ccc;
                                margin-right: .2rem;
                            }
                        }
                       
                    }
                    .order_status{
                        @include sc(.6rem, #333);
                    }
                }
                .order_basket{
                    @include fj;
                    line-height: 2rem;
                    border-bottom: 0.025rem solid #f5f5f5;
                    .order_name{
                        @include sc(.6rem, #666);
                        width: 10rem;
                        text-align: left;
                    }
                    .order_amount{
                        @include sc(.6rem, $red_1);
                        font-weight: bold;
                    }
                }
                 .order_time{
                      @include sc(.55rem, #999);
                      float:left;
                  }
                .order_again{
                    text-align: right;
                    line-height: 1.6rem;
                    .buy_again{
                        @include sc(.55rem, $themeColor);
                        border: 0.025rem solid $themeColor;
                        padding: .1rem .2rem;
                        border-radius: .15rem;
                    }
                }
            }
        }
    }
    .loading-enter-active, .loading-leave-active {
        transition: opacity .7s
    }
    .loading-enter, .loading-leave-active {
        opacity: 0
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
