import pgp from "pg-promise";
import RideRepository from "../../application/repository/RideRepository";
import Ride from "../../domain/Ride";

export default class RideRepositoryDatabase implements RideRepository {
	
	async save (ride: Ride) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into cccat14.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.getStatus(), ride.date]);
		await connection.$pool.end();
	}
	
	async getById (rideId: string): Promise<Ride | undefined> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [ride] = await connection.query("select * from cccat14.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
		return new Ride(ride.rideId, ride.passengerId, ride.driverId, ride.status, ride.date, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong);
	}
	
	async getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [ride] = await connection.query("select * from cccat14.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')", [passengerId]);
		await connection.$pool.end();
		return ride;
	}

	async list(): Promise<Ride[]> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const ridesData = await connection.query("select * from cccat14.ride", []);
		await connection.$pool.end();
		const rides: Ride[] = [];
		for (const rideData of ridesData) {
			rides.push(new Ride(rideData.ride_id, rideData.passenger_id, rideData.driver_id, rideData.status, rideData.date, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long)));
		}
		return rides;
	}

	async update(ride: Ride) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("update cccat14.ride set status = $1, driver_id = $2 where ride_id = $1", [ride.getStatus(), ride.getDriverId(), ride.rideId]);
		await connection.$pool.end();
	}
}