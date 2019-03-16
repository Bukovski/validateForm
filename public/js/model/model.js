class Model {
  getRequest(data, token) {
    fetch("api/verify", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((success) => console.info(success.data))
      .catch((err) => console.error("error: " + err.responseText))
  }
}