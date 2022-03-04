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

  $(".btn-add-comment").on("click", function (event) {
    const content = $(this).siblings("input").val();
    const blogId = $(this).closest(".wrapper-blog").attr("id");
    $.ajax({
      url: "/comments",
      method: "POST",
      data: {
        content: content,
        blog_id: blogId,
      },
      success: function (data) {
        alert(data.message);
      },
      error: function (error) {
        alert(error.message);
      },
    });
  });

  $("#open-popup").on("click", function (e) {
    e.preventDefault();
    const token = document.cookie;
    if (!token) {
      alert("Bạn cần đăng nhập trước khi đăng blog!");
    } else {
      $(".wrapper-popup-blog").show();
    }
  });

  $("#close-popup, #close-popup-edit").on("click", function () {
    $(".wrapper-popup-blog").hide();
    $(".wrapper-popup-blog-edit").hide();
  });

  $(".chose-file button").on("click", function (e) {
    e.preventDefault();
    $('input[name="imageBlog"]')[0].click();
  });

  $(".chose-file-edit button").on("click", function (e) {
    e.preventDefault();
    $(this).siblings('input[name="imageBlogEdit"]')[0].click();
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
  $(".btn-add-file-image").toggle();
}

function editBlog(id_blog) {
  const content = $(`div[name="${id_blog}"] textarea`).val();
  $.ajax({
    url: `/blog/${id_blog}`,
    method: "PUT",
    data: {
      content: content,
    },
    success: function (data) {
      $(".wrapper-popup-blog-edit").hide();
      $(`#${id_blog}`).find(".blog-decriptions").html(content);
      alert(data.message);
    },
    error: function (error) {
      alert(error.message);
    },
  });
}

const openPopupEdit = (id) => {
  $(`#${id}`).find(".wrapper-popup-blog-edit").show();
  const content = $(`#${id}`).find(".blog-decriptions").text();
  $(`#${id}`).find(".wrapper-popup-blog-edit textarea").val(content);
  $(`#${id}`).find(".wrapper-popup-blog-edit textarea").focus();
};

const deleteBlog = (id_blog) => {
  const path = window.location.pathname;
  $.ajax({
    url: `/blog/${id_blog}`,
    method: "DELETE",
    success: function (data) {
      $(".wrapper-blog").each(function (_, node) {
        $(node).attr("id") === id_blog && $(node).remove();
      });
      alert(data.message);
    },
    error: function (error) {
      alert(error.message);
    },
  });
};

function uploadImage() {
  $('input[name="avatar"]')[0].click();
}
