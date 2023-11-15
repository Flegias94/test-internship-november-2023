document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var form = event.target;
    var formData = new FormData(form);
    var jsonObject = {};

    for (const [key, value]  of formData.entries()) {
        jsonObject[key] = value;
    }

    var jsonDiv = document.createElement('div');
    jsonDiv.textContent = JSON.stringify(jsonObject, null, 2);
    form.after(jsonDiv);

    form.reset();
});