var importScript = require('./scripts/import/index.js');

function init() {
  document.getElementById('btn_import').onclick = function() {

    $('#import_ok').toggleClass('hidden', true);
    $('#import_ko').toggleClass('hidden', true);

    var dir = $('#import_file').val(),
      type = $('#import_type').val(),
      recursive = $('#check_recursive').prop('checked'),
      opts = {
        path: dir,
        type: type,
        recursive: recursive
      };

    if (!dir) return; // TODO put input folder in invalid_state or use a validator

    importScript.run(opts, function(err, result) {
      if (err) $('#import_ko').toggleClass('hidden', false);
      else {
        $('#total_tx').text(result.transactions);
        $('#total_files').text(result.files);
        $('#import_ok').toggleClass('hidden', false);
      }
    });
  };
}
