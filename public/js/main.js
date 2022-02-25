const socket = io.connect();

socket.on("update_products", async (data) => {
    showProducts(data)
})

document.querySelector("#form-add-product").addEventListener('submit', async (e) => {
    e.preventDefault();

    await fetch("/api/productos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: document.querySelector("#form-add-product input[name=title]").value,
            price: document.querySelector("#form-add-product input[name=price]").value,
            thumbnail: document.querySelector("#form-add-product input[name=thumbnail]").value,
        }),
    });
});


async function showProducts(data) {
    const fetchTemplateHbs = await fetch("/templates/list_products.hbs");
    const templateHbs = await fetchTemplateHbs.text();
    const template = Handlebars.compile(templateHbs);
    const html = template ({ products: data });
    document.querySelector("#list-products").innerHTML = html;
}

//Chat
document.querySelector("#formuChat").addEventListener("submit", (e) => {
    e.preventDefault();
    
    let date = new Date();
    socket.emit("new_message", {
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
        fecha:  date.toLocaleDateString() + " " + date.toLocaleTimeString(),
    })
    document.querySelector("#message").value="";
})

const renderhbs = (messages) => {
    const tplHtml = document.querySelector("#messages-tpl").innerHTML;
    const template = Handlebars.compile(tplHtml);
    document.querySelector("#messages").innerHTML = template({ messages });
  };

//Escucho lo que envia el servidor de socket y llamo a la funcion render/renderhbs  
socket.on("messages", (data) => {
    renderhbs(data);
})