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
      phone: "",
      products: [],
      schools: []
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
    register: function() {
      var user = new Bmob.User();
      user.set("username", "phone");
      user.set("password", "123456");
      user.set("school", "");
      user.set("place", "");
      user.set("uLevel", 1);
      user.signUp(null, {
        success: function(user) {
          order();
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    },
    preOrder: function() {
      var user = Bmob.Object.extend("_User");
      var query = new Bmob.Query(user);
      query.equalTo("username", "123456");
      query.find({
        success: function(results) {
          if (results.length == 0) {
            register();
          } else {
            order();
          }
        },
        error: function(error) {
          console.log("您还没有下单，没有订单信息");
        }
      });
    },

    order: function() {
      var Order = Bmob.Object.extend("Orders");
      var order = new Order();
      order.set("studentId", this.phone);
      //todo add more
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
