import {request1} from '@/network/request'

/**
 * 分页模糊查询物资来源列表
 */
export const getSupplierList= (pageNum,pageSize,supplier) => {
    return request1({
        url: "/supplier/findSupplierList",
        method: "post",
        params: {
            pageNum,
            pageSize
        },
        data: supplier
    })
}

/**
 * 添加物资来源
 */
export const addSupplier= (supplier) => {
    return request1({
        url: "/supplier/add",
        method: "post",
        data: supplier
    })
}

/**
 * 删除物资来源
 */
export const delSupplier= (id) => {
    return request1({
        url: "/supplier/delete",
        method: "post",
        data: {
            "id":id
        }
    })
}

/**
 * 根据id查询物资来源
 */
export const selectSupplier= (id) => {
    return request1({
        url: "/supplier/select",
        method: "post",
        data: {
            "id":id
        }
    })
}

/**
 * 修改物资来源
 */
export const updateSupplier= (supplier) => {
    return request1({
        url: "/supplier/update",
        method: "post",
        data: supplier
    })
}