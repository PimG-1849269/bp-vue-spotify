function prettyFeatureValue(val, feat) {
        if (val == Number.NEGATIVE_INFINITY) {
            return "";
        }

        if (feat == "key") {
            const notes = ["C", "C#,Db", "D", "D#,Eb", "E", "F", "F#,Gb", "G", "G#,Ab", "A", "A#,Bb","B"];
            return notes[parseInt(val)];

        } else if (feat == "loudness") {
            return val+"dB";

        } else if (feat == "mode") {
            if (val == 0) {
                return "Minor";
            } else {
                return "Major";
            }

        } else if (feat == "tempo") {
            return val+"bpm";

        } else if (feat == "time_signature"){
            return val+"/4";

        } else if (feat == "duration_ms"){
            return msToMin(val)+"min";

        } else {
            var v = val;
            // if float
            if (val <= 1) {
                v = Math.round(val*100);
            }
            return v + "%";
        }
};

function prettyFeatureDiff(diff, feat, ogval, relation) {
    if (feat == "key") {
        const notes = ["C", "C#,Db", "D", "D#,Eb", "E", "F", "F#,Gb", "G", "G#,Ab", "A", "A#,Bb","B"];
        if (relation == "previous") {
            return notes[(parseInt(ogval)-parseInt(diff))]+"  → "+notes[parseInt(ogval)];
        } else {
            return notes[parseInt(ogval)]+" → "+notes[(parseInt(ogval)-parseInt(diff))];
        }

    } else if (feat == "loudness") {
        var v = (diff > 0 ? "+" + Number(diff).toFixed(3) : Number(diff).toFixed(3));
        return v+"dB";

    } else if (feat == "mode") {
        const modes = ["Minor", "Major"];

        if (relation == "previous") {
            return modes[(parseInt(ogval)-parseInt(diff))]+" → "+modes[parseInt(ogval)];
        } else {
            return modes[parseInt(ogval)]+" → "+modes[(parseInt(ogval)-parseInt(diff))];
        }

    } else if (feat == "tempo") {
        var v = (diff > 0 ? "+" + Number(diff).toFixed(3) : Number(diff).toFixed(3));
        return v+"bpm";

    } else if (feat == "time_signature"){
        if (relation == "previous") {
            return (parseInt(ogval)-parseInt(diff))+"/4"+" → "+parseInt(ogval)+"/4";
        } else {
            return parseInt(ogval)+"/4"+" → "+(parseInt(ogval)-parseInt(diff))+"/4";
        }

    } else if (feat == "duration_ms"){
        return (diff > 0 ? "+" + msToMin(diff) : "-" + msToMin(String(diff).slice(1)))+"min";

    } else {
        var v = diff;
        // if float
        if (diff <= 1) {
            v = Math.round(diff*100);
        }

        v = (v > 0 ? "+" + v : v);
        return v + "%";
    }
};

function prettyFeatureName(feat, first_up = true) {
    var name = feat;

    // Check if needs prettying
    if (feat == "duration_ms") {
        name = "duration";
    } else if (feat == "time_signature") {
        name = "time signature";
    } 

    // Upper the first letter
    if (first_up) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    return name;
};

export {prettyFeatureValue, prettyFeatureDiff, prettyFeatureName};

// Milliseconds to min:sec
// https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function msToMin(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return (seconds == 60 ?
        (minutes + 1) + ":00" :
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
};