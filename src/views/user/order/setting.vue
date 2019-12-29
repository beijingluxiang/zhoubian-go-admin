<template>
  <div>
    <div style="padding: 10px;">
      <div slot="header" style="padding: 10px 0;">
        <span style="font-size: 14px;">980分佣的文字说明：</span>
      </div>

      <el-table
        style="width: 100%; margin-top: 5px;"
        :data="distributeSetting"
        border
      >
        <el-table-column label="联合创始人" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.founder" type="number">
              <span style="line-height: 40px; font-size: 14px;" slot="suffix"
                >%</span
              >
            </el-input>
            <p class="brief"></p>
          </template>
        </el-table-column>
        <el-table-column label="合伙人" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.partner" type="number">
              <span style="line-height: 40px; font-size: 14px;" slot="suffix"
                >%</span
              >
            </el-input>
            <p class="brief"></p>
          </template>
        </el-table-column>
        <el-table-column label="会员A" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.vipA"
              type="number"
              :disabled="!scope.row.vipA && scope.row.vipA !== 0"
            >
              <span style="line-height: 40px; font-size: 14px;" slot="suffix"
                >%</span
              >
            </el-input>
            <p class="brief">
              若有会员A，则会员A拿Z%；若没有会员A，则会员A的分佣归合伙人
            </p>
          </template>
        </el-table-column>
        <el-table-column label="会员B" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.vipB" type="number">
              <span style="line-height: 40px; font-size: 14px;" slot="suffix"
                >%</span
              >
            </el-input>
            <p class="brief"></p>
          </template>
        </el-table-column>
        <el-table-column label="普通用户" align="center">
          <template slot-scope="scope"> </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        size="small"
        @click="goSet"
        style="margin-top: 20px;"
      >
        设置
      </el-button>
      <div slot="header" style="padding: 10px 0;">
        <span style="font-size: 14px;">规则：</span>
      </div>
      <div class="content">
        <div>
          <p>
            一、会员B 推荐 普通用户
          </p>
          <p>
            1.会员B的分佣为 F%*980
          </p>
          <p>
            2.会员A的分佣为 Z%*980
          </p>
          <p>
            3.合伙人的分佣为 Y%*980
          </p>
          <p>
            4.联创的分佣为 X%*980
          </p>
        </div>
        <div>
          <p>
            二、会员A 推荐 普通用户
          </p>
          <p>
            1.会员A的分佣为F%*980
          </p>
          <p>
            2.合伙人的分佣为（Y%+Z%）*980
          </p>
          <p>
            3.联创的分佣为X%*980
          </p>
        </div>
        <div>
          <p>
            三、合伙人 推荐 普通用户
          </p>
          <p>
            1.合伙人的分佣为 (Y%+F%+Z%)*980
          </p>
          <p>
            2.联创的分佣为X%*980
          </p>
          <p>
            三、联合创始人 推荐 普通用户
          </p>
          <p>
            1.联创的分佣为 (X%+Y%+F%+Z%)*980
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getFenyongSetting, setFenyongSetting } from "@/api/user-zy";

export default {
  name: "orderSetting",
  data() {
    return {
      distributeSetting: null
    };
  },
  created() {
    this.getSetting();
  },
  methods: {
    goSet() {
      for (let key in this.distributeSetting[0]) {
        this.distributeSetting[0][key] = Number(this.distributeSetting[0][key]);
      }
      setFenyongSetting(this.distributeSetting[0]).then(res => {
        this.$message("修改成功");
      });
    },
    getSetting() {
      getFenyongSetting().then(res => {
        const _data = res.data;
        this.distributeSetting = [_data];
        console.log(res, "caonima", _data);
      });
    }
  }
};
</script>
<style scoped lang="scss">
.brief {
  font-size: 12px;
  color: red;
  height: 50px;
  line-height: 20px;
}
.content {
  overflow: hidden;
  div {
    float: left;
    margin-right: 30px;
    padding: 10px;
    background: #f0f0f0;
    width: 250px;
    height: 180px;
    p {
      font-size: 12px;
    }
  }
}
</style>
