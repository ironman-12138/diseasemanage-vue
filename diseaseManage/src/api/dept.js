import {request1} from '@/network/request'

/**
 * 查询所有部门和人数
 */
export const selectDeptAndCount= () => {
    return request1({
        url: "/department/selectAll",
        method: "get",
    })
}

/**
 * 分页查询部门信息
 */
export const findDept= (queryMap) => {
    return request1({
        url: "/department/findDept",
        method: "post",
        params: queryMap
    })
}

/**
 * 添加部门
 */
export const add= (addRuleForm) => {
    return request1({
        url: "/department/add",
        method: "post",
        params: addRuleForm
    })
}

/**
 * 根据id查询部门
 */
export const edit= (id) => {
    return request1({
        url: "/department/select",
        method: "post",
        params: {"id":id}
    })
}

/**
 * 根据id删除部门
 */
export const deleteById= (id) => {
    return request1({
        url: "/department/delete",
        method: "post",
        params: {"id":id}
    })
}

/**
 * 更新部门
 */
export const update= (editRuleForm) => {
    return request1({
        url: "/department/update",
        method: "post",
        params: editRuleForm
    })
}