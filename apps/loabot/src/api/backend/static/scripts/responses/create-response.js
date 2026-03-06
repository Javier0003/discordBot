const btn = document.getElementById('btnSend');

btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const responseInput = document.getElementById('response');
    const response = responseInput.value;

    const res = await fetch('/api/bot/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: response }),
    });

    if (res.ok) {
        alert('Response created successfully!');
        responseInput.value = '';
    } else {
        alert('Failed to create response.');
    }
})