function apiRequest(endPoint, method, key, body, cb) {
  let opts = { method };
  if (body) {
    opts = { headers: { 'Content-Type': "application/json" }, body: JSON.stringify(body), ...opts }
  }

  if (key) {
    opts.headers = { 'Authorization': `Bearer ${key}`, ...opts.headers }
  }
  
  const url = new URL(window.location.href)
  const addr1 = `${url.protocol}//${url.host}/api`

  const addr = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : addr1;
  fetch(addr + endPoint, opts)
    .then(response => {
      if (response.ok) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(function (json) {
            cb(null, json)
          });
        } else {
          cb(null, null)
        }
      } else {
        response.json().then(json => {
          cb(json.error || response.statusText || `Respuesta Inesperada ${response.status}`, null)
        })
      }
    }).catch(error => {
      cb(error.message, null)
    })
}

export { apiRequest }