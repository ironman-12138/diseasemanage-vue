import {request1} from '@/network/request'

/**
 * 分页模糊查询物资出库列表
 */
export const findOutStockList= (queryMap) => {
    return request1({
        url: "/out-stock/findOutStockList",
        method: "get",
        params: queryMap
        
    })
}

/**
 * 分页查询物资出库明细
 */
export const findOutStockInfo= (detailQueryMap) => {
    return request1({
        url: "/out-stock/select",
        method: "post",
        params: detailQueryMap
        
    })
}

/**
 * 删除出库
 */
export const deleteById= (id) => {
    return request1({
        url: "/out-stock/delete",
        method: "post",
        params: {"id":id}
    })
}

/**
 * 修改状态
 */
export const update= (id,status) => {
    return request1({
        url: "/out-stock/update",
        method: "post",
        params: {"id":id,"status":status}
    })
}

/**
 * 物资添加出库
 */
export const add= (addRuleForm) => {
    return request1({
        url: "/out-stock/add",
        method: "post",
        data: addRuleForm
    })
}