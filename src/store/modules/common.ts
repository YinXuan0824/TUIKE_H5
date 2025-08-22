/*
 * @Author: YinXuan
 * @Date: 2023-12-06 09:50:54
 * @LastEditTime: 2024-01-07 16:04:46
 * @Description:
 */
import { defineStore } from 'pinia'
import { store } from '@/store'
import { useStorage } from '@vueuse/core'

// setup
export const useCommonStore = defineStore('common', () => {
  // state
  const plateNoHistoryList = useStorage('plateNoHistoryList', [])
  const isToMerchantBuy = useStorage('isToMerchantBuy', false)
  function handleDeletePlateNo() {
    plateNoHistoryList.value = []
  }
  function handleFixIsToMerchantBuy(bool: boolean) {
    isToMerchantBuy.value = bool
  }

  return {
    plateNoHistoryList,
    handleDeletePlateNo,
    isToMerchantBuy,
    handleFixIsToMerchantBuy
  }
})

// 非setup
export function useCommonStoreHook() {
  return useCommonStore(store)
}
