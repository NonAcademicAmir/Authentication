console.log("FRONTEND JS IS CONNECTED")
const mainButton = document.querySelector("[mainButton]")

//mainButton is our signup or login button
mainButton.addEventListener("click", function (e) {
  //By using prevent default method, we are preventing the page from getting refreshed.
  e.preventDefault()
  if (e.target.attributes.mainButton.value === "login") {
    var selectSignType = "login"
  } else if (e.target.attributes.mainButton.value === "signup") {
    var selectSignType = "signup"
  } else {
    //This statment will run when it is not possible to detect either user is trying to signup or login
    //Pay attention to the type of the request
    $.ajax({
      type: "GET",
      url: "/",
      data: {},
      success: function (result) {
        console.log(result)
      },
      dataType: "json",
    })
  }

  //By considering that user have clicked on the main button, we need to send a post request to the server side
  if (
    validateEmail(document.querySelector("#typeEmailX").value) &&
    valdiatePass(document.querySelector("#typePasswordX").value)
  ) {
    $.ajax({
      type: "POST",
      url: "/sign",
      data: {
        email: document.querySelector("#typeEmailX").value,
        password: document.querySelector("#typePasswordX").value,
        type: selectSignType,
      },
      success: function (result) {
        console.log(result)
      },
      dataType: "json",

      //Considering that sending post is done, we need to run complete method and check if the respond is ok or not, if it is ok, loging in or signing up was succeful, otherwise something is wrong
      complete: function (res) {
        console.log(res)
        const selectingHeader = document.querySelector("#mainHTwo")
        if (res.status !== 200) {
          window.alert(res.responseText)
          selectingHeader.innerHTML = "Try Again"
          selectingHeader.style.color = "red"
        } else {
          selectingHeader.innerHTML = "Done"
          selectingHeader.style.color = "green"
        }
        console.log(res.responseText)
      },
    })
  } else {
  }
})

//validateEmail and validatePass are used to check if email and password meets the minimum requirements of a correct email and safe password
function validateEmail(email) {
  // return true
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (email.match(validRegex)) {
    return true
  } else {
    //we will show an alert to the user, so the user can change the email address
    //As this function will return false in this statement, sending post request to the server side won't happen till user changes the email
    alert("Invalid email address!")
    return false
  }
}
function valdiatePass(pass) {
  // return true
  var regularExpression =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  if (regularExpression.test(pass)) {
    return true
  } else {
    //As this function will return false in this statement, sending post request to the server side won't happen till user changes the entered weak password
    alert(
      "In order to protect your account better, all of our saved passwords are strong which means at least 8 letter password, with at least a symbol, upper and lower case letters and at least a number",
    )
    return false
  }
}
