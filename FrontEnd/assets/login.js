const submit = document.getElementById("submit");
const errorInformation = document.getElementById("errorInformation");

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("emailUser").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    errorInformation.innerHTML = "Veuillez entrer un identifiant et un mot de passe valides";
    return;
  }

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const userInformation = await response.json();
      window.sessionStorage.setItem("userInformation", JSON.stringify(userInformation));
      window.sessionStorage.setItem("token", userInformation.token);
      window.location.replace("./index.html");
    } else {
      errorInformation.innerHTML = "Erreur dans l'identifiant ou le mot de passe";
    }
  } catch (error) {
    console.error(error);
  }
});

