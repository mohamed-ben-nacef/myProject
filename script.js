
$(document).ready(function() {
  var loginSection = $("#loginSection");
  var hiddenSection = $("#hiddenSection");
  var loginForm = $("#loginForm");
  var signupForm = $("#signupForm");
  var depositAmountInput = $("#depositAmount");
  var withdrawAmountInput = $("#withdrawAmount");
  var balanceSpan = $("#balance");
  var orderForm = $("#orderForm");
  var salesList = $("#salesList");

  loginForm.submit(function(event) {
    event.preventDefault();
    var email = $("#email").val();
    var password = $("#password").val();
    if (checkLoginCredentials(email, password)) {
      loginSection.hide();
      hiddenSection.show();
      $("#signupSection").hide();
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });

  signupForm.submit(function(event) {
    event.preventDefault();
    var name = $("#signupName").val();
    var email = $("#signupEmail").val();
    var password = $("#signupPassword").val();
    signUpUser(name, email, password);
    alert("Sign up successful! You can now log in .");
    $("#signupName, #signupEmail, #signupPassword").val("");
  });

  $("#logout").click(function(event) {
    event.preventDefault()
    localStorage.clear()
    loginSection.show();
    hiddenSection.hide();
    $("#signupSection").show()

    
  });


  function checkLoginCredentials(email, password) {
    var storedUser = localStorage.getItem("user");
    if (storedUser) {
      var user = JSON.parse(storedUser);
      return user.email === email && user.password === password;
    }
    return false;
  }

  function signUpUser(name, email, password) {
    var user = {
      name: name,
      email: email,
      password: password
    };
    localStorage.setItem("user", JSON.stringify(user));
  }

  function isLoggedIn() {
    return localStorage.getItem("user") !== null;
  }
  
  $("#depositBtn").click(function(event) {
    event.preventDefault();
    var depositAmount = parseFloat(depositAmountInput.val());
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
    var currentBalance = parseFloat(balanceSpan.text());
    var newBalance = currentBalance + depositAmount;
    updateBalance(newBalance);
    depositAmountInput.val("");
  });

  $("#withdrawBtn").click(function(event) {
    event.preventDefault();
    var withdrawAmount = parseFloat(withdrawAmountInput.val());
    var currentBalance = parseFloat(balanceSpan.text());
    if (isNaN(withdrawAmount) || withdrawAmount <= 0 || withdrawAmount > currentBalance) {
      alert("Please enter a valid withdraw amount.");
      return;
    }
    var newBalance = currentBalance - withdrawAmount;
    updateBalance(newBalance);
    withdrawAmountInput.val("");
  });

  orderForm.submit(function(event) {
    event.preventDefault();
    var name = $("#name").val();
    var flavor = $("#flavor").val();
    var quantity = parseInt($("#quantity").val());
    if (!name || !flavor || !quantity) {
      alert("Please fill in all the input");
      return;
    }
    var pricePerJelly = 1.5;
    var totalPrice = pricePerJelly * quantity;
    var currentBalance = parseFloat(balanceSpan.text());
    if (totalPrice > currentBalance) {
      alert("Insufficient balance. Please deposit more funds.");
      return;
    }
    var newBalance = currentBalance - totalPrice;
    updateBalance(newBalance);
    alert(`Thank you, ${name}! Your order has been placed. Total price: $${totalPrice.toFixed(2)}`);
    $("#name, #flavor, #quantity").val("");
    var orderDetails = `<li>Name: ${name} | Flavor: ${flavor} | Quantity: ${quantity} | Total Price: $${totalPrice.toFixed(2)}</li>`;
    updateSalesHistory(orderDetails);
  });

  

  function updateBalance(newBalance) {
    balanceSpan.text(newBalance.toFixed(2));
    localStorage.setItem("balance", newBalance.toFixed(2));
  }

  function updateSalesHistory(orderDetails) {
    var salesItem = $("<li>").html(orderDetails);
    salesList.append(salesItem);
    localStorage.setItem("salesHistory", salesList.html());
  }

  var storedBalance = localStorage.getItem("balance");
  balanceSpan.text(storedBalance ? parseFloat(storedBalance).toFixed(2) : "0.00");
  var storedSalesHistory = localStorage.getItem("salesHistory");
  if (storedSalesHistory) {
    salesList.html(storedSalesHistory);
  }
});
