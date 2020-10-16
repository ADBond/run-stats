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
    const hours = hoursFromSeconds(seconds);
    const minutes = leftoverMinutesFromSeconds(seconds);
    const lo_seconds = leftoverSecondsFromSeconds(seconds);
    // have mins and secs as a minimum, then everything else only as relevant
    let time_string = `${minutes} minutes, ${lo_seconds} seconds`;
    if (hours > 0){
        time_string = `${hours} hours, ${time_string}`;
    }
    return time_string
}

function isFiveK(distance_km){
    const tolerance = 0.05;
    return ((5 - tolerance) < distance_km) && (distance_km < (5 + tolerance));
}

d3.csv(
    "runs.csv",
    function(datum){
        return {
            "distance_km": +datum.distance_km,
            "total_seconds": timeToSeconds(datum.hours, datum.minutes, datum.seconds)
        };
    }
).then(
    function(csv_data){

        const distances = csv_data.map(run_datum => run_datum.distance_km);
        const times = csv_data.map(run_datum => run_datum.total_seconds);

        const total_distance = distances.reduce((x, y) => x + y, 0);
        const total_seconds = times.reduce((x, y) => x + y, 0);

        // TODO: geting to the point where I need to start structuring this a bit more proper like
        const five_ks = csv_data.filter(datum => isFiveK(datum.distance_km));
        const ten_ks = [];
        const halfs = [];
        const marathons = [];
        let best_five = {"total_seconds": Infinity};
        five_ks.forEach(
            datum => {
                if(datum.total_seconds < best_five.total_seconds){
                    // best by total time currently only
                    // TODO: best by pace (which would account for variation in distance!)
                    best_five = datum;
                }
            }
        );

        d3.select("#total-distance").text(total_distance);
        d3.select("#total-distance-miles").text(kmToMiles(total_distance));
        d3.select("#total-time").text(hmsStringFromSeconds(total_seconds));
        d3.select("#total-time-seconds").text(total_seconds);

        d3.select("#best-5k").text(hmsStringFromSeconds(best_five.total_seconds));

        d3.select("#count-total").text(csv_data.length);
        d3.select("#count-5k").text(five_ks.length);
        d3.select("#count-10k").text(ten_ks.length);
        d3.select("#count-half").text(halfs.length);
        d3.select("#count-marathon").text(marathons.length);
        // yeah yeah I know
        d3.select("#count-misc").text(csv_data.length - five_ks.length - ten_ks.length - halfs.length - marathons.length);
    }
);
