function apiRequest(endPoint, method, body, cb) {
  let opts;
  if (body) {
    opts = { method, headers: { 'Content-Type': "application/json" }, body: JSON.stringify(body) }
  } else {
    opts = { method }
  }

  const addr = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : 'http://localhost:4000/api';
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