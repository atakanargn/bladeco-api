var API_URL = 'http://localhost:3000'

var data = [];
var mTable;

var istasyonlariCek = ()=>{
    mTable.clear()
        .draw();
        $.ajax({
            type: "POST",
            url: `${API_URL}/api/v1/query`,
            data: {
                "tip":31,
                "data":{}
            },
            success: (response)=>{
                data=response.data
                for(let i=0; i<data.length; i++){
                    $("#kayitBtn").attr("guid",data[i]._id)
                    var selectBox = `<select class="form-select" onchange="islemYap('${data[i]._id}')" id="station-${data[i]._id}">
                        <option value="-">---</option>
                        <option value="detay">Detay</option>
                        <option value="sil">Sil</option>
                    </select>`
                    mTable.row.add(
                        [
                            data[i].name,
                            data[i].bagli_soket,
                            data[i].hours_of_use,
                            `<div class="d-grid gap-2">
                             <div class="btn btn-lg ${data[i].network_status==0?'btn-danger':'btn-success'}" type="button">
                              ${data[i].network_status==0?'✖':'✓'}
                             </div>
                             </div>`,
                             selectBox
                    ]).draw(false);
                }
            },
            dataType: 'json'
          });
}

var ekle = ()=>{
    var error_message = "";

    if($("#new_name").val()==""){
        error_message += "Isim alanı boş bırakılamaz!<br/>"
    }

    if($("#new_description").val()==""){
        error_message += "Açıklama alanı boş bırakılamaz!<br/>"
    }

    if($("#new_address").val()==""){
        error_message += "Adres alanı boş bırakılamaz!<br/>"
    }

    if($("#new_lat").val()==""){
        error_message += "Enlem alanı boş bırakılamaz!<br/>"
    }

    if($("#new_lon").val()==""){
        error_message += "Boylam alanı boş bırakılamaz!<br/>"
    }

    if(error_message!=""){
        Swal.fire(
            'Hata',
            error_message,
            'error'
        )
        return
    }

    $.ajax({
        type: "POST",
        url: `${API_URL}/api/v1/query`,
        data: JSON.stringify({
            "tip": 30,
            "data": {
                "name"       : $("#new_name").val(),     
                "description": $("#new_description").val(),
                "address"    : $("#new_address").val(),   
                "lat"        : $("#new_lat").val(),   
                "lon"        : $("#new_lon").val(),      
                "parameter_1": "",
                "parameter_2": "",
                "parameter_3": "",
            }
        })
        ,
        success: (response)=>{
            if(response.status){
                Swal.fire(
                    'Başarılı',
                    'Yeni istasyon başarıyla eklendi.',
                    'success'
                )
                istasyonlariCek();
            }else{
                Swal.fire(
                    'Hata',
                    'Yeni istasyon eklenirken bir hata oluştu!',
                    'error'
                )
            }
            $('#yeniIstasyonModal').modal('hide');
            $("#new_name").val('');        
            $("#new_description").val(''); 
            $("#new_address").val('');     
            $("#new_lat").val('');         
            $("#new_lon").val('');
        },
        dataType: 'json',
        contentType: 'application/json'
      });
}

var formTemizle = ()=>{
    $("#new_name").val('');        
    $("#new_description").val(''); 
    $("#new_address").val('');     
    $("#new_lat").val('');         
    $("#new_lon").val('');         
}

var yeniIstasyonModal = ()=>{
    $('#yeniIstasyonModal').modal('show')
}

var kaydet = ()=>{
    $.ajax({
        type: "POST",
        url: `${API_URL}/api/v1/query`,
        data: JSON.stringify({
            "tip": 35,
            "data": {
                "_id": $("#kayitBtn").attr("guid"),
                "description":$("#description").val(),
                "hoursofuse":$("#hou").val(),
                "parameter_1": $("#par1Input").val(),
                "parameter_2": $("#par2Input").val(),
                "parameter_3": $("#par3Input").val()
            }
        })
        ,
        success: (response)=>{
            if(response.status){
                Swal.fire(
                    'Başarılı',
                    'Istasyon bilgileri başarıyla kaydedildi.',
                    'success'
                )
            }else{
                Swal.fire(
                    'Hata',
                    'Veriler kaydedilirken bir hata oluştu!',
                    'error'
                )
            }
            $('#detayModal').modal('hide')
        },
        dataType: 'json',
        contentType: 'application/json'
      });
}

var parametreDuzenle = (param)=>{
    var durum = $(`#${param}Checkbox`).is(':checked')
    console.log(durum)
    if(durum){
        $(`#${param}Input`).prop('disabled', false);
        $(`#${param}Label`).empty();
        $(`#${param}Label`).html(`Parametre ${param.split("par")[1]} devredışı bırak`)
    }else{
        $(`#${param}Input`).prop('disabled', true);
        $(`#${param}Input`).val('')
        $(`#${param}Label`).empty();
        $(`#${param}Label`).html(`Parametre ${param.split("par")[1]} etkinleştir`)
    }
}

var islemYap = (_id)=>{
    var islem = $(`#station-${_id}`).val()
    $(`#station-${_id}`).val('-')
    if(islem=="detay"){
        $.ajax({
            type: "POST",
            url: `${API_URL}/api/v1/query`,
            data: JSON.stringify({
                "tip": 32,
                "data": {
                    "_id":_id
                }})
            ,
            success: (response)=>{
                if(response.status){
                    data = response.data[0]
                    $('#detayModal_title').empty()
                    $('#detayModal_title').html(data.name)
                    $('#detayModal_icerik').html(
                        `
                        <div class="row">
                            <div class="col-4">
                                Isim
                            </div>
                            <div class="col-8">
                                <input type="text" class="form-control" disabled="" value="${data.name}">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Bağlı Soket
                            </div>
                            <div class="col-8">
                                <input type="text" class="form-control" disabled="" value="${data.bagli_soket} ADET">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Açıklama
                            </div>
                            <div class="col-8">
                            <textarea class="form-control" id="description" rows="2">${data.description}</textarea>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Kullanım Saatleri
                            </div>
                            <div class="col-8">
                                <input type="text" class="form-control" id="hou" value="${data.hours_of_use}">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Adres
                            </div>
                            <div class="col-8">
                            <textarea class="form-control" id="description" rows="2" disabled="">${data.address}</textarea>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Konum
                            </div>
                            <div class="col-8 d-grid gap-2">
                                <button class="btn btn-lg btn-primary" type="button" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lon}', '_blank')">Haritada göster</button>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Parametre 1
                            </div>
                            <div class="col-8">
                                <input class="form-check-input" type="checkbox" id="par1Checkbox" onclick="parametreDuzenle('par1')" ${data.parameter_1!=''?'checked':''} >
                                <label class="form-check-label" for="par1Checkbox" id="par1Label">
                                    ${data.parameter_1!=''?"Parametre 1 devredışı bırak":"Parametre 1 etkinleştir"}
                                </label>
                                <input type="text" class="form-control" value="${data.parameter_1}" id="par1Input" ${data.parameter_1==''?'disabled=""':''} >
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Parametre 2
                            </div>
                            <div class="col-8">
                                <input class="form-check-input" type="checkbox" id="par2Checkbox" onclick="parametreDuzenle('par2')" ${data.parameter_2!=''?'checked':''} >
                                <label class="form-check-label" for="par2Checkbox" id="par2Label">
                                ${data.parameter_1!=''?"Parametre 2 devredışı bırak":"Parametre 2 etkinleştir"}
                                </label>
                                <input type="text" class="form-control" value="${data.parameter_2}" id="par2Input" ${data.parameter_2==''?'disabled=""':''} >
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Parametre 3
                            </div>
                            <div class="col-8">
                                <input class="form-check-input" type="checkbox" id="par3Checkbox" onclick="parametreDuzenle('par3')" ${data.parameter_3!=''?'checked':''} >
                                <label class="form-check-label" for="par3Checkbox" id="par3Label">
                                ${data.parameter_1!=''?"Parametre 2 devredışı bırak":"Parametre 2 etkinleştir"}
                                </label>
                                <input type="text" class="form-control" value="${data.parameter_3}" id="par3Input" ${data.parameter_3==''?'disabled=""':''} >
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Son Güncelleme
                            </div>
                            <div class="col-8 d-grid gap-2 text-bold">
                                ${data.updated_date.split("T")[0]} ${data.updated_date.split("T")[1].split(".")[0]}
                            </div>
                        </div>
                        `
                    )
                }else{
                    Swal.fire(
                        'Hata',
                        'Veriler çekilirken bir hata oluştu!',
                        'error'
                      )
                }
            },
            dataType: 'json',
            contentType: 'application/json'
          });

        $('#detayModal').modal('show')
    }else if(islem=="sil"){

        Swal.fire({
            title: 'Bu istasyonu silmek istediğinize emin misiniz?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Evet',
            denyButtonText: 'Hayır',
          }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: `${API_URL}/api/v1/query`,
                    data: JSON.stringify({
                        "tip": 33,
                        "data": {
                            "_id": _id
                        }
                    })
                    ,
                    success: (response)=>{
                        if(response.status){
                            Swal.fire(
                                'Başarılı',
                                'Istasyon silme işlemi başarılı.',
                                'success'
                            )
                            istasyonlariCek();
                        }else{
                            Swal.fire(
                                'Hata',
                                'Istasyonu silerken bir hata oluştu!',
                                'error'
                            )
                        }
                    },
                    dataType: 'json',
                    contentType: 'application/json'
                  });
            } else if (result.isDenied) {
                Swal.fire(
                    'Iptal',
                    'Işlem iptal edildi.',
                    'warning'
                )
            }
          })

        
    }
}

$(document).ready(function () {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    mTable=$('#stations_table').DataTable({
        language: {
            url: "//cdn.datatables.net/plug-ins/1.12.1/i18n/tr.json"
        }
    })

    setTimeout(() => {
        istasyonlariCek();
    }, 500);
});