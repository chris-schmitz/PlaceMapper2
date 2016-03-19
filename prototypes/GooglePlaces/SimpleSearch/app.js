var map;

function savePlace(place_id){

    var savedPlaces = [];

    if(sessionStorage.getItem('savedPlaces') !== null){
        savedPlaces = sessionStorage.getItem('savedPlaces').split(',');
    }
    var placeAlreadySaved = savedPlaces.reduce(function(previous, current){
        return previous || place_id === current ? true : false;
    }, false);

    if(!placeAlreadySaved){
        savedPlaces.push(place_id);
    }
    sessionStorage.setItem('savedPlaces', savedPlaces.join(','));
}


function initMap(){

    var saintLouis = new google.maps.LatLng(38.6272,-90.1978);
    var bworks = new google.maps.LatLng(38.602778, -90.209273);
    var infoWindowContent = function (place){
        return [
            '<div><div class="titleBlock">',
            '<img class="infoWindowIcon" src="' + place.icon + '">',
            '<strong>',
            place.name,
            '</strong></div>',
            'Place ID: ' + place.place_id,
            '<br />',
            'Address: ' + place.formatted_address,
            '<br>',
            'Phone: ' + place.international_phone_number,
            '<br>',
            '<a href="' + place.website + '" target="_blank">Website</a>',
            '<div>',
            '<button class="btn" onclick=%%>Save Location</button>'.replace('%%', "savePlace('" + place.place_id + "')"),
            '</div>',
            '<div>'
        ].join('');
    }

    var mapOptions = {
        center: bworks,
        zoom: 17
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // ==== autocomplete setup ==== //
    var input = document.getElementById('place-search');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(input);
    var autoCompleteInfoWindow = new google.maps.InfoWindow();
    var autoCompleteMarker = new google.maps.Marker({
        map: map
    });
    google.maps.event.addListener(autoCompleteMarker, 'click', function (){
        autoCompleteInfoWindow.open(map, autoCompleteMarker);
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function (){
        autoCompleteInfoWindow.close();
        var place = autocomplete.getPlace();

        if(!place.geometry){
            return;
        }

        if(place.geometry.viewport){
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        autoCompleteMarker.setPlace(
            {
                placeId: place.place_id,
                location: place.geometry.location
            }
        );

        autoCompleteMarker.setVisible(true);

        autoCompleteInfoWindow.setContent(infoWindowContent(place));

        autoCompleteInfoWindow.open(map, autoCompleteMarker);
    });

    // ==== /autocomplete setup ==== //


    var request = {
        location: bworks,
        radius: '500',
        types: ['store']
    };

    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function (results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){
            results.forEach(function (place){
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location,
                    place: {
                        location: place.geometry.location,
                        placeId: place.place_id
                    }
                });
                marker.addListener('click', function (e){
                    var request = { placeId: this.getPlace().placeId};
                    var marker = this;

                    service.getDetails(request, function (place, status){
                        var infoWindow = new google.maps.InfoWindow();
                        infoWindow.setContent(infoWindowContent(place));

                        infoWindow.open(map, marker);
                        map.panTo(place.geometry.location);
                    });
                });
            });
        }
    });
}
