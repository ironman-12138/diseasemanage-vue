import {request1} from '@/network/request'

/**
 * 分页模糊查询物资资料列表
 */
export const getRoleList= (queryMap) => {
    return request1({
        url: "/role/findRoleList",
        method: "get",
        params: queryMap
        
    })
}

/**
 * 获取菜单列表和用户对应权限
 */
export const getMenuListById= (id) => {
    return request1({
        url: "/role/findRoleMenu",
        method: "post",
        params: {"id":id}
        
    })
}

/**
 * 角色授权
 */
export const authority= (grantId,menuIds) => {
    return request1({
        url: "/role/authority",
        method: "post",
        params: {"id":grantId,"menuIds":menuIds}
        
    })
}

/**
 * 根据id查询角色
 */
export const select= (id) => {
    return request1({
        url: "/role/select",
        method: "post",
        params: {"id":id}
        
    })
}

/**
 * 根据id删除角色
 */
export const deleteById= (id) => {
    return request1({
        url: "/role/delete",
        method: "post",
        params: {"id":id}
        
    })
}

/**
 * 添加角色
 */
export const add= (addForm) => {
    return request1({
        url: "/role/add",
        method: "post",
        params: addForm
        
    })
}

/**
 * 更新角色
 */
export const update= (editForm) => {
    return request1({
        url: "/role/update",
        method: "post",
        params: editForm
        
    })
}

/**
 * 修改角色状态
 */
export const updateStatus= (row) => {
    return request1({
        url: "/role/updateStatus",
        method: "post",
        params: row
        
    })
}