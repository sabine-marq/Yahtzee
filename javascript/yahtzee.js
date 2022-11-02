"use strict";
//--------------------------------------objecten-----------------------------------------------
// een spel object is gemaakt van 2 objecten:
//          een object beurt met de waarden van de gegooide dobbelstenen en
//          een object kaartVakjes gemaakt van een array van objecten die de punten/categorie alsook de totalen (table van de kaart) bevat
const beurt = {
    "aantalBeurten": 0,  // van 1 tot 13 einde van het spel
    "gooi": 0,  // 0,1,2 of 3  0 is de waarde in het begin van elke beurt het maakt de knop "gooi" actief
    "dobbelstenen": [{ // de 5 dobbelstenen van elke beurt vast of nog niet als ze voor een tweede of derde keer worden gegooid
        "vast": false,
        "waarde": null
    }, {
        "vast": false,
        "waarde": null
    }, {
        "vast": false,
        "waarde": null
    }, {
        "vast": false,
        "waarde": null
    }, {
        "vast": false,
        "waarde": null
    }],
};

function Vakje(nr) { // constructor voor de 18 vakjes (cellen van de tabel)
    this.nr = nr;
    this.naam = "";
    this.uitleg = "";
    this.puntentelling = "";
    this.vast = false;
    this.soort = "punten";
    this.punten = "";
    this.initialiseer = function () {
        if ([7, 8, 9, 17, 18].indexOf(this.nr) !== -1) {
            this.soort = "totaal";
        }
        if (this.nr === 1) {
            this.naam = "ENEN";
            this.puntentelling = "tel alle enen";
        }
        if (this.nr === 2) {
            this.naam = "TWEEËN";
            this.puntentelling = "tel alle tweeën";
        }
        if (this.nr === 3) {
            this.naam = "DRIEËN";
            this.puntentelling = "tel alle drieën";
        }
        if (this.nr === 4) {
            this.naam = "VIEREN";
            this.puntentelling = "tel alle vieren";
        }
        if (this.nr === 5) {
            this.naam = "VIJVEN";
            this.puntentelling = "tel alle vijven";
        }
        if (this.nr === 6) {
            this.naam = "ZESSEN";
            this.puntentelling = "tel alle zessen";
        }
        if (this.nr === 7) {
            this.naam = "TOTAAL";
            this.uitleg = "alle hierboven categorieën";
        }
        if (this.nr === 8) {
            this.naam = "EXTRA BONUS";
            this.uitleg = "totaal >= 63: 35 punten bij";
        }
        if (this.nr === 9) {
            this.naam = "TOTAAL";
            this.uitleg = "alle bovenste punten samen";
        }
        if (this.nr === 10) {
            this.naam = "THREE OF A KIND";
            this.uitleg = "3 dezelfde";
            this.puntentelling = "totaal van de 5 stenen";
        }
        if (this.nr === 11) {
            this.naam = "CARRÉ";
            this.uitleg = "4 dezelfde";
            this.puntentelling = "totaal van de 5 stenen";
        }
        if (this.nr === 12) {
            this.naam = "FULL HOUSE";
            this.uitleg = "3+2 dezelfde";
            this.puntentelling = "25 punten";
        }
        if (this.nr === 13) {
            this.naam = "KLEINE STRAAT";
            this.uitleg = "4 opeenvolgende nummers";
            this.puntentelling = "30 punten";
        }
        if (this.nr === 14) {
            this.naam = "GROTE STRAAT";
            this.uitleg = "5 opeenvolgende nummers";
            this.puntentelling = "40 punten";
        }
        if (this.nr === 15) {
            this.naam = "YAHTZEE";
            this.uitleg = "5 dezelfde";
            this.puntentelling = "50 punten";
        }
        if (this.nr === 16) {
            this.naam = "CHANCE";
            this.uitleg = "vrije keus";
            this.puntentelling = "totaal van de 5 stenen";
        }
        if (this.nr === 17) {
            this.naam = "TOTAAL";
            this.uitleg = "alle hierboven 7 categorieën";
        }
        if (this.nr === 18) {
            this.naam = "TOTAAL";
            this.uitleg = "alle punten samen";
        }
    }
    this.initialiseer();
}

//18 rijen van objecten van de scorekaart: 13 van soort puntentelling en 5 als totaal (3: bovenstedeel + bonus en 2: onderste deel en algemene totaal)
const kaartVakjes = [];
for (let i = 0; i < 18; i++) {
    kaartVakjes [i] = new Vakje((i + 1));  // elk array item
}


//-----------------------------hoofddeel van het programma-------------------------------------
bouwPagina();

document.addEventListener("click", function (event) { //we luisteren naar alle events
    let eventTag = document.getElementById(event.target.id);
    if (eventTag !== null) {// werd geklikt op HTML tag die een id heeft
        document.getElementById("boodschap").innerText = ""; // bij elke event wordt de boodschap gewist
        //------------------------------1-Klik op een vakje met waarde in de scorekaart ---------------------------------
        if (eventTag.id !== undefined && eventTag.id.substr(0, 6) === "waarde") {
            let nr = Number(eventTag.id.substr(6, (eventTag.id.length - 6)));  // nr van het geklikte vakje
            let index = nr - 1;
            //  goede vakjes bevatten punten, zijn geen berekend totaal en waren nog niet gekozen in dit spel (niet vast)
            if (eventTag.innerText !== '' && kaartVakjes[index].soort === "punten" && !kaartVakjes[index].vast) {
                kaartVakjes[index].vast = true;
                document.getElementById(eventTag.id).className = "td4 vast"; // het vakje mag niet meer geklikt worden
                document.getElementById("gooiDobbelstenen").disabled = false; // de knop "gooi dobbelstenen" is weer aktief
                geenDobbelstenenOpTapijt(); // de dobbelstenen verdwijnen
                aanpassenPunten();
                beurt.gooi = 0;  // de speler mag weer tot 3 maal gooien
                if (beurt.aantalBeurten !== 13) {
                    beurt.aantalBeurten += 1;
                } else {
                    document.getElementById("gooiDobbelstenen").disabled = true;  // enigste mogelijkheid is een nieuw spel aan te vragen
                    document.getElementById("boodschap").innerText = "Einde van het spel";
                }
            } else {
                document.getElementById("boodschap").innerText = "Dit vakje mag niet gekozen worden (reeds gekozen, andere mogelijkheden met punten of berekend totaal";
            }
        }
        //------------------------------2-Klik op een dobbelsteen---------------------------------
        if (eventTag.id !== undefined && eventTag.id.substr(0, 11) === "dobbelsteen") {
            if (beurt.gooi === 1 || beurt.gooi === 2) {
                veranderStatusDobbelsteen(eventTag.id);
            } else {
                document.getElementById("boodschap").innerText = "een dobbelsteen uitkiezen heeft hier geen zin";
            }
        }
        //------------------------------3-Klik op een knop "gooi dobbelstenen"---------------------------------
        if (eventTag.id !== undefined && eventTag.id === "gooiDobbelstenen") {
            if (beurt.gooi <= 3) {
                if (beurt.gooi < 3) beurt.gooi += 1;
                if (beurt.gooi === 3) document.getElementById("gooiDobbelstenen").disabled = true; // de knop "gooi dobbelstenen" is disabled
                if (beurt.gooi === 1) alleDobbelstenenVrijMaken();
                if (beurt.gooi === 1 && beurt.aantalBeurten === 0) beurt.aantalBeurten = 1;
                willekeurigdobbelsteen();
                aanpassenDobbelstenen();
                aanpassenPunten();
                if (beurt.gooi === 3) toonZeroPunten();  //waarde 0 wordt '' getoond en mag niet gekozen worden behalve op het einde van het spel waar 0 waarden gekozen mogen worden
            } else {
                document.getElementById("boodschap").innerText = "Kies nu een categorie door op haar punten te kliken";
            }
        }
        //------------------------------4-Klik op een knop "nieuw spel" ---------------------------------
        if (eventTag.id !== undefined && eventTag.id === "nieuwSpel") {
            location.reload();
        }
    }
});

//------------------------------dobbelstenen behandelingen-------------------------------------

function willekeurigdobbelsteen() {
    for (let i = 0; i < 5; i++) {
        if (beurt.dobbelstenen[i].vast !== true) {
            beurt.dobbelstenen[i].waarde = Math.floor(Math.random() * (6)) + 1;
        }
    }
}

function geenDobbelstenenOpTapijt() {
    for (let i = 0; i < 5; i++) {
        beurt.dobbelstenen[i].vast = false;
        beurt.dobbelstenen[i].waarde = 0;
        document.getElementById("dobbelsteen" + (i + 1).toString()).src = `images/0.png`;
        document.getElementById("dobbelsteen" + (i + 1).toString()).classList.remove("vast");
    }
    aanpassenPunten();
}

function alleDobbelstenenVrijMaken() {
    for (let i = 0; i < 5; i++) {
        beurt.dobbelstenen[i].vast = false;
    }
}

// dobbelstenen worden vast of weer vrij om gegooid te worden
function veranderStatusDobbelsteen(evenTagId) {
    let index = Number(evenTagId.substr(11, 1)) - 1;
    if (beurt.dobbelstenen[index].vast === true) {
        beurt.dobbelstenen[index].vast = false;
        document.getElementById(evenTagId).classList.remove("vast");
    } else {
        beurt.dobbelstenen[index].vast = true;
        document.getElementById(evenTagId).className = "vast";
    }
}

//---------------------------------aanpassen van de pagina-------------------------------------

// aanpassen de niet vaste dobbelstenen
function aanpassenDobbelstenen() {
    for (let kolom = 0; kolom < 5; kolom++) {
        if (beurt.dobbelstenen[kolom].vast === false) {
            let divDobbelsteenImg = document.getElementById("dobbelsteen" + (kolom + 1).toString())
            divDobbelsteenImg.title = (beurt.dobbelstenen[kolom].waarde).toString();
            divDobbelsteenImg.alt = (beurt.dobbelstenen[kolom].waarde).toString();
            divDobbelsteenImg.src = `images/${beurt.dobbelstenen[kolom].waarde}.png`;
        }
    }
}

function aanpassenPunten() {
    // td4 cellen aanpassen alsook aantallen voor de 18 rijen die een Id hebben van waarde1 tot waarde18 (rij index van 0 tot 17)
    // BOVENSTE HELFT
    let totaalBovenste = 0;
    for (let rij = 0; rij < 6; rij++) {
        totaalBovenste += (kaartVakjes[rij].vast === true) ? kaartVakjes[rij].punten : 0;
        if (kaartVakjes[rij].soort !== "totaal" && kaartVakjes[rij].vast !== true) {
            let idAanTePassen = "waarde" + (rij + 1).toString();
            kaartVakjes[rij].bereken = berekenenPuntenBovenste; // zelfde functie (met this) voor verschillende objecten
            kaartVakjes[rij].punten = kaartVakjes[rij].bereken();
            document.getElementById(idAanTePassen).innerText = (kaartVakjes[rij].punten !== 0) ? kaartVakjes[rij].punten : "";
        }
    }
    // de drie totalen
    kaartVakjes[6].punten = totaalBovenste;
    if (totaalBovenste !== 0) document.getElementById("waarde7").innerText = kaartVakjes[6].punten;
    kaartVakjes[7].punten = (totaalBovenste >= 63) ? 35 : "";
    document.getElementById("waarde8").innerText = kaartVakjes[7].punten;
    kaartVakjes[8].punten = (totaalBovenste >= 63) ? (totaalBovenste + 35) : totaalBovenste;
    if (kaartVakjes[8].punten !== 0) document.getElementById("waarde9").innerText = kaartVakjes[8].punten;
    // ONDERSTE HELFT
    let totaalOnderste = 0;
    for (let rij = 9; rij < 16; rij++) {
        totaalOnderste += (kaartVakjes[rij].vast === true) ? kaartVakjes[rij].punten : 0;
        if (kaartVakjes[rij].soort !== "totaal" && kaartVakjes[rij].vast !== true) {
            let idAanTePassen = "waarde" + (rij + 1).toString();
            kaartVakjes[rij].bereken = berekenenPuntenOnderste;  // zelfde functie (met this) voor verschillende objecten
            kaartVakjes[rij].punten = kaartVakjes[rij].bereken();
            document.getElementById(idAanTePassen).innerText = (kaartVakjes[rij].punten !== 0) ? kaartVakjes[rij].punten : "";
        }
    }
    // de twee totalen
    kaartVakjes[16].punten = totaalOnderste;
    if (totaalOnderste !== 0) document.getElementById("waarde17").innerText = kaartVakjes[16].punten;
    kaartVakjes[17].punten = kaartVakjes[8].punten + totaalOnderste;
    if (kaartVakjes[17].punten !== 0) document.getElementById("waarde18").innerText = kaartVakjes[17].punten;
    // het tellen van beurten en gooien
    document.getElementById("aantalBeurten").innerText = beurt.aantalBeurten;
    document.getElementById("aantalGooien").innerText = beurt.gooi;
}

//---------------------------------------punten berekeningen-----------------------------------
function berekenenPuntenBovenste() {
    if ([1, 2, 3, 4, 5, 6].indexOf(this.nr) !== -1) {
        let punten = 0;
        for (let i = 0; i < beurt.dobbelstenen.length; i++) {
            punten = punten + (beurt.dobbelstenen[i].waarde === this.nr ? this.nr : 0);
        }
        return punten;
    }
}

function berekenenPuntenOnderste() {
    let punten = 0;
    if ([10, 11, 12, 13, 14, 15].indexOf(this.nr) !== -1) {
        // om te testen, maken we een gesorteerde array met de 5 waarden van de dobbelstenen in volgorde
        const testArray = [];
        for (let i = 0; i < beurt.dobbelstenen.length; i++) {
            testArray [i] = beurt.dobbelstenen[i].waarde;
        }
        testArray.sort();
        if (testArray[0] !== 0) {  //als de dobelstenen nog niet gegooid werden geen berekening
            if (this.nr === 10) { // THREE OF A KIND
                // 3 dezelfde [xy3z] or [x3zy] or [3zxy]
                if (testArray[2] === testArray[4] || testArray[1] === testArray[3] || testArray[0] === testArray[2]) {
                    punten = testArray.reduce((sum, current) => sum + current, 0);
                }
            }
            if (this.nr === 11) { // CARRÉ
                // 4 dezelfde [x4z] or [4zx]
                if (testArray[1] === testArray[4] || testArray[0] === testArray[3]) {
                    punten = testArray.reduce((sum, current) => sum + current, 0);
                }
            }
            if (this.nr === 12) { // FULL HOUSE
                // 3+2 dezelfde [3y2x] or [3x2y]
                if (testArray[0] === testArray[1] && testArray[2] === testArray[4] || testArray[0] === testArray[2] && testArray[3] === testArray[4]) {
                    punten = 25;
                }
            }
            if (this.nr === 13) { // KLEINE STRAAT
                if (testKleineStraat(testArray)) {
                    punten = 30;
                }
            }
            if (this.nr === 14) { // GROTE STRAAT
                const testArrayString = testArray.join('');
                // grote Straat 12345 or 23456
                if (testArrayString === '12345' || testArrayString === '23456') {
                    punten = 40;
                }
            }
            if (this.nr === 15) { // YAHTZEE
                // 5 dezelfde [5x] ==> eerste == laatste
                if (testArray[0] === testArray[4]) {
                    punten = 50;
                }
            }
        }
    }
    if (this.nr === 16) { // CHANCE
        for (let i = 0; i < beurt.dobbelstenen.length; i++) {
            punten = punten + (beurt.dobbelstenen[i].waarde);
            // punten =  beurt.dobbelstenen.waarde.reduce((sum, current) => sum + current, 0);
        }
    }
    return punten;
}

function testKleineStraat(testArray) {
    if (testArray[0] === 4 || testArray[4] === 3) {
        return false;
    }
    let huidigesequentielengte = 1;
    for (let i = 1; i < testArray.length; i++) {
        if (testArray[i] === testArray[i - 1] + 1) {
            huidigesequentielengte += 1;
        } else {
            if (testArray[i] !== testArray[i - 1]) huidigesequentielengte = 1;// geen dubbel we beginnen terug met het zoeken van een opeenvolgende reeks
        }
        if (huidigesequentielengte >= 4) return true;
    }
    return false;
}


function toonZeroPunten() {
    // niet-vaste waarden (0-->6 en 10-->16) die = 0 worden als 0 i.p.v. ''
    // als alle waarden = 0
    // als er maar 3 waarden getoond worden waarvan het totaal <20 is dan tonen we de nuls
    let totalNietVasteWaarden = 0;
    let aantal0Waarden = 0;
    for (let rij = 0; rij < 6; rij++) {
        if (!kaartVakjes[rij].vast) {
            totalNietVasteWaarden += kaartVakjes[rij].punten;
            aantal0Waarden += (parseFloat(kaartVakjes[rij].punten) !== 0) ? 1 : 0;
        }
    }
    for (let rij = 9; rij < 16; rij++) {
        if (!kaartVakjes[rij].vast) {
            totalNietVasteWaarden += kaartVakjes[rij].punten;
            aantal0Waarden += (parseFloat(kaartVakjes[rij].punten) !== 0) ? 1 : 0;
        }
    }
    //loop om de 0 waarden te tonen
    if (totalNietVasteWaarden === 0 || (totalNietVasteWaarden < 20 && aantal0Waarden <= 3)) {
        for (let rij = 0; rij < 6; rij++) {
            if (!kaartVakjes[rij].vast) {
                let idAanTePassen = "waarde" + (rij + 1).toString();
                if (parseFloat(kaartVakjes[rij].punten) === 0) document.getElementById(idAanTePassen).innerText = '0';
            }
        }
        for (let rij = 9; rij < 16; rij++) {
            if (!kaartVakjes[rij].vast) {
                let idAanTePassen = "waarde" + (rij + 1).toString();
                if (parseFloat(kaartVakjes[rij].punten) === 0) document.getElementById(idAanTePassen).innerText = '0';
            }
        }
    }
}

//---------------------opbouw van de pagina-vastzetten van het DOM-----------------------------
function bouwPagina() {
// dobbelstenen
    bouwDobbelstenen();
// <input type="button"  id="gooiDobbelstenen" value="gooi dobbelstenen" class="submit">
    addInputSubmitInFormulier("gooiDobbelstenen", "gooi dobbelstenen");
    document.getElementById("boodschap").innerText = "Om een spel te beginnen, gooi de dobbelstenen";
// add table scorekaart
    bouwTabel();
}

// toon de dobbelstenen op volgens de waarden van het object beurt
function bouwDobbelstenen() {
    let divParent = document.getElementById("dobbelstenen");
    for (let kolom = 0; kolom < 5; kolom++) {
        let divChild = document.createElement("div");
        divChild.id = "div" + (kolom + 1).toString();
        document.getElementById(divParent.id).appendChild(divChild);
        // een plaats is gereserveerd met een transparant beeld om de DOM geen elementen bivoegen en aftrekken
        let divGrandchild = document.createElement("img");
        divGrandchild.id = "dobbelsteen" + (kolom + 1).toString();
        divGrandchild.title = "";
        divGrandchild.alt = "";
        divGrandchild.src = `images/0.png`;
        document.getElementById(divChild.id).appendChild(divGrandchild);
    }
}

function addInputSubmitInFormulier(id, value) {
    const formulier = document.getElementById("form");
    const inputSubmit = document.createElement("input");
    inputSubmit.type = `button`;
    inputSubmit.id = id;
    inputSubmit.value = value;
    inputSubmit.class = `submit`;
    formulier.appendChild(inputSubmit);
}

function bouwTabel() {
// cellen opbouwen alsook aantallen
    let grandParent = document.createElement("table");
    grandParent.id = "tableScore";
    document.getElementById("score").appendChild(grandParent);
    // table header 1
    let parent = document.createElement("tr");
    parent.id = "bovensteHelft";
    document.getElementById("tableScore").appendChild(parent);
    let child1 = document.createElement("th");
    child1.innerText = "BOVENSTE HELFT";
    child1.className = "th1-2";
    child1.colSpan = 2;
    document.getElementById("bovensteHelft").appendChild(child1);
    let child3 = document.createElement("th");
    child3.innerText = "Puntentelling";
    child3.className = "th3";
    document.getElementById("bovensteHelft").appendChild(child3);
    let child4 = document.createElement("th");
    child4.innerText = "SPEL";
    child4.className = "th4";
    document.getElementById("bovensteHelft").appendChild(child4);
    // alle 18 rijen
    for (let rij = 0; rij < 18; rij++) {
        parent = document.createElement("tr");
        document.getElementById("tableScore").appendChild(parent);
        if (rij === 8) {
            // table header 2
            let parent = document.createElement("tr");
            parent.id = "ondersteHelft";
            document.getElementById("tableScore").appendChild(parent);
            child1 = document.createElement("th");
            child1.innerText = "ONDERSTE HELFT";
            child1.className = "th1-4";
            child1.colSpan = 4;
            document.getElementById("ondersteHelft").appendChild(child1);
        }
        child1 = document.createElement("td");
        child1.innerText = kaartVakjes[rij].naam;
        child1.className = "td1";
        parent.appendChild(child1);
        let child2 = document.createElement("td");
        child2.innerText = kaartVakjes[rij].uitleg;
        child2.className = "td2";
        // uitleg op 2 cellen breed voor totalen
        if (rij === 6 || rij === 7 || rij === 8 || rij === 16 || rij === 17) {
            child2.colSpan = 2;
            parent.appendChild(child2);
        } else {
            parent.appendChild(child2);
            child3 = document.createElement("td");
            child3.innerText = kaartVakjes[rij].puntentelling;
            child3.className = "td3";
            parent.appendChild(child3);
        }
        child4 = document.createElement("td");
        child4.innerText = kaartVakjes[rij].punten;
        // if (kaartVakjes[rij].soort !== "totaal") {
        child4.id = "waarde" + (rij + 1);
        // }
        child4.className = (kaartVakjes[rij].vast === true || kaartVakjes[rij].soort === "totaal") ? "td4 vast" : "td4 open";
        parent.appendChild(child4);
    }
    document.getElementById("aantalBeurten").innerText = beurt.aantalBeurten;
    document.getElementById("aantalGooien").innerText = beurt.gooi;

}
