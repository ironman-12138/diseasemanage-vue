import {request1} from '@/network/request'

/**
 * 分页查询所有用户
 */
export const selectDeptAndCount= () => {
    return request1({
        url: "/department/selectAll",
        method: "get",
    })
}