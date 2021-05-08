module.exports = {
  //변조가 불가능하도록 secret을 사용
  //production : 배포모드 | development : 개발자모드
  secret:
    process.env.NODE_ENV === "production" ? process.env.SECRET : "not secret",
  db: {
    user: "DEV4_06",
    password: "DEV4_06",
    connectSttring: "localhost/orcl",
  },
};
