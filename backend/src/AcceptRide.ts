import RideDAO from "./RideDAO";
import AccountDAO from "./AccountRepository";

export default class AcceptRide {

	constructor (private rideDAO: RideDAO, private accountDAO: AccountDAO) {
	}

	async execute (input: any) {
 		const account = await this.accountDAO.getById(input.passengerId);
		if (!account?.isDriver) throw new Error("Only drivers can accept a ride")
		const ride = await this.rideDAO.getById(input.rideId);
		ride.status = "accepted";
		ride.driverId = input.driverId;
		await this.rideDAO.update(input);
	}

}
