<template>
  <div class="shop_container">
    <head-top :head-title="curClassify" :go-back='false'></head-top>
    <section class="discount-info">全场每满{{discountMax}}减{{discountNum}}元</section>
     <section class="food_container">
          <section class="menu_container">
              <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
                  <ul>
                      <li v-if='menuList.length' v-for="(item,index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu: index == menuIndex}" @click="chooseMenu(index)">
                          <span>{{item.classify}}</span>
                          <span class="category_num" v-if="categoryNum[index]">{{categoryNum[index]}}</span>
                      </li>
                  </ul>
              </section>
              <section class="menu_right" ref="menuFoodList">
                  <header class="menu_detail_header" v-if='curClassify'>
                      <section class="menu_detail_header_left">
                          <strong class="menu_item_title">{{curClassify}}</strong>
                          <span class="menu_item_description">{{curClassify}}</span>
                      </section>
                  </header>
                  <ul v-if='goodsList.length' >
                      <li v-for="(good,goodIndex) in goodsList" :key="goodIndex">
                          <section class="menu_detail_list">
                              <goodItem :good-data='good'></goodItem>  
                              <footer class="menu_detail_footer">
                                  <section class="food_price">
                                      <span>¥</span>
                                      <span>{{good.price}}</span>
                                  </section>
                                  <buy-cart :goods='good' @moveInCart="listenInCart" @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>
                              </footer>
                          </section>
                      </li>
                  </ul>
              </section>
          </section>
          <section class="buy_cart_container">
              <section @click="toggleCartList" class="cart_icon_num">
                  <div class="cart_icon_container" :class="{cart_icon_activity: totalPrice > 0, move_in_cart:receiveInCart}" ref="cartContainer">
                      <span v-if="totalNum" class="cart_list_length">
                          {{totalNum}}
                      </span>
                      <svg class="cart_icon">
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
                      </svg>
                  </div>
                  <div class="cart_num">
                      <div>¥ {{totalPrice}}</div>
                  </div>
              </section>
              <section class="gotopay gotopay_button_style" :class='{gotopay_acitvity:totalPrice > 0}'@click='postOrder'>去结算</section>
          </section>
          <transition name="toggle-cart">
              <section class="cart_food_list" v-show="showCartList&&cartFoodList.length">
                  <header>
                      <h4>购物车</h4>
                      <div @click="clearCart">
                          <svg>
                              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
                          </svg>
                          <span class="clear_cart">清空</span>
                      </div>
                  </header>
                  <section class="cart_food_details" id="cartFood">
                      <ul>
                          <li v-for="(item, index) in cartFoodList" :key="index" class="cart_food_li">
                              <div class="cart_list_num">
                                  <p class="ellipsis">{{item.name}}</p>
                                  <!-- <p class="ellipsis">{{item.specs}}</p> -->
                              </div>
                              <div class="cart_list_price">
                                  <span>¥</span>
                                  <span>{{item.price}}</span>
                              </div>
                              <section class="cart_list_control">
                                  <span @click="removeOutCart(item.num,item.class_id, item.item_id,item.name, item.price)">

                                      <svg>
                                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                                      </svg>
                                  </span>
                                  <span class="cart_num">{{item.num}}</span>
                                  <svg class="cart_add" @click="addToCart(item.class_id, item.item_id, item.name, item.price, item.originalPrice)">
                                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                                  </svg>
                                  <!-- <buy-cart :goods='item'></buy-cart> -->
                              </section>
                          </li>
                      </ul>
                  </section>
              </section>
          </transition>
          <transition name="fade">
              <div class="screen_cover" v-show="showCartList&&cartFoodList.length" @click="toggleCartList"></div>
          </transition>
          <info-form v-if="showInput" 
          :discount='discount'
          @submit='submitOrder'
          @close='showInput = false'></info-form>
          <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
      </section>
  </div>
</template>

<script>
import '../style/products.scss'
import {mapState, mapMutations} from 'vuex'
import {
  getProducts,
  getMenuList,
  getGoodsByClassId,
} from '../service/getProductsData.js';

import {
  addOrder
} from '../service/orderBmob.js'
import {getSchoolList} from '../service/commonData.js'
import {addTrack} from '../service/accessData.js'
import {setStore, getStore} from '../config/mUtils'
import goodItem from './common/goodItem.vue'
import BuyCart from './common/buyCart.vue'
import infoForm from './common/addAddress.vue'
import loading from './common/loading'
import headTop from './common/header/head'

export default {
  name: "Products",
  components:{
    goodItem,
    loading,
    headTop,
    'buy-cart':BuyCart,
    'info-form':infoForm
  },
  data() {
    return {
      phone: "",
      goodsList: [],
      menuList: [], //menu列表
      menuIndex:0,
      cartFoodList: [], //购物车商品列表
      showCartList: false,//显示购物车列表
      totalPrice:0,//总价格
      receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
      categoryNum:[],
      showInput:false,//显示输入框
      showLoading:true,
    };
  },
  computed:{
    ...mapState(['cartList','userInfo','schoolList','discountMax','discountNum']),
    //当前商店购物信息
    shopCart: function (){
        return {...this.cartList};
    },
    user_info: function(){
      return {...this.userInfo}
    },
    curClassify: function(){
        if(this.menuList.length){
            let str = '商品列表';
            str = this.menuList[this.menuIndex]?this.menuList[this.menuIndex].classify || '商品列表':'商品列表';
            return str;
        }
    },
    //购物车中总共商品的数量
    totalNum: function (){
        let num = 0;
        this.cartFoodList.forEach(item => {
            num += item.num
        })
        return num
    },
    discount:function(){
      return Math.floor(this.totalPrice / this.discountMax) * this.discountNum;
    }
  },
  mounted:function() {
    this.initData();
  },
  methods: {
   ...mapMutations([
              'errorCb','REDUCE_CART','INIT_BUYCART','CLEAR_CART','INIT_USERINFO',
              'SET_SCHOOL_LIST','ADD_CART','SET_TOTAL_PRICE',
          ]),
    initData:function(){
       let _this = this;
       this.INIT_BUYCART();
       this.INIT_USERINFO();//初始化用户信息
       let phone = _this.userInfo?_this.userInfo.phone:'';
       addTrack({
        phone:phone,
        action:'products',
       });
        //分类列表
        getMenuList((res)=>{
          console.log('getMenuList res',res);
            _this.menuList = res.data;
            _this.initCategoryNum();
            _this.chooseMenu(0);
            _this.showLoading = false;
        },err =>{
          _this.showLoading = false;
        });
        //获得学校列表，后面有用
        getSchoolList(res =>{
                _this.SET_SCHOOL_LIST(res);
            });
    },
    chooseMenu:function(index){
        this.menuIndex = index;
        // this.curClassify = this.menuList[this.menuIndex].class_name;
        let _this = this;

        _this.showLoading = true;
        getGoodsByClassId({class_id:this.menuList[this.menuIndex].class_id},res=>{
          console.log('getGoodsByClassId',res);
            _this.goodsList = res.data;
            _this.showLoading = false;
        },err=>{
          _this.showLoading = false;
        })
    },
    listenInCart:function(){

    },
    showChooseList:function(){

    },
    showReduceTip:function(){

    },
    showMoveDotFun:function(){

    },
    toggleCartList:function(){
      this.cartFoodList.length ? this.showCartList = !this.showCartList : true;
    },
    //移出购物车
    removeOutCart(num,class_id, item_id, name, price){
        if (num > 0) {
            console.log('移出购物车',arguments);
            this.REDUCE_CART({class_id, item_id, name, price});
        }
    },
    //加入购物车，计算按钮位置。
    addToCart(class_id, item_id, name, price,originalPrice,event){
        console.log('加入购物车',arguments);
        this.ADD_CART({class_id, item_id, name, price, originalPrice});
        let elLeft = event.target.getBoundingClientRect().left;
        let elBottom = event.target.getBoundingClientRect().bottom;
        console.log('this.shopCart',this.shopCart);
        // this.showMoveDot.push(true);
        // this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);

    },
    //清除购物车
    clearCart(){
        this.toggleCartList();
        this.CLEAR_CART();
    },
    /**
     * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
     */
    initCategoryNum:function(){
        let newArr = [];
        let cartFoodNum = 0;
        this.totalPrice = 0;
        this.cartFoodList = [];
        this.menuList.forEach((item, index) => {
            if (this.shopCart&&this.shopCart[item.class_id]) {
                let num = 0;
                Object.keys(this.shopCart[item.class_id]).forEach(itemid => {
                    let good_item = this.shopCart[item.class_id][itemid];
                        num += good_item.num;
                        this.totalPrice += good_item.num*good_item.price;
                        if (good_item.num > 0) {
                            this.cartFoodList[cartFoodNum] = {};
                            this.cartFoodList[cartFoodNum].class_id = item.class_id;
                            this.cartFoodList[cartFoodNum].item_id = itemid;
                            this.cartFoodList[cartFoodNum].num = good_item.num;
                            this.cartFoodList[cartFoodNum].price = good_item.price;
                            this.cartFoodList[cartFoodNum].name = good_item.name;
                            this.cartFoodList[cartFoodNum].originalPrice = good_item.originalPrice;
                            cartFoodNum ++;
                        }
                })
                newArr[index] = num;
            }else{
                newArr[index] = 0;
            }
        });
        this.totalPrice -= this.discount;
        this.totalPrice = this.totalPrice.toFixed(2);
        this.SET_TOTAL_PRICE(this.totalPrice);
        this.categoryNum = [...newArr];
    },
    postOrder:function(){
      if(this.totalPrice <= 0) return;
      this.showInput = true;
    },
    submitOrder:function(params){
      if(this.showLoading){//不可重复下单
          return;
      }
      var income = 0,goods=[],data = {},_this = this;
      _this.showLoading = true;
      for(var i = 0 ; i < this.cartFoodList.length ;i++){
        var good = {};
        var item = this.cartFoodList[i];
        good = Object.assign({},item);
        good["total"] = item.num * item.price;
        goods.push(good);
        income += item.num * (parseFloat(item.price) - parseFloat(item.originalPrice));
      }
      data.phone = this.user_info.phone;
      data.nickname = this.user_info.nickname;
      data.place = this.user_info.place;

      data.school = this.user_info.school;;
      data.goods = goods;
      data.price = parseFloat(this.totalPrice);
      data.income = +(income - this.discount);//此单利润
      data.comments = params.remarks;
      data.preference = this.discount;
      addOrder(data, res => {
          _this.showLoading = false;
          _this.showInput = false;
          alert('订单提交成功');
          _this.CLEAR_CART();
          window.location.href = '/#/orders';
      },err=>{
         this.showLoading = false;
      });
    },
  },
  watch:{
    shopCart: function (value){
        this.initCategoryNum();
    },
    //购物车列表发生变化，没有商铺时，隐藏
    cartFoodList: function (value){
        if(!value.length){
            this.showCartList = false;
        }
    },
  }
};
</script>

