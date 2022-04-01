const {parse} = require("csv-parse");
const fs = require("fs")

// Define array for all planet information
const habitablePlanets = [];

// func to filter habitable planets
function isHabitablePlanet(planet) {
	return planet["koi_disposition"] === "CONFIRMED"
		&& planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11
		&& planet["koi_prad"] < 1.6;
}

// Read / parse csv file data
fs.createReadStream("kepler_data.csv")
	.pipe(parse({
		comment: "#",
		columns: true,
	}))
	// If planet is habitable add it to the habitablePlanets array
	.on("data", (data) => {
		if (isHabitablePlanet(data)) {
			habitablePlanets.push(data);
		}
	})
	// Handle errors
	.on("error", (err) => {
		console.log(err);
	})
	// Log the names and number of planets in the habitablePlanets array
	.on("end", () => {
		console.log(habitablePlanets.map(planet => planet["kepler_name"]));
		console.log(`${habitablePlanets.length} habitable planets found!`);
	});
