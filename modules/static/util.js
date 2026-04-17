/**
 * If a `!resp.ok` can call to check if the reason for failure was an auth error,
 * if so, redirect to the login page temporarily to fix that error.
 */
function chkError(resp) {
    if (resp.status == 401) window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`
}
