$("#navbar").load("navbar.html");
$("#footer").load("footer.html");

const API_URL = "https://vercel.com/jakeroussis/trackme/1j84itomc/api";
// const API_URL = "http://localhost:5000/api";
const response = $.get("http://localhost:3001/devices");
const currentUser = localStorage.getItem("user");
console.log(response);
/*
const users = JSON.parse(localStorage.getItem("users")) || [];
*/

if (currentUser) {
    $.get(`${API_URL}/users/${currentUser}/devices`)
        .then(response => {
            response.forEach((device) => {
                $("#devices tbody").append(`
                <tr data-device-id=${device._id}>
                    <td>${device.user}</td>
                    <td>${device.name}</td>
                </tr>`
                );
            });
            $('#devices tbody tr').on('click', (e) => {
                const deviceId = e.currentTarget.getAttribute('data-device-id');
                $.get(`${API_URL}/devices/${deviceId}/device-history`)
                .then(response => {
                    response.map(sensorData => {
                        $('#historyContent').append(`
                        <tr>
                            <td>${sensorData.ts}</td>
                            <td>${sensorData.temp}</td>
                            <td>${sensorData.loc.lat}</td>
                            <td>${sensorData.loc.lon}</td>
                        </tr>
                    `);
                    });
                    $('#historyModal').modal('show');
                });
            });
        })
        .catch((error) => {
            console.error(`Error: ${error}`);
        });
} else {
    const path = window.location.pathname;
    if (path !== "/login" && path !== "/registration") {
        location.href = "/login";
    }
}

$.get(`${API_URL}/devices`)
    .then((response) => {
        response.forEach((device) => {
            $("#devices tbody").append(`
            <tr>
                <td>${device.user}</td>
                <td>${device.name}</td>
            </tr>`);
        });
        $("#devices tbody tr").on("click", (e) => {
            const deviceId = e.currentTarget.getAttribute("data-device-id");
            $.get(`${API_URL}/devices/${deviceId}/device-history`).then(
                (response) => {
                    console.log(response);
                }
            );
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

    $.post(`${API_URL}/devices`, body)
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

    if (exists || password != confirm) {
        $("#message").append(
            '<div class="alert alert-danger alert-dismissible fade show" role="alert">Username already taken or passwords do not match! \
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
    } else {
        $.post(`${API_URL}/registration`, { name, password }).then((response) => {
            if (response.success) {
                location.href = '/login';
            } else {
                $('#alert').append(`<p class="alert alert-danger">${response}</p>`); 
            }
        });
    }
});

$("#login").on("click", function () {
    const username = $("#username").val();
    const password = $("#password").val();
    $.post(`${API_URL}/authenticate`, { "name":username, "password":password }).then((response) => {
        if (response.success) {
            localStorage.setItem("user", username);
            localStorage.setItem("isAdmin", response.isAdmin);
            localStorage.setItem("isAuthenticated", true);

            location.href = "/";
        } else {
            $("#message").append(
                '<div class="alert alert-danger alert-dismissible fade show" role="alert">Incorrect username or password! \
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            );
        }
    });
});

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    location.href = "/login";
};
