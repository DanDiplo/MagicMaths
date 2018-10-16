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
                2,
                1,
                12,
                40,
                5,
                10,
                16,
                20,
                8,
                3,
                23
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

            // Generates a random maths query
            generateQuestion: function (answer) {
                var query = this.queries[getRandomInt(0, this.queries.length - 1)];
                return query(answer);
            },

            // Generates an addition question
            generateAdditionQuestion: function (answer) {
                if (answer === 1) {
                    return "1 + 0";
                }

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

            // Add the question generation queries
            this.queries.push(this.generateAdditionQuestion);
            this.queries.push(this.generateMultiplicationQuestion);
            this.queries.push(this.generateSubtractionQuestion);
            this.queries.push(this.generateDivisionQuestion);

            // Shuffle the answers
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

})();