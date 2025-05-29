export interface PackageItenaryDetail {
    id: number
    package_id: number
    seller_id: number
    itenary_detail: ItenaryDetail[]
    cost_detail: CostDetail
    total_itenary_cost: number
    flights?: number
    activities?: number
    transfers?: number
    visas?: number
    insurance?: number
    rails?: number
    hotel_nights?: number
    seller_detail?: SellerDetail
    created_DT: string
    updated_DT: any
    lead_package_detail?: any
    installments?: any
}

export interface SellerDetail {
    id: number
    name: string
    email: string
    phone: string
    password: string
    status: number
    created_at: string
}

export interface ItenaryDetail {
    active: boolean
    day_from: string
    day_to: string
    description: string
    day_point: string
    details: Detail[]
}

export interface Detail {
    type: string
    title: string
    description?: string
    flight_from?: string
    flight_from_iata?: string
    flight_to_iata?: string
    selected_flight?: SelectedFlight
    hcc_city_id?: number
    hcc_countrycode?: string
    selected_transfer?: SelectedTransfer
    hotel_from?: string
    hotel_city_id?: number
    hotel_city?: string
    hotel_country?: string
    hotel_to?: string
    selected_hotel?: any
    selected_activity?: SelectedActivity
    selected_visa?: SelectedActivity
    selected_insurance?: SelectedActivity
    selected_visa_assistance?: SelectedActivity
    selected_rail?: SelectedActivity
}

export interface SelectedFlight {
    IsHoldAllowedWithSSR: boolean
    ResultIndex: string
    Source: number
    IsLCC: boolean
    IsRefundable: boolean
    IsPanRequiredAtBook: boolean
    IsPanRequiredAtTicket: boolean
    IsPassportRequiredAtBook: boolean
    IsPassportRequiredAtTicket: boolean
    GSTAllowed: boolean
    IsCouponAppilcable: boolean
    IsGSTMandatory: boolean
    AirlineRemark: string
    ResultFareType: string
    Fare: Fare
    FareBreakdown: FareBreakdown[]
    Segments: Segment[][]
    LastTicketDate: any
    TicketAdvisory: any
    FareRules: FareRule[]
    AirlineCode: string
    ValidatingAirline: string
    FareClassification: FareClassification2
    flight_fare: number
    flight_airline: string
}

export interface Fare {
    Currency: string
    BaseFare: number
    Tax: number
    TaxBreakup: TaxBreakup[]
    YQTax: number
    AdditionalTxnFeeOfrd: number
    AdditionalTxnFeePub: number
    PGCharge: number
    OtherCharges: number
    ChargeBU: ChargeBu[]
    Discount: number
    PublishedFare: number
    CommissionEarned: number
    PLBEarned: number
    IncentiveEarned: number
    OfferedFare: number
    TdsOnCommission: number
    TdsOnPLB: number
    TdsOnIncentive: number
    ServiceFee: number
    TotalBaggageCharges: number
    TotalMealCharges: number
    TotalSeatCharges: number
    TotalSpecialServiceCharges: number
}

export interface TaxBreakup {
    key: string
    value: number
}

export interface ChargeBu {
    key: string
    value: number
}

export interface FareBreakdown {
    Currency: string
    PassengerType: number
    PassengerCount: number
    BaseFare: number
    Tax: number
    TaxBreakUp: TaxBreakUp[]
    YQTax: number
    AdditionalTxnFeeOfrd: number
    AdditionalTxnFeePub: number
    PGCharge: number
    SupplierReissueCharges: number
}

export interface TaxBreakUp {
    key: string
    value: number
}

export interface Segment {
    Baggage: string
    CabinBaggage: string
    CabinClass: number
    TripIndicator: number
    SegmentIndicator: number
    Airline: Airline
    NoOfSeatAvailable: number
    Origin: Origin
    Destination: Destination
    Duration: number
    GroundTime: number
    Mile: number
    StopOver: boolean
    FlightInfoIndex: string
    StopPoint: string
    StopPointArrivalTime: any
    StopPointDepartureTime: any
    Craft: string
    Remark: any
    IsETicketEligible: boolean
    FlightStatus: string
    Status: string
    FareClassification: FareClassification
}

export interface Airline {
    AirlineCode: string
    AirlineName: string
    FlightNumber: string
    FareClass: string
    OperatingCarrier: string
}

export interface Origin {
    Airport: Airport
    DepTime: string
}

export interface Airport {
    AirportCode: string
    AirportName: string
    Terminal: string
    CityCode: string
    CityName: string
    CountryCode: string
    CountryName: string
}

export interface Destination {
    Airport: Airport2
    ArrTime: string
}

export interface Airport2 {
    AirportCode: string
    AirportName: string
    Terminal: string
    CityCode: string
    CityName: string
    CountryCode: string
    CountryName: string
}

export interface FareClassification {
    Type: string
}

export interface FareRule {
    Origin: string
    Destination: string
    Airline: string
    FareBasisCode: string
    FareRuleDetail: string
    FareRestriction: string
    FareFamilyCode: string
    FareRuleIndex: string
}

export interface FareClassification2 {
    Color: string
    Type: string
}

export interface SelectedTransfer {
    id: number
    uuid: string
    selected_country: string
    selected_state: string
    selected_destination: string
    selected_type: number
    selected_sub_category: string
    activity_name: string
    terms_conditions: string
    safety_instructions: string
    vendor_name: string
    short_description: string
    long_description: string
    inclusions: string
    exclusions: string
    cancellation: string
    image: string
    selected_channel: string
    time_of_day: number
    pickup_included: number
    dropoff_included: number
    selected_days: string
    rating: number
    schedule_start_time: string
    pickup_time: string
    drop_off_time: string
    pickup_point: string
    dropoff_point: string
    tour_duration: number
    vehicle_type: string
    currency: string
    activity_validity_start_date: string
    activity_validity_end_date: string
    travel_start_date: string
    travel_end_date: string
    cost_per_adult: number
    cost_per_child: number
    cost_per_infant: number
    fixed_cost: number
    min_pax_count: number
    max_pax_count: number
    min_eligible_age: number
    max_eligible_age: number
    meta_tag_name: string
    entry_fee_included: string
    additional_detail: string
    status: number
    created_DT: string
    destination_detail: DestinationDetail
}

export interface DestinationDetail {
    id: number
    name: string
}

export interface SelectedHotel {
    IsHotDeal: boolean
    ResultIndex: number
    HotelCode: string
    HotelName: string
    HotelCategory: string
    StarRating: number
    HotelDescription: string
    HotelPromotion: string
    HotelPolicy: string
    Price: Price
    HotelPicture: string
    HotelAddress: string
    HotelContactNo: string
    HotelMap: any
    Latitude: string
    Longitude: string
    HotelLocation: any
    SupplierPrice: any
    RoomDetails: any[]
    selected_room: SelectedRoom
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

export interface SelectedRoom {
    AvailabilityType: string
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
    RatePlanName: string
    InfoSource: string
    SequenceNo: string
    DayRates: DayRate[]
    IsPerStay: boolean
    SupplierPrice: any
    Price: Price2
    RoomPromotion: string
    Amenities: string[]
    Amenity: string[]
    SmokingPreference: string
    BedTypes: any[]
    HotelSupplements: any[]
    LastCancellationDate: string
    CancellationPolicies: CancellationPolicy[]
    LastVoucherDate: string
    CancellationPolicy: string
    Inclusion: string[]
    IsPassportMandatory: boolean
    IsPANMandatory: boolean
    start_date: string
    end_date: string
}

export interface DayRate {
    Amount: number
    Date: string
}

export interface Price2 {
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
    GST: Gst2
}

export interface Gst2 {
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

export interface SelectedActivity {
    id: number
    uuid: string
    selected_country: string
    selected_state: string
    selected_destination: string
    selected_type: number
    selected_sub_category: string
    activity_name: string
    terms_conditions: string
    safety_instructions: string
    vendor_name: string
    short_description: string
    long_description: string
    inclusions: string
    exclusions: string
    cancellation: string
    image: string
    selected_channel: string
    time_of_day: number
    pickup_included: number
    dropoff_included: number
    selected_days: string
    rating: number
    schedule_start_time: string
    pickup_time: string
    drop_off_time: string
    pickup_point: string
    dropoff_point: string
    tour_duration: number
    vehicle_type: string
    currency: string
    activity_validity_start_date: string
    activity_validity_end_date: string
    travel_start_date: string
    travel_end_date: string
    cost_per_adult: number
    cost_per_child: number
    cost_per_infant: number
    fixed_cost: number
    min_pax_count: number
    max_pax_count: number
    min_eligible_age: number
    max_eligible_age: number
    meta_tag_name: string
    entry_fee_included: string
    additional_detail: string
    status: number
    created_DT: string
    destination_detail: DestinationDetail2
}

export interface DestinationDetail2 {
    id: number
    name: string
}

export interface CostDetail {
    flight_cost: number
    flight_markup: number
    hotel_cost: number
    hotel_markup: number
    transfer_cost: number
    transfer_markup: number
    activity_cost: number
    activity_markup: number
    vas_cost: number
    vas_markup: number
    net_cost_price: number
    net_markup: number
    gst: number
    tcs: number
    total_itenary_cost: number
}
