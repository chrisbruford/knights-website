"use strict";
module.exports = function ($http,$q) {
    this.top10 = function () {
        return $http.get('https://bermos.tech/api/kok/?min=10')
            .then(res => res.data);
    }
}