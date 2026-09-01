
document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".auth-form");
  const emailInput = document.querySelector('input[name="email"]');
  const senhaInput = document.querySelector('input[name="senha"]');
  const loginButton = form.querySelector(".btn-dark");

  // Mensagem de erro
  const errorMessage = document.createElement("p");

  errorMessage.style.color = "#d32f2f";
  errorMessage.style.fontSize = "14px";
  errorMessage.style.textAlign = "center";
  errorMessage.style.marginTop = "10px";
  errorMessage.style.display = "none";

  form.appendChild(errorMessage);


  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    errorMessage.style.display = "none";
    errorMessage.textContent = "";

    const email = emailInput.value.trim();
    const password = senhaInput.value;

    if (!email || !password) {
      errorMessage.textContent = "Informe o e-mail e a senha.";
      errorMessage.style.display = "block";
      return;
    }

    loginButton.textContent = "Entrando...";
    loginButton.disabled = true;


    try {

      const response = await fetch("/api/auth/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email: email,
          password: password
        })

      });


      const data = await response.json();


      // Usuário ou senha incorretos
      if (!response.ok) {

        errorMessage.textContent =
          data.error || "E-mail ou senha incorretos.";

        errorMessage.style.display = "block";

        return;
      }


      // Login realizado com sucesso
      console.log("Login realizado:", data);


      // Salva o token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }


      // Salva os dados do usuário
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }


      // Redireciona para a Home
      window.location.href = "../../pages/app/home.html";


    } catch (error) {

      console.error("Erro na conexão:", error);

      errorMessage.textContent =
        "Não foi possível conectar ao servidor. Tente novamente.";

      errorMessage.style.display = "block";


    } finally {

      loginButton.textContent = "Entrar";
      loginButton.disabled = false;

    }

  });

});

