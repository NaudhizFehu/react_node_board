import React, { Component } from "react";

class LoginNaver extends Component {
  // 해당 Component 마운트(첫 접속)시 실행
  componentDidMount() {
    //Naver sdk import
    const naverScript = document.createElement("script");
    //해당 코드 개발당시 Naver sdk버전은 2.0.2
    naverScript.src =
      "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";
    //타입은 자바스크립트
    naverScript.type = "text/javascript";
    //html문서에서 head에 추가
    document.head.appendChild(naverScript);

    //Naver sdk 스크립트 로드 완료시
    naverScript.onload = () => {
      //window: 전역 | naver: 클래스 참조 변수 | loginWithNaverId: naver내의 메서드
      //해당코드는 위와같은 방식으로 이해하고있습니다
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: "bvalxhmZV3EXFcCRlxde", //본인이 발급받은 클라이언트ID
        callbackUrl: "http://localhost:3000/callback-naverlogin", //본인이 작성한 callbackURL
        callbackHandle: true, //callBack핸들러 사용여부
        isPopup: false, //로그인 팝업여부
        loginButton: {
          color: "green", //색상 (white, green)
          type: 1, //버튼타입 (1: 버튼형 | 2: 작은 배너 | 3: 큰 배너)
          height: 60, //배너 및 버튼 높이
        },
      });

      naverLogin.init(); //초기화
      naverLogin.logout(); //네이버 로그인이 계속 유지되는 경우가 있으므로 초기화시 로그아웃
      naverLogin.getLoginStatus((status) => {
        if (status) {
          console.log("Naver 로그인 상태", naverLogin.user);
          const { name, email, mobile } = naverLogin.user;

          //필수 제공 동의 조건
          if (name == undefined) {
            alert("이름은 필수 동의 입니다. 정보제공을 동의해주세요");
            naverLogin.reprompt();
            return;
          }
          if (email == undefined) {
            alert("이메일은 필수 동의 입니다. 정보제공을 동의해주세요");
            naverLogin.reprompt();
            return;
          }
          if (mobile == undefined) {
            alert("전화번호는 필수 동의 입니다. 정보제공을 동의해주세요");
            naverLogin.reprompt();
            return;
          }
        } else {
          console.log("Naver 비 로그인 상태");
        }
      });
    };
  }

  //하단 랜더링 코드 필수(id는 naverIdLogin으로 적을 것)
  render() {
    return <div id="naverIdLogin"></div>;
  }
}
export default LoginNaver;
