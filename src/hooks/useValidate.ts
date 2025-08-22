/*
 * @Author: YinXuan
 * @Date: 2024-06-28 09:31:26
 * @LastEditTime: 2024-08-08 14:11:45
 * @Description: 表单正则验证
 */
export default function () {
  /**
   * 验证车牌号
   */
  function usePlateNoValidate(rule: any, value: any, callback: any) {
    let temp = value.match(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,]/g)
    if (temp && temp.length > 0) {
      callback(new Error('最多添加两个车牌号,请用英文逗号分隔'))
    } else {
      let result = value.split(',')
      if (result.length > 2) {
        callback(new Error('最多添加两个车牌号,请用英文逗号分隔'))
      } else if (!result[0] || (result.length === 2 && !result[1])) {
        callback(new Error('请输入正确的车牌号'))
      } else {
        callback()
      }
    }
  }
  /**
   * 验证手机号
   */
  function usePhoneValidate(rule: any, value: any, callback: any) {
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  }
  /**
   * 验证只能输入数字或小数
   */
  function useOnlyNumberValidate(rule: any, value: any, callback: any) {
    const reg = /^\d+(\.\d+)?$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确的数字'))
    } else {
      callback()
    }
  }
  /**
   * 验证邮箱
   */
  function useEmailValidate(rule: any, value: any, callback: any) {
    const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback()
    }
  }
  /**
   * 验证只能输入数字、字母和汉字
   */
  function useOnlyNumberWordValidate(rule: any, value: any, callback: any) {
    const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
    if (!reg.test(value)) {
      callback(new Error('只能输入数字、字母和汉字'))
    } else {
      callback()
    }
  }
  return {
    usePlateNoValidate,
    usePhoneValidate,
    useOnlyNumberValidate,
    useEmailValidate,
    useOnlyNumberWordValidate
  }
}
