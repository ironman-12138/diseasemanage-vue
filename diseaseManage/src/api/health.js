import {request1} from '@/network/request'

/**
 * 健康打卡
 */
export const getCard= (ruleForm) => {
    return request1({
        url: "/health/getCard",
        method: "post",
        params: ruleForm
    })
}

/**
 * 是否已打卡
 */
export const isReport= (userId) => {
    return request1({
        url: "/health/isReport",
        method: "post",
        params: {"userId":userId}
    })
}

/**
 * 历史打卡记录
 */
export const historyCard= (queryMap) => {
    return request1({
        url: "/health/historyCard",
        method: "post",
        params: queryMap
    })
}