import {request1} from '@/network/request'

/**
 * 分页模糊查询物资去向列表
 */
export const getConsumerList= (pageNum,pageSize,consumer) => {
    return request1({
        url: "/consumer/findConsumerList",
        method: "post",
        params: {
            pageNum,
            pageSize
        },
        data: consumer
    })
}

/**
 * 添加物资
 */
export const addConsumer= (consumer) => {
    return request1({
        url: "/consumer/add",
        method: "post",
        data: consumer
    })
}

/**
 * 删除物资
 */
export const delConsumer= (id) => {
    return request1({
        url: "/consumer/delete",
        method: "post",
        data: {
            "id":id
        }
    })
}

/**
 * 根据id查询物资去向
 */
export const selectConsumer= (id) => {
    return request1({
        url: "/consumer/select",
        method: "post",
        data: {
            "id":id
        }
    })
}

/**
 * 修改物资去向信息
 */
export const updateConsumer= (consumer) => {
    return request1({
        url: "/consumer/update",
        method: "post",
        data: consumer
    })
}