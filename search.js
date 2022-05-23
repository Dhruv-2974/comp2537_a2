type_g = ""
pokemon_name = ""
pokemon_photo = ""
pokemon_id = ""
nameOrId = "";

button_code = "<button class = 'remove_class'> Remove me!</button>";


function find_type(type) {
    to_add = "";
    $("main").empty();


    fetch("pokemon.json")
        .then((response) => response.json())
        .then((data) => {
            console.log(data.name);
            to_add += `<div class="poke_name"><p>${data.name}<p/></div>
  <br>
   <div class="image_container"> 
   <a href="/profile/${data.id}">
   <img src="${data.sprites.other["official-artwork"].front_default}"> 
   </a>
   </div>`;
            $("main").html(to_add);
        });
}

async function load_all() {
    show_pokemon = ""

    fetch("pokemon.json")
        .then((response) => response.json())
        .then((data) => {
            console.log(data.name);
            show_pokemon += `<div class="poke_name"><p>${data.name}<p/></div>
    <br>
     <div class="image_container"> 
     <a href="/profile/${data.id}">
     <img src="${data.sprites.other["official-artwork"].front_default}"> 
     </a>
     </div>`;
            $("main").html(show_pokemon);
        });
}

async function show_searched_pokemon(data) {
    $("main").empty(show_pokemon);

    console.log(data);
    show_pokemon = ""


    find_photo(data);

    show_pokemon += `<div class='image_container'> <a href="/profile/${pokemon_id}"> ${pokemon_name} <img src="${pokemon_photo}"></a> </div>`

    $("main").html(show_pokemon);

}


function insert_profile_event_to_timeline(nameOrID) {
    var now = new Date(Date.now());
    var formatted =
        now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    jQuery.ajax({
        url: "http://localhost:5000/timeline/insert",
        type: "put",
        data: {
            text: `The user has clicked on a Pokemon's profile.`,
            time: `${now}`,
            hits: 1,
        },
        success: function (r) {
            console.log(r);
        },
    });
}

function insert_search_event_to_timeline(nameOrID) {
    var now = new Date(Date.now());
    var formatted =
        now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    jQuery.ajax({
        url: "http://localhost:5000/timeline/insert",
        type: "put",
        data: {
            text: `The user has searched the ${nameOrID} pokemon.`,
            time: `${now}`,
            hits: 1,
        },
        success: function (r) {
            console.log(r);
        },
    });
}


function insert_filter_event_to_timeline(poke_type) {
    var now = new Date(Date.now());
    var formatted =
      now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    jQuery.ajax({
      url: "http://localhost:5000/timeline/insert",
      type: "put",
      data: {
        text: `The user has filter the pokemon by the ${poke_type} type.`,
        time: `${now}`,
        hits: 1,
      },
      success: function (r) {
        console.log(r);
      },
    });
}


function search_pokemon() {

    nameOrID = $("#searchByNameOrID").val();

    history_remove = "<p>" + nameOrID + button_code + "</p>"

    load_all();

    insert_search_event_to_timeline(nameOrID);

    jQuery("#history").append(history_remove)


}

function hide_() {
    $(this).parent().remove();
}

function setup() {
    load_all()
    $("#pokemon_type").change(() => {
        poke_type = $("#pokemon_type option:selected").val();
        find_type(poke_type)
        insert_filter_event_to_timeline(poke_type);

    })
    $("body").on("click", "#search", search_pokemon);
    jQuery('body').on('click', '.remove_class', hide_)
    $("body").on("click", ".image_container", insert_profile_event_to_timeline);

}

$(document).ready(setup)