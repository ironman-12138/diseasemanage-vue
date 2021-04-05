import {request1} from '@/network/request'

/**
 * 获取物资库存，饼图所需数据
 */
export const getProductAll= () => {
    return request1({
        url: "/product/findAllCharts",
        method: "get"
        
    })
}

/**
 * 获取物资出库数量，雷达图所需数据
 */
export const getOutProductCharts= () => {
    return request1({
        url: "/out-stock/outProductCharts",
        method: "post"
        
    })
}

/**
 * 获取物资入库数量，雷达图所需数据
 */
export const getInProductCharts= () => {
    return request1({
        url: "/in-stock/inProductCharts",
        method: "post"
        
    })
}

/**
 * 物资入库七天统计
 */
export const getInStockSeven= () => {
    return request1({
        url: "/in-stock/inSeven",
        method: "post"
        
    })
}

/**
 * 物资出库七天统计
 */
export const getOutStockSeven= () => {
    return request1({
        url: "/out-stock/outSeven",
        method: "post"
        
    })
}