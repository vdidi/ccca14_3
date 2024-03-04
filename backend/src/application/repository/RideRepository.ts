import Ride from "../../domain/Ride";

export default interface RideRepository {
	save (ride: Ride): Promise<void>;
	update (ride: Ride): Promise<void>;
	getById (rideId: string): Promise<Ride | undefined>;
	list (): Promise<Ride[]>;
	getActiveRideByPassengerId (passangerId: string): Promise<Ride | undefined>;
}