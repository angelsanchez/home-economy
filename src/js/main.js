var importScript = require('./scripts/import/index.js');

function init() {
  $('#btn_import').click(function() {

    $('#import_ok').toggleClass('hidden', true);
    $('#import_ko').toggleClass('hidden', true);
    $('#import_file').parent().toggleClass('has-error', false);

    var dir = $('#import_file').val(),
      type = $('#import_type').val(),
      recursive = $('#check_recursive').prop('checked'),
      opts = {
        path: dir,
        type: type,
        recursive: recursive
      };

    if (!dir) {
      $('#import_file').parent().toggleClass('has-error', true);
      return false;
    }

    importScript.run(opts, function(err, result) {
      if (err) $('#import_ko').toggleClass('hidden', false);
      else {
        $('#total_tx').text(result.transactions);
        $('#total_files').text(result.files);
        $('#import_ok').toggleClass('hidden', false);
      }
    });
  });
}
