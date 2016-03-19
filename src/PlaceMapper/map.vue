<style>
    #map{height: 100%; width: 100%;}
    #search-input{width: 50%; font-size:3em;}
</style>

<template>
    <input type="text" name="place-search" id="search-input">
    <div id="map">
        {{ message }}
    </div>
</template>

<script>
    var coordinates = require('./coordinates.js')
    var fillInfoWindow = require('./infoWindowTemplate.js')

    module.exports = {
        data: function (){
            return {
                savedPlaces: [],
                map: null,
                autoComplete: null,
                marker: null,
                infoWindow: null
            }
        },
        events:{
            fitToBounds: ['fitMapToBounds'],
            centerMap: ['centerMapOnLocation'],
            mapInitialized: ['addAutoComplete', 'addPlaceChangeListener', 'addMarkerClickListener']
        },
        methods: {

            /** ===== Map Manipulation ===== **/
            fitMapToBounds: function (bounds){
                this.map.fitBounds(bounds)
            },
            centerMapOnLocation: function (location){
                this.map.setCenter(location)
                // consider replacing the magic number 17 out to a named property or constant
                this.map.setZoom(17)
            },

            /** ===== Marker Manipulation ===== **/
            setMarkerPlace: function(place){
                this.marker.setPlace({
                    placeId: place.place_id,
                    location: place.geometry.location
                })
            },
            setMarkerVisibility: function (boolean){
                this.marker.setVisible(boolean)
            },

            /** ===== InfoWindow manipulation ===== **/
            setInfoWindowContents: function (htmlContent){
                this.infoWindow.setContent(htmlContent)
            },
            openInfoWindow: function (anchor){
                this.infoWindow.open(this.map, anchor)
            },
            closeInfoWindow: function (){
                this.infoWindow.close()
            },

            /** ===== Initilization ===== **/
            initMap: function (){
                var GoogleMapsLoader = require('google-maps')
                GoogleMapsLoader.KEY = require('./keys.js').key
                GoogleMapsLoader.LIBRARIES = ['places']

                var component = this

                GoogleMapsLoader.load(function (google){
                    var mapElement = document.getElementById('map')
                    var options = {zoom: 15, center: coordinates.saintLouis}
                    component.map = new google.maps.Map(mapElement, options)
                    component.$emit('mapInitialized')
                })
            },
            addAutoComplete: function (){
                var searchInput = document.getElementById('search-input')
                this.autoComplete = new google.maps.places.Autocomplete(searchInput)
                this.autoComplete.bindTo('bounds', this.map)
                this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(searchInput)

                this.infoWindow = new google.maps.InfoWindow()
                this.marker = new google.maps.Marker({ map: this.map })
            },
            addMarkerClickListener: function (){
                var component = this
                google.maps.event.addListener(component.marker, 'click', function (){
                    component.infoWindow.open(component.map, component.marker)
                });
            },
            addPlaceChangeListener: function (){
                var component = this
                google.maps.event.addListener(component.autoComplete, 'place_changed', function (){
                    component.closeInfoWindow()

                    var place = component.autoComplete.getPlace()
                    if(!place.geometry){ return }

                    if(place.geometry.viewport){
                        component.$emit('fitToBounds', place.geometry.viewport)
                    } else {
                        component.$emit('centerMap', place.geometry.location)
                    }

                    component.setMarkerPlace(place)
                    component.setMarkerVisibility(true)

                    component.setInfoWindowContents(fillInfoWindow(place))
                    component.openInfoWindow(component.marker)
                })
            }
        },
        ready: function (){
            this.initMap()
        }
    }
</script>
