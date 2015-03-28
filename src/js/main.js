var importScript = require('./scripts/import/index.js');

$(document).ready(function() {
  var $importFile = $('#import_file');

  $('#tabs').find('a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
  });

  $('#btn_import').click(function() {

    $('#import_ok').toggleClass('hidden', true);
    $('#import_ko').toggleClass('hidden', true);
    $importFile.parent().toggleClass('has-error', false);

    var dir = $importFile.val();
    var type = $('#import_type').val();
    var recursive = $('#check_recursive').prop('checked');
    var opts = {
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
        $importFile.text(result.files);
        $('#import_ok').toggleClass('hidden', false);
      }
    });
  });
});
