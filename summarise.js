let csv = d3.csv(
    "runs.csv",
    function(data){
        console.log("run data read in nicely:");
        console.log(data);
        let total_distance = data.forEach(run_datum => run_datum.distance_km).reduce((x, y) => x + y, 0);
        d3.select("#total-distance").textContent = total_distance;
    }
);
