let csv = d3.csv(
    "runs.csv",
    function(datum){
        console.log("run data read in nicely:");
        console.log(datum);
        return {
            "distance_km": +datum.distance_km
        };
    }
);
let total_distance = csv.forEach(run_datum => run_datum.distance_km).reduce((x, y) => x + y, 0);
d3.select("#total-distance").textContent = total_distance;
