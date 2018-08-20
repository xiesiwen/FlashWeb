<template>
  <div class="hello">
    商品
    <ol>
        <li v-for="product in products" :key="product.id">
            <div>分类：{{product.get('classify')}}</div>
            <div>名称：{{product.get('name')}}</div>
            <div>价格：{{product.get('price')}}</div>
            <button v-on:click="addSelect(product)">添加到购物车</button>
            <button v-on:click="delSelect(product)" v-show="selects.indexOf(product) < 0 ? false : true">从购物车移除</button>
        </li>
      </ol>

    <button v-on:click="preSubmitOrder()">提交订单</button>
    <h2>选择的宝贝</h2>
      <ol>
        <li v-for="(product, index) in selects" :key="product.id">
            <div>名称：{{product.get('name')}}</div>
            <div>数量：{{selectNum[index]}}</div>
            <div>总价：{{product.get('price') * selectNum[index]}}</div>
        </li>
      </ol>
  </div>
  <div class="goods-container">
     
  </div>
</template>

<script>
export default {
  name: "Products",
  data() {
    return {
      phone: "",
      products: [],
      schools: [],
      selects: [],
      selectNum: []
    };
  },
  created() {
    this.phone = localStorage.getItem("phone");
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

    var school = Bmob.Object.extend("School");
    var query = new Bmob.Query(school);
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          that.schools.push(object);
          console.log(object.id);
        }
      },
      error: function(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  methods: {
    addSelect: function(product) {
      var index = this.selects.indexOf(product);
      if (index < 0) {
        this.selects.push(product);
        this.selectNum.push(1);
      } else {
        this.selectNum[index] = this.selectNum[index] + 1;
      }
    },

    delSelect: function(product) {
      var index = this.selects.indexOf(product);
      if (index >= 0) {
        var num = this.selectNum[index];
        if (num == 1) {
          this.selects.splice(index);
          this.selectNum.splice(index);
        } else {
          this.selectNum[index] = num - 1;
        }
      }
    },

    preSubmitOrder: function() {
      this.phone = localStorage.getItem("phone");
      var that = this
      if (!this.phone) {
        var user = new Bmob.User();
        user.set("username", "15671559222");
        user.set("password", "123456");
        user.set("uLevel", 1);
        user.set("school", "上海理工大学");
        user.set("place", "新世界213");
        user.signUp(null, {
          success: function(user) {
            localStorage.setItem("phone", "15671559222");
            localStorage.setItem("uLevel", 1);
            localStorage.setItem("school", "上海理工大学");
            localStorage.setItem("place", "新世界213");
            that.submitOrder();
          },
          error: function(user, error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
      } else {
        this.submitOrder();
      }
    },

    submitOrder: function() {
      this.phone = localStorage.getItem("phone");
      var school = localStorage.getItem("school");
      var place = localStorage.getItem("place");
      var Order = Bmob.Object.extend("Orders");
      var totalPrice = 0
      var income = 0
      var datas=[];
      for(var i = 0 ; i < this.selects.length ;i++){
        var product = this.selects[i]
        var num = this.selectNum[i]
        var price = product.get('price')
        var total = num*price
        var data = {}
        data["name"] = product.get('name')
        data["num"] = num
        data["total"] = total
        datas.push(data)
        totalPrice += total
        income += num * (price - product.get('originalPrice'))
      }
      var order = new Order();
      order.set("studentId", this.phone);
      order.set("school", school);
      order.set("place", place);
      order.set("products", JSON.stringify(datas));
      order.set("price", totalPrice);
      order.set("income", income);
      order.set("done", false);
      order.save(null, {
        success: function(order) {
          alert("添加数据成功，返回的objectId是：" + order.id);
        },
        error: function(order, error) {
          alert("添加数据失败，返回错误信息：" + error.description);
        }
      });
    }
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
