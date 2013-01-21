var Fermata = Fermata || {};
Fermata.Tests = Fermata.Tests || {};
Fermata.Tests.Utils = {};

Fermata.Tests.Utils.LoadJSONFixture = function (fixture, callback) {
    // Client-side, use jQuery
    if (typeof require === 'undefined') {
        $.getJSON('fixtures/' + fixture, function(data) {
            callback(data);
        });
    }
    else {
        var fs = require('fs');
        fs.readFile(__dirname + '/fixtures/' + fixture, 'UTF-8', function(err, data) {
            callback(JSON.parse(data));
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Fermata;
}