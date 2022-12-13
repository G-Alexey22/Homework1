//Функция для отображения всех котов на странице
showAllCats();

function showAllCats() {
  fetch("https://cats.petiteweb.dev/api/single/g-alexey22/show/")
    .then((Response) => Response.json())
    .then((cats) => {
      for (const item of cats) {
        const div = document.createElement("div");
        div.setAttribute("id", item.id);
        div.classList.add("card");
        const name = document.createElement("span");
        name.classList.add("card__name");
        name.innerHTML = item.name;
        const foto = document.createElement("img");
        foto.classList.add("card__foto");
        foto.src = item.image;
        foto.alt = "image cat";
        div.append(name, foto);
        document.querySelector("main").append(div);
      }
    });
}

//Функция для отображения информации в модальном окне по id
function getCatsById(idcat) {
  fetch("https://cats.petiteweb.dev/api/single/g-alexey22/show/" + idcat)
    .then((Response) => Response.json())
    .then((cat) => {
      foto.setAttribute("src", cat.image);
      id.value = cat.id;
      namecat.value = cat.name;
      if (cat.favorite == true) {
        favorite.selectedIndex = 0;
      } else {
        favorite.selectedIndex = 1;
      }
      rate.selectedIndex = cat.rate - 1;
      age.selectedIndex = cat.age - 1;
      description.innerHTML = cat.description;
      image.innerHTML = cat.image;
    });
}

//Открытие модально окна
main.addEventListener("click", (event) => {
  const teg = event.target.classList.contains("card");
  if (teg) {
    const idcat = event.target.getAttribute("id");
    showcard.showModal();
    getCatsById(idcat);
  }
});

//Закрытие модально окна
closecard.addEventListener("click", () => {
  showcard.close();
  deleteClassActive();
  edit.innerHTML = "Редактировать";
  location.reload();
});

//Функция добавления класса Active
function addClassActive() {
  favorite.disabled = false;
  rate.disabled = false;
  age.disabled = false;
  description.disabled = false;
  image.disabled = false;
  favorite.classList.add("active");
  rate.classList.add("active");
  age.classList.add("active");
  description.classList.add("active");
  image.classList.add("active");
}

//Функция удаления класса Active
function deleteClassActive() {
  favorite.disabled = true;
  rate.disabled = true;
  age.disabled = true;
  description.disabled = true;
  image.disabled = true;
  favorite.classList.remove("active");
  rate.classList.remove("active");
  age.classList.remove("active");
  description.classList.remove("active");
  image.classList.remove("active");
}

// Редактирование и сохранение кота по ID
edit.addEventListener("click", () => {
  const editButton = edit.innerText;
  switch (editButton) {
    case "Редактировать":
      add.disabled = true;
      deletecat.disabled = true;
      addClassActive();
      edit.innerHTML = "Сохранить";
      message.innerHTML = "";
      break;
    case "Сохранить":
      changeCatById();
      deleteClassActive();
      edit.innerHTML = "Редактировать";
      break;
  }
});

//Функция изменения кота по ID
function changeCatById() {
  const updateCat = {
    id: id.value,
    name: namecat.value,
    favorite: favorite.value,
    rate: rate.value,
    age: age.value,
    description: description.value,
    image: image.value,
  };

  fetch(
    "https://cats.petiteweb.dev/api/single/g-alexey22/update/" + updateCat.id,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateCat),
    }
  )
    .then((response) => response.json())
    .then((answer) => {
      message.innerHTML = answer.message;
    })
    .catch((answer) => {
      message.innerHTML = answer.message;
    });
}

//Удаление кота
deletecat.addEventListener("click", () => {
  const deleteCat = id.value;
  fetch(
    "https://cats.petiteweb.dev/api/single/g-alexey22/delete/" + deleteCat,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((answer) => (message.innerHTML = answer.message))
    .catch((answer) => (message.innerHTML = answer.message));
  deletecat.disabled = true;
  edit.disabled = true;
});

//Функция очистки формы при нажатии на кнопку Добавить
function clearForm() {
  deletecat.disabled = true;
  edit.disabled = true;
  id.value = "";
  namecat.value = "";
  favorite.selectedIndex = 0;
  rate.selectedIndex = 0;
  age.selectedIndex = 0;
  description.innerHTML = "";
  image.innerHTML = "";
  namecat.disabled = false;
  namecat.classList.add("active");
  addClassActive();
}

//Добавление кота
add.addEventListener("click", () => {
  const addButton = add.innerText;
  switch (addButton) {
    case "Добавить":
      edit.disabled = true;
      deletecat.disabled = true;
      fetch("https://cats.petiteweb.dev/api/single/g-alexey22/show/")
        .then((Response) => Response.json())
        .then((cats) => {
          clearForm();
          id.value = cats[cats.length-1].id + 1;
         add.innerHTML = "Сохранить";
         readingDataFromLS()
         foto.setAttribute("src", image.value)
        });
      break;
    case "Сохранить":
      const newCat = {
        id: id.value,
        name: namecat.value,
        favorite: favorite.value,
        rate: rate.value,
        age: age.value,
        description: description.value,
        image: image.value,
      };
      if (newCat.name == "") {
        message.innerHTML = '"Имя питомца" обязательно для заполнения';
      } else {
        message.innerHTML = "";
        if (newCat.image == "") {
          newCat.image =
            "https://upload.wikimedia.org/wikipedia/commons/9/9a/%D0%9D%D0%B5%D1%82_%D1%84%D0%BE%D1%82%D0%BE.png";
        }

        fetch("https://cats.petiteweb.dev/api/single/g-alexey22/add/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCat),
        })
          .then((response) => response.json())
          .then((answer) => (message.innerHTML = answer.message))
          .catch((answer) => (message.innerHTML = answer.message));
      }
      break;
  }
});

//Запись данных с формы в LocalStore
const myForm = document.getElementById("formmodal");
const LS = localStorage;
let formData = {
  namecat: '',
  favorite: favorite.value,
  rate: rate.value,
  age: age.value,
  description: '',
  image: '',
};
myForm.addEventListener("input", (event) => {
  formData[event.target.name] = event.target.value
  LS.setItem("formData", JSON.stringify(formData));
});


//Чтение данных из LocalStore
function readingDataFromLS(){
if(LS.getItem('formData')){
  formData = JSON.parse(LS.getItem('formData'))
  for (const key in formData) {
    myForm.elements[key].value = formData[key]
  }
  message.innerHTML = 'Поля заполнены из Local Storage'
}}

//Автообновление изображения в карточке
image.addEventListener('input',(event) => {
  foto.setAttribute("src", image.value);
})