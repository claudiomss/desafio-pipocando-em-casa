const TMDB_ENDPOINT_BASE = "https://api.themoviedb.org/3"
const API_KEY = "0d5bdd0c7a8fbfbbadb64504fe438e98"

function MostraFilmesEmCartaz() {
  $.ajax({
    // url: TMDB_ENDPOINT_BASE + "/movie/now_playing?language=pt",
    url: TMDB_ENDPOINT_BASE + "/movie/now_playing",
    data: {
      api_key: API_KEY,
    },
  }).done(function (data) {
    let codigo_html = ""

    for (i = 0; i < 8; i++) {
      titulo = data.results[i].title
      imagem = "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path
      descricao = data.results[i].overview
      codigo_html += `     
            <div class="col-md-3 p-3 d-flex flex-column align-items-center">
  <img id="img-destaque" src="${imagem}" class="img-fluid">
  <div class="card-body mt-1 p-2 ">
    <h4 class="card-title">${titulo}</h4>
    <p class="card-text text-justify">
      ${descricao}
    </p>
  </div>
</div> `
    }
    $("#film").html(codigo_html)
  })
}

function buscarTodosGeneros() {
  return $.ajax({
    url: TMDB_ENDPOINT_BASE + "/genre/movie/list?language=pt",
    data: {
      api_key: API_KEY,
    },
  }).done(function (data) {
    let generos = []

    for (i = 0; i < data.genres.length; i++) {
      id = data.genres[i].id
      nome = data.genres[i].name
      generos.push({ id, nome })
    }
    // console.log(generos)
    return generos
  })
}

function carregarTodosGeneros() {
  let codigo_html = ""
  buscarTodosGeneros().then(({ genres }) => {
    // console.log(genres)

    for (i = 0; i < genres.length; i++) {
      id = genres[i].id
      nome = genres[i].name
      codigo_html += `<option value=${id}>${nome}</option>`
    }

    full_code_html =
      '<option value="" selected>Categoria: TODOS</option>' + codigo_html
    $("#theme").html(full_code_html)
  })
}

function buscarGeneroFilme() {
  let codigo_html = ""
  buscarTodosGeneros().then(({ genres }) => {
    // console.log(genres)

    for (i = 0; i < genres.length; i++) {
      id = genres[i].id
      nome = genres[i].name
      codigo_html += `<option value=${id}>${nome}</option>`
    }

    full_code_html =
      '<option  value="101010" selected>Categoria: TODOS</option>' + codigo_html
    $("#theme").html(full_code_html)
  })
}

function mostraFilmesPorFiltro(id) {
  $.ajax({
    url: TMDB_ENDPOINT_BASE + `/discover/movie?with_genres=${id}&language=pt`,
    data: {
      api_key: API_KEY,
    },
  }).done(function (data) {
    let codigo_html = ""

    for (i = 0; i < 8; i++) {
      titulo = data.results[i].title
      imagem = "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path
      descricao = data.results[i].overview
      codigo_html += `     
        <div class="col-md-3 p-3">
          <img src=${imagem} class="img-fluid">
          <div class="card-body mt-1 p-2">
            <h4 class="card-title">${titulo}</h4>
            <p class="card-text text-justify">
            ${descricao}
            </p>
          </div>
        </div>   `
    }
    $("#film").html(codigo_html)
  })
}

function mostraFilmesPorPalavra(palavra) {
  $.ajax({
    url: TMDB_ENDPOINT_BASE + `/search/movie?query=${palavra}&language=pt-br`,
    data: {
      api_key: API_KEY,
    },
  }).done(function (data) {
    let codigo_html = ""

    for (i = 0; i < data.results.length; i++) {
      titulo = data.results[i].title
      imagem = "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path
      descricao = data.results[i].overview
      codigo_html += `     
        <div class="col-md-3 p-3">
          <img src=${imagem} class="img-fluid">
          <div class="card-body mt-1 p-2">
            <h4 class="card-title">${titulo}</h4>
            <p class="card-text text-justify">
            ${descricao}
            </p>
          </div>
        </div>   `
    }
    $("#film").html(codigo_html)
  })
}

const buscarGeneroPeloID = (array, valor) => array.includes(valor)

function mostraFilmesPorFiltroEPalavra(id, palavra) {
  $.ajax({
    url: TMDB_ENDPOINT_BASE + `/discover/movie?with_genres=${id}&language=pt`,
    data: {
      api_key: API_KEY,
    },
  }).done(function (data_id) {
    $.ajax({
      url: TMDB_ENDPOINT_BASE + `/search/movie?query=${palavra}&language=pt-br`,
      data: {
        api_key: API_KEY,
      },
    }).done(function (data) {
      let codigo_html = ""
      let resultado = ""

      for (i = 0; i < data.results.length; i++) {
        titulo = data.results[i].title
        imagem = "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path
        descricao = data.results[i].overview
        genero = data.results[i].genre_ids

        resultado = buscarGeneroPeloID(genero, Number(id))

        if (resultado || id == "") {
          codigo_html += `     
          <div class="col-md-3 p-3">
            <img src=${imagem} class="img-fluid">
            <div class="card-body mt-1 p-2">
              <h4 class="card-title">${titulo}</h4>
              <p class="card-text text-justify">
              ${descricao}
              </p>
            </div>
          </div>   `
        }
      }
      $("#film").html(codigo_html)
    })
  })
}

function filmesEmBreve() {
  $.ajax({
    url: TMDB_ENDPOINT_BASE + "/movie/upcoming",
    data: {
      api_key: API_KEY,
    },
  }).done(function (data) {
    let codigo_html = ""

    for (i = 0; i < 4; i++) {
      titulo = data.results[i].title
      imagem = "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path
      descricao = data.results[i].overview
      popularidade = parseFloat(data.results[i].popularity).toFixed(0)

      lancamento = data.results[i].release_date
      const [ano, mes, dia] = lancamento.split("-")
      const dataFormatada = `${dia}/${mes}/${ano}`

      codigo_html += `
      <div class="carousel-item">
      <div class="container">
        <div class="row">
          <div class="col-8">
            <h5 class="card-title text-light"><strong>${titulo}</strong></h5>
            <p class="card-text-2 text-light">${descricao}</p>

            <p class="card-text-2 text-light">
              <strong>Estreia:</strong> ${dataFormatada}
            </p>

            <p class="card-text-2 mr-1 text-light">
              <strong>Avaliação:</strong> ${popularidade} pontos
            </p>
          </div>

          <div class="col-4">
            <img class="img-fluid" src=${imagem}></img>
          </div>
        </div>
      </div>
    </div>    
      `
    }

    $("#carousel-add").html(codigo_html)
    $(".carousel-item:first").addClass("active")
  })
}

function avaliacao() {
  $.ajax({
    url: TMDB_ENDPOINT_BASE + "/movie/912649/reviews",
    data: {
      api_key: API_KEY,
    },
  }).done(function (data) {
    let codigo_html = ""

    for (i = 0; i < 3; i++) {
      author = data.results[i].author
      imagem =
        "https://image.tmdb.org/t/p/w500" +
        data.results[i].author_details.avatar_path
      avaliacao = data.results[i].author_details.rating
      descricao = data.results[i].content

      data_ultimo_post = data.results[i].updated_at
      const data_post = new Date(data_ultimo_post)

      const dia = String(data_post.getUTCDate()).padStart(2, "0")
      const mes = String(data_post.getUTCMonth() + 1).padStart(2, "0") // Meses começam em 0
      const ano = data_post.getUTCFullYear()

      const dataFormatada = `${dia}/${mes}/${ano}`

      codigo_html += `
        <div style="padding-top: 3rem" class="container-avaliacao">   
        <div class="container">
        <div class="row">
         <div class="col-4">
          <div  class="">
            <img  width="70px" src=${imagem}class="img-fluid">
          </div>
            </div>
             <div class="col">
          <div class="body-text">
            <h4 class="card-title">${author}</h4>
            <p class="card-text"><b>Review: </b>${descricao}
            </p>
            <p class="text-primary">
            <b>
            Avaliação:
            ${parseFloat(avaliacao).toFixed(1)} 
            </b>

            <p class="card-subtitle text-muted">
               <b>
            ${dataFormatada}
             </b>
            </p>
            </p>
          </div> 
           </div>
          </div>
          </div>
      </div> 
     
      `
    }

    $("#avaliacao").html(codigo_html)
  })
}

$(document).ready(function () {
  MostraFilmesEmCartaz()
  carregarTodosGeneros()
  filmesEmBreve()
  avaliacao()

  $("#theme").change(function () {
    const id = $(this).val()
    const palavra = $("#search-input").val()

    if (palavra == "" || (palavra.length > 0) & (palavra.length < 4)) {
      mostraFilmesPorFiltro(id)
    } else {
      mostraFilmesPorFiltroEPalavra(id, palavra)
    }
  })

  $("#buscar-palavra").click(function (event) {
    event.preventDefault()
    $("#theme").val("")

    const palavra = $("#search-input").val()

    if (palavra == "") {
      alert("Por favor, insira uma palavra.")
      return
    } else if ((palavra.length > 0) & (palavra.length < 4)) {
      alert("Por favor, digite pelo menos 4 caracteres")
      return
    }

    const path = window.location.pathname

    if (path != "/destaques") {
      window.location.href = `/destaque/?query=${encodeURIComponent(palavra)}`
    } else mostraFilmesPorPalavra(palavra)
  })
})
