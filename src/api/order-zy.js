import request from "@/utils/request";
export function exportOrder(params) {
  return request({
    url: "/order/list/export",
    method: "get",
    params: params
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
