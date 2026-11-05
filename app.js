var miniJSON = {"recept" : [{"name" : "Volské oko","ingredience" : [{"name" : "slaninka","obrazek" : "Images/slaninka.jpg","textik" : "Osmažíme slaninku","cas":"00:03"},{"name" : "vajicko","obrazek" : "Images/vajicko.jpg","textik" : "Rozklepneme vejce na panvičku a taky osmažíme","cas":"05:00"},{"name" : "Dokončení","obrazek" : "Images/volske_oko.jpg","textik" : "A nakonec, dle libosti, přidáme zeleninku či pečivo, Dobrou chuť!","cas":"00:03"}]},{"name" : "Špagetky","ingredience" : [{"name" : "cibulka","obrazek" : "Images/cibulka.jpg","textik" : "Nakrájíme cibulku na malé kousky a osmažíme","cas":"05:00"},{"name" : "špagetky","obrazek" : "Images/spagetky.jpg","textik" : "Dáme vařit špagety","cas":"10:00"},{"name" : "omáčka","obrazek" : "Images/omacka_na_spagety.jpg","textik" : "Přidáme na pánev s osmaženou cibulkou uzeninu a rajčatovou omáčku","cas":"03:30"},{"name" : "Dokončení","obrazek" : "Images/spagety_done.jpg","textik" : "Nandáme špagety na talíř, polejeme omáčkou z pánve a posypeme strouhaným sýrem","cas":"03:30"}]}]};
var timer, wow, pls;

function showRecipe(name) {
    clearInterval(timer);
    removeChildren("daList");
    removeChildren("mainScr");
    var sideMenuH = document.getElementById("sideMenuH");
    var button = document.getElementById("daButton");
    var zis;
    var recepty = JSON.parse(JSON.stringify(miniJSON))["recept"];
    for (var k in recepty){
        if (recepty[k]==null){
            continue;
        }
        if (recepty[k].name == name){
            sideMenuH.innerHTML = recepty[k].name;
            zis = recepty[k].ingredience[0];
            for (var l in recepty[k].ingredience){
                var tag = document.createElement("li");
                tag.className = "listElement";
                var text = document.createTextNode(recepty[k].ingredience[l].name);
                tag.appendChild(text);
                tag.setAttribute('onclick',"changeStep('" + recepty[k].ingredience[l].name + "',\""+name+"\")");
                var element = document.getElementById("daList");
                element.appendChild(tag);
            }
        }
    }

    button.setAttribute('onclick','listRecipes()');
    button.innerHTML = "Zpet na seznam receptu"
    changeStep(zis.name,name);
}

function recipeDelete(name){
    for (i in miniJSON.recept){
        if(miniJSON.recept[i].name == name){
            delete miniJSON.recept[i];
        }
    }
    listRecipes();
}

function listRecipes() {
    clearInterval(timer);
    removeChildren("daList");
    removeChildren("mainScr");

    var sideMenuH = document.getElementById("sideMenuH");
    var button = document.getElementById("daButton");
    var recepty = JSON.parse(JSON.stringify(miniJSON))["recept"];
    
    sideMenuH.innerHTML = "RECEPTY";
    for (var k in recepty){
        if (recepty[k]==null){
            continue;
        }
        var tag = document.createElement("li");
        tag.className = "listElement";
        var text = document.createTextNode(recepty[k].name);
        tag.appendChild(text);
        // tag.setAttribute('onclick',"openRecipeTab(event,'" + recepty[k].name + "')");
        tag.setAttribute('onclick',"openMainW('"+recepty[k].name+"')");

        var element = document.getElementById("daList");
        element.appendChild(tag);
    }
    button.setAttribute('onclick','addRecipe()');
    button.innerHTML = "Přidat recept"
}

function removeChildren(area) {
    var myNode = document.getElementById(area);
    while(myNode.firstChild){
        myNode.removeChild(myNode.lastChild);
    }
}

function changeStep(ingredience,name) {
    clearInterval(timer);
    var recepty = JSON.parse(JSON.stringify(miniJSON))["recept"];
    for (var k in recepty){
        if (recepty[k]==null){
            continue;
        }
        if (recepty[k].name == name){
            for (var l in recepty[k].ingredience){
                var ingredient = recepty[k].ingredience[l];
                if (ingredient.name == ingredience){
                    removeChildren("mainScr");
                    wow = k;
                    pls = l;
                    var tagNadpis = document.createElement("h2");
                    var tagObrazek = document.createElement("img");
                    var tagText = document.createElement("p");
                    var tagTime = document.createElement("p");

                    var timerino = ingredient.cas.split(':');
                    var seconds = parseInt(timerino[0])*60+parseInt(timerino[1]);
                    remain = 0;
                    remain = seconds;
                    var timeText = document.createTextNode(seconds);
                    tagTime.appendChild(timeText);
                    tagTime.setAttribute('id',"namkaCas");

                    tagNadpis.setAttribute('id',"namkaNadpis");
                    var textH = document.createTextNode(ingredient.name);
                    tagNadpis.appendChild(textH);
                    
                    tagObrazek.setAttribute('id',"namkaFotka");
                    tagObrazek.setAttribute('src',ingredient.obrazek);

                    var textT = document.createTextNode(ingredient.textik);
                    tagText.setAttribute('id',"namkaTextik");
                    tagText.appendChild(textT);

                    var element = document.getElementById("mainScr");
                    element.appendChild(tagNadpis);
                    element.appendChild(tagTime);
                    element.appendChild(tagObrazek);
                    element.appendChild(tagText);
                    timer = setInterval(function(){
                        document.body.onkeyup = function(e){
                            if(e.keyCode == 32 || e.key == ' '){
                                clearInterval(timer);
                                if (miniJSON["recept"][parseInt(wow)].ingredience.length-1 == parseInt(pls)){
                                    if (document.getElementById("namkaCas")){
                                        document.getElementById("namkaCas").innerHTML = "Vareni je hotovo";
                                    }                                                          
                                }
                                else {
                                    changeStep(recepty[parseInt(wow)].ingredience[parseInt(pls)+1].name,name);
                                }
                            }
                        }
                        if(remain <= 0){
                          clearInterval(timer);
                          if (miniJSON["recept"][parseInt(wow)].ingredience.length-1 == parseInt(pls)){
                            document.getElementById("namkaCas").innerHTML = "Vareni je hotovo";                                                          
                          }
                          else {
                            changeStep(recepty[parseInt(wow)].ingredience[parseInt(pls)+1].name,name);
                          }
                        } else {
                          document.getElementById("namkaCas").innerHTML = remain;
                        }
                        remain -= 1;
                      }, 1000);
                }
            }
        }
    }

}

// add item to the list of recipes
function addRecipe(evt){
    removeChildren("tabz");
    var i, tabC, recept
    tabC = document.getElementsByClassName("tabContent");
    var tabby = document.getElementById("tabz");
    for (i = 0; i < tabC.length; i++) {
        tabC[i].style.display = "none";
    }
    recept = document.getElementsByClassName("listElement");
    for (i = 0; i < recept.length; i++) {
        recept[i].className = recept[i].className.replace(" active", "");
    }
    tabby.style.display = "block";
    var tag = document.createElement("span");
    tag.setAttribute('onclick',"this.parentElement.style.display='none'");
    tag.setAttribute('class',"closeTab");
    tag.appendChild(document.createTextNode('x'));
    tabby.appendChild(tag);

    tabby.appendChild(document.createElement("p").appendChild(document.createTextNode("Zadejte název receptu:")));
    var tagNazev = document.createElement("input");
    tagNazev.setAttribute("id","recipeNewName");
    tabby.appendChild(tagNazev);
    var addRButt = document.createElement("button");
        addRButt.setAttribute('onclick',"addNewRec()");
        addRButt.appendChild(document.createTextNode("Uložit"));

    tabby.appendChild(addRButt);
    tabby.appendChild(document.createElement("br"));
    tabby.appendChild(document.createElement("br"));

    tabby.appendChild(document.createElement("h1").appendChild(document.createTextNode("Nazev kroku")));
    tabby.appendChild(document.createElement("br"));
    var tagNazevChange = document.createElement("input");
    tagNazevChange.setAttribute("id","ingName");
    tabby.appendChild(tagNazevChange);
    tabby.appendChild(document.createElement("br"));

    tabby.appendChild(document.createElement("h1").appendChild(document.createTextNode("Adresa obrazku")));
    tabby.appendChild(document.createElement("br"));
    var tagObrChange = document.createElement("input");
    tagObrChange.setAttribute("id","obrSrc");
    tabby.appendChild(tagObrChange);
    tabby.appendChild(document.createElement("br"));

    tabby.appendChild(document.createElement("h1").appendChild(document.createTextNode("Popis kroku")));
    tabby.appendChild(document.createElement("br"));
    var tagTextChange = document.createElement("input");
    tagTextChange.setAttribute("id","descText");
    tabby.appendChild(tagTextChange);
    tabby.appendChild(document.createElement("br"));

    tabby.appendChild(document.createElement("h1").appendChild(document.createTextNode("Cas kroku")));
    tabby.appendChild(document.createElement("br"));
    var tagTimeChange = document.createElement("input");
    tagTimeChange.setAttribute("id","timeN");
    tabby.appendChild(tagTimeChange);
    tabby.appendChild(document.createElement("br"));
    var addRButt2 = document.createElement("button");
        addRButt2.setAttribute('onclick',"addIng()");
        addRButt2.appendChild(document.createTextNode("Přidat"));

    tabby.appendChild(addRButt2);

}

function addIng() {
    for (var i in miniJSON["recept"]){
        if (document.getElementById("recipeNewName")){
            if (miniJSON["recept"][i].name == document.getElementById("recipeNewName").value){
                var kiddo = {"name":"m","obrazek":"ss","textik":"sd","cas":"asd"}; 
                kiddo.name = document.getElementById("ingName").value;
                kiddo.obrazek = document.getElementById("obrSrc").value;
                kiddo.textik = document.getElementById("descText").value;
                kiddo.cas = document.getElementById("timeN").value;
                miniJSON["recept"][i].ingredience.push(kiddo);
            }
        }
        else if (document.getElementById("recipeName")){
            if (miniJSON["recept"][i].name == document.getElementById("recipeName").value){
                var kiddo = {"name":"m","obrazek":"ss","textik":"sd","cas":"asd"}; 
                kiddo.name = document.getElementById("ingName").value;
                kiddo.obrazek = document.getElementById("obrSrc").value;
                kiddo.textik = document.getElementById("descText").value;
                kiddo.cas = document.getElementById("timeN").value;
                miniJSON["recept"][i].ingredience.push(kiddo);
            }
        }
    }
}

function addNewRec(name){
    var decko = {name : "name", ingredience : []};
    decko.name = document.getElementById("recipeNewName").value;
    miniJSON["recept"].push(decko);
    listRecipes();
}

function openMainW(name){
    removeChildren("mainScr");
    var papa = document.getElementById("mainScr");

    //create h3 name for 'seznam ingredienci' and set
    var imp = document.createElement("h3");
    imp.setAttribute('class','mainW');
    var imp_less = document.createTextNode("Seznam ingrediencí");
    imp.appendChild(imp_less);
    papa.appendChild(imp);


    // create unordered list of elements as ingredients
    var ul = document.createElement("ol");
    ul.setAttribute('type',"1");
    var recepty = JSON.parse(JSON.stringify(miniJSON))["recept"];
    for (var k in recepty){
        if (recepty[k]==null){
            continue;
        }
        //search for the right recipe by 'name' & print out all of them ingredience
        else if(recepty[k].name == name){

            for(var l in recepty[k].ingredience){
                var tag = document.createElement("li");
                tag.className = "mainW mainElems";
                var text = document.createTextNode(recepty[k].ingredience[l].name);
                tag.appendChild(text);
                ul.appendChild(tag);
            }
        }
        
    }
    papa.appendChild(ul);

    var jdemeVarit = document.createElement("button");
    var editReceptis = document.createElement("button");

    jdemeVarit.setAttribute('class','btnMain btnVarit');
    editReceptis.setAttribute('class','btnMain btnEdit');

    jdemeVarit.setAttribute('onclick',"showRecipe('"+name+"');liquidateTabik()");
    editReceptis.setAttribute('onclick',"openRecipeTab(event,'" + name + "')");

    jdemeVarit.appendChild(document.createTextNode("Jdeme Vařit"));
    editReceptis.appendChild(document.createTextNode("Edit receptu"));


    papa.appendChild(jdemeVarit);
    papa.appendChild(editReceptis);
    

}
function liquidateTabik(){
    if (document.getElementById("yo")){
        document.getElementById("yo").parentElement.style.display='none';
    }
}

//open a tab window for clicked recipe
function openRecipeTab(evt,name) {
    removeChildren("tabz");
    var i, tabC, recept
    tabC = document.getElementsByClassName("tabContent");
    var tabby = document.getElementById("tabz");
    for (i = 0; i < tabC.length; i++) {
        tabC[i].style.display = "none";
    }
    recept = document.getElementsByClassName("listElement");
    for (i = 0; i < recept.length; i++) {
        recept[i].className = recept[i].className.replace(" active", "");
    }
    tabby.style.display = "block";
    evt.currentTarget.className += " active";
    var tag = document.createElement("span");
    tag.setAttribute('onclick',"this.parentElement.style.display='none'");
    tag.setAttribute('class',"closeTab");
    tag.setAttribute('id',"yo");
    tag.appendChild(document.createTextNode('x'));
    tabby.appendChild(tag);

    var recepty = JSON.parse(JSON.stringify(miniJSON))["recept"];
    for (var k in recepty){
        if (recepty[k]==null || recepty[k].name != name){
            continue;
        }
        var tagNazev = document.createElement("h1");
        tagNazev.appendChild(document.createTextNode(name));
        tagNazev.setAttribute('id','nazev');

        var tagButton = document.createElement("button");
        tagButton.setAttribute('onclick',"recipeDelete('"+name+"');this.parentElement.style.display='none'");
        tagButton.appendChild(document.createTextNode("Smazat"));

        var sumbitButton = document.createElement("button");
        sumbitButton.appendChild(document.createTextNode("Změnit"));
        sumbitButton.setAttribute("type","submit");
        sumbitButton.setAttribute("onclick","updateRecipe('"+name+"');this.parentElement.style.display='none'");

        var tagNazevChange = document.createElement("input");
        tagNazevChange.setAttribute("id","recipeName");
        tagNazevChange.value = name;

        
        tabby.appendChild(tagNazev);
        tabby.appendChild(tagButton);
        tabby.appendChild(sumbitButton);

        tabby.appendChild(document.createElement("br"));
        tabby.appendChild(document.createElement("h1").appendChild(document.createTextNode("Název")));

        tabby.appendChild(tagNazevChange);
        tabby.appendChild(document.createElement("br"));
        tabby.appendChild(document.createElement("br"));
        
        var divy = document.createElement("div");
        divy.setAttribute("id","divy");
        tabby.appendChild(divy);
        for (var j in recepty[k].ingredience){
            divy.appendChild(document.createElement("h1").appendChild(document.createTextNode("Nazev kroku - " + recepty[k].ingredience[j].name)));
            divy.appendChild(document.createElement("br"));
            var tagNazevChange = document.createElement("input");
            tagNazevChange.setAttribute("id","ingName"+j);
            tagNazevChange.value = recepty[k].ingredience[j].name;
            divy.appendChild(tagNazevChange);
            divy.appendChild(document.createElement("br"));

            divy.appendChild(document.createElement("h1").appendChild(document.createTextNode("Adresa obrazku")));
            divy.appendChild(document.createElement("br"));
            var tagObrChange = document.createElement("input");
            tagObrChange.setAttribute("id","obrSrc"+j);
            tagObrChange.value = recepty[k].ingredience[j].obrazek;
            divy.appendChild(tagObrChange);
            divy.appendChild(document.createElement("br"));

            divy.appendChild(document.createElement("h1").appendChild(document.createTextNode("Popis kroku")));
            divy.appendChild(document.createElement("br"));
            var tagTextChange = document.createElement("input");
            tagTextChange.setAttribute("id","descText"+j);
            tagTextChange.value = recepty[k].ingredience[j].textik;
            divy.appendChild(tagTextChange);
            divy.appendChild(document.createElement("br"));

            divy.appendChild(document.createElement("h1").appendChild(document.createTextNode("Cas kroku")));
            divy.appendChild(document.createElement("br"));
            var tagTimeChange = document.createElement("input");
            tagTimeChange.setAttribute("id","timeN"+j);
            tagTimeChange.value = recepty[k].ingredience[j].cas;
            divy.appendChild(tagTimeChange);
            divy.appendChild(document.createElement("br"));


            divy.appendChild(document.createElement("hr"));
        }
    }
    divy.appendChild(document.createElement("hr"));
    divy.appendChild(document.createElement("hr"));
    divy.appendChild(document.createElement("hr"));
    tabby.appendChild(document.createElement("h1").appendChild(document.createTextNode("Nazev kroku")));
    tabby.appendChild(document.createElement("br"));
    var tagNazevChange = document.createElement("input");
    tagNazevChange.setAttribute("id","ingName");
    tabby.appendChild(tagNazevChange);
    tabby.appendChild(document.createElement("br"));

    tabby.appendChild(document.createElement("h1").appendChild(document.createTextNode("Adresa obrazku")));
    tabby.appendChild(document.createElement("br"));
    var tagObrChange = document.createElement("input");
    tagObrChange.setAttribute("id","obrSrc");
    tabby.appendChild(tagObrChange);
    tabby.appendChild(document.createElement("br"));

    tabby.appendChild(document.createElement("h1").appendChild(document.createTextNode("Popis kroku")));
    tabby.appendChild(document.createElement("br"));
    var tagTextChange = document.createElement("input");
    tagTextChange.setAttribute("id","descText");
    tabby.appendChild(tagTextChange);
    tabby.appendChild(document.createElement("br"));

    tabby.appendChild(document.createElement("h1").appendChild(document.createTextNode("Cas kroku")));
    tabby.appendChild(document.createElement("br"));
    var tagTimeChange = document.createElement("input");
    tagTimeChange.setAttribute("id","timeN");
    tabby.appendChild(tagTimeChange);
    tabby.appendChild(document.createElement("br"));
    var addRButt2 = document.createElement("button");
        addRButt2.setAttribute('onclick',"addIng()");
        addRButt2.appendChild(document.createTextNode("Přidat"));

    tabby.appendChild(addRButt2);

}

function updateRecipe(name){
    for (i in miniJSON["recept"]){
        if (miniJSON["recept"][i].name == name){
            if (document.getElementById("recipeName").value != ""){
                miniJSON["recept"][i].name = document.getElementById("recipeName").value;
            }
            for (var j in miniJSON["recept"][i].ingredience){
                if (document.getElementById("ingName"+j).value != ""){
                    miniJSON["recept"][i].ingredience[j].name = document.getElementById("ingName"+j).value;
                }
                if (document.getElementById("obrSrc"+j).value != ""){
                    miniJSON["recept"][i].ingredience[j].obrazek = document.getElementById("obrSrc"+j).value;
                }
                if (document.getElementById("descText"+j).value != ""){
                    miniJSON["recept"][i].ingredience[j].textik = document.getElementById("descText"+j).value;
                }
                if (document.getElementById("timeN"+j).value != ""){
                    miniJSON["recept"][i].ingredience[j].cas = document.getElementById("timeN"+j).value;
                }
            }
        }
    }
    removeChildren("daList");
    listRecipes();
}
//close opened tab by clicking a cross at the top right
//document.getElementById("defaultOpen").click();

