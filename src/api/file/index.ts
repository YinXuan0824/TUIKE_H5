/*
 * @Author: YinXuan
 * @Date: 2023-07-17 13:10:02
 * @LastEditTime: 2024-12-27 13:28:13
 * @Description: 上传图片
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { FileInfo } from './types'

/**
 * 获取图片列表
 *
 * @param pageSize
 * @param currentPage
 */
export function fetchImageList(data: any) {
  return request({
    url: 'charge/sys/file/list',
    method: 'post',
    data: data
  })
}

/**
 * 上传文件
 *
 * @param file
 */
export function uploadFileApi(file: File): AxiosPromise<FileInfo> {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: 'charge/sys/file/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 工单图片上传 上传多张图片
 *
 * @param file
 */
export function uploadImgWorkOrderApi(file: File): AxiosPromise<FileInfo> {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/charge/operation/work-order/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 上传更新版本文件
 *
 * @param file
 */
export function uploadZipApi(file: File): AxiosPromise<FileInfo> {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/charge/equipmentVersion/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': '	application/x-www-form-urlencoded'
    }
  })
}

/**
 * 删除文件
 *
 * @param filePath 文件完整路径
 */
export function batchDeleteImageFile(list: any) {
  return request({
    url: 'charge/sys/file/delete',
    method: 'delete',
    data: list
  })
}

/**
 * 上传车辆图片
 *
 * @param file
 */
export function uploadCarInfoManageImageApi(file: File): AxiosPromise<FileInfo> {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/serverClient/sys/file/uploadImage',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
