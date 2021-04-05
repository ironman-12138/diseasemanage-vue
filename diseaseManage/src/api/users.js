import {request1} from '@/network/request'

/**
 * 分页模糊查询所有用户
 */
export const selectUserList= (currentPage,pageSize,userVo) => {
    return request1({
        url: "/user/select",
        method: "post",
        // get请求参数是带在url上的，必须使用params
        // post请求既可以使用params，也可以使用data
        // 区别是：data是放在body里的，在url中看不见参数，但是使用params的话，说明参数在url里面是能够看见的
        params: {
            currentPage,
            pageSize
        },
        data: userVo
    })
}

/**
 * 删除阿里云上多余的图片
 */
export const deleteImgFile= (file) => {
    return request1({
        url: "/aliOss/deleteImgFile",
        method: "post",
        params: {
            file
        }
    })
}

/**
 * 添加用户
 */
export const saveUser= (user) => {
    return request1({
        url: "/user/save",
        method: "post",
        data: user
    })
}

/**
 * 根据id查询用户
 */
export const edit= (id) => {
    return request1({
        url: "/user/edit",
        method: "post",
        params: {"id":id}
    })
}

/**
 * 删除用户
 */
export const deleteById= (id) => {
    return request1({
        url: "/user/delete",
        method: "post",
        params: {"id":id}
    })
}

/**
 * 更新用户
 */
export const update= (editForm) => {
    return request1({
        url: "/user/update",
        method: "post",
        params: editForm
    })
}

/**
 * 禁用启用用户
 */
export const updateStatus= (id,enable) => {
    return request1({
        url: "/user/updateStatus",
        method: "post",
        params: {"id":id,"enable":enable}
    })
}