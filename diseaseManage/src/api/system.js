import {request1} from '@/network/request'

/**
 * 获取用户对应的菜单列表
 */
export const getMenuList= () => {
    return request1({
        url: "/system/menus",
        method: "get"
    })
}