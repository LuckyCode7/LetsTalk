const getSelf = async() => {

    // $.get('/getSelf', function(data, status) {

    //     return data;
    // });

    const resp = await fetch('/getSelf');

    return resp;

    console.log(resp);

    // $.ajax({
    //     type: "GET",
    //     url: "/getSelf",
    //     async: false,
    //     success: function(response) { return response; }
    // });
}

console.log(getSelf());