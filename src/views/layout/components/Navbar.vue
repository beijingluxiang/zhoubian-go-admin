<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger
        class="hamburger-container"
        :toggleClick="toggleSideBar"
        :isActive="sidebar.opened"
      ></hamburger>
      <breadcrumb></breadcrumb>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            style="width: 30px; height: 30px; overflow:hidden; border-radius: 100px;"
            class="user-avatar"
            :src="avatar"
          />
          <span>
            {{ userName }}
          </span>
          <i class="el-icon-caret-bottom" style="top: 19px;"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item>
            <span @click="changePassword">
              修改密码
            </span>
          </el-dropdown-item>

          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>

    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordShow"
      width="500px"
      top="10px"
    >
      <div
        class="viewSettingWrapper"
        style="width: 100%; overflow:hidden; padding: 20px 0;"
      >
        <div style="width: 90%; margin: 0 auto;">
          <form-creater
            :formSchema="formSchema"
            :labelWidth="'100px'"
            :formDataProp="formData"
            :formBtn="formBtn"
            @formSubmit="submitNow"
          ></form-creater>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import avatar from "@/assets/images/avatar.png";
import formCreater from "@/views/components/formCreater";
import { changePassword } from "@/api/login";
import { setSupport, getSupport, setCookie, getCookie } from "@/utils/support";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    formCreater
  },
  data() {
    return {
      avatar,
      userName: getCookie("username"),
      changePasswordShow: false,
      formBtn: [{ name: "保存", eName: "save", width: "200px" }],
      formData: null,
      formSchema: [
        {
          name: "旧密码",
          eName: "oldPassword",
          type: "text",
          rules: [{ required: true, message: "输入旧密码", trigger: "blur" }]
        },
        {
          name: "新密码",
          eName: "newPassword",
          type: "text",
          rules: [{ required: true, message: "输入新密码", trigger: "blur" }]
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  methods: {
    changePassword() {
      this.changePasswordShow = true;
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    submitNow(params) {
      const _userName = getCookie("username");
      let _params = params.data;
      _params["username"] = _userName;
      changePassword(_params).then(res => {
        if (res) {
          this.$message("修改密码成功");
          this.$store.dispatch("LogOut").then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        } else {
          this.$message("操作失败");
        }
        this.changePasswordShow = false;
      });
      console.log(params);
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
