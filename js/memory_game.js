"use strict";

const shuffleArray = function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

const sounds = {
    show_card: "http://static1.grsites.com/archive/sounds/cartoon/cartoon019.wav",
    wrong: "http://static1.grsites.com/archive/sounds/cartoon/cartoon010.wav",
    success: "http://static1.grsites.com/archive/sounds/musical/musical097.wav",
    won: "http://static1.grsites.com/archive/sounds/musical/musical078.wav",
};

const play_sound = function (sounds_arr, sound_key) {
    if (sound) {
        $('body').append(
            $(`<embed src="${sounds_arr[sound_key]}"
                autostart="false" width="0" height="0" id="${sound_key}"
                enablejavascript="true">`));
        setTimeout(function () {
            $('#show_card').remove();
        }, 1200);
    }
};

// for (let k in sounds) {
//     $('body').append(
//         $(`<embed src="${sounds[k]}"
//             autostart="false" width="0" height="0" id="${k}"
//             enablejavascript="true">`));
// }
//

//TODO
// let save_board = function () {
// };

const _cards = ['ALGE', 'ARGE', 'ANGU', 'ZAMB',
    'TUNS', 'LEST', 'UGAN', 'BUFA',
    'OAUN', 'SENE', 'SMLA', 'SOAF',
    'TANZ', 'SZLD', 'CDIV', 'CHAD',
    'BNIN', 'ALBA',
];

let set_num = 2;
let cards_num = 18;
let sound = true;
const score = 10;
let score_counter = [0,0];
let player = 1;

const draw = function () {

    player = 1;
    score_counter = [0,0];
    $('#playerOneScore').text("Player one score is: 0 points.");
    $('#playerTwoScore').text("Player two score is: 0 points.");

    if ($('#inputCardsNum').val() >= 2 && $('#inputCardsNum').val() <= 18) {
        cards_num = +$('#inputCardsNum').val();
    }

    if ($('#inputSetNum').val() >= 2 && $('#inputSetNum').val() <= 10) {
        set_num = +$('#inputSetNum').val();
    }

    $('#board').empty();

    shuffleArray(_cards);
    let cards = _cards.slice(0, cards_num);
    let temp = cards.slice(0);

    for (let i = 1; i < set_num; i++) {
        cards = cards.concat(temp);
    }

    shuffleArray(cards);

    const img_cards = Array.from(new Array(cards.length)).map((col, i) => {
        return $(`<img src="http://www.flags.net/images/largeflags/${cards[i]}0001.GIF" class="front_card img-responsive" alt="Responsive image">`).data("card", `${cards[i]}`)
    });

    const back_card_img = Array.from(new Array(cards.length)).map(() => {
        return $(`<img src="jpg/back.jpg" class="back_card img-responsive" alt="Responsive image">`)
    });
    var row;
    for (let i = 0; i < cards.length; i++) {
        let divider = Math.floor(Math.sqrt(cards.length)) <=6 ? Math.floor(Math.sqrt(cards.length)) : 6;
        if (i % divider === 0) {
            row = $(`<div class="row"/>`);
            $('#board').append(row);
        }
        let card = $(`<div class="${img_cards[i].data("card")} card "/>`);

        card.append(img_cards[i]);
        card.append(back_card_img[i]);
        row.append(card);
    }
};

draw();

const card_click = function (cards) {
    if ($(this).hasClass('is_active')) {
        return;
    };
    if(sound){
        // play_sound(sounds, "show_card");
        // $('#show_card').get(0).play();
    }
    $(this).toggleClass("is_active");
    $(this).children(".back_card").slideUp(200);

    let card_name = $(this).children(".front_card").data("card");
    let actives_cards = $(".is_active");
    let set_counter = 0;

    if (actives_cards.length === set_num) {
        $('#board').off("click", ".row .card");
        // actives_cards.each((card) => {
        //     if (card.find('.front_card').data('card') === card_name) {
        actives_cards.toArray().forEach((card, i) => {
            if (actives_cards.eq(i).hasClass(card_name)) {
                set_counter += 1;
            }
        });
        if (set_counter === set_num) {
            if(sound){
                play_sound(sounds, "success");
            }
            score_counter[player-1] += score;
            console.log(set_counter[0]);
            console.log(set_counter[1]);
            $('#playerOneScore').text(`Player one score is: ${score_counter[0]} points.`);
            $('#playerTwoScore').text(`Player two score is: ${score_counter[1]} points.`);
            actives_cards.toggleClass("is_active");
            actives_cards.children(".front_card").toggleClass("is_found");
            $('#board').on("click", ".row .card", card_click);
            if ($('.is_found').length === cards.length) {
                setTimeout(function () {
                    if(sound){
                        // $('#won').play();
                        play_sound(sounds, "won");
                    }
                    $('#board').off("click", ".row .card", card_click);
                }, 1100);
            }
        }
        else {
            player = ((player -1) ^ 1) + 1;
            actives_cards.toggleClass("is_active");
            if(sound){
                play_sound(sounds, "wrong");
            }
            setTimeout(function () {
                actives_cards.children(".back_card").slideDown(200);
                $('#board').on("click", ".row .card", card_click);
            }, 1000);
        }
    }
};

$('#board').on("click", ".row .card", card_click);

$('#inputSetNum,#inputCardsNum').on("input", () => {
    draw();
});

$('#ButtonStart').on("click", () => {
    draw();
});

$('#CheckboxSound').on("change", () => {
    sound = document.getElementById("CheckboxSound").checked;
});
