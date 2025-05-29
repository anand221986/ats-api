export interface FlightDetail {
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
    LastTicketDate: string
    TicketAdvisory: any
    FareRules: FareRule[]
    PenaltyCharges: PenaltyCharges
    AirlineCode: string
    MiniFareRules: MiniFareRule[][]
    ValidatingAirline: string
    FareClassification: FareClassification2
    flight_fare?:number
    flight_airline?:string
    depart_time?:string
    arrival_time?:string
    is_return?:boolean
}

// export interface FlightSegment{

// }

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
    CabinBaggage: any
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
    StopPointArrivalTime: string
    StopPointDepartureTime: string
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

export interface PenaltyCharges {
    ReissueCharge: string
    CancellationCharge: string
}

export interface MiniFareRule {
    JourneyPoints: string
    Type: string
    From: any
    To: any
    Unit: any
    Details: string
}

export interface FareClassification2 {
    Color: string
    Type: string
}
