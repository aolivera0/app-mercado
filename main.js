const btnAgregar = document.querySelector("#btn-agregar")
const btnCancelar = document.querySelector("#btn-cancelar")
const btnEliminar = document.querySelector("#btn-eliminar")
const btnLimpiarTodo = document.querySelector("#btn-limpiar-todo")
const btnReiniciar = document.querySelector("#btn-reiniciar")
const item = document.querySelector("#item")
const precio = document.querySelector("#precio")
const categoria = document.querySelector("#categoria")
const almacen = document.querySelector("#almacen")
const prioridad = document.querySelector("#prioridad")
const data = document.querySelector("#data")
const tableBody = document.querySelector("#tableBody")
const warning = document.querySelector("#warning")
const comprados = document.querySelector("#comprados")
const tableCompradosBody = document.querySelector("#tableCompradosBody")
const totalGastado = document.querySelector("#totalGastado")

window.addEventListener('load', ()=>{
    items = []
    itemComprados = []
    try {
        items = JSON.parse(localStorage.getItem('items'))
        itemComprados = JSON.parse(localStorage.getItem('itemComprados'))
        imprimirData()
    } catch (e){
        console.log(e)
        localStorage.setItem('items', items)
        localStorage.setItem('itemComprados', itemComprados)
    }
})

function handleAgregar(e) {
  e.preventDefault()

  if (item.value == "" || precio.value == "" || categoria.value == "" || almacen.value == "" || prioridad.value == "") {
    warning.innerText = "Por favor complete todos los campos"
    warning.classList.remove("hidden")
    setTimeout(() => {
      warning.innerText = " "
      warning.classList.add("hidden")
    }, 2500)

    return
  }

  warning.innerText = " "
  warning.classList.add("hidden")

  const nuevoItem = {
    nombre: item.value,
    precio: parseInt(precio.value),
    categoria: categoria.value,
    almacen: almacen.value,
    prioridad: prioridad.value,
    adquirido: false,
  }

  const position = items.findIndex(item => item.nombre == nuevoItem.nombre)
  if (position < 0) {
    items.push(nuevoItem)
  } else {
    items[position].precio = nuevoItem.precio
    items[position].categoria = nuevoItem.categoria
    items[position].almacen = nuevoItem.almacen
    items[position].prioridad = prioridad.value
  }

  updateData()
  imprimirData()
  resetFields()
}

function updateData() {
  localStorage.setItem('items', JSON.stringify(items))
  itemComprados = items.filter((item) => item.adquirido)
  localStorage.setItem('itemComprados', JSON.stringify(itemComprados))
}

function handleCheckbox(e) {
  items.forEach((item) => {
    if (item.nombre == e.target.id) {
      item.adquirido = !item.adquirido
      if (!itemComprados.includes(item) && item.adquirido) {
        itemComprados.push(item)
      } else {
        let elementoParaBorrar = itemComprados.findIndex(itemComprado => item.nombre == itemComprado.nombre)
        itemComprados[elementoParaBorrar].adquirido = false
      }

      itemComprados = itemComprados.filter((item) => item.adquirido)
      console.log(itemComprados)
      console.log(items)
    }
  })

  //console.log(e.target.id)
  //console.log(items)
  localStorage.setItem('items', JSON.stringify(items))
  localStorage.setItem('itemComprados', JSON.stringify(itemComprados))
  imprimirData()
}

function imprimirData() {
  let valorTotalGastado = 0
  tableBody.innerHTML = ""
  tableCompradosBody.innerHTML = ""
  items.forEach(item => {
    tableBody.innerHTML += `<tr>
          <td class="centered"> <input type="checkbox" id="${item.nombre}" ${item.adquirido ? "checked" : ""}/> </td>
          <td>${item.nombre}</td>
          <td class="precio">${item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: "0" })}</td>
          <td> <span class="categoria categoria__${item.categoria.toLowerCase()}">${item.categoria}</span></td>
          <td> <span class="almacen almacen__${item.almacen.toLowerCase()}">${item.almacen}</span></td>
          <td> <span class="label label__${item.prioridad.toLowerCase()}">${item.prioridad}</span></td>
          <td> <button class="btn btn-editar" id="${item.nombre}" style="opacity:0.50">⚙️</button></td>
        </tr>`
  })
  const checkboxes = tableBody.querySelectorAll("input[type='checkbox']")
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => handleCheckbox(e))
  })

  const botonesEditar = tableBody.querySelectorAll("td button")
  botonesEditar.forEach(boton => {
    boton.addEventListener('click', (e) => handleButtonEditar(e))
  })

  totalGastado.innerHTML = ""
  itemComprados.forEach(item => {
    valorTotalGastado += item.precio
    tableCompradosBody.innerHTML += `<tr>
          <td>${item.nombre}</td>
          <td>${item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: "0" })}</td>
          <td> <span class="categoria categoria__${item.categoria.toLowerCase()}">${item.categoria}</span></td>
          <td> <span class="almacen almacen__${item.almacen.toLowerCase()}">${item.almacen}</span></td>
          <td> <span class="label label__${item.prioridad.toLowerCase()}">${item.prioridad}</span></td>
        </tr>`
  })

  totalGastado.innerHTML = valorTotalGastado.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: "0" })
}

function handleButtonEditar(e) {
  const itemParaEditar = items.find(item => item.nombre == e.target.id)

  item.value = itemParaEditar.nombre
  item.setAttribute("disabled", true)
  precio.value = itemParaEditar.precio
  categoria.value = itemParaEditar.categoria
  almacen.value = itemParaEditar.almacen
  prioridad.value = itemParaEditar.prioridad

  btnCancelar.classList.remove("hidden")
  btnEliminar.classList.remove("hidden")
}

function handleButtonCancelar(e) {
  e.preventDefault()
  resetFields()
}

function handleButtonEliminar(e) {
  e.preventDefault()
  items = items.filter(itemIterado => itemIterado.nombre != item.value)

  updateData()
  imprimirData()
  resetFields()
}
function handleButtonLimpiarTodo() {
  items = []
  itemComprados = []
  localStorage.setItem('items', JSON.stringify([]))
  localStorage.setItem('itemComprados', JSON.stringify([]))

  items = JSON.parse(localStorage.getItem('items'))
  itemComprados = JSON.parse(localStorage.getItem('itemComprados'))

  imprimirData()
  resetFields()
}
function handelButtonValoresIniciales() {
  items = []
  itemComprados = []
  let itemsIniciales = [{
    nombre: "Jabón",
    precio: 1500,
    categoria: "Aseo",
    almacen: "Ara",
    prioridad: "Importante",
    adquirido: false,
  }, {
    nombre: "Leche",
    precio: 21000,
    categoria: "Nevera",
    almacen: "Ara",
    prioridad: "Importante",
    adquirido: false,
  }, {
    nombre: "Avena",
    precio: 6500,
    categoria: "Alacena",
    almacen: "Ara",
    prioridad: "Importante",
    adquirido: false,
  }, {
    nombre: "Jamón",
    precio: 12000,
    categoria: "Nevera",
    almacen: "D1",
    prioridad: "Importante",
    adquirido: false,
  }, {
    nombre: "Bananos",
    precio: 8000,
    categoria: "Verduras",
    almacen: "Otro",
    prioridad: "Baja",
    adquirido: false,
  }]
  let itemCompradosIniciales = []


  localStorage.setItem('items', JSON.stringify(itemsIniciales))
  localStorage.setItem('itemComprados', JSON.stringify(itemCompradosIniciales))

  items = JSON.parse(localStorage.getItem('items'))
  itemComprados = JSON.parse(localStorage.getItem('itemComprados'))

  imprimirData()
  resetFields()
}

function resetFields() {
  item.value = ""
  item.removeAttribute("disabled")
  precio.value = ""
  categoria.value = ""
  almacen.value = ""
  prioridad.value = ""

  btnCancelar.classList.add("hidden")
  btnEliminar.classList.add("hidden")
}

btnAgregar.addEventListener('click', (e) => { handleAgregar(e) })
btnCancelar.addEventListener('click', (e) => handleButtonCancelar(e))
btnEliminar.addEventListener('click', (e) => handleButtonEliminar(e))
btnLimpiarTodo.addEventListener('click', (e) => handleButtonLimpiarTodo(e))
btnReiniciar.addEventListener('click', (e) => handelButtonValoresIniciales(e))
