function iniciarApp(){

  const categoriesSelect = document.querySelector("#categorias");
  const result = document.querySelector("#resultado");
  const modal = new bootstrap.Modal('#modal',{});

  if(categoriesSelect){
    categoriesSelect.addEventListener("change",selectCategory);
    searchCategories()
   }

   


  const favorites = document.querySelector(".favoritos");
  if(favorites){
   getFavorite()
  }
  

  //Consultar y atraer info de la api

  function searchCategories(){
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php"
    fetch(url)
      .then(respons =>{
          return respons.json()
      })
      .then(result =>{
        viewCategories(result.categories);
      })
      
  }


  function viewCategories(categories){
     categories.forEach(category => {
        const {strCategory} = category;
        const option = document.createElement("OPTION");
        option.value = strCategory;
        option.textContent = strCategory;
        categoriesSelect.appendChild(option)
    });
  }

  function selectCategory(e){
    const category = e.target.value
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`

    fetch(url)
      .then (respons => respons.json())
      .then (result => renderCategory(result.meals));
  }


  function renderCategory(category){

    clearHtml(result)

    const message = document.createElement("H2")
    message.classList.add("text-center","text-black","my-5");
    message.textContent = category.length ? "Recetas" : "No hay Recetas"
    result.appendChild(message)

      category.forEach(recipe => {
      const {strMeal,strMealThumb,idMeal} = recipe
      const recipeContainer = document.createElement("DIV");
      recipeContainer.classList.add("col-md-4");

      const recipeCard = document.createElement("Div");
      recipeCard.classList.add("card","mb-4");

      const imgCard = document.createElement("iMG");
      imgCard.classList.add("card-img-top");
      imgCard.alt = `imagen de la receta ${strMeal ?? recipe.title}`;
      imgCard.src = strMealThumb ?? recipe.img;

      const recipeBody = document.createElement("DIV");
      recipeBody.classList.add("card-body");

      const recipeHeading = document.createElement("H3");
      recipeHeading.classList.add("card-title")
      recipeHeading.textContent = strMeal ?? recipe.title;

      const recipeButton = document.createElement("Button");
      recipeButton.classList.add("btn","btn-danger","w-100");
      recipeButton.dataset.bsTarget = "#modal" 
      recipeButton.dataset.bsToggle = "modal"
      recipeButton.textContent = "Ver receta"
      recipeButton.onclick = function(){
        consultRecipe(idMeal ?? recipe.id);
       
        
    }

    // introduciendolo al dom

    recipeBody.appendChild(recipeHeading);
    recipeBody.appendChild(recipeButton);

    recipeCard.appendChild(imgCard)
    recipeCard.appendChild(recipeBody)
    recipeContainer.appendChild(recipeCard)
    
    result.appendChild(recipeContainer)
    });
    
  }

  function consultRecipe(id){
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`

    fetch(url)
      .then (respons => respons.json())
      .then (result => viewRecipe(result.meals[0]))
     
      
  }

  function viewRecipe(result){
  
  const {strMeal,strMealThumb,strInstructions,strIngredient,idMeal} = result
  const titleModal = document.querySelector(".modal-title");
  const contentModal = document.querySelector(".modal-body");

  contentModal.innerHTML = `<img class="img-fluid "src="${strMealThumb}" alt="receta de ${strMeal}">
                            <h3 class="my-3"> Instruciones</h3>
                            <p>${strInstructions}</p>
                            <h3 class="my-3"> Ingredientes y cantidades</h3>
                            `
  titleModal.textContent = strMeal

  const listContent = document.createElement("UL")
  listContent.classList.add("list-group")
  contentModal.appendChild(listContent);

  for (let i = 1; i <= 20; i++) {
    if(result[`strIngredient${i}`]){
      const ingrediente = (result[`strIngredient${i}`]);
      const cantidad = (result[`strMeasure${i}`])

      const li = document.createElement("LI");
      li.classList.add("list-group-item");
      li.textContent = `${ingrediente} / ${cantidad}`
      listContent.appendChild(li)
    }
    
  }
  //Crear botones
 
  const modalFooter = document.querySelector(".modal-footer")
  clearHtml(modalFooter);

  const btnFav = document.createElement("BUTTON");
  btnFav.classList.add("btn","btn-danger","col");
  btnFav.textContent= isLocalStorage(idMeal) ? "Eliminar Favorito" : "Agregar favorito";
  modalFooter.appendChild(btnFav);
  btnFav.onclick= function(){

    if(isLocalStorage(idMeal)){
      deleteFav(idMeal)
      btnFav.textContent = "Agregar favorito"
        setTimeout(() => {
        location.reload()
      }, 1000);
      openToast("Eliminado Correctamente")
    
      return
    }
      
     addFav(
      {
        id:idMeal,
        title:strMeal,
        img:strMealThumb
      }
      
    )
    btnFav.textContent = "Eliminar favorito"
    openToast("Guardado Correctamente")
   
   
  }
  
  const btnClose = document.createElement("BUTTON");
  btnClose.classList.add("btn","btn-dark","col");
  modalFooter.appendChild(btnClose);
  btnClose.textContent= "cerrar"
  btnClose.onclick = function(){
    modal.hide();

  }

  

    modal.show()
  }


  function addFav(recipeFav){
    const fav = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    localStorage.setItem("favoritos",JSON.stringify([...fav,recipeFav]));
 

  }

  function isLocalStorage(id){
    const fav = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    return fav.some(fav => fav.id === id)
  }

  function deleteFav(id){
    const fav = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    
    const newFav = fav.filter(recipe => recipe.id !== id)
    localStorage.setItem("favoritos",JSON.stringify(newFav))
  }

  function openToast (message){
    const toastContain = document.querySelector("#toast");
    const toastBody = document.querySelector(".toast-body");
    const toast = new bootstrap.Toast(toastContain);
    toastBody.textContent = message
    toast.show()
  }

  function getFavorite (){

    const fav = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    if(fav.length){

     
      renderCategory(fav)
      return
    }
   
    // No hay favoritos
    const noFav = document.createElement("P");
    noFav.classList.add("fs-4","text-center");
    noFav.textContent = "No hay recetas favoritas"
    result.appendChild(noFav)
  }


  function clearHtml(select){
    while(select.firstChild){
      select.removeChild(select.firstChild);
    }
  }
}



document.addEventListener("DOMContentLoaded", iniciarApp)