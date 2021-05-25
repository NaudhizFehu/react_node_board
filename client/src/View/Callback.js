import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router";
import auth from "../Logic/Auth";

function Callback() {
  window.location.href.includes("access_token") && GetUser();

  function GetUser() {
    const location = window.location.href.split("=")[1];
    const token = location.split("&")[0];
    const header = {
      Authorization: token,
    };

    //해당주소는 이전기록으로 http://127.0.0.1:3000이 앞에 생략되어있음
    fetch("/user/naverlogin", {
      method: "get",
      headers: header,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          alert(data.msg);
          auth.setAuth(data);
          window.location.href = "http://localhost:3000/";
        }
        useHistory.push("/");
      })
      .catch((err) => console.log("err : ", err));
  }

  return <div id="naverIdLogin"></div>;
}

export default Callback;
