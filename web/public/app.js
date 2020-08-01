$("#navbar").load("navbar.html");
$("#footer").load("footer.html");

const response = $.get("http://localhost:3001/devices");
console.log(response);
const users = JSON.parse(localStorage.getItem("users")) || [];

$.get("http://localhost:3001/devices")
    .then((response) => {
        response.forEach((device) => {
            $("#devices tbody").append(`
            <tr>
                <td>${device.user}</td>
                <td>${device.name}</td>
            </tr>`);
        });
    })
    .catch((error) => {
        console.error(`Error: ${error}`);
    });

$("#add-device").on("click", () => {
    const name = $("#name").val();
    const user = $("#user").val();
    const sensorData = [];

    const body = {
        name,
        user,
        sensorData,
    };
    
    $.post("http://localhost:3001/devices", body)
        .then((response) => {
            location.href = "/";
        })
        .catch((error) => {
            console.error(`Error: ${error}`);
        });
});

$("#send-command").on("click", function () {
    const command = $("#command").val();
    console.log(`command is: ${command}`);
});

$("#register").on("click", function () {
    $(".alert").alert("close");
    const username = $("#username").val();
    const password = $("#password").val();
    const confirm = $("#confirm").val();
    const exists = users.find((user) => user.name === username);
    console.log(users);

    if (!exists && password === confirm) {
        users.push({ name: username, password });
        localStorage.setItem("users", JSON.stringify(users));
        location.href = "/login";
    } else {
        $("#message").append(
            '<div class="alert alert-danger alert-dismissible fade show" role="alert">Username already taken or passwords do not match! \
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
    }
});

$("#login").on("click", function () {
    const username = $("#username").val();
    const password = $("#password").val();
    const userExists = users.find(
        (user) => user.name === username && user.password === password
    );

    if (userExists) {
        localStorage.setItem("isAuthenticated", true);
        location.href = "/";
    } else {
        $("#message").append(
            '<div class="alert alert-danger alert-dismissible fade show" role="alert">Incorrect username or password! \
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
    }
});

const logout = () => {
    localStorage.removeItem("isAuthenticated");
    location.href = "/login";
};
