/*
 * @Author: YinXuan
 * @Date: 2023-07-19 14:02:42
 * @LastEditTime: 2023-11-06 14:53:05
 * @Description:
 */

/**
 * 菜单查询参数类型
 */
export interface MenuQuery extends PageQuery {
  // 菜单名称
  menuName?: string
}

/**
 * 菜单表单对象类型
 */
export interface MenuForm {
  /**
   * 菜单ID
   */
  id?: string
  /**
   * 父菜单ID
   */
  parentId?: number
  /**
   * 菜单名称
   */
  menuName?: string
  /**
   * 页面路径
   */
  component?: string
  icon?: string
  /**
   * 排序
   */
  sort?: number
  /**
   * 路由路径
   */
  url?: string

  /**
   * 菜单类型
   */
  type?: string | number
}
