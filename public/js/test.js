function submit() {
    console.log("submit")
    const data = [{
        aantal: "1",
        type: "Rolluikblad",
        lamel: "Alu42"
    }, {
        aantal: "5",
        type: "Rolluikblad",
        lamel: "Alu55"
    }];

    // Send a POST request to the server to generate the PDF
    fetch('/test/generate-pdf', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            // Create a blob object from the response and create a download link for the PDF
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'offerte.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            console.error(error);
        });
}