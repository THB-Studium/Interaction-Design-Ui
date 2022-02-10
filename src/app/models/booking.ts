import { PaymentMethod } from "../enums/paymentMethod";
import { Traveler } from "./traveler";

export class Booking {
    public id: string;
    public buchungsklasseId: string;
    public datum: string;
    public flughafen: string;
    public handGepaeck: string;
    public koffer: string;
    public mitReisender: Traveler;
    public reisender: Traveler;
    public zahlungMethod: PaymentMethod;
    public reiseAngebotId: string;
}

export class BookingUpdate {
    public id: string;
    public buchungsklasseId: string;
    public datum: string;
    public flughafen: string;
    public handGepaeck: string;
    public koffer: string;
    public mitReisenderId: string;
    public reisenderId: string;
    public zahlungMethod: PaymentMethod;
    public reiseAngebotId: string;
}
