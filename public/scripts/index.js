'use strict';

const REST_DATA = '/data';

const browse = document.querySelector('input[type=file]');
const upload = document.querySelector('input[type=submit]');
const docSelect = document.querySelector('select');

upload.addEventListener('click', uploadFile);

function uploadFile() {
    const file = browse.files[0];
    const docId = docSelect.value;
    let form;
    let queryParams;

    if (!file) {
        alert("File not selected for upload... \t\t\t\t \n\n - Choose a file to upload. \n - Then click on Upload button.");
        return;
    }

    form = new FormData();
    form.append("file", file);

    queryParams = `id=${docId}`

    xhrAttach(REST_DATA + "/attach?" + queryParams, form, item => {
        console.log(item);
    }, function(err) {
        console.error(err);
    });

}
