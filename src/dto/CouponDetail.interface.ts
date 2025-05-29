export interface CouponDetailInterface {
  id: number
  code: string
  description: string
  discount: number
  max_discount: number
  min_order_amount: number
  tc: string
  automatic: number
  order_number: any
  visible: number
  max_applicable: any
  status: number
  created_at: string
  show_delete?: boolean
  calc_discount_amount?: number
}
