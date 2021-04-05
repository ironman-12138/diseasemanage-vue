import {request1} from '@/network/request'

/**
 * 分页模糊查询物资资料列表
 */
export const getproductList= (queryMap) => {
    return request1({
        url: "/product/findProductList",
        method: "get",
        params: queryMap
        
    })
}

/**
 * 分页模糊查询可出库物资资料列表
 */
export const getOutproductList= (queryMap) => {
    return request1({
        url: "/product/findOutProductList",
        method: "get",
        params: queryMap
        
    })
}

/**
 * 添加物资
 */
export const add= (addRuleForm) => {
    return request1({
        url: "/product/add",
        method: "post",
        data: addRuleForm
        
    })
}

/**
 * 编辑查询物资
 */
export const select= (id) => {
    return request1({
        url: "/product/select",
        method: "post",
        params: {"id":id}
        
    })
}

/**
 * 更新物资
 */
export const update= (editRuleForm) => {
    return request1({
        url: "/product/update",
        method: "post",
        data: editRuleForm
        
    })
}

/**
 * 删除物资
 */
export const deleteProduct= (id) => {
    return request1({
        url: "/product/delete",
        method: "post",
        params: {"id":id}
        
    })
}

/**
 * 过审物资
 */
export const publishProduct= (id) => {
    return request1({
        url: "/product/publish",
        method: "post",
        params: {"id":id}
        
    })
}

/**
 * 获取物资类别树形结构
 */
export const getproductCategoryList= () => {
    return request1({
        url: "/product-category/findAll",
        method: "get"
        
    })
}

/**
 * 添加分类
 */
export const addCate= (addRuleForm) => {
    return request1({
        url: "/product-category/add",
        method: "post",
        params: addRuleForm
    })
}

/**
 * 删除分类
 */
export const deleteCateById= (id) => {
    return request1({
        url: "/product-category/delete",
        method: "post",
        params: {"id":id}
    })
}

/**
 * 更新分类
 */
export const updateCate= (editRuleForm) => {
    return request1({
        url: "/product-category/update",
        method: "post",
        params: editRuleForm
    })
}