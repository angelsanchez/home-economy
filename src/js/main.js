var importSantander = require('./api/import/santander');

function init() {
  document.getElementById('btn_import').onclick = function() {
    var dir = document.getElementById('txt_import_folder').value;
    importSantander.importFrom(dir, function(err, msg) {
      var txtConsole = document.getElementById('txt_console');
      txtConsole.value = msg;
    });
  };
}
