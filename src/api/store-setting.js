import request from "@/utils/request";

export function getTableList() {
  return request({
    url: "/admin/shop/table/list/",
    method: "get"
  });
}

export function getInfo() {
  return request({
    url: "/admin/shop/info",
    method: "get"
  });
}

export function updateInfo(data) {
  return request({
    url: "/admin/shop/update",
    method: "post",
    data: data
  });
}

export function searchCity(keyword) {
  return request({
    url: `/admin/shop/getCity`,
    method: "post",
    data: {
      keyword: keyword
    }
  });
}

export function searchLocation(keyword) {
  return request({
    url: `/admin/shop/getLocation`,
    method: "post",
    data: {
      region: null,
      keyword: keyword
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
