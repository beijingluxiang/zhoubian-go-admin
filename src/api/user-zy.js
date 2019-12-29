import request from "@/utils/request";
export function getFenyongSetting() {
  return request({
    url: "/admin/fenyong/setting",
    method: "get"
  });
}

export function setFenyongSetting(data) {
  return request({
    url: "/admin/fenyong/setting/update",
    method: "post",
    data: data
  });
}

export function setUserClass(id, userClass) {
  return request({
    url: `/admin/user/update/${id}`,
    method: "post",
    data: {
      userClass: userClass
    }
  });
}

export function getUserList(params) {
  return request({
    url: "/admin/user/list",
    method: "get",
    params: params
  });
}
