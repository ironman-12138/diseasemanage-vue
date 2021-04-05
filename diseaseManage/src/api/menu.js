import {request1} from '@/network/request'

/**
 * 查询菜单列表
 */
export const getMenuTree= () => {
    return request1({
        url: "/system/menuList",
        method: "get"
        
    })
}

/**
 * 根据id查询菜单项
 */
export const select= (id) => {
    return request1({
        url: "/system/menu/select",
        method: "post",
        params: {"id": id}
    })
}

/**
 * 根据id删除菜单项
 */
export const deleteById= (id) => {
    return request1({
        url: "/system/menu/delete",
        method: "post",
        params: {"id": id}
    })
}

/**
 * 修改菜单项
 */
export const update= (editForm) => {
    return request1({
        url: "/system/menu/update",
        method: "post",
        params: editForm
    })
}


/**
 * 添加菜单项
 */
export const add= (addForm) => {
    return request1({
        url: "/system/menu/add",
        method: "post",
        params: addForm
    })
}