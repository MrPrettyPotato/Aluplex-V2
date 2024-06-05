document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('updatePasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault(); // Voorkom dat het formulier op de traditionele manier wordt verzonden

        const formData = new FormData(this); // 'this' verwijst naar het formulier
 const currentPassword = formData.get('currentPassword');
 const password = formData.get('newPassword');
 const confirmPassword = formData.get('confirmPassword');
 const data = {password:{currentPassword:currentPassword,password: password,confirmPassword: confirmPassword}};
        return await fetch("/users/updateUserPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data
            }),
        })   .then((response) => response.json())
        .then((data) => {
            console.log('returned data',data)
            alert(data.message)
        })
        .catch(error => {
            console.error('Fout bij het verzenden van het formulier:', error);
            alert('Er is een fout opgetreden bij het versturen van het formulier.');
        });
    });
});
