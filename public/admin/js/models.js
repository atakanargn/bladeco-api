var API_URL = 'http://localhost:3000'

var data = [];
var mTable;

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

var modelleriCek = ()=>{
    mTable.clear()
        .draw();
        $.ajax({
            type: "POST",
            url: `${API_URL}/api/v1/query`,
            data: {
                "tip":51,
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
                            data[i].code,
                            data[i].name,
                            data[i].socket_type,
                            (data[i].voltage*data[i].ampere)/1000,
                            `<div class="d-grid gap-2">
                             <button class="btn btn-lg ${data[i].status==0?'btn-danger':'btn-success'}" type="button" onclick="toggleStatus('${data[i]._id}')">
                              ${data[i].status==0?'✖':'✓'}
                             </button>
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

    if($("#new_code").val()==""){
        error_message += "Model kodu alanı boş bırakılamaz!<br/>"
    }

    if($("#new_name").val()==""){
        error_message += "Isim alanı boş bırakılamaz!<br/>"
    }

    if($("#new_description").val()==""){
        error_message += "Açıklama alanı boş bırakılamaz!<br/>"
    }

    if($("#new_socket_type").val()==""){
        error_message += "Soket tipi alanı boş bırakılamaz!<br/>"
    }

    if($("#new_voltage").val()==""){
        error_message += "Voltaj alanı boş bırakılamaz!<br/>"
    }

    if($("#new_ampere").val()==""){
        error_message += "Akım alanı boş bırakılamaz!<br/>"
    }

    if($("#new_count_of_relay").val()==""){
        error_message += "Röle sayısı alanı boş bırakılamaz!<br/>"
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
            "tip": 50,
            "data": {
                "code"           : $("#new_code").val(),
                "name"           : $("#new_name").val(),     
                "description"    : $("#new_description").val(),
                "socket_type"    : $("#new_socket_type").val(),   
                "voltage"        : $("#new_voltage").val(),   
                "ampere"         : $("#new_ampere").val(),
                "count_of_relay" : $("#new_count_of_relay").val()
            }
        })
        ,
        success: (response)=>{
            if(response.status){
                Swal.fire(
                    'Başarılı',
                    'Yeni cihaz modeli başarıyla eklendi.',
                    'success'
                )
                modelleriCek();
            }else{
                Swal.fire(
                    'Hata',
                    'Yeni cihaz modeli eklenirken bir hata oluştu!',
                    'error'
                )
            }
            $('#yeniModelModal').modal('hide');
            $("#new_code").val('');  
            $("#new_name").val('');        
            $("#new_description").val(''); 
            $("#new_socket_type").val('');     
            $("#new_voltage").val('');         
            $("#new_ampere").val('');     
            $("#new_count_of_relay").val('');   
        },
        dataType: 'json',
        contentType: 'application/json'
      });
}

var formTemizle = ()=>{
    $("#new_code").val('');  
    $("#new_name").val('');        
    $("#new_description").val(''); 
    $("#new_socket_type").val('');     
    $("#new_voltage").val('');         
    $("#new_ampere").val('');     
    $("#new_count_of_relay").val('');    
}

var toggleStatus = (_id)=>{
    $.ajax({
        type: "POST",
        url: `${API_URL}/api/v1/query`,
        data: JSON.stringify({
            "tip":55,
            "data":{
                "_id":_id
            }
        }),
        success: (response)=>{
            if(response.status){
                Swal.fire(
                    'Başarılı',
                    'Model durumu güncellendi.',
                    'success'
                )
            }else{
                Swal.fire(
                    'Hata',
                    'Model durumu güncellenirken hata oluştu.',
                    'error'
                )
            }
        },
        dataType: 'json',
        contentType: 'application/json'
      });
      modelleriCek();
}

var yeniModelModal = ()=>{
    $('#yeniModelModal').modal('show')
}

var islemYap = (_id)=>{
    var islem = $(`#station-${_id}`).val()
    $(`#station-${_id}`).val('-')
    if(islem=="detay"){
        $.ajax({
            type: "POST",
            url: `${API_URL}/api/v1/query`,
            data: JSON.stringify({
                "tip": 52,
                "data": {
                    "_id":_id
                }})
            ,
            success: (response)=>{
                if(response.status){
                    data = response.data[0]
                    $('#detayModal_title').empty()
                    $('#detayModal_title').html(`${data.code} - ${data.name}`)
                    $('#detayModal_icerik').empty()
                    $('#detayModal_icerik').html(
                        `
                        <div class="row">
                            <div class="col-4">
                                Isim
                            </div>
                            <div class="col-8">
                                <input type="text" class="form-control" disabled="" value="${data.code}">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Isim
                            </div>
                            <div class="col-8">
                                <input type="text" class="form-control" disabled="" value="${data.name}">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Açıklama
                            </div>
                            <div class="col-8">
                            <textarea class="form-control" id="description" rows="2" disabled="">${data.description}</textarea>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Not 
                            </div>
                            <div class="col-8">
                            <textarea class="form-control" id="status_message" rows="2">${data.status_message}</textarea>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Soket Tipi
                            </div>
                            <div class="col-8">
                                <input type="text" class="form-control" value="${data.socket_type}" disabled="">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Adres
                            </div>
                            <div class="col-4">
                                <input type="text" class="form-control" value="${data.voltage}" disabled="">
                            </div>
                            <div class="col-4">
                                <input type="text" class="form-control" value="${data.ampere}" disabled="">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                Röle sayısı
                            </div>
                            <div class="col-8">
                                <input type="text" class="form-control" value="${data.count_of_relay}" disabled="">
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
                        <input type="hidden" id="status" value="${data.status}" />
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
                        "tip": 53,
                        "data": {
                            "_id": _id
                        }
                    })
                    ,
                    success: (response)=>{
                        if(response.status){
                            Swal.fire(
                                'Başarılı',
                                'Model silme işlemi başarılı.',
                                'success'
                            )
                            modelleriCek();
                        }else{
                            Swal.fire(
                                'Hata',
                                'Modeli silerken bir hata oluştu!',
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

var kaydet = ()=>{
    $.ajax({
        type: "POST",
        url: `${API_URL}/api/v1/query`,
        data: JSON.stringify({
            "tip": 54,
            "data": {
                "_id": $("#kayitBtn").attr("guid"),
                "status":$("#status").val(),
                "status_message":$("#status_message").val(),
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
                    'Model bilgileri başarıyla kaydedildi.',
                    'success'
                )
            }else{
                Swal.fire(
                    'Hata',
                    'Veriler kaydedilirken bir hata oluştu!',
                    'error'
                )
            }
            modelleriCek();
            $('#detayModal').modal('hide')
        },
        dataType: 'json',
        contentType: 'application/json'
      });
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

    mTable=$('#models_table').DataTable({
        language: {
            url: "//cdn.datatables.net/plug-ins/1.12.1/i18n/tr.json"
        }
    })

    setTimeout(() => {
        modelleriCek();
    }, 500);
});