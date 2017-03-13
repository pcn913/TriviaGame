$( document ).ready(function() {
    init();
});

//const number for clock count down
var COUNT_DOWN = 20;
var number=COUNT_DOWN;


//this is the interval id for timer
var intervalId;

//to hold results back from ajax call
var results;

//variables to hold count of how many were right, wrong, or unanswered
var correctAnswers;
var wrongAnswers;
var unanswered;

	

/*this is to initialize the drop down list given to users. only doing this once*/

var numberQs = [5, 10, 15];
var categories = {1: 'any category', 9: 'general knowledge', 18: 'science: computers', 21: 'sports', 22: 'geography', 23: 'history', 26: 'celebrities', 28: 'vehicles'};
var difficulty = ['any', 'easy', 'medium', 'hard'];


for (var i=0;i<numberQs.length;i++){
   $('<option/>').val(numberQs[i]).html(numberQs[i]).appendTo('#numberqs');
}

for (var key in categories) {
  //console.log("key " + key + " has value " + categories[key]);
  $('<option/>').val(key).html(categories[key]).appendTo('#category');
}

for (var i=0;i<difficulty.length;i++){
   $('<option/>').val(difficulty[i]).html(difficulty[i]).appendTo('#difficulty');
}

/*this is to initialize the drop down list given to users. only doing this once*/




//count of questions that we are through
var count = 0;

//reset everything here
function init(){
	correctAnswers = 0;
	wrongAnswers = 0;
	unanswered = 0;



	$("#buttons").show();
	count = 0;
	number = COUNT_DOWN;
	$("#question-div").empty();
	$("#main-content").empty();
	$("#answers-div").empty();
}



//Use jQuery to run "startTriviaGame" when we click the "start" button.
$("#start").click(startTriviaGame);

function startTriviaGame(){

	var selectNumQs = $("#numberqs").val();
	var selectCategory = $("#category").val();
	var selectDifficulty = $("#difficulty").val();


	//api url magic here
	https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple
	var apiurl = 'https://opentdb.com/api.php?type=multiple';
	apiurl = apiurl + "&amount=" + selectNumQs;

	if(selectCategory != 1){
		apiurl = apiurl + "&category=" + selectCategory;		
	}

	if(selectDifficulty != 'any'){
		apiurl = apiurl + "&difficulty=" + selectDifficulty;		
	}



	// Performing an AJAX request with the queryURL
	$.ajax({
	  url: apiurl,
	  method: "GET"
	})
	// After data comes back from the request
	.done(function(response) {
	  //console.log(apiurl);

	  results = response.results;
	  askQuestions(results);
	});

}



function askQuestions(results){
	$("#buttons").hide();

	//show first question right away
	showQuestion();

	intervalId = setInterval(askNextQuestion, 1000);
}




function askNextQuestion(){
	  //  Decrease number by one for count down of clock
	  number--;

	  //  Show the clock here
	  $("#main-content").html("<h2> time left: " + number + "</h2>");

	  	  //  Once number hits zero meaning it wasn't answered in time, figure out what to do
	  if (number === 0) {

	  	count++;
	  	unanswered++;
	  	$("#answers-div").empty();
		if(count==results.length){
			stop();
		}else{
		    //  show the next question here from the array
		    showQuestion('timeout');
		}
	  }
}



//show the next question
function showQuestion(howigothere){
		number = COUNT_DOWN;

		//how i get here.  if its by answering question instead of timeout, then increment the count here as well
		if(howigothere == 'answered'){
			count++;
			$("#answers-div").empty();
		}

		if(count==results.length){
			stop()
		}else{
			$("#main-content").html("<h2> time left: " + number + "</h2>");
			 $("#question-div").html("<h2>" + results[count].question.toLowerCase() + "</h2>");
			//console.log(results[count].correct_answer);

			var b;


			b = $('<button/>').attr({
			    type: "button",
			    class: "btn btn-secondary btn-primary clsanswer",
			    style: "word-wrap:break-word",
			    value: results[count].correct_answer.toLowerCase(),
			    rightanswer: "yes"

			});
			$(b).text(results[count].correct_answer.toLowerCase());
		    $("#answers-div").append(b);
		    $("#answers-div").append("<br />");



			b = $('<button/>').attr({
			    type: "button",
			    class: "btn btn-secondary btn-primary clsanswer",
			    style: "word-wrap:break-word",
			    value: results[count].incorrect_answers[0].toLowerCase(),
			    rightanswer: "no"
			});
			$(b).text(results[count].incorrect_answers[0].toLowerCase());
		    $("#answers-div").append(b);
		    $("#answers-div").append("<br />");



			b = $('<button/>').attr({
			    type: "button",
			    class: "btn btn-secondary btn-primary clsanswer",
			    style: "word-wrap:break-word",
			    value: results[count].incorrect_answers[1].toLowerCase(),
			    rightanswer: "no"
			});
			$(b).text(results[count].incorrect_answers[1].toLowerCase());
		    $("#answers-div").append(b);
		    $("#answers-div").append("<br />");


			b = $('<button/>').attr({
			    type: "button",
			    class: "btn btn-secondary btn-primary clsanswer",
			    style: "word-wrap:break-word",
			    value: results[count].incorrect_answers[2].toLowerCase(),
			    rightanswer: "no"
			});
			$(b).text(results[count].incorrect_answers[2].toLowerCase());
		    $("#answers-div").append(b);
		    $("#answers-div").append("<br />");	    


			$(".clsanswer").click(function() {
				answerClicked($(this).attr("rightanswer"))
			});
		}


}


//this it to move on to next question if there is no timeout and answer was actually clicked
function answerClicked(rightans){
	if(rightans == "no"){
		wrongAnswers++;
	}else{
		correctAnswers++;
	}

	showQuestion('answered');
}



//show results + give option to start over
function showResults(){

	var b;
	$("#question-div").empty()
	$("#answers-div").append("<h2> correct answers: " + correctAnswers + "</h2>");	  
	$("#answers-div").append("<h2> wrong answers: " + wrongAnswers + "</h2>");
	$("#answers-div").append("<h2> not answered: " + unanswered + "</h2>");

	
	b = $('<button/>').attr({
	    type: "button",
	    class: "btn btn-secondary btn-primary startover",
	    style: "word-wrap:break-word"
	});
	$(b).text("start over?");

	$("#answers-div").append(b);

	$(".startover").click(function() {
		init();
	});

}




//  The stop function
function stop() {
  //  Clears our intervalId & shows the results of trivia
  clearInterval(intervalId);
  showResults()
   

}
