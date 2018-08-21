 <template>
  <div class="order_detail_page">
        <head-top head-title="订单详情" go-back='true'></head-top>
        <section v-if="!showLoading" id="scroll_section" class="scroll_container">
            <section class="option-wrap" v-if='showFinishBtn||showSetDisInput'>
                <section v-if="showSetDisInput" class="input_item">
                    <label class="item_label" for="">分配配送员</label>
                    <section class="item_input" >
                        <select class="dis-select" name="" id="" v-model="disId">
                            <option :value="diser.username" v-for='diser in disterList'>{{diser.nickname}}</option>
                        </select>
                        <input class="dis-select" type="text" placeholder="或者直接填写派送员手机号" v-model="disId">
                    </section>
                    <div class="btn" @click="setDistributor">确定</div>
                </section>
                <section class="input_item" v-if='showFinishBtn'>
                    <label class="item_label" for="">设置订单完成</label>
                    <section class="item_input" >
                        <div class="btn"  @click="finishedOrder">订单完成</div>
                    </section>
                </section>
            </section>
            <!-- </section> -->
            <section class="scroll_insert">
                <section class="order_detail_style">
                    <header>订单信息</header>
                    <section class="item_style">
                        <p class="item_left">订单号：</p>
                        <div class="item_right">
                            <p>{{orderData.orderId}}</p>
                        </div>
                    </section>
                    <section class="item_style" v-if='showSetDisInput'>
                        <p class="item_left">收益：</p>
                        <div class="item_right">
                            <p><span class="c-red">¥{{orderData.income}}</span></p>
                        </div>
                    </section>
                    <section class="item_style">
                        <p class="item_left">订单状态：</p>
                        <div class="item_right">
                            <p>{{orderData|orderState}}</p>
                        </div>
                    </section>
                    <section class="item_style">
                        <p class="item_left">支付方式：</p>
                        <div class="item_right">
                            <p>货到付款</p>
                        </div>
                    </section>
                     <section class="item_style" v-if='orderData.distributorId'>
                        <p class="item_left">联系配送员:</p>
                        <div class="item_right">
                            <p>{{orderData.distributorId}}</p>
                        </div>
                    </section>
                    
                    <section class="item_style">
                        <p class="item_left">下单时间：</p>
                        <div class="item_right">
                            <p>{{orderData.createdAt}}</p>
                        </div>
                    </section>
                </section>
                <section class="food_list order_detail_style" v-if='productList.length'>
                    <header>商品信息</header>
                    <ul class="food_list_ul">
                        <li v-for="item in productList">
                            <p class="food_name ellipsis">{{item.name}}</p>
                            <div class="quantity_price">
                                <span>X{{item.num}}</span>
                                <span>¥{{item.price}}</span>
                            </div>
                        </li>
                    </ul>
                    <div class="pay_ment" v-if='orderData.preference'>
                        <span>优惠信息：全场每满{{discountMax}}减{{discountNum}}元</span>
                        </div>
                    <div class="pay_ment">
                    合计: <span class="c-price">¥{{orderData.price.toFixed(2)}}</span>
                    <span class="c-red" v-if='orderData.preference'>（已减{{orderData.preference}}元）</span></div>
                </section>
                <section class="order_detail_style">
                    <header>配送信息</header>
                    <section class="item_style">
                        <p class="item_left">姓名：</p>
                        <div class="item_right">
                            <p>{{orderData.username}}</p>
                        </div>
                    </section>
                    <section class="item_style">
                        <p class="item_left">手机号：</p>
                        <div class="item_right">
                            <p>{{orderData.studentId}}</p>
                        </div>
                    </section>
                    <section class="item_style">
                        <p class="item_left">送货地址：</p>
                        <div class="item_right">
                            <p>{{orderData.school}}／{{orderData.place}}</p>
                        </div>
                    </section>
                    <section class="item_style">
                        <p class="item_left">备注:</p>
                        <div class="item_right">
                            <p>{{orderData.comments}}</p>
                        </div>
                    </section>
                </section>
                
            </section>
        </section>
        <foot-guide></foot-guide>
        <transition name="loading">
            <loading v-if="showLoading"></loading>
        </transition>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import headTop from '../../components/common/header/head'
    import {getOrderDetailById,finishOrder,setDistributor} from '../../service/orderBmob.js'
    import {getCourierList} from '../../service/userData.js'
    import loading from '../../components/common/loading'
    import footGuide from '../../components/common/footer/footGuide.vue'
    import BScroll from 'better-scroll'

    export default {

      data(){
            return{
                showLoading: true, //显示加载动画
                orderData: null,
                productList:[],
                orderId:null,
                disId:'',
                disterList:[],//配送员列表
            }
        },
        created(){
            this.orderId = this.$route.query.orderId;
        },
        mounted(){
            if(!this.userInfo){
                this.INIT_USERINFO();
            }
            this.initData();
        },
        components: {
            headTop,
            loading,
            'foot-guide':footGuide
        },
        computed: {
            ...mapState([
                'orderDetail','userInfo','discountMax','discountNum',
            ]),
            showFinishBtn:function(){
                return ~[2,3,5].indexOf(this.userInfo.uLevel);
            },
            showSetDisInput:function(){//管理员
                this.getDisterList();
                return ~[3,5].indexOf(this.userInfo.uLevel);
            },
        },
        methods: {
            ...mapMutations([
                'INIT_USERINFO'
                ]),
            initData(){
                let _this = this;
                _this.showLoading = true;
                if (this.userInfo && this.userInfo.phone && this.orderId) {
                    getOrderDetailById(this.userInfo, +this.orderId,res => {
                        _this.orderData = res.data;
                        _this.productList = JSON.parse(res.data.products);
                        _this.showLoading = false;
                        _this.$nextTick(() => {
                            new BScroll('#scroll_section', {  
                                deceleration: 0.001,
                                bounce: true,
                                swipeTime: 1800,
                                click: true,
                            }); 
                    })
                    },err => {
                        _this.showLoading = false;
                    });
                }else{
                    this.showLoading = false;
                }
                
            },
            getDisterList:function(){
                getCourierList(res=>{
                    this.disterList = res.data;
                });
            },
            //设置派送员
            setDistributor:function(){
                let _this = this;
                if(~[3,5].indexOf(this.userInfo.uLevel)){
                        setDistributor(this.orderData.objectId,this.disId,res =>{
                            _this.initData();
                            alert('设置派送员成功');
                        });
                    }

            },
            //完成订单
            finishedOrder:function(){
                let _this = this;
                if(confirm('确定设置订单已完成？')){
                    if(this.userInfo.uLevel == 2 && this.userInfo.phone == this.orderData.distributorId){
                        finishOrder(this.orderData.objectId,res =>{
                            console.log('设置订单成功');
                            _this.initData();
                        });
                    }else if(this.userInfo.uLevel == 3 || this.userInfo.uLevel == 5){
                        finishOrder(this.orderData.objectId,res =>{
                            console.log('设置订单成功');
                            _this.initData();
                        });
                    }
                }
            },
        },
        filters:{
            orderState:function(order){
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
        },
        watch: {
            'userInfo.phone': function (value) {
                if (value) {
                    this.initData();
                }
            }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
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
    .option-wrap{
        background-color:#fff;
        padding:10px;
        font-size: 0.7rem;
        text-align: left;
        border-bottom:1px solid #f1f1f1;
        .input_item{
            display:flex;
        }
        .item_label{
            flex:1,
        }
        .item_input{
            flex:2;
        }
        .dis-select{
            width: 80%;
            height: 1.5rem;
            background-color: #f8f8f8;
            margin-bottom: 5px;
        }
        .btn{
            padding: 0 20px;
            background-color: $green;
            border-radius: 5px;
            color: #fff;
            display: inline-flex;
            height: 1.5rem;
            line-height: 1.5rem;
        }
    }
  
    .order_detail_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f1f1f1;
        z-index: 202;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .scroll_container{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-top: 1.95rem;
        overflow-y: auto;
    }
    .scroll_insert{
        padding-bottom: 3rem;
    }
    .order_titel{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: .7rem;
        background-color: #fff;
        margin-bottom: 0.5rem;
        img{
            border: 0.05rem solid $themeColor;
            border-radius: 50%;
            @include wh(3rem, 3rem);
        }
        p:nth-of-type(1){
            @include sc(.9rem, #333);
            font-weight: bold;
            margin-top: .4rem;
        }
        p:nth-of-type(2){
            @include sc(.55rem, #999);
            width: 10rem;
            margin-top: .3rem;
            text-align: center;
        }
        .order_again{
            @include sc(.6rem, $themeColor);
            margin-top: .5rem;
            border: 0.025rem solid $themeColor;
            padding: .15rem .4rem;
            border-radius: .1rem;
        }
    }
    .food_list{
        background-color: #fff;
        .food_list_header{
            @include fj;
            align-items: center;
            padding: .2rem .5rem;
            border-bottom: 1px solid #f5f5f5;
            .shop_name{
                img{
                    @include wh(1.2rem, 1.2rem);
                    vertical-align: middle;
                    margin-right: .2rem;
                }
                span{
                    @include sc(.75rem, #333);
                    font-weight: bold;
                }
            }
            svg{
                @include wh(.6rem, .6rem);
                fill: #666;
            }
        }
        .food_list_ul{
            text-align: left;
            li{
                @include fj;
                align-items: center;
                padding: .1rem .5rem;
                line-height: 1.2rem;
                .food_name{
                    @include sc(.6rem, #666);
                    flex: 3;
                }
                .quantity_price{
                    flex: 1;
                    @include fj;
                    align-items: center;
                    span:nth-of-type(1){
                        @include sc(.6rem, #ccc);
                    }
                    span:nth-of-type(2){
                        @include sc(.6rem, #666);
                    }
                }
            }
        }
        .deliver_fee{
            @include fj;
            align-items: center;
            padding: 0 .5rem;
            line-height: 2rem;
            border-top: 1px solid #f5f5f5;
            span{
                @include sc(.6rem, #666);
            }
        }
        .pay_ment{
            @include sc(.6rem, #333);
            border-top: 1px solid #f5f5f5;
            font-weight: bold;
            line-height: 2rem;
            text-align: right;
            padding-right: .5rem;
        }
    }
    .order_detail_style{
        background-color: #fff;
        margin-top: 0.5rem;
        header{
            @include sc(.75rem, #333);
            padding: .3rem;
            border-bottom: 1px solid #f5f5f5;
        }
        .item_style{
            display: flex;
            padding: .1rem .5rem;
            p{
                @include sc(.65rem, #666);
                line-height: 1rem;
            }
        }
    }
    .loading-enter-active, .loading-leave-active {
        transition: opacity .7s
    }
    .loading-enter, .loading-leave-active {
        opacity: 0
    }
    
</style>
