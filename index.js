const input = document.querySelector(".search-input")
const form = document.querySelector('.searchForm');
const english = document.querySelector(".form-radio-english")
const spanish = document.querySelector(".form-radio-spanish")
const resultSection = document.querySelector(".resultSection")
const searchButton = document.querySelector(".search-button")
const headerTexts = document.querySelector(".header__texts")
const headerTitle = document.querySelector(".header__texts__title")
const headerText = document.querySelector(".header__texts__text")


const paragraph = document.createElement("p")
const h2 = document.createElement("h2")
const h4 = document.createElement("h4")

document.addEventListener("click", checkLanguage)
form.addEventListener('submit', createSearch);

searchButton.addEventListener("click", () => {
    if (searchButton.innerText === "Search Again" || searchButton.innerText === "Buscar de nuevo") {
        resultSection.innerHTML = ""
        createSearch()
    }
})

function checkLanguage(e) {
    if (e.target === spanish) {
        searchButton.innerText = "Buscar"
        headerTitle.innerText = "Verificador de pseudosciencia"
        headerText.innerText = "Buscá una terapia o disciplina y enterate si es posta o gilada"
    }
    if (e.target === english) {
        location.reload()
    }
    resultSection.innerHTML = ""
}

function createSearch(e) {
    e.preventDefault();
    const term = input.value.split(" ").map(e => e.charAt(0).toUpperCase() + e.substr(1).toLowerCase())
    const searchTerm = term.join("_")

    fetchResults(searchTerm)
}


function fetchResults(searchTerm) {
    if (input.value) {

        const endpoint = english.checked ?
            encodeURI(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`) :
            encodeURI(`https://es.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`)

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                console.log(endpoint)
                const title = data.displaytitle
                const results = data.extract
                const description = data.description ? data.description : data.extract

                checkResults(results, title, description);
            })
            .catch(() => {
                console.log('An error occurred')
                showError()
            });
    }
}


function checkResults(results, title, description) {

    const keyWords = ["alternative therapy", "terapia alternativa", "medicina alternativa", "alternative medicine", "therapy", "terapia", "medical treatment", "tratamiento", "especialidad médica", "branch of medicine", "medical specialty", "academic discipline", "medical discipline", "medical therapy", "therapeutics techniques", "therapeutic technique", "práctica terapéutica"]


    if (keyWords.some(i => results.includes(i))) {
        console.log("its a therapy")
        checkPseudo(results, title, description)
    } else {
        console.log("enter a valid therapy")
        notValidTherapy()
    }
}


function checkPseudo(results, title, description) {
    const url = encodeURI(`https://en.wikipedia.org/wiki/${title}`);

    const keyWords = ["pseudoscience", "pseudoscientific", "alternative", "quakery", "pseudociencia", "pseudocientífico", "pseudocientífica", "alternativa", "pseudoterapia", "not scientific", "pseudotherapy", "anticientífica"]

    if (keyWords.some(i => results.includes(i))) {
        console.log("it's shit")
        itsPseudo(title, description, url)
    } else {
        console.log("it's for real")
        itsReal(title, description, url)
    }
}


function showError() {
    resultSection.appendChild(paragraph)

    paragraph.innerText = english.checked ? `We couldn't find "${input.value}". Try again` : `No encontramos "${input.value}". Intentalo de nuevo`

    resetButtonError()
}


function notValidTherapy() {
    resultSection.appendChild(paragraph)

    paragraph.innerText = english.checked ? `Seems that ${input.value} is not a valid therapy` : `Parece que ${input.value} no es una terapia válida`

    resetButtonError()
}


function resetButtonError() {
    input.value = ""
    searchButton.innerText = english.checked ? "Search Again" : "Buscar de nuevo"
}


function itsPseudo(title, description, url) {
    resultSection.appendChild(h2)
    resultSection.appendChild(h4)
    h2.innerHTML = english.checked ? `${title} it's a pseudoscience!` : `¡${title} es una pseudociencia!`
    h4.innerHTML = description

    resetButtonError()
}


function itsReal(title, description, url) {
    resultSection.appendChild(h2)
    resultSection.appendChild(h4)
    h2.innerHTML = english.checked ? `${title} it's the real shit!` : `¡${title} es posta!`
    h4.innerHTML = description

    resetButtonError()
}