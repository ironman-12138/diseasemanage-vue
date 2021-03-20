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