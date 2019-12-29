import request from "@/utils/request";
export function getProductList(params) {
  return request({
    url: "/admin/product/list",
    method: "get",
    params: params
  });
}

export function createProduct(data) {
  return request({
    url: "/admin/product/create",
    method: "post",
    data: data
  });
}

export function editProduct(id, data) {
  return request({
    url: `/admin/product/update/${id}`,
    method: "post",
    data: data
  });
}

export function deleteProduct(data) {
  return request({
    url: `/admin/product/delete/batch`,
    method: "post",
    data: data
  });
}
