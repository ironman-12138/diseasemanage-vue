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