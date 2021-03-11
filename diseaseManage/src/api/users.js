import {request1} from '@/network/request'

/**
 * 分页查询所有用户
 */
export const selectUserList= (currentPage,pageSize,userVo) => {
    return request1({
        url: "/user/select",
        method: "post",
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