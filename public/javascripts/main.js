

window.onload = () => {
    const mad = {
      lat: 40.4115, 
      lng: -3.7076
    };
    
    const markers = []
    
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: mad
    });
    infoWindow = new google.maps.InfoWindow();
    google.maps.event.addDomListener(window, 'load', function() {
      //create your markers here
      google.maps.event.addListener(marker, 'click', function() {
                  infoWindow.open(map, marker); //take care with case-sensitiveness
             });
    });
   
    bounds = new google.maps.LatLngBounds();

    if ( $(window).width() < 739) {      
        //Add your javascript for large screens here 
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              var center = { lat: position.coords.latitude,
                         lng: position.coords.longitude };
              map.setCenter(center);
              getDealers();
            }, () => {
              getDealers();
              console.log('Error in the geolocation service.');
            });
          } else {
              getDealers();
            console.log('Browser does not support geolocation.');
          }
      } 
      else {
        //Add your javascript for small screens here 
        getDealers();
      }
    
    
  
    function deleteMarkers() {
      markers.forEach(function(marker) {
        marker.setMap(null);
        marker = null;
      })
      markers = [];
    }
  
    function getDealers() {
      axios.get("http://localhost:3000/show")
      .then( response => {
        placeDealers(response.data.dealers);
        map.fitBounds(bounds);
      })
      .catch(error => {
        next(error)
      })
    }
  
    function placeDealers(dealers){
      var infowindow = new google.maps.InfoWindow();
      dealers.forEach(function(dealer){
        var contentString = '<div><h4>'+
        dealer.name
        +'</h4><h5>'+
        dealer.address
        +'</h5><p>Phone: '+'<a href="tel:'+
        dealer.phone+'">'+dealer.phone+'</a>'
        +'</p><p>Working hours: '+
        dealer.hours
        +'</p><p>Email citas:</p><a href="mailto:'+
        dealer.emailapp
        +'">'+
        dealer.emailapp
        +'</a></p>Comments:<br><p>'+
        dealer.comments
        +'</p><br><a href="/edit/'+dealer._id+'">Edit</a></div>';

        
        var center = {
          lat: dealer.startPoint.coordinates[0],
          lng: dealer.startPoint.coordinates[1]
        };
        var pin = new google.maps.Marker({
          position: center,
          map: map,
          icon: type(dealer.type),
          title: dealer.name
        });
        pin.addListener('click', function() {
            infowindow.close();
            infowindow.setContent(contentString);
            infowindow.open(map, pin);
        });
        bounds.extend(pin.getPosition());
      });
    }

    function type(type){
        var img;
        switch(type){
            case "VULCO":
                img = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blueV.png';
                break;
            case "DONTYRE":
                img = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_redD.png';
                break;
            case "SOLEDAD":
                img = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellowS.png';
                break;
            case "CONCESIONARIO":
                img = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_greenC.png';
                break;
        }

        return img;
    }
  
  };