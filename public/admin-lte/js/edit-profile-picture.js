function initializeCropper(customWidth = null, customHeight = null) {
    let result = document.querySelector('.result');
    let upload = document.querySelector('#file-input');
    let done = document.querySelector('#done_adjust');

    const calculatedAspectRatio = (customWidth && customHeight)
        ? (customWidth / customHeight)
        : NaN;

    if (result) {
        let cropper = null;

        upload.addEventListener('change', e => {
            if (e.target.files.length) {
                const reader = new FileReader();
                reader.onload = e => {
                    if (e.target.result) {
                        if (cropper) {
                            cropper.destroy();
                        }

                        let img = document.createElement('img');
                        img.id = 'image';
                        img.src = e.target.result;
                        result.innerHTML = '';
                        result.appendChild(img);

                        cropper = new Cropper(img, {
                            aspectRatio: calculatedAspectRatio,
                            viewMode: 1,
                            minCropBoxWidth: 200,
                            minCropBoxHeight: 200
                        });
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        done.addEventListener('click', e => {
            e.preventDefault();
            if (!cropper) return;

            const canvasOptions = {};
            if (customWidth) canvasOptions.width = customWidth;
            if (customHeight) canvasOptions.height = customHeight;

            const canvas = cropper.getCroppedCanvas(canvasOptions);

            canvas.toBlob(function (response) {
                const reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = function () {
                    const base64data = reader.result;
                    $('#image_data').val(base64data);
                    alert('Image processed!');
                }
            });
        });
    }
}