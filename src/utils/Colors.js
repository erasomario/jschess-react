/**
 * Mixes two Hex colors
 * @param {*} color1 
 * @param {*} color2 
 * @param {*} weight weight for color 2
 * @returns 
 */
var mix = function (color1, color2, weight) {

    if (color1[0] === "#") {
        color1 = color1.slice(1)
    }
    if (color2[0] === "#") {
        color2 = color2.slice(1)
    }

    function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
    function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal 

    weight = (typeof (weight) !== 'undefined') ? weight : 0.5; // set the weight to 50%, if that argument is omitted
    let color = "";
    for (var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
        var v1 = h2d(color1.substr(i, 2)), // extract the current pairs
            v2 = h2d(color2.substr(i, 2)),
            val = d2h(Math.floor((v1 * (1 - weight)) + (v2 * weight)));
        while (val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit
        color += val; // concatenate val to our new color string
    }
    return "#" + color;
}
export { mix }