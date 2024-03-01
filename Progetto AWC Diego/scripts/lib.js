// Validation
function email_valid(email){
    const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email_regex.test(email);
}

function password_valid(password){
    const pass_regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return pass_regex.test(password);
}

function birth_date_valid(birth_date){
    if (birth_date == null || birth_date == "")
        return true; // birthday is not required

    let year = parseInt(birth_date.slice(0,4));
    let month = parseInt(birth_date.slice(5,7));
    let day = parseInt(birth_date.slice(8,10));
    let current_date = new Date();
    let current_year = current_date.getFullYear();
    let current_month = current_date.getMonth() + 1;
    let current_day = current_date.getDate();

    if (year > current_year || (year == current_year && month > current_month) || (year == current_year && month == current_month && day > current_day))
        return false;

    return true;
}
//

// Display
function show_items(ids, list_number) {

    // Show hide results based on whether there are
    if (ids == null){
        document.getElementsByClassName("no_results_alert")[0].classList.remove("d-none"); // show no result paragraph if there aren't results
        document.getElementById('list'+list_number).classList.add("d-none");    // hide results if there aren't
        return null;
    }else{
        document.getElementsByClassName("no_results_alert")[0].classList.add("d-none");    // hide no result paragraph if there aren't results
        document.getElementById('list'+list_number).classList.remove("d-none"); // show results if there are
    }
    //

    // find the stored meals
    let meals_stored = JSON.parse(localStorage.getItem('meals'));
    let items = ids;

    // it keeps the order of the ids given
    for (meal of meals_stored) 
        for (id of ids)
            if (id == meal.idMeal)
                items.splice(ids.indexOf(id), 1, meal);
    //

    // show the stored meals
    let list = document.getElementById('list'+list_number);
    let master = document.getElementById('master'+list_number);
    list.innerHTML = "";
    list.appendChild(master);
    for (var i = 0; i < items.length; i++) {
        var clone = master.cloneNode(true);
        clone.id = 'card-meal-' + i;
        clone.getElementsByClassName('card-title')[0].innerHTML = items[i].strMeal;
        print_stars(clone.getElementsByClassName('card-date')[0], false, true, items[i].idMeal);
        clone.getElementsByClassName('card-img-top')[0].src = items[i].strMealThumb;
        clone.getElementsByClassName('card-img-top-link')[0].href = "meal_details.html?idMeal=" + items[i].idMeal;
        clone.getElementsByClassName('card-title-link')[0].href = "meal_details.html?idMeal=" + items[i].idMeal;

        list.appendChild(clone);
        clone.classList.remove('d-none');
    }
    //
}
//

// Review System
function print_stars(element, interactive = false, fill=false, meal_id = null, user = null, operation = "average"){
    let to_inner = "";
    let icon = "star.svg";
    let meals = JSON.parse(localStorage.getItem("meals"));
    let [taste_value, simplicity_value] = [];

    if (fill && meal_id == null)
        console.log("fill is true but meal_id is null! set meal_id of print_stars function");

    //set interactiveness if requested
    let interactive_ability = '';
    if (interactive)
        interactive_ability = 'onmouseover="star_over(this)" onmouseout="star_out(this)" onclick="star_click(this)"';
    //

    // assign taste and simplicity values if operation is average
    if (fill && operation == "average")
        for (meal of meals) // for each meal
            if (meal.idMeal == meal_id) // if its the right meal
                [taste_value, simplicity_value] = get_average_grades_review(meal_id);
    //

    // assign taste and simplicity values if operation is average
    if (fill && operation == null)
        for (meal of meals) // for each meal
            if (meal.idMeal == meal_id) // if its the right meal
                [taste_value, simplicity_value] = get_grades_review(meal_id, user);
    //

    // print 5 taste stars
    to_inner += '<div class="row mb-3"> <label for="stars-rating-taste" class="form-label">Taste ';
    if (fill && operation == "average")
        if (taste_value > 0)
            to_inner += "(" + taste_value + "/5)";
        else
            to_inner += "(No reviews yet)";
    to_inner += '</label> <div class="container form-control" id="stars-rating-taste">';
    for (i=1; i<=5; i++){
        // fill the star
        if (taste_value != null && i <= taste_value)
            icon = "star-fill.svg";
        else
            icon = "star.svg";
        //
        to_inner += '<img src="../media/icons/' + icon + '" class="taste-star img-fluid" data-star-value="' + i + '" alt="Star Icon" width="20" height="20"' + interactive_ability + '>';
    }
    to_inner += '</div> </div>';
    //

    // print 5 simplicity stars
    to_inner += '<div class="row mb-3"> <label for="stars_rating_simplicity" class="form-label">Simplicity ';
    if (fill && operation == "average")
        if (simplicity_value > 0)
            to_inner += "(" + simplicity_value + "/5)";
        else
            to_inner += "(No reviews yet)";
    to_inner += '</label> <div class="container form-control" id="stars-rating-simplicity">';
    for (i=1; i<=5; i++){
        // fill the star
        if (simplicity_value != null && i <= simplicity_value)
            icon = "star-fill.svg";
        else
            icon = "star.svg";
        //
        to_inner += '<img src="../media/icons/' + icon + '" class="simplicity-star img-fluid" data-star-value="' + i + '" alt="Star Icon" width="20" height="20"' + interactive_ability + '>';
    }
    to_inner += '</div> </div>';
    //

    element.innerHTML = to_inner;
}

function star_over(star){
    let vote = star.dataset.starValue;
    let topic = star.classList[0];

    for (let i=0; i<vote; i++)
        if (topic == "taste-star")
            document.getElementsByClassName("taste-star")[i].src = "../media/icons/star-fill.svg";
        else if (topic == "simplicity-star")
            document.getElementsByClassName("simplicity-star")[i].src = "../media/icons/star-fill.svg";
}

function star_out(star){
    let vote_taste = document.getElementById("vote-taste");
    let vote_simplicity = document.getElementById("vote-simplicity");
    let vote = star.dataset.starValue;
    let topic = star.classList[0];

    for (let i=0; i<5; i++){
        if (topic == "taste-star"){
            if (i >= vote_taste.value)
                document.getElementsByClassName("taste-star")[i].src = "../media/icons/star.svg";
        }
        if (topic == "simplicity-star"){
            if (i >= vote_simplicity.value)
                document.getElementsByClassName("simplicity-star")[i].src = "../media/icons/star.svg";
        }
    }
}

function star_click(star){
    let vote_taste = document.getElementById("vote-taste");
    let vote_simplicity = document.getElementById("vote-simplicity");
    let vote = star.dataset.starValue;
    let topic = star.classList[0];

    if (topic == "taste-star"){
        if (vote_taste.value == vote){ // if click on already selected taste star reset them
            for (let i=0; i<5; i++)
                document.getElementsByClassName("taste-star")[i].src = "../media/icons/star.svg";
            vote_taste.value = null;
        }else{
            vote_taste.value = vote;   
        }
        
    }
    else{
        if (vote_simplicity.value == vote){ // if click on already selected simplicity star reset them
            for (let i=0; i<5; i++)
                document.getElementsByClassName("simplicity-star")[i].src = "../media/icons/star.svg";
            vote_simplicity.value = null;
        } else {
            vote_simplicity.value = vote;
        }
    }

    star_out(star);
}

function get_average_grades_review(meal_id){
    let meals_stored = JSON.parse(localStorage.getItem("meals"));
    let taste_sum = 0;
    let simplicity_sum = 0;
    let count = 0;

    for (meal of meals_stored)
        if(meal.idMeal == meal_id)
            for (review of meal.reviews){
                taste_sum += review.taste;
                simplicity_sum += review.simplicity;
                count += 1;
            }

    taste_avg = taste_sum/count;
    simplicity_avg = simplicity_sum/count;

    return [taste_avg.toFixed(1), simplicity_avg.toFixed(1)];
}

function get_grades_review(meal_id, user){
    let meals_stored = JSON.parse(localStorage.getItem("meals"));
    let taste_value = 0;
    let simplicity_value =0;

    if (user == null){
        console.error("user is missing, can't get the review grades!");
        return null;
    }

    for (meal of meals_stored)
        if(meal.idMeal == meal_id) // access the right meal
            for (review of meal.reviews) // for every review
                if (user == review.user){ // access the right review
                    taste_value = review.taste;
                    simplicity_value = review.simplicity;
                }

    return [taste_value, simplicity_value];
}

function delete_review(user, meal_id){
    console.log(user);
    console.log(meal_id);
    let meals_stored = JSON.parse(localStorage.getItem("meals"));

    for (meal of meals_stored)
        if(meal.idMeal == meal_id)
            for (let i=0; i<meal.reviews.length; i++)
                if (meal.reviews[i].user == user)
                    meal.reviews.splice(i, 1);

    localStorage.setItem("meals", JSON.stringify(meals_stored));
    alert("Review deleted successfully!")
    window.location.reload();
}
//