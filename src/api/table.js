import request from "@/utils/request";

export function getTableList(params) {
  return request({
    url: "/admin/shop/table/list/",
    method: "get",
    params: params
  });
}

export function createTable(params) {
  return request({
    url: "/admin/shop/table/create",
    method: "post",
    data: params
  });
}

export function updateTable(id, status) {
  return request({
    url: "/admin/shop/table/update",
    method: "post",
    data: {
      id: id,
      status: status
    }
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
