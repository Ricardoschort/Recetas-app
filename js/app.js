function iniciarApp(){

  const categoriesSelect = document.querySelector("#categorias");
  categoriesSelect.addEventListener("change",selectCategory)

  //Consultar y atraer info de la api
  searchCategories()
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
    
  }
}



document.addEventListener("DOMContentLoaded", iniciarApp)