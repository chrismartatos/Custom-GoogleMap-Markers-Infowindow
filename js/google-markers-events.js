;(function(jQuery){
  var map;
  var infoWindow;
  var geocoder;
  var markInfoIndex = 0;
  var latlngbounds;
  var settings;
  var dir = "img/";
  var markers = [];

  /*-----------------------------------------------------------------------------------------
  					Defaults Vars
  ------------------------------------------------------------------------------------------*/
  var defaults = {
      'center'          :   {'address' : null, 'lat' : null, 'lng' : null },
      'marker'          :   [],
      'zoom'            :   0,
      'mapTypeId'       :   google.maps.MapTypeId.ROADMAP,
      'zoomControl'		: 	false,
      'scaleControl'	: 	false,
      'scrollwheel'		: 	false,
      'Marker'      :   null,
      'shadowMarker'    :   null,
      'styles'			: 	null
  };

  /*-----------------------------------------------------------------------------------------
  					Add Marker fn
  ------------------------------------------------------------------------------------------*/
  function addMarker(lat, lng, icon, title)
  {
    var locationLatlng = new google.maps.LatLng(lat, lng);
    
    latlngbounds.extend(locationLatlng);

    var marker = new google.maps.Marker({
        position: locationLatlng, 
        map: map,
        title: title,
        icon: icon,
        shadow: settings.shadowMarker
    });
	//console.log("Markers: "+icon);
    return marker;
  }
  
  /*-----------------------------------------------------------------------------------------
  					Customize Infobox fn - infobox.js
  ------------------------------------------------------------------------------------------*/
  function custom_infobox_init(infoWindow,get_details,dir,map,marker)
  {    		 
  infoWindow = new InfoBox({
		      content: "<div class='custom-info-window cf'>"+get_details+"<span class='arrow'></span></div>",   
		      disableAutoPan: false,
		      maxWidth: 0,
		      pixelOffset: new google.maps.Size(25,-148),
		      zIndex: null,
		      boxStyle: {
		        background: "transparent",
		        opacity: 1,
		        width: "220px",
		        height: "auto",
		        padding: "0",
		        color: "#000"
		      },
		      closeBoxMargin: "0 0 0 0",
		      closeBoxURL: dir+"close-icon.png",/*close-icon.png*/
		      infoBoxClearance: new google.maps.Size(1, 1),
		      isHidden: false,
		      pane: "floatPane",
		      enableEventPropagation: false
		   });

  $("#google-map .infoBox:visible").find(".closeIcon").click();
  		   
  infoWindow.open(map, marker);
	  		
  }
  
  /*-----------------------------------------------------------------------------------------
  					Load Marker - Add Listener
  ------------------------------------------------------------------------------------------*/
  function loadMarkInfo(i, setCenter)
  {
        if(settings.markers[i].lat != null && settings.markers[i].lat != '' && settings.markers[i].lng != null && settings.markers[i].lng != '')
        {
            var marker = addMarker(settings.markers[i].lat, settings.markers[i].lng, settings.markers[i].icon, settings.markers[i].title);
            settings.markers[i]["marker"] = marker;
            
            /***ADD LISTENER****/
            google.maps.event.addListener(settings.markers[i].marker, 'mouseover', function()
	        {	       
	        	custom_infobox_init(infoWindow,settings.markers[i].details,dir,map,marker);	            
	        });
	        
        }
        else
        {
            if(settings.markers[i].address == null || settings.markers[i].address == '') return;

            geocoder.geocode({'address': settings.markers[i].address}, function(results, status)
            {    
                if (status == google.maps.GeocoderStatus.OK)
                {
                    var location = results[0].geometry.location;
                    var marker = addMarker(location.lat(), location.lng());
                    settings.markers[i]["marker"] = marker;

                    if(setCenter)
                    {
                        map.setCenter(settings.markers[i].marker.position);
                        
                        /***ADD LISTENER****/
                        google.maps.event.addListener(settings.markers[i].marker, 'mouseover', function()
				        {
				            custom_infobox_init(infoWindow,settings.markers[i].details,dir,map,marker);
				        });
                        
                    }
                }

            });
        }
        
        markInfoIndex++;
        if(markInfoIndex < settings.markers.length)
        {
            loadMarkInfo(markInfoIndex);
            
            
            google.maps.event.addListener(map, 'idle', function() {  });
        }
        
        
    }

  /*-----------------------------------------------------------------------------------------
  					Methods
  ------------------------------------------------------------------------------------------*/
  var methods = {
     init : function( options ) {

        settings = $.extend(defaults, options);

        function initEach(method){

            var pluginObject = $(this);

            function init(){

                geocoder = new google.maps.Geocoder();
                latlngbounds = new google.maps.LatLngBounds();

                if(settings.center != null){
                    if(settings.center.address != null && settings.center.address != ''){ 
                        geocoder.geocode ({'address': settings.center.address}, function(results, status){
                            if (status == google.maps.GeocoderStatus.OK)
                            {
                                var location = results[0].geometry.location;
                                initMap({
                                    lat : location.lat(),
                                    lng : location.lng()
                                });
                            }
                            else{
                                initMap({
                                    lat : '0',
                                    lng : '0'
                                });
                            }
                        });
                    }
                    else{

                    }
                }
                else{
                     initMap();
                }
            }

            function initMap(params){

                var object = pluginObject.get(0);
                var centerLatlng = params == null ? new google.maps.LatLng(0, 0) : new google.maps.LatLng(params.lat, params.lng);

                var mapOptions = {
                  zoom: settings.zoom,
                  center: centerLatlng,
                  mapTypeId: settings.mapTypeId,
                  styles: settings.styles
                }
                map = new google.maps.Map(object, mapOptions);
                infoWindow = new google.maps.InfoWindow();

                if(markInfoIndex < settings.markers.length){
                    loadMarkInfo(markInfoIndex);
                }
            }

            init();
        }

        return this.each(initEach);
     },
     destroy : function( ) {
       return this.each(function(){
       })
     },
     /***Reposition****/
     reposition : function(i, zoom){
         return this.each(function(){
            var pluginObject = $(this);
            
            map.setZoom(zoom);
            
            if(settings.markers[i].marker != null)
            {
                map.setCenter(settings.markers[i].marker.position);
                
                custom_infobox_init(infoWindow,settings.markers[i].details,dir,map,settings.markers[i].marker);
                
            }
            else{
                loadMarkInfo(i, true);
          }
        })
     },
     show : function(){},
     hide : function(){},
     update : function(content){}
  };
  
  

  jQuery.fn.googlemap = function(method) {  
    
    if(methods[method]) 
    {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } 
    else if (typeof method === 'object' || ! method) 
    {
      return methods.init.apply( this, arguments );
    } 
    else {
      alert( 'Method ' +  method + ' does not exist' );
    }    
    
  }; 
})(jQuery);