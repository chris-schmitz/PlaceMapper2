module.exports =  function (place){
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
