$(document).ready(function () {
  $("body").on("click", function (e) {
    if ($(e.target).closest(".box-profile").length > 0) {
      $(".dropdown").toggle();
    } else {
      $(".dropdown").hide();
    }
  });

  //handle sign up

  $("#btn-signup").on("click", function (e) {
    e.preventDefault();
    const email = $('#form-register input[name="email"]').val().trim();
    const password = $('#form-register input[name="password"]').val().trim();
    const userName = $('#form-register input[name="userName"]').val().trim();
    const confirmPassword = $('#form-register input[name="confirmPassword"]')
      .val()
      .trim();
    $.ajax({
      url: "/register",
      method: "POST",
      data: {
        email: email,
        password: password,
        userName: userName,
        confirmPassword: confirmPassword,
      },
      success: function (data) {
        $("#form-register .success").show();
        $("#form-register .success").text(data.responseJSON.message);
      },
      error: function (error) {
        $("#form-register .error").show();
        $("#form-register .error").text(error.responseJSON.message);
      },
    });
  });

  // handle sign in
  $("#btn-login").on("click", function (e) {
    e.preventDefault();
    const email = $('#form-login input[name="email"]').val();
    const password = $('#form-login input[name="password"]').val();
    $.ajax({
      url: "/login",
      method: "POST",
      data: {
        email: email,
        password: password,
      },
      success: function (data) {
        window.location.replace("/");
      },
      error: function (error) {
        $("#form-login .error").show();
        $("#form-login .error").text(error.responseJSON.message);
      },
    });
  });

  $("#btn-add-comment").on("click", function (event) {
    const content = $("#input-comment").val();
    const blogId = $(this).closest(".wrapper-blog").attr("id");
    $.ajax({
      url: "/comments",
      method: "POST",
      data: {
        content: content,
        blog_id: blogId,
      },
      success: function (data) {
        alert(data.responseJSON.message);
      },
      error: function (error) {
        alert(error.responseJSON.message);
      },
    });
  });

  // $('btn-update-profile').on('click', function (e) {
  //   const userName = $('.container-friend input[name="userName"]').val();
  //   const birthDay = $('.container-friend input[name="birthDay"]').val();
  //   const phone = $('.container-friend input[name="phone"]').val();
  //   const address = $('.container-friend input[name="address"]').val();
  //   const work = $('.container-friend input[name="work"]').val();
  //   const school = $('.container-friend input[name="school"]').val();
  //   const company = $('.container-friend input[name="company"]').val();
  //   const hobby = $('.container-friend input[name="hobby"]').val();
  //   const gifted = $('.container-friend input[name="gifted"]').val();

  //   $.ajax({
  //     url: '/profile',
  //     method: 'POST',
  //     data: {
  //       userName: userName,
  //       birthDay: birthDay,
  //       phone: phone,
  //       address: address,
  //       work: work,
  //       school: school,
  //       company: company,
  //       hobby: hobby,
  //       gifted: gifted,
  //     },
  //     success: function(){

  //     },
  //     error: function(){}
  //   })
  // });
  $("#open-popup").on("click", function (e) {
    e.preventDefault();
    $(".wrapper-popup-blog").show();
  });

  $("#close-popup").on("click", function () {
    $(".wrapper-popup-blog").hide();
  });
});

function openProfileByUser(userId) {
  fetch(`/profile/${userId}`, { method: "GET" }).then(() => {
    window.location.replace(`/profile/${userId}`);
  });
}

function redirectLogin(key) {
  if (key === "LOGIN") {
    fetch("/login", { method: "GET" }).then(() => {
      window.location.replace("/login");
    });
  } else {
    fetch("/register", { method: "GET" }).then(() => {
      window.location.replace("/register");
    });
  }
}

function handleEditProfile() {
  $(".box-button").toggle();
  $(".input-edit").toggle();
  $(".button-edit-profile").toggle();
  $(".value-profile").toggle();
}
