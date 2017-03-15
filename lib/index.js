'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = require('jquery');

var Maps = function () {
    function Maps() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$el = _ref.el,
            el = _ref$el === undefined ? '' : _ref$el,
            _ref$filter = _ref.filter,
            filter = _ref$filter === undefined ? '' : _ref$filter,
            _ref$data = _ref.data,
            data = _ref$data === undefined ? [] : _ref$data,
            _ref$customOptions = _ref.customOptions,
            customOptions = _ref$customOptions === undefined ? {} : _ref$customOptions;

        _classCallCheck(this, Maps);

        this.el = el;
        this.filterElement = filter;
        this.data = data, this.customOptions = customOptions;
        this.map;
        this.addEvents();
    }

    /**
     * Collects data and  map options and initializes createMaps()
     * @param  {Array} CATEGORIES  Collection of places categories
     * @param  {Array} FIXED_POI  Collection of places to show always
     * @param  {Array} POI  Collection of places to show depending on selected filters
     * @param  {Object} defaultOptions  Default options passed to map instance
     * @param  {Object} options  Result of extending defaultOptions with customOptions
     */


    _createClass(Maps, [{
        key: 'addEvents',
        value: function addEvents() {
            if (!!$(this.el).length) {
                var CATEGORIES = this.data.categories;
                var FIXED_POI = this.data.fixed_poi;
                var POI = this.data.poi;

                var defaultOptions = {
                    el: this.el,
                    lat: '40.0000',
                    lng: '-4.0000',
                    zoom: 15,
                    maxZoom: 17,
                    mapTypeControl: false,
                    scrollwheel: false,
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#fbb140" }] }, { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#000000" }] }, { "featureType": "administrative.country", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.province", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.province", "elementType": "geometry", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.province", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.province", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.locality", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.locality", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.locality", "elementType": "labels.text", "stylers": [{ "visibility": "off" }, { "color": "#ff0000" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#fbb140" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "gamma": "0.00" }, { "weight": "1.97" }, { "color": "#ffffff" }] }, { "featureType": "administrative.locality", "elementType": "labels.icon", "stylers": [{ "visibility": "on" }, { "color": "#fbb140" }] }, { "featureType": "administrative.neighborhood", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#fff4e4" }] }, { "featureType": "landscape.natural", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "landscape.natural", "elementType": "labels.text.fill", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "color": "#ffc771" }] }, { "featureType": "poi.park", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#9b9b9b" }] }, { "featureType": "road.highway", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }, { "color": "#fbb140" }] }, { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#9b9b9b" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.local", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#9b9b9b" }] }, { "featureType": "road.local", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#d4eaf8" }, { "visibility": "on" }] }]
                };

                var options = $.extend({}, defaultOptions, this.customOptions);

                this.createMaps(CATEGORIES, FIXED_POI, POI, options);
            }
        }

        /**
         * Inits map with passed options and inits initMarkers() and toggleFilters()
         * @param  {Class} map  gmaps instance
         */

    }, {
        key: 'createMaps',
        value: function createMaps(CATEGORIES, FIXED_POI, POI, options) {
            var self = this,
                map = require('gmaps');

            this.map = new map(options);
            this.initMarkers(CATEGORIES, FIXED_POI, POI);
            this.toggleFilters(CATEGORIES, FIXED_POI, POI);
        }

        /**
         * Creates all markers to insert into the map instance and centers it.
         * @param  {Array} markersFromFilters  Collection of filtered places
         * @param  {Array} markersToLoad  Collection of filtered and fixed places. We iterate through this collection to create markers with createMarker().
         */

    }, {
        key: 'initMarkers',
        value: function initMarkers(CATEGORIES, FIXED_POI, POI) {
            var self = this,
                markersFromFilters = this.filterMarkers(POI),
                markersToLoad = markersFromFilters.concat(FIXED_POI);

            var bounds = new google.maps.LatLngBounds();

            markersToLoad.forEach(function (element) {
                var markerToShow = self.createMarker(element, CATEGORIES);

                if (typeof markerToShow !== 'undefined') {
                    self.map.addMarker(markerToShow);
                }

                bounds.extend(new google.maps.LatLng(markerToShow.lat, markerToShow.lng));
            });

            this.map.fitBounds(bounds);
        }

        /**
         * Goes over all filter checkboxes, sees which categories are "checked" and rescues all places with that category.
         * @param  {Array} checkedCategory  Collection of categories of places that must be inserted into the map.
         */

    }, {
        key: 'filterMarkers',
        value: function filterMarkers(POI) {
            var checkedCategory = [];

            $(this.filterElement).each(function (index, filter) {
                if ($(filter).is(':checked')) {
                    checkedCategory.push($(this).data('legend'));
                }
            });

            return POI.filter(function (marker) {
                return checkedCategory.indexOf(marker.category) !== -1;
            });
        }

        /**
         * Returns a valid marker, with its own infowindow, that can be read by the map instance.
         */

    }, {
        key: 'createMarker',
        value: function createMarker(element, CATEGORIES) {
            return {
                lat: element.latitude,
                lng: element.longitude,
                icon: element.icon ? element.icon : CATEGORIES.find(function (category) {
                    return category.id === element.category;
                }).icon,
                infoWindow: {
                    content: '<div class="marker-content"> <img class="marker-content--image" src="' + element.img + '"> <h1 class="marker-content--title">' + element.name + '</h1>\n                <div class="marker-content--text">' + element.description + '</div> </div>'
                },
                zIndex: element.zIndex ? element.zIndex : 0
            };
        }

        /**
         * Watches all changes in filters checkboxes, removes all markers and inits initmarkers() again.
         */

    }, {
        key: 'toggleFilters',
        value: function toggleFilters(CATEGORIES, FIXED_POI, POI) {
            var self = this;

            $(this.filterElement).on('change', function () {
                self.map.removeMarkers();
                self.initMarkers(CATEGORIES, FIXED_POI, POI);
            });
        }
    }]);

    return Maps;
}();

module.exports = Maps;