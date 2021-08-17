"use strict";
const cards = [];
/* Contents */
const contents = document.querySelector("ul");
/* Navigation */
const imgBtn = document.querySelector("#imgBtn");
const videoBtn = document.querySelector("#videoBtn");
const noteBtn = document.querySelector("#noteBtn");
const todoBtn = document.querySelector("#todoBtn");
/* Modal */
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const titleInput = document.querySelector("#modal-title");
const submit = document.querySelector("#modal-return");
const contentInput = document.querySelector("#modal-content");
const pTitle = titleInput.querySelector("p");
const inputTitle = titleInput.querySelector("input");
const pContent = contentInput.querySelector("p");
const inputContent = contentInput.querySelector("input");
submit.textContent = "Return";
pTitle.textContent = "Title";
inputTitle.setAttribute("placeholder", "Title");
class CardImpl {
    constructor(_title) {
        this._title = _title;
    }
    get title() {
        return this._title;
    }
}
class NoteCard extends CardImpl {
    constructor(_title, _note) {
        super(_title);
        this._note = _note;
    }
    get title() {
        return this._title;
    }
    get note() {
        return this._note;
    }
    createElement() {
        let elem = document.createElement("li");
        const section = document.createElement("section");
        const article = document.createElement("article");
        const closeBtn = document.createElement("span");
        const pTitle = document.createElement("p");
        const pNote = document.createElement("p");
        section.classList.add("card");
        pTitle.classList.add("title");
        pNote.classList.add("note");
        closeBtn.classList.add("close");
        section.draggable = true;
        section.setAttribute("ondragstart", "drag(event)");
        section.setAttribute("ondrop", "drop(event)");
        section.setAttribute("ondragover", "allowDrop(event)");
        pTitle.textContent = this.title;
        pNote.textContent = this.note;
        closeBtn.textContent = "×";
        closeBtn.onclick = () => {
            if (elem.parentElement == null) {
                throw new Error("List parent is null");
            }
            deleteCard(this);
            repaint();
        };
        article.appendChild(pTitle);
        article.appendChild(pNote);
        section.appendChild(article);
        section.appendChild(closeBtn);
        elem.append(section);
        return elem;
    }
}
class ToDoCard extends CardImpl {
    constructor(_title, _tasks) {
        super(_title);
        this.tasks = _tasks.split(",");
    }
    createElement() {
        const elem = document.createElement("li");
        const section = document.createElement("section");
        const article = document.createElement("article");
        const closeBtn = document.createElement("span");
        const pTitle = document.createElement("p");
        const pToDo = document.createElement("p");
        section.classList.add("card");
        closeBtn.classList.add("close");
        pTitle.classList.add("title");
        pToDo.classList.add("toDo");
        section.draggable = true;
        section.setAttribute("ondragstart", "drag(event)");
        section.setAttribute("ondrop", "drop(event)");
        section.setAttribute("ondragover", "allowDrop(event)");
        pTitle.textContent = this._title;
        this.tasks.forEach((task) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.onclick = () => {
                if (input.checked)
                    label.classList.add("strikethrough");
                else
                    label.classList.remove("strikethrough");
            };
            label.appendChild(input);
            label.appendChild(document.createTextNode(" " + task));
            pToDo.appendChild(label);
            pToDo.appendChild(document.createElement("br"));
        });
        closeBtn.textContent = "×";
        closeBtn.onclick = () => {
            if (elem.parentElement == null) {
                throw new Error("List parent is null");
            }
            deleteCard(this);
            repaint();
        };
        article.appendChild(pTitle);
        article.appendChild(pToDo);
        section.appendChild(article);
        section.appendChild(closeBtn);
        elem.append(section);
        return elem;
    }
}
class ImageCard extends CardImpl {
    constructor(_title, url) {
        super(_title);
        this.url = url;
    }
    createElement() {
        const elem = document.createElement("li");
        const section = document.createElement("section");
        const source = document.createElement("article");
        const description = document.createElement("article");
        const image = document.createElement("img");
        const pTitle = document.createElement("p");
        const closeBtn = document.createElement("span");
        section.classList.add("card");
        source.classList.add("source");
        description.classList.add("description");
        section.draggable = true;
        section.setAttribute("ondragstart", "drag(event)");
        section.setAttribute("ondrop", "drop(event)");
        section.setAttribute("ondragover", "allowDrop(event)");
        pTitle.classList.add("title");
        closeBtn.classList.add("close");
        image.src = this.url;
        pTitle.textContent = this.title;
        closeBtn.textContent = "×";
        closeBtn.onclick = () => {
            if (elem.parentElement == null) {
                throw new Error("List parent is null");
            }
            deleteCard(this);
            repaint();
        };
        source.appendChild(image);
        description.appendChild(pTitle);
        section.appendChild(source);
        section.appendChild(description);
        section.appendChild(closeBtn);
        elem.append(section);
        return elem;
    }
}
class VideoCard extends CardImpl {
    constructor(_title, url) {
        super(_title);
        this.url = url;
    }
    createElement() {
        const elem = document.createElement("li");
        const section = document.createElement("section");
        const source = document.createElement("article");
        const description = document.createElement("article");
        const video = document.createElement("iframe");
        const pTitle = document.createElement("p");
        const closeBtn = document.createElement("span");
        section.classList.add("card");
        section.classList.add("video-card");
        source.classList.add("source");
        description.classList.add("description");
        section.draggable = true;
        section.setAttribute("ondragstart", "drag(event)");
        section.setAttribute("ondrop", "drop(event)");
        section.setAttribute("ondragover", "allowDrop(event)");
        pTitle.classList.add("title");
        closeBtn.classList.add("close");
        video.src = this.url;
        video.setAttribute("frameborder", "0");
        video.setAttribute("allowfullscreen", "1");
        pTitle.textContent = this.title;
        closeBtn.textContent = "×";
        closeBtn.onclick = () => {
            if (elem.parentElement == null) {
                throw new Error("List parent is null");
            }
            deleteCard(this);
            repaint();
        };
        source.appendChild(video);
        description.appendChild(pTitle);
        section.appendChild(source);
        section.appendChild(description);
        section.appendChild(closeBtn);
        elem.append(section);
        return elem;
    }
}
/* Functions */
// Nav Button click listeners
imgBtn.onclick = () => {
    pContent.textContent = "URL";
    inputContent.setAttribute("placeholder", "image url");
    modal.style.display = "block";
    submit.onclick = () => {
        if (inputInvalid())
            return;
        createCard(new ImageCard(inputTitle.value, inputContent.value));
        inputTitle.value = "";
        inputContent.value = "";
        modal.style.display = "none";
    };
};
videoBtn.onclick = () => {
    pContent.textContent = "URL";
    inputContent.setAttribute("placeholder", "video url");
    modal.style.display = "block";
    submit.onclick = () => {
        if (inputInvalid())
            return;
        createCard(new VideoCard(inputTitle.value, inputContent.value));
        inputTitle.value = "";
        inputContent.value = "";
        modal.style.display = "none";
    };
};
noteBtn.onclick = () => {
    pContent.textContent = "Note";
    inputContent.setAttribute("placeholder", "note");
    modal.style.display = "block";
    submit.onclick = () => {
        if (inputInvalid())
            return;
        createCard(new NoteCard(inputTitle.value, inputContent.value));
        inputTitle.value = "";
        inputContent.value = "";
        modal.style.display = "none";
    };
};
todoBtn.onclick = () => {
    pContent.textContent = "Tasks";
    inputContent.setAttribute("placeholder", "sperated by ,");
    modal.style.display = "block";
    submit.onclick = () => {
        if (inputInvalid())
            return;
        createCard(new ToDoCard(inputTitle.value, inputContent.value));
        inputTitle.value = "";
        inputContent.value = "";
        modal.style.display = "none";
    };
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
const inputInvalid = () => {
    if (inputTitle.value.length <= 0 || inputContent.value.length <= 0) {
        alert("Please enter a valid input");
        return true;
    }
    return false;
};
/* Drag and Drop */
const allowDrop = (e) => {
    e.preventDefault();
};
const drag = (e) => {
    var _a;
    const elem = e.target;
    if (elem == null)
        throw new Error("Start element is null");
    if (elem.parentElement == null)
        throw new Error("From element's parent is null");
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text", getIndex(elem.parentElement));
};
const drop = (e) => {
    const elemTo = e.target;
    if (e.dataTransfer == null)
        throw new Error("Data transfer is null");
    if (elemTo == null)
        throw new Error("Start element is null");
    if (elemTo.parentElement == null)
        throw new Error("From element's parent is null");
    const elemFromIndex = parseInt(e.dataTransfer.getData("text"));
    const elemToIndex = parseInt(getIndex(elemTo.parentElement));
    swapCard(cards, elemFromIndex, elemToIndex);
    repaint();
};
const getIndex = (elem) => {
    if (elem == null)
        throw new Error("This element is null");
    if (elem.parentElement == null)
        throw new Error("Parent Node is null");
    while (elem.parentElement != contents) {
        elem = elem.parentElement;
    }
    for (let i = 0; i < contents.childNodes.length; i++) {
        if (contents.childNodes[i] == elem)
            return i.toString();
    }
    throw new Error("this element does not exist");
};
const swapCard = (cards, elemFromIndex, elemToIndex) => {
    if (elemFromIndex > elemToIndex) {
        cards.splice(elemToIndex, 0, cards[elemFromIndex]);
        cards.splice(elemFromIndex + 1, 1);
    }
    else {
        cards.splice(elemToIndex + 1, 0, cards[elemFromIndex]);
        cards.splice(elemFromIndex, 1);
    }
};
/* Create Card */
const createCard = (newCard) => {
    cards.push(newCard);
    repaint();
};
const repaint = () => {
    contents.innerHTML = "";
    cards.forEach((card) => {
        const cardElement = card.createElement();
        if (cardElement == null) {
            alert("ERROR");
            return;
        }
        contents.appendChild(cardElement);
        contents.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
        });
    });
};
const deleteCard = (cardToDelete) => {
    cards.splice(cards.indexOf(cardToDelete), 1);
};
/* Initial Screen */
function init() {
    createCard(new NoteCard("Note Demo", "This is demo for note card"));
    createCard(new ImageCard("Image Demo", "https://files.realpython.com/media/random_data_watermark.576078a4008d.jpg"));
    createCard(new ToDoCard("To Do Demo", "This is, demo for, To do, card"));
    createCard(new VideoCard("Video Demo", "https://www.youtube.com/embed/4u856utdR94"));
}
init();
//# sourceMappingURL=app.js.map