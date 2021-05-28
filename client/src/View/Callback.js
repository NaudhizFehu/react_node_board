import React from "react";
import auth from "../Logic/Auth";

function Callback() {
  window.location.href.includes("access_token") && GetUser();

  function GetUser() {
    const location = window.location.href.split("=")[1]; //=을 기준으로 주소값을 나눔
    const token = location.split("&")[0]; //&를 기준으로 주소값을 나눔
    //분해한 주소값중 token값만 Authorization으로 묶는다(json방식)
    const header = {
      Authorization: token,
    };

    //해당주소는 이전기록으로 http://localhost:3000이 앞에 생략되어있음
    fetch("/user/naverlogin", {
      method: "get",
      headers: header,
    })
      //해당 통신이 정상적일경우
      .then((res) => res.json()) //전달받은 데이터를 json방식으로 가져온다
      .then((data) => {
        //데이터 내에 success가 true라면
        if (data.success === true) {
          alert(data.msg); //alert에 msg를 띄움
          auth.setAuth(data); //jwt인 auth에 data를 넣어줌
          window.location.href = "http://localhost:3000/"; //현재 window(브라우저)를 http://localhost:3000으로 이동시킴
        }
      })
      //해당 통신이 오류일경우
      .catch((err) => console.log("err : ", err)); //에러를 띄움
  }

  //메서드 Component return
  return <div id="naverIdLogin"></div>;
}

export default Callback;
