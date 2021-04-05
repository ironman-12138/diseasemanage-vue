import {request1} from '@/network/request'

/**
 * 查询登录日志列表
 */
export const getLoginLogList= (queryMap) => {
    return request1({
        url: "/login-log/getLoginLogList",
        method: "get",
        params: queryMap
    })
}

/**
 * 删除登陆日志
 */
export const deleteById= (id) => {
    return request1({
        url: "/login-log/delete",
        method: "get",
        params: {"id": id}
    })
}