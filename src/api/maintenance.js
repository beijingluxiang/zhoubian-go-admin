import request from "@/utils/request";

export function getRegisterList(params) {
  return request({
    url: "/admin/shop/apply/list",
    method: "get",
    params: params
  });
}

export function getRegisteredList(params) {
  return request({
    url: "/admin/shop/apply/pass/list",
    method: "get",
    params: params
  });
}

export function getRegisterDetail(id) {
  return request({
    url: `/admin/shop/apply/shop/${id}/info`,
    method: "get"
  });
}

export function updateRegisterDetail(id, params) {
  return request({
    url: `/admin/shop/apply/shop/${id}/update`,
    method: "post",
    data: params
  });
}

export function register(params) {
  return request({
    url: "/admin/shop/apply",
    method: "post",
    data: params
  });
}

export function agreeRegister(id) {
  return request({
    url: `/admin/shop/apply/${id}/pass`,
    method: "post"
  });
}

export function rejectRegister(id) {
  return request({
    url: `/admin/shop/apply/${id}/reject`,
    method: "post"
  });
}

export function deleteTable(id) {
  return request({
    url: "/admin/shop/table/update",
    method: "post",
    data: {
      id: id,
      status: -1
    }
  });
}

// export function createProduct(data) {
//   return request({
//     url: "/admin/product/create",
//     method: "post",
//     data: data
//   });
// }
//
// export function editProduct(id, data) {
//   return request({
//     url: `/admin/product/update/${id}`,
//     method: "post",
//     data: data
//   });
// }
//
// export function deleteProduct(data) {
//   return request({
//     url: `/admin/product/delete/batch`,
//     method: "post",
//     data: data
//   });
// }
