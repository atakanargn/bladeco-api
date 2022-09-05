var API_URL = (window.location.hostname.includes("heroku") ? `https://` : 'http://') + (window.location.hostname.includes("192") || window.location.hostname.includes("localhost") ? `${window.location.hostname}:3000` : window.location.hostname)

function girisYap(){
    $.ajax({
        url: API_URL + '/api/v1/system_user/login',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data:JSON.stringify({
            phone:$('#username').val(),
            password:$('#password').val()
        }),
        success: function (data) {
            if (data.status) {
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer:1500,
                    backdrop: false,
                    allowOutsideClick:false,
                    allowEscapeKey:false,
                    allowEnterKey:false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                    willClose: () => {
                        window.location = API_URL+'/admin/'
                    }
                })
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: data.message,
                    showConfirmButton: true
                })
            }

        }
    });
}

jQuery(document).ready(function ($) {
    
})