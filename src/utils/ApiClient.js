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
        response.json().then(json => {
          cb(null, json)
        })
      } else {
        response.json().then(json => {
          cb(json.error || response.statusText || `Respuesta Inesperada ${response.status}`, null)
        })
      }
    }).catch(error => {
      cb(error, null)
    })
}

export { apiRequest }