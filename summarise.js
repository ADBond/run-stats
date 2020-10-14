d3.csv(
    "runs.csv",
    function(datum){
        console.log("run data read in nicely:");
        console.log(datum);
        return {
            "distance_km": +datum.distance_km
        };
    }
).then(
    function(csv_data){
        console.log("everything is:");
        console.log(csv_data);
        // not sure why columns has joined the party here
        delete csv_data.columns;
        const distances = csv_data.map(run_datum => run_datum.distance_km);
        console.log(distances);
        const total_distance = distances.reduce((x, y) => x + y, 0);
        console.log(total_distance);
        d3.select("#total-distance").text(total_distance);
    }
);
