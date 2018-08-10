<template>
  <div class="hello">
    商品
    <ol>
        <li v-for="product in products" :key="product.id">
            <div>分类：{{product.get('classify')}}</div>
            <div>名称：{{product.get('name')}}</div>
            <div>价格：{{product.get('price')}}</div>
        </li>
        </ol>
  </div>
</template>

<script>
export default {
  name: "Products",
  data() {
    return {
      products: []
    };
  },
  created() {
    var that = this;
    var order = Bmob.Object.extend("Products");
    var query = new Bmob.Query(order);
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          that.products.push(object);
        }
      },
      error: function(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
