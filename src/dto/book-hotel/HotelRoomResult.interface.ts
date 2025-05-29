export interface HotelRoomResult {
    GetHotelRoomResult: GetHotelRoomResult
  }
  
  export interface GetHotelRoomResult {
    RoomCombinationsArray: RoomCombinationsArray[]
    ResponseStatus: number
    Error: Error
    TraceId: string
    IsUnderCancellationAllowed: boolean
    IsPolicyPerStay: boolean
    HotelRoomsDetails: HotelRoomsDetail[]
  }
  
  export interface RoomCombinationsArray {
    CategoryId: string
    InfoSource: string
    IsPolicyPerStay: boolean
    RoomCombination: RoomCombination[]
  }
  
  export interface RoomCombination {
    RoomIndex: number[]
  }
  
  export interface Error {
    ErrorCode: number
    ErrorMessage: string
  }
  
  export interface HotelRoomsDetail {
    AvailabilityType: string
    CategoryId: string
    ChildCount: number
    RequireAllPaxDetails: boolean
    RoomId: number
    RoomStatus: number
    RoomIndex: number
    RoomTypeCode: string
    RoomDescription: string
    RoomTypeName: string
    RatePlanCode: string
    RatePlan: number
    InfoSource: string
    SequenceNo: string
    DayRates: DayRate[]
    IsPerStay: boolean
    SupplierPrice: any
    Price: Price
    RoomPromotion: string
    Amenities: string[]
    Amenity: string[]
    SmokingPreference: string
    BedTypes: any[]
    HotelSupplements: any[]
    LastCancellationDate: string
    CancellationPolicies: CancellationPolicy[]
    LastVoucherDate: string
    CancellationPolicy?: string
    Inclusion: string[]
    IsPassportMandatory: boolean
    IsPANMandatory: boolean
    RatePlanName?: string
  }
  
  export interface DayRate {
    Amount: number
    Date: string
  }
  
  export interface Price {
    CurrencyCode: string
    RoomPrice: number
    Tax: number
    ExtraGuestCharge: number
    ChildCharge: number
    OtherCharges: number
    Discount: number
    PublishedPrice: number
    PublishedPriceRoundedOff: number
    OfferedPrice: number
    OfferedPriceRoundedOff: number
    AgentCommission: number
    AgentMarkUp: number
    ServiceTax: number
    TCS: number
    TDS: number
    ServiceCharge: number
    TotalGSTAmount: number
    GST: Gst
  }
  
  export interface Gst {
    CGSTAmount: number
    CGSTRate: number
    CessAmount: number
    CessRate: number
    IGSTAmount: number
    IGSTRate: number
    SGSTAmount: number
    SGSTRate: number
    TaxableAmount: number
  }
  
  export interface CancellationPolicy {
    Charge: number
    ChargeType: number
    Currency: string
    FromDate: string
    ToDate: string
  }
  