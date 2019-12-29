import request from "@/utils/request";
export function fetchIndexBanner() {
  return request({
    url: "/admin/banner/list",
    method: "get"
  });
}

export function createIndexBanner(params) {
  return request({
    url: "/admin/banner/create",
    method: "post",
    data: params
  });
}

export function deleteIndexBanner(id) {
  return request({
    url: `/admin/banner/delete/${id}`,
    method: "post"
  });
}
