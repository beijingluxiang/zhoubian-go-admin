import request from "@/utils/request";
export function getCategory() {
  return request({
    url: "/admin/category/listAll",
    method: "get"
  });
}

export function createCategory(name) {
  return request({
    url: "/admin/category/create",
    method: "post",
    data: {
      name: name
    }
  });
}

export function editCategory(id, name) {
  return request({
    url: `/admin/category/update/${id}`,
    method: "post",
    data: {
      name: name
    }
  });
}

export function deleteCategory(id) {
  return request({
    url: `/admin/category/delete/${id}`,
    method: "post"
  });
}
