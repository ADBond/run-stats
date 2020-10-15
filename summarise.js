// TODO: nicer handling/conversions
function kmToMiles(distanceKm, precision=2){
    const kmPerMile = 1.609;
    const distanceMiles= distanceKm / kmPerMile;
    return distanceMiles.toFixed(precision);
}

function timeToSeconds(hours, minutes, seconds){
    return 3600*parseInt(hours) + 60*parseInt(minutes) + parseInt(seconds);
}

d3.csv(
    "runs.csv",
    function(datum){
        console.log("run data read in nicely:");
        console.log(datum);
        return {
            "distance_km": +datum.distance_km,
            "total_seconds": timeToSeconds(datum.hours, datum.minutes, datum.seconds)
        };
    }
).then(
    function(csv_data){
        console.log("everything is:");
        console.log(csv_data);
        // not sure why columns has joined the party here
        delete csv_data.columns;
        const distances = csv_data.map(run_datum => run_datum.distance_km);
        const times = csv_data.map(run_datum => run_datum.total_seconds);
        console.log(times);
        const total_distance = distances.reduce((x, y) => x + y, 0);
        const total_seconds = times.reduce((x, y) => x + y, 0);
        console.log(total_distance);
        d3.select("#total-distance").text(total_distance);
        d3.select("#total-distance-miles").text(kmToMiles(total_distance));
        d3.select("#total-time").text(total_seconds);
    }
);
