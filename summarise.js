// TODO: nicer handling/conversions
function kmToMiles(distanceKm, precision=2){
    const kmPerMile = 1.609;
    const distanceMiles= distanceKm / kmPerMile;
    return distanceMiles.toFixed(precision);
}

function timeToSeconds(hours, minutes, seconds){
    return 3600*parseInt(hours) + 60*parseInt(minutes) + parseInt(seconds);
}

function hoursFromSeconds(seconds){
    return Math.floor(seconds/3600);
}
function leftoverMinutesFromSeconds(seconds){
    return Math.floor((seconds % 3600) / 60);
}
function leftoverSecondsFromSeconds(seconds){
    return seconds % 60;
}
function hmsStringFromSeconds(seconds){
    return `${hoursFromSeconds(seconds)} hours, ${leftoverMinutesFromSeconds(seconds)} minutes, ${leftoverSecondsFromSeconds(seconds)} seconds`
}

function isFiveK(distance_km){
    const tolerance = 0.05;
    return ((5 - tolerance) < distance_km) && (distance_km < (5 + tolerance));
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

        const distances = csv_data.map(run_datum => run_datum.distance_km);
        const times = csv_data.map(run_datum => run_datum.total_seconds);

        const total_distance = distances.reduce((x, y) => x + y, 0);
        const total_seconds = times.reduce((x, y) => x + y, 0);

        const five_ks = csv_data.filter(datum => isFiveK(datum.distance_km));
        let best_five = {"total_seconds": Infinity};
        five_ks.forEach(
            datum => {
                console.log("dataa")
                console.log(datum);
                console.log(best_five);
                if(datum.total_seconds < best_five.total_seconds){
                    best_five = datum;
                }
            }
        );
        console.log(five_ks);
        console.log(best_five);
        d3.select("#total-distance").text(total_distance);
        d3.select("#total-distance-miles").text(kmToMiles(total_distance));
        d3.select("#total-time").text(hmsStringFromSeconds(total_seconds));
        d3.select("#total-time-seconds").text(total_seconds);
    }
);
