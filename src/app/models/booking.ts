import { PaymentMethod } from "../enums/paymentMethod";
import { Traveler } from "./traveler";

export class Booking {
    public id: string;
    public buchungsklasseId: string;
    public datum: string;
    public flughafen: string;
    public handGepaeck: string;
    public koffer: string;
    public mitReiser: Traveler;
    public reiser: Traveler;
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
    public mitReiserId: string;
    public reiserId: string;
    public zahlungMethod: PaymentMethod;
    public reiseAngebotId: string;
}
