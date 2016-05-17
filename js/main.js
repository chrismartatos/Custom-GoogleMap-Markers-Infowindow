/*-------------------------------------------------------------------------
  					DOM ready
--------------------------------------------------------------------------*/
$(function()
{
	locations_google_map();
});


/*-------------------------------------------------------------------------
  Custom Google Map / infobox.js / googlemarkers.js / snazzymaps.com
--------------------------------------------------------------------------*/
function locations_google_map()
{
   if($("#google-map").length)
   {
   		//Markers Array
		var markers=[],
		
		/* God bless: http://snazzymaps.com */
		map_style_array = [{"featureType":"water","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}],
		
		//target elements
		googleMap = $("#google-map"),
        locations_menu_wrap = $("#locations-nav"),
        locations_menu = $("#locations-nav .menu"),
        mobile_menu = $("#mobile-nav .menu"),
        target_location = $('#get-location .location'),
        _lat = 37.8503818, //Center Map lat
        _lng = 24.9112167, //Center Map lng
        _address = 'Apoikia, Andros Greece'; //Center Map address
	    
	    $.each(target_location, function(key, value) 
	    {
	      var item = $(value);
	      markers.push({
	        'title' : item.find('.title').html(),
	        'lat' : item.attr('data-lat'),
	        'lng' : item.attr('data-lng'),
	        'details' : item.find('.get-address').html(),
	        'icon' : item.attr('data-marker')
	      });
	    });
	    
	    //Set height first - Use only if you needed - fullscreen map
	    set_map_height(googleMap);
	    
	    //Trigger the map and place markers
	    googleMap.googlemap({
	      zoom: 11,
	      markers: markers,
	      center: { address : _address, lat : _lat, lng: _lng },
	      styles: map_style_array
	    });
	    
	  //Build menu controls for the two menus  
	  if(locations_menu.length)
	  {  
	    for (var i = 0; i < markers.length; i++) 
	    { 
	      var Locations_Nav = $('<a href="#" class="location location-id'+i+'" data-id="'+i+'"><span class="location-name">'+markers[i].title+'</span></a>');
	      var Mobile_Nav = $('<option data-id="'+i+'" class="location"><span class="location-name">'+markers[i].title+'</span></option>');
	      
	      Locations_Nav.appendTo(locations_menu); 
	      Mobile_Nav.appendTo(mobile_menu);
	    }
	    
	    //Click event for desktop nav
	    locations_menu.find("a").click(function(e)
	    {
	        e.preventDefault();
	        
	        //Select loaction
	        select_map_item($(this),googleMap);
	    }); 
	    
	    //Change event for mobile nav
	    mobile_menu.change(function()
	    {
	      	var target = $("option:selected", this);
	      
		  	//Select loaction
	        select_map_item(target,googleMap);
	    }); 
	    
	  }
	  
   }
} 

//Reposition script
function select_map_item(obj, googleMap)
{
  var i = obj.attr('data-id');
  
  $(".menu .location.active").removeClass('active');
  
  obj.addClass('active');
  
  googleMap.googlemap('reposition', i, 14);
} 

//Set height
function set_map_height(googleMap)
{
	var _height = $(window).height();
		
	googleMap.css("height", _height);
	
	$(window).resize(function()
	{ 
		var _height = $(window).height();
	
		googleMap.css("height", _height);
	});
}

