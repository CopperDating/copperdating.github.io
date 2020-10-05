function onSubmit()
{
    const submit = document.getElementById("registerSubmit")

    submit.disabled = true
    submit.innerText = "Registering..."
}


document.getElementById("frmRegister").addEventListener('submit', onSubmit)
