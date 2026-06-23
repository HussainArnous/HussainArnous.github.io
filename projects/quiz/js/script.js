const button1 = document.querySelector("#ant1");
const button2 = document.querySelector("#ant2");
const button3 = document.querySelector("#ant3");
const button4 = document.querySelector("#ant4");
const vraagText = document.querySelector("#vragen-text");
const foto = document.querySelector("#foto-1");
const Score = document.querySelector("#result-msg");
const nextButton = document.querySelector("#next-button");
const backButton = document.querySelector("#back-button");

const quiz = [
  {
    vraag: "1- Wie won het wereldkampioenschap Formule 1 in 2023?",
    opties: [
      "Max Verstappen",
      "Lewis Hamilton",
      "Charles Leclerc",
      "George Russell",
    ],
    antwoord: 0,
    foto: "img/max23.jpg",
  },
  {
    vraag: "2- Welk team heeft de meeste constructeurstitels?",
    opties: ["Red Bull Racing", "Mercedes", "Ferrari", "McLaren"],
    antwoord: 2,
    foto: "img/form1team.jpg",
  },
  {
    vraag: "3- Wie staat bekend als 'The Iceman'?",
    opties: [
      "Fernando Alonso",
      "Kimi Räikkönen",
      "Sebastian Vettel",
      "Valtteri Bottas",
    ],
    antwoord: 1,
    foto: "img/kimi.jpg",
  },
  {
    vraag: "4- Welke coureur heeft de bijnaam 'Checo'?",
    opties: ["Sergio Pérez", "Carlos Sainz", "Lando Norris", "Esteban Ocon"],
    antwoord: 0,
    foto: "img/checo.jpg",
  },
  {
    vraag: "5- In welk land vindt de Grand Prix van Monaco plaats?",
    opties: ["Spanje", "Frankrijk", "Italië", "Monaco"],
    antwoord: 3,
    foto: "img/monaco.jpg",
  },
  {
    vraag: "6- Welke auto rijdt Lewis Hamilton in 2023?",
    opties: ["Ferrari", "Mercedes", "Red Bull", "McLaren"],
    antwoord: 1,
    foto: "img/hamilton2023.jpg",
  },
  {
    vraag:
      "7- Wie heeft de meeste overwinningen in een seizoen behaald (2023 niet meegerekend)?",
    opties: [
      "Michael Schumacher",
      "Sebastian Vettel",
      "Max Verstappen",
      "Lewis Hamilton",
    ],
    antwoord: 2,
    foto: "img/max23.jpg",
  },
  {
    vraag: "8- Welke kleur heeft traditioneel de Ferrari F1-auto?",
    opties: ["Zilver", "Blauw", "Rood", "Groen"],
    antwoord: 2,
    foto: "img/ferrari_car.jpg",
  },
  {
    vraag: "9- Wie won de eerste Formule 1 Grand Prix ooit?",
    opties: [
      "Nino Farina",
      "Juan Manuel Fangio",
      "Alberto Ascari",
      "Giuseppe Farina",
    ],
    antwoord: 3,
    foto: "img/first_gp.jpg",
  },
  {
    vraag: "10- Welke circuit staat bekend als 'The Temple of Speed'?",
    opties: ["Silverstone", "Spa-Francorchamps", "Monza", "Suzuka"],
    antwoord: 2,
    foto: "img/monza.jpg",
  },
];

let currentVragen = 0;
let score = 0;
let questionAnswerd = false;

// وظيفة لتحديث السؤال الحالي والصورة
function loudVragen() {
  questionAnswerd = false;
  const q = quiz[currentVragen];
  vraagText.textContent = q.vraag;
  button1.textContent = q.opties[0];
  button2.textContent = q.opties[1];
  button3.textContent = q.opties[2];
  button4.textContent = q.opties[3];
  foto.src = q.foto; // تحديث الصورة
  Score.textContent = "";
}

// تحقق من الإجابة
function checkAnswer(selected) {
  if (!questionAnswerd) {
    if (selected === quiz[currentVragen].antwoord) {
      Score.textContent = "Goed gedaan!";
      Score.style.color = "green";
      score++;
    } else {
      Score.textContent = "Helaas, fout antwoord!";
      Score.style.color = "red";
    }
    questionAnswerd = true;
  }
}

// أزرار الإجابات
button1.addEventListener("click", () => checkAnswer(0));
button2.addEventListener("click", () => checkAnswer(1));
button3.addEventListener("click", () => checkAnswer(2));
button4.addEventListener("click", () => checkAnswer(3));

// أزرار التنقل
nextButton.addEventListener("click", () => {
  if (currentVragen < quiz.length - 1) {
    currentVragen++;
    loudVragen();
  } else {
    Score.textContent = `Quiz afgelopen! Je score: ${score} / ${quiz.length}`;
    Score.style.color = "black";
  }
});

backButton.addEventListener("click", () => {
  if (currentVragen > 0) {
    currentVragen--;
    loudVragen();
  }
});

// تحميل أول سؤال
loudVragen();
