import React, { Component } from "react";
import axios from "axios";
import auth from "../Logic/Auth";

class LoginKakao extends Component {
  //해당 Component 마운트시 실행
  componentDidMount() {
    //Kakao sdk import
    const kakaoScript = document.createElement("script");
    kakaoScript.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    document.head.appendChild(kakaoScript);

    //Kakao sdk 스크립트 로드 완료시
    kakaoScript.onload = () => {
      //Kakao API KEY(JavaScript Key: 해당 페이지로 정보를 가져옴)
      window.Kakao.init("4c6c89ef06279b45fa3123d4d1add562");
      window.Kakao.Auth.createLoginButton({
        container: "#kakao-login-btn",
        size: "small",
        success: (user) => {
          console.log("Kakao 사용자 정보(load)", user);
          //Kakao 로그인 성공시, 사용자정보 API 호출
          window.Kakao.API.request({
            url: "/v2/user/me",
            success: (res) => {
              console.log("Kakao 사용자 정보(login)", res);
              console.log("nickname: " + res.kakao_account.profile.nickname);

              const email = res.kakao_account.email;
              const name = res.kakao_account.profile.nickname;

              this.joinAndLogin(email, name);
            },
            fail: (err) => {
              console.log(err);
            },
          });
        },
        fail: (err) => {
          console.log(err);
        },
      });
    };
  }

  joinAndLogin = async (email, name) => {
    console.log("email: " + email + " | name: " + name);

    axios
      .post("/user/kakaologin", { email, name })
      .then((res) => {
        console.log("name : " + res.data.name);
        if (res.data.success === true) {
          alert(res.data.msg); //alert에 msg를 띄움
          auth.setAuth(res.data); //jwt인 auth에 data를 넣어줌
          window.location.href = "http://localhost:3000/"; //현재 window(브라우저)를 http://localhost:3000으로 이동시킴
        }
      })
      .catch((err) => alert(err.response.data.msg));
  };

  render() {
    return (
      <button
        type="button"
        id="kakao-login-btn"
        className="socialLoginBtn"
      ></button>
    );
  }
}

export default LoginKakao;
