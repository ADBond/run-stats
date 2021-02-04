// TODO: nicer handling/conversions
// TODO: stop mixing naming conventions you bellend
function kmToRuns(distance_km){
    // one run = distance between the creases
    // according to MCC laws the popping crease is 4ft in front of the bowling crease
    // 22 yards between bowling creases
    // so one run = 22 yards - 8 feet = 58 feet = 17.68 m
    const run_in_km = 0.01768;
    return Math.floor(distance_km/run_in_km);
}

function kmToMiles(distanceKm, precision=2){
    const kmPerMile = 1.609;
    const distanceMiles = distanceKm / kmPerMile;
    return distanceMiles.toFixed(precision);
}

function timeToSeconds(hours, minutes, seconds){
    return 3600*parseInt(hours) + 60*parseInt(minutes) + parseInt(seconds);
}

function daysFromSeconds(seconds){
    return Math.floor(seconds / 86400);
}
function hoursFromSeconds(seconds){
    return Math.floor((seconds % 86400) / 3600);
}
function leftoverMinutesFromSeconds(seconds){
    return Math.floor((seconds % 3600) / 60);
}
function leftoverSecondsFromSeconds(seconds){
    return seconds % 60;
}
function hmsStringFromSeconds(seconds){
    const days = daysFromSeconds(seconds);
    const hours = hoursFromSeconds(seconds);
    const minutes = leftoverMinutesFromSeconds(seconds);
    const lo_seconds = leftoverSecondsFromSeconds(seconds);
    // have mins and secs as a minimum, then everything else only as relevant
    let time_string = `${minutes} minutes, ${lo_seconds} seconds`;
    if (hours > 0 || days > 0){
        time_string = `${hours} hours, ${time_string}`;
        if (days > 0){
            time_string = `${days} days, ${time_string}`;
        }
    }

    return time_string
}

// want a generalised categorisation - maybe suplement each with category: X type tag
// if I do that then need non-overlapping boundaries
// max 0.1% tolerance officially I think, but let's be cool.
// can always adjust these as we go, let's see what seems reasonable. Plucking kind of from my arse at the moment
function within(distance_km, lower_limit, upper_limit){
    return (lower_limit <= distance_km) && (distance_km < upper_limit)
}
function isUnderFiveMisc(distance_km){
    return within(distance_km, 0, 4.95)
}
function isFiveK(distance_km){
    const tolerance = 0.05;
    return within(distance_km, (5 - tolerance), (5 + tolerance));
}
function isFiveToTenMisc(distance_km){
    return within(distance_km, 5.05, 9.95);
}
function isTenK(distance_km){
    const tolerance = 0.05;
    return within(distance_km, (10 - tolerance), (10 + tolerance));
}
function isTenToHalfMisc(distance_km){
    return within(distance_km, 10.05, 21.1);
}
function isHalf(distance_km){
    // reference value 21.0975 km
    return within(distance_km, 21.0, 21.2);
}
function isMarathon(distance_km){
    // reference value 42.195 km
    // officially 42.15 to 42.24
    // let's allow a little more at top end
    return within(distance_km, 42.15, 42.3);
}

function recent(runs, offset=1){
    // TODO: this should be beefed up to use dates, as may not be entered sequentially
    return runs[runs.length - offset];
}

// TODO: make updating more modular so that one error doesn't nerf everything
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

        const total_distance = distances.reduce((x, y) => x + y, 0).toFixed(2);
        const total_seconds = times.reduce((x, y) => x + y, 0);

        // TODO: geting to the point where I need to start structuring this a bit more proper like
        const five_ks = csv_data.filter(datum => isFiveK(datum.distance_km));
        const ten_ks = csv_data.filter(datum => isTenK(datum.distance_km));
        const halfs = csv_data.filter(datum => isHalf(datum.distance_km));
        const marathons = csv_data.filter(datum => isMarathon(datum.distance_km));
        const sub_fives = csv_data.filter(datum => isUnderFiveMisc(datum.distance_km));
        const five_tens = csv_data.filter(datum => isFiveToTenMisc(datum.distance_km));
        const ten_halfs = csv_data.filter(datum => isTenToHalfMisc(datum.distance_km));
        const half_fulls = [];
        // TODO: look at all this horrible repitition, and feel shame
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
        let best_ten = {"total_seconds": Infinity};
        ten_ks.forEach(
            datum => {
                if(datum.total_seconds < best_ten.total_seconds){
                    // best by total time currently only
                    // TODO: best by pace (which would account for variation in distance!)
                    best_ten = datum;
                }
            }
        );
        let longest = {"distance_km": 0};
        csv_data.forEach(
            datum => {
                if(datum.distance_km > longest.distance_km){
                    longest = datum;
                }
            }
        )

        const recent_run = recent(csv_data);
        const penultimate_run = recent(csv_data, 2);

        const ids_to_info = {
            "total-distance": total_distance,
            "total-distance-miles": kmToMiles(total_distance),
            "total-distance-runs": kmToRuns(total_distance),
            "total-time": hmsStringFromSeconds(total_seconds),
            "total-time-seconds": total_seconds,

            "best-5k": hmsStringFromSeconds(best_five.total_seconds),
            "best-10k": hmsStringFromSeconds(best_ten.total_seconds),
            "longest-distance": longest.distance_km,

            "count-total": csv_data.length,
            "count-5k": five_ks.length,
            "count-10k": ten_ks.length,
            "count-half": halfs.length,
            "count-marathon": marathons.length,

            // TODO: mate, come on
            "count-misc": csv_data.length - five_ks.length - ten_ks.length - halfs.length - marathons.length,
            "count-misc-sub-5": sub_fives.length,
            "count-misc-5-10": five_tens.length,
            "count-misc-10-half": ten_halfs.length,
            "count-misc-half-marathon": half_fulls.length,

            
            "recent-1-distance": recent_run.distance_km,
            "recent-1-time": hmsStringFromSeconds(recent_run.total_seconds),
            "recent-2-distance": penultimate_run.distance_km,
            "recent-2-time": hmsStringFromSeconds(penultimate_run.total_seconds),
        }

        // TODO: is this idiomatically the way to do this?
        const ids = Object.keys(ids_to_info);
        ids.forEach(
            (key) => {
                d3.select(`#${key}`).text(ids_to_info[key]);
            }
        );
    }
);
