 <template>
    <section class="cart_module">
        <section class="cart_button">
            <transition name="showReduce">
                <span @click="removeOutCart(goods.class_id, goods.objectId, goods.name, goods.price)" v-if="foodNum">
                    <svg>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                    </svg>
                </span>
            </transition>
            <transition name="fade">
                <span class="cart_num" v-if="foodNum">{{foodNum}}</span>
            </transition>
            <svg class="add_icon" @click="addToCart(goods.class_id, goods.objectId, goods.name, goods.price,goods.originalPrice,$event)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
            </svg>
        </section>
       
    </section>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    export default {
    	data(){
            return{
               showMoveDot: [], //控制下落的小圆点显示隐藏
            }
        },
        mounted(){
            
        },
        computed: {
            ...mapState([
                'cartList'
            ]),
            /**
             * 监听cartList变化，更新当前商铺的购物车信息shopCart，同时返回一个新的对象
             */
            shopCart: function (){
                return Object.assign({},this.cartList);
            },
            //shopCart变化的时候重新计算当前商品的数量
            foodNum: function (){
                let category_id = this.goods.class_id;
                let item_id = this.goods.objectId;
                if (this.shopCart&&this.shopCart[category_id] && this.shopCart[category_id][item_id]) {
                    return this.shopCart[category_id][item_id].num
                }else {
                    return 0;
                }
            },
        },
        props:['goods'],
        methods: {
            ...mapMutations([
                'ADD_CART','REDUCE_CART',
            ]),
            //移出购物车
            removeOutCart(class_id, item_id, name, price){
                if (this.foodNum > 0) {
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
            //显示规格列表
            showChooseList(goodscroll){
                this.$emit('showChooseList', goodscroll)
            },
            //点击多规格商品的减按钮，弹出提示
            showReduceTip(){
                this.$emit('showReduceTip')
            },
            
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	.cart_module{
        .add_icon{
            position: relative;
            z-index: 3;
        }
        .cart_button{
            display: flex;
            align-items: center;
        }
        svg{
            @include wh(.9rem, .9rem);
            fill: $pink;
        }
        .specs_reduce_icon{
            fill: #999;
        }
        .cart_num{
            @include sc(.65rem, #666);
            min-width: 1rem;
            text-align: center;
            font-family: Helvetica Neue,Tahoma;
        }
        .choose_specification{
            .choose_icon_container{
                display: flex;
                align-items: center;
                .show_chooselist{
                    display: block;
                    @include sc(.55rem, #fff);
                    padding: .1rem .2rem;
                    background-color: $themeColor;
                    border-radius: 0.2rem;
                    border: 1px solid $themeColor;
                }
            }
        }
    }
    .showReduce-enter-active, .showReduce-leave-active {
        transition: all .3s ease-out;
    }
    .showReduce-enter, .showReduce-leave-active {
        opacity: 0;
        transform: translateX(1rem);
    }
    .fade-enter-active, .fade-leave-active {
        transition: all .3s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .fadeBounce-enter-active, .fadeBounce-leave-active {
        transition: all .3s;
    }
    .fadeBounce-enter, .fadeBounce-leave-active {
        opacity: 0;
        transform: scale(.7);
    }
    
</style>

