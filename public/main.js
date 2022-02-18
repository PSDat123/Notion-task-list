(() => {
  const cardCreators = document.querySelectorAll(".card-create");
  const modal = document.querySelector(".modal")
  cardCreators.forEach((cardCreator) =>
    cardCreator.addEventListener("click", (event) => modal.classList.toggle("hidden"))
  );
  modal.addEventListener("click", (event) => {
    if(event.target.className == "modal"){
      modal.classList.toggle("hidden");
    }
  });
})();