(function () {

    var app = new Vue({
        el: '#app',
        data: {
            config: {
                maths: {
                    maxAdditionComponents: 3,
                    maxSubtraction: 30
                }
            },
            question: {
                sum: "",
                answer: 0
            },
            answers: [
                // these are the fixed answers you want to be the answer to the generated math question
                14, 10, 23, 33, 2, 6, 0, 12, 7, 3, 1, 12, 9, 40, 1, 8, 15, 8, 6, 12, 10, 18, 2, 20, 3, 4, 4, 9, 7
            ],
            queries: [
                // these are added in the Created() function
            ],
            answerIndex: 0
        },

        methods: {

            // Gets the next randomly generated question
            getQuestion: function () {
                this.setDisplay("answer", "none");
                this.setDisplay("reveal-button", "inline");

                this.question.answer = this.getNextAnswer();
                this.question.sum = this.generateQuestion(this.question.answer);
            },

            // Gets the next answer in the sequence
            getNextAnswer: function () {
                if (this.answerIndex >= this.answers.length) {
                    this.answerIndex = 0;
                }

                return this.answers[this.answerIndex++];
            },

            // Selects a random maths query
            generateQuestion: function (answer) {
                var query = getWeightRandomQuestion(this.queries);
                return query(answer);
            },

            // Generates an addition question
            generateAdditionQuestion: function (answer) {
                if (answer === 1)
                    return "1 + 0";

                if (answer === 0)
                    return "0 + 0";

                var components = getRandomInt(2, this.config.maths.maxAdditionComponents);
                var numbers = getAdditionParts(answer, components, 2);
                return numbers.join(" + ");
            },

            // Generates a substraction question
            generateSubtractionQuestion: function (answer) {
                var high = getRandomInt(answer, answer + this.config.maths.maxSubtraction);
                var low = high - answer;
                return high + " - " + low;
            },

            // Generates a multiplication question
            generateMultiplicationQuestion: function (answer) {
                var possibles = [];

                for (var i = 0; i < answer; i++) {
                    if (answer % i === 0) {
                        possibles.push(i);
                    }
                }

                var chosen = possibles[getRandomInt(0, possibles.length - 1)];

                if (chosen === undefined) {
                    return "1 &times; " + answer;
                }

                var number = answer / chosen;
                return chosen + " &times; " + number;
            },

            // Generates a division question
            generateDivisionQuestion: function (answer) {
                var number = getRandomInt(2, 5);
                var divisor = answer * number;

                return divisor + " &divide; " + number;
            },

            revealAnswer: function () {
                this.setDisplay("answer", "inline");
                this.setDisplay("reveal-button", "none");
            },

            setDisplay: function (id, value) {
                document.getElementById(id).style.display = value;
            },

            toggleDisplay: function (id) {
                var elem = document.getElementById(id);
                var current = elem.style.display;
                if (current === "none") {
                    elem.style.display = "inline";
                } else {
                    elem.style.display = "none";
                }
            }
        },

        created: function () {

            // Add the question generation queries and gives each a weighted probability of being picked
            // ie. there is a 35% chance of a question being addition, but only 10% chance of being division
            this.queries.push({ q: this.generateAdditionQuestion, w: 0.35 });
            this.queries.push({ q: this.generateMultiplicationQuestion, w: 0.25 });
            this.queries.push({ q: this.generateSubtractionQuestion, w: 0.3 });
            this.queries.push({ q: this.generateDivisionQuestion, w: 0.1 });

            // Shuffle the answers so they are selected in random order
            shuffleArray(this.answers);

            // get first question
            this.getQuestion();
        }
    });

    function getAdditionParts(number, sections, min) {
        var ary = [];
        var i = 0;

        while (number >= 0) {
            if (!ary[i % sections]) ary[i % sections] = 0;

            if (number >= min) {
                number -= min;
                ary[i % sections] += min;
                min++;
            }
            else {
                ary[i % sections] += number;
                break;
            }

            if (i > sections) {
                i += Math.floor(Math.random() * 3);
            }
            else {
                i++;
            }
        }

        return ary;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function getWeightRandomQuestion(questions) {
        var i, sum = 0, r = Math.random();

        for (i in questions) {
            sum += questions[i].w;
            if (r <= sum) return questions[i].q;
        }
    }

})();