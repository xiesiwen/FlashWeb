<template>
  <div>
    <h2>订单</h2>
    <div>
    <input type="text" v-model="input" /><button v-on:click="submitUsernameInput(input)">查看订单</button>
    </div>
    <div>
      <ol>
      <li v-for="order in orderList" :key="order.id">
        <div>订单编号：  {{order.get('orderId')}}</div>
        <div>订单状态：  {{order.get('done')?"已完成":order.get('distributorId') == ''?"未发件":"派送中"}}</div>
        <ol>
        <li v-for="ps in JSON.parse(order.get('products'))" :key="ps.id">
            <div>{{ps.name}}   数量：{{ps.numb}}    金额：{{ps.price}}</div>
        </li>
        </ol>
        <div>学生电话:   {{order.get('studentId')}}</div>
        <div>学生地址:   {{order.get('place')}}</div>
        <div>
          <div v-show="userInfos.uLevel > 2? true : false">
    <input v-model="order.input"><button v-on:click="startDistributorId(order)">添加配送员</button>
    </div>
    </div>
    <button v-on:click="finishOrder(order)" v-show="userInfos.uLevel > 2? true : false">完成订单</button>
      </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  name: "Orders",
  data() {
    return {
      input: "",
      userInfos: {},
      orderList: []
    };
  },
  created() {
    this.userInfos.phone = localStorage.getItem("phone");
    this.userInfos.uLevel = localStorage.getItem("uLevel");
  },
  computed: {},
  methods: {
    seeOrders: function(phone, level) {
      console.log("phone is " + phone + " level is " + level);
      var that = this;
      var order = Bmob.Object.extend("Orders");
      var query = new Bmob.Query(order);
      //普通用户
      if (level <= 1) {
        query.equalTo("studentId", phone);
        //配送员
      } else if (level == 2) {
        query.equalTo("distributorId", phone);
      } //其他情况，是超级用户
      query.find({
        success: function(results) {
          console.log("共查询到 " + results.length + " 条记录");
          that.orderList = [];
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            that.orderList.push(object);
          }
        },
        error: function(error) {
          console.log("没有订单信息");
        }
      });
    },

    submitUsernameInput: function(phone) {
      var that = this;
      var usernameinput = phone;
      var user = Bmob.Object.extend("_User");
      var query = new Bmob.Query(user);
      query.equalTo("username", usernameinput);
      query.find({
        success: function(results) {
          if (results.length == 0) {
            console.log("您还没有下单，没有订单信息");
          } else {
            that.userInfos.uLevel = results[0].get("uLevel");
            that.userInfos.phone = results[0].get("username");
            localStorage.setItem("uLevel", that.userInfos.uLevel);
            localStorage.setItem("phone", that.userInfos.phone);
            that.seeOrders(that.userInfos.phone, that.userInfos.uLevel);
          }
        },
        error: function(error) {
          console.log("您还没有下单，没有订单信息");
        }
      });
    },

    startDistributorId: function(object) {
      var input_value = object.input;
      console.log("input is " + input_value);
      var Orders = Bmob.Object.extend("Orders");
      var query = new Bmob.Query(Orders);
      query.get(object.id, {
        success: function(order) {
          console.log("save success");
          order.set("distributorId", input_value);
          order.save();
          object.set("distributorId", input_value);
        },
        error: function(object, error) {}
      });
    },

    finishOrder: function(object) {
      console.log("finish oid is " + object.id);
      var Orders = Bmob.Object.extend("Orders");
      var query = new Bmob.Query(Orders);
      query.get(object.id, {
        success: function(order) {
          console.log("save success");
          order.set("done", true);
          order.save();
          object.set("done", true);
        },
        error: function(object, error) {
          console.log("save error");
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
