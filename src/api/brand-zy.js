import request from "@/utils/request";
export function getBrand() {
  return request({
    url: "/admin/brand/listAll",
    method: "get"
  });
}

export function createBrand(name) {
  return request({
    url: "/admin/brand/create",
    method: "post",
    data: {
      name: name
    }
  });
}

export function editBrand(id, name) {
  return request({
    url: `/admin/brand/update/${id}`,
    method: "post",
    data: {
      name: name
    }
  });
}

export function deleteBrand(id) {
  return request({
    url: `/admin/brand/delete/${id}`,
    method: "post"
  });
}
