// Зарузка данных в карточку с сервера
showAllCats();

function showAllCats() {
  fetch("https://cats.petiteweb.dev/api/single/g-alexey22/show/")
    .then((Response) => Response.json())
    .then((cats) => {
      for (const item of cats) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.style.backgroundImage = `url(${item.image})`;
        card.setAttribute("id", item.id);
        const cardLike = document.createElement("div");
        cardLike.classList.add("card-like");
        const cardLikeImg = document.createElement("img");
        cardLikeImg.classList.add("card-like__img");
        if (item.favorite) {
          cardLikeImg.setAttribute("src", "icons/heart.svg");
        } else {
          cardLikeImg.setAttribute("src", "icons/heart-black.svg");
        }
        cardLikeImg.setAttribute("alt", "icon-heart");
        cardLike.append(cardLikeImg);
        const cardLikeSpan = document.createElement("span");
        cardLikeSpan.classList.add("nickname");
        cardLikeSpan.innerHTML = item.name;
        const cardDelete = document.createElement("div");
        cardDelete.classList.add("card-delete");
        const p = document.createElement("p");
        p.innerHTML = "Нажмите на карточке для удаления";
        const cardDeleteImg = document.createElement("img");
        cardDeleteImg.classList.add("card-delete__img");
        cardDeleteImg.setAttribute("src", "icons/trash-red.svg");
        cardDeleteImg.setAttribute("alt", "icon-trash");
        cardDelete.append(p, cardDeleteImg);
        card.append(cardLike, cardLikeSpan, cardDelete);
        main.append(card);
      }
    });
}

//Функция для отображения информации в модальном окне по id
function getCatsById(catid) {
  fetch("https://cats.petiteweb.dev/api/single/g-alexey22/show/" + catid)
    .then((Response) => Response.json())
    .then((cat) => {
      modalImg.style.backgroundImage = `url(${cat.image})`;
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

//Функция удаления кота по ID
function deleteCat() {
  const catId = id.value;
  fetch("https://cats.petiteweb.dev/api/single/g-alexey22/delete/" + catId, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((answer) => (message.innerHTML = answer.message))
    .catch((answer) => (message.innerHTML = answer.message));
}

//Открытие модально окна при нажатии на карточку
main.addEventListener("click", (event) => {
  const card = event.target.classList.contains("card");
  if (card) {
    const catid = event.target.getAttribute("id");
    modalWindow.showModal();
    getCatsById(catid);
  }
});

//Закрытие модального окна при нажатии на кнопку закрыть
btnClose.addEventListener("click", () => {
  deleteClassActive();
  modalWindow.close();
  location.reload();
});

// Кнопка Редактирование и сохранение кота по ID
btnEdit.addEventListener("click", () => {
  switch (btnEdit.innerHTML) {
    case "Редактировать":
      addClassActive();
      btnEdit.innerHTML = "Сохранить изменения";
      message.innerHTML = "";
      break;
    case "Сохранить изменения":
      changeCatById();
      deleteClassActive();
      btnEdit.innerHTML = "Редактировать";
      break;
    case "Сохранить":
      btnEdit.innerHTML = "Редактировать";
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
          localStorage.clear()
      }
      break;
  }
});

//Кнопка Добавить кота
document.getElementById("btnAdd").addEventListener("click", () => {
  modalWindow.showModal();
  btnEdit.innerHTML = "Сохранить";
  favorite.selectedIndex = 1;
  namecat.disabled = false;
  namecat.classList.add("active");
  addClassActive();
  fetch("https://cats.petiteweb.dev/api/single/g-alexey22/show/")
    .then((Response) => Response.json())
    .then((cats) => {
      id.value = cats[cats.length - 1].id + 1;
      readingDataFromLS();
      modalImg.style.backgroundImage = `url(${image.value})`;
    });
});

//Кнопка Удалить кота
btnDelete.addEventListener("click", () => {
  const arrayOfCard = document.querySelectorAll(".card-delete");
  switch (btnDelete.innerHTML) {
    case "Удалить":
      btnAdd.disabled = true;
      for (const item of arrayOfCard) {
        item.style.display = "block";
      }
      btnDelete.style.width = "200px";
      setTimeout(() => {
        btnDelete.innerHTML = "Отменить удаление";
      }, 500);
      break;
    case "Отменить удаление":
      btnAdd.disabled = false;
      for (const item of arrayOfCard) {
        item.style.display = "none";
      }
      btnDelete.innerHTML = "Удалить";
      btnDelete.style.width = "100px";
      break;
  }
});

//Удаление кота при нажатии на карточку
main.addEventListener("click", (event) => {
  if (event.target.classList.contains("card-delete")) {
    const catId = event.target.closest(".card").getAttribute("id");

    fetch("https://cats.petiteweb.dev/api/single/g-alexey22/delete/" + catId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())

      .then((answer) => {
        event.target.firstElementChild.style.color = "green";
        event.target.firstElementChild.innerHTML = answer.message;
        event.target.lastElementChild.setAttribute(
          "src",
          "icons/trash-limegreen.svg"
        );

        setTimeout(() => {
          document.getElementById(catId).classList.add("hide");
          setTimeout(() => {
            document.getElementById(catId).remove();
          }, 1000);
        }, 1500);
      })
      .catch(
        (answer) => (event.target.firstElementChild.innerHTML = answer.message)
      );
  }
});

//Функция удаления класса Active
function addClassActive() {
  const s = document.querySelectorAll("select");
  const t = document.querySelectorAll("textarea");
  const all = [...s, ...t];
  for (const item of all) {
    item.disabled = false;
    item.classList.add("active");
  }
}
//Функция добавления класса Active
function deleteClassActive() {
  const s = document.querySelectorAll("select");
  const t = document.querySelectorAll("textarea");
  const all = [...s, ...t];
  for (const item of all) {
    item.disabled = true;
    item.classList.remove("active");
  }
}

//Автообновление изображения в карточке
image.addEventListener("input", (event) => {
  modalImg.style.backgroundImage = `url(${image.value})`;
});

//Запись данных с формы в LocalStorage
const myForm = document.getElementById("modal-form");
let formData = {
  namecat: "",
  favorite: false,
  rate: rate.value,
  age: age.value,
  description: "",
  image: "",
};
myForm.addEventListener("input", (event) => {
  formData[event.target.id] = event.target.value;
  localStorage.setItem("formData", JSON.stringify(formData));
});

//Чтение данных из LocalStore
function readingDataFromLS() {
  if (localStorage.getItem("formData")) {
    formData = JSON.parse(localStorage.getItem("formData"));
    for (const key in formData) {
      myForm.elements[key].value = formData[key];
    }
    message.innerHTML = "Поля заполнены из Local Storage";
  }
}
