'use strict';

const $ = require('jquery');

export default class Maps {
    constructor({
        el = '',
        filter = ''
    } = {}) {
        this.el = el;
        this.filterElement = filter;
        this.map;
        this.addEvents();
    }

    /**
     * Collects data and  map options and initializes createMaps()
     * @param  {Array} CATEGORIES   Collection of places categories
     * @param  {Array} CAMPERS      Collection of places to show always
     * @param  {Array} POI          Collection of places to show depending on selected filters
     */

    addEvents() {
        if(!!$(this.el).length) {
            const CATEGORIES = environmentData.categories;
            const CAMPERS = environmentData.campers;
            const POI = environmentData.poi;

            let options = {
                el: this.el,
                lat: CAMPERS[0].latitude,
                lng: CAMPERS[0].longitude,
                zoom: 15,
                maxZoom: 17,
                mapTypeControl: false,
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: true,
                styles: [{"featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{"color": "#444444"}]}, {"featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [ {"visibility": "on"},{"color": "#fbb140"} ] }, {"featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [ {"visibility": "on"},{"color": "#000000"} ] }, {"featureType": "administrative.country", "elementType": "labels.text.stroke", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.province", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.province", "elementType": "geometry", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.province", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.province", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.locality", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.locality", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative.locality", "elementType": "labels.text", "stylers": [{"visibility": "off"}, {"color": "#ff0000"}]}, {"featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"}, {"color": "#fbb140"}]}, {"featureType": "administrative.locality", "elementType": "labels.text.stroke", "stylers": [{"visibility": "on"}, {"gamma": "0.00"}, {"weight": "1.97"}, {"color": "#ffffff"}]}, {"featureType": "administrative.locality", "elementType": "labels.icon", "stylers": [{"visibility": "on"}, {"color": "#fbb140"}]}, {"featureType": "administrative.neighborhood", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}, {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#fff4e4"}]}, {"featureType": "landscape.natural", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "landscape.natural", "elementType": "labels.text.fill", "stylers": [{"visibility": "off"}]}, {"featureType": "poi", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"visibility": "on"}, {"color": "#ffc771"}]}, {"featureType": "poi.park", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}, {"featureType": "road", "elementType": "all", "stylers": [{"saturation": -100}, {"lightness": 45}]}, {"featureType": "road.highway", "elementType": "all", "stylers": [{"visibility": "simplified"}]}, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}, {"color": "#ffffff"}]}, {"featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"}, {"color": "#9b9b9b"}]}, {"featureType": "road.highway", "elementType": "labels.icon", "stylers": [{"visibility": "off"}, {"color": "#fbb140"}]}, {"featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"}, {"color": "#9b9b9b"}]}, {"featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "road.local", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{"color": "#9b9b9b"}]}, {"featureType": "road.local", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "transit", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "all", "stylers": [{"color": "#d4eaf8"}, {"visibility": "on"}]}]
            };

            this.createMaps(CATEGORIES, CAMPERS, POI, options);
        }
    }

    createMaps(CATEGORIES, CAMPERS, POI, options) {
        let self = this,
            map = require('gmaps');

        this.map = new map(options);
        this.initMarkers(CATEGORIES, CAMPERS, POI);
        this.toggleFilters(CATEGORIES, CAMPERS, POI);
    }

    initMarkers(CATEGORIES, CAMPERS, POI) {
        let self = this,
            markersFromFilters = this.filterMarkers(POI),
            markersToLoad = markersFromFilters.concat(CAMPERS);

        let bounds =  new google.maps.LatLngBounds();

        markersToLoad.forEach(function(element) {
            let markerToShow = self.createMarker(element, element.description, CATEGORIES);

            if(typeof markerToShow !== 'undefined'){
                self.map.addMarker(markerToShow);
            }

            bounds.extend(new google.maps.LatLng(markerToShow.lat, markerToShow.lng));
        });

        this.map.fitBounds(bounds);
    }

    filterMarkers(POI) {
        let markers = [];

        $(this.filterElement).each(function(index, filter) {
            if($(filter).is(':checked')){
                markers.push($(this).data('legend'));
            }
        });

        return POI.filter(marker => markers.indexOf(marker.category) !== -1);
    }

    createMarker(element, content, CATEGORIES) {
        return {
            lat: element.latitude,
            lng: element.longitude,
            icon: element.icon ? element.icon : CATEGORIES.find(category => category.id === element.category).icon,
            infoWindow: {
                content: `<h1>${element.name}</h1><p>${content}</p>`
            },
            zIndex: element.zIndex ? element.zIndex : 0
        };
    }

    toggleFilters(CATEGORIES, CAMPERS, POI) {
        let self = this;

        $(this.filterElement).on('change', function() {
            self.map.removeMarkers();
            self.initMarkers(CATEGORIES, CAMPERS, POI);
        });
    }
}
