 <template>
	<div class="menu_detail_link">
        <section class="menu_food_img">
            <img :src="goodData.image.url">
        </section>
         <section class="menu_food_description">
            <h3 class="food_description_head">
                <strong class="description_foodname">{{goodData.name}}</strong>
            </h3>
            <p class="food_description_sale_rating t-left">
                <span class="good_hot">热度{{goodData.hotLevel || 100}}</span>
            </p>
            <p class="food_description_content t-left">{{goodData.describe}}</p>
        </section>
    </div>
</template>

<script>
    export default {
    	data(){
            return{
            }
        },
        created(){
            console.log('this.goodData',this.goodData);
        },
        components: {
        	
        },
        props:['goodData'],
        methods: {
            
        }
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';
	.t-left{
        text-align:left;
    }

	.rating_page{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		z-index: 12;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
	}
    .header_img{
        position: relative;
        .food_img{
            width: 100%;
            display: block;
        }
        .cover{
            position: absolute;
            @include wh(100%, 100%);
            top: 0;
            left: 0;
        }
    }
    .description{
        @include sc(.6rem, #666);
        margin-top: .5rem;
        line-height: .8rem;
        bottom: .2rem;
        padding: 0 .4rem;
    }
    .detail_container{
        padding: .5rem;
        @include fj;
        align-items: center;
        .detail_left{
            p:nth-of-type(1){
                @include sc(.7rem, #333);
                margin-bottom: .2rem;
            }
            .rating_sale{
                display: flex;
                align-items: center;
                span:nth-of-type(1){
                   @include sc(.6rem, #666);
                   margin-right: .2rem;
                }
                span:nth-of-type(2){
                    @include sc(.55rem, #f60);
                    margin-left: .2rem;
                }
                span:nth-of-type(3){
                   @include sc(.6rem, #666);
                    margin-left: .4rem;
                }
            }
            p:nth-of-type(2){
                font-size: 0;
                margin-top: .3rem;
                span:nth-of-type(1){
                    @include sc(.6rem, #666);
                    margin-right: .4rem;
                }
                span:nth-of-type(2),span:nth-of-type(3){
                    @include sc(.6rem, #f60);
                    margin-right: .2rem;
                }
            }
            p:nth-of-type(3){
                span{
                    @include sc(.6rem, #666);
                }
            }
        }
    }
    span.good_hot{
        color:$orange;
    }


</style>
