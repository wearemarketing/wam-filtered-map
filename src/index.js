'use strict';

const $ = require('jquery');

class Maps {
    constructor({
        el = '',
        filter = '',
        data = [],
        customOptions = {}
    } = {}) {
        this.el = el;
        this.filterElement = filter;
        this.data = data,
        this.customOptions = customOptions;
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
    addEvents() {
        if(!!$(this.el).length) {
            const CATEGORIES = this.data.categories;
            const FIXED_POI = this.data.fixed_poi;
            const POI = this.data.poi;

            let defaultOptions = {
                el: this.el,
                lat: '40.0000',
                lng: '-4.0000',
                zoom: 15,
                maxZoom: 17,
                mapTypeControl: false,
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: true,
                styles: [{"featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{"color": "#444444"}]}, {"featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [ {"visibility": "on"},{"color": "#fbb140"} ] }, {"featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [ {"visibility": "on"},{"color": "#000000"} ] }, {"featureType": "administrative.country", "elementType": "labels.text.stroke", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.province", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.province", "elementType": "geometry", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.province", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.province", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.locality", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.locality", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.locality", "elementType": "labels.text", "stylers": [{"visibility": "off"}, {"color": "#ff0000"}]}, {"featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"}, {"color": "#fbb140"}]}, {"featureType": "administrative.locality", "elementType": "labels.text.stroke", "stylers": [{"visibility": "on"}, {"gamma": "0.00"}, {"weight": "1.97"}, {"color": "#ffffff"}]}, {"featureType": "administrative.locality", "elementType": "labels.icon", "stylers": [{"visibility": "on"}, {"color": "#fbb140"}]}, {"featureType": "administrative.neighborhood", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}, {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#fff4e4"}]}, {"featureType": "landscape.natural", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "landscape.natural", "elementType": "labels.text.fill", "stylers": [{"visibility": "off"}]}, {"featureType": "poi", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"visibility": "on"}, {"color": "#ffc771"}]}, {"featureType": "poi.park", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}, {"featureType": "road", "elementType": "all", "stylers": [{"saturation": -100}, {"lightness": 45}]}, {"featureType": "road.highway", "elementType": "all", "stylers": [{"visibility": "simplified"}]}, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}, {"color": "#ffffff"}]}, {"featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"}, {"color": "#9b9b9b"}]}, {"featureType": "road.highway", "elementType": "labels.icon", "stylers": [{"visibility": "off"}, {"color": "#fbb140"}]}, {"featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"}, {"color": "#9b9b9b"}]}, {"featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "road.local", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{"color": "#9b9b9b"}]}, {"featureType": "road.local", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "transit", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "all", "stylers": [{"color": "#d4eaf8"}, {"visibility": "on"}]}]
            };

            let options = $.extend({}, defaultOptions, this.customOptions);

            this.createMaps(CATEGORIES, FIXED_POI, POI, options);
        }
    }

    /**
     * Inits map with passed options and inits initMarkers() and toggleFilters()
     * @param  {Class} map  gmaps instance
     */
    createMaps(CATEGORIES, FIXED_POI, POI, options) {
        let self = this,
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
    initMarkers(CATEGORIES, FIXED_POI, POI) {
        let self = this,
            markersFromFilters = this.filterMarkers(POI),
            markersToLoad = markersFromFilters.concat(FIXED_POI);

        let bounds =  new google.maps.LatLngBounds();

        markersToLoad.forEach(function(element) {
            let markerToShow = self.createMarker(element, CATEGORIES);

            if(typeof markerToShow !== 'undefined'){
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

    filterMarkers(POI) {
        let checkedCategory = [];

        $(this.filterElement).each(function(index, filter) {
            if($(filter).is(':checked')){
                checkedCategory.push($(this).data('legend'));
            }
        });

        return POI.filter(marker => checkedCategory.indexOf(marker.category) !== -1);
    }

    /**
     * Returns a valid marker, with its own infowindow, that can be read by the map instance.
     */
    createMarker(element, CATEGORIES) {
        return {
            lat: element.latitude,
            lng: element.longitude,
            icon: element.icon ? element.icon : CATEGORIES.find(category => category.id === element.category).icon,
            infoWindow: {
                content: `<div class="marker-content"> <img class="marker-content--image" src="${element.img}"> <h1 class="marker-content--title">${element.name}</h1>
                <div class="marker-content--text">${element.description}</div> </div>`
            },
            zIndex: element.zIndex ? element.zIndex : 0
        };
    }

    /**
     * Watches all changes in filters checkboxes, removes all markers and inits initmarkers() again.
     */
    toggleFilters(CATEGORIES, FIXED_POI, POI) {
        let self = this;

        $(this.filterElement).on('change', function() {
            self.map.removeMarkers();
            self.initMarkers(CATEGORIES, FIXED_POI, POI);
        });
    }
}

module.exports = Maps;
