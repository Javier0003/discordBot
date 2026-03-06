const btn = document.getElementById("send");


btn.addEventListener("click", async () => {
    const name = document.getElementById("nameInput").value;
    const ip = document.getElementById("ipInput").value;
    const port = document.getElementById("portInput").value;

    await fetch("/api/minecraft/register-server", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            ip,
            port,
        }),
    })

    window.location.href = `/minecraft`;
})