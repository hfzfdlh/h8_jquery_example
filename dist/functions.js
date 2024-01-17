

function doLogin(email,password,BASE_URL){
$.ajax(`https://${BASE_URL}/login`,{
        // url:,
        method:'POST',
        data:{
            email,
            password
        }
        })
        .done((res)=>{
        console.log(res)
        localStorage.setItem('access_token',res.access_token)
        localStorage.setItem('role',res.role)
        localStorage.setItem('id',res.id)
        Swal.fire({
            icon:'success',
            title: 'Login Successful'}
           )
        dashboardView(BASE_URL)
        })
        .fail((err)=>{
        Swal.fire({
          icon :'error',
          title:'Error',
          text:`${err.responseJSON.message}`
        })
        console.log(err.responseJSON.message)
        //update dengan soft alert
        })
}

function addProduct(name,categoryId,description,stock,price,imgUrl,BASE_URL){
    $.ajax(`https://${BASE_URL}/products`,{
        method:'POST',
        headers:{
            access_token:localStorage.getItem("access_token"),
          },
        data:{
            name,categoryId,description,stock,price,imgUrl
        }
    })
    .done((res)=>{
        console.log(res)
        Swal.fire({
            icon:'success',
            title: 'Add Product Successful'}
           )
        productView()

    })
    .fail(err=>{
        Swal.fire({
            icon :'error',
            title:'Error',
            text:`${err.responseJSON.message}`
          })
        console.log(err.responseJSON.message)
    })
}

function addUser(email,password,BASE_URL){
    $.ajax(`https://${BASE_URL}/register`,{
        method:'POST',
        headers:{
            access_token:localStorage.getItem("access_token"),
          },
        data:{
            email,password
        }
    })
    .done((res)=>{
        console.log(res)
        $('#register-username').val('')
        $('#register-email').val('')
        $('#register-password').val('')
        $('#register-phone').val('')
        $('#register-address').val('')
        Swal.fire({
            icon:'success',
            title: 'User Registered'}
           )
        loginView()

    })
    .fail(err=>{
        Swal.fire({
            icon :'error',
            title:'Error',
            text:`${err.responseJSON.message}`
          })
        console.log(err.responseJSON.message)
    })
}

function addCategory(name,BASE_URL){
    $.ajax(`https://${BASE_URL}/categories`,{
        method:'POST',
        headers:{
            access_token:localStorage.getItem("access_token"),
          },
        data:{
            name
        }
    })
    .done((res)=>{
        console.log(res)
        Swal.fire({
            icon:'success',
            title: 'Added Category Successful'}
           )
        categoryView()

    })
    .fail(err=>{
        Swal.fire({
            icon :'error',
            title:'Error',
            text:`${err.responseJSON.message}`
          })
        console.log(err.responseJSON.message)
    })
}

function fetchProduct(BASE_URL){
    $.ajax(`https://${BASE_URL}/products`,{
      method:'GET',
      headers:{
        access_token:localStorage.getItem("access_token"),
      }
    })
    .done((data)=>{
      let replaceTable = ''
        
      data.forEach((el,index)=>{
        replaceTable+=`
        <tr>
          <td scope="row">#${index+1}</td>
          <td class="fw-bold">${el.name}</td>
          <td>
            <img
              src="${el.imgUrl}"
              class="img-fluid"
            />
          </td>
          <td>${el.description}</td>
          <td>${el.stock}</td>
          <td class="fw-bold">Rp.${numberWithDot(el.price)}</td>
          <td>${el.User.email}</td>
          
        ` 

        if (localStorage.role ==="Admin"){
            replaceTable+=` <td>
            <a href='#' class="ms-3" onclick="deleteProduct(${el.id})"
              ><span
                class="icon material-symbols-outlined text-danger"
                >delete</span
              ></a>
          </td>
        </tr>`
        } else if(localStorage.role==="Staff"){
            if(Number(localStorage.id) === el.User.id){
                replaceTable+=` <td>
            <a href='#' class="ms-3 " onclick="deleteProduct(${el.id})"><span
                class="icon material-symbols-outlined text-danger"
                >delete</span
              ></a>
          </td>
        </tr>`
            } else{
                replaceTable+='</tr>'
            }
        }
        })
        
        $('#table-product').html(replaceTable)
      
    })
    .fail(err=>{
        console.log(err.responseJSON.message)
  })}

    function deleteProduct(id){
      console.log(BASE_URL)
        $.ajax({
            url:`https://${BASE_URL}/products/${+id}`,
            type:'DELETE',
            headers:{
                access_token:localStorage.access_token
            }
        })
        .done(res=>{
            Swal.fire({
                icon:'success',
                title: `${res.message}`}
               )
            productView()
        })
        .fail(err=>{
            Swal.fire({
                icon :'error',
                title:'Error',
                text:`${err.responseJSON.message}`
              })
            console.log(err.responseJSON.message)
        })
    }

  function fetchCategories(BASE_URL){
    $.ajax(`https://${BASE_URL}/categories`,{
      method:'GET',
      headers:{
        access_token:localStorage.getItem("access_token"),
      }
    })
    .done((data)=>{
      let replaceTable = ''

      data.forEach((el,index)=>{
        replaceTable+=`
        <tr>
              <td scope="row">#${index+1}</td>
              <td class="fw-bold">${el.name}</td>
              <td>
                <a  class="ms-3" onclick="deleteCategory(${el.id})"
                  ><span
                    class="icon material-symbols-outlined text-danger"
                    >delete</span
                  ></a
                >
              </td>
            </tr>
        `

        $('#table-category').html(replaceTable)
      })
    })
    .fail(err=>{
        console.log(err.responseJSON.message)
    })
  }

  function deleteCategory(id,BASE_URL){
    console.log('deleteeteteet')
    $.ajax({
        url:`https://${BASE_URL}/categories/${+id}`,
        type:'DELETE',
        headers:{
            access_token:localStorage.access_token
        }
    })
    .done(res=>{
        Swal.fire({
            icon:'success',
            title: `Category ${res.name} Deleted`}
           )
        categoryView()
    })
    .fail(err=>{
        Swal.fire({
            icon :'error',
            title:'Error',
            text:`${err.responseJSON.message}`
          })
        console.log(err.responseJSON.message)
    })
}

  function getAddProduct(BASE_URL){
    $.ajax(`https://${BASE_URL}/categories`,{
        method:'GET',
        headers:{
            access_token:localStorage.getItem("access_token"),
          }
    })
    .done(res=>{

        let replaceDrop = ` <option value="" selected disabled>
        -- Select Category --
      </option>`

        res.forEach(el=>{
           replaceDrop+=`
                    <option value="${el.id}">${el.name}</option>
                    `
        })

        $('#login-section').hide()
        $('#home-section').show()
        $('#dashboard-section').hide()
        $('#product-section').hide()
        $('#new-product-section').show()
        $('#product-category').html(replaceDrop)
        $('#category-section').hide()
        $('#new-category-section').hide()
    })


    
  }

  function loginView(){
    $('#login-section').show()
    $('#sidebar-menu').hide()
    $('#home-section').hide()
  }

  function dashboardView(){
    $('#login-section').hide()
    $('#home-section').show()
    $('#dashboard-section').show()
    $('#username').text(localStorage.role)
    getTotalProduct(BASE_URL)
    getTotalCategory(BASE_URL)
    $('#product-section').hide()
    $('#new-product-section').hide()
    $('#category-section').hide()
    $('#new-category-section').hide()
  }

  function productView(){
    $('#login-section').hide()
    $('#home-section').show()
    $('#dashboard-section').hide()
    $('#product-section').show()
    fetchProduct(BASE_URL)
    $('#new-product-section').hide()
    $('#category-section').hide()
    $('#new-category-section').hide()
  }

  function categoryView(){
    $('#login-section').hide()
    $('#home-section').show()
    $('#dashboard-section').hide()
    $('#product-section').hide()
    $('#new-product-section').hide()
    $('#category-section').show()
    fetchCategories(BASE_URL)
    $('#new-category-section').hide()
  }
  function doLogOut(){
    localStorage.clear()
    Swal.fire({
        icon:'success',
        title: `Logout Successful`}
       )
    $('#login-section').show()
    $('#home-section').hide()
  }

  function getTotalProduct(BASE_URL){
    $.ajax(`https://${BASE_URL}/products`,{
      method:'GET',
      headers:{
        access_token:localStorage.getItem("access_token"),
      }
    })
    .done((data)=>{
        const allProd = data.length

        let replaceData = `${allProd}`
        $('#total-product').html(replaceData)

    })
    .fail(err=>{
        console.log(err.responseJSON.message);
    })
  }

  function getTotalCategory(BASE_URL){
    $.ajax(`https://${BASE_URL}/categories`,{
      method:'GET',
      headers:{
        access_token:localStorage.getItem("access_token"),
      }
    })
    .done((data)=>{
        const allCat = data.length

        let replaceData = `${allCat}`
        $('#total-category').html(replaceData)

    })
    .fail(err=>{
        console.log(err.responseJSON.message);
    })
  }
  
  
  function numberWithDot(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

