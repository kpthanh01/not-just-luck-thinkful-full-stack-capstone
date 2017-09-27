"use strict";

// Function and object definitions
var user = undefined;
var editToggle = false;
var backWarnToggle = false;
var backToLandingPageToggle = false;
var newUserToggle = false;

function submitNewAccomplishment(user) {
	event.preventDefault();
	backWarnToggle = false;
	console.log(backWarnToggle);
	// AJAX call to send the form data up to the server/DB
	// take values from form inputs
	const achWhat = $('input[id="achieve-what"]').val();
	console.log(achWhat);
	var achHow = [];
		// add all the cb values to the array achHow
		var cbElements = $('input[type=checkbox]');
		for (let i=0; i < cbElements.length; i++) {
			if ($(cbElements[i]).is(':checked')) {
				console.log(cbElements[i].value);
				achHow.push(cbElements[i].value);
			};
		};
		console.log(achHow);
	var achWhen = $('input[id="datepicker"]').val();
	console.log(achWhen + ' is achWhen value before changing to epoch format');
	achWhen = Date.parse(achWhen);
	console.log(achWhen + ' after parsing');
	const achWhy = $('input[id="achieve-why"]').val();
	console.log(achWhy);
	console.log('user is ' + user);
	const newAchObject = {
		user: user,
		achieveWhat: achWhat,
		achieveHow: achHow,
		achieveWhen: achWhen,
		achieveWhy: achWhy
	};
	console.log('about to check truth or falsehood of editToggle for ajax call');
	if (editToggle === false) {
		$.ajax({
				type: 'POST',
				url: 'achievements/create',
				dataType: 'json',
				data: JSON.stringify(newAchObject),
				contentType: 'application/json'
			})
			.done(function (result) {
				showTimeline();
			})
			.fail(function (jqXHR, error, errorThrown) {
	            console.log(jqXHR);
	            console.log(error);
	            console.log(errorThrown);
			});
	} else if (editToggle === true) {
		$.ajax({
				type: 'PUT',
				url: 'achievements/' + achievementId,
				dataType: 'json',
				data: JSON.stringify(newAchObject),
				contentType: 'application/json'
			})
			.done(function (result) {
				showTimeline();
				editToggle = false;
				console.log(editToggle);
			})
			.fail(function (jqXHR, error, errorThrown) {
	            console.log(jqXHR);
	            console.log(error);
	            console.log(errorThrown);
			});
	};
}

// can't seem to use--asynchronicity is ruining the world
function getUserAchievements(user) {
	console.log('user is ' + user);
	let achArray = [];
	$.getJSON('achievements', function(res) {
		for (let i=0; i<res.achievements.length; i++) {
			if (res.achievements[i].user === user) {
				achArray.push(res.achievements[i]);
			};
		};
	});
	console.log(achArray);
	return achArray;
}

function showSignInPage() {
	backToLandingPageToggle = true;
	$('#landing-page').hide();
	$('#account-signup-page').hide();
	$('#js-signin-link').hide();
	$('#js-delete-button').hide();
	$('#js-back-button').show();
	$('#signin-page').show();
}

function showAddPage() {
	$('*').scrollTop(0);
	$('#landing-page').hide();
	$('#account-signup-page').hide();
	$('#add-new-blurb').hide();
	$('#js-signin-link').hide();
	$('#js-signout-link').show();
	$('#account-setup-blurb').show();
	$('#account-setup-page').show();
}

function showHomePage() {
	$('#visuals').hide();
	$('#js-back-button').hide();
	$('#js-delete-button').hide();
	$('#account-setup-page').hide();
	$('#user-home-page').show();
}

function showTimeline() {
	console.log('running function showTimeline');
	backWarnToggle = false;
	console.log(backWarnToggle);
	$('#account-setup-page').hide();
	$('#user-home-page').hide();
	$('#js-delete-button').hide();
	$('#visual-how').hide();
	$('#visual-what').hide();
	$('#visual-why').hide();
	$('#js-back-button').show();
	$('#visuals').show();
	$('#visual-when').show();
	$.getJSON('/achievements', function (res) {
		let htmlContent = '';
		//console.log(getUserAchievements(user)[0]);
		//let testArray = getUserAchievements(user);
		for (let i=0; i<res.achievements.length; i++) {
			//console.log(testArray[i]);
			if (res.achievements[i].user === user) {
				let myUl = '<ul class="timeline-ul">';
				for (let j=0; j<res.achievements[i].achieveHow.length; j++) {
					myUl += `<li>${res.achievements[i].achieveHow[j]}</li>`;
				};
				myUl += '</ul>';
				htmlContent += `<div class="timeline-item" date-is="${res.achievements[i].achieveWhen}">
					<a href="#" class="js-get-achievement" id="${res.achievements[i]._id}"><h2>
					${res.achievements[i].achieveWhat}</h2></a>
					<p>${res.achievements[i].achieveWhy}</p>
					<p>It took: ${myUl}</div>`;	
				};			
		};
		$('.timeline-container').html(htmlContent);
	});
	// reset form back to empty
	document.getElementById('input-form').reset();
	// reset checkboxes back to unchecked
	$('input:checkbox').removeAttr('checked');
}

// Triggers
$(document).ready(function () {
	// when page first loads
	$('*').scrollTop(0);
	// backWarnToggle = false;
	backToLandingPageToggle = false;
	$('#signin-page').hide();
	$('#account-setup-page').hide();
	$('#user-home-page').hide();
	$('#visuals').hide();
	$('#js-signout-link').hide();
	$('#js-back-button').hide();
	$('#js-delete-button').hide();
	$('#landing-page').show();
	$('#account-signup-page').show();

// USER FLOW 1: USER SIGNS UP FOR NEW ACCOUNT
	document.getElementById('js-new-account').addEventListener('click', function(event) {
		const form = document.body.querySelector('#new-account-form');
		if (form.checkValidity && !form.checkValidity()) {
			console.log('validity has been checked');
			return;
		}
		const fname = $('input[name="fname"]').val();
		const uname = $('input[name="uname"]').val();
		const pw = $('input[name="pw"]').val();
		const confirmPw = $('input[name="confirm-pw"]').val();
		console.log('setting values');
		if (pw !== confirmPw) {
			event.preventDefault();
			alert('Passwords must match!');
		} else {
			event.preventDefault();
			const newUserObject = {
				username: uname,
				password: pw
			};
			// will assign a value to variable 'user' in signin step below
			// user = uname;
			// AJAX call to send form data up to server/DB and create new user
			$.ajax({
				type: 'POST',
				url: 'users/create',
				dataType: 'json',
				data: JSON.stringify(newUserObject),
				contentType: 'application/json'
			})
			.done(function (result) {
				event.preventDefault();
				newUserToggle = true;
				alert('Thanks for signing up! You may now sign in with your username and password.');
				showSignInPage();
				// $('#landing-page').hide();
				// $('#account-signup-page').hide();
				// $('#add-new-blurb').hide();
				// $('#js-signin-link').hide();
				// $('#js-signout-link').show();
				// $('#account-setup-blurb').show();
				// $('#account-setup-page').show();
			})
			.fail(function (jqXHR, error, errorThrown) {
	            console.log(jqXHR);
	            console.log(error);
	            console.log(errorThrown);
			});
		};
	});

	

// USER FLOW 2: USER WITH ACCOUNT SIGNS IN
// users signing up for new accounts should be routed into this flow to keep everything inside a single user flow
	// when user clicks sign-in link in header
	document.getElementById('js-signin-link').addEventListener('click', function(event) {
		event.preventDefault();
		showSignInPage();
		// backToLandingPageToggle = true;
		// $('#landing-page').hide();
		// $('#account-signup-page').hide();
		// $('#js-signin-link').hide();
		// $('#js-delete-button').hide();
		// $('#js-back-button').show();
		// $('#signin-page').show();
	});

	// when user clicks sign-in button from #signin-page
	// EVERYTHING MEATY GOES INSIDE HERE
	document.getElementById('js-signin-button').addEventListener('click', function(event) {
		event.preventDefault();
		backToLandingPageToggle = false;
		// AJAX call to validate login info and sign user in
		const inputUname = $('input[name="signin-uname"]').val();
		const inputPw = $('input[name="signin-pw"]').val();
		// check for spaces, empty, undefined
        if ((!inputUname) || (inputUname.length < 1) || (inputUname.indexOf(' ') > 0)) {
            alert('Invalid username');
        }
        else if ((!inputPw) || (inputPw.length < 1) || (inputPw.indexOf(' ') > 0)) {
            alert('Invalid password');
        } else {
            const unamePwObject = {
                username: inputUname,
                password: inputPw
	        };
	        user = inputUname;
	        $.ajax({
	        	type: "POST",
	                url: "/signin",
	                dataType: 'json',
	                data: JSON.stringify(unamePwObject),
	                contentType: 'application/json'
	            })
	            .done(function (result) {
	            	if (newUserToggle === true) {
	            		showAddPage();
	            	} else {
	            		$('#signin-page').hide();
		            	$('#js-back-button').hide();
		            	$('#js-delete-button').hide();
						$('#user-home-page').show();
						$('#js-signout-link').show();
	            	}
	        	})
	        	.fail(function (jqXHR, error, errorThrown) {
	                console.log(jqXHR);
	                console.log(error);
	                console.log(errorThrown);
	                alert('Invalid username and password combination. Pleae check your username and password and try again.');
	            });
		};

		// when user clicks Add Accomplishment button from #user-home-page
		document.getElementById('js-add-accomplishment').addEventListener('click', function(event) {
			event.preventDefault();
			console.log('user is ' + user);
			backWarnToggle = true;
			console.log(backWarnToggle);
			$('*').scrollTop(0);
			$("#datepicker").datepicker();
			// show and hide
			// if user already has achievements, show the add new blurb.
			// otherwise, show the account setup blurb
			//console.log('user is ' + user);
			//console.log(getUserAchievements(user));
			// if (typeof getUserAchievements(user) !== 'undefined' && getUserAchievements(user).length > 0) {
			// 	console.log(getUserAchievements(user) + ' will be shown');
			// } else {
			// 	console.log('will show account-setup-blurb');
			// }
			$('#user-home-page').hide();
			$('#account-setup-blurb').hide();
			$('#js-delete-button').hide();
			$('#add-new-blurb').show();
			$('#account-setup-page').show();
			$('#js-back-button').show();
		});

		// when user clicks I Did This button from #account-setup-page
		document.getElementById('js-submit-accomplishment').addEventListener('click', function(event) {
			console.log('user is ' + user);
			submitNewAccomplishment(user);
		});
	});

	// when user clicks sign-out link in header
	document.getElementById('js-signout-link').addEventListener('click', function(event) {
		location.reload();
	});

	

// when user clicks how/what/when/why links from home page
	// when user clicks WHY from home page
	document.getElementById('the-why').addEventListener('click', function(event) {
		$.getJSON('/achievements', function (res) {
			let htmlContent = '';
			for (let i=0; i<res.achievements.length; i++) {
				if (res.achievements[i].user === user) {
					if (res.achievements[i].achieveWhy !== undefined) {
						htmlContent += '<p>' + res.achievements[i].achieveWhy + '</p>';
					};
				};
			};
			$('#motivations').html(htmlContent);
		});
		$('#user-home-page').hide();
		$('#visual-how').hide();
		$('#visual-what').hide();
		$('#visual-when').hide();
		$('#visuals').show();
		$('#js-delete-button').hide();
		$('#js-back-button').show();
		$('#visual-why').show();
	});

	// when user clicks HOW from home page
	document.getElementById('the-how').addEventListener('click', function(event) {
		$.getJSON('/achievements', function (res) {
			let traitsObject = {};
			for (let i=0; i<res.achievements.length; i++) {
				// make sure to only get those belonging to the signed-in user
				if (res.achievements[i].user === user) {
					// need to loop through each res.achievements[i].achieveHow array and add up the total of each trait
					for (let j=0; j<res.achievements[i].achieveHow.length; j++) {
						if (res.achievements[i].achieveHow[j] in traitsObject) {
							// if the trait already exists in the object, increase its value by 1 (1 instance)
							traitsObject[res.achievements[i].achieveHow[j]] += 1;
						} else {
							// if the trait does not exist in the object already, add it with value of 1 (1 instance)
							traitsObject[res.achievements[i].achieveHow[j]]	= 1;
						};
					};
				};
			};
			console.log(traitsObject);
			console.log(Object.keys(traitsObject));
			let htmlContent = '';
			for (let i=0; i<Object.keys(traitsObject).length; i++) {
				// let the font size of each trait vary with number of instances; more instances = greater font size
				htmlContent += `<span class="size-${Object.values(traitsObject)[i]}"> ${Object.keys(traitsObject)[i].toLowerCase()} </span>`;
				console.log(Object.keys(traitsObject)[i].toLowerCase());
			}
			console.log(htmlContent);
			$('#traits').html(htmlContent);
			
		});
		$('#user-home-page').hide();
		$('#visual-why').hide();
		$('#visual-what').hide();
		$('#visual-when').hide();
		$('#js-delete-button').hide();
		$('#visuals').show();
		$('#js-back-button').show();
		$('#visual-how').show();
	});

	// when user clicks WHEN from home page
	document.getElementById('the-when').addEventListener('click', function(event) {
		console.log('clicked the when');
		event.preventDefault();
		showTimeline();

		// when user clicks on an achievement heading from the timeline, takes user to edit screen for that achievement
		$(document).on('click', '.js-get-achievement', function(event) {
			console.log('clicked js get achievement');
			event.preventDefault();
			editToggle = true;
			console.log(editToggle);
			console.log(event.target.parentNode.id);
			const achievementId = event.target.parentNode.id;
			// AJAX call to get the values of the achievement from the DB
			$.getJSON('/achievements/' + achievementId, function(res) {
				// set back warning toggle to true
				backWarnToggle = true;
				console.log(backWarnToggle);
				// add in pre-filled values based on achievement id
				$('#achieve-what').val(res.achieveWhat);
				$('#achieve-why').val(res.achieveWhy);
				// datepicker not currently working
				$("#datepicker").datepicker();
				// {
		  //       	numberOfMonths: 2,
		  //       	showButtonPanel: true
		  //   	}
				$('#datepicker').val(res.achieveWhen);
				// for loop
				for (let i=0; i<res.achieveHow.length; i++) {
					console.log(res.achieveHow[i]);
					$('input[value="' + res.achieveHow[i] + '"]').prop('checked', 'checked');
				}
			});
			// hide and show
			$('#visual-when').hide();
			$('#visuals').hide();
			$('#account-setup-blurb').hide();
			$('#add-new-blurb').hide();
			$('#add-details').hide();
			$('#account-setup-page > h2').hide();
			$('#js-back-button').show();
			$('#account-setup-page').show();
			$('#js-delete-button').show();
			// reset back warning and edit toggles to false
			backWarnToggle = false;
			console.log(backWarnToggle);
			// editToggle = false;
			console.log(editToggle + " is edit toggle");

			// when user clicks I Did This button from #account-setup-page
			document.getElementById('js-submit-accomplishment').addEventListener('click', function(event) {
				submitNewAccomplishment(user);
			});
			// when user clicks DELETE button from an edit screen
			// why is this executing twice?
			document.getElementById('js-delete-button').addEventListener('click', function(event) {
				event.preventDefault();
				if (confirm('Are you SURE you want to delete this awesome accomplishment? Your data will be PERMANENTLY erased.') === true) {
					$.ajax({
						method: 'DELETE',
						url: '/achievements/' + achievementId,
						success: showTimeline //some function
					});
				}
			});
		});
	});
		

	// when user clicks WHAT from home page
	document.getElementById('the-what').addEventListener('click', function(event) {
		$.getJSON('/achievements', function (res) {
			let htmlContent = '';
			for (let i=0; i<res.achievements.length; i++) {
				if (res.achievements[i].user === user) {
					if (res.achievements[i].achieveWhat !== undefined) {
						htmlContent += '<p>' + res.achievements[i].achieveWhat + '</p>';
					};
				};
			};
			$('#awesome-stuff').html(htmlContent);
		});
		$('#user-home-page').hide();
		$('#visual-how').hide();
		$('#visual-why').hide();
		$('#visual-when').hide();
		$('#js-delete-button').hide();
		$('#visuals').show();
		$('#js-back-button').show();
		$('#visual-what').show();
	});

	// when user clicks Back button from any of the visuals
	document.getElementById('js-back-button').addEventListener('click', function(event) {
		console.log('clicked js back button');
		if (backToLandingPageToggle === true) {
			location.reload();
		} else if (backWarnToggle === true) {
			event.preventDefault();
			if (confirm('Are you sure you want to go back? Your changes will not be saved.') == true) {
				showTimeline();
				backWarnToggle = false;
				console.log(backWarnToggle);
			}
		} else {
			showHomePage();
		};
	});
});

// TODO:
// add form validation for signin page
// fix ordering issues with timeline
// on signup page, focus on top of account setup page after signing up
// put buttons together in a line?
// make sure correct user is being sent (problems due to pre-filled?)
// user should be able to add their own skills/traits to checkbox list
// store dates as unix dates--how?
// add date display format selection capability
// add 'Oops, nothing here yet!' for empty achievement lists (new users)