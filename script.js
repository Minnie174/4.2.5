const searchWrapper = document.querySelector('.wrapper');
const inputBox = searchWrapper.querySelector('.search-input');
const suggBox = searchWrapper.querySelector('.search');
let repos = document.querySelector('.repos');

const debounce = (fn, debounceTime) => {
    let debounce;

    return function() {
        clearTimeout(debounce);

        debounce = setTimeout(() => fn.apply(this, arguments), debounceTime)
    }
}

function makeSearch() {
    let li;
    let div;
    let closeBtn;

    inputBox.addEventListener('input', debounce(async (e) => {
        e.stopPropagation();

        let userData = e.target.value;
        if (!userData) return suggBox.classList.remove('active');

        let promise = await fetch('https://api.github.com/repositories');
        let repositories = await promise.json();

        let currentElem = repositories.filter((data) => data.name.startsWith((userData)))

        console.log(currentElem)

        suggBox.innerHTML = '';

        let listArr = [];

        for (let i = 0; i < currentElem.length; i++) {
            if (i < 5) {
                li = document.createElement('li');
                li.textContent = currentElem[i].name;
                li.classList.add('search-item');
                suggBox.appendChild(li);
                listArr.push(li);
            }
            if (listArr.length > 0) {
                suggBox.classList.add('active');
            } else {
                suggBox.classList.remove('active');
            }

            listArr[i].addEventListener('click', (event) => {
                event.stopPropagation();

                inputBox.value = '';
                suggBox.classList.remove('active');
                div = document.createElement('div');
                div.classList.add('repo');
                repos.appendChild(div);

                closeBtn = document.createElement('button');
                closeBtn.classList.add('btn-close');

                div.appendChild(closeBtn);

                div.onclick = (ev) => {
                    if (ev.target.className !== 'btn-close') return;

                    let button = ev.target.closest('.repo');
                    button.remove();
                };

                let slash = currentElem[i]['full_name'].indexOf('/');

                for (let t = 0; t < 3; t++) {
                    let text = document.createElement('div');
                    text.classList.add('text');
                    div.appendChild(text);

                    if (t === 0) {
                        text.textContent = `Name: ${currentElem[i].name}`
                    }
                    if (t === 1) {
                        text.textContent = `owner: ${currentElem[i]['full_name'].substr(0, slash)}`
                    }
                    if (t === 2) {
                        text.textContent = `Id: ${currentElem[i].id}`
                    }
                }
            })
        }
    }, 200));
}

makeSearch()