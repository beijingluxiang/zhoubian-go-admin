import request from "@/utils/request";
export function exportOrder(params) {
  return request({
    url: "/order/list/export",
    method: "get",
    responseType: "blob",
    params: params
  });
}
export function getOrderList(params) {
  params["queryType"] = 1;
  return request({
    url: "/admin/order/list/",
    method: "get",
    params: params
  });
}

export function getRefundList(params) {
  params["queryType"] = 2;
  return request({
    url: "/admin/order/list/",
    method: "get",
    params: params
  });
}
export function getOrderDetail(id) {
  return request({
    url: `/admin/order/${id}/`,
    method: "get"
  });
}

export function closeOrder(ids) {
  return request({
    url: "/admin/order/update/close",
    method: "post",
    params: {
      ids: ids.toString()
    }
  });
}

export function deleteOrder(params) {
  return request({
    url: "/admin/order/delete",
    method: "post",
    params: params
  });
}

export function deliveryOrder(data) {
  return request({
    url: "/admin/order/update/delivery",
    method: "post",
    data: data
  });
}

export function refundMoney(id, type) {
  return request({
    url: `/admin/order/${id}/refund/${type}`,
    method: "post"
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
