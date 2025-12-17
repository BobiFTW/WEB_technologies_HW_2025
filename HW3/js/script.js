const clearErrors = () => {
    document.querySelectorAll('.error').forEach(e => e.textContent = "");
    successDiv.textContent = "";
}

const validateForm = (username, name, familyName, email, password, postalCode) => {
    let isValid = true;
    
    if (!(3 <= username.length && username.length <= 10)) {
        document.getElementById("error-username").textContent = "Потребителското име трябва да е между 3 и 10 символа включително.";
        isValid = false;
    }

    if (!(name && name.length <= 50)) {
        document.getElementById("error-name").textContent = "Първото име трябва да е между 1 и 50 символа включително.";
        isValid = false;
    }

    if (!(familyName && familyName <= 50)) {
        document.getElementById("error-family-name").textContent = "Фамилията трябва да е между 1 и 50 символа включително.";
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!(email && emailRegex.test(email))) {
        document.getElementById("error-email").textContent = "Невалиден формат за имейл.";
        isValid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,10}$/;
    if (!(password && passwordRegex.test(password))) {
        document.getElementById("error-password").textContent = "Паролата трябва да е между 6 и 10 символа и да съдържа малки, главни букви и цифри.";
        isValid = false;
    }

    if (postalCode) {
        const postalCodeRegex = /^(\d{4}|\d{5}-\d{4})$/;
        if (!postalCodeRegex.test(postalCode)) {
            document.getElementById("error-postal-code").textContent = "Невалиден пощенски формат.";
            isValid = false;
        }
    }

    return isValid;
}

const registerBtn = document.getElementById("register-btn")
const successDiv = document.getElementById("success")

registerBtn.addEventListener("click", async () => {
    clearErrors();

    const username = document.getElementById("username").value.trim();
    const name = document.getElementById("name").value.trim();
    const familyName = document.getElementById("family-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const postalCode = document.getElementById("postal-code").value.trim();

    if (!validateForm(username, name, familyName, email, password, postalCode)) {
        return;
    }

    try {
        const domain = "https://jsonplaceholder.typicode.com/users";
        const response = await fetch(domain);
        const users = await response.json();

        const userExists = users.some(user => user.username === username);

        if (userExists) {
            document.getElementById("error-username").textContent = "Вече съществува потребител с посоченото име.";
            return;
        }

        const newUser = {
            username,
            name: name + " " + familyName,
            email,
            password,
            address: {
                street,
                city,
                postalCode
            }
        };

        const postResponse = await fetch(domain, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });

        if (postResponse.ok) {
            successDiv.textContent = "Регистрацията се извърши успешно!";
            document.getElementById("register-form").reset();
        }
    } catch (error) {
        console.log(error);
    }
});
