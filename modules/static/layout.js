function logout(e) {
    e.preventDefault();
    fetch('/api/logout' + window.location.search, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: localStorage.getItem('username'),
            token: localStorage.getItem('token')
        })
    }).then(resp=>{ // always logout locally, even on server error
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        if(!resp.ok) {
            window.location.href = "/"
        };
        resp.json().then(json=>window.location.href = json.url)}
    )
}

function layout(){
    const username = localStorage.getItem('username');
    const header = document.createElement('div');
    header.id = "header"
    header.innerHTML = `
    <a href="/">Home</a>
    <a href="/dashboard">Dashboard</a>
    <a href="/account">Account</a>
    <div>
    ${username
            ? `<p>${username}</p><a href="#" onclick="logout(event)" >Logout</a>`
            : `<a href="/login?next=${encodeURIComponent(window.location.pathname)}">Login</a>`}
    </div>
    `
    document.body.prepend(header)
}


layout();