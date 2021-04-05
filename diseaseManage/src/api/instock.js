import {request1} from '@/network/request'

/**
 * 分页模糊查询物资入库列表
 */
export const findInStockList= (queryMap) => {
    return request1({
        url: "/in-stock/findInStockList",
        method: "get",
        params: queryMap
        
    })
}

/**
 * 分页查询物资入库明细
 */
export const findInStockInfo= (detailQueryMap) => {
    return request1({
        url: "/in-stock/select",
        method: "post",
        params: detailQueryMap
        
    })
}

/**
 * 物资添加入库
 */
export const add= (addRuleForm) => {
    return request1({
        url: "/in-stock/add",
        method: "post",
        data: addRuleForm
    })
}

/**
 * 删除入库
 */
export const deleteById= (id) => {
    return request1({
        url: "/in-stock/delete",
        method: "post",
        params: {"id":id}
    })
}

/**
 * 修改状态
 */
export const update= (id,status) => {
    return request1({
        url: "/in-stock/update",
        method: "post",
        params: {"id":id,"status":status}
    })
}