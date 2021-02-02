$(document).ready(function($){

  $('#ingresoManualForm').hide();

  $("#dni").on("keypress keyup blur",function (event) {    
    $(this).val($(this).val().replace(/[^\d].+/, ""));
      if ((event.which < 48 || event.which > 57)) {
      }
  });

  $("#manualRecord").on('click', function(){
    $('#main-menu').hide();
    $('#ingresoManualForm').show();
  })

  $("#backButton").on('click', function(){
    $('#main-menu').show();
    $('input').val('');

    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.classList.remove('was-validated');
    }, false);
    

    $('#ingresoManualForm').hide();
  })
  
  $('#scan-view').hide();
  var codeReader = new ZXing.BrowserMultiFormatReader()

  $('#startScanButton').click(function(e) {

    $('#info-dni').text('');
    $('#info-apellido').text('');
    $('#info-nombres').text('');
    $('#info-fecha_nac').text('');

    if (!codeReader) var codeReader = new ZXing.BrowserMultiFormatReader();

    $('#main-menu').hide();
    $('#scan-view').show();

    console.log('start scanning...');

    codeReader.listVideoInputDevices()

      .then((videoInputDevices) => {
        console.log(videoInputDevices);
        var idx = videoInputDevices.length - 1;
        var selectedDeviceId = videoInputDevices[idx].deviceId;
        
        
        codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
          if (result) {
            console.log(result);
            var resultArray = result.text.split("@");
            var fecha_nac_format = resultArray[6].split('/');
            
            var data = {
              apellido: resultArray[1],
              nombres: resultArray[2],
              dni: resultArray[4],
              fecha_nac: resultArray[6],
              fecha_nac_format: (fecha_nac_format[2] + '-' + fecha_nac_format[1] + '-' + fecha_nac_format[0])
            }

            $('#data-dni').val(data.dni);
            $('#data-apellido').val(data.apellido);
            $('#data-nombres').val(data.nombres);
            $('#data-fecha_nac').val( data.fecha_nac_format );

            $('#info-dni').text(data.dni);
            $('#info-apellido').text(data.apellido);
            $('#info-nombres').text(data.nombres);
            $('#info-fecha_nac').text(data.fecha_nac);
            
            $('#confirmDataModal').modal('show');

          }
          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err)
          }
        })

        $('#stopScanButton').click(function(e) {

          codeReader.reset();

          setTimeout(function(){
            $('#scan-view').hide(),
            $('#main-menu').show()
          }, 1000)
        
        })


      })
      .catch((err) => {
        console.error(err)
      })
  })

  $('#recordDataButton').click(function(){
    
    sendData({
      dni: $('#data-dni').val(),
      apellido: $('#data-apellido').val(),
      nombres: $('#data-nombres').val(),
      fecha_nac: $('#data-fecha_nac').val(),
      manual: false
    })

  })

  $('#submitFormButton').click(function(){

    if ( $('input[name="inputDni"').val() == "" ) {
      alert('Debe ingresar un DNI');
      return false
    }

    sendData({
      dni: $('input[name="inputDni"').val(),
      apellido: $('input[name="inputLastname"').val(),
      nombres: $('input[name="inputName"').val(),
      fecha_nac: '',
      manual: true
    })
  
  }) 


  function sendData(data){

    console.log('Data >>> ', data)

    $('#success_title').text("Datos guardados");
    $('#message_success').text(JSON.stringify(data));
    $('#successModal').modal('show');
      
  }

  $('#alertModal').on('hidden.bs.modal', function (e) {
    $('#confirmDataModal').modal('hide');
  })

  $('#successModal').on('hidden.bs.modal', function (e) {
    $('#confirmDataModal').modal('hide');
  })



})