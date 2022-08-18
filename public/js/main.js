var API_URL = 'http://'+(window.location.hostname.includes("192")?`${window.location.hostname}:3000`:window.location.hostname)
var istasyonlar = []

var lat = 0
var lon = 0
var map;
var infoCanvasStatus=true;
var focusedStation="";
var start = [30.5394227, 37.7829171];

var timer;
var markers=[]

function loading() {
    $("#kullaniciGirisiModal").modal({backdrop: "static",keyboard:false});
    $("#loading").fadeToggle();
}

function istasyonAraFocus(){
    $('#istasyonara').css('width','25%')
    $("#istasyonlar").fadeToggle();
}

function istasyonAraFocusOut(){
    $('#istasyonara').css('width','10%')
    $("#istasyonlar").fadeToggle();
}

async function yolTarifi(lat,lon){
    const coords = [lon,lat]
            const end = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: coords
                  }
                }
              ]
            };
            if (map.getLayer('end')) {
              map.getSource('end').setData(end);
            } else {
              map.addLayer({
                id: 'end',
                type: 'circle',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                          type: 'Point',
                          coordinates: coords
                        }
                      }
                    ]
                  }
                },
                paint: {
                  'circle-radius': 10,
                  'circle-color': '#f30'
                }
              });
            }
            getRoute(coords);
}

jQuery(document).ready(function ($) {

    

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        
    }

    //getLocation()
    testStart();

    function testStart() {
        lat=37.7829171
        lon=30.5394227
        mapboxgl.accessToken = 'pk.eyJ1IjoiZHlmZm9yeSIsImEiOiJjbDZtOTVqaXQwMXN3M2lubHY1dDA2MnY0In0.9Zl4U4ESKtJEZI_Ic9_Lmg';
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
            });

        map = new mapboxgl.Map({
            container: 'map',
            center: [lon,lat],
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom:12,
            language:'tr'
        })
        
        setTimeout(()=>{
            getStations()
            
            map.on('load', async () => {

                    
                        // Add the control to the map.
                        map.addControl(geolocate);
                        geolocate.trigger();

                map.addLayer({
                    id: 'point',
                    type: 'circle',
                    source: {
                      type: 'geojson',
                      data: {
                        type: 'FeatureCollection',
                        features: [
                          {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                              type: 'Point',
                              coordinates: start
                            }
                          }
                        ]
                      }
                    },
                    paint: {
                      'circle-radius': 10,
                      'circle-color': '#3887be'
                    }
                  });

                await getRoute(start);
              });
        },700)
    }

    function showPosition(position) {
        lat = position.coords.latitude
        lon = position.coords.longitude
        start = [lon,lat]
        mapboxgl.accessToken = 'pk.eyJ1IjoiZHlmZm9yeSIsImEiOiJjbDZtOTVqaXQwMXN3M2lubHY1dDA2MnY0In0.9Zl4U4ESKtJEZI_Ic9_Lmg';
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
            });

        map = new mapboxgl.Map({
            container: 'map',
            center: [lon,lat],
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom:12,
            language:'tr'
        })
        
        setTimeout(()=>{
            getStations()
            
            map.on('load', async () => {

                    
                        // Add the control to the map.
                        map.addControl(geolocate);
                        geolocate.trigger();

                map.addLayer({
                    id: 'point',
                    type: 'circle',
                    source: {
                      type: 'geojson',
                      data: {
                        type: 'FeatureCollection',
                        features: [
                          {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                              type: 'Point',
                              coordinates: start
                            }
                          }
                        ]
                      }
                    },
                    paint: {
                      'circle-radius': 10,
                      'circle-color': '#3887be'
                    }
                  });

                await getRoute(start);
              });
        },700)
    }

    

    function getStations(){
        $.get(API_URL + `/api/station`, function (data) {
            istasyonlar = data;
            var cnt = 0;
            for (let i = 0; i < istasyonlar.length; i++) {
                $('#search-result').append(`
                        <div class="row p-1 m-1 tekistasyon" class="tekistasyon" onclick="istasyonGetir('${istasyonlar[i]._id}');">
                            <div class="col-3" style="border-right: 1px solid">
                                ${istasyonlar[i].type}
                            </div>
                            <div class="col-9">
                                ${istasyonlar[i].name}
                            </div>
                        </div>
                        `);
                if(istasyonlar[i].lat!=undefined || istasyonlar[i].lat!=0){

                    const el = document.createElement('div');
                    const width = 60;
                    const height = 60;
                    el.className = 'marker';
                    el.style.backgroundImage = `url(./images/marker.png)`;
                    el.style.width = `60px`;
                    el.style.height = `48px`;
                    el.style.backgroundSize = '100%';
                    
                    el.addEventListener('click', () => {
                        istasyonGetir(`${istasyonlar[i]._id}`)
                    });
                    
                    // Add markers to the map.
                    markers.push(new mapboxgl.Marker(el)
                    .setLngLat([istasyonlar[i].lon,istasyonlar[i].lat])
                    .addTo(map))

                    /*istasyonlar[i].marker = new mapboxgl.Marker({
                        color: "#000",
                        draggable: false
                        })
                        .setPopup(new mapboxgl.Popup().setHTML(`<h2>${istasyonlar[i].name}</h2>
                                            <div class="row">
                                                <div class="col-12 ">
                                                    <div class="d-grid gap-2">
                                                        <button class="btn btn-lg btn-primary" type="button" onclick="markOnMap('${istasyonlar[i].lat}','${istasyonlar[i].lon}')" ${istasyonlar[i].lat == (undefined || 0) ? 'disabled=""' : ''}<i class="fa-solid fa-location-dot"></i> Yol Tarifi</button>
                                                        <button class="btn btn-lg btn-info" type="button" onclick="istasyonGetir('${istasyonlar[i]._id}')"><i class="fa-solid fa-circle-info"></i> Bilgi</button>                                                    
                                                    </div>        
                                                </div>
                                            </div>`))
                        .setLngLat([istasyonlar[i].lon,istasyonlar[i].lat])
                        .addTo(map);*/
                }
                
                cnt++;
            }
            $('#search-info').html(`Toplam ${cnt}`);
    
        }).then(() => {
            
            /*map.on('click', (event) => {
                const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
                const end = {
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      properties: {},
                      geometry: {
                        type: 'Point',
                        coordinates: coords
                      }
                    }
                  ]
                };
                if (map.getLayer('end')) {
                  map.getSource('end').setData(end);
                } else {
                  map.addLayer({
                    id: 'end',
                    type: 'circle',
                    source: {
                      type: 'geojson',
                      data: {
                        type: 'FeatureCollection',
                        features: [
                          {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                              type: 'Point',
                              coordinates: coords
                            }
                          }
                        ]
                      }
                    },
                    paint: {
                      'circle-radius': 10,
                      'circle-color': '#f30'
                    }
                  });
                }
                getRoute(coords);
              });*/

              

            loading()
        })
    }

    document.getElementById('phone').addEventListener('input', function (e) {
        var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
      });

    

    

    

    $("#istasyonara-input").keyup(function () {
        var sonucyok = true;
        $('#search-result').empty();
        var kelime = $("#istasyonara-input").val();

        var cnt = 0;

        for(let i=0;i<markers.length;i++){
            markers[i].remove()
        }

        for (let i = 0; i < istasyonlar.length; i++) {
            if (istasyonlar[i].name.toLowerCase().includes(kelime.toLowerCase()) || istasyonlar[i].type.toLowerCase().includes(kelime.toLowerCase())) {
                $('#search-result').append(`
                    <div class="row p-1 m-1 tekistasyon" class="tekistasyon" onclick="istasyonGetir('${istasyonlar[i]._id}');">
                        <div class="col-3" style="border-right: 1px solid">
                            ${istasyonlar[i].type}
                        </div>
                        <div class="col-9">
                            ${istasyonlar[i].name}
                        </div>
                    </div>
                    `);

                    if(istasyonlar[i].lat!=undefined || istasyonlar[i].lat!=0){

                        const el = document.createElement('div');
                        const width = 60;
                        const height = 60;
                        el.className = 'marker';
                        el.style.backgroundImage = `url(./images/marker.png)`;
                        el.style.width = `60px`;
                        el.style.height = `48px`;
                        el.style.backgroundSize = '100%';
                        
                        el.addEventListener('click', () => {
                            window.alert('test');
                        });
                        
                        // Add markers to the map.
                        markers.push(new mapboxgl.Marker(el)
                        .setLngLat([istasyonlar[i].lon,istasyonlar[i].lat])
                        .addTo(map))
                    }
                
                sonucyok = false;
                cnt++;
            }
        }

        $('#search-info').html(`Toplam ${cnt}`);

        if (sonucyok) {
            $("#id").css("display", "none");
        }
    })

});



function kodgonder(){
    var telefon = $('#phone').val()
    $.ajax({
        url: API_URL+'/api/user',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            if(data.status){
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: true
                  })
                $('#kodgonder').fadeToggle();
                $('#onayla').fadeToggle();
                $('#phone').fadeToggle();
                $('#code').fadeToggle();
                $('#labelCode').fadeToggle();
                $('#labelPhone').fadeToggle();
            }else{
                Swal.fire({
                    icon: 'danger',
                    title: data.message,
                    showConfirmButton: true
                  })
            }
            
        },
        data: JSON.stringify({
            phone:'+90'+telefon.replace(' ','')
            .replace('(','')
            .replace(')','')
            .replace('-','')
        })
    });
}

function onayla(){
    var telefon = $('#phone').val()
    var code     = $('#code').val()
    $.ajax({
        url: API_URL+'/api/user/verify',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            if(data.status){

                Swal.fire({
                    icon: 'success',
                    title: 'Hoşgeldiniz, giriş başarılı!',
                    showConfirmButton: true
                  })
                $('#btnModalClose').trigger('click');
            }else{
                Swal.fire({
                    icon: 'danger',
                    title: data.message,
                    showConfirmButton: true
                  })
            }
            
        },
        data: JSON.stringify({
            phone:'+90'+telefon.replace(' ','')
            .replace('(','')
            .replace(')','')
            .replace('-',''),
            code:code
        })
    });
}

async function getRoute(end) {
    
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?language=tr&steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
    try{
        var instructions = document.getElementById('instructions')
        instructions.innerHTML = `<strong>${Math.floor(data.duration / 60)} dakika</strong>`;
    }catch(Err){

    }
    

  }
  
  
  

function zoomOnMap(lat,lon){
    map.flyTo({
        center: [lon, lat],
        zoom: 14,
        speed: 2,
        curve: 1,
        easing(t) {
            console.log(t)
        return t;
        }
    });
}

function istasyonGuncelle() {
    var id = focusedStation;
    $.get(API_URL + `/api/station`, function (data) {
        istasyonlar = data;
    }).then(() => {
        var istasyonum;
        for (let i = 0; i < istasyonlar.length; i++) {
            if (istasyonlar[i]._id == id) {
                istasyonum = istasyonlar[i]
                break
            }
        }

        var eskiDeger = document.getElementById('instructions').innerText

        var options = {
            title: `<span class="float:left;"><b>${istasyonum.name}</b> Şarj Noktası </span>`,
            body: `
            <div class="row">
                <div class="col-6 text-right" >
                    Istasyon Kodu :
                </div>
                <div class="col-6 text-left font-weight-bold">
                    ${istasyonum.code}
                </div>
            </div>
            <hr/>
            <div class="row">
                <div class="col-6 text-right" >
                    Servis Durumu : 
                </div>
                <div class="col-6 text-left">
                    <div class="d-grid gap-2">
                        <div class="btn btn-lg btn-${istasyonum.service_status ? 'success' : 'danger'}" type="button">${istasyonum.service_status ? 'Var' : 'Yok'}</div>
                    </div>
                </div>
            </div>
            <hr/>
            <div class="row">
                <div class="col-6 text-right" >
                    Ağ Durumu : 
                </div>
                <div class="col-6 text-left">
                    <div class="d-grid gap-2">
                        <div class="btn btn-lg btn-${istasyonum.network_status ? 'success' : 'danger'}" type="button">${istasyonum.network_status ? 'Ağa dahil' : 'Ağa dahil değil'}</div>
                    </div>
                </div>
            </div>
            <hr/>

            <div class="row">
                <div class="col-12 ">
                    <div class="d-grid gap-2">
                        <button class="btn btn-lg btn-primary" type="button" onclick="yolTarifi(${istasyonum.lat},${istasyonum.lon})" ${istasyonum.lat == (undefined || 0) ? 'disabled=""' : ''}><i class="fa-solid fa-location-dot"></i> Yol Tarifi</button>
                    </div>        
                </div>
            </div>
            <hr/>

            <div class="row">
            <div class="col-6 text-right" >
                    Sürüş Mesafesi : 
                </div>
                <div class="col-6 text-left" id="instructions">
                    ${eskiDeger}
                </div>
            </div>
            <hr/>

            <div class="row">
                <div class="col-12 ">
                    <div class="d-grid gap-2">
                        <button class="btn btn-lg btn-success" type="button" onclick="zoomOnMap('${istasyonum.lat}','${istasyonum.lon}')" ${istasyonum.lat == (undefined || 0) ? 'disabled=""' : ''}><i class="fa-solid fa-location-dot"></i> Haritada Göster</button>
                    </div>        
                </div>
            </div>
            <hr/>

            <div class="row">
                <div class="col-6 text-right" >
                    Son Durum : 
                </div>
                <div class="col-6 text-left">
                    ${istasyonum.updated_date.split("T")[0]} ${istasyonum.updated_date.split("T")[1].split(".")[0]}
                </div>
            </div>
            <hr/>
        `
        }

        $('#infoCanvasTitle').html(options.title);
        $('#infoCanvasBody').html(options.body);
    })


}

function markOnMap(lat, lon) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
}

function istasyonGetir(id) {
    focusedStation=id
    var istasyonum;
    for (let i = 0; i < istasyonlar.length; i++) {
        if (istasyonlar[i]._id == id) {
            istasyonum = istasyonlar[i]
            break
        }
    }

    var options = {
        title: `<span class="float:left;"><b>${istasyonum.name}</b> Şarj Noktası </span>`,
        body: `
            <div class="row">
                <div class="col-6 text-right" >
                    Istasyon Kodu :
                </div>
                <div class="col-6 text-left font-weight-bold">
                    ${istasyonum.code}
                </div>
            </div>
            <hr/>
            <div class="row">
                <div class="col-6 text-right" >
                    Servis Durumu : 
                </div>
                <div class="col-6 text-left">
                    <div class="d-grid gap-2">
                        <div class="btn btn-lg btn-${istasyonum.service_status ? 'success' : 'danger'}" type="button">${istasyonum.service_status ? 'Var' : 'Yok'}</div>
                    </div>
                </div>
            </div>
            <hr/>
            <div class="row">
                <div class="col-6 text-right" >
                    Ağ Durumu : 
                </div>
                <div class="col-6 text-left">
                    <div class="d-grid gap-2">
                        <div class="btn btn-lg btn-${istasyonum.network_status ? 'success' : 'danger'}" type="button">${istasyonum.network_status ? 'Ağa dahil' : 'Ağa dahil değil'}</div>
                    </div>
                </div>
            </div>
            <hr/>


            <div class="row">
                <div class="col-12 ">
                    <div class="d-grid gap-2">
                        <button class="btn btn-lg btn-primary" type="button" onclick="yolTarifi(${istasyonum.lat},${istasyonum.lon})" ${istasyonum.lat == (undefined || 0) ? 'disabled=""' : ''}><i class="fa-solid fa-location-dot"></i> Yol Tarifi</button>
                    </div>        
                </div>
            </div>
            <hr/>

            <div class="row">
            <div class="col-6 text-right" >
                    Sürüş Mesafesi : 
                </div>
                <div class="col-6 text-left" id="instructions">
                    ----
                </div>
            </div>
            <hr/>

            <div class="row">
                <div class="col-12 ">
                    <div class="d-grid gap-2">
                        <button class="btn btn-lg btn-success" type="button" onclick="zoomOnMap('${istasyonum.lat}','${istasyonum.lon}')" ${istasyonum.lat == (undefined || 0) ? 'disabled=""' : ''}><i class="fa-solid fa-location-dot"></i> Haritada Göster</button>
                    </div>        
                </div>
            </div>
            <hr/>


            <div class="row">
                <div class="col-6 text-right" >
                    Son Durum : 
                </div>
                <div class="col-6 text-left">
                    ${istasyonum.updated_date.split("T")[0]} ${istasyonum.updated_date.split("T")[1].split(".")[0]}
                </div>
            </div>
            <hr/>
        `
    }



    infoCanvas(options)
}

function infoCanvasClosed(){
    infoCanvasStatus=true;
}

function infoCanvas(options) {
    $('#infoCanvasTitle').html(options.title);
    $('#infoCanvasBody').html(options.body);
    setTimeout(() => {
        if(infoCanvasStatus){
            $('#infoCanvasBtn').trigger('click');
            infoCanvasStatus=false;
        }
            
    }, 100);
    timer = setInterval(()=>{istasyonGuncelle();},5000);
}
