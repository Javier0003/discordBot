const container = document.getElementById('container')

container.addEventListener('click', async (e) => {
    const element = e.target;

    if (element.classList.contains('toggle-role-button')) {
        const userId = element.dataset.userId;
        const isDev = element.dataset.isDev;

        const userData = await toggleUserRole(userId, isDev);

        if (!userData.success) {
            return alert("Error toggling user role");
        }

        element.dataset.isDev = userData.user.isDev;

        if (element.classList.contains('toggle-role-button')) {
            const parentDiv = document.getElementById(`${userId}-user-card`);

            if (parentDiv) {
                const roleHeader = parentDiv.querySelector('h3:nth-child(2)');
                if (roleHeader) {
                    roleHeader.textContent = userData.user.isDev == "1" ? 'Developer' : 'User';
                }
                element.textContent = userData.user.isDev == "1" ? 'Make User' : 'Make Developer';
            }
        }
    }


    if (element.classList.contains('toggle-vcban-button')) {
        const userId = element.dataset.userId;
        const isVCBan = element.dataset.isVcban;

        const userData = await toggleBan(userId, isVCBan);

        if (!userData.success) {
            return alert("Error toggling voice chat ban");
        }
        element.dataset.isVcban = userData.user.isVCBan;

        if (element.classList.contains('toggle-vcban-button')) {
            const parentDiv = document.getElementById(`${userId}-user-card`);

            if (parentDiv) {
                const vcBanHeader = parentDiv.querySelector('h3:nth-child(3)');
                if (vcBanHeader) {
                    vcBanHeader.innerHTML = userData.user.isVCBan == "1" ? 'VC Banned' : 'Not VC Banned';
                }
                element.innerHTML = userData.user.isVCBan == "1" ? 'Unban from VC' : 'Ban from VC';
            }
        }
    }
})

async function toggleUserRole(userId, isDev) {
    const res = await fetch(`/api/user/${userId}/role`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDev: isDev === "1" ? "0" : "1" }),
    });

    return await res.json()
}

async function toggleBan(userId, isVCBan) {
    const res = await fetch(`/api/user/${userId}/vcban`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVCBan: isVCBan === "1" ? "0" : "1" }),
    });

    return await res.json()
}

const fetchUsersButton = document.getElementById('fetch-discord-users-button');
fetchUsersButton.addEventListener('click', async () => {
    const response = await fetch('/api/users/fetch-discord-users');
    const data = await response.json();

    if (data.success) {
        alert(`Successfully fetched all Discord users! Fetched: ${data.fetchedUsers}`);
        window.location.reload();
    }
    else {
        alert('Error fetching Discord users.');
    }
});