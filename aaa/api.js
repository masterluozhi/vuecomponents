import request from '@/utils/request'

// 分页查询
export function page(url, obj) {
  return request({
    url: url,
    method: 'get',
    params: obj
  })
}

// 查询
export function get(url, params = {}) {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}

// 删除
export function del(url, params = {}) {
  return request({
    url: url,
    method: 'delete',
    params: params
  })
}

// post
export function post(url, data) {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

/* json post提交 */
export async function postBody(url, data, parameter) {
   let resData
   let commit = {
    url: url,
    method: 'postbody',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
  if(parameter){
    commit['params'] = parameter
  }
  await request(commit).then(r => {
    resData = r.result
  })
  return resData
}

// put
export function put(url, data) {
  return request({
    url: url,
    method: 'put',
    data: data
  })
}

// to
export function to(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

// 直接查询
export async function result(url, params = {}) {
  let resData
  await request({
    url: url,
    method: 'get',
    params: params
  }).then(r => {
    resData = r.result
  })
  return resData
}

export function file(url, data) {

  return request({
    url: url,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    params: {
      type: 'file'
    },
    data: data
  })
}

export function fileNew(url, data) {
  let formData = new FormData()
  formData.append("file",data)
  return request({
    url: url,
    method: 'post',
    params: {
      type: 'file'
    },
    data: formData
  })
}
// 直接查询
export async function dict(code, pvalue) {
  let resData
  await request({
    url: `/sysDict/get?type=${code}`,
    method: 'get',
    params: { pvalue: pvalue }
  }).then(r => {
    resData = r.result
  })
  return resData
}


export default {
  page, // 分页
  get, // get
  del, // 删除
  post, // 新增
  put,  // 编辑
  result, // 直接返回结构
  dict, // 字典
  to,  // 可传方法
  file, // 文件上传
  postBody, //树形结构
  fileNew
}